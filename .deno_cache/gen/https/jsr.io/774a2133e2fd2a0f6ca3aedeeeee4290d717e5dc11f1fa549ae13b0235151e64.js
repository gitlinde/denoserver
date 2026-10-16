#!/usr/bin/env -S deno run --allow-net --allow-read
// Copyright 2018-2026 the Deno authors. MIT license.
// This program serves files in the current directory over HTTP.
// TODO(bartlomieju): Add tests like these:
// https://github.com/indexzero/http-server/blob/master/test/http-server-test.js
/**
 * Contains functions {@linkcode serveDir} and {@linkcode serveFile} for
 * building a static file server.
 *
 * This module can also be used as a CLI. If you want to run it directly:
 *
 * ```shell
 * > # start server
 * > deno run --allow-net --allow-read --allow-sys jsr:@std/http/file-server
 * > # show help
 * > deno run jsr:@std/http/file-server --help
 * ```
 *
 * If you want to install and run:
 *
 * ```shell
 * > # install
 * > deno install --allow-net --allow-read --allow-sys --global jsr:@std/http/file-server
 * > # start server
 * > file-server
 * > # show help
 * > file-server --help
 * ```
 *
 * @module
 */ import { normalize as posixNormalize } from "jsr:@std/path@^1.1.6/posix/normalize";
import { extname } from "jsr:@std/path@^1.1.6/extname";
import { isAbsolute } from "jsr:@std/path@^1.1.6/is-absolute";
import { join } from "jsr:@std/path@^1.1.6/join";
import { relative } from "jsr:@std/path@^1.1.6/relative";
import { resolve } from "jsr:@std/path@^1.1.6/resolve";
import { SEPARATOR, SEPARATOR_PATTERN } from "jsr:@std/path@^1.1.6/constants";
import { exists } from "jsr:@std/fs@^1.0.24/exists";
import { contentType } from "jsr:@std/media-types@^1.1.0/content-type";
import { eTag, ifNoneMatch } from "./etag.ts";
import { isRedirectStatus, STATUS_CODE, STATUS_TEXT } from "./status.ts";
import { ByteSliceStream } from "jsr:@std/streams@^1.2.0/byte-slice-stream";
import { parseArgs } from "jsr:@std/cli@^1.0.32/parse-args";
import denoConfig from "./deno.json" with {
  type: "json"
};
import { format as formatBytes } from "jsr:@std/fmt@^1.0.10/bytes";
import { getNetworkAddress } from "jsr:@std/net@^1.0.7/unstable-get-network-address";
import { escape } from "jsr:@std/html@^1.0.7/entities";
import { HEADER } from "./unstable_header.ts";
import { METHOD } from "./unstable_method.ts";
import { html } from "jsr:@std/html@^1.0.7/unstable-html";
const ENV_PERM_STATUS = typeof Deno !== "undefined" ? Deno.permissions.querySync?.({
  name: "env",
  variable: "DENO_DEPLOYMENT_ID"
}).state ?? "granted" : "granted"; // for deno deploy
const NET_PERM_STATUS = typeof Deno !== "undefined" ? Deno.permissions.querySync?.({
  name: "sys",
  kind: "networkInterfaces"
}).state ?? "granted" : "granted"; // for deno deploy
const DENO_DEPLOYMENT_ID = ENV_PERM_STATUS === "granted" && typeof Deno !== "undefined" ? Deno.env.get("DENO_DEPLOYMENT_ID") : undefined;
const HASHED_DENO_DEPLOYMENT_ID = DENO_DEPLOYMENT_ID ? eTag(DENO_DEPLOYMENT_ID, {
  weak: true
}) : undefined;
function modeToString(isDir, maybeMode) {
  const modeMap = [
    "---",
    "--x",
    "-w-",
    "-wx",
    "r--",
    "r-x",
    "rw-",
    "rwx"
  ];
  if (maybeMode === null) {
    return "(unknown mode)";
  }
  const mode = maybeMode.toString(8).padStart(3, "0");
  let output = "";
  mode.split("").reverse().slice(0, 3).forEach((v)=>{
    output = `${modeMap[+v]} ${output}`;
  });
  output = `${isDir ? "d" : "-"} ${output}`;
  return output;
}
function createStandardResponse(status, init) {
  const statusText = STATUS_TEXT[status];
  return new Response(statusText, {
    status,
    statusText,
    ...init
  });
}
/**
 * parse range header.
 *
 * ```ts ignore
 * parseRangeHeader("bytes=0-100",   500); // => { start: 0, end: 100 }
 * parseRangeHeader("bytes=0-",      500); // => { start: 0, end: 499 }
 * parseRangeHeader("bytes=-100",    500); // => { start: 400, end: 499 }
 * parseRangeHeader("bytes=invalid", 500); // => null
 * ```
 *
 * Note: Currently, no support for multiple Ranges (e.g. `bytes=0-10, 20-30`)
 */ function parseRangeHeader(rangeValue, fileSize) {
  const rangeRegex = /bytes=(?<start>\d+)?-(?<end>\d+)?$/u;
  const parsed = rangeValue.match(rangeRegex);
  if (!parsed || !parsed.groups) {
    // failed to parse range header
    return null;
  }
  const { start, end } = parsed.groups;
  if (start !== undefined) {
    if (end !== undefined) {
      return {
        start: +start,
        end: +end
      };
    } else {
      return {
        start: +start,
        end: fileSize - 1
      };
    }
  } else {
    if (end !== undefined) {
      // example: `bytes=-100` means the last 100 bytes.
      return {
        start: fileSize - +end,
        end: fileSize - 1
      };
    } else {
      // failed to parse range header
      return null;
    }
  }
}
/**
 * Resolves a {@linkcode Response} with the requested file as the body.
 *
 * @example Usage
 * ```ts ignore
 * import { serveFile } from "@std/http/file-server";
 *
 * Deno.serve((req) => {
 *   return serveFile(req, "README.md");
 * });
 * ```
 *
 * @param req The server request context used to cleanup the file handle.
 * @param filePath Path of the file to serve.
 * @param options Additional options.
 * @returns A response for the request.
 */ export async function serveFile(req, filePath, options) {
  await req.body?.cancel();
  if (req.method !== METHOD.Get && req.method !== METHOD.Head) {
    return createStandardResponse(STATUS_CODE.MethodNotAllowed);
  }
  let { etagAlgorithm: algorithm = "SHA-256", fileInfo } = options ?? {};
  try {
    fileInfo ??= await Deno.stat(filePath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return createStandardResponse(STATUS_CODE.NotFound);
    } else {
      throw error;
    }
  }
  if (fileInfo.isDirectory) {
    return createStandardResponse(STATUS_CODE.NotFound);
  }
  const headers = createBaseHeaders();
  const etag = fileInfo.mtime ? await eTag(fileInfo, {
    algorithm
  }) : await HASHED_DENO_DEPLOYMENT_ID;
  // Set last modified header if last modification timestamp is available
  if (fileInfo.mtime) {
    headers.set(HEADER.LastModified, fileInfo.mtime.toUTCString());
  }
  if (etag) {
    headers.set(HEADER.ETag, etag);
  }
  // Set mime-type using the file extension in filePath
  const contentTypeValue = contentType(extname(filePath));
  if (contentTypeValue) {
    headers.set(HEADER.ContentType, contentTypeValue);
  }
  const fileSize = fileInfo.size;
  if (etag || fileInfo.mtime) {
    // If a `if-none-match` header is present and the value matches the tag or
    // if a `if-modified-since` header is present and the value is bigger than
    // the access timestamp value, then return 304
    const ifNoneMatchValue = req.headers.get(HEADER.IfNoneMatch);
    const ifModifiedSinceValue = req.headers.get(HEADER.IfModifiedSince);
    if (!ifNoneMatch(ifNoneMatchValue, etag) || ifNoneMatchValue === null && fileInfo.mtime && ifModifiedSinceValue && fileInfo.mtime.getTime() < new Date(ifModifiedSinceValue).getTime() + 1000) {
      const status = STATUS_CODE.NotModified;
      return new Response(null, {
        status,
        statusText: STATUS_TEXT[status],
        headers
      });
    }
  }
  if (req.method === METHOD.Head) {
    // Set content length
    headers.set(HEADER.ContentLength, `${fileSize}`);
    const status = STATUS_CODE.OK;
    return new Response(null, {
      status,
      statusText: STATUS_TEXT[status],
      headers
    });
  }
  const rangeValue = req.headers.get(HEADER.Range);
  // handle range request
  // Note: Some clients add a Range header to all requests to limit the size of the response.
  // If the file is empty, ignore the range header and respond with a 200 rather than a 416.
  // https://github.com/golang/go/blob/0d347544cbca0f42b160424f6bc2458ebcc7b3fc/src/net/http/fs.go#L273-L276
  if (rangeValue && 0 < fileSize) {
    const parsed = parseRangeHeader(rangeValue, fileSize);
    // Returns 200 OK if parsing the range header fails
    if (!parsed) {
      // Set content length
      headers.set(HEADER.ContentLength, `${fileSize}`);
      const file = await Deno.open(filePath);
      const status = STATUS_CODE.OK;
      return new Response(file.readable, {
        status,
        statusText: STATUS_TEXT[status],
        headers
      });
    }
    // Return 416 Range Not Satisfiable if invalid range header value
    if (parsed.end < 0 || parsed.end < parsed.start || fileSize <= parsed.start) {
      // Set the "Content-range" header
      headers.set(HEADER.ContentRange, `bytes */${fileSize}`);
      return createStandardResponse(STATUS_CODE.RangeNotSatisfiable, {
        headers
      });
    }
    // clamps the range header value
    const start = Math.max(0, parsed.start);
    const end = Math.min(parsed.end, fileSize - 1);
    // Set the "Content-range" header
    headers.set(HEADER.ContentRange, `bytes ${start}-${end}/${fileSize}`);
    // Set content length
    const contentLength = end - start + 1;
    headers.set(HEADER.ContentLength, `${contentLength}`);
    // Return 206 Partial Content
    const file = await Deno.open(filePath);
    await file.seek(start, Deno.SeekMode.Start);
    const sliced = file.readable.pipeThrough(new ByteSliceStream(0, contentLength - 1));
    const status = STATUS_CODE.PartialContent;
    return new Response(sliced, {
      status,
      statusText: STATUS_TEXT[status],
      headers
    });
  }
  // Set content length
  headers.set(HEADER.ContentLength, `${fileSize}`);
  const file = await Deno.open(filePath);
  const status = STATUS_CODE.OK;
  return new Response(file.readable, {
    status,
    statusText: STATUS_TEXT[status],
    headers
  });
}
async function serveDirIndex(req, dirPath, options) {
  const { showDotfiles } = options;
  const dirUrl = `/${relative(options.target, dirPath).replaceAll(new RegExp(SEPARATOR_PATTERN, "g"), "/")}`;
  const listEntryPromise = [];
  // if ".." makes sense
  if (dirUrl !== "/") {
    const prevPath = join(dirPath, "..");
    const entryInfo = Deno.stat(prevPath).then((fileInfo)=>({
        mode: modeToString(true, fileInfo.mode),
        size: "",
        name: "../",
        url: ".."
      }));
    listEntryPromise.push(entryInfo);
  }
  // Read fileInfo in parallel
  for await (const entry of Deno.readDir(dirPath)){
    if (!showDotfiles && entry.name[0] === ".") {
      continue;
    }
    const filePath = join(dirPath, entry.name);
    const fileUrl = encodeURIComponent(entry.name).replaceAll("%2F", "/");
    listEntryPromise.push((async ()=>{
      try {
        const fileInfo = await Deno.stat(filePath);
        return {
          mode: modeToString(entry.isDirectory, fileInfo.mode),
          size: entry.isFile ? formatBytes(fileInfo.size ?? 0) : "",
          name: `${entry.name}${entry.isDirectory ? "/" : ""}`,
          url: `./${fileUrl}${entry.isDirectory ? "/" : ""}`
        };
      } catch (error) {
        // Note: Deno.stat for windows system files may be rejected with os error 32.
        if (!options.quiet) logError(error);
        return {
          mode: "(unknown mode)",
          size: "",
          name: `${entry.name}${entry.isDirectory ? "/" : ""}`,
          url: `./${fileUrl}${entry.isDirectory ? "/" : ""}`
        };
      }
    })());
  }
  const listEntry = await Promise.all(listEntryPromise);
  listEntry.sort((a, b)=>// TODO(iuioiua): Add test to ensure list order is correct
    a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
  const formattedDirUrl = `${dirUrl.replace(/\/$/, "")}/`;
  const page = dirViewerTemplate(formattedDirUrl, listEntry);
  const headers = createBaseHeaders();
  headers.set(HEADER.ContentType, "text/html; charset=UTF-8");
  if (req.method === METHOD.Head) {
    const pageSize = new TextEncoder().encode(page).byteLength;
    headers.set(HEADER.ContentLength, String(pageSize));
  }
  const status = STATUS_CODE.OK;
  return new Response(req.method === METHOD.Head ? null : page, {
    status,
    statusText: STATUS_TEXT[status],
    headers
  });
}
function serverLog(req, status) {
  const d = new Date().toISOString();
  const dateFmt = `[${d.slice(0, 10)} ${d.slice(11, 19)}]`;
  const url = new URL(req.url);
  const s = `${dateFmt} [${req.method}] ${url.pathname}${url.search} ${status}`;
  // using console.debug instead of console.log so chrome inspect users can hide request logs
  // deno-lint-ignore no-console
  console.debug(s);
}
function createBaseHeaders() {
  return new Headers({
    server: "deno",
    // Set "accept-ranges" so that the client knows it can make range requests on future requests
    [HEADER.AcceptRanges]: "bytes"
  });
}
function dirViewerTemplate(dirname, entries) {
  const splitDirname = dirname.split("/").filter((path)=>Boolean(path));
  const headerPaths = [
    "home",
    ...splitDirname
  ];
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Deno File Server</title>
        <style>
        :root {
          --background-color: #fafafa;
          --color: rgba(0, 0, 0, 0.87);
        }
        @media (prefers-color-scheme: dark) {
          :root {
            --background-color: #292929;
            --color: #fff;
          }
          thead {
            color: #7f7f7f;
          }
        }
        @media (min-width: 960px) {
          main {
            max-width: 960px;
          }
          body {
            padding-left: 32px;
            padding-right: 32px;
          }
        }
        @media (min-width: 600px) {
          main {
            padding-left: 24px;
            padding-right: 24px;
          }
        }
        body {
          background: var(--background-color);
          color: var(--color);
          font-family: "Roboto", "Helvetica", "Arial", sans-serif;
          font-weight: 400;
          line-height: 1.43;
          font-size: 0.875rem;
        }
        a {
          color: #2196f3;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        thead {
          text-align: left;
        }
        thead th {
          padding-bottom: 12px;
        }
        table td {
          padding: 6px 36px 6px 0px;
        }
        .size {
          text-align: right;
          padding: 6px 12px 6px 24px;
        }
        .mode {
          font-family: monospace, monospace;
        }
        </style>
      </head>
      <body>
        <main>
          <h1>
            Index of ${headerPaths.map((path, index)=>{
    if (path === "") return "";
    const depth = headerPaths.length - index - 1;
    let link;
    if (depth == 0) {
      link = ".";
    } else {
      link = "../".repeat(depth);
    }
    // deno-fmt-ignore
    return html`<a href="${link}">${escape(path)}</a>`;
  }).join("/")}/
          </h1>
          <table>
            <thead>
              <tr>
                <th>Mode</th>
                <th>Size</th>
                <th>Name</th>
              </tr>
            </thead>
            ${entries.map((entry)=>html`
                    <tr>
                      <td class="mode">
                        ${entry.mode}
                      </td>
                      <td class="size">
                        ${entry.size}
                      </td>
                      <td>
                        <a href="${escape(entry.url)}">${escape(entry.name)}</a>
                      </td>
                    </tr>
                  `).join("")}
          </table>
        </main>
      </body>
    </html>
  `;
}
/**
 * Serves the files under the given directory root (opts.fsRoot).
 *
 * @example Usage
 * ```ts ignore
 * import { serveDir } from "@std/http/file-server";
 *
 * Deno.serve((req) => {
 *   const pathname = new URL(req.url).pathname;
 *   if (pathname.startsWith("/static")) {
 *     return serveDir(req, {
 *       fsRoot: "path/to/static/files/dir",
 *     });
 *   }
 *   // Do dynamic responses
 *   return new Response();
 * });
 * ```
 *
 * @example Changing the URL root
 *
 * Requests to `/static/path/to/file` will be served from `./public/path/to/file`.
 *
 * ```ts ignore
 * import { serveDir } from "@std/http/file-server";
 *
 * Deno.serve((req) => serveDir(req, {
 *   fsRoot: "public",
 *   urlRoot: "static",
 * }));
 * ```
 *
 * @param req The request to handle
 * @param opts Additional options.
 * @returns A response for the request.
 */ export async function serveDir(req, opts = {}) {
  if (req.method !== METHOD.Get && req.method !== METHOD.Head) {
    return createStandardResponse(STATUS_CODE.MethodNotAllowed);
  }
  let response;
  try {
    response = await createServeDirResponse(req, opts);
  } catch (error) {
    if (!opts.quiet) logError(error);
    response = error instanceof Deno.errors.NotFound ? createStandardResponse(STATUS_CODE.NotFound) : createStandardResponse(STATUS_CODE.InternalServerError);
  }
  // Do not update the header if the response is a 301 redirect.
  const isRedirectResponse = isRedirectStatus(response.status);
  if (opts.enableCors && !isRedirectResponse) {
    response.headers.append(HEADER.AccessControlAllowOrigin, "*");
    response.headers.append(HEADER.AccessControlAllowHeaders, "Origin, X-Requested-With, Content-Type, Accept, Range");
  }
  if (!opts.quiet) serverLog(req, response.status);
  if (opts.headers && !isRedirectResponse) {
    for (const header of opts.headers){
      const headerSplit = header.split(":");
      const name = headerSplit[0];
      const value = headerSplit.slice(1).join(":");
      response.headers.append(name, value);
    }
  }
  return response;
}
async function createServeDirResponse(req, opts) {
  const target = opts.fsRoot ?? ".";
  const urlRoot = opts.urlRoot;
  const showIndex = opts.showIndex ?? true;
  const cleanUrls = opts.cleanUrls ?? false;
  const dotfiles = opts.dotfiles ?? (opts.showDotfiles ? "allow" : "ignore");
  const { etagAlgorithm = "SHA-256", showDirListing = false, quiet = false } = opts;
  const url = new URL(req.url);
  const decodedUrl = decodeURIComponent(url.pathname);
  let normalizedPath = posixNormalize(decodedUrl);
  if (urlRoot && !normalizedPath.startsWith("/" + urlRoot)) {
    return createStandardResponse(STATUS_CODE.NotFound);
  }
  // Redirect paths like `/foo////bar` and `/foo/bar/////` to normalized paths.
  if (normalizedPath !== decodedUrl) {
    url.pathname = normalizedPath;
    return Response.redirect(url, 301);
  }
  if (urlRoot) {
    normalizedPath = normalizedPath.replace(urlRoot, "");
  }
  // Remove trailing slashes to avoid ENOENT errors
  // when accessing a path to a file with a trailing slash.
  if (normalizedPath.endsWith("/")) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  // A percent-encoded backslash (`%5C`) survives URL parsing and is treated
  // as a path separator by the Windows filesystem, which would bypass the
  // POSIX-based normalization and dotfile checks (e.g. `/%5C.env` or
  // `/sub%5C..%5C..%5Csecret`).
  if (normalizedPath.includes("\\")) {
    return createStandardResponse(STATUS_CODE.NotFound);
  }
  // Exclude dotfiles unless they are allowed
  if (dotfiles !== "allow" && /\/\./.test(normalizedPath)) {
    return createStandardResponse(dotfiles === "deny" ? STATUS_CODE.Forbidden : STATUS_CODE.NotFound);
  }
  // Resolve path
  // If cleanUrls is enabled, automatically append ".html" if not present
  // and it does not shadow another existing file or directory
  let fsPath = join(target, normalizedPath);
  if (cleanUrls && !fsPath.endsWith(".html") && !await exists(fsPath)) {
    fsPath += ".html";
  }
  // Defense in depth: the checks above should guarantee containment, but
  // never serve a path that resolves outside the root directory.
  const resolvedTarget = resolve(target);
  const resolvedFsPath = resolve(fsPath);
  const relativeFsPath = relative(resolvedTarget, resolvedFsPath);
  if (isAbsolute(relativeFsPath) || relativeFsPath === ".." || relativeFsPath.startsWith(`..${SEPARATOR}`)) {
    return createStandardResponse(STATUS_CODE.NotFound);
  }
  const fileInfo = await Deno.stat(fsPath);
  // For files, remove the trailing slash from the path.
  if (fileInfo.isFile && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
    return Response.redirect(url, 301);
  }
  // For directories, the path must have a trailing slash.
  if (fileInfo.isDirectory && !url.pathname.endsWith("/")) {
    // On directory listing pages,
    // if the current URL's pathname doesn't end with a slash, any
    // relative URLs in the index file will resolve against the parent
    // directory, rather than the current directory. To prevent that, we
    // return a 301 redirect to the URL with a slash.
    url.pathname += "/";
    return Response.redirect(url, 301);
  }
  // if target is file, serve file.
  if (!fileInfo.isDirectory) {
    return serveFile(req, fsPath, {
      etagAlgorithm,
      fileInfo
    });
  }
  // if target is directory, serve index or dir listing.
  if (showIndex) {
    const indexPath = join(fsPath, "index.html");
    let indexFileInfo;
    try {
      indexFileInfo = await Deno.lstat(indexPath);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    // skip Not Found error
    }
    if (indexFileInfo?.isFile) {
      return serveFile(req, indexPath, {
        etagAlgorithm,
        fileInfo: indexFileInfo
      });
    }
  }
  if (showDirListing) {
    return serveDirIndex(req, fsPath, {
      showDotfiles: dotfiles === "allow",
      target,
      quiet
    });
  }
  return createStandardResponse(STATUS_CODE.NotFound);
}
function logError(error) {
  // deno-lint-ignore no-console
  console.error(`%c${error.message}`, "color: red");
}
function main() {
  const serverArgs = parseArgs(Deno.args, {
    string: [
      "port",
      "host",
      "cert",
      "key",
      "header"
    ],
    boolean: [
      "help",
      "dir-listing",
      "dotfiles",
      "cors",
      "verbose",
      "version"
    ],
    negatable: [
      "dir-listing",
      "dotfiles",
      "cors"
    ],
    collect: [
      "header"
    ],
    default: {
      "dir-listing": true,
      dotfiles: true,
      cors: true,
      verbose: false,
      version: false,
      host: "0.0.0.0",
      port: undefined,
      cert: "",
      key: ""
    },
    alias: {
      p: "port",
      c: "cert",
      k: "key",
      h: "help",
      v: "verbose",
      V: "version",
      H: "header"
    }
  });
  const port = serverArgs.port ? Number(serverArgs.port) : undefined;
  const headers = serverArgs.header ?? [];
  const host = serverArgs.host;
  const certFile = serverArgs.cert;
  const keyFile = serverArgs.key;
  if (serverArgs.help) {
    printUsage();
    Deno.exit();
  }
  if (serverArgs.version) {
    // deno-lint-ignore no-console
    console.log(`Deno File Server ${denoConfig.version}`);
    Deno.exit();
  }
  if (keyFile || certFile) {
    if (keyFile === "" || certFile === "") {
      // deno-lint-ignore no-console
      console.log("--key and --cert are required for TLS");
      printUsage();
      Deno.exit(1);
    }
  }
  const wild = serverArgs._;
  const target = resolve(wild[0] ?? "");
  const handler = (req)=>{
    return serveDir(req, {
      fsRoot: target,
      showDirListing: serverArgs["dir-listing"],
      showDotfiles: serverArgs.dotfiles,
      enableCors: serverArgs.cors,
      quiet: !serverArgs.verbose,
      headers
    });
  };
  const useTls = !!(keyFile && certFile);
  function onListen({ port, hostname }) {
    let networkAddress = undefined;
    if (NET_PERM_STATUS === "granted") {
      networkAddress = getNetworkAddress();
    }
    const protocol = useTls ? "https" : "http";
    const host = Deno.build.os === "windows" && hostname === "0.0.0.0" ? "localhost" : hostname;
    const formattedHost = hostname.includes(":") ? `[${host}]` : host;
    let message = `Listening on:\n- Local: ${protocol}://${formattedHost}:${port}`;
    if (networkAddress && !DENO_DEPLOYMENT_ID) {
      message += `\n- Network: ${protocol}://${networkAddress}:${port}`;
    }
    // deno-lint-ignore no-console
    console.log(message);
  }
  // TODO(petamoriken): Migrate `Deno.ServeTcpOptions | (Deno.ServeTcpOptions & Deno.TlsCertifiedKeyOptions)` in v2
  const options = {
    hostname: host,
    onListen
  };
  if (port !== undefined) {
    options.port = port;
  }
  if (useTls) {
    options.cert = Deno.readTextFileSync(certFile);
    options.key = Deno.readTextFileSync(keyFile);
  }
  Deno.serve(options, handler);
}
function printUsage() {
  // deno-lint-ignore no-console
  console.log(`Deno File Server ${denoConfig.version}
  Serves a local directory in HTTP.

INSTALL:
  deno install --allow-net --allow-read --allow-sys jsr:@std/http@${denoConfig.version}/file-server

USAGE:
  file_server [path] [options]

OPTIONS:
  -h, --help            Prints help information
  -p, --port <PORT>     Set port (default is 8000)
  --cors                Enable CORS via the "Access-Control-Allow-Origin" header
  --host     <HOST>     Hostname (default is 0.0.0.0)
  -c, --cert <FILE>     TLS certificate file (enables TLS)
  -k, --key  <FILE>     TLS key file (enables TLS)
  -H, --header <HEADER> Sets a header on every request.
                        (e.g. --header "Cache-Control: no-cache")
                        This option can be specified multiple times.
  --no-dir-listing      Disable directory listing
  --no-dotfiles         Do not show dotfiles
  --no-cors             Disable cross-origin resource sharing
  -v, --verbose         Print request level logs
  -V, --version         Print version information

  All TLS options are required when one is provided.`);
}
if (import.meta.main) {
  main();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vanNyLmlvL0BzdGQvaHR0cC8xLjEuNC9maWxlX3NlcnZlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiAtUyBkZW5vIHJ1biAtLWFsbG93LW5ldCAtLWFsbG93LXJlYWRcbi8vIENvcHlyaWdodCAyMDE4LTIwMjYgdGhlIERlbm8gYXV0aG9ycy4gTUlUIGxpY2Vuc2UuXG5cbi8vIFRoaXMgcHJvZ3JhbSBzZXJ2ZXMgZmlsZXMgaW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5IG92ZXIgSFRUUC5cbi8vIFRPRE8oYmFydGxvbWllanUpOiBBZGQgdGVzdHMgbGlrZSB0aGVzZTpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmRleHplcm8vaHR0cC1zZXJ2ZXIvYmxvYi9tYXN0ZXIvdGVzdC9odHRwLXNlcnZlci10ZXN0LmpzXG5cbi8qKlxuICogQ29udGFpbnMgZnVuY3Rpb25zIHtAbGlua2NvZGUgc2VydmVEaXJ9IGFuZCB7QGxpbmtjb2RlIHNlcnZlRmlsZX0gZm9yXG4gKiBidWlsZGluZyBhIHN0YXRpYyBmaWxlIHNlcnZlci5cbiAqXG4gKiBUaGlzIG1vZHVsZSBjYW4gYWxzbyBiZSB1c2VkIGFzIGEgQ0xJLiBJZiB5b3Ugd2FudCB0byBydW4gaXQgZGlyZWN0bHk6XG4gKlxuICogYGBgc2hlbGxcbiAqID4gIyBzdGFydCBzZXJ2ZXJcbiAqID4gZGVubyBydW4gLS1hbGxvdy1uZXQgLS1hbGxvdy1yZWFkIC0tYWxsb3ctc3lzIGpzcjpAc3RkL2h0dHAvZmlsZS1zZXJ2ZXJcbiAqID4gIyBzaG93IGhlbHBcbiAqID4gZGVubyBydW4ganNyOkBzdGQvaHR0cC9maWxlLXNlcnZlciAtLWhlbHBcbiAqIGBgYFxuICpcbiAqIElmIHlvdSB3YW50IHRvIGluc3RhbGwgYW5kIHJ1bjpcbiAqXG4gKiBgYGBzaGVsbFxuICogPiAjIGluc3RhbGxcbiAqID4gZGVubyBpbnN0YWxsIC0tYWxsb3ctbmV0IC0tYWxsb3ctcmVhZCAtLWFsbG93LXN5cyAtLWdsb2JhbCBqc3I6QHN0ZC9odHRwL2ZpbGUtc2VydmVyXG4gKiA+ICMgc3RhcnQgc2VydmVyXG4gKiA+IGZpbGUtc2VydmVyXG4gKiA+ICMgc2hvdyBoZWxwXG4gKiA+IGZpbGUtc2VydmVyIC0taGVscFxuICogYGBgXG4gKlxuICogQG1vZHVsZVxuICovXG5cbmltcG9ydCB7IG5vcm1hbGl6ZSBhcyBwb3NpeE5vcm1hbGl6ZSB9IGZyb20gXCJqc3I6QHN0ZC9wYXRoQF4xLjEuNi9wb3NpeC9ub3JtYWxpemVcIjtcbmltcG9ydCB7IGV4dG5hbWUgfSBmcm9tIFwianNyOkBzdGQvcGF0aEBeMS4xLjYvZXh0bmFtZVwiO1xuaW1wb3J0IHsgaXNBYnNvbHV0ZSB9IGZyb20gXCJqc3I6QHN0ZC9wYXRoQF4xLjEuNi9pcy1hYnNvbHV0ZVwiO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJqc3I6QHN0ZC9wYXRoQF4xLjEuNi9qb2luXCI7XG5pbXBvcnQgeyByZWxhdGl2ZSB9IGZyb20gXCJqc3I6QHN0ZC9wYXRoQF4xLjEuNi9yZWxhdGl2ZVwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gXCJqc3I6QHN0ZC9wYXRoQF4xLjEuNi9yZXNvbHZlXCI7XG5pbXBvcnQgeyBTRVBBUkFUT1IsIFNFUEFSQVRPUl9QQVRURVJOIH0gZnJvbSBcImpzcjpAc3RkL3BhdGhAXjEuMS42L2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgZXhpc3RzIH0gZnJvbSBcImpzcjpAc3RkL2ZzQF4xLjAuMjQvZXhpc3RzXCI7XG5pbXBvcnQgeyBjb250ZW50VHlwZSB9IGZyb20gXCJqc3I6QHN0ZC9tZWRpYS10eXBlc0BeMS4xLjAvY29udGVudC10eXBlXCI7XG5pbXBvcnQgeyBlVGFnLCBpZk5vbmVNYXRjaCB9IGZyb20gXCIuL2V0YWcudHNcIjtcbmltcG9ydCB7XG4gIGlzUmVkaXJlY3RTdGF0dXMsXG4gIFNUQVRVU19DT0RFLFxuICBTVEFUVVNfVEVYVCxcbiAgdHlwZSBTdGF0dXNDb2RlLFxufSBmcm9tIFwiLi9zdGF0dXMudHNcIjtcbmltcG9ydCB7IEJ5dGVTbGljZVN0cmVhbSB9IGZyb20gXCJqc3I6QHN0ZC9zdHJlYW1zQF4xLjIuMC9ieXRlLXNsaWNlLXN0cmVhbVwiO1xuaW1wb3J0IHsgcGFyc2VBcmdzIH0gZnJvbSBcImpzcjpAc3RkL2NsaUBeMS4wLjMyL3BhcnNlLWFyZ3NcIjtcbmltcG9ydCBkZW5vQ29uZmlnIGZyb20gXCIuL2Rlbm8uanNvblwiIHdpdGggeyB0eXBlOiBcImpzb25cIiB9O1xuaW1wb3J0IHsgZm9ybWF0IGFzIGZvcm1hdEJ5dGVzIH0gZnJvbSBcImpzcjpAc3RkL2ZtdEBeMS4wLjEwL2J5dGVzXCI7XG5pbXBvcnQgeyBnZXROZXR3b3JrQWRkcmVzcyB9IGZyb20gXCJqc3I6QHN0ZC9uZXRAXjEuMC43L3Vuc3RhYmxlLWdldC1uZXR3b3JrLWFkZHJlc3NcIjtcbmltcG9ydCB7IGVzY2FwZSB9IGZyb20gXCJqc3I6QHN0ZC9odG1sQF4xLjAuNy9lbnRpdGllc1wiO1xuaW1wb3J0IHsgSEVBREVSIH0gZnJvbSBcIi4vdW5zdGFibGVfaGVhZGVyLnRzXCI7XG5pbXBvcnQgeyBNRVRIT0QgfSBmcm9tIFwiLi91bnN0YWJsZV9tZXRob2QudHNcIjtcbmltcG9ydCB7IGh0bWwgfSBmcm9tIFwianNyOkBzdGQvaHRtbEBeMS4wLjcvdW5zdGFibGUtaHRtbFwiO1xuXG5pbnRlcmZhY2UgRW50cnlJbmZvIHtcbiAgbW9kZTogc3RyaW5nO1xuICBzaXplOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG59XG5cbmNvbnN0IEVOVl9QRVJNX1NUQVRVUyA9IHR5cGVvZiBEZW5vICE9PSBcInVuZGVmaW5lZFwiXG4gID8gRGVuby5wZXJtaXNzaW9ucy5xdWVyeVN5bmM/Lih7XG4gICAgbmFtZTogXCJlbnZcIixcbiAgICB2YXJpYWJsZTogXCJERU5PX0RFUExPWU1FTlRfSURcIixcbiAgfSkuc3RhdGUgPz8gXCJncmFudGVkXCJcbiAgOiBcImdyYW50ZWRcIjsgLy8gZm9yIGRlbm8gZGVwbG95XG5jb25zdCBORVRfUEVSTV9TVEFUVVMgPSB0eXBlb2YgRGVubyAhPT0gXCJ1bmRlZmluZWRcIlxuICA/IERlbm8ucGVybWlzc2lvbnMucXVlcnlTeW5jPy4oeyBuYW1lOiBcInN5c1wiLCBraW5kOiBcIm5ldHdvcmtJbnRlcmZhY2VzXCIgfSlcbiAgICAuc3RhdGUgPz8gXCJncmFudGVkXCJcbiAgOiBcImdyYW50ZWRcIjsgLy8gZm9yIGRlbm8gZGVwbG95XG5jb25zdCBERU5PX0RFUExPWU1FTlRfSUQgPVxuICBFTlZfUEVSTV9TVEFUVVMgPT09IFwiZ3JhbnRlZFwiICYmIHR5cGVvZiBEZW5vICE9PSBcInVuZGVmaW5lZFwiXG4gICAgPyBEZW5vLmVudi5nZXQoXCJERU5PX0RFUExPWU1FTlRfSURcIilcbiAgICA6IHVuZGVmaW5lZDtcbmNvbnN0IEhBU0hFRF9ERU5PX0RFUExPWU1FTlRfSUQgPSBERU5PX0RFUExPWU1FTlRfSURcbiAgPyBlVGFnKERFTk9fREVQTE9ZTUVOVF9JRCwgeyB3ZWFrOiB0cnVlIH0pXG4gIDogdW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBtb2RlVG9TdHJpbmcoaXNEaXI6IGJvb2xlYW4sIG1heWJlTW9kZTogbnVtYmVyIHwgbnVsbCk6IHN0cmluZyB7XG4gIGNvbnN0IG1vZGVNYXAgPSBbXCItLS1cIiwgXCItLXhcIiwgXCItdy1cIiwgXCItd3hcIiwgXCJyLS1cIiwgXCJyLXhcIiwgXCJydy1cIiwgXCJyd3hcIl07XG5cbiAgaWYgKG1heWJlTW9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBcIih1bmtub3duIG1vZGUpXCI7XG4gIH1cbiAgY29uc3QgbW9kZSA9IG1heWJlTW9kZS50b1N0cmluZyg4KS5wYWRTdGFydCgzLCBcIjBcIik7XG4gIGxldCBvdXRwdXQgPSBcIlwiO1xuICBtb2RlXG4gICAgLnNwbGl0KFwiXCIpXG4gICAgLnJldmVyc2UoKVxuICAgIC5zbGljZSgwLCAzKVxuICAgIC5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICBvdXRwdXQgPSBgJHttb2RlTWFwWyt2XX0gJHtvdXRwdXR9YDtcbiAgICB9KTtcbiAgb3V0cHV0ID0gYCR7aXNEaXIgPyBcImRcIiA6IFwiLVwifSAke291dHB1dH1gO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVTdGFuZGFyZFJlc3BvbnNlKHN0YXR1czogU3RhdHVzQ29kZSwgaW5pdD86IFJlc3BvbnNlSW5pdCkge1xuICBjb25zdCBzdGF0dXNUZXh0ID0gU1RBVFVTX1RFWFRbc3RhdHVzXTtcbiAgcmV0dXJuIG5ldyBSZXNwb25zZShzdGF0dXNUZXh0LCB7IHN0YXR1cywgc3RhdHVzVGV4dCwgLi4uaW5pdCB9KTtcbn1cblxuLyoqXG4gKiBwYXJzZSByYW5nZSBoZWFkZXIuXG4gKlxuICogYGBgdHMgaWdub3JlXG4gKiBwYXJzZVJhbmdlSGVhZGVyKFwiYnl0ZXM9MC0xMDBcIiwgICA1MDApOyAvLyA9PiB7IHN0YXJ0OiAwLCBlbmQ6IDEwMCB9XG4gKiBwYXJzZVJhbmdlSGVhZGVyKFwiYnl0ZXM9MC1cIiwgICAgICA1MDApOyAvLyA9PiB7IHN0YXJ0OiAwLCBlbmQ6IDQ5OSB9XG4gKiBwYXJzZVJhbmdlSGVhZGVyKFwiYnl0ZXM9LTEwMFwiLCAgICA1MDApOyAvLyA9PiB7IHN0YXJ0OiA0MDAsIGVuZDogNDk5IH1cbiAqIHBhcnNlUmFuZ2VIZWFkZXIoXCJieXRlcz1pbnZhbGlkXCIsIDUwMCk7IC8vID0+IG51bGxcbiAqIGBgYFxuICpcbiAqIE5vdGU6IEN1cnJlbnRseSwgbm8gc3VwcG9ydCBmb3IgbXVsdGlwbGUgUmFuZ2VzIChlLmcuIGBieXRlcz0wLTEwLCAyMC0zMGApXG4gKi9cbmZ1bmN0aW9uIHBhcnNlUmFuZ2VIZWFkZXIocmFuZ2VWYWx1ZTogc3RyaW5nLCBmaWxlU2l6ZTogbnVtYmVyKSB7XG4gIGNvbnN0IHJhbmdlUmVnZXggPSAvYnl0ZXM9KD88c3RhcnQ+XFxkKyk/LSg/PGVuZD5cXGQrKT8kL3U7XG4gIGNvbnN0IHBhcnNlZCA9IHJhbmdlVmFsdWUubWF0Y2gocmFuZ2VSZWdleCk7XG5cbiAgaWYgKCFwYXJzZWQgfHwgIXBhcnNlZC5ncm91cHMpIHtcbiAgICAvLyBmYWlsZWQgdG8gcGFyc2UgcmFuZ2UgaGVhZGVyXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IHBhcnNlZC5ncm91cHM7XG4gIGlmIChzdGFydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKGVuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4geyBzdGFydDogK3N0YXJ0LCBlbmQ6ICtlbmQgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgc3RhcnQ6ICtzdGFydCwgZW5kOiBmaWxlU2l6ZSAtIDEgfTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGVuZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBleGFtcGxlOiBgYnl0ZXM9LTEwMGAgbWVhbnMgdGhlIGxhc3QgMTAwIGJ5dGVzLlxuICAgICAgcmV0dXJuIHsgc3RhcnQ6IGZpbGVTaXplIC0gK2VuZCwgZW5kOiBmaWxlU2l6ZSAtIDEgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZmFpbGVkIHRvIHBhcnNlIHJhbmdlIGhlYWRlclxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG59XG5cbi8qKiBPcHRpb25zIGZvciB7QGxpbmtjb2RlIHNlcnZlRmlsZX0uICovXG5leHBvcnQgaW50ZXJmYWNlIFNlcnZlRmlsZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGFsZ29yaXRobSB0byB1c2UgZm9yIGdlbmVyYXRpbmcgdGhlIEVUYWcuXG4gICAqXG4gICAqIEBkZWZhdWx0IHtcIlNIQS0yNTZcIn1cbiAgICovXG4gIGV0YWdBbGdvcml0aG0/OiBBbGdvcml0aG1JZGVudGlmaWVyO1xuICAvKipcbiAgICogQW4gb3B0aW9uYWwgb2JqZWN0IHJldHVybmVkIGJ5IHtAbGlua2NvZGUgRGVuby5zdGF0fS4gSXQgaXMgdXNlZCBmb3JcbiAgICogb3B0aW1pemF0aW9uIHB1cnBvc2VzLlxuICAgKlxuICAgKiBEZWZhdWx0cyB0byB0aGUgcmVzdWx0IG9mIGNhbGxpbmcge0BsaW5rY29kZSBEZW5vLnN0YXR9IHdpdGggdGhlIHByb3ZpZGVkXG4gICAqIGBmaWxlUGF0aGAuXG4gICAqL1xuICBmaWxlSW5mbz86IERlbm8uRmlsZUluZm87XG59XG5cbi8qKlxuICogUmVzb2x2ZXMgYSB7QGxpbmtjb2RlIFJlc3BvbnNlfSB3aXRoIHRoZSByZXF1ZXN0ZWQgZmlsZSBhcyB0aGUgYm9keS5cbiAqXG4gKiBAZXhhbXBsZSBVc2FnZVxuICogYGBgdHMgaWdub3JlXG4gKiBpbXBvcnQgeyBzZXJ2ZUZpbGUgfSBmcm9tIFwiQHN0ZC9odHRwL2ZpbGUtc2VydmVyXCI7XG4gKlxuICogRGVuby5zZXJ2ZSgocmVxKSA9PiB7XG4gKiAgIHJldHVybiBzZXJ2ZUZpbGUocmVxLCBcIlJFQURNRS5tZFwiKTtcbiAqIH0pO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHJlcSBUaGUgc2VydmVyIHJlcXVlc3QgY29udGV4dCB1c2VkIHRvIGNsZWFudXAgdGhlIGZpbGUgaGFuZGxlLlxuICogQHBhcmFtIGZpbGVQYXRoIFBhdGggb2YgdGhlIGZpbGUgdG8gc2VydmUuXG4gKiBAcGFyYW0gb3B0aW9ucyBBZGRpdGlvbmFsIG9wdGlvbnMuXG4gKiBAcmV0dXJucyBBIHJlc3BvbnNlIGZvciB0aGUgcmVxdWVzdC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlcnZlRmlsZShcbiAgcmVxOiBSZXF1ZXN0LFxuICBmaWxlUGF0aDogc3RyaW5nLFxuICBvcHRpb25zPzogU2VydmVGaWxlT3B0aW9ucyxcbik6IFByb21pc2U8UmVzcG9uc2U+IHtcbiAgYXdhaXQgcmVxLmJvZHk/LmNhbmNlbCgpO1xuXG4gIGlmIChyZXEubWV0aG9kICE9PSBNRVRIT0QuR2V0ICYmIHJlcS5tZXRob2QgIT09IE1FVEhPRC5IZWFkKSB7XG4gICAgcmV0dXJuIGNyZWF0ZVN0YW5kYXJkUmVzcG9uc2UoU1RBVFVTX0NPREUuTWV0aG9kTm90QWxsb3dlZCk7XG4gIH1cblxuICBsZXQgeyBldGFnQWxnb3JpdGhtOiBhbGdvcml0aG0gPSBcIlNIQS0yNTZcIiwgZmlsZUluZm8gfSA9IG9wdGlvbnMgPz8ge307XG5cbiAgdHJ5IHtcbiAgICBmaWxlSW5mbyA/Pz0gYXdhaXQgRGVuby5zdGF0KGZpbGVQYXRoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBEZW5vLmVycm9ycy5Ob3RGb3VuZCkge1xuICAgICAgcmV0dXJuIGNyZWF0ZVN0YW5kYXJkUmVzcG9uc2UoU1RBVFVTX0NPREUuTm90Rm91bmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cblxuICBpZiAoZmlsZUluZm8uaXNEaXJlY3RvcnkpIHtcbiAgICByZXR1cm4gY3JlYXRlU3RhbmRhcmRSZXNwb25zZShTVEFUVVNfQ09ERS5Ob3RGb3VuZCk7XG4gIH1cblxuICBjb25zdCBoZWFkZXJzID0gY3JlYXRlQmFzZUhlYWRlcnMoKTtcblxuICBjb25zdCBldGFnID0gZmlsZUluZm8ubXRpbWVcbiAgICA/IGF3YWl0IGVUYWcoZmlsZUluZm8sIHsgYWxnb3JpdGhtIH0pXG4gICAgOiBhd2FpdCBIQVNIRURfREVOT19ERVBMT1lNRU5UX0lEO1xuXG4gIC8vIFNldCBsYXN0IG1vZGlmaWVkIGhlYWRlciBpZiBsYXN0IG1vZGlmaWNhdGlvbiB0aW1lc3RhbXAgaXMgYXZhaWxhYmxlXG4gIGlmIChmaWxlSW5mby5tdGltZSkge1xuICAgIGhlYWRlcnMuc2V0KEhFQURFUi5MYXN0TW9kaWZpZWQsIGZpbGVJbmZvLm10aW1lLnRvVVRDU3RyaW5nKCkpO1xuICB9XG4gIGlmIChldGFnKSB7XG4gICAgaGVhZGVycy5zZXQoSEVBREVSLkVUYWcsIGV0YWcpO1xuICB9XG5cbiAgLy8gU2V0IG1pbWUtdHlwZSB1c2luZyB0aGUgZmlsZSBleHRlbnNpb24gaW4gZmlsZVBhdGhcbiAgY29uc3QgY29udGVudFR5cGVWYWx1ZSA9IGNvbnRlbnRUeXBlKGV4dG5hbWUoZmlsZVBhdGgpKTtcbiAgaWYgKGNvbnRlbnRUeXBlVmFsdWUpIHtcbiAgICBoZWFkZXJzLnNldChIRUFERVIuQ29udGVudFR5cGUsIGNvbnRlbnRUeXBlVmFsdWUpO1xuICB9XG4gIGNvbnN0IGZpbGVTaXplID0gZmlsZUluZm8uc2l6ZTtcblxuICBpZiAoZXRhZyB8fCBmaWxlSW5mby5tdGltZSkge1xuICAgIC8vIElmIGEgYGlmLW5vbmUtbWF0Y2hgIGhlYWRlciBpcyBwcmVzZW50IGFuZCB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgdGFnIG9yXG4gICAgLy8gaWYgYSBgaWYtbW9kaWZpZWQtc2luY2VgIGhlYWRlciBpcyBwcmVzZW50IGFuZCB0aGUgdmFsdWUgaXMgYmlnZ2VyIHRoYW5cbiAgICAvLyB0aGUgYWNjZXNzIHRpbWVzdGFtcCB2YWx1ZSwgdGhlbiByZXR1cm4gMzA0XG4gICAgY29uc3QgaWZOb25lTWF0Y2hWYWx1ZSA9IHJlcS5oZWFkZXJzLmdldChIRUFERVIuSWZOb25lTWF0Y2gpO1xuICAgIGNvbnN0IGlmTW9kaWZpZWRTaW5jZVZhbHVlID0gcmVxLmhlYWRlcnMuZ2V0KEhFQURFUi5JZk1vZGlmaWVkU2luY2UpO1xuICAgIGlmIChcbiAgICAgICghaWZOb25lTWF0Y2goaWZOb25lTWF0Y2hWYWx1ZSwgZXRhZykpIHx8XG4gICAgICAoaWZOb25lTWF0Y2hWYWx1ZSA9PT0gbnVsbCAmJlxuICAgICAgICBmaWxlSW5mby5tdGltZSAmJlxuICAgICAgICBpZk1vZGlmaWVkU2luY2VWYWx1ZSAmJlxuICAgICAgICBmaWxlSW5mby5tdGltZS5nZXRUaW1lKCkgPFxuICAgICAgICAgIG5ldyBEYXRlKGlmTW9kaWZpZWRTaW5jZVZhbHVlKS5nZXRUaW1lKCkgKyAxMDAwKVxuICAgICkge1xuICAgICAgY29uc3Qgc3RhdHVzID0gU1RBVFVTX0NPREUuTm90TW9kaWZpZWQ7XG4gICAgICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtcbiAgICAgICAgc3RhdHVzLFxuICAgICAgICBzdGF0dXNUZXh0OiBTVEFUVVNfVEVYVFtzdGF0dXNdLFxuICAgICAgICBoZWFkZXJzLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKHJlcS5tZXRob2QgPT09IE1FVEhPRC5IZWFkKSB7XG4gICAgLy8gU2V0IGNvbnRlbnQgbGVuZ3RoXG4gICAgaGVhZGVycy5zZXQoSEVBREVSLkNvbnRlbnRMZW5ndGgsIGAke2ZpbGVTaXplfWApO1xuXG4gICAgY29uc3Qgc3RhdHVzID0gU1RBVFVTX0NPREUuT0s7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7XG4gICAgICBzdGF0dXMsXG4gICAgICBzdGF0dXNUZXh0OiBTVEFUVVNfVEVYVFtzdGF0dXNdLFxuICAgICAgaGVhZGVycyxcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IHJhbmdlVmFsdWUgPSByZXEuaGVhZGVycy5nZXQoSEVBREVSLlJhbmdlKTtcblxuICAvLyBoYW5kbGUgcmFuZ2UgcmVxdWVzdFxuICAvLyBOb3RlOiBTb21lIGNsaWVudHMgYWRkIGEgUmFuZ2UgaGVhZGVyIHRvIGFsbCByZXF1ZXN0cyB0byBsaW1pdCB0aGUgc2l6ZSBvZiB0aGUgcmVzcG9uc2UuXG4gIC8vIElmIHRoZSBmaWxlIGlzIGVtcHR5LCBpZ25vcmUgdGhlIHJhbmdlIGhlYWRlciBhbmQgcmVzcG9uZCB3aXRoIGEgMjAwIHJhdGhlciB0aGFuIGEgNDE2LlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZ29sYW5nL2dvL2Jsb2IvMGQzNDc1NDRjYmNhMGY0MmIxNjA0MjRmNmJjMjQ1OGViY2M3YjNmYy9zcmMvbmV0L2h0dHAvZnMuZ28jTDI3My1MMjc2XG4gIGlmIChyYW5nZVZhbHVlICYmIDAgPCBmaWxlU2l6ZSkge1xuICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlUmFuZ2VIZWFkZXIocmFuZ2VWYWx1ZSwgZmlsZVNpemUpO1xuXG4gICAgLy8gUmV0dXJucyAyMDAgT0sgaWYgcGFyc2luZyB0aGUgcmFuZ2UgaGVhZGVyIGZhaWxzXG4gICAgaWYgKCFwYXJzZWQpIHtcbiAgICAgIC8vIFNldCBjb250ZW50IGxlbmd0aFxuICAgICAgaGVhZGVycy5zZXQoSEVBREVSLkNvbnRlbnRMZW5ndGgsIGAke2ZpbGVTaXplfWApO1xuXG4gICAgICBjb25zdCBmaWxlID0gYXdhaXQgRGVuby5vcGVuKGZpbGVQYXRoKTtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IFNUQVRVU19DT0RFLk9LO1xuICAgICAgcmV0dXJuIG5ldyBSZXNwb25zZShmaWxlLnJlYWRhYmxlLCB7XG4gICAgICAgIHN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogU1RBVFVTX1RFWFRbc3RhdHVzXSxcbiAgICAgICAgaGVhZGVycyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFJldHVybiA0MTYgUmFuZ2UgTm90IFNhdGlzZmlhYmxlIGlmIGludmFsaWQgcmFuZ2UgaGVhZGVyIHZhbHVlXG4gICAgaWYgKFxuICAgICAgcGFyc2VkLmVuZCA8IDAgfHxcbiAgICAgIHBhcnNlZC5lbmQgPCBwYXJzZWQuc3RhcnQgfHxcbiAgICAgIGZpbGVTaXplIDw9IHBhcnNlZC5zdGFydFxuICAgICkge1xuICAgICAgLy8gU2V0IHRoZSBcIkNvbnRlbnQtcmFuZ2VcIiBoZWFkZXJcbiAgICAgIGhlYWRlcnMuc2V0KEhFQURFUi5Db250ZW50UmFuZ2UsIGBieXRlcyAqLyR7ZmlsZVNpemV9YCk7XG5cbiAgICAgIHJldHVybiBjcmVhdGVTdGFuZGFyZFJlc3BvbnNlKFxuICAgICAgICBTVEFUVVNfQ09ERS5SYW5nZU5vdFNhdGlzZmlhYmxlLFxuICAgICAgICB7IGhlYWRlcnMgfSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gY2xhbXBzIHRoZSByYW5nZSBoZWFkZXIgdmFsdWVcbiAgICBjb25zdCBzdGFydCA9IE1hdGgubWF4KDAsIHBhcnNlZC5zdGFydCk7XG4gICAgY29uc3QgZW5kID0gTWF0aC5taW4ocGFyc2VkLmVuZCwgZmlsZVNpemUgLSAxKTtcblxuICAgIC8vIFNldCB0aGUgXCJDb250ZW50LXJhbmdlXCIgaGVhZGVyXG4gICAgaGVhZGVycy5zZXQoSEVBREVSLkNvbnRlbnRSYW5nZSwgYGJ5dGVzICR7c3RhcnR9LSR7ZW5kfS8ke2ZpbGVTaXplfWApO1xuXG4gICAgLy8gU2V0IGNvbnRlbnQgbGVuZ3RoXG4gICAgY29uc3QgY29udGVudExlbmd0aCA9IGVuZCAtIHN0YXJ0ICsgMTtcbiAgICBoZWFkZXJzLnNldChIRUFERVIuQ29udGVudExlbmd0aCwgYCR7Y29udGVudExlbmd0aH1gKTtcblxuICAgIC8vIFJldHVybiAyMDYgUGFydGlhbCBDb250ZW50XG4gICAgY29uc3QgZmlsZSA9IGF3YWl0IERlbm8ub3BlbihmaWxlUGF0aCk7XG4gICAgYXdhaXQgZmlsZS5zZWVrKHN0YXJ0LCBEZW5vLlNlZWtNb2RlLlN0YXJ0KTtcbiAgICBjb25zdCBzbGljZWQgPSBmaWxlLnJlYWRhYmxlXG4gICAgICAucGlwZVRocm91Z2gobmV3IEJ5dGVTbGljZVN0cmVhbSgwLCBjb250ZW50TGVuZ3RoIC0gMSkpO1xuICAgIGNvbnN0IHN0YXR1cyA9IFNUQVRVU19DT0RFLlBhcnRpYWxDb250ZW50O1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2Uoc2xpY2VkLCB7XG4gICAgICBzdGF0dXMsXG4gICAgICBzdGF0dXNUZXh0OiBTVEFUVVNfVEVYVFtzdGF0dXNdLFxuICAgICAgaGVhZGVycyxcbiAgICB9KTtcbiAgfVxuXG4gIC8vIFNldCBjb250ZW50IGxlbmd0aFxuICBoZWFkZXJzLnNldChIRUFERVIuQ29udGVudExlbmd0aCwgYCR7ZmlsZVNpemV9YCk7XG5cbiAgY29uc3QgZmlsZSA9IGF3YWl0IERlbm8ub3BlbihmaWxlUGF0aCk7XG4gIGNvbnN0IHN0YXR1cyA9IFNUQVRVU19DT0RFLk9LO1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKGZpbGUucmVhZGFibGUsIHtcbiAgICBzdGF0dXMsXG4gICAgc3RhdHVzVGV4dDogU1RBVFVTX1RFWFRbc3RhdHVzXSxcbiAgICBoZWFkZXJzLFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc2VydmVEaXJJbmRleChcbiAgcmVxOiBSZXF1ZXN0LFxuICBkaXJQYXRoOiBzdHJpbmcsXG4gIG9wdGlvbnM6IHtcbiAgICBzaG93RG90ZmlsZXM6IGJvb2xlYW47XG4gICAgdGFyZ2V0OiBzdHJpbmc7XG4gICAgcXVpZXQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIH0sXG4pOiBQcm9taXNlPFJlc3BvbnNlPiB7XG4gIGNvbnN0IHsgc2hvd0RvdGZpbGVzIH0gPSBvcHRpb25zO1xuICBjb25zdCBkaXJVcmwgPSBgLyR7XG4gICAgcmVsYXRpdmUob3B0aW9ucy50YXJnZXQsIGRpclBhdGgpLnJlcGxhY2VBbGwoXG4gICAgICBuZXcgUmVnRXhwKFNFUEFSQVRPUl9QQVRURVJOLCBcImdcIiksXG4gICAgICBcIi9cIixcbiAgICApXG4gIH1gO1xuICBjb25zdCBsaXN0RW50cnlQcm9taXNlOiBQcm9taXNlPEVudHJ5SW5mbz5bXSA9IFtdO1xuXG4gIC8vIGlmIFwiLi5cIiBtYWtlcyBzZW5zZVxuICBpZiAoZGlyVXJsICE9PSBcIi9cIikge1xuICAgIGNvbnN0IHByZXZQYXRoID0gam9pbihkaXJQYXRoLCBcIi4uXCIpO1xuICAgIGNvbnN0IGVudHJ5SW5mbyA9IERlbm8uc3RhdChwcmV2UGF0aCkudGhlbigoZmlsZUluZm8pOiBFbnRyeUluZm8gPT4gKHtcbiAgICAgIG1vZGU6IG1vZGVUb1N0cmluZyh0cnVlLCBmaWxlSW5mby5tb2RlKSxcbiAgICAgIHNpemU6IFwiXCIsXG4gICAgICBuYW1lOiBcIi4uL1wiLFxuICAgICAgdXJsOiBcIi4uXCIsXG4gICAgfSkpO1xuICAgIGxpc3RFbnRyeVByb21pc2UucHVzaChlbnRyeUluZm8pO1xuICB9XG5cbiAgLy8gUmVhZCBmaWxlSW5mbyBpbiBwYXJhbGxlbFxuICBmb3IgYXdhaXQgKGNvbnN0IGVudHJ5IG9mIERlbm8ucmVhZERpcihkaXJQYXRoKSkge1xuICAgIGlmICghc2hvd0RvdGZpbGVzICYmIGVudHJ5Lm5hbWVbMF0gPT09IFwiLlwiKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgY29uc3QgZmlsZVBhdGggPSBqb2luKGRpclBhdGgsIGVudHJ5Lm5hbWUpO1xuICAgIGNvbnN0IGZpbGVVcmwgPSBlbmNvZGVVUklDb21wb25lbnQoZW50cnkubmFtZSlcbiAgICAgIC5yZXBsYWNlQWxsKFwiJTJGXCIsIFwiL1wiKTtcblxuICAgIGxpc3RFbnRyeVByb21pc2UucHVzaCgoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZmlsZUluZm8gPSBhd2FpdCBEZW5vLnN0YXQoZmlsZVBhdGgpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG1vZGU6IG1vZGVUb1N0cmluZyhlbnRyeS5pc0RpcmVjdG9yeSwgZmlsZUluZm8ubW9kZSksXG4gICAgICAgICAgc2l6ZTogZW50cnkuaXNGaWxlID8gZm9ybWF0Qnl0ZXMoZmlsZUluZm8uc2l6ZSA/PyAwKSA6IFwiXCIsXG4gICAgICAgICAgbmFtZTogYCR7ZW50cnkubmFtZX0ke2VudHJ5LmlzRGlyZWN0b3J5ID8gXCIvXCIgOiBcIlwifWAsXG4gICAgICAgICAgdXJsOiBgLi8ke2ZpbGVVcmx9JHtlbnRyeS5pc0RpcmVjdG9yeSA/IFwiL1wiIDogXCJcIn1gLFxuICAgICAgICB9O1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gTm90ZTogRGVuby5zdGF0IGZvciB3aW5kb3dzIHN5c3RlbSBmaWxlcyBtYXkgYmUgcmVqZWN0ZWQgd2l0aCBvcyBlcnJvciAzMi5cbiAgICAgICAgaWYgKCFvcHRpb25zLnF1aWV0KSBsb2dFcnJvcihlcnJvciBhcyBFcnJvcik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbW9kZTogXCIodW5rbm93biBtb2RlKVwiLFxuICAgICAgICAgIHNpemU6IFwiXCIsXG4gICAgICAgICAgbmFtZTogYCR7ZW50cnkubmFtZX0ke2VudHJ5LmlzRGlyZWN0b3J5ID8gXCIvXCIgOiBcIlwifWAsXG4gICAgICAgICAgdXJsOiBgLi8ke2ZpbGVVcmx9JHtlbnRyeS5pc0RpcmVjdG9yeSA/IFwiL1wiIDogXCJcIn1gLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pKCkpO1xuICB9XG5cbiAgY29uc3QgbGlzdEVudHJ5ID0gYXdhaXQgUHJvbWlzZS5hbGwobGlzdEVudHJ5UHJvbWlzZSk7XG4gIGxpc3RFbnRyeS5zb3J0KChhLCBiKSA9PlxuICAgIC8vIFRPRE8oaXVpb2l1YSk6IEFkZCB0ZXN0IHRvIGVuc3VyZSBsaXN0IG9yZGVyIGlzIGNvcnJlY3RcbiAgICBhLm5hbWUudG9Mb3dlckNhc2UoKSA+IGIubmFtZS50b0xvd2VyQ2FzZSgpID8gMSA6IC0xXG4gICk7XG4gIGNvbnN0IGZvcm1hdHRlZERpclVybCA9IGAke2RpclVybC5yZXBsYWNlKC9cXC8kLywgXCJcIil9L2A7XG4gIGNvbnN0IHBhZ2UgPSBkaXJWaWV3ZXJUZW1wbGF0ZShmb3JtYXR0ZWREaXJVcmwsIGxpc3RFbnRyeSk7XG5cbiAgY29uc3QgaGVhZGVycyA9IGNyZWF0ZUJhc2VIZWFkZXJzKCk7XG4gIGhlYWRlcnMuc2V0KEhFQURFUi5Db250ZW50VHlwZSwgXCJ0ZXh0L2h0bWw7IGNoYXJzZXQ9VVRGLThcIik7XG4gIGlmIChyZXEubWV0aG9kID09PSBNRVRIT0QuSGVhZCkge1xuICAgIGNvbnN0IHBhZ2VTaXplID0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKHBhZ2UpLmJ5dGVMZW5ndGg7XG4gICAgaGVhZGVycy5zZXQoSEVBREVSLkNvbnRlbnRMZW5ndGgsIFN0cmluZyhwYWdlU2l6ZSkpO1xuICB9XG5cbiAgY29uc3Qgc3RhdHVzID0gU1RBVFVTX0NPREUuT0s7XG4gIHJldHVybiBuZXcgUmVzcG9uc2UocmVxLm1ldGhvZCA9PT0gTUVUSE9ELkhlYWQgPyBudWxsIDogcGFnZSwge1xuICAgIHN0YXR1cyxcbiAgICBzdGF0dXNUZXh0OiBTVEFUVVNfVEVYVFtzdGF0dXNdLFxuICAgIGhlYWRlcnMsXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzZXJ2ZXJMb2cocmVxOiBSZXF1ZXN0LCBzdGF0dXM6IG51bWJlcikge1xuICBjb25zdCBkID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICBjb25zdCBkYXRlRm10ID0gYFske2Quc2xpY2UoMCwgMTApfSAke2Quc2xpY2UoMTEsIDE5KX1dYDtcbiAgY29uc3QgdXJsID0gbmV3IFVSTChyZXEudXJsKTtcbiAgY29uc3QgcyA9IGAke2RhdGVGbXR9IFske3JlcS5tZXRob2R9XSAke3VybC5wYXRobmFtZX0ke3VybC5zZWFyY2h9ICR7c3RhdHVzfWA7XG4gIC8vIHVzaW5nIGNvbnNvbGUuZGVidWcgaW5zdGVhZCBvZiBjb25zb2xlLmxvZyBzbyBjaHJvbWUgaW5zcGVjdCB1c2VycyBjYW4gaGlkZSByZXF1ZXN0IGxvZ3NcbiAgLy8gZGVuby1saW50LWlnbm9yZSBuby1jb25zb2xlXG4gIGNvbnNvbGUuZGVidWcocyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJhc2VIZWFkZXJzKCk6IEhlYWRlcnMge1xuICByZXR1cm4gbmV3IEhlYWRlcnMoe1xuICAgIHNlcnZlcjogXCJkZW5vXCIsXG4gICAgLy8gU2V0IFwiYWNjZXB0LXJhbmdlc1wiIHNvIHRoYXQgdGhlIGNsaWVudCBrbm93cyBpdCBjYW4gbWFrZSByYW5nZSByZXF1ZXN0cyBvbiBmdXR1cmUgcmVxdWVzdHNcbiAgICBbSEVBREVSLkFjY2VwdFJhbmdlc106IFwiYnl0ZXNcIixcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRpclZpZXdlclRlbXBsYXRlKGRpcm5hbWU6IHN0cmluZywgZW50cmllczogRW50cnlJbmZvW10pOiBzdHJpbmcge1xuICBjb25zdCBzcGxpdERpcm5hbWUgPSBkaXJuYW1lLnNwbGl0KFwiL1wiKS5maWx0ZXIoKHBhdGgpID0+IEJvb2xlYW4ocGF0aCkpO1xuICBjb25zdCBoZWFkZXJQYXRocyA9IFtcImhvbWVcIiwgLi4uc3BsaXREaXJuYW1lXTtcblxuICByZXR1cm4gaHRtbGBcbiAgICA8IURPQ1RZUEUgaHRtbD5cbiAgICA8aHRtbCBsYW5nPVwiZW5cIj5cbiAgICAgIDxoZWFkPlxuICAgICAgICA8bWV0YSBjaGFyc2V0PVwiVVRGLThcIiAvPlxuICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMFwiIC8+XG4gICAgICAgIDxtZXRhIGh0dHAtZXF1aXY9XCJYLVVBLUNvbXBhdGlibGVcIiBjb250ZW50PVwiaWU9ZWRnZVwiIC8+XG4gICAgICAgIDx0aXRsZT5EZW5vIEZpbGUgU2VydmVyPC90aXRsZT5cbiAgICAgICAgPHN0eWxlPlxuICAgICAgICA6cm9vdCB7XG4gICAgICAgICAgLS1iYWNrZ3JvdW5kLWNvbG9yOiAjZmFmYWZhO1xuICAgICAgICAgIC0tY29sb3I6IHJnYmEoMCwgMCwgMCwgMC44Nyk7XG4gICAgICAgIH1cbiAgICAgICAgQG1lZGlhIChwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyaykge1xuICAgICAgICAgIDpyb290IHtcbiAgICAgICAgICAgIC0tYmFja2dyb3VuZC1jb2xvcjogIzI5MjkyOTtcbiAgICAgICAgICAgIC0tY29sb3I6ICNmZmY7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoZWFkIHtcbiAgICAgICAgICAgIGNvbG9yOiAjN2Y3ZjdmO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBAbWVkaWEgKG1pbi13aWR0aDogOTYwcHgpIHtcbiAgICAgICAgICBtYWluIHtcbiAgICAgICAgICAgIG1heC13aWR0aDogOTYwcHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJvZHkge1xuICAgICAgICAgICAgcGFkZGluZy1sZWZ0OiAzMnB4O1xuICAgICAgICAgICAgcGFkZGluZy1yaWdodDogMzJweDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgQG1lZGlhIChtaW4td2lkdGg6IDYwMHB4KSB7XG4gICAgICAgICAgbWFpbiB7XG4gICAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDI0cHg7XG4gICAgICAgICAgICBwYWRkaW5nLXJpZ2h0OiAyNHB4O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBib2R5IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1iYWNrZ3JvdW5kLWNvbG9yKTtcbiAgICAgICAgICBjb2xvcjogdmFyKC0tY29sb3IpO1xuICAgICAgICAgIGZvbnQtZmFtaWx5OiBcIlJvYm90b1wiLCBcIkhlbHZldGljYVwiLCBcIkFyaWFsXCIsIHNhbnMtc2VyaWY7XG4gICAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICAgICAgICBsaW5lLWhlaWdodDogMS40MztcbiAgICAgICAgICBmb250LXNpemU6IDAuODc1cmVtO1xuICAgICAgICB9XG4gICAgICAgIGEge1xuICAgICAgICAgIGNvbG9yOiAjMjE5NmYzO1xuICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgICAgfVxuICAgICAgICBhOmhvdmVyIHtcbiAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICAgICAgfVxuICAgICAgICB0aGVhZCB7XG4gICAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgfVxuICAgICAgICB0aGVhZCB0aCB7XG4gICAgICAgICAgcGFkZGluZy1ib3R0b206IDEycHg7XG4gICAgICAgIH1cbiAgICAgICAgdGFibGUgdGQge1xuICAgICAgICAgIHBhZGRpbmc6IDZweCAzNnB4IDZweCAwcHg7XG4gICAgICAgIH1cbiAgICAgICAgLnNpemUge1xuICAgICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgICAgICAgIHBhZGRpbmc6IDZweCAxMnB4IDZweCAyNHB4O1xuICAgICAgICB9XG4gICAgICAgIC5tb2RlIHtcbiAgICAgICAgICBmb250LWZhbWlseTogbW9ub3NwYWNlLCBtb25vc3BhY2U7XG4gICAgICAgIH1cbiAgICAgICAgPC9zdHlsZT5cbiAgICAgIDwvaGVhZD5cbiAgICAgIDxib2R5PlxuICAgICAgICA8bWFpbj5cbiAgICAgICAgICA8aDE+XG4gICAgICAgICAgICBJbmRleCBvZiAke2hlYWRlclBhdGhzXG4gICAgICAgICAgICAgIC5tYXAoKHBhdGgsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHBhdGggPT09IFwiXCIpIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRlcHRoID0gaGVhZGVyUGF0aHMubGVuZ3RoIC0gaW5kZXggLSAxO1xuICAgICAgICAgICAgICAgIGxldCBsaW5rO1xuICAgICAgICAgICAgICAgIGlmIChkZXB0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICBsaW5rID0gXCIuXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGxpbmsgPSBcIi4uL1wiLnJlcGVhdChkZXB0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGRlbm8tZm10LWlnbm9yZVxuICAgICAgICAgICAgICAgIHJldHVybiBodG1sYDxhIGhyZWY9XCIke2xpbmt9XCI+JHtlc2NhcGUocGF0aCl9PC9hPmA7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5qb2luKFwiL1wiKX0vXG4gICAgICAgICAgPC9oMT5cbiAgICAgICAgICA8dGFibGU+XG4gICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGg+TW9kZTwvdGg+XG4gICAgICAgICAgICAgICAgPHRoPlNpemU8L3RoPlxuICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD5cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICAke2VudHJpZXNcbiAgICAgICAgICAgICAgLm1hcChcbiAgICAgICAgICAgICAgICAoZW50cnkpID0+XG4gICAgICAgICAgICAgICAgICBodG1sYFxuICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwibW9kZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgJHtlbnRyeS5tb2RlfVxuICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwic2l6ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgJHtlbnRyeS5zaXplfVxuICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiR7ZXNjYXBlKGVudHJ5LnVybCl9XCI+JHtlc2NhcGUoZW50cnkubmFtZSl9PC9hPlxuICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICBgLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIC5qb2luKFwiXCIpfVxuICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgIDwvbWFpbj5cbiAgICAgIDwvYm9keT5cbiAgICA8L2h0bWw+XG4gIGA7XG59XG5cbi8qKiBJbnRlcmZhY2UgZm9yIHNlcnZlRGlyIG9wdGlvbnMuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlcnZlRGlyT3B0aW9ucyB7XG4gIC8qKiBTZXJ2ZXMgdGhlIGZpbGVzIHVuZGVyIHRoZSBnaXZlbiBkaXJlY3Rvcnkgcm9vdC4gRGVmYXVsdHMgdG8geW91ciBjdXJyZW50IGRpcmVjdG9yeS5cbiAgICpcbiAgICogQGRlZmF1bHQge1wiLlwifVxuICAgKi9cbiAgZnNSb290Pzogc3RyaW5nO1xuICAvKiogU3BlY2lmaWVkIHRoYXQgcGFydCBpcyBzdHJpcHBlZCBmcm9tIHRoZSBiZWdpbm5pbmcgb2YgdGhlIHJlcXVlc3RlZCBwYXRobmFtZS5cbiAgICovXG4gIHVybFJvb3Q/OiBzdHJpbmc7XG4gIC8qKiBFbmFibGUgZGlyZWN0b3J5IGxpc3RpbmcuXG4gICAqXG4gICAqIEBkZWZhdWx0IHtmYWxzZX1cbiAgICovXG4gIHNob3dEaXJMaXN0aW5nPzogYm9vbGVhbjtcbiAgLyoqIFNlcnZlcyBkb3RmaWxlcy5cbiAgICpcbiAgICogQGRlZmF1bHQge2ZhbHNlfVxuICAgKi9cbiAgc2hvd0RvdGZpbGVzPzogYm9vbGVhbjtcbiAgLyoqIFNlcnZlcyBgaW5kZXguaHRtbGAgYXMgdGhlIGluZGV4IGZpbGUgb2YgdGhlIGRpcmVjdG9yeS5cbiAgICpcbiAgICogQGRlZmF1bHQge3RydWV9XG4gICAqL1xuICBzaG93SW5kZXg/OiBib29sZWFuO1xuICAvKipcbiAgICogRW5hYmxlIENPUlMgdmlhIHRoZVxuICAgKiB7QGxpbmtjb2RlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0hUVFAvSGVhZGVycy9BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4gfCBBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW59XG4gICAqIGhlYWRlci5cbiAgICpcbiAgICogQGRlZmF1bHQge2ZhbHNlfVxuICAgKi9cbiAgZW5hYmxlQ29ycz86IGJvb2xlYW47XG4gIC8qKiBEbyBub3QgcHJpbnQgcmVxdWVzdCBsZXZlbCBsb2dzLlxuICAgKlxuICAgKiBAZGVmYXVsdCB7ZmFsc2V9XG4gICAqL1xuICBxdWlldD86IGJvb2xlYW47XG4gIC8qKiBUaGUgYWxnb3JpdGhtIHRvIHVzZSBmb3IgZ2VuZXJhdGluZyB0aGUgRVRhZy5cbiAgICpcbiAgICogQGRlZmF1bHQge1wiU0hBLTI1NlwifVxuICAgKi9cbiAgZXRhZ0FsZ29yaXRobT86IEFsZ29yaXRobUlkZW50aWZpZXI7XG4gIC8qKiBIZWFkZXJzIHRvIGFkZCB0byBlYWNoIHJlc3BvbnNlXG4gICAqXG4gICAqIEBkZWZhdWx0IHtbXX1cbiAgICovXG4gIGhlYWRlcnM/OiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBTZXJ2ZXMgdGhlIGZpbGVzIHVuZGVyIHRoZSBnaXZlbiBkaXJlY3Rvcnkgcm9vdCAob3B0cy5mc1Jvb3QpLlxuICpcbiAqIEBleGFtcGxlIFVzYWdlXG4gKiBgYGB0cyBpZ25vcmVcbiAqIGltcG9ydCB7IHNlcnZlRGlyIH0gZnJvbSBcIkBzdGQvaHR0cC9maWxlLXNlcnZlclwiO1xuICpcbiAqIERlbm8uc2VydmUoKHJlcSkgPT4ge1xuICogICBjb25zdCBwYXRobmFtZSA9IG5ldyBVUkwocmVxLnVybCkucGF0aG5hbWU7XG4gKiAgIGlmIChwYXRobmFtZS5zdGFydHNXaXRoKFwiL3N0YXRpY1wiKSkge1xuICogICAgIHJldHVybiBzZXJ2ZURpcihyZXEsIHtcbiAqICAgICAgIGZzUm9vdDogXCJwYXRoL3RvL3N0YXRpYy9maWxlcy9kaXJcIixcbiAqICAgICB9KTtcbiAqICAgfVxuICogICAvLyBEbyBkeW5hbWljIHJlc3BvbnNlc1xuICogICByZXR1cm4gbmV3IFJlc3BvbnNlKCk7XG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIEBleGFtcGxlIENoYW5naW5nIHRoZSBVUkwgcm9vdFxuICpcbiAqIFJlcXVlc3RzIHRvIGAvc3RhdGljL3BhdGgvdG8vZmlsZWAgd2lsbCBiZSBzZXJ2ZWQgZnJvbSBgLi9wdWJsaWMvcGF0aC90by9maWxlYC5cbiAqXG4gKiBgYGB0cyBpZ25vcmVcbiAqIGltcG9ydCB7IHNlcnZlRGlyIH0gZnJvbSBcIkBzdGQvaHR0cC9maWxlLXNlcnZlclwiO1xuICpcbiAqIERlbm8uc2VydmUoKHJlcSkgPT4gc2VydmVEaXIocmVxLCB7XG4gKiAgIGZzUm9vdDogXCJwdWJsaWNcIixcbiAqICAgdXJsUm9vdDogXCJzdGF0aWNcIixcbiAqIH0pKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSByZXEgVGhlIHJlcXVlc3QgdG8gaGFuZGxlXG4gKiBAcGFyYW0gb3B0cyBBZGRpdGlvbmFsIG9wdGlvbnMuXG4gKiBAcmV0dXJucyBBIHJlc3BvbnNlIGZvciB0aGUgcmVxdWVzdC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlcnZlRGlyKFxuICByZXE6IFJlcXVlc3QsXG4gIG9wdHM6IFNlcnZlRGlyT3B0aW9ucyA9IHt9LFxuKTogUHJvbWlzZTxSZXNwb25zZT4ge1xuICBpZiAocmVxLm1ldGhvZCAhPT0gTUVUSE9ELkdldCAmJiByZXEubWV0aG9kICE9PSBNRVRIT0QuSGVhZCkge1xuICAgIHJldHVybiBjcmVhdGVTdGFuZGFyZFJlc3BvbnNlKFNUQVRVU19DT0RFLk1ldGhvZE5vdEFsbG93ZWQpO1xuICB9XG5cbiAgbGV0IHJlc3BvbnNlOiBSZXNwb25zZTtcbiAgdHJ5IHtcbiAgICByZXNwb25zZSA9IGF3YWl0IGNyZWF0ZVNlcnZlRGlyUmVzcG9uc2UocmVxLCBvcHRzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoIW9wdHMucXVpZXQpIGxvZ0Vycm9yKGVycm9yIGFzIEVycm9yKTtcbiAgICByZXNwb25zZSA9IGVycm9yIGluc3RhbmNlb2YgRGVuby5lcnJvcnMuTm90Rm91bmRcbiAgICAgID8gY3JlYXRlU3RhbmRhcmRSZXNwb25zZShTVEFUVVNfQ09ERS5Ob3RGb3VuZClcbiAgICAgIDogY3JlYXRlU3RhbmRhcmRSZXNwb25zZShTVEFUVVNfQ09ERS5JbnRlcm5hbFNlcnZlckVycm9yKTtcbiAgfVxuXG4gIC8vIERvIG5vdCB1cGRhdGUgdGhlIGhlYWRlciBpZiB0aGUgcmVzcG9uc2UgaXMgYSAzMDEgcmVkaXJlY3QuXG4gIGNvbnN0IGlzUmVkaXJlY3RSZXNwb25zZSA9IGlzUmVkaXJlY3RTdGF0dXMocmVzcG9uc2Uuc3RhdHVzKTtcblxuICBpZiAob3B0cy5lbmFibGVDb3JzICYmICFpc1JlZGlyZWN0UmVzcG9uc2UpIHtcbiAgICByZXNwb25zZS5oZWFkZXJzLmFwcGVuZChIRUFERVIuQWNjZXNzQ29udHJvbEFsbG93T3JpZ2luLCBcIipcIik7XG4gICAgcmVzcG9uc2UuaGVhZGVycy5hcHBlbmQoXG4gICAgICBIRUFERVIuQWNjZXNzQ29udHJvbEFsbG93SGVhZGVycyxcbiAgICAgIFwiT3JpZ2luLCBYLVJlcXVlc3RlZC1XaXRoLCBDb250ZW50LVR5cGUsIEFjY2VwdCwgUmFuZ2VcIixcbiAgICApO1xuICB9XG5cbiAgaWYgKCFvcHRzLnF1aWV0KSBzZXJ2ZXJMb2cocmVxLCByZXNwb25zZS5zdGF0dXMpO1xuXG4gIGlmIChvcHRzLmhlYWRlcnMgJiYgIWlzUmVkaXJlY3RSZXNwb25zZSkge1xuICAgIGZvciAoY29uc3QgaGVhZGVyIG9mIG9wdHMuaGVhZGVycykge1xuICAgICAgY29uc3QgaGVhZGVyU3BsaXQgPSBoZWFkZXIuc3BsaXQoXCI6XCIpO1xuICAgICAgY29uc3QgbmFtZSA9IGhlYWRlclNwbGl0WzBdITtcbiAgICAgIGNvbnN0IHZhbHVlID0gaGVhZGVyU3BsaXQuc2xpY2UoMSkuam9pbihcIjpcIik7XG4gICAgICByZXNwb25zZS5oZWFkZXJzLmFwcGVuZChuYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3BvbnNlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVTZXJ2ZURpclJlc3BvbnNlKFxuICByZXE6IFJlcXVlc3QsXG4gIG9wdHM6IFNlcnZlRGlyT3B0aW9ucyxcbikge1xuICBjb25zdCB0YXJnZXQgPSBvcHRzLmZzUm9vdCA/PyBcIi5cIjtcbiAgY29uc3QgdXJsUm9vdCA9IG9wdHMudXJsUm9vdDtcbiAgY29uc3Qgc2hvd0luZGV4ID0gb3B0cy5zaG93SW5kZXggPz8gdHJ1ZTtcbiAgY29uc3QgY2xlYW5VcmxzID0gKG9wdHMgYXMgeyBjbGVhblVybHM/OiBib29sZWFuIH0pLmNsZWFuVXJscyA/PyBmYWxzZTtcbiAgY29uc3QgZG90ZmlsZXMgPSAob3B0cyBhcyB7IGRvdGZpbGVzPzogXCJhbGxvd1wiIHwgXCJkZW55XCIgfCBcImlnbm9yZVwiIH0pXG4gICAgLmRvdGZpbGVzID8/IChvcHRzLnNob3dEb3RmaWxlcyA/IFwiYWxsb3dcIiA6IFwiaWdub3JlXCIpO1xuICBjb25zdCB7IGV0YWdBbGdvcml0aG0gPSBcIlNIQS0yNTZcIiwgc2hvd0Rpckxpc3RpbmcgPSBmYWxzZSwgcXVpZXQgPSBmYWxzZSB9ID1cbiAgICBvcHRzO1xuXG4gIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxLnVybCk7XG4gIGNvbnN0IGRlY29kZWRVcmwgPSBkZWNvZGVVUklDb21wb25lbnQodXJsLnBhdGhuYW1lKTtcbiAgbGV0IG5vcm1hbGl6ZWRQYXRoID0gcG9zaXhOb3JtYWxpemUoZGVjb2RlZFVybCk7XG5cbiAgaWYgKHVybFJvb3QgJiYgIW5vcm1hbGl6ZWRQYXRoLnN0YXJ0c1dpdGgoXCIvXCIgKyB1cmxSb290KSkge1xuICAgIHJldHVybiBjcmVhdGVTdGFuZGFyZFJlc3BvbnNlKFNUQVRVU19DT0RFLk5vdEZvdW5kKTtcbiAgfVxuXG4gIC8vIFJlZGlyZWN0IHBhdGhzIGxpa2UgYC9mb28vLy8vYmFyYCBhbmQgYC9mb28vYmFyLy8vLy9gIHRvIG5vcm1hbGl6ZWQgcGF0aHMuXG4gIGlmIChub3JtYWxpemVkUGF0aCAhPT0gZGVjb2RlZFVybCkge1xuICAgIHVybC5wYXRobmFtZSA9IG5vcm1hbGl6ZWRQYXRoO1xuICAgIHJldHVybiBSZXNwb25zZS5yZWRpcmVjdCh1cmwsIDMwMSk7XG4gIH1cblxuICBpZiAodXJsUm9vdCkge1xuICAgIG5vcm1hbGl6ZWRQYXRoID0gbm9ybWFsaXplZFBhdGgucmVwbGFjZSh1cmxSb290LCBcIlwiKTtcbiAgfVxuXG4gIC8vIFJlbW92ZSB0cmFpbGluZyBzbGFzaGVzIHRvIGF2b2lkIEVOT0VOVCBlcnJvcnNcbiAgLy8gd2hlbiBhY2Nlc3NpbmcgYSBwYXRoIHRvIGEgZmlsZSB3aXRoIGEgdHJhaWxpbmcgc2xhc2guXG4gIGlmIChub3JtYWxpemVkUGF0aC5lbmRzV2l0aChcIi9cIikpIHtcbiAgICBub3JtYWxpemVkUGF0aCA9IG5vcm1hbGl6ZWRQYXRoLnNsaWNlKDAsIC0xKTtcbiAgfVxuXG4gIC8vIEEgcGVyY2VudC1lbmNvZGVkIGJhY2tzbGFzaCAoYCU1Q2ApIHN1cnZpdmVzIFVSTCBwYXJzaW5nIGFuZCBpcyB0cmVhdGVkXG4gIC8vIGFzIGEgcGF0aCBzZXBhcmF0b3IgYnkgdGhlIFdpbmRvd3MgZmlsZXN5c3RlbSwgd2hpY2ggd291bGQgYnlwYXNzIHRoZVxuICAvLyBQT1NJWC1iYXNlZCBub3JtYWxpemF0aW9uIGFuZCBkb3RmaWxlIGNoZWNrcyAoZS5nLiBgLyU1Qy5lbnZgIG9yXG4gIC8vIGAvc3ViJTVDLi4lNUMuLiU1Q3NlY3JldGApLlxuICBpZiAobm9ybWFsaXplZFBhdGguaW5jbHVkZXMoXCJcXFxcXCIpKSB7XG4gICAgcmV0dXJuIGNyZWF0ZVN0YW5kYXJkUmVzcG9uc2UoU1RBVFVTX0NPREUuTm90Rm91bmQpO1xuICB9XG5cbiAgLy8gRXhjbHVkZSBkb3RmaWxlcyB1bmxlc3MgdGhleSBhcmUgYWxsb3dlZFxuICBpZiAoZG90ZmlsZXMgIT09IFwiYWxsb3dcIiAmJiAvXFwvXFwuLy50ZXN0KG5vcm1hbGl6ZWRQYXRoKSkge1xuICAgIHJldHVybiBjcmVhdGVTdGFuZGFyZFJlc3BvbnNlKFxuICAgICAgZG90ZmlsZXMgPT09IFwiZGVueVwiID8gU1RBVFVTX0NPREUuRm9yYmlkZGVuIDogU1RBVFVTX0NPREUuTm90Rm91bmQsXG4gICAgKTtcbiAgfVxuXG4gIC8vIFJlc29sdmUgcGF0aFxuICAvLyBJZiBjbGVhblVybHMgaXMgZW5hYmxlZCwgYXV0b21hdGljYWxseSBhcHBlbmQgXCIuaHRtbFwiIGlmIG5vdCBwcmVzZW50XG4gIC8vIGFuZCBpdCBkb2VzIG5vdCBzaGFkb3cgYW5vdGhlciBleGlzdGluZyBmaWxlIG9yIGRpcmVjdG9yeVxuICBsZXQgZnNQYXRoID0gam9pbih0YXJnZXQsIG5vcm1hbGl6ZWRQYXRoKTtcbiAgaWYgKGNsZWFuVXJscyAmJiAhZnNQYXRoLmVuZHNXaXRoKFwiLmh0bWxcIikgJiYgIShhd2FpdCBleGlzdHMoZnNQYXRoKSkpIHtcbiAgICBmc1BhdGggKz0gXCIuaHRtbFwiO1xuICB9XG5cbiAgLy8gRGVmZW5zZSBpbiBkZXB0aDogdGhlIGNoZWNrcyBhYm92ZSBzaG91bGQgZ3VhcmFudGVlIGNvbnRhaW5tZW50LCBidXRcbiAgLy8gbmV2ZXIgc2VydmUgYSBwYXRoIHRoYXQgcmVzb2x2ZXMgb3V0c2lkZSB0aGUgcm9vdCBkaXJlY3RvcnkuXG4gIGNvbnN0IHJlc29sdmVkVGFyZ2V0ID0gcmVzb2x2ZSh0YXJnZXQpO1xuICBjb25zdCByZXNvbHZlZEZzUGF0aCA9IHJlc29sdmUoZnNQYXRoKTtcbiAgY29uc3QgcmVsYXRpdmVGc1BhdGggPSByZWxhdGl2ZShyZXNvbHZlZFRhcmdldCwgcmVzb2x2ZWRGc1BhdGgpO1xuXG4gIGlmIChcbiAgICBpc0Fic29sdXRlKHJlbGF0aXZlRnNQYXRoKSB8fFxuICAgIHJlbGF0aXZlRnNQYXRoID09PSBcIi4uXCIgfHxcbiAgICByZWxhdGl2ZUZzUGF0aC5zdGFydHNXaXRoKGAuLiR7U0VQQVJBVE9SfWApXG4gICkge1xuICAgIHJldHVybiBjcmVhdGVTdGFuZGFyZFJlc3BvbnNlKFNUQVRVU19DT0RFLk5vdEZvdW5kKTtcbiAgfVxuXG4gIGNvbnN0IGZpbGVJbmZvID0gYXdhaXQgRGVuby5zdGF0KGZzUGF0aCk7XG5cbiAgLy8gRm9yIGZpbGVzLCByZW1vdmUgdGhlIHRyYWlsaW5nIHNsYXNoIGZyb20gdGhlIHBhdGguXG4gIGlmIChmaWxlSW5mby5pc0ZpbGUgJiYgdXJsLnBhdGhuYW1lLmVuZHNXaXRoKFwiL1wiKSkge1xuICAgIHVybC5wYXRobmFtZSA9IHVybC5wYXRobmFtZS5zbGljZSgwLCAtMSk7XG4gICAgcmV0dXJuIFJlc3BvbnNlLnJlZGlyZWN0KHVybCwgMzAxKTtcbiAgfVxuICAvLyBGb3IgZGlyZWN0b3JpZXMsIHRoZSBwYXRoIG11c3QgaGF2ZSBhIHRyYWlsaW5nIHNsYXNoLlxuICBpZiAoZmlsZUluZm8uaXNEaXJlY3RvcnkgJiYgIXVybC5wYXRobmFtZS5lbmRzV2l0aChcIi9cIikpIHtcbiAgICAvLyBPbiBkaXJlY3RvcnkgbGlzdGluZyBwYWdlcyxcbiAgICAvLyBpZiB0aGUgY3VycmVudCBVUkwncyBwYXRobmFtZSBkb2Vzbid0IGVuZCB3aXRoIGEgc2xhc2gsIGFueVxuICAgIC8vIHJlbGF0aXZlIFVSTHMgaW4gdGhlIGluZGV4IGZpbGUgd2lsbCByZXNvbHZlIGFnYWluc3QgdGhlIHBhcmVudFxuICAgIC8vIGRpcmVjdG9yeSwgcmF0aGVyIHRoYW4gdGhlIGN1cnJlbnQgZGlyZWN0b3J5LiBUbyBwcmV2ZW50IHRoYXQsIHdlXG4gICAgLy8gcmV0dXJuIGEgMzAxIHJlZGlyZWN0IHRvIHRoZSBVUkwgd2l0aCBhIHNsYXNoLlxuICAgIHVybC5wYXRobmFtZSArPSBcIi9cIjtcbiAgICByZXR1cm4gUmVzcG9uc2UucmVkaXJlY3QodXJsLCAzMDEpO1xuICB9XG5cbiAgLy8gaWYgdGFyZ2V0IGlzIGZpbGUsIHNlcnZlIGZpbGUuXG4gIGlmICghZmlsZUluZm8uaXNEaXJlY3RvcnkpIHtcbiAgICByZXR1cm4gc2VydmVGaWxlKHJlcSwgZnNQYXRoLCB7XG4gICAgICBldGFnQWxnb3JpdGhtLFxuICAgICAgZmlsZUluZm8sXG4gICAgfSk7XG4gIH1cblxuICAvLyBpZiB0YXJnZXQgaXMgZGlyZWN0b3J5LCBzZXJ2ZSBpbmRleCBvciBkaXIgbGlzdGluZy5cbiAgaWYgKHNob3dJbmRleCkgeyAvLyBzZXJ2ZSBpbmRleC5odG1sXG4gICAgY29uc3QgaW5kZXhQYXRoID0gam9pbihmc1BhdGgsIFwiaW5kZXguaHRtbFwiKTtcblxuICAgIGxldCBpbmRleEZpbGVJbmZvOiBEZW5vLkZpbGVJbmZvIHwgdW5kZWZpbmVkO1xuICAgIHRyeSB7XG4gICAgICBpbmRleEZpbGVJbmZvID0gYXdhaXQgRGVuby5sc3RhdChpbmRleFBhdGgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoIShlcnJvciBpbnN0YW5jZW9mIERlbm8uZXJyb3JzLk5vdEZvdW5kKSkge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgIH1cbiAgICAgIC8vIHNraXAgTm90IEZvdW5kIGVycm9yXG4gICAgfVxuXG4gICAgaWYgKGluZGV4RmlsZUluZm8/LmlzRmlsZSkge1xuICAgICAgcmV0dXJuIHNlcnZlRmlsZShyZXEsIGluZGV4UGF0aCwge1xuICAgICAgICBldGFnQWxnb3JpdGhtLFxuICAgICAgICBmaWxlSW5mbzogaW5kZXhGaWxlSW5mbyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzaG93RGlyTGlzdGluZykgeyAvLyBzZXJ2ZSBkaXJlY3RvcnkgbGlzdFxuICAgIHJldHVybiBzZXJ2ZURpckluZGV4KHJlcSwgZnNQYXRoLCB7XG4gICAgICBzaG93RG90ZmlsZXM6IGRvdGZpbGVzID09PSBcImFsbG93XCIsXG4gICAgICB0YXJnZXQsXG4gICAgICBxdWlldCxcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBjcmVhdGVTdGFuZGFyZFJlc3BvbnNlKFNUQVRVU19DT0RFLk5vdEZvdW5kKTtcbn1cblxuZnVuY3Rpb24gbG9nRXJyb3IoZXJyb3I6IEVycm9yKSB7XG4gIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tY29uc29sZVxuICBjb25zb2xlLmVycm9yKGAlYyR7ZXJyb3IubWVzc2FnZX1gLCBcImNvbG9yOiByZWRcIik7XG59XG5cbmZ1bmN0aW9uIG1haW4oKSB7XG4gIGNvbnN0IHNlcnZlckFyZ3MgPSBwYXJzZUFyZ3MoRGVuby5hcmdzLCB7XG4gICAgc3RyaW5nOiBbXCJwb3J0XCIsIFwiaG9zdFwiLCBcImNlcnRcIiwgXCJrZXlcIiwgXCJoZWFkZXJcIl0sXG4gICAgYm9vbGVhbjogW1wiaGVscFwiLCBcImRpci1saXN0aW5nXCIsIFwiZG90ZmlsZXNcIiwgXCJjb3JzXCIsIFwidmVyYm9zZVwiLCBcInZlcnNpb25cIl0sXG4gICAgbmVnYXRhYmxlOiBbXCJkaXItbGlzdGluZ1wiLCBcImRvdGZpbGVzXCIsIFwiY29yc1wiXSxcbiAgICBjb2xsZWN0OiBbXCJoZWFkZXJcIl0sXG4gICAgZGVmYXVsdDoge1xuICAgICAgXCJkaXItbGlzdGluZ1wiOiB0cnVlLFxuICAgICAgZG90ZmlsZXM6IHRydWUsXG4gICAgICBjb3JzOiB0cnVlLFxuICAgICAgdmVyYm9zZTogZmFsc2UsXG4gICAgICB2ZXJzaW9uOiBmYWxzZSxcbiAgICAgIGhvc3Q6IFwiMC4wLjAuMFwiLFxuICAgICAgcG9ydDogdW5kZWZpbmVkLFxuICAgICAgY2VydDogXCJcIixcbiAgICAgIGtleTogXCJcIixcbiAgICB9LFxuICAgIGFsaWFzOiB7XG4gICAgICBwOiBcInBvcnRcIixcbiAgICAgIGM6IFwiY2VydFwiLFxuICAgICAgazogXCJrZXlcIixcbiAgICAgIGg6IFwiaGVscFwiLFxuICAgICAgdjogXCJ2ZXJib3NlXCIsXG4gICAgICBWOiBcInZlcnNpb25cIixcbiAgICAgIEg6IFwiaGVhZGVyXCIsXG4gICAgfSxcbiAgfSk7XG4gIGNvbnN0IHBvcnQgPSBzZXJ2ZXJBcmdzLnBvcnQgPyBOdW1iZXIoc2VydmVyQXJncy5wb3J0KSA6IHVuZGVmaW5lZDtcbiAgY29uc3QgaGVhZGVycyA9IHNlcnZlckFyZ3MuaGVhZGVyID8/IFtdO1xuICBjb25zdCBob3N0ID0gc2VydmVyQXJncy5ob3N0O1xuICBjb25zdCBjZXJ0RmlsZSA9IHNlcnZlckFyZ3MuY2VydDtcbiAgY29uc3Qga2V5RmlsZSA9IHNlcnZlckFyZ3Mua2V5O1xuXG4gIGlmIChzZXJ2ZXJBcmdzLmhlbHApIHtcbiAgICBwcmludFVzYWdlKCk7XG4gICAgRGVuby5leGl0KCk7XG4gIH1cblxuICBpZiAoc2VydmVyQXJncy52ZXJzaW9uKSB7XG4gICAgLy8gZGVuby1saW50LWlnbm9yZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2coYERlbm8gRmlsZSBTZXJ2ZXIgJHtkZW5vQ29uZmlnLnZlcnNpb259YCk7XG4gICAgRGVuby5leGl0KCk7XG4gIH1cblxuICBpZiAoa2V5RmlsZSB8fCBjZXJ0RmlsZSkge1xuICAgIGlmIChrZXlGaWxlID09PSBcIlwiIHx8IGNlcnRGaWxlID09PSBcIlwiKSB7XG4gICAgICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWNvbnNvbGVcbiAgICAgIGNvbnNvbGUubG9nKFwiLS1rZXkgYW5kIC0tY2VydCBhcmUgcmVxdWlyZWQgZm9yIFRMU1wiKTtcbiAgICAgIHByaW50VXNhZ2UoKTtcbiAgICAgIERlbm8uZXhpdCgxKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCB3aWxkID0gc2VydmVyQXJncy5fIGFzIHN0cmluZ1tdO1xuICBjb25zdCB0YXJnZXQgPSByZXNvbHZlKHdpbGRbMF0gPz8gXCJcIik7XG5cbiAgY29uc3QgaGFuZGxlciA9IChyZXE6IFJlcXVlc3QpOiBQcm9taXNlPFJlc3BvbnNlPiA9PiB7XG4gICAgcmV0dXJuIHNlcnZlRGlyKHJlcSwge1xuICAgICAgZnNSb290OiB0YXJnZXQsXG4gICAgICBzaG93RGlyTGlzdGluZzogc2VydmVyQXJnc1tcImRpci1saXN0aW5nXCJdLFxuICAgICAgc2hvd0RvdGZpbGVzOiBzZXJ2ZXJBcmdzLmRvdGZpbGVzLFxuICAgICAgZW5hYmxlQ29yczogc2VydmVyQXJncy5jb3JzLFxuICAgICAgcXVpZXQ6ICFzZXJ2ZXJBcmdzLnZlcmJvc2UsXG4gICAgICBoZWFkZXJzLFxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHVzZVRscyA9ICEhKGtleUZpbGUgJiYgY2VydEZpbGUpO1xuXG4gIGZ1bmN0aW9uIG9uTGlzdGVuKHsgcG9ydCwgaG9zdG5hbWUgfTogeyBwb3J0OiBudW1iZXI7IGhvc3RuYW1lOiBzdHJpbmcgfSkge1xuICAgIGxldCBuZXR3b3JrQWRkcmVzczogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGlmIChORVRfUEVSTV9TVEFUVVMgPT09IFwiZ3JhbnRlZFwiKSB7XG4gICAgICBuZXR3b3JrQWRkcmVzcyA9IGdldE5ldHdvcmtBZGRyZXNzKCk7XG4gICAgfVxuICAgIGNvbnN0IHByb3RvY29sID0gdXNlVGxzID8gXCJodHRwc1wiIDogXCJodHRwXCI7XG4gICAgY29uc3QgaG9zdCA9IChEZW5vLmJ1aWxkLm9zID09PSBcIndpbmRvd3NcIiAmJiBob3N0bmFtZSA9PT0gXCIwLjAuMC4wXCIpXG4gICAgICA/IFwibG9jYWxob3N0XCJcbiAgICAgIDogaG9zdG5hbWU7XG5cbiAgICBjb25zdCBmb3JtYXR0ZWRIb3N0ID0gaG9zdG5hbWUuaW5jbHVkZXMoXCI6XCIpID8gYFske2hvc3R9XWAgOiBob3N0O1xuICAgIGxldCBtZXNzYWdlID1cbiAgICAgIGBMaXN0ZW5pbmcgb246XFxuLSBMb2NhbDogJHtwcm90b2NvbH06Ly8ke2Zvcm1hdHRlZEhvc3R9OiR7cG9ydH1gO1xuICAgIGlmIChuZXR3b3JrQWRkcmVzcyAmJiAhREVOT19ERVBMT1lNRU5UX0lEKSB7XG4gICAgICBtZXNzYWdlICs9IGBcXG4tIE5ldHdvcms6ICR7cHJvdG9jb2x9Oi8vJHtuZXR3b3JrQWRkcmVzc306JHtwb3J0fWA7XG4gICAgfVxuICAgIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xuICB9XG5cbiAgLy8gVE9ETyhwZXRhbW9yaWtlbik6IE1pZ3JhdGUgYERlbm8uU2VydmVUY3BPcHRpb25zIHwgKERlbm8uU2VydmVUY3BPcHRpb25zICYgRGVuby5UbHNDZXJ0aWZpZWRLZXlPcHRpb25zKWAgaW4gdjJcbiAgY29uc3Qgb3B0aW9uczoge1xuICAgIHBvcnQ/OiBudW1iZXI7XG4gICAgaG9zdG5hbWU/OiBzdHJpbmc7XG4gICAgb25MaXN0ZW4/OiAobG9jYWxBZGRyOiBEZW5vLk5ldEFkZHIpID0+IHZvaWQ7XG4gICAgY2VydD86IHN0cmluZztcbiAgICBrZXk/OiBzdHJpbmc7XG4gIH0gPSB7XG4gICAgaG9zdG5hbWU6IGhvc3QsXG4gICAgb25MaXN0ZW4sXG4gIH07XG4gIGlmIChwb3J0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zLnBvcnQgPSBwb3J0O1xuICB9XG4gIGlmICh1c2VUbHMpIHtcbiAgICBvcHRpb25zLmNlcnQgPSBEZW5vLnJlYWRUZXh0RmlsZVN5bmMoY2VydEZpbGUpO1xuICAgIG9wdGlvbnMua2V5ID0gRGVuby5yZWFkVGV4dEZpbGVTeW5jKGtleUZpbGUpO1xuICB9XG4gIERlbm8uc2VydmUob3B0aW9ucywgaGFuZGxlcik7XG59XG5cbmZ1bmN0aW9uIHByaW50VXNhZ2UoKSB7XG4gIC8vIGRlbm8tbGludC1pZ25vcmUgbm8tY29uc29sZVxuICBjb25zb2xlLmxvZyhgRGVubyBGaWxlIFNlcnZlciAke2Rlbm9Db25maWcudmVyc2lvbn1cbiAgU2VydmVzIGEgbG9jYWwgZGlyZWN0b3J5IGluIEhUVFAuXG5cbklOU1RBTEw6XG4gIGRlbm8gaW5zdGFsbCAtLWFsbG93LW5ldCAtLWFsbG93LXJlYWQgLS1hbGxvdy1zeXMganNyOkBzdGQvaHR0cEAke2Rlbm9Db25maWcudmVyc2lvbn0vZmlsZS1zZXJ2ZXJcblxuVVNBR0U6XG4gIGZpbGVfc2VydmVyIFtwYXRoXSBbb3B0aW9uc11cblxuT1BUSU9OUzpcbiAgLWgsIC0taGVscCAgICAgICAgICAgIFByaW50cyBoZWxwIGluZm9ybWF0aW9uXG4gIC1wLCAtLXBvcnQgPFBPUlQ+ICAgICBTZXQgcG9ydCAoZGVmYXVsdCBpcyA4MDAwKVxuICAtLWNvcnMgICAgICAgICAgICAgICAgRW5hYmxlIENPUlMgdmlhIHRoZSBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiIGhlYWRlclxuICAtLWhvc3QgICAgIDxIT1NUPiAgICAgSG9zdG5hbWUgKGRlZmF1bHQgaXMgMC4wLjAuMClcbiAgLWMsIC0tY2VydCA8RklMRT4gICAgIFRMUyBjZXJ0aWZpY2F0ZSBmaWxlIChlbmFibGVzIFRMUylcbiAgLWssIC0ta2V5ICA8RklMRT4gICAgIFRMUyBrZXkgZmlsZSAoZW5hYmxlcyBUTFMpXG4gIC1ILCAtLWhlYWRlciA8SEVBREVSPiBTZXRzIGEgaGVhZGVyIG9uIGV2ZXJ5IHJlcXVlc3QuXG4gICAgICAgICAgICAgICAgICAgICAgICAoZS5nLiAtLWhlYWRlciBcIkNhY2hlLUNvbnRyb2w6IG5vLWNhY2hlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBUaGlzIG9wdGlvbiBjYW4gYmUgc3BlY2lmaWVkIG11bHRpcGxlIHRpbWVzLlxuICAtLW5vLWRpci1saXN0aW5nICAgICAgRGlzYWJsZSBkaXJlY3RvcnkgbGlzdGluZ1xuICAtLW5vLWRvdGZpbGVzICAgICAgICAgRG8gbm90IHNob3cgZG90ZmlsZXNcbiAgLS1uby1jb3JzICAgICAgICAgICAgIERpc2FibGUgY3Jvc3Mtb3JpZ2luIHJlc291cmNlIHNoYXJpbmdcbiAgLXYsIC0tdmVyYm9zZSAgICAgICAgIFByaW50IHJlcXVlc3QgbGV2ZWwgbG9nc1xuICAtViwgLS12ZXJzaW9uICAgICAgICAgUHJpbnQgdmVyc2lvbiBpbmZvcm1hdGlvblxuXG4gIEFsbCBUTFMgb3B0aW9ucyBhcmUgcmVxdWlyZWQgd2hlbiBvbmUgaXMgcHJvdmlkZWQuYCk7XG59XG5cbmlmIChpbXBvcnQubWV0YS5tYWluKSB7XG4gIG1haW4oKTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EscURBQXFEO0FBRXJELGdFQUFnRTtBQUNoRSwyQ0FBMkM7QUFDM0MsZ0ZBQWdGO0FBRWhGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBeUJDLEdBRUQsU0FBUyxhQUFhLGNBQWMsUUFBUSx1Q0FBdUM7QUFDbkYsU0FBUyxPQUFPLFFBQVEsK0JBQStCO0FBQ3ZELFNBQVMsVUFBVSxRQUFRLG1DQUFtQztBQUM5RCxTQUFTLElBQUksUUFBUSw0QkFBNEI7QUFDakQsU0FBUyxRQUFRLFFBQVEsZ0NBQWdDO0FBQ3pELFNBQVMsT0FBTyxRQUFRLCtCQUErQjtBQUN2RCxTQUFTLFNBQVMsRUFBRSxpQkFBaUIsUUFBUSxpQ0FBaUM7QUFDOUUsU0FBUyxNQUFNLFFBQVEsNkJBQTZCO0FBQ3BELFNBQVMsV0FBVyxRQUFRLDJDQUEyQztBQUN2RSxTQUFTLElBQUksRUFBRSxXQUFXLFFBQVEsWUFBWTtBQUM5QyxTQUNFLGdCQUFnQixFQUNoQixXQUFXLEVBQ1gsV0FBVyxRQUVOLGNB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
// denoCacheMetadata=7288502068170385233,11410981820227530233