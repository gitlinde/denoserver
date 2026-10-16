import sanitizeFileName from "sanitize-filename";
import { fileTypeFromBuffer } from "file-type";
import { writeGeneratedHtmlToDisk } from "./fileviewer.ts";
import { FILE_SERVER_PASSWORD, safeCompare } from "./password.ts";
import { serveDir } from "jsr:@std/http/file-server";
const saveDirectory = "./saved";
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const REFRESH_RATE = 4;
const MAX_REQUESTS = 5;
const buckets = new Map;
await init();
async function init() {
  await writeGeneratedHtmlToDisk();
  const cleanBucketMemory = setInterval(()=>{
    const cutoff = Date.now() - REFRESH_RATE * 1000 * MAX_REQUESTS;
    for (const [ip, bucket] of buckets){
      if (bucket.last <= cutoff) {
        buckets.delete(ip);
      }
    }
  }, 30_000);
  Deno.unrefTimer(cleanBucketMemory);
  if (import.meta.main) {
    Deno.serve(fileHandler);
  }
}
// im not proud of this function but i couldn't focus idk
// heavy inspiration and better code: https://docs.deno.com/examples/http_server_rate_limit/
// i just wanted to write my own for fun
// TODO refactor to use min + have more early returns
function take(ip) {
  const now = Date.now();
  const bucket = buckets.get(ip) ?? {
    tokens: MAX_REQUESTS,
    last: now
  };
  buckets.set(ip, bucket);
  console.log("CURRENT TOKENS AT CALL: " + bucket.tokens);
  const timeElapsed = now - bucket.last;
  const newRequests = Math.floor(timeElapsed / REFRESH_RATE / 1000);
  // const newRequests = Math.floor(timeElapsed/1000 % REFRESH_RATE * 1000);
  // console.log(`Time elapsed: ${timeElapsed}\n newRequests:${newRequests}`)
  // Math.min(MAX_REQUESTS, bucket.tokens + newRequests)
  // ^ something like this is genius
  // i dont really need this if i have an interval to remove buckets tbh
  if (newRequests >= MAX_REQUESTS) {
    // console.log("newrequests >= max, setting requests to 5")
    bucket.tokens = MAX_REQUESTS - 1; // spend one request
    bucket.last = now;
    return true;
  }
  if (bucket.tokens > 0) {
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
function takeHandler(req) {
  if (req.method !== "POST") {
    const responseOptions = {
      headers: {
        "Content-Type": "text/html"
      }
    };
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
  if (take("Vind")) {
    return new Response("YE", {
      status: 200
    });
  } else {
    return new Response("NUH", {
      status: 400
    });
  }
}
function firstLetterToLowerCase(string) {
  if (string.length > 0) {
    return string[0].toLocaleLowerCase() + string.slice(1, string.length);
  }
  return "";
}
export async function fileHandler(req, info) {
  const clientNetAddr = info.remoteAddr;
  const clientIp = clientNetAddr.hostname;
  console.log(`${clientIp} connected`);
  // if(req.method === "GET") {
  //     const url = new URL(req.url);
  //     const filepath = decodeURIComponent(url.pathname);
  //     try {
  //         const file = await Deno.open("." + filepath,  { read: true });
  //         console.log("File!!")
  //         return new Response(file.readable);
  //     } catch (error: unknown) {
  //         console.log("What!?")
  //         return new Response("file not found 404", { status: 404 });
  //     }
  // }
  // maybe i should seperate GET requests from POST requests, i only really care about users
  // if(!take(clientIp)) {
  //     return new Response("Too many requests", { status: 429 })
  // }
  if (req.method === "GET" && new URL(req.url).pathname.startsWith("/saved/")) {
    // console.log("HAPPENS!")
    return await serveDir(req, {
      fsRoot: ".",
      showIndex: true
    });
  // await writeGeneratedHtmlToDisk();
  // const response = await serveDir(req, {fsRoot: ".", showIndex: true});
  // // response.
  // const headers = new Headers(response.headers);
  // headers.set("X-Content-Type-Options", "nosniff");
  // return new Response(response.body, {
  //     status: response.status,
  //     headers: headers
  // })
  }
  if (req.method !== "POST") {
    const responseOptions = {
      headers: {
        "Content-Type": "text/html"
      }
    };
    const inputForm = `
            <form method="POST" enctype="multipart/form-data">
                <input name="file" type="file" />
                <input name="password" type="password"/>
                <button type="submit">Upload</button>
            </form>
        `;
    // return new Response("Waiting for your file, king", responseOptions);
    // return new Response(inputForm, responseOptions);
    return new Response(await writeGeneratedHtmlToDisk(), responseOptions);
  // return new Response("NOT A POST",  {status: 405})
  }
  if (!take(clientIp)) {
    return new Response("Too many requests", {
      status: 429
    });
  }
  // A BUNCH OF GUARD CLAUSES COZ IM IN LOVE
  const formData = await req.formData();
  const clientPassword = formData.get("password")?.toString() ?? "";
  if (!await safeCompare(clientPassword, FILE_SERVER_PASSWORD)) {
    return new Response("incorrect password", {
      status: 401
    });
  }
  // as File is unsafe i think
  const file = formData?.get("file");
  if (!file) return new Response("File required but not provided.", {
    status: 400
  });
  if (file.size > MAX_FILE_SIZE) return new Response(`File exceeds ${MAX_FILE_SIZE / 1024 / 1024}mb limit.`, {
    status: 413
  });
  // only check 4100 bytes header as in the unicornHeader example https://www.npmjs.com/package/file-type
  // i do wonder if this optimization is risky 👀
  const fileHeader = await file.slice(0, 4100).arrayBuffer();
  const mimeFilePath = await getMimeFilePath(fileHeader);
  if (mimeFilePath === false) return new Response("File type not supported", {
    status: 400
  });
  const sanitizedFileName = firstLetterToLowerCase(sanitizeFileName(file.name));
  if (sanitizedFileName === "") return new Response("Empty file name", {
    status: 400
  });
  {
    // ensures the directory exists before write
    Deno.mkdirSync(`${saveDirectory}/${mimeFilePath}`, {
      recursive: true
    });
    const sanitizedFilePath = saveDirectory.concat(...[
      "/",
      mimeFilePath,
      "/",
      sanitizedFileName
    ]);
    const fileOnDisk = await Deno.create(sanitizedFilePath); // is it better to use the property of the sanitizedFile or use sanitizedFileName?
    const fileWriter = fileOnDisk.writable.getWriter();
    // we can safely write the bytes since we have checked the file type i think
    const bytes = await file.bytes();
    await fileWriter.write(bytes);
    await fileWriter.close();
    return new Response(`Wrote ${sanitizedFileName} in ${sanitizedFilePath} with ${bytes.length} bytes`, {
      status: 200
    });
  }
}
/** is there a better name for this function? */ async function getMimeFilePath(buffer) {
  // const fileType: FileTypeResult | undefined = (await fileTypeFromBuffer(await file.bytes()))
  const fileType = await fileTypeFromBuffer(buffer);
  if (fileType === undefined) return false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vdmFyL3d3dy9kZW5vc2VydmVyL2ZpbGVzZXJ2ZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNhbml0aXplRmlsZU5hbWUgZnJvbSBcInNhbml0aXplLWZpbGVuYW1lXCJcbmltcG9ydCB7IGZpbGVUeXBlRnJvbUJ1ZmZlciwgRmlsZVR5cGVSZXN1bHQgfSBmcm9tIFwiZmlsZS10eXBlXCJcbmltcG9ydCB7IHdyaXRlR2VuZXJhdGVkSHRtbFRvRGlzayB9IGZyb20gXCIuL2ZpbGV2aWV3ZXIudHNcIlxuaW1wb3J0IHsgdGltaW5nU2FmZUVxdWFsIH0gZnJvbSBcImpzcjpAc3RkL2NyeXB0by90aW1pbmctc2FmZS1lcXVhbFwiO1xuaW1wb3J0IHsgRklMRV9TRVJWRVJfUEFTU1dPUkQsIHNhZmVDb21wYXJlIH0gZnJvbSBcIi4vcGFzc3dvcmQudHNcIjtcbmltcG9ydCB7IHNlcnZlRGlyIH0gZnJvbSBcImpzcjpAc3RkL2h0dHAvZmlsZS1zZXJ2ZXJcIlxuXG4vLyBBSSBzZWN1cml0eSBjaGVja1xuLy8gNC4gUG9seWdsb3QgRmlsZXMgLyBYU1MgKEZ1dHVyZSBSaXNrKVxuLy8gU2V2ZXJpdHk6IE1lZGl1bVxuLy8gV2hpbGUgZmlsZS10eXBlIGlzIGdyZWF0LCBpdCBvbmx5IGNoZWNrcyB0aGUgYmVnaW5uaW5nIG9mIGEgZmlsZSAodGhlIFwibWFnaWMgYnl0ZXNcIikuXG4vLyBJdCBpcyB0cml2aWFsbHkgZWFzeSB0byBjcmVhdGUgYSBcIlBvbHlnbG90XCIgZmlsZeKAlGEgZmlsZSB0aGF0IHN0YXJ0cyB3aXRoIHRoZSB2YWxpZCBoZWFkZXJzIG9mIGEgR0lGIChzYXRpc2Z5aW5nIGZpbGUtdHlwZSksIGJ1dCBjb250YWlucyBhIG1hbGljaW91cyBIVE1ML0phdmFTY3JpcHQgcGF5bG9hZCBpbiB0aGUgYm9keS5cbi8vIElmIHlvdSBsYXRlciBzZXJ2ZSB0aGVzZSBmaWxlcyBkaXJlY3RseSBmcm9tIHlvdXIgc2VydmVyIGFuZCBhIGJyb3dzZXIgYWNjZXNzZXMgdGhlbSwgdGhlIGJyb3dzZXIgbWlnaHQgZ2V0IGNvbmZ1c2VkIGFuZCBleGVjdXRlIHRoZSBKYXZhU2NyaXB0LCByZXN1bHRpbmcgaW4gQ3Jvc3MtU2l0ZSBTY3JpcHRpbmcgKFhTUykuXG4vLyBUaGUgRml4OiBXaGVuIHlvdSBidWlsZCB0aGUgcm91dGUgdG8gc2VydmUgdGhlc2UgZmlsZXMsIGVuc3VyZSB5b3Ugc3RyaWN0bHkgZW5mb3JjZSB0aGUgQ29udGVudC1UeXBlIGhlYWRlciBhbmQgYWx3YXlzIGluY2x1ZGUgWC1Db250ZW50LVR5cGUtT3B0aW9uczogbm9zbmlmZi5cblxuLy8gaW50ZXJmYWNlcyBmb3Igbm93XG5pbnRlcmZhY2UgQnVja2V0IHtcbiAgICB0b2tlbnM6IG51bWJlcjtcbiAgICBsYXN0OiBudW1iZXI7XG59XG5cbmNvbnN0IHNhdmVEaXJlY3RvcnkgPSBcIi4vc2F2ZWRcIjtcbmNvbnN0IE1BWF9GSUxFX1NJWkUgPSAxMDAgKiAxMDI0ICogMTAyNDsgLy8gMTAwTUJcbmNvbnN0IFJFRlJFU0hfUkFURSA9IDQ7XG5jb25zdCBNQVhfUkVRVUVTVFMgPSA1O1xuY29uc3QgYnVja2V0cyA9IG5ldyBNYXA8c3RyaW5nLCBCdWNrZXQ+O1xuXG5hd2FpdCBpbml0KCk7XG5hc3luYyBmdW5jdGlvbiBpbml0KCkge1xuICAgIGF3YWl0IHdyaXRlR2VuZXJhdGVkSHRtbFRvRGlzaygpO1xuICAgIGNvbnN0IGNsZWFuQnVja2V0TWVtb3J5ID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICBjb25zdCBjdXRvZmYgPSBEYXRlLm5vdygpIC0gKFJFRlJFU0hfUkFURSAqIDEwMDApICogTUFYX1JFUVVFU1RTO1xuICAgICAgICBmb3IoY29uc3QgW2lwLCBidWNrZXRdIG9mIGJ1Y2tldHMpIHtcbiAgICAgICAgICAgIGlmKGJ1Y2tldC5sYXN0IDw9IGN1dG9mZikge1xuICAgICAgICAgICAgICAgIGJ1Y2tldHMuZGVsZXRlKGlwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSwgMzBfMDAwKVxuICAgIERlbm8udW5yZWZUaW1lcihjbGVhbkJ1Y2tldE1lbW9yeSk7XG5cbiAgICBpZiAoaW1wb3J0Lm1ldGEubWFpbikge1xuICAgICAgICBEZW5vLnNlcnZlKGZpbGVIYW5kbGVyKTtcbiAgICB9XG59XG5cbi8vIGltIG5vdCBwcm91ZCBvZiB0aGlzIGZ1bmN0aW9uIGJ1dCBpIGNvdWxkbid0IGZvY3VzIGlka1xuLy8gaGVhdnkgaW5zcGlyYXRpb24gYW5kIGJldHRlciBjb2RlOiBodHRwczovL2RvY3MuZGVuby5jb20vZXhhbXBsZXMvaHR0cF9zZXJ2ZXJfcmF0ZV9saW1pdC9cbi8vIGkganVzdCB3YW50ZWQgdG8gd3JpdGUgbXkgb3duIGZvciBmdW5cbi8vIFRPRE8gcmVmYWN0b3IgdG8gdXNlIG1pbiArIGhhdmUgbW9yZSBlYXJseSByZXR1cm5zXG5mdW5jdGlvbiB0YWtlKGlwOiBzdHJpbmcpIHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IGJ1Y2tldHMuZ2V0KGlwKSA/PyB7IHRva2VuczogTUFYX1JFUVVFU1RTLCBsYXN0OiBub3cgfVxuICAgIGJ1Y2tldHMuc2V0KGlwLCBidWNrZXQpO1xuICAgIGNvbnNvbGUubG9nKFwiQ1VSUkVOVCBUT0tFTlMgQVQgQ0FMTDogXCIgKyBidWNrZXQudG9rZW5zKVxuXG4gICAgY29uc3QgdGltZUVsYXBzZWQgPSBub3cgLSBidWNrZXQubGFzdDtcbiAgICBjb25zdCBuZXdSZXF1ZXN0cyA9IE1hdGguZmxvb3IoKHRpbWVFbGFwc2VkIC8gUkVGUkVTSF9SQVRFKSAvIDEwMDApXG4gICAgLy8gY29uc3QgbmV3UmVxdWVzdHMgPSBNYXRoLmZsb29yKHRpbWVFbGFwc2VkLzEwMDAgJSBSRUZSRVNIX1JBVEUgKiAxMDAwKTtcbiAgICAvLyBjb25zb2xlLmxvZyhgVGltZSBlbGFwc2VkOiAke3RpbWVFbGFwc2VkfVxcbiBuZXdSZXF1ZXN0czoke25ld1JlcXVlc3RzfWApXG5cbiAgICAvLyBNYXRoLm1pbihNQVhfUkVRVUVTVFMsIGJ1Y2tldC50b2tlbnMgKyBuZXdSZXF1ZXN0cylcbiAgICAvLyBeIHNvbWV0aGluZyBsaWtlIHRoaXMgaXMgZ2VuaXVzXG5cbiAgICAvLyBpIGRvbnQgcmVhbGx5IG5lZWQgdGhpcyBpZiBpIGhhdmUgYW4gaW50ZXJ2YWwgdG8gcmVtb3ZlIGJ1Y2tldHMgdGJoXG4gICAgaWYobmV3UmVxdWVzdHMgPj0gTUFYX1JFUVVFU1RTKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwibmV3cmVxdWVzdHMgPj0gbWF4LCBzZXR0aW5nIHJlcXVlc3RzIHRvIDVcIilcbiAgICAgICAgYnVja2V0LnRva2VucyA9IE1BWF9SRVFVRVNUUyAtIDE7IC8vIHNwZW5kIG9uZSByZXF1ZXN0XG4gICAgICAgIGJ1Y2tldC5sYXN0ID0gbm93O1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZihidWNrZXQudG9rZW5zID4gMCkge1xuICAgICAgICBidWNrZXQudG9rZW5zICs9IG5ld1JlcXVlc3RzIC0gMTsgLy8gc3BlbmQgb25lIHJlcXVlc3RcbiAgICAgICAgYnVja2V0Lmxhc3QgPSBub3c7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiVXNlZCBvbmUgdG9rZW4hXCIgKyBidWNrZXQudG9rZW5zKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBidWNrZXQubGFzdCA9IG5vdzsgLy8gY3J1ZWwgYnV0IGRlc2VydmVkIGZvciBzcGFtXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBEZW5vLnNlcnZlKChyZXEsIGluZm8pID0+IHtcbi8vICAgICBpbmZvLnJlbW90ZUFkZHIuXG4vLyB9KVxuLy8gRGVuby5zZXJ2ZSh0YWtlSGFuZGxlcik7XG5cbmZ1bmN0aW9uIHRha2VIYW5kbGVyKHJlcTogUmVxdWVzdCkge1xuICAgIGlmKHJlcS5tZXRob2QgIT09IFwiUE9TVFwiICkge1xuICAgICAgICBjb25zdCByZXNwb25zZU9wdGlvbnM6IFJlc3BvbnNlSW5pdCA9IHtcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQvaHRtbFwiLFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaW5wdXRGb3JtID0gYFxuICAgICAgICAgICAgPGZvcm0gbWV0aG9kPVwiUE9TVFwiIGVuY3R5cGU9XCJtdWx0aXBhcnQvZm9ybS1kYXRhXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJwYXNzd29yZFwiIHR5cGU9XCJ0ZXh0XCIvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPlVwbG9hZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICBgO1xuICAgICAgICAvLyByZXR1cm4gbmV3IFJlc3BvbnNlKFwiV2FpdGluZyBmb3IgeW91ciBmaWxlLCBraW5nXCIsIHJlc3BvbnNlT3B0aW9ucyk7XG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoaW5wdXRGb3JtLCByZXNwb25zZU9wdGlvbnMpO1xuICAgICAgICAvLyByZXR1cm4gbmV3IFJlc3BvbnNlKFwiTk9UIEEgUE9TVFwiLCAge3N0YXR1czogNDA1fSlcbiAgICB9XG4gICAgaWYodGFrZShcIlZpbmRcIikpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIllFXCIsICB7c3RhdHVzOiAyMDB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzcG9uc2UoXCJOVUhcIiwgIHtzdGF0dXM6IDQwMH0pXG4gICAgfVxufVxuXG5cbmZ1bmN0aW9uIGZpcnN0TGV0dGVyVG9Mb3dlckNhc2Uoc3RyaW5nOnN0cmluZykge1xuICAgIGlmKHN0cmluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiBzdHJpbmdbMF0udG9Mb2NhbGVMb3dlckNhc2UoKSArIHN0cmluZy5zbGljZSgxLHN0cmluZy5sZW5ndGgpXG4gICAgfVxuICAgIHJldHVybiBcIlwiO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaWxlSGFuZGxlcihyZXE6IFJlcXVlc3QsIGluZm86IERlbm8uU2VydmVIYW5kbGVySW5mbyk6IFByb21pc2U8UmVzcG9uc2U+IHtcbiAgICBjb25zdCBjbGllbnROZXRBZGRyID0gaW5mby5yZW1vdGVBZGRyIGFzIERlbm8uTmV0QWRkclxuICAgIGNvbnN0IGNsaWVudElwID0gY2xpZW50TmV0QWRkci5ob3N0bmFtZTtcbiAgICBjb25zb2xlLmxvZyhgJHtjbGllbnRJcH0gY29ubmVjdGVkYCk7XG5cblxuXG5cbiAgICAvLyBpZihyZXEubWV0aG9kID09PSBcIkdFVFwiKSB7XG4gICAgLy8gICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxLnVybCk7XG4gICAgLy8gICAgIGNvbnN0IGZpbGVwYXRoID0gZGVjb2RlVVJJQ29tcG9uZW50KHVybC5wYXRobmFtZSk7XG4gICAgLy8gICAgIHRyeSB7XG4gICAgLy8gICAgICAgICBjb25zdCBmaWxlID0gYXdhaXQgRGVuby5vcGVuKFwiLlwiICsgZmlsZXBhdGgsICB7IHJlYWQ6IHRydWUgfSk7XG4gICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcIkZpbGUhIVwiKVxuICAgIC8vICAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShmaWxlLnJlYWRhYmxlKTtcbiAgICAvLyAgICAgfSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwiV2hhdCE/XCIpXG4gICAgLy8gICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKFwiZmlsZSBub3QgZm91bmQgNDA0XCIsIHsgc3RhdHVzOiA0MDQgfSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyB9XG5cbiAgICAvLyBtYXliZSBpIHNob3VsZCBzZXBlcmF0ZSBHRVQgcmVxdWVzdHMgZnJvbSBQT1NUIHJlcXVlc3RzLCBpIG9ubHkgcmVhbGx5IGNhcmUgYWJvdXQgdXNlcnNcbiAgICAvLyBpZighdGFrZShjbGllbnRJcCkpIHtcbiAgICAvLyAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShcIlRvbyBtYW55IHJlcXVlc3RzXCIsIHsgc3RhdHVzOiA0MjkgfSlcbiAgICAvLyB9XG4gICAgaWYocmVxLm1ldGhvZCA9PT0gXCJHRVRcIiAmJiBuZXcgVVJMKHJlcS51cmwpLnBhdGhuYW1lLnN0YXJ0c1dpdGgoXCIvc2F2ZWQvXCIpKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiSEFQUEVOUyFcIilcbiAgICAgICAgcmV0dXJuIGF3YWl0IHNlcnZlRGlyKHJlcSwge2ZzUm9vdDogXCIuXCIsIHNob3dJbmRleDogdHJ1ZX0pO1xuICAgICAgICAvLyBhd2FpdCB3cml0ZUdlbmVyYXRlZEh0bWxUb0Rpc2soKTtcbiAgICAgICAgLy8gY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBzZXJ2ZURpcihyZXEsIHtmc1Jvb3Q6IFwiLlwiLCBzaG93SW5kZXg6IHRydWV9KTtcbiAgICAgICAgLy8gLy8gcmVzcG9uc2UuXG4gICAgICAgIC8vIGNvbnN0IGhlYWRlcnMgPSBuZXcgSGVhZGVycyhyZXNwb25zZS5oZWFkZXJzKTtcbiAgICAgICAgLy8gaGVhZGVycy5zZXQoXCJYLUNvbnRlbnQtVHlwZS1PcHRpb25zXCIsIFwibm9zbmlmZlwiKTtcbiAgICAgICAgLy8gcmV0dXJuIG5ldyBSZXNwb25zZShyZXNwb25zZS5ib2R5LCB7XG4gICAgICAgIC8vICAgICBzdGF0dXM6IHJlc3BvbnNlLnN0YXR1cyxcbiAgICAgICAgLy8gICAgIGhlYWRlcnM6IGhlYWRlcnNcbiAgICAgICAgLy8gfSlcbiAgICB9XG5cbiAgICBpZihyZXEubWV0aG9kICE9PSBcIlBPU1RcIiApIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VPcHRpb25zOiBSZXNwb25zZUluaXQgPSB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJ0ZXh0L2h0bWxcIixcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlucHV0Rm9ybSA9IGBcbiAgICAgICAgICAgIDxmb3JtIG1ldGhvZD1cIlBPU1RcIiBlbmN0eXBlPVwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiPlxuICAgICAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwiZmlsZVwiIHR5cGU9XCJmaWxlXCIgLz5cbiAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cInBhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIvPlxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPlVwbG9hZDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9mb3JtPlxuICAgICAgICBgO1xuICAgICAgICAvLyByZXR1cm4gbmV3IFJlc3BvbnNlKFwiV2FpdGluZyBmb3IgeW91ciBmaWxlLCBraW5nXCIsIHJlc3BvbnNlT3B0aW9ucyk7XG4gICAgICAgIC8vIHJldHVybiBuZXcgUmVzcG9uc2UoaW5wdXRGb3JtLCByZXNwb25zZU9wdGlvbnMpO1xuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKGF3YWl0IHdyaXRlR2VuZXJhdGVkSHRtbFRvRGlzaygpLCByZXNwb25zZU9wdGlvbnMpXG4gICAgICAgIC8vIHJldHVybiBuZXcgUmVzcG9uc2UoXCJOT1QgQSBQT1NUXCIsICB7c3RhdHVzOiA0MDV9KVxuICAgIH1cblxuICAgIGlmKCF0YWtlKGNsaWVudElwKSkge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKFwiVG9vIG1hbnkgcmVxdWVzdHNcIiwgeyBzdGF0dXM6IDQyOSB9KVxuICAgIH1cblxuICAgIC8vIEEgQlVOQ0ggT0YgR1VBUkQgQ0xBVVNFUyBDT1ogSU0gSU4gTE9WRVxuICAgIGNvbnN0IGZvcm1EYXRhOiBGb3JtRGF0YSA9IGF3YWl0IHJlcS5mb3JtRGF0YSgpO1xuXG4gICAgY29uc3QgY2xpZW50UGFzc3dvcmQgPSBmb3JtRGF0YS5nZXQoXCJwYXNzd29yZFwiKT8udG9TdHJpbmcoKSA/PyBcIlwiO1xuICAgIGlmKCFhd2FpdCBzYWZlQ29tcGFyZShjbGllbnRQYXNzd29yZCwgRklMRV9TRVJWRVJfUEFTU1dPUkQpICkge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKFwiaW5jb3JyZWN0IHBhc3N3b3JkXCIsICB7IHN0YXR1czogNDAxIH0pXG4gICAgfVxuXG4gICAgLy8gYXMgRmlsZSBpcyB1bnNhZmUgaSB0aGlua1xuICAgIGNvbnN0IGZpbGU6IEZpbGUgfCBudWxsID0gZm9ybURhdGE/LmdldChcImZpbGVcIikgYXMgRmlsZTtcbiAgICBpZighZmlsZSkgcmV0dXJuIG5ldyBSZXNwb25zZShcIkZpbGUgcmVxdWlyZWQgYnV0IG5vdCBwcm92aWRlZC5cIiwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgICBpZihmaWxlLnNpemUgPiBNQVhfRklMRV9TSVpFKSByZXR1cm4gbmV3IFJlc3BvbnNlKGBGaWxlIGV4Y2VlZHMgJHtNQVhfRklMRV9TSVpFIC8gMTAyNCAvIDEwMjR9bWIgbGltaXQuYCwgeyBzdGF0dXM6IDQxMyB9KTtcbiAgICAvLyBvbmx5IGNoZWNrIDQxMDAgYnl0ZXMgaGVhZGVyIGFzIGluIHRoZSB1bmljb3JuSGVhZGVyIGV4YW1wbGUgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvZmlsZS10eXBlXG4gICAgLy8gaSBkbyB3b25kZXIgaWYgdGhpcyBvcHRpbWl6YXRpb24gaXMgcmlza3kg8J+RgFxuICAgIGNvbnN0IGZpbGVIZWFkZXIgPSBhd2FpdCBmaWxlLnNsaWNlKDAsNDEwMCkuYXJyYXlCdWZmZXIoKTtcbiAgICBjb25zdCBtaW1lRmlsZVBhdGggPSBhd2FpdCBnZXRNaW1lRmlsZVBhdGgoZmlsZUhlYWRlcik7XG4gICAgaWYobWltZUZpbGVQYXRoID09PSBmYWxzZSkgcmV0dXJuIG5ldyBSZXNwb25zZShcIkZpbGUgdHlwZSBub3Qgc3VwcG9ydGVkXCIsIHtzdGF0dXM6IDQwMH0pO1xuICAgIGNvbnN0IHNhbml0aXplZEZpbGVOYW1lID0gZmlyc3RMZXR0ZXJUb0xvd2VyQ2FzZShzYW5pdGl6ZUZpbGVOYW1lKGZpbGUubmFtZSkpO1xuICAgIGlmKHNhbml0aXplZEZpbGVOYW1lID09PSBcIlwiKSByZXR1cm4gbmV3IFJlc3BvbnNlKFwiRW1wdHkgZmlsZSBuYW1lXCIsIHsgc3RhdHVzOiA0MDAgfSk7XG5cbiAgICB7ICAgLy8gV1JJVEUgRklMRSBUTyBESVNLXG4gICAgICAgIC8vIGVuc3VyZXMgdGhlIGRpcmVjdG9yeSBleGlzdHMgYmVmb3JlIHdyaXRlXG4gICAgICAgIERlbm8ubWtkaXJTeW5jKGAke3NhdmVEaXJlY3Rvcnl9LyR7bWltZUZpbGVQYXRofWAsIHsgcmVjdXJzaXZlOiB0cnVlfSlcblxuICAgICAgICBjb25zdCBzYW5pdGl6ZWRGaWxlUGF0aCA9IHNhdmVEaXJlY3RvcnkuY29uY2F0KC4uLltcIi9cIixtaW1lRmlsZVBhdGgsXCIvXCIsc2FuaXRpemVkRmlsZU5hbWVdKTtcblxuICAgICAgICBjb25zdCBmaWxlT25EaXNrID0gYXdhaXQgRGVuby5jcmVhdGUoc2FuaXRpemVkRmlsZVBhdGgpOyAvLyBpcyBpdCBiZXR0ZXIgdG8gdXNlIHRoZSBwcm9wZXJ0eSBvZiB0aGUgc2FuaXRpemVkRmlsZSBvciB1c2Ugc2FuaXRpemVkRmlsZU5hbWU/XG4gICAgICAgIGNvbnN0IGZpbGVXcml0ZXIgPSBmaWxlT25EaXNrLndyaXRhYmxlLmdldFdyaXRlcigpO1xuXG4gICAgICAgIC8vIHdlIGNhbiBzYWZlbHkgd3JpdGUgdGhlIGJ5dGVzIHNpbmNlIHdlIGhhdmUgY2hlY2tlZCB0aGUgZmlsZSB0eXBlIGkgdGhpbmtcbiAgICAgICAgY29uc3QgYnl0ZXMgPSBhd2FpdCBmaWxlLmJ5dGVzKCk7XG4gICAgICAgIGF3YWl0IGZpbGVXcml0ZXIud3JpdGUoYnl0ZXMpO1xuICAgICAgICBhd2FpdCBmaWxlV3JpdGVyLmNsb3NlKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShgV3JvdGUgJHtzYW5pdGl6ZWRGaWxlTmFtZX0gaW4gJHtzYW5pdGl6ZWRGaWxlUGF0aH0gd2l0aCAke2J5dGVzLmxlbmd0aH0gYnl0ZXNgLCB7c3RhdHVzOiAyMDB9KVxuICAgIH1cbn1cblxuLyoqIGlzIHRoZXJlIGEgYmV0dGVyIG5hbWUgZm9yIHRoaXMgZnVuY3Rpb24/ICovXG5hc3luYyBmdW5jdGlvbiBnZXRNaW1lRmlsZVBhdGgoYnVmZmVyOiBBcnJheUJ1ZmZlcik6IFByb21pc2U8c3RyaW5nIHwgZmFsc2U+IHsgICAvLyBERVRFQ1QgRklMRSBUWVBFUyAoc2hvdWxkIGJlIGRvbmUgYXMgZWFybHkgYXMgcG9zc2libGUpXG4gICAgLy8gY29uc3QgZmlsZVR5cGU6IEZpbGVUeXBlUmVzdWx0IHwgdW5kZWZpbmVkID0gKGF3YWl0IGZpbGVUeXBlRnJvbUJ1ZmZlcihhd2FpdCBmaWxlLmJ5dGVzKCkpKVxuICAgIGNvbnN0IGZpbGVUeXBlOiBGaWxlVHlwZVJlc3VsdCB8IHVuZGVmaW5lZCA9IGF3YWl0IGZpbGVUeXBlRnJvbUJ1ZmZlcihidWZmZXIpO1xuICAgIGlmKGZpbGVUeXBlID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcblxuICAgIC8vIGkgdGhpbmsgaSdsbCBkbyB0aGlzIHRvIGVhc2lseSBwdXQgaW4gdGhlIG1pbWUgZmlsZSB0eXBlIGluIGh0bWxcbiAgICByZXR1cm4gZmlsZVR5cGUubWltZTtcblxuICAgIC8vIGltcG9zc2libGUgbm90IHRvIHJlcGVhdCB5b3Vyc2VsZiBzaW5jZSB0aGVyZSBpcyBubyBnb29kIG5hbWUgZm9yIHRoaXMgdmFyaWFibGVcbi8vICAgICBjb25zdCBtaW1lVHlwZSA9IGZpbGVUeXBlLm1pbWUuc3BsaXQoXCIvXCIpWzBdO1xuLy8gICAgIGNvbnN0IG1pbWVTdWJ0eXBlID0gZmlsZVR5cGUubWltZS5zcGxpdChcIi9cIilbMV07XG4vL1xuLy8gICAgIHN3aXRjaChtaW1lVHlwZSkge1xuLy8gICAgICAgICAvLyBLaW5kYSBuYXN0eSBjb3ogaSB3YW50IGltYWdlcyBsaWtlIHBuZytqcGcgaW4gb25lIGZvbGRlciwgYWxsIHZpZGVvcyBsaWtlIG1wMywgbW92IGluIG9uZSBmb2xkZXIsIGJ1dCBhbHNvIEdJRnMgaW4gb25lIGZvbGRlciwgc28gaSBtdXN0XG4vLyAgICAgICAgIGNhc2UgXCJpbWFnZVwiOiByZXR1cm4gbWltZVN1YnR5cGUgPT09IFwiZ2lmXCIgPyBtaW1lU3VidHlwZSA6IG1pbWVUeXBlO1xuLy8gICAgICAgICBjYXNlIFwidmlkZW9cIjogcmV0dXJuIG1pbWVUeXBlO1xuLy8gICAgICAgICBkZWZhdWx0OiByZXR1cm4gZmFsc2U7XG4vLyAgICAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sc0JBQXNCLG9CQUFtQjtBQUNoRCxTQUFTLGtCQUFrQixRQUF3QixZQUFXO0FBQzlELFNBQVMsd0JBQXdCLFFBQVEsa0JBQWlCO0FBRTFELFNBQVMsb0JBQW9CLEVBQUUsV0FBVyxRQUFRLGdCQUFnQjtBQUNsRSxTQUFTLFFBQVEsUUFBUSw0QkFBMkI7QUFnQnBELE1BQU0sZ0JBQWdCO0FBQ3RCLE1BQU0sZ0JBQWdCLE1BQU0sT0FBTyxNQUFNLFFBQVE7QUFDakQsTUFBTSxlQUFlO0FBQ3JCLE1BQU0sZUFBZTtBQUNyQixNQUFNLFVBQVUsSUFBSTtBQUVwQixNQUFNO0FBQ04sZUFBZTtFQUNYLE1BQU07RUFDTixNQUFNLG9CQUFvQixZQUFZO0lBQ2xDLE1BQU0sU0FBUyxLQUFLLEdBQUcsS0FBSyxBQUFDLGVBQWUsT0FBUTtJQUNwRCxLQUFJLE1BQU0sQ0FBQyxJQUFJLE9BQU8sSUFBSSxRQUFTO01BQy9CLElBQUcsT0FBTyxJQUFJLElBQUksUUFBUTtRQUN0QixRQUFRLE1BQU0sQ0FBQztNQUNuQjtJQUNKO0VBRUosR0FBRztFQUNILEtBQUssVUFBVSxDQUFDO0VBRWhCLElBQUksWUFBWSxJQUFJLEVBQUU7SUFDbEIsS0FBSyxLQUFLLENBQUM7RUFDZjtBQUNKO0FBRUEseURBQXlEO0FBQ3pELDRGQUE0RjtBQUM1Rix3Q0FBd0M7QUFDeEMscURBQXFEO0FB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
// denoCacheMetadata=4196699350319845857,12743229364241351732