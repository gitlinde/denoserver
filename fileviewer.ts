import { walk} from "jsr:@std/fs";

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
    const mimes = []

    const srcToMime = new Map<string, string>

    const htmlVideos: string[] = []
    const htmlImages: string[] = []
    const htmlGifs: string[] = []

    // may not be be careful enough here, if undefined
    // shows up it's because the index is out of bounds
    // hardcoded to be files like /saveDir/gif/example.gif
    for await (const entry of walk("./saved/", { includeDirs: false })) {
        const srcPath = entry.path;
        const pathParts = srcPath.split("/");
        const mimeType = pathParts[pathParts.length - 3];
        const mimeSubType = pathParts[pathParts.length - 2]
        const mime = `${mimeType}/${mimeSubType}`
        const fileName = pathParts[pathParts.length - 1];
        mimes.push(mime)

        srcToMime.set(srcPath, mime);

        const absPath = `../${srcPath}`
        console.log(absPath)

        // const absPath = srcPath;
        // special treatment
        if(mimeSubType === "gif") {
            htmlGifs.push(`<img width="300" height="300" src="${absPath}" type="${mime}">`)
            continue;
        }
        if(mimeType === "image") {
            htmlImages.push(`<img width="300" height="300" src="${absPath}" type="${mime}">`)
            continue;
        }

        if(mimeType === "video") {
            htmlVideos.push(`
                <video width="300" height="300" controls>
                    <source src="${absPath}" type="${mime}">
                </video>
            `)
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
    }

    const allHtml = [htmlGifs.join(""), htmlImages.join(""), htmlVideos.join("")]

    const testArr = ["ligma", "sigma"]

    // const vinding:string = testArr.join("");
    // console.log(vinding)

    // console.log(allHtml)

    // this does create a comma between the elements in the array
    const finalHtml =
    `<!DOCTYPE html>
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
       	<title>${"Funny media 🤪"}</title>
    </head>
    <body>
        <form method="POST" enctype="multipart/form-data">
            <input name="file" type="file" />
            <input name="password" type="password"/>
            <button type="submit">Upload</button>
        </form>${allHtml.join("")}
    </body>
    </html>`

    // console.log(finalHtml)

    // const file = Deno.create("./generated.html");
    Deno.writeTextFile("./generated.html", finalHtml);
    return finalHtml;
}


// throw Error("Reached old code");
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
