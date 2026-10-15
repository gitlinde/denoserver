import { unescape } from "jsr:@std/internal@^1.0.14/diff-str";
import sanitizeFileName from "sanitize-filename"
import { fileTypeFromFile, fileTypeFromBuffer, FileTypeResult } from "file-type"
import { dir } from "node:console";

// AI SECURITY REVIEW
// 3. File Overwrite (Data Loss / Tampering)
// Severity: Medium
// If User A uploads an image named avatar.png, and User B uploads an image also named avatar.png,
// User B's file will overwrite User A's file. An attacker could intentionally upload malicious/inappropriate
// images using common names (like profile.jpg, image.png) to overwrite legitimate user files on your server.
// The Fix: Always generate unique identifiers for file uploads. You can prepend a UUID or a timestamp to the sanitized file name.

// 4. Polyglot Files / XSS (Future Risk)
// Severity: Medium
// While file-type is great, it only checks the beginning of a file (the "magic bytes").
// It is trivially easy to create a "Polyglot" file—a file that starts with the valid headers of a GIF (satisfying file-type), but contains a malicious HTML/JavaScript payload in the body.
// If you later serve these files directly from your server and a browser accesses them, the browser might get confused and execute the JavaScript, resulting in Cross-Site Scripting (XSS).
// The Fix: When you build the route to serve these files, ensure you strictly enforce the Content-Type header and always include X-Content-Type-Options: nosniff.

// global constants
const saveDirectory = "./saved";
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

function firstLetterToLowerCase(string:string) {
    if(string.length > 0) {
        return string[0].toLocaleLowerCase() + string.slice(1,string.length)
    }
    return "";
}

if (import.meta.main) {
    Deno.serve(fileHandler);
}

export async function fileHandler(req: Request): Promise<Response> {
    if(req.method !== "POST" ) {
        const responseOptions: ResponseInit = {
            headers: {
                "Content-Type": "text/html"
            }
        }

        const inputForm = `
            <form method="POST" enctype="multipart/form-data">
                <input name="file" type="file" />
                <button type="submit">Upload</button>
            </form>
        `;

        // return new Response("Waiting for your file, king", responseOptions);
        return new Response(inputForm, responseOptions);
        // return new Response("NOT A POST",  {status: 405})
    }

    // A BUNCH OF GUARD CLAUSES COZ IM IN LOVE
    const formData: FormData = await req.formData();
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

    // impossible not to repeat yourself since there is no good name for this variable
    const mimeType = fileType.mime.split("/")[0];
    const mimeSubtype = fileType.mime.split("/")[1];

    switch(mimeType) {
        // Kinda nasty coz i want images like png+jpg in one folder, all videos like mp3, mov in one folder, but also GIFs in one folder, so i must
        case "image": return mimeSubtype === "gif" ? mimeSubtype : mimeType;
        case "video": return mimeType;
        default: return false;
    }
}
