import { walk } from "jsr:@std/fs";
// Deno.serve(handler)
//
//
// function macHandler(req: Request) {
//
// }
// const interfaces = Deno.networkInterfaces();
// console.log(interfaces.length); // e.g. 15
// const first = interfaces[0];
// console.log(first.mac); // e.g. lo0 IPv4 127.0.0.1
// const gifPaths: string[] = [];
// const imagePaths: string[] = [];
// const videoPaths: string[] = [];
// const html = {
//     image: {
//         mime: [
//         // documentTitle: "images",
//         // body: ""
//     },
//     video: {
//         documentTitle: "videos",
//         body: ""
//     },
//     gif: {
//         documentTitle: "GIFs",
//         body: ""
//     },
// }
export async function writeGeneratedHtmlToDisk() {
  const mimes = [];
  const srcToMime = new Map;
  const htmlVideos = [];
  const htmlImages = [];
  const htmlGifs = [];
  // may not be be careful enough here, if undefined
  // shows up it's because the index is out of bounds
  // hardcoded to be files like /saveDir/gif/example.gif
  for await (const entry of walk("./saved/", {
    includeDirs: false
  })){
    const srcPath = entry.path;
    const pathParts = srcPath.split("/");
    const mimeType = pathParts[pathParts.length - 3];
    const mimeSubType = pathParts[pathParts.length - 2];
    const mime = `${mimeType}/${mimeSubType}`;
    const fileName = pathParts[pathParts.length - 1];
    mimes.push(mime);
    srcToMime.set(srcPath, mime);
    const absPath = `../${srcPath}`;
    console.log(absPath);
    // const absPath = srcPath;
    // special treatment
    let width = `width=300`;
    width = "";
    let height = `height=300`;
    // [ta] tag
    const noSizeLimit = fileName.charAt(0) == "[" && fileName.charAt(1) == "t" && fileName.charAt(2) == "a" && fileName.charAt(3) == "]";
    if (noSizeLimit) {
      width = "";
      height = "";
    }
    if (mimeSubType === "gif") {
      htmlGifs.push(`<img ${width} ${height} src="${absPath}" type="${mime}">`);
      continue;
    }
    if (mimeType === "image") {
      htmlImages.push(`<img ${width} ${height} src="${absPath}" type="${mime}">`);
      continue;
    }
    if (mimeType === "video") {
      htmlVideos.push(`
                <video ${width} ${height} controls>
                    <source src="${absPath}" type="${mime}">
                </video>
            `);
      continue;
    }
  }
  // console.log(htmlImages)
  const html = {
    image: {
      body: htmlImages
    },
    gif: {
      body: htmlGifs
    },
    video: {
      body: htmlVideos
    }
  };
  const allHtmlMedia = [
    ...htmlGifs,
    ...htmlImages,
    ...htmlVideos
  ];
  // Math.random()
  let randomHtmlMedia = allHtmlMedia[Math.round(Math.random() * (allHtmlMedia.length - 1))];
  const allHtml = [
    htmlGifs.join(""),
    htmlImages.join(""),
    htmlVideos.join("")
  ];
  const documentTitle = "gerald3 archives";
  // const vinding:string = testArr.join("");
  // console.log(vinding)
  // console.log(allHtml)
  // this does create a comma between the elements in the array
  const finalHtml = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <style>
            body {
                background-color: grey;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                // height: 80vh;
                // margin: 0px;
            }
        </style>
       	<meta charset="UTF-8">
       	<meta name="viewport" content="width=device-width, initial-scale=1.0">
       	<title>${documentTitle}</title>
    </head>
    <header>
        <details>
       	    <summary style="color: wheat;">Shrödingers meme</summary>
            ${randomHtmlMedia}
        </details>
    </header>

    <body>
        <form method="POST" enctype="multipart/form-data">
            <input name="file" type="file" />
            <input name="password" type="password"/>
            <button type="submit">Upload</button>
        </form>


        ${allHtml.join("")}
    </body>
    </html>`;
  // console.log(finalHtml)
  // const file = Deno.create("./generated.html");
  Deno.writeTextFile("./generated.html", finalHtml);
  return finalHtml;
} // throw Error("Reached old code");
 //
 // {
 // const gifPaths: string[] = [];
 // const imagePaths: string[] = [];
 // const videoPaths: string[] = [];
 //
 // // may not be be careful enough here, if undefined
 // // shows up it's because the index is out of bounds
 // // hardcoded to be files like /saveDir/gif/example.gif
 // for await (const entry of walk("./saved/", { includeDirs: false })) {
 //     const entryPath = entry.path;
 //     const pathParts = entryPath.split("/");
 //     const fileType = pathParts[pathParts.length - 2];
 //     const fileName = pathParts[pathParts.length - 1];
 //     switch(fileType) {
 //         case "gif": gifPaths.push(entryPath)
 //             break
 //         case "image": imagePaths.push(entryPath);
 //             break;
 //         case "video": videoPaths.push(entryPath)
 //             break
 //     }
 // }
 // console.log(`GIFS: ${gifPaths}\nIMAGES: ${imagePaths}\nVIDEOS: ${videoPaths}`)
 //
 // console.log("\n")
 // console.log(getHtml("image", imagePaths))
 //
 // function getHtml(displayMode: string, displayModePaths: string[]) {
 //     // const displayModes = ["gif", "image", "video"];
 //
 //     const displayModes = [displayMode]
 //     let finalHtml: string = "";
 //     for(const displayMode of displayModes) {
 //         let htmlBody: string = "NO SWITCH CASE ACTIVATED.";
 //
 //         switch(displayMode) {
 //             case "gif": {
 //                 console.log("HALLO")
 //                 const gifPaths = displayModePaths
 //                 for(const gifPath of gifPaths) {
 //                     htmlBody = `<img src="${gifPath}">`
 //                 }
 //             }
 //             break;
 //             case "image": {
 //                 const imagePaths = displayModePaths
 //                 for(const imagePath of imagePaths) {
 //                     console.log(imagePath)
 //                     htmlBody = `<img src="${imagePath}">`
 //                 }
 //             }
 //             break;
 //             case "video": {
 //                 const videoPaths = displayModePaths
 //                 for(const videoPath of videoPaths) {
 //                     htmlBody =
 //                     `<video width="400" height="240" controls>
 //                         <source src="${videoPath}">
 //                     </video>`
 //                 }
 //             }
 //             break;
 //         }
 //
 //
 //
 //         const htmlTitle = displayMode;
 //         finalHtml = `
 //             <!DOCTYPE html>
 //             <html lang="en">
 //             <head>
 //            	<meta charset="UTF-8">
 //            	<meta name="viewport" content="width=device-width, initial-scale=1.0">
 //            	<title>${htmlTitle}</title>
 //             </head>
 //             <body>
 //                 ${htmlBody}
 //             </body>
 //             </html>
 //         `
 //     }
 //     return finalHtml;
 // }
 //
 // }
 // function handler(req: Request) {
 //     if(req.method !== "GET") {
 //         return new Response(null, {status: 404})
 //     }
 //
 //
 //     const responseOptions: ResponseInit = {
 //         headers: {
 //             "Content-Type": "text/html"
 //         },
 //         status: 200
 //     }
 //
 //     const html = `
 //         <img src="saved/gif/quiet on the frontal lobe.gif">
 //     `;
 //
 //     return new Response(html, responseOptions)
 // }
 // Deno.readDir
 // for await (const dirEntry of Deno.readDir("./saved")) {
 //     console.log(dirEntry.name);
 //     Deno.read
 // }
 // const found: string[] = [];
 //
 // for await (const entry of expandGlob("**/*", {root: "./saved", exclude: })) {
 //     // found.push(entry)
 //     found.push(entry.path)
 // }
 //
 // console.log(found)
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbGU6Ly8vdmFyL3d3dy9kZW5vc2VydmVyL2ZpbGV2aWV3ZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgd2Fsa30gZnJvbSBcImpzcjpAc3RkL2ZzXCI7XG5cbi8vIERlbm8uc2VydmUoaGFuZGxlcilcbi8vXG4vL1xuLy8gZnVuY3Rpb24gbWFjSGFuZGxlcihyZXE6IFJlcXVlc3QpIHtcbi8vXG4vLyB9XG4vLyBjb25zdCBpbnRlcmZhY2VzID0gRGVuby5uZXR3b3JrSW50ZXJmYWNlcygpO1xuLy8gY29uc29sZS5sb2coaW50ZXJmYWNlcy5sZW5ndGgpOyAvLyBlLmcuIDE1XG4vLyBjb25zdCBmaXJzdCA9IGludGVyZmFjZXNbMF07XG4vLyBjb25zb2xlLmxvZyhmaXJzdC5tYWMpOyAvLyBlLmcuIGxvMCBJUHY0IDEyNy4wLjAuMVxuXG4vLyBjb25zdCBnaWZQYXRoczogc3RyaW5nW10gPSBbXTtcbi8vIGNvbnN0IGltYWdlUGF0aHM6IHN0cmluZ1tdID0gW107XG4vLyBjb25zdCB2aWRlb1BhdGhzOiBzdHJpbmdbXSA9IFtdO1xuXG4vLyBjb25zdCBodG1sID0ge1xuLy8gICAgIGltYWdlOiB7XG4vLyAgICAgICAgIG1pbWU6IFtcbi8vICAgICAgICAgLy8gZG9jdW1lbnRUaXRsZTogXCJpbWFnZXNcIixcbi8vICAgICAgICAgLy8gYm9keTogXCJcIlxuLy8gICAgIH0sXG4vLyAgICAgdmlkZW86IHtcbi8vICAgICAgICAgZG9jdW1lbnRUaXRsZTogXCJ2aWRlb3NcIixcbi8vICAgICAgICAgYm9keTogXCJcIlxuLy8gICAgIH0sXG4vLyAgICAgZ2lmOiB7XG4vLyAgICAgICAgIGRvY3VtZW50VGl0bGU6IFwiR0lGc1wiLFxuLy8gICAgICAgICBib2R5OiBcIlwiXG4vLyAgICAgfSxcbi8vIH1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB3cml0ZUdlbmVyYXRlZEh0bWxUb0Rpc2soKSB7XG4gICAgY29uc3QgbWltZXMgPSBbXVxuXG4gICAgY29uc3Qgc3JjVG9NaW1lID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZz5cblxuICAgIGNvbnN0IGh0bWxWaWRlb3M6IHN0cmluZ1tdID0gW11cbiAgICBjb25zdCBodG1sSW1hZ2VzOiBzdHJpbmdbXSA9IFtdXG4gICAgY29uc3QgaHRtbEdpZnM6IHN0cmluZ1tdID0gW11cblxuICAgIC8vIG1heSBub3QgYmUgYmUgY2FyZWZ1bCBlbm91Z2ggaGVyZSwgaWYgdW5kZWZpbmVkXG4gICAgLy8gc2hvd3MgdXAgaXQncyBiZWNhdXNlIHRoZSBpbmRleCBpcyBvdXQgb2YgYm91bmRzXG4gICAgLy8gaGFyZGNvZGVkIHRvIGJlIGZpbGVzIGxpa2UgL3NhdmVEaXIvZ2lmL2V4YW1wbGUuZ2lmXG4gICAgZm9yIGF3YWl0IChjb25zdCBlbnRyeSBvZiB3YWxrKFwiLi9zYXZlZC9cIiwgeyBpbmNsdWRlRGlyczogZmFsc2UgfSkpIHtcbiAgICAgICAgY29uc3Qgc3JjUGF0aCA9IGVudHJ5LnBhdGg7XG4gICAgICAgIGNvbnN0IHBhdGhQYXJ0cyA9IHNyY1BhdGguc3BsaXQoXCIvXCIpO1xuICAgICAgICBjb25zdCBtaW1lVHlwZSA9IHBhdGhQYXJ0c1twYXRoUGFydHMubGVuZ3RoIC0gM107XG4gICAgICAgIGNvbnN0IG1pbWVTdWJUeXBlID0gcGF0aFBhcnRzW3BhdGhQYXJ0cy5sZW5ndGggLSAyXVxuICAgICAgICBjb25zdCBtaW1lID0gYCR7bWltZVR5cGV9LyR7bWltZVN1YlR5cGV9YFxuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IHBhdGhQYXJ0c1twYXRoUGFydHMubGVuZ3RoIC0gMV07XG4gICAgICAgIG1pbWVzLnB1c2gobWltZSlcblxuICAgICAgICBzcmNUb01pbWUuc2V0KHNyY1BhdGgsIG1pbWUpO1xuXG4gICAgICAgIGNvbnN0IGFic1BhdGggPSBgLi4vJHtzcmNQYXRofWBcbiAgICAgICAgY29uc29sZS5sb2coYWJzUGF0aClcblxuICAgICAgICAvLyBjb25zdCBhYnNQYXRoID0gc3JjUGF0aDtcbiAgICAgICAgLy8gc3BlY2lhbCB0cmVhdG1lbnRcblxuICAgICAgICBsZXQgd2lkdGggPSBgd2lkdGg9MzAwYDtcbiAgICAgICAgd2lkdGggPSBcIlwiXG4gICAgICAgIGxldCBoZWlnaHQgPSBgaGVpZ2h0PTMwMGA7XG5cbiAgICAgICAgLy8gW3RhXSB0YWdcbiAgICAgICAgY29uc3Qgbm9TaXplTGltaXQgPVxuICAgICAgICAgICAgZmlsZU5hbWUuY2hhckF0KDApID09IFwiW1wiXG4gICAgICAgICAgICAmJiBmaWxlTmFtZS5jaGFyQXQoMSkgPT0gXCJ0XCJcbiAgICAgICAgICAgICYmIGZpbGVOYW1lLmNoYXJBdCgyKSA9PSBcImFcIlxuICAgICAgICAgICAgJiYgZmlsZU5hbWUuY2hhckF0KDMpID09IFwiXVwiO1xuICAgICAgICBpZihub1NpemVMaW1pdCkge1xuICAgICAgICAgICAgd2lkdGg9XCJcIlxuICAgICAgICAgICAgaGVpZ2h0PVwiXCJcbiAgICAgICAgfVxuXG5cblxuICAgICAgICBpZihtaW1lU3ViVHlwZSA9PT0gXCJnaWZcIikge1xuICAgICAgICAgICAgaHRtbEdpZnMucHVzaChgPGltZyAke3dpZHRofSAke2hlaWdodH0gc3JjPVwiJHthYnNQYXRofVwiIHR5cGU9XCIke21pbWV9XCI+YClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmKG1pbWVUeXBlID09PSBcImltYWdlXCIpIHtcbiAgICAgICAgICAgIGh0bWxJbWFnZXMucHVzaChgPGltZyAke3dpZHRofSAke2hlaWdodH0gc3JjPVwiJHthYnNQYXRofVwiIHR5cGU9XCIke21pbWV9XCI+YClcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYobWltZVR5cGUgPT09IFwidmlkZW9cIikge1xuICAgICAgICAgICAgaHRtbFZpZGVvcy5wdXNoKGBcbiAgICAgICAgICAgICAgICA8dmlkZW8gJHt3aWR0aH0gJHtoZWlnaHR9IGNvbnRyb2xzPlxuICAgICAgICAgICAgICAgICAgICA8c291cmNlIHNyYz1cIiR7YWJzUGF0aH1cIiB0eXBlPVwiJHttaW1lfVwiPlxuICAgICAgICAgICAgICAgIDwvdmlkZW8+XG4gICAgICAgICAgICBgKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhodG1sSW1hZ2VzKVxuXG4gICAgY29uc3QgaHRtbCA9IHtcbiAgICAgICAgaW1hZ2U6IHtcbiAgICAgICAgICAgIGJvZHk6IGh0bWxJbWFnZXNcbiAgICAgICAgfSxcbiAgICAgICAgZ2lmOiB7XG4gICAgICAgICAgICBib2R5OiBodG1sR2lmc1xuICAgICAgICB9LFxuICAgICAgICB2aWRlbzoge1xuICAgICAgICAgICAgYm9keTogaHRtbFZpZGVvc1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBjb25zdCBhbGxIdG1sTWVkaWEgPSBbLi4uaHRtbEdpZnMsIC4uLmh0bWxJbWFnZXMsIC4uLmh0bWxWaWRlb3NdXG4gICAgLy8gTWF0aC5yYW5kb20oKVxuXG4gICAgbGV0IHJhbmRvbUh0bWxNZWRpYSA9IGFsbEh0bWxNZWRpYVtNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAoYWxsSHRtbE1lZGlhLmxlbmd0aCAtIDEpKV07XG5cbiAgICBjb25zdCBhbGxIdG1sID0gW2h0bWxHaWZzLmpvaW4oXCJcIiksIGh0bWxJbWFnZXMuam9pbihcIlwiKSwgaHRtbFZpZGVvcy5qb2luKFwiXCIpXVxuICAgIGNvbnN0IGRvY3VtZW50VGl0bGUgPSBcImdlcmFsZDMgYXJjaGl2ZXNcIlxuXG4gICAgLy8gY29uc3QgdmluZGluZzpzdHJpbmcgPSB0ZXN0QXJyLmpvaW4oXCJcIik7XG4gICAgLy8gY29uc29sZS5sb2codmluZGluZylcblxuICAgIC8vIGNvbnNvbGUubG9nKGFsbEh0bWwpXG5cbiAgICAvLyB0aGlzIGRvZXMgY3JlYXRlIGEgY29tbWEgYmV0d2VlbiB0aGUgZWxlbWVudHMgaW4gdGhlIGFycmF5XG4gICAgY29uc3QgZmluYWxIdG1sID1cbiAgICBgPCFET0NUWVBFIGh0bWw+XG4gICAgPGh0bWwgbGFuZz1cImVuXCI+XG4gICAgPGhlYWQ+XG4gICAgICAgIDxzdHlsZT5cbiAgICAgICAgICAgIGJvZHkge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGdyZXk7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICAgICAgICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgICAgIC8vIGhlaWdodDogODB2aDtcbiAgICAgICAgICAgICAgICAvLyBtYXJnaW46IDBweDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgPC9zdHlsZT5cbiAgICAgICBcdDxtZXRhIGNoYXJzZXQ9XCJVVEYtOFwiPlxuICAgICAgIFx0PG1ldGEgbmFtZT1cInZpZXdwb3J0XCIgY29udGVudD1cIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjBcIj5cbiAgICAgICBcdDx0aXRsZT4ke2RvY3VtZW50VGl0bGV9PC90aXRsZT5cbiAgICA8L2hlYWQ+XG4gICAgPGhlYWRlcj5cbiAgICAgICAgPGRldGFpbHM+XG4gICAgICAgXHQgICAgPHN1bW1hcnkgc3R5bGU9XCJjb2xvcjogd2hlYXQ7XCI+U2hyw7ZkaW5nZXJzIG1lbWU8L3N1bW1hcnk+XG4gICAgICAgICAgICAke3JhbmRvbUh0bWxNZWRpYX1cbiAgICAgICAgPC9kZXRhaWxzPlxuICAgIDwvaGVhZGVyPlxuXG4gICAgPGJvZHk+XG4gICAgICAgIDxmb3JtIG1ldGhvZD1cIlBPU1RcIiBlbmN0eXBlPVwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiPlxuICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJmaWxlXCIgdHlwZT1cImZpbGVcIiAvPlxuICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJwYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiLz5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiPlVwbG9hZDwvYnV0dG9uPlxuICAgICAgICA8L2Zvcm0+XG5cblxuICAgICAgICAke2FsbEh0bWwuam9pbihcIlwiKX1cbiAgICA8L2JvZHk+XG4gICAgPC9odG1sPmBcblxuICAgIC8vIGNvbnNvbGUubG9nKGZpbmFsSHRtbClcblxuICAgIC8vIGNvbnN0IGZpbGUgPSBEZW5vLmNyZWF0ZShcIi4vZ2VuZXJhdGVkLmh0bWxcIik7XG4gICAgRGVuby53cml0ZVRleHRGaWxlKFwiLi9nZW5lcmF0ZWQuaHRtbFwiLCBmaW5hbEh0bWwpO1xuICAgIHJldHVybiBmaW5hbEh0bWw7XG59XG5cblxuLy8gdGhyb3cgRXJyb3IoXCJSZWFjaGVkIG9sZCBjb2RlXCIpO1xuLy9cbi8vIHtcbi8vIGNvbnN0IGdpZlBhdGhzOiBzdHJpbmdbXSA9IFtdO1xuLy8gY29uc3QgaW1hZ2VQYXRoczogc3RyaW5nW10gPSBbXTtcbi8vIGNvbnN0IHZpZGVvUGF0aHM6IHN0cmluZ1tdID0gW107XG4vL1xuLy8gLy8gbWF5IG5vdCBiZSBiZSBjYXJlZnVsIGVub3VnaCBoZXJlLCBpZiB1bmRlZmluZWRcbi8vIC8vIHNob3dzIHVwIGl0J3MgYmVjYXVzZSB0aGUgaW5kZXggaXMgb3V0IG9mIGJvdW5kc1xuLy8gLy8gaGFyZGNvZGVkIHRvIGJlIGZpbGVzIGxpa2UgL3NhdmVEaXIvZ2lmL2V4YW1wbGUuZ2lmXG4vLyBmb3IgYXdhaXQgKGNvbnN0IGVudHJ5IG9mIHdhbGsoXCIuL3NhdmVkL1wiLCB7IGluY2x1ZGVEaXJzOiBmYWxzZSB9KSkge1xuLy8gICAgIGNvbnN0IGVudHJ5UGF0aCA9IGVudHJ5LnBhdGg7XG4vLyAgICAgY29uc3QgcGF0aFBhcnRzID0gZW50cnlQYXRoLnNwbGl0KFwiL1wiKTtcbi8vICAgICBjb25zdCBmaWxlVHlwZSA9IHBhdGhQYXJ0c1twYXRoUGFydHMubGVuZ3RoIC0gMl07XG4vLyAgICAgY29uc3QgZmlsZU5hbWUgPSBwYXRoUGFydHNbcGF0aFBhcnRzLmxlbmd0aCAtIDFdO1xuLy8gICAgIHN3aXRjaChmaWxlVHlwZSkge1xuLy8gICAgICAgICBjYXNlIFwiZ2lmXCI6IGdpZlBhdGhzLnB1c2goZW50cnlQYXRoKVxuLy8gICAgICAgICAgICAgYnJlYWtcbi8vICAgICAgICAgY2FzZSBcImltYWdlXCI6IGltYWdlUGF0aHMucHVzaChlbnRyeVBhdGgpO1xuLy8gICAgICAgICAgICAgYnJlYWs7XG4vLyAgICAgICAgIGNhc2UgXCJ2aWRlb1wiOiB2aWRlb1BhdGhzLnB1c2goZW50cnlQYXRoKVxuLy8gICAgICAgICAgICAgYnJlYWtcbi8vICAgICB9XG4vLyB9XG4vLyBjb25zb2xlLmxvZyhgR0lGUzogJHtnaWZQYXRoc31cXG5JTUFHRVM6ICR7aW1hZ2VQYXRoc31cXG5WSURFT1M6ICR7dmlkZW9QYXRoc31gKVxuLy9cbi8vIGNvbnNvbGUubG9nKFwiXFxuXCIpXG4vLyBjb25zb2xlLmxvZyhnZXRIdG1sKFwiaW1hZ2VcIiwgaW1hZ2VQYXRocykpXG4vL1xuLy8gZnVuY3Rpb24gZ2V0SHRtbChkaXNwbGF5TW9kZTogc3RyaW5nLCBkaXNwbGF5TW9kZVBhdGhzOiBzdHJpbmdbXSkge1xuLy8gICAgIC8vIGNvbnN0IGRpc3BsYXlNb2RlcyA9IFtcImdpZlwiLCBcImltYWdlXCIsIFwidmlkZW9cIl07XG4vL1xuLy8gICAgIGNvbnN0IGRpc3BsYXlNb2RlcyA9IFtkaXNwbGF5TW9kZV1cbi8vICAgICBsZXQgZmluYWxIdG1sOiBzdHJpbmcgPSBcIlwiO1xuLy8gICAgIGZvcihjb25zdCBkaXNwbGF5TW9kZSBvZiBkaXNwbGF5TW9kZXMpIHtcbi8vICAgICAgICAgbGV0IGh0bWxCb2R5OiBzdHJpbmcgPSBcIk5PIFNXSVRDSCBDQVNFIEFDVElWQVRFRC5cIjtcbi8vXG4vLyAgICAgICAgIHN3aXRjaChkaXNwbGF5TW9kZSkge1xuLy8gICAgICAgICAgICAgY2FzZSBcImdpZlwiOiB7XG4vLyAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJIQUxMT1wiKVxuLy8gICAgICAgICAgICAgICAgIGNvbnN0IGdpZlBhdGhzID0gZGlzcGxheU1vZGVQYXRoc1xuLy8gICAgICAgICAgICAgICAgIGZvcihjb25zdCBnaWZQYXRoIG9mIGdpZlBhdGhzKSB7XG4vLyAgICAgICAgICAgICAgICAgICAgIGh0bWxCb2R5ID0gYDxpbWcgc3JjPVwiJHtnaWZQYXRofVwiPmBcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICBicmVhaztcbi8vICAgICAgICAgICAgIGNhc2UgXCJpbWFnZVwiOiB7XG4vLyAgICAgICAgICAgICAgICAgY29uc3QgaW1hZ2VQYXRocyA9IGRpc3BsYXlNb2RlUGF0aHNcbi8vICAgICAgICAgICAgICAgICBmb3IoY29uc3QgaW1hZ2VQYXRoIG9mIGltYWdlUGF0aHMpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coaW1hZ2VQYXRoKVxuLy8gICAgICAgICAgICAgICAgICAgICBodG1sQm9keSA9IGA8aW1nIHNyYz1cIiR7aW1hZ2VQYXRofVwiPmBcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICBicmVhaztcbi8vICAgICAgICAgICAgIGNhc2UgXCJ2aWRlb1wiOiB7XG4vLyAgICAgICAgICAgICAgICAgY29uc3QgdmlkZW9QYXRocyA9IGRpc3BsYXlNb2RlUGF0aHNcbi8vICAgICAgICAgICAgICAgICBmb3IoY29uc3QgdmlkZW9QYXRoIG9mIHZpZGVvUGF0aHMpIHtcbi8vICAgICAgICAgICAgICAgICAgICAgaHRtbEJvZHkgPVxuLy8gICAgICAgICAgICAgICAgICAgICBgPHZpZGVvIHdpZHRoPVwiNDAwXCIgaGVpZ2h0PVwiMjQwXCIgY29udHJvbHM+XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICA8c291cmNlIHNyYz1cIiR7dmlkZW9QYXRofVwiPlxuLy8gICAgICAgICAgICAgICAgICAgICA8L3ZpZGVvPmBcbi8vICAgICAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICBicmVhaztcbi8vICAgICAgICAgfVxuLy9cbi8vXG4vL1xuLy8gICAgICAgICBjb25zdCBodG1sVGl0bGUgPSBkaXNwbGF5TW9kZTtcbi8vICAgICAgICAgZmluYWxIdG1sID0gYFxuLy8gICAgICAgICAgICAgPCFET0NUWVBFIGh0bWw+XG4vLyAgICAgICAgICAgICA8aHRtbCBsYW5nPVwiZW5cIj5cbi8vICAgICAgICAgICAgIDxoZWFkPlxuLy8gICAgICAgICAgICBcdDxtZXRhIGNoYXJzZXQ9XCJVVEYtOFwiPlxuLy8gICAgICAgICAgICBcdDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXCI+XG4vLyAgICAgICAgICAgIFx0PHRpdGxlPiR7aHRtbFRpdGxlfTwvdGl0bGU+XG4vLyAgICAgICAgICAgICA8L2hlYWQ+XG4vLyAgICAgICAgICAgICA8Ym9keT5cbi8vICAgICAgICAgICAgICAgICAke2h0bWxCb2R5fVxuLy8gICAgICAgICAgICAgPC9ib2R5PlxuLy8gICAgICAgICAgICAgPC9odG1sPlxuLy8gICAgICAgICBgXG4vLyAgICAgfVxuLy8gICAgIHJldHVybiBmaW5hbEh0bWw7XG4vLyB9XG4vL1xuLy8gfVxuXG4vLyBmdW5jdGlvbiBoYW5kbGVyKHJlcTogUmVxdWVzdCkge1xuLy8gICAgIGlmKHJlcS5tZXRob2QgIT09IFwiR0VUXCIpIHtcbi8vICAgICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiA0MDR9KVxuLy8gICAgIH1cbi8vXG4vL1xuLy8gICAgIGNvbnN0IHJlc3BvbnNlT3B0aW9uczogUmVzcG9uc2VJbml0ID0ge1xuLy8gICAgICAgICBoZWFkZXJzOiB7XG4vLyAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcInRleHQvaHRtbFwiXG4vLyAgICAgICAgIH0sXG4vLyAgICAgICAgIHN0YXR1czogMjAwXG4vLyAgICAgfVxuLy9cbi8vICAgICBjb25zdCBodG1sID0gYFxuLy8gICAgICAgICA8aW1nIHNyYz1cInNhdmVkL2dpZi9xdWlldCBvbiB0aGUgZnJvbnRhbCBsb2JlLmdpZlwiPlxuLy8gICAgIGA7XG4vL1xuLy8gICAgIHJldHVybiBuZXcgUmVzcG9uc2UoaHRtbCwgcmVzcG9uc2VPcHRpb25zKVxuLy8gfVxuXG5cbi8vIERlbm8ucmVhZERpclxuXG4vLyBmb3IgYXdhaXQgKGNvbnN0IGRpckVudHJ5IG9mIERlbm8ucmVhZERpcihcIi4vc2F2ZWRcIikpIHtcbi8vICAgICBjb25zb2xlLmxvZyhkaXJFbnRyeS5uYW1lKTtcbi8vICAgICBEZW5vLnJlYWRcbi8vIH1cblxuLy8gY29uc3QgZm91bmQ6IHN0cmluZ1tdID0gW107XG4vL1xuLy8gZm9yIGF3YWl0IChjb25zdCBlbnRyeSBvZiBleHBhbmRHbG9iKFwiKiovKlwiLCB7cm9vdDogXCIuL3NhdmVkXCIsIGV4Y2x1ZGU6IH0pKSB7XG4vLyAgICAgLy8gZm91bmQucHVzaChlbnRyeSlcbi8vICAgICBmb3VuZC5wdXNoKGVudHJ5LnBhdGgpXG4vLyB9XG4vL1xuLy8gY29uc29sZS5sb2coZm91bmQpXG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUyxJQUFJLFFBQU8sY0FBYztBQUVsQyxzQkFBc0I7QUFDdEIsRUFBRTtBQUNGLEVBQUU7QUFDRixzQ0FBc0M7QUFDdEMsRUFBRTtBQUNGLElBQUk7QUFDSiwrQ0FBK0M7QUFDL0MsNkNBQTZDO0FBQzdDLCtCQUErQjtBQUMvQixxREFBcUQ7QUFFckQsaUNBQWlDO0FBQ2pDLG1DQUFtQztBQUNuQyxtQ0FBbUM7QUFFbkMsaUJBQWlCO0FBQ2pCLGVBQWU7QUFDZixrQkFBa0I7QUFD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
// denoCacheMetadata=5970094554555756392,3343138101270902456