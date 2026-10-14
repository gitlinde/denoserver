// import { serveDir } from "jsr:@std/http/file-server";

// handlers take request as input, response as output
// Deno.serve({ port: 4242 }, async (req) => {
//     console.log(`Method ${req.method}`)
//
//     let url = new URL(req.url);
//     // console.log("request URL:\n")
//     console.log(`Path: ${url.pathname}`)
//     console.log(`query params: `, url.searchParams)
//     // console.log(`$Query params ${}`)
//     // req.hea
//     console.log(`headers`, req.headers);½
//
//     if(req.body) {
//         const body = await req.text();
//         console.log("Body:", body)
//     }
//
//     return new Response("hi!");
// });


// simply going on the webpage is the GET request.
// Deno.serve((req) => {
//     const body = JSON.stringify({ message: "NUH UH!", reqType: req.method })
//     return new Response(body,  {
//         status: 404,
//         headers: {
//             "content-type": "application/json; charset=utf-8",
//         }
//     })
// });


// LETS GIVE UP ON STREAMS FOR NOW! YOU WON'T NEED THEM..
// Deno.serve((req) => {
//     let timer: number ;
//     const body = ReadableStream({
//        async start(controller) {
//            timer = setInterval(() => {
//                controller.enqueue("Hello world!\n")
//            }, 1000);
//        }
//        cancel() {
//            clearInterval(timer);
//        }
//     });
//
//     // const body = new ReadableStream({
//     //     async start(controller) {
//     //       timer = setInterval(() => {
//     //         controller.enqueue("Hello, World!\n");
//     //       }, 1000);
//     //     },
//     //     cancel() {
//     //       clearInterval(timer);
//     //     },
//     //   });
//
// });




//
// const userPattern = new URLPattern({ pathname: "/users/:id" })
// Deno.serve((req) => {
//     const match = userPattern.exec(req.url);
//     if(match) {
//         const id = match.pathname.groups.id;
//         return new Response(`Id: ${id}`)
//     }
//     if(new URL(req.url).pathname === "/") {
//         return new Response("Home")
//     }
//     return new Response("DID NOT FIND!", { status: 404 });
// });
//
//


// auto serves files in browsers
// need perms to run:
// deno run --allow-net --allow-read jsr:@std/http/file-server

// Deno.serve((req) =>
//     serveDir(req, { fsRoot: "./" })
//     // return Response()
// )




Deno.serve((req) => {
    if(req.headers.get("upgrade") != "websocket") {
        return new Response(null, { status: 426 })
    }

    const { socket, response } = Deno.upgradeWebSocket(req);

    socket.addEventListener("open", () => {
        console.log(`client connected`)
    })

    socket.addEventListener("message", (event) => {
        if(event.data === "ping\n") {
            socket.send("pong")
        }
    })

    return response;
});

// const ws = new WebSocket("ws://localhost:8000")
//
// ws.ono



// export function handler(req: Request): Response {
//   const url = new URL(req.url);
//
//   if (url.pathname === "/api") {
//     return Response.json({
//       message: "Hello, world!",
//       time: new Date().toISOString(),
//     });
//   }
//
//   return new Response("<h1>Welcome to Deno!</h1>", {
//     headers: { "content-type": "text/html" },
//   });
// }
//
// if (import.meta.main) {
//   Deno.serve(handler);
// }





{   // Create file exercises
    // const fileName: string = "Penis.txt"
    // const sanitizedFileName: string = firstLetterToLowerCase(sanitizeFileName(fileName));
    //
    //
    //
    //
    // const int8Nums: number[] = []
    //
    // for (let i = 0; i < 1; ++i) {
    //     const randomNum = Math.round(Math.random() * 256);
    //     int8Nums.push(randomNum);
    // }
    //
    // const bytes = new Uint8Array(int8Nums)
    // // LET'S WRITE A FILE
    // // await Deno.writeFile(sanitizedFileName, bytes);
    //
    // // LET'S WRITE A GRANULAR FILE!
    // const file = await Deno.create(sanitizedFileName);
    // // const written = await file.write(bytes);
    // // console.log(`${written} bytes written`)
    //
    //
    // // LET'S WRITE A GRANULAR FILE THAT ENSURES EVERYTHING IS WRITTEN!
    // const writer = file.writable.getWriter();
    // await file.truncate(0)
    //
    // // await writer.write(new TextEncoder().encode("VINDaaaa!"))
    // await writer.write(bytes)
    // // if the writer isn't closed, the text doesn't get saved
    // await writer.close()
}
