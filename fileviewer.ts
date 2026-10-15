import { walk} from "jsr:@std/fs";

Deno.serve(handler)


const found: string[] = [];
for await (const entry of walk("./saved/gif", { includeDirs: false })) {
    found.push(entry.path);
}
console.log(found);



function handler(req: Request) {
    if(req.method !== "GET") {
        return new Response(null, {status: 404})
    }


    const responseOptions: ResponseInit = {
        headers: {
            "Content-Type": "text/html"
        },
        status: 200
    }

    const html = `
        <img src="saved/gif/quiet on the frontal lobe.gif">
    `;

    return new Response(html, responseOptions)
}


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
