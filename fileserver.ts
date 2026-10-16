import sanitizeFileName from "sanitize-filename"
import { fileTypeFromBuffer, FileTypeResult } from "file-type"
import { writeGeneratedHtmlToDisk } from "./fileviewer.ts"
import { timingSafeEqual } from "jsr:@std/crypto/timing-safe-equal";
import { FILE_SERVER_PASSWORD, safeCompare } from "./password.ts";

// AI security check
// 4. Polyglot Files / XSS (Future Risk)
// Severity: Medium
// While file-type is great, it only checks the beginning of a file (the "magic bytes").
// It is trivially easy to create a "Polyglot" file—a file that starts with the valid headers of a GIF (satisfying file-type), but contains a malicious HTML/JavaScript payload in the body.
// If you later serve these files directly from your server and a browser accesses them, the browser might get confused and execute the JavaScript, resulting in Cross-Site Scripting (XSS).
// The Fix: When you build the route to serve these files, ensure you strictly enforce the Content-Type header and always include X-Content-Type-Options: nosniff.

// interfaces for now
interface Bucket {
    tokens: number;
    last: number;
}

const saveDirectory = "./saved";
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const REFRESH_RATE = 2;
const MAX_REQUESTS = 20;
const buckets = new Map<string, Bucket>;

init();
function init() {

    const cleanBucketMemory = setInterval(() => {
        const cutoff = Date.now() - (REFRESH_RATE * 1000) * MAX_REQUESTS;
        for(const [ip, bucket] of buckets) {
            if(bucket.last <= cutoff) {
                buckets.delete(ip);
            }
        }

    }, 30_000)
    Deno.unrefTimer(cleanBucketMemory);

    if (import.meta.main) {
        Deno.serve(fileHandler);
    }
}

// im not proud of this function but i couldn't focus idk
// heavy inspiration and better code: https://docs.deno.com/examples/http_server_rate_limit/
// i just wanted to write my own for fun
// TODO refactor to use min + have more early returns
function take(ip: string) {
    const now = Date.now();
    const bucket = buckets.get(ip) ?? { tokens: MAX_REQUESTS, last: now }
    buckets.set(ip, bucket);
    // console.log("CURRENT TOKENS AT CALL: " + bucket.tokens)

    const timeElapsed = now - bucket.last;
    const newRequests = Math.floor((timeElapsed / REFRESH_RATE) / 1000)
    // const newRequests = Math.floor(timeElapsed/1000 % REFRESH_RATE * 1000);
    // console.log(`Time elapsed: ${timeElapsed}\n newRequests:${newRequests}`)

    // Math.min(MAX_REQUESTS, bucket.tokens + newRequests)
    // ^ something like this is genius

    // i dont really need this if i have an interval to remove buckets tbh
    if(newRequests >= MAX_REQUESTS) {
        // console.log("newrequests >= max, setting requests to 5")
        bucket.tokens = MAX_REQUESTS - 1; // spend one request
        bucket.last = now;
        return true;
    }

    if(bucket.tokens > 0) {
        bucket.tokens += newRequests - 1; // spend one request
        bucket.last = now;
        // console.log("Used one token!" + bucket.tokens)
        return true;
    }

    bucket.last = now; // cruel but deserved for spam
    return false;
}

// Deno.serve((req, info) => {
//     info.remoteAddr.
// })
// Deno.serve(takeHandler);

function takeHandler(req: Request) {
    if(req.method !== "POST" ) {
        const responseOptions: ResponseInit = {
            headers: {
                "Content-Type": "text/html",
            }
        }

        const inputForm = `
            <form method="POST" enctype="multipart/form-data">
                <input name="password" type="text"/>
                <button type="submit">Upload</button>
            </form>
        `;
        // return new Response("Waiting for your file, king", responseOptions);
        return new Response(inputForm, responseOptions);
        // return new Response("NOT A POST",  {status: 405})
    }
    if(take("Vind")) {
        return new Response("YE",  {status: 200})
    } else {
        return new Response("NUH",  {status: 400})
    }
}


function firstLetterToLowerCase(string:string) {
    if(string.length > 0) {
        return string[0].toLocaleLowerCase() + string.slice(1,string.length)
    }
    return "";
}


export async function fileHandler(req: Request, info: Deno.ServeHandlerInfo): Promise<Response> {
    const clientNetAddr = info.remoteAddr as Deno.NetAddr
    const clientIp = clientNetAddr.hostname;
    console.log(`${clientIp} connected`);

    if(!take(clientIp)) {
        return new Response("Too many requests", { status: 429 })
    }

    if(req.method !== "POST" ) {
        const responseOptions: ResponseInit = {
            headers: {
                "Content-Type": "text/html",
            }
        }

        const inputForm = `
            <form method="POST" enctype="multipart/form-data">
                <input name="file" type="file" />
                <input name="password" type="password"/>
                <button type="submit">Upload</button>
            </form>
        `;
        // return new Response("Waiting for your file, king", responseOptions);
        return new Response(inputForm, responseOptions);
        // return new Response("NOT A POST",  {status: 405})
    }

    // A BUNCH OF GUARD CLAUSES COZ IM IN LOVE
    const formData: FormData = await req.formData();

    const clientPassword = formData.get("password")?.toString() ?? "";
    if(!await safeCompare(clientPassword, FILE_SERVER_PASSWORD) ) {
        return new Response("incorrect password",  { status: 401 })
    }

    // as File is unsafe i think
    const file: File | null = formData?.get("file") as File;
    if(!file) return new Response("File required but not provided.", { status: 400 });
    if(file.size > MAX_FILE_SIZE) return new Response(`File exceeds ${MAX_FILE_SIZE / 1024 / 1024}mb limit.`, { status: 413 });
    // only check 4100 bytes header as in the unicornHeader example https://www.npmjs.com/package/file-type
    // i do wonder if this optimization is risky 👀
    const fileHeader = await file.slice(0,4100).arrayBuffer();
    const mimeFilePath = await getMimeFilePath(fileHeader);
    if(mimeFilePath === false) return new Response("File type not supported", {status: 400});
    const sanitizedFileName = firstLetterToLowerCase(sanitizeFileName(file.name));
    if(sanitizedFileName === "") return new Response("Empty file name", { status: 400 });

    {   // WRITE FILE TO DISK
        // ensures the directory exists before write
        Deno.mkdirSync(`${saveDirectory}/${mimeFilePath}`, { recursive: true})

        const sanitizedFilePath = saveDirectory.concat(...["/",mimeFilePath,"/",sanitizedFileName]);

        const fileOnDisk = await Deno.create(sanitizedFilePath); // is it better to use the property of the sanitizedFile or use sanitizedFileName?
        const fileWriter = fileOnDisk.writable.getWriter();

        // we can safely write the bytes since we have checked the file type i think
        const bytes = await file.bytes();
        await fileWriter.write(bytes);
        await fileWriter.close();

        return new Response(`Wrote ${sanitizedFileName} in ${sanitizedFilePath} with ${bytes.length} bytes`, {status: 200})
    }
}

/** is there a better name for this function? */
async function getMimeFilePath(buffer: ArrayBuffer): Promise<string | false> {   // DETECT FILE TYPES (should be done as early as possible)
    // const fileType: FileTypeResult | undefined = (await fileTypeFromBuffer(await file.bytes()))
    const fileType: FileTypeResult | undefined = await fileTypeFromBuffer(buffer);
    if(fileType === undefined) return false;

    // i think i'll do this to easily put in the mime file type in html
    return fileType.mime;

    // impossible not to repeat yourself since there is no good name for this variable
//     const mimeType = fileType.mime.split("/")[0];
//     const mimeSubtype = fileType.mime.split("/")[1];
//
//     switch(mimeType) {
//         // Kinda nasty coz i want images like png+jpg in one folder, all videos like mp3, mov in one folder, but also GIFs in one folder, so i must
//         case "image": return mimeSubtype === "gif" ? mimeSubtype : mimeType;
//         case "video": return mimeType;
//         default: return false;
//     }
}
