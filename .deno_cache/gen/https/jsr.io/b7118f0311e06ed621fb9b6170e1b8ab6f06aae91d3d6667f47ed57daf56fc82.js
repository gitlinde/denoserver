// Copyright 2018-2026 the Deno authors. MIT license.
// Documentation and interface for walk were adapted from Go
// https://golang.org/pkg/path/filepath/#Walk
// Copyright 2009 The Go Authors. All rights reserved. BSD license.
import { join } from "jsr:@std/path@^1.1.5/join";
import { toPathString } from "./_to_path_string.ts";
import { createWalkEntry, createWalkEntrySync } from "./_create_walk_entry.ts";
function include(path, exts, match, skip) {
  if (exts && !exts.some((ext)=>path.endsWith(ext))) {
    return false;
  }
  if (match && !match.some((pattern)=>!!path.match(pattern))) {
    return false;
  }
  if (skip && skip.some((pattern)=>!!path.match(pattern))) {
    return false;
  }
  return true;
}
/**
 * Recursively walks through a directory and yields information about each file
 * and directory encountered.
 *
 * The root path determines whether the file paths are relative or absolute.
 * The root directory is included in the yielded entries.
 *
 * Requires `--allow-read` permission.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param root The root directory to start the walk from, as a string or URL.
 * @param options The options for the walk.
 * @throws {Deno.errors.NotFound} If the root directory does not exist.
 *
 * @returns An async iterable iterator that yields the walk entry objects.
 *
 * @example Basic usage
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── foo.ts
 * ```
 *
 * ```ts ignore
 * import { walk } from "@std/fs/walk";
 *
 * await Array.fromAsync(walk("."));
 * // [
 * //   {
 * //     path: ".",
 * //     name: ".",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "foo.ts",
 * //     name: "foo.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 *
 * @example Maximum file depth
 *
 * Setting the `maxDepth` option to `1` will only include the root directory and
 * its immediate children.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── foo
 *     └── bar.ts
 * ```
 *
 * ```ts ignore
 * import { walk } from "@std/fs/walk";
 *
 * await Array.fromAsync(walk(".", { maxDepth: 1 }));
 * // [
 * //   {
 * //     path: ".",
 * //     name: ".",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "foo",
 * //     name: "foo",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 *
 * @example Exclude files
 *
 * Setting the `includeFiles` option to `false` will exclude files.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── foo
 * ```
 *
 * ```ts ignore
 * import { walk } from "@std/fs/walk";
 *
 * await Array.fromAsync(walk(".", { includeFiles: false }));
 * // [
 * //   {
 * //     path: ".",
 * //     name: ".",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "foo",
 * //     name: "foo",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false,
 * //   },
 * // ]
 * ```
 *
 * @example Exclude directories
 *
 * Setting the `includeDirs` option to `false` will exclude directories.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── foo
 * ```
 *
 * ```ts ignore
 * import { walk } from "@std/fs/walk";
 *
 * await Array.fromAsync(walk(".", { includeDirs: false }));
 * // [
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 *
 * @example Exclude symbolic links
 *
 * Setting the `includeSymlinks` option to `false` will exclude symbolic links.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * ├── foo
 * └── link -> script.ts (symbolic link)
 * ```
 *
 * ```ts ignore
 * import { walk } from "@std/fs/walk";
 *
 * await Array.fromAsync(walk(".", { includeSymlinks: false }));
 * // [
 * //   {
 * //     path: ".",
 * //     name: ".",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 *
 * @example Follow symbolic links
 *
 * Setting the `followSymlinks` option to `true` will follow symbolic links,
 * affecting the `path` property of the walk entry.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── link -> script.ts (symbolic link)
 * ```
 *
 * ```ts ignore
 * import { walk } from "@std/fs/walk";
 *
 * await Array.fromAsync(walk(".", { followSymlinks: true }));
 * // [
 * //   {
 * //     path: ".",
 * //     name: ".",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "script.ts",
 * //     name: "link",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: true
 * //   },
 * // ]
 * ```
 *
 * @example Canonicalize symbolic links
 *
 * Setting the `canonicalize` option to `false` will canonicalize the path of
 * the followed symbolic link. Meaning, the `path` property of the walk entry
 * will be the path of the symbolic link itself.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── link -> script.ts (symbolic link)
 * ```
 *
 * ```ts ignore
 * import { walk } from "@std/fs/walk";
 *
 * await Array.fromAsync(walk(".", { followSymlinks: true, canonicalize: true }));
 * // [
 * //   {
 * //     path: ".",
 * //     name: ".",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "link",
 * //     name: "link",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: true
 * //   },
 * // ]
 * ```
 *
 * @example Filter by file extensions
 *
 * Setting the `exts` option to `[".ts"]` or `["ts"]` will only include entries
 * with the `.ts` file extension.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── foo.js
 * ```
 *
 * ```ts ignore
 * import { walk } from "@std/fs/walk";
 *
 * await Array.fromAsync(walk(".", { exts: [".ts"] }));
 * // [
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 *
 * @example Filter by regular expressions
 *
 * Setting the `match` option to `[/s/]` will only include entries with the
 * letter `s` in their name.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── README.md
 * ```
 *
 * ```ts ignore
 * import { walk } from "@std/fs/walk";
 *
 * await Array.fromAsync(walk(".", { match: [/s/] }));
 * // [
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 *
 * @example Exclude by regular expressions
 *
 * Setting the `skip` option to `[/s/]` will exclude entries with the letter
 * `s` in their name.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── README.md
 * ```
 *
 * ```ts ignore
 * import { walk } from "@std/fs/walk";
 *
 * await Array.fromAsync(walk(".", { skip: [/s/] }));
 * // [
 * //   {
 * //     path: "README.md",
 * //     name: "README.md",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 */ export async function* walk(root, options) {
  let { maxDepth = Infinity, includeFiles = true, includeDirs = true, includeSymlinks = true, followSymlinks = false, canonicalize = true, exts = undefined, match = undefined, skip = undefined } = options ?? {};
  if (maxDepth < 0) {
    return;
  }
  root = toPathString(root);
  if (exts) {
    exts = exts.map((ext)=>ext.startsWith(".") ? ext : `.${ext}`);
  }
  if (includeDirs && include(root, exts, match, skip)) {
    yield await createWalkEntry(root);
  }
  if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
    return;
  }
  for await (const entry of Deno.readDir(root)){
    let path = join(root, entry.name);
    let { isSymlink, isDirectory } = entry;
    if (isSymlink) {
      if (!followSymlinks) {
        if (includeSymlinks && include(path, exts, match, skip)) {
          yield {
            path,
            ...entry
          };
        }
        continue;
      }
      const realPath = await Deno.realPath(path);
      if (canonicalize) {
        path = realPath;
      }
      // Caveat emptor: don't assume |path| is not a symlink. realpath()
      // resolves symlinks but another process can replace the file system
      // entity with a different type of entity before we call lstat().
      ({ isSymlink, isDirectory } = await Deno.lstat(realPath));
    }
    if (isSymlink || isDirectory) {
      const opts = {
        maxDepth: maxDepth - 1,
        includeFiles,
        includeDirs,
        includeSymlinks,
        followSymlinks
      };
      if (exts !== undefined) {
        opts.exts = exts;
      }
      if (match !== undefined) {
        opts.match = match;
      }
      if (skip !== undefined) {
        opts.skip = skip;
      }
      yield* walk(path, opts);
    } else if (includeFiles && include(path, exts, match, skip)) {
      yield {
        path,
        ...entry
      };
    }
  }
}
/**
 * Recursively walks through a directory and yields information about each file
 * and directory encountered.
 *
 * The root path determines whether the file paths is relative or absolute.
 * The root directory is included in the yielded entries.
 *
 * Requires `--allow-read` permission.
 *
 * @see {@link https://docs.deno.com/runtime/manual/basics/permissions#file-system-access}
 * for more information on Deno's permissions system.
 *
 * @param root The root directory to start the walk from, as a string or URL.
 * @param options The options for the walk.
 *
 * @returns A synchronous iterable iterator that yields the walk entry objects.
 *
 * @example Basic usage
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── foo.ts
 * ```
 *
 * ```ts ignore
 * import { walkSync } from "@std/fs/walk";
 *
 * Array.from(walkSync("."));
 * // [
 * //   {
 * //     path: ".",
 * //     name: ".",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "foo.ts",
 * //     name: "foo.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 *
 * @example Maximum file depth
 *
 * Setting the `maxDepth` option to `1` will only include the root directory and
 * its immediate children.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── foo
 *     └── bar.ts
 * ```
 *
 * ```ts ignore
 * import { walkSync } from "@std/fs/walk";
 *
 * Array.from(walkSync(".", { maxDepth: 1 }));
 * // [
 * //   {
 * //     path: ".",
 * //     name: ".",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "foo",
 * //     name: "foo",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 *
 * @example Exclude files
 *
 * Setting the `includeFiles` option to `false` will exclude files.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── foo
 * ```
 *
 * ```ts ignore
 * import { walkSync } from "@std/fs/walk";
 *
 * Array.from(walkSync(".", { includeFiles: false }));
 * // [
 * //   {
 * //     path: ".",
 * //     name: ".",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "foo",
 * //     name: "foo",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false,
 * //   },
 * // ]
 * ```
 *
 * @example Exclude directories
 *
 * Setting the `includeDirs` option to `false` will exclude directories.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── foo
 * ```
 *
 * ```ts ignore
 * import { walkSync } from "@std/fs/walk";
 *
 * Array.from(walkSync(".", { includeDirs: false }));
 * // [
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 *
 * @example Exclude symbolic links
 *
 * Setting the `includeSymlinks` option to `false` will exclude symbolic links.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * ├── foo
 * └── link -> script.ts (symbolic link)
 * ```
 *
 * ```ts ignore
 * import { walkSync } from "@std/fs/walk";
 *
 * Array.from(walkSync(".", { includeSymlinks: false }));
 * // [
 * //   {
 * //     path: ".",
 * //     name: ".",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 *
 * @example Follow symbolic links
 *
 * Setting the `followSymlinks` option to `true` will follow symbolic links,
 * affecting the `path` property of the walk entry.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── link -> script.ts (symbolic link)
 * ```
 *
 * ```ts ignore
 * import { walkSync } from "@std/fs/walk";
 *
 * Array.from(walkSync(".", { followSymlinks: true }));
 * // [
 * //   {
 * //     path: ".",
 * //     name: ".",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "script.ts",
 * //     name: "link",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: true
 * //   },
 * // ]
 * ```
 *
 * @example Canonicalize symbolic links
 *
 * Setting the `canonicalize` option to `false` will canonicalize the path of
 * the followed symbolic link. Meaning, the `path` property of the walk entry
 * will be the path of the symbolic link itself.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── link -> script.ts (symbolic link)
 * ```
 *
 * ```ts ignore
 * import { walkSync } from "@std/fs/walk";
 *
 * Array.from(walkSync(".", { followSymlinks: true, canonicalize: true }));
 * // [
 * //   {
 * //     path: ".",
 * //     name: ".",
 * //     isFile: false,
 * //     isDirectory: true,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * //   {
 * //     path: "link",
 * //     name: "link",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: true
 * //   },
 * // ]
 * ```
 *
 * @example Filter by file extensions
 *
 * Setting the `exts` option to `[".ts"]` or `["ts"]` will only include entries
 * with the `.ts` file extension.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── foo.js
 * ```
 *
 * ```ts ignore
 * import { walkSync } from "@std/fs/walk";
 *
 * Array.from(walkSync(".", { exts: [".ts"] }));
 * // [
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 *
 * @example Filter by regular expressions
 *
 * Setting the `match` option to `[/s/]` will only include entries with the
 * letter `s` in their name.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── README.md
 * ```
 *
 * ```ts ignore
 * import { walkSync } from "@std/fs/walk";
 *
 * Array.from(walkSync(".", { match: [/s/] }));
 * // [
 * //   {
 * //     path: "script.ts",
 * //     name: "script.ts",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 *
 * @example Exclude by regular expressions
 *
 * Setting the `skip` option to `[/s/]` will exclude entries with the letter
 * `s` in their name.
 *
 * File structure:
 * ```
 * folder
 * ├── script.ts
 * └── README.md
 * ```
 *
 * ```ts ignore
 * import { walkSync } from "@std/fs/walk";
 *
 * Array.from(walkSync(".", { skip: [/s/] }));
 * // [
 * //   {
 * //     path: "README.md",
 * //     name: "README.md",
 * //     isFile: true,
 * //     isDirectory: false,
 * //     isSymlink: false
 * //   },
 * // ]
 * ```
 */ export function* walkSync(root, options) {
  let { maxDepth = Infinity, includeFiles = true, includeDirs = true, includeSymlinks = true, followSymlinks = false, canonicalize = true, exts = undefined, match = undefined, skip = undefined } = options ?? {};
  root = toPathString(root);
  if (exts) {
    exts = exts.map((ext)=>ext.startsWith(".") ? ext : `.${ext}`);
  }
  if (maxDepth < 0) {
    return;
  }
  if (includeDirs && include(root, exts, match, skip)) {
    yield createWalkEntrySync(root);
  }
  if (maxDepth < 1 || !include(root, undefined, undefined, skip)) {
    return;
  }
  const entries = Deno.readDirSync(root);
  for (const entry of entries){
    let path = join(root, entry.name);
    let { isSymlink, isDirectory } = entry;
    if (isSymlink) {
      if (!followSymlinks) {
        if (includeSymlinks && include(path, exts, match, skip)) {
          yield {
            path,
            ...entry
          };
        }
        continue;
      }
      const realPath = Deno.realPathSync(path);
      if (canonicalize) {
        path = realPath;
      }
      // Caveat emptor: don't assume |path| is not a symlink. realpath()
      // resolves symlinks but another process can replace the file system
      // entity with a different type of entity before we call lstat().
      ({ isSymlink, isDirectory } = Deno.lstatSync(realPath));
    }
    if (isSymlink || isDirectory) {
      const opts = {
        maxDepth: maxDepth - 1,
        includeFiles,
        includeDirs,
        includeSymlinks,
        followSymlinks
      };
      if (exts !== undefined) {
        opts.exts = exts;
      }
      if (match !== undefined) {
        opts.match = match;
      }
      if (skip !== undefined) {
        opts.skip = skip;
      }
      yield* walkSync(path, opts);
    } else if (includeFiles && include(path, exts, match, skip)) {
      yield {
        path,
        ...entry
      };
    }
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vanNyLmlvL0BzdGQvZnMvMS4wLjI0L3dhbGsudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyNiB0aGUgRGVubyBhdXRob3JzLiBNSVQgbGljZW5zZS5cbi8vIERvY3VtZW50YXRpb24gYW5kIGludGVyZmFjZSBmb3Igd2FsayB3ZXJlIGFkYXB0ZWQgZnJvbSBHb1xuLy8gaHR0cHM6Ly9nb2xhbmcub3JnL3BrZy9wYXRoL2ZpbGVwYXRoLyNXYWxrXG4vLyBDb3B5cmlnaHQgMjAwOSBUaGUgR28gQXV0aG9ycy4gQWxsIHJpZ2h0cyByZXNlcnZlZC4gQlNEIGxpY2Vuc2UuXG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcImpzcjpAc3RkL3BhdGhAXjEuMS41L2pvaW5cIjtcbmltcG9ydCB7IHRvUGF0aFN0cmluZyB9IGZyb20gXCIuL190b19wYXRoX3N0cmluZy50c1wiO1xuaW1wb3J0IHtcbiAgY3JlYXRlV2Fsa0VudHJ5LFxuICBjcmVhdGVXYWxrRW50cnlTeW5jLFxuICB0eXBlIFdhbGtFbnRyeSxcbn0gZnJvbSBcIi4vX2NyZWF0ZV93YWxrX2VudHJ5LnRzXCI7XG5cbmZ1bmN0aW9uIGluY2x1ZGUoXG4gIHBhdGg6IHN0cmluZyxcbiAgZXh0cz86IHN0cmluZ1tdLFxuICBtYXRjaD86IFJlZ0V4cFtdLFxuICBza2lwPzogUmVnRXhwW10sXG4pOiBib29sZWFuIHtcbiAgaWYgKGV4dHMgJiYgIWV4dHMuc29tZSgoZXh0KTogYm9vbGVhbiA9PiBwYXRoLmVuZHNXaXRoKGV4dCkpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChtYXRjaCAmJiAhbWF0Y2guc29tZSgocGF0dGVybik6IGJvb2xlYW4gPT4gISFwYXRoLm1hdGNoKHBhdHRlcm4pKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoc2tpcCAmJiBza2lwLnNvbWUoKHBhdHRlcm4pOiBib29sZWFuID0+ICEhcGF0aC5tYXRjaChwYXR0ZXJuKSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKiBPcHRpb25zIGZvciB7QGxpbmtjb2RlIHdhbGt9IGFuZCB7QGxpbmtjb2RlIHdhbGtTeW5jfS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgV2Fsa09wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG1heGltdW0gZGVwdGggb2YgdGhlIGZpbGUgdHJlZSB0byBiZSB3YWxrZWQgcmVjdXJzaXZlbHkuXG4gICAqXG4gICAqIEBkZWZhdWx0IHtJbmZpbml0eX1cbiAgICovXG4gIG1heERlcHRoPzogbnVtYmVyO1xuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgZmlsZSBlbnRyaWVzIHNob3VsZCBiZSBpbmNsdWRlZCBvciBub3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IHt0cnVlfVxuICAgKi9cbiAgaW5jbHVkZUZpbGVzPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIGRpcmVjdG9yeSBlbnRyaWVzIHNob3VsZCBiZSBpbmNsdWRlZCBvciBub3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IHt0cnVlfVxuICAgKi9cbiAgaW5jbHVkZURpcnM/OiBib29sZWFuO1xuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgc3ltbGluayBlbnRyaWVzIHNob3VsZCBiZSBpbmNsdWRlZCBvciBub3QuXG4gICAqIFRoaXMgb3B0aW9uIGlzIG1lYW5pbmdmdWwgb25seSBpZiBgZm9sbG93U3ltbGlua3NgIGlzIHNldCB0byBgZmFsc2VgLlxuICAgKlxuICAgKiBAZGVmYXVsdCB7dHJ1ZX1cbiAgICovXG4gIGluY2x1ZGVTeW1saW5rcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBzeW1saW5rcyBzaG91bGQgYmUgcmVzb2x2ZWQgb3Igbm90LlxuICAgKlxuICAgKiBAZGVmYXVsdCB7ZmFsc2V9XG4gICAqL1xuICBmb2xsb3dTeW1saW5rcz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgZm9sbG93ZWQgc3ltbGluaydzIHBhdGggc2hvdWxkIGJlIGNhbm9uaWNhbGl6ZWQuXG4gICAqIFRoaXMgb3B0aW9uIHdvcmtzIG9ubHkgaWYgYGZvbGxvd1N5bWxpbmtzYCBpcyBub3QgYGZhbHNlYC5cbiAgICpcbiAgICogQGRlZmF1bHQge3RydWV9XG4gICAqL1xuICBjYW5vbmljYWxpemU/OiBib29sZWFuO1xuICAvKipcbiAgICogTGlzdCBvZiBmaWxlIGV4dGVuc2lvbnMgdXNlZCB0byBmaWx0ZXIgZW50cmllcy5cbiAgICogSWYgc3BlY2lmaWVkLCBlbnRyaWVzIHdpdGhvdXQgdGhlIGZpbGUgZXh0ZW5zaW9uIHNwZWNpZmllZCBieSB0aGlzIG9wdGlvblxuICAgKiBhcmUgZXhjbHVkZWQuXG4gICAqXG4gICAqIEZpbGUgZXh0ZW5zaW9ucyB3aXRoIG9yIHdpdGhvdXQgYSBsZWFkaW5nIHBlcmlvZCBhcmUgYWNjZXB0ZWQuXG4gICAqL1xuICBleHRzPzogc3RyaW5nW107XG4gIC8qKlxuICAgKiBMaXN0IG9mIHJlZ3VsYXIgZXhwcmVzc2lvbiBwYXR0ZXJucyB1c2VkIHRvIGZpbHRlciBlbnRyaWVzLlxuICAgKiBJZiBzcGVjaWZpZWQsIGVudHJpZXMgdGhhdCBkbyBub3QgbWF0Y2ggdGhlIHBhdHRlcm5zIHNwZWNpZmllZCBieSB0aGlzXG4gICAqIG9wdGlvbiBhcmUgZXhjbHVkZWQuXG4gICAqL1xuICBtYXRjaD86IFJlZ0V4cFtdO1xuICAvKipcbiAgICogTGlzdCBvZiByZWd1bGFyIGV4cHJlc3Npb24gcGF0dGVybnMgdXNlZCB0byBmaWx0ZXIgZW50cmllcy5cbiAgICogSWYgc3BlY2lmaWVkLCBlbnRyaWVzIG1hdGNoaW5nIHRoZSBwYXR0ZXJucyBzcGVjaWZpZWQgYnkgdGhpcyBvcHRpb24gYXJlXG4gICAqIGV4Y2x1ZGVkLlxuICAgKi9cbiAgc2tpcD86IFJlZ0V4cFtdO1xufVxuZXhwb3J0IHR5cGUgeyBXYWxrRW50cnkgfTtcblxuLyoqXG4gKiBSZWN1cnNpdmVseSB3YWxrcyB0aHJvdWdoIGEgZGlyZWN0b3J5IGFuZCB5aWVsZHMgaW5mb3JtYXRpb24gYWJvdXQgZWFjaCBmaWxlXG4gKiBhbmQgZGlyZWN0b3J5IGVuY291bnRlcmVkLlxuICpcbiAqIFRoZSByb290IHBhdGggZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBmaWxlIHBhdGhzIGFyZSByZWxhdGl2ZSBvciBhYnNvbHV0ZS5cbiAqIFRoZSByb290IGRpcmVjdG9yeSBpcyBpbmNsdWRlZCBpbiB0aGUgeWllbGRlZCBlbnRyaWVzLlxuICpcbiAqIFJlcXVpcmVzIGAtLWFsbG93LXJlYWRgIHBlcm1pc3Npb24uXG4gKlxuICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9kb2NzLmRlbm8uY29tL3J1bnRpbWUvbWFudWFsL2Jhc2ljcy9wZXJtaXNzaW9ucyNmaWxlLXN5c3RlbS1hY2Nlc3N9XG4gKiBmb3IgbW9yZSBpbmZvcm1hdGlvbiBvbiBEZW5vJ3MgcGVybWlzc2lvbnMgc3lzdGVtLlxuICpcbiAqIEBwYXJhbSByb290IFRoZSByb290IGRpcmVjdG9yeSB0byBzdGFydCB0aGUgd2FsayBmcm9tLCBhcyBhIHN0cmluZyBvciBVUkwuXG4gKiBAcGFyYW0gb3B0aW9ucyBUaGUgb3B0aW9ucyBmb3IgdGhlIHdhbGsuXG4gKiBAdGhyb3dzIHtEZW5vLmVycm9ycy5Ob3RGb3VuZH0gSWYgdGhlIHJvb3QgZGlyZWN0b3J5IGRvZXMgbm90IGV4aXN0LlxuICpcbiAqIEByZXR1cm5zIEFuIGFzeW5jIGl0ZXJhYmxlIGl0ZXJhdG9yIHRoYXQgeWllbGRzIHRoZSB3YWxrIGVudHJ5IG9iamVjdHMuXG4gKlxuICogQGV4YW1wbGUgQmFzaWMgdXNhZ2VcbiAqXG4gKiBGaWxlIHN0cnVjdHVyZTpcbiAqIGBgYFxuICogZm9sZGVyXG4gKiDilJzilIDilIAgc2NyaXB0LnRzXG4gKiDilJTilIDilIAgZm9vLnRzXG4gKiBgYGBcbiAqXG4gKiBgYGB0cyBpZ25vcmVcbiAqIGltcG9ydCB7IHdhbGsgfSBmcm9tIFwiQHN0ZC9mcy93YWxrXCI7XG4gKlxuICogYXdhaXQgQXJyYXkuZnJvbUFzeW5jKHdhbGsoXCIuXCIpKTtcbiAqIC8vIFtcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwiLlwiLFxuICogLy8gICAgIG5hbWU6IFwiLlwiLFxuICogLy8gICAgIGlzRmlsZTogZmFsc2UsXG4gKiAvLyAgICAgaXNEaXJlY3Rvcnk6IHRydWUsXG4gKiAvLyAgICAgaXNTeW1saW5rOiBmYWxzZVxuICogLy8gICB9LFxuICogLy8gICB7XG4gKiAvLyAgICAgcGF0aDogXCJzY3JpcHQudHNcIixcbiAqIC8vICAgICBuYW1lOiBcInNjcmlwdC50c1wiLFxuICogLy8gICAgIGlzRmlsZTogdHJ1ZSxcbiAqIC8vICAgICBpc0RpcmVjdG9yeTogZmFsc2UsXG4gKiAvLyAgICAgaXNTeW1saW5rOiBmYWxzZVxuICogLy8gICB9LFxuICogLy8gICB7XG4gKiAvLyAgICAgcGF0aDogXCJmb28udHNcIixcbiAqIC8vICAgICBuYW1lOiBcImZvby50c1wiLFxuICogLy8gICAgIGlzRmlsZTogdHJ1ZSxcbiAqIC8vICAgICBpc0RpcmVjdG9yeTogZmFsc2UsXG4gKiAvLyAgICAgaXNTeW1saW5rOiBmYWxzZVxuICogLy8gICB9LFxuICogLy8gXVxuICogYGBgXG4gKlxuICogQGV4YW1wbGUgTWF4aW11bSBmaWxlIGRlcHRoXG4gKlxuICogU2V0dGluZyB0aGUgYG1heERlcHRoYCBvcHRpb24gdG8gYDFgIHdpbGwgb25seSBpbmNsdWRlIHRoZSByb290IGRpcmVjdG9yeSBhbmRcbiAqIGl0cyBpbW1lZGlhdGUgY2hpbGRyZW4uXG4gKlxuICogRmlsZSBzdHJ1Y3R1cmU6XG4gKiBgYGBcbiAqIGZvbGRlclxuICog4pSc4pSA4pSAIHNjcmlwdC50c1xuICog4pSU4pSA4pSAIGZvb1xuICogICAgIOKUlOKUgOKUgCBiYXIudHNcbiAqIGBgYFxuICpcbiAqIGBgYHRzIGlnbm9yZVxuICogaW1wb3J0IHsgd2FsayB9IGZyb20gXCJAc3RkL2ZzL3dhbGtcIjtcbiAqXG4gKiBhd2FpdCBBcnJheS5mcm9tQXN5bmMod2FsayhcIi5cIiwgeyBtYXhEZXB0aDogMSB9KSk7XG4gKiAvLyBbXG4gKiAvLyAgIHtcbiAqIC8vICAgICBwYXRoOiBcIi5cIixcbiAqIC8vICAgICBuYW1lOiBcIi5cIixcbiAqIC8vICAgICBpc0ZpbGU6IGZhbHNlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiB0cnVlLFxuICogLy8gICAgIGlzU3ltbGluazogZmFsc2VcbiAqIC8vICAgfSxcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwic2NyaXB0LnRzXCIsXG4gKiAvLyAgICAgbmFtZTogXCJzY3JpcHQudHNcIixcbiAqIC8vICAgICBpc0ZpbGU6IHRydWUsXG4gKiAvLyAgICAgaXNEaXJlY3Rvcnk6IGZhbHNlLFxuICogLy8gICAgIGlzU3ltbGluazogZmFsc2VcbiAqIC8vICAgfSxcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwiZm9vXCIsXG4gKiAvLyAgICAgbmFtZTogXCJmb29cIixcbiAqIC8vICAgICBpc0ZpbGU6IGZhbHNlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiB0cnVlLFxuICogLy8gICAgIGlzU3ltbGluazogZmFsc2VcbiAqIC8vICAgfSxcbiAqIC8vIF1cbiAqIGBgYFxuICpcbiAqIEBleGFtcGxlIEV4Y2x1ZGUgZmlsZXNcbiAqXG4gKiBTZXR0aW5nIHRoZSBgaW5jbHVkZUZpbGVzYCBvcHRpb24gdG8gYGZhbHNlYCB3aWxsIGV4Y2x1ZGUgZmlsZXMuXG4gKlxuICogRmlsZSBzdHJ1Y3R1cmU6XG4gKiBgYGBcbiAqIGZvbGRlclxuICog4pSc4pSA4pSAIHNjcmlwdC50c1xuICog4pSU4pSA4pSAIGZvb1xuICogYGBgXG4gKlxuICogYGBgdHMgaWdub3JlXG4gKiBpbXBvcnQgeyB3YWxrIH0gZnJvbSBcIkBzdGQvZnMvd2Fsa1wiO1xuICpcbiAqIGF3YWl0IEFycmF5LmZyb21Bc3luYyh3YWxrKFwiLlwiLCB7IGluY2x1ZGVGaWxlczogZmFsc2UgfSkpO1xuICogLy8gW1xuICogLy8gICB7XG4gKiAvLyAgICAgcGF0aDogXCIuXCIsXG4gKiAvLyAgICAgbmFtZTogXCIuXCIsXG4gKiAvLyAgICAgaXNGaWxlOiBmYWxzZSxcbiAqIC8vICAgICBpc0RpcmVjdG9yeTogdHJ1ZSxcbiAqIC8vICAgICBpc1N5bWxpbms6IGZhbHNlXG4gKiAvLyAgIH0sXG4gKiAvLyAgIHtcbiAqIC8vICAgICBwYXRoOiBcImZvb1wiLFxuICogLy8gICAgIG5hbWU6IFwiZm9vXCIsXG4gKiAvLyAgICAgaXNGaWxlOiBmYWxzZSxcbiAqIC8vICAgICBpc0RpcmVjdG9yeTogdHJ1ZSxcbiAqIC8vICAgICBpc1N5bWxpbms6IGZhbHNlLFxuICogLy8gICB9LFxuICogLy8gXVxuICogYGBgXG4gKlxuICogQGV4YW1wbGUgRXhjbHVkZSBkaXJlY3Rvcmllc1xuICpcbiAqIFNldHRpbmcgdGhlIGBpbmNsdWRlRGlyc2Agb3B0aW9uIHRvIGBmYWxzZWAgd2lsbCBleGNsdWRlIGRpcmVjdG9yaWVzLlxuICpcbiAqIEZpbGUgc3RydWN0dXJlOlxuICogYGBgXG4gKiBmb2xkZXJcbiAqIOKUnOKUgOKUgCBzY3JpcHQudHNcbiAqIOKUlOKUgOKUgCBmb29cbiAqIGBgYFxuICpcbiAqIGBgYHRzIGlnbm9yZVxuICogaW1wb3J0IHsgd2FsayB9IGZyb20gXCJAc3RkL2ZzL3dhbGtcIjtcbiAqXG4gKiBhd2FpdCBBcnJheS5mcm9tQXN5bmMod2FsayhcIi5cIiwgeyBpbmNsdWRlRGlyczogZmFsc2UgfSkpO1xuICogLy8gW1xuICogLy8gICB7XG4gKiAvLyAgICAgcGF0aDogXCJzY3JpcHQudHNcIixcbiAqIC8vICAgICBuYW1lOiBcInNjcmlwdC50c1wiLFxuICogLy8gICAgIGlzRmlsZTogdHJ1ZSxcbiAqIC8vICAgICBpc0RpcmVjdG9yeTogZmFsc2UsXG4gKiAvLyAgICAgaXNTeW1saW5rOiBmYWxzZVxuICogLy8gICB9LFxuICogLy8gXVxuICogYGBgXG4gKlxuICogQGV4YW1wbGUgRXhjbHVkZSBzeW1ib2xpYyBsaW5rc1xuICpcbiAqIFNldHRpbmcgdGhlIGBpbmNsdWRlU3ltbGlua3NgIG9wdGlvbiB0byBgZmFsc2VgIHdpbGwgZXhjbHVkZSBzeW1ib2xpYyBsaW5rcy5cbiAqXG4gKiBGaWxlIHN0cnVjdHVyZTpcbiAqIGBgYFxuICogZm9sZGVyXG4gKiDilJzilIDilIAgc2NyaXB0LnRzXG4gKiDilJzilIDilIAgZm9vXG4gKiDilJTilIDilIAgbGluayAtPiBzY3JpcHQudHMgKHN5bWJvbGljIGxpbmspXG4gKiBgYGBcbiAqXG4gKiBgYGB0cyBpZ25vcmVcbiAqIGltcG9ydCB7IHdhbGsgfSBmcm9tIFwiQHN0ZC9mcy93YWxrXCI7XG4gKlxuICogYXdhaXQgQXJyYXkuZnJvbUFzeW5jKHdhbGsoXCIuXCIsIHsgaW5jbHVkZVN5bWxpbmtzOiBmYWxzZSB9KSk7XG4gKiAvLyBbXG4gKiAvLyAgIHtcbiAqIC8vICAgICBwYXRoOiBcIi5cIixcbiAqIC8vICAgICBuYW1lOiBcIi5cIixcbiAqIC8vICAgICBpc0ZpbGU6IGZhbHNlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiB0cnVlLFxuICogLy8gICAgIGlzU3ltbGluazogZmFsc2VcbiAqIC8vICAgfSxcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwic2NyaXB0LnRzXCIsXG4gKiAvLyAgICAgbmFtZTogXCJzY3JpcHQudHNcIixcbiAqIC8vICAgICBpc0ZpbGU6IHRydWUsXG4gKiAvLyAgICAgaXNEaXJlY3Rvcnk6IGZhbHNlLFxuICogLy8gICAgIGlzU3ltbGluazogZmFsc2VcbiAqIC8vICAgfSxcbiAqIC8vIF1cbiAqIGBgYFxuICpcbiAqIEBleGFtcGxlIEZvbGxvdyBzeW1ib2xpYyBsaW5rc1xuICpcbiAqIFNldHRpbmcgdGhlIGBmb2xsb3dTeW1saW5rc2Agb3B0aW9uIHRvIGB0cnVlYCB3aWxsIGZvbGxvdyBzeW1ib2xpYyBsaW5rcyxcbiAqIGFmZmVjdGluZyB0aGUgYHBhdGhgIHByb3BlcnR5IG9mIHRoZSB3YWxrIGVudHJ5LlxuICpcbiAqIEZpbGUgc3RydWN0dXJlOlxuICogYGBgXG4gKiBmb2xkZXJcbiAqIOKUnOKUgOKUgCBzY3JpcHQudHNcbiAqIOKUlOKUgOKUgCBsaW5rIC0+IHNjcmlwdC50cyAoc3ltYm9saWMgbGluaylcbiAqIGBgYFxuICpcbiAqIGBgYHRzIGlnbm9yZVxuICogaW1wb3J0IHsgd2FsayB9IGZyb20gXCJAc3RkL2ZzL3dhbGtcIjtcbiAqXG4gKiBhd2FpdCBBcnJheS5mcm9tQXN5bmMod2FsayhcIi5cIiwgeyBmb2xsb3dTeW1saW5rczogdHJ1ZSB9KSk7XG4gKiAvLyBbXG4gKiAvLyAgIHtcbiAqIC8vICAgICBwYXRoOiBcIi5cIixcbiAqIC8vICAgICBuYW1lOiBcIi5cIixcbiAqIC8vICAgICBpc0ZpbGU6IGZhbHNlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiB0cnVlLFxuICogLy8gICAgIGlzU3ltbGluazogZmFsc2VcbiAqIC8vICAgfSxcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwic2NyaXB0LnRzXCIsXG4gKiAvLyAgICAgbmFtZTogXCJzY3JpcHQudHNcIixcbiAqIC8vICAgICBpc0ZpbGU6IHRydWUsXG4gKiAvLyAgICAgaXNEaXJlY3Rvcnk6IGZhbHNlLFxuICogLy8gICAgIGlzU3ltbGluazogZmFsc2VcbiAqIC8vICAgfSxcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwic2NyaXB0LnRzXCIsXG4gKiAvLyAgICAgbmFtZTogXCJsaW5rXCIsXG4gKiAvLyAgICAgaXNGaWxlOiB0cnVlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiBmYWxzZSxcbiAqIC8vICAgICBpc1N5bWxpbms6IHRydWVcbiAqIC8vICAgfSxcbiAqIC8vIF1cbiAqIGBgYFxuICpcbiAqIEBleGFtcGxlIENhbm9uaWNhbGl6ZSBzeW1ib2xpYyBsaW5rc1xuICpcbiAqIFNldHRpbmcgdGhlIGBjYW5vbmljYWxpemVgIG9wdGlvbiB0byBgZmFsc2VgIHdpbGwgY2Fub25pY2FsaXplIHRoZSBwYXRoIG9mXG4gKiB0aGUgZm9sbG93ZWQgc3ltYm9saWMgbGluay4gTWVhbmluZywgdGhlIGBwYXRoYCBwcm9wZXJ0eSBvZiB0aGUgd2FsayBlbnRyeVxuICogd2lsbCBiZSB0aGUgcGF0aCBvZiB0aGUgc3ltYm9saWMgbGluayBpdHNlbGYuXG4gKlxuICogRmlsZSBzdHJ1Y3R1cmU6XG4gKiBgYGBcbiAqIGZvbGRlclxuICog4pSc4pSA4pSAIHNjcmlwdC50c1xuICog4pSU4pSA4pSAIGxpbmsgLT4gc2NyaXB0LnRzIChzeW1ib2xpYyBsaW5rKVxuICogYGBgXG4gKlxuICogYGBgdHMgaWdub3JlXG4gKiBpbXBvcnQgeyB3YWxrIH0gZnJvbSBcIkBzdGQvZnMvd2Fsa1wiO1xuICpcbiAqIGF3YWl0IEFycmF5LmZyb21Bc3luYyh3YWxrKFwiLlwiLCB7IGZvbGxvd1N5bWxpbmtzOiB0cnVlLCBjYW5vbmljYWxpemU6IHRydWUgfSkpO1xuICogLy8gW1xuICogLy8gICB7XG4gKiAvLyAgICAgcGF0aDogXCIuXCIsXG4gKiAvLyAgICAgbmFtZTogXCIuXCIsXG4gKiAvLyAgICAgaXNGaWxlOiBmYWxzZSxcbiAqIC8vICAgICBpc0RpcmVjdG9yeTogdHJ1ZSxcbiAqIC8vICAgICBpc1N5bWxpbms6IGZhbHNlXG4gKiAvLyAgIH0sXG4gKiAvLyAgIHtcbiAqIC8vICAgICBwYXRoOiBcInNjcmlwdC50c1wiLFxuICogLy8gICAgIG5hbWU6IFwic2NyaXB0LnRzXCIsXG4gKiAvLyAgICAgaXNGaWxlOiB0cnVlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiBmYWxzZSxcbiAqIC8vICAgICBpc1N5bWxpbms6IGZhbHNlXG4gKiAvLyAgIH0sXG4gKiAvLyAgIHtcbiAqIC8vICAgICBwYXRoOiBcImxpbmtcIixcbiAqIC8vICAgICBuYW1lOiBcImxpbmtcIixcbiAqIC8vICAgICBpc0ZpbGU6IHRydWUsXG4gKiAvLyAgICAgaXNEaXJlY3Rvcnk6IGZhbHNlLFxuICogLy8gICAgIGlzU3ltbGluazogdHJ1ZVxuICogLy8gICB9LFxuICogLy8gXVxuICogYGBgXG4gKlxuICogQGV4YW1wbGUgRmlsdGVyIGJ5IGZpbGUgZXh0ZW5zaW9uc1xuICpcbiAqIFNldHRpbmcgdGhlIGBleHRzYCBvcHRpb24gdG8gYFtcIi50c1wiXWAgb3IgYFtcInRzXCJdYCB3aWxsIG9ubHkgaW5jbHVkZSBlbnRyaWVzXG4gKiB3aXRoIHRoZSBgLnRzYCBmaWxlIGV4dGVuc2lvbi5cbiAqXG4gKiBGaWxlIHN0cnVjdHVyZTpcbiAqIGBgYFxuICogZm9sZGVyXG4gKiDilJzilIDilIAgc2NyaXB0LnRzXG4gKiDilJTilIDilIAgZm9vLmpzXG4gKiBgYGBcbiAqXG4gKiBgYGB0cyBpZ25vcmVcbiAqIGltcG9ydCB7IHdhbGsgfSBmcm9tIFwiQHN0ZC9mcy93YWxrXCI7XG4gKlxuICogYXdhaXQgQXJyYXkuZnJvbUFzeW5jKHdhbGsoXCIuXCIsIHsgZXh0czogW1wiLnRzXCJdIH0pKTtcbiAqIC8vIFtcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwic2NyaXB0LnRzXCIsXG4gKiAvLyAgICAgbmFtZTogXCJzY3JpcHQudHNcIixcbiAqIC8vICAgICBpc0ZpbGU6IHRydWUsXG4gKiAvLyAgICAgaXNEaXJlY3Rvcnk6IGZhbHNlLFxuICogLy8gICAgIGlzU3ltbGluazogZmFsc2VcbiAqIC8vICAgfSxcbiAqIC8vIF1cbiAqIGBgYFxuICpcbiAqIEBleGFtcGxlIEZpbHRlciBieSByZWd1bGFyIGV4cHJlc3Npb25zXG4gKlxuICogU2V0dGluZyB0aGUgYG1hdGNoYCBvcHRpb24gdG8gYFsvcy9dYCB3aWxsIG9ubHkgaW5jbHVkZSBlbnRyaWVzIHdpdGggdGhlXG4gKiBsZXR0ZXIgYHNgIGluIHRoZWlyIG5hbWUuXG4gKlxuICogRmlsZSBzdHJ1Y3R1cmU6XG4gKiBgYGBcbiAqIGZvbGRlclxuICog4pSc4pSA4pSAIHNjcmlwdC50c1xuICog4pSU4pSA4pSAIFJFQURNRS5tZFxuICogYGBgXG4gKlxuICogYGBgdHMgaWdub3JlXG4gKiBpbXBvcnQgeyB3YWxrIH0gZnJvbSBcIkBzdGQvZnMvd2Fsa1wiO1xuICpcbiAqIGF3YWl0IEFycmF5LmZyb21Bc3luYyh3YWxrKFwiLlwiLCB7IG1hdGNoOiBbL3MvXSB9KSk7XG4gKiAvLyBbXG4gKiAvLyAgIHtcbiAqIC8vICAgICBwYXRoOiBcInNjcmlwdC50c1wiLFxuICogLy8gICAgIG5hbWU6IFwic2NyaXB0LnRzXCIsXG4gKiAvLyAgICAgaXNGaWxlOiB0cnVlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiBmYWxzZSxcbiAqIC8vICAgICBpc1N5bWxpbms6IGZhbHNlXG4gKiAvLyAgIH0sXG4gKiAvLyBdXG4gKiBgYGBcbiAqXG4gKiBAZXhhbXBsZSBFeGNsdWRlIGJ5IHJlZ3VsYXIgZXhwcmVzc2lvbnNcbiAqXG4gKiBTZXR0aW5nIHRoZSBgc2tpcGAgb3B0aW9uIHRvIGBbL3MvXWAgd2lsbCBleGNsdWRlIGVudHJpZXMgd2l0aCB0aGUgbGV0dGVyXG4gKiBgc2AgaW4gdGhlaXIgbmFtZS5cbiAqXG4gKiBGaWxlIHN0cnVjdHVyZTpcbiAqIGBgYFxuICogZm9sZGVyXG4gKiDilJzilIDilIAgc2NyaXB0LnRzXG4gKiDilJTilIDilIAgUkVBRE1FLm1kXG4gKiBgYGBcbiAqXG4gKiBgYGB0cyBpZ25vcmVcbiAqIGltcG9ydCB7IHdhbGsgfSBmcm9tIFwiQHN0ZC9mcy93YWxrXCI7XG4gKlxuICogYXdhaXQgQXJyYXkuZnJvbUFzeW5jKHdhbGsoXCIuXCIsIHsgc2tpcDogWy9zL10gfSkpO1xuICogLy8gW1xuICogLy8gICB7XG4gKiAvLyAgICAgcGF0aDogXCJSRUFETUUubWRcIixcbiAqIC8vICAgICBuYW1lOiBcIlJFQURNRS5tZFwiLFxuICogLy8gICAgIGlzRmlsZTogdHJ1ZSxcbiAqIC8vICAgICBpc0RpcmVjdG9yeTogZmFsc2UsXG4gKiAvLyAgICAgaXNTeW1saW5rOiBmYWxzZVxuICogLy8gICB9LFxuICogLy8gXVxuICogYGBgXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiogd2FsayhcbiAgcm9vdDogc3RyaW5nIHwgVVJMLFxuICBvcHRpb25zPzogV2Fsa09wdGlvbnMsXG4pOiBBc3luY0l0ZXJhYmxlSXRlcmF0b3I8V2Fsa0VudHJ5PiB7XG4gIGxldCB7XG4gICAgbWF4RGVwdGggPSBJbmZpbml0eSxcbiAgICBpbmNsdWRlRmlsZXMgPSB0cnVlLFxuICAgIGluY2x1ZGVEaXJzID0gdHJ1ZSxcbiAgICBpbmNsdWRlU3ltbGlua3MgPSB0cnVlLFxuICAgIGZvbGxvd1N5bWxpbmtzID0gZmFsc2UsXG4gICAgY2Fub25pY2FsaXplID0gdHJ1ZSxcbiAgICBleHRzID0gdW5kZWZpbmVkLFxuICAgIG1hdGNoID0gdW5kZWZpbmVkLFxuICAgIHNraXAgPSB1bmRlZmluZWQsXG4gIH0gPSBvcHRpb25zID8/IHt9O1xuXG4gIGlmIChtYXhEZXB0aCA8IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgcm9vdCA9IHRvUGF0aFN0cmluZyhyb290KTtcbiAgaWYgKGV4dHMpIHtcbiAgICBleHRzID0gZXh0cy5tYXAoKGV4dCkgPT4gZXh0LnN0YXJ0c1dpdGgoXCIuXCIpID8gZXh0IDogYC4ke2V4dH1gKTtcbiAgfVxuICBpZiAoaW5jbHVkZURpcnMgJiYgaW5jbHVkZShyb290LCBleHRzLCBtYXRjaCwgc2tpcCkpIHtcbiAgICB5aWVsZCBhd2FpdCBjcmVhdGVXYWxrRW50cnkocm9vdCk7XG4gIH1cbiAgaWYgKG1heERlcHRoIDwgMSB8fCAhaW5jbHVkZShyb290LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgc2tpcCkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9yIGF3YWl0IChjb25zdCBlbnRyeSBvZiBEZW5vLnJlYWREaXIocm9vdCkpIHtcbiAgICBsZXQgcGF0aCA9IGpvaW4ocm9vdCwgZW50cnkubmFtZSk7XG5cbiAgICBsZXQgeyBpc1N5bWxpbmssIGlzRGlyZWN0b3J5IH0gPSBlbnRyeTtcblxuICAgIGlmIChpc1N5bWxpbmspIHtcbiAgICAgIGlmICghZm9sbG93U3ltbGlua3MpIHtcbiAgICAgICAgaWYgKGluY2x1ZGVTeW1saW5rcyAmJiBpbmNsdWRlKHBhdGgsIGV4dHMsIG1hdGNoLCBza2lwKSkge1xuICAgICAgICAgIHlpZWxkIHsgcGF0aCwgLi4uZW50cnkgfTtcbiAgICAgICAgfVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlYWxQYXRoID0gYXdhaXQgRGVuby5yZWFsUGF0aChwYXRoKTtcbiAgICAgIGlmIChjYW5vbmljYWxpemUpIHtcbiAgICAgICAgcGF0aCA9IHJlYWxQYXRoO1xuICAgICAgfVxuICAgICAgLy8gQ2F2ZWF0IGVtcHRvcjogZG9uJ3QgYXNzdW1lIHxwYXRofCBpcyBub3QgYSBzeW1saW5rLiByZWFscGF0aCgpXG4gICAgICAvLyByZXNvbHZlcyBzeW1saW5rcyBidXQgYW5vdGhlciBwcm9jZXNzIGNhbiByZXBsYWNlIHRoZSBmaWxlIHN5c3RlbVxuICAgICAgLy8gZW50aXR5IHdpdGggYSBkaWZmZXJlbnQgdHlwZSBvZiBlbnRpdHkgYmVmb3JlIHdlIGNhbGwgbHN0YXQoKS5cbiAgICAgICh7IGlzU3ltbGluaywgaXNEaXJlY3RvcnkgfSA9IGF3YWl0IERlbm8ubHN0YXQocmVhbFBhdGgpKTtcbiAgICB9XG5cbiAgICBpZiAoaXNTeW1saW5rIHx8IGlzRGlyZWN0b3J5KSB7XG4gICAgICBjb25zdCBvcHRzOiBXYWxrT3B0aW9ucyA9IHtcbiAgICAgICAgbWF4RGVwdGg6IG1heERlcHRoIC0gMSxcbiAgICAgICAgaW5jbHVkZUZpbGVzLFxuICAgICAgICBpbmNsdWRlRGlycyxcbiAgICAgICAgaW5jbHVkZVN5bWxpbmtzLFxuICAgICAgICBmb2xsb3dTeW1saW5rcyxcbiAgICAgIH07XG4gICAgICBpZiAoZXh0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9wdHMuZXh0cyA9IGV4dHM7XG4gICAgICB9XG4gICAgICBpZiAobWF0Y2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvcHRzLm1hdGNoID0gbWF0Y2g7XG4gICAgICB9XG4gICAgICBpZiAoc2tpcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9wdHMuc2tpcCA9IHNraXA7XG4gICAgICB9XG4gICAgICB5aWVsZCogd2FsayhwYXRoLCBvcHRzKTtcbiAgICB9IGVsc2UgaWYgKGluY2x1ZGVGaWxlcyAmJiBpbmNsdWRlKHBhdGgsIGV4dHMsIG1hdGNoLCBza2lwKSkge1xuICAgICAgeWllbGQgeyBwYXRoLCAuLi5lbnRyeSB9O1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IHdhbGtzIHRocm91Z2ggYSBkaXJlY3RvcnkgYW5kIHlpZWxkcyBpbmZvcm1hdGlvbiBhYm91dCBlYWNoIGZpbGVcbiAqIGFuZCBkaXJlY3RvcnkgZW5jb3VudGVyZWQuXG4gKlxuICogVGhlIHJvb3QgcGF0aCBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGZpbGUgcGF0aHMgaXMgcmVsYXRpdmUgb3IgYWJzb2x1dGUuXG4gKiBUaGUgcm9vdCBkaXJlY3RvcnkgaXMgaW5jbHVkZWQgaW4gdGhlIHlpZWxkZWQgZW50cmllcy5cbiAqXG4gKiBSZXF1aXJlcyBgLS1hbGxvdy1yZWFkYCBwZXJtaXNzaW9uLlxuICpcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZG9jcy5kZW5vLmNvbS9ydW50aW1lL21hbnVhbC9iYXNpY3MvcGVybWlzc2lvbnMjZmlsZS1zeXN0ZW0tYWNjZXNzfVxuICogZm9yIG1vcmUgaW5mb3JtYXRpb24gb24gRGVubydzIHBlcm1pc3Npb25zIHN5c3RlbS5cbiAqXG4gKiBAcGFyYW0gcm9vdCBUaGUgcm9vdCBkaXJlY3RvcnkgdG8gc3RhcnQgdGhlIHdhbGsgZnJvbSwgYXMgYSBzdHJpbmcgb3IgVVJMLlxuICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIHRoZSB3YWxrLlxuICpcbiAqIEByZXR1cm5zIEEgc3luY2hyb25vdXMgaXRlcmFibGUgaXRlcmF0b3IgdGhhdCB5aWVsZHMgdGhlIHdhbGsgZW50cnkgb2JqZWN0cy5cbiAqXG4gKiBAZXhhbXBsZSBCYXNpYyB1c2FnZVxuICpcbiAqIEZpbGUgc3RydWN0dXJlOlxuICogYGBgXG4gKiBmb2xkZXJcbiAqIOKUnOKUgOKUgCBzY3JpcHQudHNcbiAqIOKUlOKUgOKUgCBmb28udHNcbiAqIGBgYFxuICpcbiAqIGBgYHRzIGlnbm9yZVxuICogaW1wb3J0IHsgd2Fsa1N5bmMgfSBmcm9tIFwiQHN0ZC9mcy93YWxrXCI7XG4gKlxuICogQXJyYXkuZnJvbSh3YWxrU3luYyhcIi5cIikpO1xuICogLy8gW1xuICogLy8gICB7XG4gKiAvLyAgICAgcGF0aDogXCIuXCIsXG4gKiAvLyAgICAgbmFtZTogXCIuXCIsXG4gKiAvLyAgICAgaXNGaWxlOiBmYWxzZSxcbiAqIC8vICAgICBpc0RpcmVjdG9yeTogdHJ1ZSxcbiAqIC8vICAgICBpc1N5bWxpbms6IGZhbHNlXG4gKiAvLyAgIH0sXG4gKiAvLyAgIHtcbiAqIC8vICAgICBwYXRoOiBcInNjcmlwdC50c1wiLFxuICogLy8gICAgIG5hbWU6IFwic2NyaXB0LnRzXCIsXG4gKiAvLyAgICAgaXNGaWxlOiB0cnVlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiBmYWxzZSxcbiAqIC8vICAgICBpc1N5bWxpbms6IGZhbHNlXG4gKiAvLyAgIH0sXG4gKiAvLyAgIHtcbiAqIC8vICAgICBwYXRoOiBcImZvby50c1wiLFxuICogLy8gICAgIG5hbWU6IFwiZm9vLnRzXCIsXG4gKiAvLyAgICAgaXNGaWxlOiB0cnVlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiBmYWxzZSxcbiAqIC8vICAgICBpc1N5bWxpbms6IGZhbHNlXG4gKiAvLyAgIH0sXG4gKiAvLyBdXG4gKiBgYGBcbiAqXG4gKiBAZXhhbXBsZSBNYXhpbXVtIGZpbGUgZGVwdGhcbiAqXG4gKiBTZXR0aW5nIHRoZSBgbWF4RGVwdGhgIG9wdGlvbiB0byBgMWAgd2lsbCBvbmx5IGluY2x1ZGUgdGhlIHJvb3QgZGlyZWN0b3J5IGFuZFxuICogaXRzIGltbWVkaWF0ZSBjaGlsZHJlbi5cbiAqXG4gKiBGaWxlIHN0cnVjdHVyZTpcbiAqIGBgYFxuICogZm9sZGVyXG4gKiDilJzilIDilIAgc2NyaXB0LnRzXG4gKiDilJTilIDilIAgZm9vXG4gKiAgICAg4pSU4pSA4pSAIGJhci50c1xuICogYGBgXG4gKlxuICogYGBgdHMgaWdub3JlXG4gKiBpbXBvcnQgeyB3YWxrU3luYyB9IGZyb20gXCJAc3RkL2ZzL3dhbGtcIjtcbiAqXG4gKiBBcnJheS5mcm9tKHdhbGtTeW5jKFwiLlwiLCB7IG1heERlcHRoOiAxIH0pKTtcbiAqIC8vIFtcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwiLlwiLFxuICogLy8gICAgIG5hbWU6IFwiLlwiLFxuICogLy8gICAgIGlzRmlsZTogZmFsc2UsXG4gKiAvLyAgICAgaXNEaXJlY3Rvcnk6IHRydWUsXG4gKiAvLyAgICAgaXNTeW1saW5rOiBmYWxzZVxuICogLy8gICB9LFxuICogLy8gICB7XG4gKiAvLyAgICAgcGF0aDogXCJzY3JpcHQudHNcIixcbiAqIC8vICAgICBuYW1lOiBcInNjcmlwdC50c1wiLFxuICogLy8gICAgIGlzRmlsZTogdHJ1ZSxcbiAqIC8vICAgICBpc0RpcmVjdG9yeTogZmFsc2UsXG4gKiAvLyAgICAgaXNTeW1saW5rOiBmYWxzZVxuICogLy8gICB9LFxuICogLy8gICB7XG4gKiAvLyAgICAgcGF0aDogXCJmb29cIixcbiAqIC8vICAgICBuYW1lOiBcImZvb1wiLFxuICogLy8gICAgIGlzRmlsZTogZmFsc2UsXG4gKiAvLyAgICAgaXNEaXJlY3Rvcnk6IHRydWUsXG4gKiAvLyAgICAgaXNTeW1saW5rOiBmYWxzZVxuICogLy8gICB9LFxuICogLy8gXVxuICogYGBgXG4gKlxuICogQGV4YW1wbGUgRXhjbHVkZSBmaWxlc1xuICpcbiAqIFNldHRpbmcgdGhlIGBpbmNsdWRlRmlsZXNgIG9wdGlvbiB0byBgZmFsc2VgIHdpbGwgZXhjbHVkZSBmaWxlcy5cbiAqXG4gKiBGaWxlIHN0cnVjdHVyZTpcbiAqIGBgYFxuICogZm9sZGVyXG4gKiDilJzilIDilIAgc2NyaXB0LnRzXG4gKiDilJTilIDilIAgZm9vXG4gKiBgYGBcbiAqXG4gKiBgYGB0cyBpZ25vcmVcbiAqIGltcG9ydCB7IHdhbGtTeW5jIH0gZnJvbSBcIkBzdGQvZnMvd2Fsa1wiO1xuICpcbiAqIEFycmF5LmZyb20od2Fsa1N5bmMoXCIuXCIsIHsgaW5jbHVkZUZpbGVzOiBmYWxzZSB9KSk7XG4gKiAvLyBbXG4gKiAvLyAgIHtcbiAqIC8vICAgICBwYXRoOiBcIi5cIixcbiAqIC8vICAgICBuYW1lOiBcIi5cIixcbiAqIC8vICAgICBpc0ZpbGU6IGZhbHNlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiB0cnVlLFxuICogLy8gICAgIGlzU3ltbGluazogZmFsc2VcbiAqIC8vICAgfSxcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwiZm9vXCIsXG4gKiAvLyAgICAgbmFtZTogXCJmb29cIixcbiAqIC8vICAgICBpc0ZpbGU6IGZhbHNlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiB0cnVlLFxuICogLy8gICAgIGlzU3ltbGluazogZmFsc2UsXG4gKiAvLyAgIH0sXG4gKiAvLyBdXG4gKiBgYGBcbiAqXG4gKiBAZXhhbXBsZSBFeGNsdWRlIGRpcmVjdG9yaWVzXG4gKlxuICogU2V0dGluZyB0aGUgYGluY2x1ZGVEaXJzYCBvcHRpb24gdG8gYGZhbHNlYCB3aWxsIGV4Y2x1ZGUgZGlyZWN0b3JpZXMuXG4gKlxuICogRmlsZSBzdHJ1Y3R1cmU6XG4gKiBgYGBcbiAqIGZvbGRlclxuICog4pSc4pSA4pSAIHNjcmlwdC50c1xuICog4pSU4pSA4pSAIGZvb1xuICogYGBgXG4gKlxuICogYGBgdHMgaWdub3JlXG4gKiBpbXBvcnQgeyB3YWxrU3luYyB9IGZyb20gXCJAc3RkL2ZzL3dhbGtcIjtcbiAqXG4gKiBBcnJheS5mcm9tKHdhbGtTeW5jKFwiLlwiLCB7IGluY2x1ZGVEaXJzOiBmYWxzZSB9KSk7XG4gKiAvLyBbXG4gKiAvLyAgIHtcbiAqIC8vICAgICBwYXRoOiBcInNjcmlwdC50c1wiLFxuICogLy8gICAgIG5hbWU6IFwic2NyaXB0LnRzXCIsXG4gKiAvLyAgICAgaXNGaWxlOiB0cnVlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiBmYWxzZSxcbiAqIC8vICAgICBpc1N5bWxpbms6IGZhbHNlXG4gKiAvLyAgIH0sXG4gKiAvLyBdXG4gKiBgYGBcbiAqXG4gKiBAZXhhbXBsZSBFeGNsdWRlIHN5bWJvbGljIGxpbmtzXG4gKlxuICogU2V0dGluZyB0aGUgYGluY2x1ZGVTeW1saW5rc2Agb3B0aW9uIHRvIGBmYWxzZWAgd2lsbCBleGNsdWRlIHN5bWJvbGljIGxpbmtzLlxuICpcbiAqIEZpbGUgc3RydWN0dXJlOlxuICogYGBgXG4gKiBmb2xkZXJcbiAqIOKUnOKUgOKUgCBzY3JpcHQudHNcbiAqIOKUnOKUgOKUgCBmb29cbiAqIOKUlOKUgOKUgCBsaW5rIC0+IHNjcmlwdC50cyAoc3ltYm9saWMgbGluaylcbiAqIGBgYFxuICpcbiAqIGBgYHRzIGlnbm9yZVxuICogaW1wb3J0IHsgd2Fsa1N5bmMgfSBmcm9tIFwiQHN0ZC9mcy93YWxrXCI7XG4gKlxuICogQXJyYXkuZnJvbSh3YWxrU3luYyhcIi5cIiwgeyBpbmNsdWRlU3ltbGlua3M6IGZhbHNlIH0pKTtcbiAqIC8vIFtcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwiLlwiLFxuICogLy8gICAgIG5hbWU6IFwiLlwiLFxuICogLy8gICAgIGlzRmlsZTogZmFsc2UsXG4gKiAvLyAgICAgaXNEaXJlY3Rvcnk6IHRydWUsXG4gKiAvLyAgICAgaXNTeW1saW5rOiBmYWxzZVxuICogLy8gICB9LFxuICogLy8gICB7XG4gKiAvLyAgICAgcGF0aDogXCJzY3JpcHQudHNcIixcbiAqIC8vICAgICBuYW1lOiBcInNjcmlwdC50c1wiLFxuICogLy8gICAgIGlzRmlsZTogdHJ1ZSxcbiAqIC8vICAgICBpc0RpcmVjdG9yeTogZmFsc2UsXG4gKiAvLyAgICAgaXNTeW1saW5rOiBmYWxzZVxuICogLy8gICB9LFxuICogLy8gXVxuICogYGBgXG4gKlxuICogQGV4YW1wbGUgRm9sbG93IHN5bWJvbGljIGxpbmtzXG4gKlxuICogU2V0dGluZyB0aGUgYGZvbGxvd1N5bWxpbmtzYCBvcHRpb24gdG8gYHRydWVgIHdpbGwgZm9sbG93IHN5bWJvbGljIGxpbmtzLFxuICogYWZmZWN0aW5nIHRoZSBgcGF0aGAgcHJvcGVydHkgb2YgdGhlIHdhbGsgZW50cnkuXG4gKlxuICogRmlsZSBzdHJ1Y3R1cmU6XG4gKiBgYGBcbiAqIGZvbGRlclxuICog4pSc4pSA4pSAIHNjcmlwdC50c1xuICog4pSU4pSA4pSAIGxpbmsgLT4gc2NyaXB0LnRzIChzeW1ib2xpYyBsaW5rKVxuICogYGBgXG4gKlxuICogYGBgdHMgaWdub3JlXG4gKiBpbXBvcnQgeyB3YWxrU3luYyB9IGZyb20gXCJAc3RkL2ZzL3dhbGtcIjtcbiAqXG4gKiBBcnJheS5mcm9tKHdhbGtTeW5jKFwiLlwiLCB7IGZvbGxvd1N5bWxpbmtzOiB0cnVlIH0pKTtcbiAqIC8vIFtcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwiLlwiLFxuICogLy8gICAgIG5hbWU6IFwiLlwiLFxuICogLy8gICAgIGlzRmlsZTogZmFsc2UsXG4gKiAvLyAgICAgaXNEaXJlY3Rvcnk6IHRydWUsXG4gKiAvLyAgICAgaXNTeW1saW5rOiBmYWxzZVxuICogLy8gICB9LFxuICogLy8gICB7XG4gKiAvLyAgICAgcGF0aDogXCJzY3JpcHQudHNcIixcbiAqIC8vICAgICBuYW1lOiBcInNjcmlwdC50c1wiLFxuICogLy8gICAgIGlzRmlsZTogdHJ1ZSxcbiAqIC8vICAgICBpc0RpcmVjdG9yeTogZmFsc2UsXG4gKiAvLyAgICAgaXNTeW1saW5rOiBmYWxzZVxuICogLy8gICB9LFxuICogLy8gICB7XG4gKiAvLyAgICAgcGF0aDogXCJzY3JpcHQudHNcIixcbiAqIC8vICAgICBuYW1lOiBcImxpbmtcIixcbiAqIC8vICAgICBpc0ZpbGU6IHRydWUsXG4gKiAvLyAgICAgaXNEaXJlY3Rvcnk6IGZhbHNlLFxuICogLy8gICAgIGlzU3ltbGluazogdHJ1ZVxuICogLy8gICB9LFxuICogLy8gXVxuICogYGBgXG4gKlxuICogQGV4YW1wbGUgQ2Fub25pY2FsaXplIHN5bWJvbGljIGxpbmtzXG4gKlxuICogU2V0dGluZyB0aGUgYGNhbm9uaWNhbGl6ZWAgb3B0aW9uIHRvIGBmYWxzZWAgd2lsbCBjYW5vbmljYWxpemUgdGhlIHBhdGggb2ZcbiAqIHRoZSBmb2xsb3dlZCBzeW1ib2xpYyBsaW5rLiBNZWFuaW5nLCB0aGUgYHBhdGhgIHByb3BlcnR5IG9mIHRoZSB3YWxrIGVudHJ5XG4gKiB3aWxsIGJlIHRoZSBwYXRoIG9mIHRoZSBzeW1ib2xpYyBsaW5rIGl0c2VsZi5cbiAqXG4gKiBGaWxlIHN0cnVjdHVyZTpcbiAqIGBgYFxuICogZm9sZGVyXG4gKiDilJzilIDilIAgc2NyaXB0LnRzXG4gKiDilJTilIDilIAgbGluayAtPiBzY3JpcHQudHMgKHN5bWJvbGljIGxpbmspXG4gKiBgYGBcbiAqXG4gKiBgYGB0cyBpZ25vcmVcbiAqIGltcG9ydCB7IHdhbGtTeW5jIH0gZnJvbSBcIkBzdGQvZnMvd2Fsa1wiO1xuICpcbiAqIEFycmF5LmZyb20od2Fsa1N5bmMoXCIuXCIsIHsgZm9sbG93U3ltbGlua3M6IHRydWUsIGNhbm9uaWNhbGl6ZTogdHJ1ZSB9KSk7XG4gKiAvLyBbXG4gKiAvLyAgIHtcbiAqIC8vICAgICBwYXRoOiBcIi5cIixcbiAqIC8vICAgICBuYW1lOiBcIi5cIixcbiAqIC8vICAgICBpc0ZpbGU6IGZhbHNlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiB0cnVlLFxuICogLy8gICAgIGlzU3ltbGluazogZmFsc2VcbiAqIC8vICAgfSxcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwic2NyaXB0LnRzXCIsXG4gKiAvLyAgICAgbmFtZTogXCJzY3JpcHQudHNcIixcbiAqIC8vICAgICBpc0ZpbGU6IHRydWUsXG4gKiAvLyAgICAgaXNEaXJlY3Rvcnk6IGZhbHNlLFxuICogLy8gICAgIGlzU3ltbGluazogZmFsc2VcbiAqIC8vICAgfSxcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwibGlua1wiLFxuICogLy8gICAgIG5hbWU6IFwibGlua1wiLFxuICogLy8gICAgIGlzRmlsZTogdHJ1ZSxcbiAqIC8vICAgICBpc0RpcmVjdG9yeTogZmFsc2UsXG4gKiAvLyAgICAgaXNTeW1saW5rOiB0cnVlXG4gKiAvLyAgIH0sXG4gKiAvLyBdXG4gKiBgYGBcbiAqXG4gKiBAZXhhbXBsZSBGaWx0ZXIgYnkgZmlsZSBleHRlbnNpb25zXG4gKlxuICogU2V0dGluZyB0aGUgYGV4dHNgIG9wdGlvbiB0byBgW1wiLnRzXCJdYCBvciBgW1widHNcIl1gIHdpbGwgb25seSBpbmNsdWRlIGVudHJpZXNcbiAqIHdpdGggdGhlIGAudHNgIGZpbGUgZXh0ZW5zaW9uLlxuICpcbiAqIEZpbGUgc3RydWN0dXJlOlxuICogYGBgXG4gKiBmb2xkZXJcbiAqIOKUnOKUgOKUgCBzY3JpcHQudHNcbiAqIOKUlOKUgOKUgCBmb28uanNcbiAqIGBgYFxuICpcbiAqIGBgYHRzIGlnbm9yZVxuICogaW1wb3J0IHsgd2Fsa1N5bmMgfSBmcm9tIFwiQHN0ZC9mcy93YWxrXCI7XG4gKlxuICogQXJyYXkuZnJvbSh3YWxrU3luYyhcIi5cIiwgeyBleHRzOiBbXCIudHNcIl0gfSkpO1xuICogLy8gW1xuICogLy8gICB7XG4gKiAvLyAgICAgcGF0aDogXCJzY3JpcHQudHNcIixcbiAqIC8vICAgICBuYW1lOiBcInNjcmlwdC50c1wiLFxuICogLy8gICAgIGlzRmlsZTogdHJ1ZSxcbiAqIC8vICAgICBpc0RpcmVjdG9yeTogZmFsc2UsXG4gKiAvLyAgICAgaXNTeW1saW5rOiBmYWxzZVxuICogLy8gICB9LFxuICogLy8gXVxuICogYGBgXG4gKlxuICogQGV4YW1wbGUgRmlsdGVyIGJ5IHJlZ3VsYXIgZXhwcmVzc2lvbnNcbiAqXG4gKiBTZXR0aW5nIHRoZSBgbWF0Y2hgIG9wdGlvbiB0byBgWy9zL11gIHdpbGwgb25seSBpbmNsdWRlIGVudHJpZXMgd2l0aCB0aGVcbiAqIGxldHRlciBgc2AgaW4gdGhlaXIgbmFtZS5cbiAqXG4gKiBGaWxlIHN0cnVjdHVyZTpcbiAqIGBgYFxuICogZm9sZGVyXG4gKiDilJzilIDilIAgc2NyaXB0LnRzXG4gKiDilJTilIDilIAgUkVBRE1FLm1kXG4gKiBgYGBcbiAqXG4gKiBgYGB0cyBpZ25vcmVcbiAqIGltcG9ydCB7IHdhbGtTeW5jIH0gZnJvbSBcIkBzdGQvZnMvd2Fsa1wiO1xuICpcbiAqIEFycmF5LmZyb20od2Fsa1N5bmMoXCIuXCIsIHsgbWF0Y2g6IFsvcy9dIH0pKTtcbiAqIC8vIFtcbiAqIC8vICAge1xuICogLy8gICAgIHBhdGg6IFwic2NyaXB0LnRzXCIsXG4gKiAvLyAgICAgbmFtZTogXCJzY3JpcHQudHNcIixcbiAqIC8vICAgICBpc0ZpbGU6IHRydWUsXG4gKiAvLyAgICAgaXNEaXJlY3Rvcnk6IGZhbHNlLFxuICogLy8gICAgIGlzU3ltbGluazogZmFsc2VcbiAqIC8vICAgfSxcbiAqIC8vIF1cbiAqIGBgYFxuICpcbiAqIEBleGFtcGxlIEV4Y2x1ZGUgYnkgcmVndWxhciBleHByZXNzaW9uc1xuICpcbiAqIFNldHRpbmcgdGhlIGBza2lwYCBvcHRpb24gdG8gYFsvcy9dYCB3aWxsIGV4Y2x1ZGUgZW50cmllcyB3aXRoIHRoZSBsZXR0ZXJcbiAqIGBzYCBpbiB0aGVpciBuYW1lLlxuICpcbiAqIEZpbGUgc3RydWN0dXJlOlxuICogYGBgXG4gKiBmb2xkZXJcbiAqIOKUnOKUgOKUgCBzY3JpcHQudHNcbiAqIOKUlOKUgOKUgCBSRUFETUUubWRcbiAqIGBgYFxuICpcbiAqIGBgYHRzIGlnbm9yZVxuICogaW1wb3J0IHsgd2Fsa1N5bmMgfSBmcm9tIFwiQHN0ZC9mcy93YWxrXCI7XG4gKlxuICogQXJyYXkuZnJvbSh3YWxrU3luYyhcIi5cIiwgeyBza2lwOiBbL3MvXSB9KSk7XG4gKiAvLyBbXG4gKiAvLyAgIHtcbiAqIC8vICAgICBwYXRoOiBcIlJFQURNRS5tZFwiLFxuICogLy8gICAgIG5hbWU6IFwiUkVBRE1FLm1kXCIsXG4gKiAvLyAgICAgaXNGaWxlOiB0cnVlLFxuICogLy8gICAgIGlzRGlyZWN0b3J5OiBmYWxzZSxcbiAqIC8vICAgICBpc1N5bWxpbms6IGZhbHNlXG4gKiAvLyAgIH0sXG4gKiAvLyBdXG4gKiBgYGBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uKiB3YWxrU3luYyhcbiAgcm9vdDogc3RyaW5nIHwgVVJMLFxuICBvcHRpb25zPzogV2Fsa09wdGlvbnMsXG4pOiBJdGVyYWJsZUl0ZXJhdG9yPFdhbGtFbnRyeT4ge1xuICBsZXQge1xuICAgIG1heERlcHRoID0gSW5maW5pdHksXG4gICAgaW5jbHVkZUZpbGVzID0gdHJ1ZSxcbiAgICBpbmNsdWRlRGlycyA9IHRydWUsXG4gICAgaW5jbHVkZVN5bWxpbmtzID0gdHJ1ZSxcbiAgICBmb2xsb3dTeW1saW5rcyA9IGZhbHNlLFxuICAgIGNhbm9uaWNhbGl6ZSA9IHRydWUsXG4gICAgZXh0cyA9IHVuZGVmaW5lZCxcbiAgICBtYXRjaCA9IHVuZGVmaW5lZCxcbiAgICBza2lwID0gdW5kZWZpbmVkLFxuICB9ID0gb3B0aW9ucyA/PyB7fTtcblxuICByb290ID0gdG9QYXRoU3RyaW5nKHJvb3QpO1xuICBpZiAoZXh0cykge1xuICAgIGV4dHMgPSBleHRzLm1hcCgoZXh0KSA9PiBleHQuc3RhcnRzV2l0aChcIi5cIikgPyBleHQgOiBgLiR7ZXh0fWApO1xuICB9XG4gIGlmIChtYXhEZXB0aCA8IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGluY2x1ZGVEaXJzICYmIGluY2x1ZGUocm9vdCwgZXh0cywgbWF0Y2gsIHNraXApKSB7XG4gICAgeWllbGQgY3JlYXRlV2Fsa0VudHJ5U3luYyhyb290KTtcbiAgfVxuICBpZiAobWF4RGVwdGggPCAxIHx8ICFpbmNsdWRlKHJvb3QsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBza2lwKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBlbnRyaWVzID0gRGVuby5yZWFkRGlyU3luYyhyb290KTtcbiAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgbGV0IHBhdGggPSBqb2luKHJvb3QsIGVudHJ5Lm5hbWUpO1xuXG4gICAgbGV0IHsgaXNTeW1saW5rLCBpc0RpcmVjdG9yeSB9ID0gZW50cnk7XG5cbiAgICBpZiAoaXNTeW1saW5rKSB7XG4gICAgICBpZiAoIWZvbGxvd1N5bWxpbmtzKSB7XG4gICAgICAgIGlmIChpbmNsdWRlU3ltbGlua3MgJiYgaW5jbHVkZShwYXRoLCBleHRzLCBtYXRjaCwgc2tpcCkpIHtcbiAgICAgICAgICB5aWVsZCB7IHBhdGgsIC4uLmVudHJ5IH07XG4gICAgICAgIH1cbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCByZWFsUGF0aCA9IERlbm8ucmVhbFBhdGhTeW5jKHBhdGgpO1xuICAgICAgaWYgKGNhbm9uaWNhbGl6ZSkge1xuICAgICAgICBwYXRoID0gcmVhbFBhdGg7XG4gICAgICB9XG4gICAgICAvLyBDYXZlYXQgZW1wdG9yOiBkb24ndCBhc3N1bWUgfHBhdGh8IGlzIG5vdCBhIHN5bWxpbmsuIHJlYWxwYXRoKClcbiAgICAgIC8vIHJlc29sdmVzIHN5bWxpbmtzIGJ1dCBhbm90aGVyIHByb2Nlc3MgY2FuIHJlcGxhY2UgdGhlIGZpbGUgc3lzdGVtXG4gICAgICAvLyBlbnRpdHkgd2l0aCBhIGRpZmZlcmVudCB0eXBlIG9mIGVudGl0eSBiZWZvcmUgd2UgY2FsbCBsc3RhdCgpLlxuICAgICAgKHsgaXNTeW1saW5rLCBpc0RpcmVjdG9yeSB9ID0gRGVuby5sc3RhdFN5bmMocmVhbFBhdGgpKTtcbiAgICB9XG5cbiAgICBpZiAoaXNTeW1saW5rIHx8IGlzRGlyZWN0b3J5KSB7XG4gICAgICBjb25zdCBvcHRzOiBXYWxrT3B0aW9ucyA9IHtcbiAgICAgICAgbWF4RGVwdGg6IG1heERlcHRoIC0gMSxcbiAgICAgICAgaW5jbHVkZUZpbGVzLFxuICAgICAgICBpbmNsdWRlRGlycyxcbiAgICAgICAgaW5jbHVkZVN5bWxpbmtzLFxuICAgICAgICBmb2xsb3dTeW1saW5rcyxcbiAgICAgIH07XG4gICAgICBpZiAoZXh0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9wdHMuZXh0cyA9IGV4dHM7XG4gICAgICB9XG4gICAgICBpZiAobWF0Y2ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvcHRzLm1hdGNoID0gbWF0Y2g7XG4gICAgICB9XG4gICAgICBpZiAoc2tpcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9wdHMuc2tpcCA9IHNraXA7XG4gICAgICB9XG4gICAgICB5aWVsZCogd2Fsa1N5bmMocGF0aCwgb3B0cyk7XG4gICAgfSBlbHNlIGlmIChpbmNsdWRlRmlsZXMgJiYgaW5jbHVkZShwYXRoLCBleHRzLCBtYXRjaCwgc2tpcCkpIHtcbiAgICAgIHlpZWxkIHsgcGF0aCwgLi4uZW50cnkgfTtcbiAgICB9XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxREFBcUQ7QUFDckQsNERBQTREO0FBQzVELDZDQUE2QztBQUM3QyxtRUFBbUU7QUFDbkUsU0FBUyxJQUFJLFFBQVEsNEJBQTRCO0FBQ2pELFNBQVMsWUFBWSxRQUFRLHVCQUF1QjtBQUNwRCxTQUNFLGVBQWUsRUFDZixtQkFBbUIsUUFFZCwwQkFBMEI7QUFFakMsU0FBUyxRQUNQLElBQVksRUFDWixJQUFlLEVBQ2YsS0FBZ0IsRUFDaEIsSUFBZTtFQUVmLElBQUksUUFBUSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsTUFBaUIsS0FBSyxRQUFRLENBQUMsT0FBTztJQUM1RCxPQUFPO0VBQ1Q7RUFDQSxJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLFVBQXFCLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxXQUFXO0lBQ3JFLE9BQU87RUFDVDtFQUNBLElBQUksUUFBUSxLQUFLLElBQUksQ0FBQyxDQUFDLFVBQXFCLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxXQUFXO0lBQ2xFLE9BQU87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
// denoCacheMetadata=1655529438174076616,15606084722597378553