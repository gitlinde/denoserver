// Copyright 2018-2026 the Deno authors. MIT license.
// This module is browser compatible.
/**
 * Command line arguments parser based on
 * {@link https://github.com/minimistjs/minimist | minimist}.
 *
 * See {@linkcode parseArgs} for more information.
 *
 * @example Usage
 * ```ts
 * import { parseArgs } from "@std/cli/parse-args";
 * import { assertEquals } from "@std/assert/equals";
 *
 * // For proper use, one should use `parseArgs(Deno.args)`
 * assertEquals(parseArgs(["--foo", "--bar=baz", "./quux.txt"]), {
 *   foo: true,
 *   bar: "baz",
 *   _: ["./quux.txt"],
 * });
 * ```
 *
 * @example `string` and `boolean` options
 *
 * Use `string` and `boolean` options to specify the type of the argument.
 *
 * ```ts
 * import { parseArgs } from "@std/cli/parse-args";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const args = parseArgs(["--foo", "--bar", "baz"], {
 *   boolean: ["foo"],
 *   string: ["bar"],
 * });
 *
 * assertEquals(args, { foo: true, bar: "baz", _: [] });
 * ```
 *
 * @example `collect` option
 *
 * `collect` option tells the parser to treat the option as an array. All
 * values will be collected into one array. If a non-collectable option is used
 * multiple times, the last value is used.
 *
 * ```ts
 * import { parseArgs } from "@std/cli/parse-args";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const args = parseArgs(["--foo", "bar", "--foo", "baz"], {
 *  collect: ["foo"],
 * });
 *
 * assertEquals(args, { foo: ["bar", "baz"], _: [] });
 * ```
 *
 * @example `negatable` option
 *
 * `negatable` option tells the parser to treat the option can be negated by
 * prefixing them with `--no-`, like `--no-config`.
 *
 * ```ts
 * import { parseArgs } from "@std/cli/parse-args";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const args = parseArgs(["--no-foo"], {
 *   boolean: ["foo"],
 *   negatable: ["foo"],
 * });
 *
 * assertEquals(args, { foo: false, _: [] });
 * ```
 *
 * @module
 */ /** Combines recursively all intersection types and returns a new single type.
 * @internal
 */ const FLAG_REGEXP = /^(?:-(?:(?<doubleDash>-)(?<negated>no-)?)?)(?<key>.+?)(?:=(?<value>.*))?$/s;
const LETTER_REGEXP = /[A-Za-z]/;
const NUMBER_REGEXP = /-?\d+(\.\d*)?(e-?\d+)?$/;
const HYPHEN_REGEXP = /^(-|--)[^-]/;
const VALUE_REGEXP = /=(?<value>.+)/;
const FLAG_NAME_REGEXP = /^--[^=]+$/;
const SPECIAL_CHAR_REGEXP = /\W/;
const NON_WHITESPACE_REGEXP = /\S/;
function isNumber(string) {
  return NON_WHITESPACE_REGEXP.test(string) && Number.isFinite(Number(string));
}
function isConstructorOrProto(obj, key) {
  return key === "constructor" && typeof obj[key] === "function" || key === "__proto__";
}
function setNested(object, keys, value, collect = false) {
  keys = [
    ...keys
  ];
  const key = keys.pop();
  for (const k of keys){
    if (isConstructorOrProto(object, k)) return;
    object = object[k] ??= {};
  }
  if (isConstructorOrProto(object, key)) return;
  if (collect) {
    const v = object[key];
    if (Array.isArray(v)) {
      v.push(value);
      return;
    }
    value = v ? [
      v,
      value
    ] : [
      value
    ];
  }
  object[key] = value;
}
function hasNested(object, keys) {
  for (const key of keys){
    const value = object[key];
    if (!Object.hasOwn(object, key)) return false;
    object = value;
  }
  return true;
}
function aliasIsBoolean(aliasMap, booleanSet, key) {
  const set = aliasMap.get(key);
  if (set === undefined) return false;
  for (const alias of set)if (booleanSet.has(alias)) return true;
  return false;
}
function isBooleanString(value) {
  return value === "true" || value === "false";
}
function parseBooleanString(value) {
  return value !== "false";
}
/**
 * Take a set of command line arguments, optionally with a set of options, and
 * return an object representing the flags found in the passed arguments.
 *
 * By default, any arguments starting with `-` or `--` are considered boolean
 * flags. If the argument name is followed by an equal sign (`=`) it is
 * considered a key-value pair. Any arguments which could not be parsed are
 * available in the `_` property of the returned object.
 *
 * By default, this module tries to determine the type of all arguments
 * automatically and the return type of this function will have an index
 * signature with `any` as value (`{ [x: string]: any }`).
 *
 * If the `string`, `boolean` or `collect` option is set, the return value of
 * this function will be fully typed and the index signature of the return
 * type will change to `{ [x: string]: unknown }`.
 *
 * Any arguments after `'--'` will not be parsed and will end up in `parsedArgs._`.
 *
 * Numeric-looking arguments will be returned as numbers unless `options.string`
 * or `options.boolean` is set for that argument name.
 *
 * See {@linkcode ParseOptions} for more information.
 *
 * @param args An array of command line arguments.
 * @param options Options for the parse function.
 *
 * @typeParam TArgs Type of result.
 * @typeParam TDoubleDash Used by `TArgs` for the result.
 * @typeParam TBooleans Used by `TArgs` for the result.
 * @typeParam TStrings Used by `TArgs` for the result.
 * @typeParam TCollectable Used by `TArgs` for the result.
 * @typeParam TNegatable Used by `TArgs` for the result.
 * @typeParam TDefaults Used by `TArgs` for the result.
 * @typeParam TAliases Used by `TArgs` for the result.
 * @typeParam TAliasArgNames Used by `TArgs` for the result.
 * @typeParam TAliasNames Used by `TArgs` for the result.
 *
 * @return The parsed arguments.
 *
 * @example Usage
 * ```ts
 * import { parseArgs } from "@std/cli/parse-args";
 * import { assertEquals } from "@std/assert/equals";
 *
 * // For proper use, one should use `parseArgs(Deno.args)`
 * assertEquals(parseArgs(["--foo", "--bar=baz", "./quux.txt"]), {
 *   foo: true,
 *   bar: "baz",
 *   _: ["./quux.txt"],
 * });
 * ```
 *
 * @example `string` and `boolean` options
 *
 * Use `string` and `boolean` options to specify the type of the argument.
 *
 * ```ts
 * import { parseArgs } from "@std/cli/parse-args";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const args = parseArgs(["--foo", "--bar", "baz"], {
 *   boolean: ["foo"],
 *   string: ["bar"],
 * });
 *
 * assertEquals(args, { foo: true, bar: "baz", _: [] });
 * ```
 *
 * @example `collect` option
 *
 * `collect` option tells the parser to treat the option as an array. All
 * values will be collected into one array. If a non-collectable option is used
 * multiple times, the last value is used.
 *
 * ```ts
 * import { parseArgs } from "@std/cli/parse-args";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const args = parseArgs(["--foo", "bar", "--foo", "baz"], {
 *  collect: ["foo"],
 * });
 *
 * assertEquals(args, { foo: ["bar", "baz"], _: [] });
 * ```
 *
 * @example `negatable` option
 *
 * `negatable` option tells the parser to treat the option can be negated by
 * prefixing them with `--no-`, like `--no-config`.
 *
 * ```ts
 * import { parseArgs } from "@std/cli/parse-args";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const args = parseArgs(["--no-foo"], {
 *   boolean: ["foo"],
 *   negatable: ["foo"],
 * });
 *
 * assertEquals(args, { foo: false, _: [] });
 * ```
 */ export function parseArgs(args, options) {
  const { "--": doubleDash = false, alias = {}, boolean = false, default: defaults = {}, stopEarly = false, string = [], collect = [], negatable = [], unknown: unknownFn = (i)=>i } = options ?? {};
  const aliasMap = new Map();
  const booleanSet = new Set();
  const stringSet = new Set();
  const collectSet = new Set();
  const negatableSet = new Set();
  let allBools = false;
  if (alias) {
    for (const [key, value] of Object.entries(alias)){
      if (value === undefined) {
        throw new TypeError("Alias value must be defined");
      }
      const aliases = Array.isArray(value) ? value : [
        value
      ];
      aliasMap.set(key, new Set(aliases));
      aliases.forEach((alias)=>aliasMap.set(alias, new Set([
          key,
          ...aliases.filter((it)=>it !== alias)
        ])));
    }
  }
  if (boolean) {
    if (typeof boolean === "boolean") {
      allBools = boolean;
    } else {
      const booleanArgs = Array.isArray(boolean) ? boolean : [
        boolean
      ];
      for (const key of booleanArgs.filter(Boolean)){
        booleanSet.add(key);
        aliasMap.get(key)?.forEach((al)=>{
          booleanSet.add(al);
        });
      }
    }
  }
  if (string) {
    const stringArgs = Array.isArray(string) ? string : [
      string
    ];
    for (const key of stringArgs.filter(Boolean)){
      stringSet.add(key);
      aliasMap.get(key)?.forEach((al)=>stringSet.add(al));
    }
  }
  if (collect) {
    const collectArgs = Array.isArray(collect) ? collect : [
      collect
    ];
    for (const key of collectArgs.filter(Boolean)){
      collectSet.add(key);
      aliasMap.get(key)?.forEach((al)=>collectSet.add(al));
    }
  }
  if (negatable) {
    const negatableArgs = Array.isArray(negatable) ? negatable : [
      negatable
    ];
    for (const key of negatableArgs.filter(Boolean)){
      negatableSet.add(key);
      aliasMap.get(key)?.forEach((alias)=>negatableSet.add(alias));
    }
  }
  const argv = {
    _: []
  };
  function setArgument(key, value, arg, collect) {
    if (!booleanSet.has(key) && !stringSet.has(key) && !aliasMap.has(key) && !collectSet.has(key) && !(allBools && FLAG_NAME_REGEXP.test(arg)) && unknownFn?.(arg, key, value) === false) {
      return;
    }
    if (typeof value === "string" && !stringSet.has(key)) {
      value = isNumber(value) ? Number(value) : value;
    }
    const collectable = collect && collectSet.has(key);
    setNested(argv, key.split("."), value, collectable);
    aliasMap.get(key)?.forEach((key)=>{
      setNested(argv, key.split("."), value, collectable);
    });
  }
  let notFlags = [];
  // all args after "--" are not parsed
  const index = args.indexOf("--");
  if (index !== -1) {
    notFlags = args.slice(index + 1);
    args = args.slice(0, index);
  }
  argsLoop: for(let i = 0; i < args.length; i++){
    const arg = args[i];
    const groups = arg.match(FLAG_REGEXP)?.groups;
    if (groups) {
      const { doubleDash, negated } = groups;
      let key = groups.key;
      let value = groups.value;
      if (doubleDash) {
        if (value != null) {
          if (booleanSet.has(key)) value = parseBooleanString(value);
          setArgument(key, value, arg, true);
          continue;
        }
        if (negated) {
          if (negatableSet.has(key)) {
            setArgument(key, false, arg, false);
            continue;
          }
          key = `no-${key}`;
        }
        const next = args[i + 1];
        if (next) {
          if (!booleanSet.has(key) && !allBools && !next.startsWith("-") && (!aliasMap.has(key) || !aliasIsBoolean(aliasMap, booleanSet, key))) {
            value = next;
            i++;
            setArgument(key, value, arg, true);
            continue;
          }
          if (isBooleanString(next)) {
            value = parseBooleanString(next);
            i++;
            setArgument(key, value, arg, true);
            continue;
          }
        }
        value = stringSet.has(key) ? "" : true;
        setArgument(key, value, arg, true);
        continue;
      }
      const letters = arg.slice(1, -1).split("");
      for (const [j, letter] of letters.entries()){
        const next = arg.slice(j + 2);
        if (next === "-") {
          setArgument(letter, next, arg, true);
          continue;
        }
        if (next === "=") {
          setArgument(letter, "", arg, true);
          continue argsLoop;
        }
        if (LETTER_REGEXP.test(letter)) {
          const groups = VALUE_REGEXP.exec(next)?.groups;
          if (groups) {
            setArgument(letter, groups.value, arg, true);
            continue argsLoop;
          }
          if (NUMBER_REGEXP.test(next)) {
            setArgument(letter, next, arg, true);
            continue argsLoop;
          }
        }
        if (letters[j + 1]?.match(SPECIAL_CHAR_REGEXP)) {
          setArgument(letter, arg.slice(j + 2), arg, true);
          continue argsLoop;
        }
        setArgument(letter, stringSet.has(letter) ? "" : true, arg, true);
      }
      key = arg.slice(-1);
      if (key === "-") continue;
      const nextArg = args[i + 1];
      if (nextArg) {
        if (!HYPHEN_REGEXP.test(nextArg) && !booleanSet.has(key) && (!aliasMap.has(key) || !aliasIsBoolean(aliasMap, booleanSet, key))) {
          setArgument(key, nextArg, arg, true);
          i++;
          continue;
        }
        if (isBooleanString(nextArg)) {
          const value = parseBooleanString(nextArg);
          setArgument(key, value, arg, true);
          i++;
          continue;
        }
      }
      setArgument(key, stringSet.has(key) ? "" : true, arg, true);
      continue;
    }
    if (unknownFn?.(arg) !== false) {
      argv._.push(stringSet.has("_") || !isNumber(arg) ? arg : Number(arg));
    }
    if (stopEarly) {
      argv._.push(...args.slice(i + 1));
      break;
    }
  }
  for (const [key, value] of Object.entries(defaults)){
    const keys = key.split(".");
    if (!hasNested(argv, keys)) {
      setNested(argv, keys, value);
      aliasMap.get(key)?.forEach((key)=>setNested(argv, key.split("."), value));
    }
  }
  for (const key of booleanSet.keys()){
    const keys = key.split(".");
    if (!hasNested(argv, keys)) {
      const value = collectSet.has(key) ? [] : false;
      setNested(argv, keys, value);
    }
  }
  for (const key of stringSet.keys()){
    const keys = key.split(".");
    if (!hasNested(argv, keys) && collectSet.has(key)) {
      setNested(argv, keys, []);
    }
  }
  if (doubleDash) {
    argv["--"] = notFlags;
  } else {
    argv._.push(...notFlags);
  }
  return argv;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vanNyLmlvL0BzdGQvY2xpLzEuMC4zMi9wYXJzZV9hcmdzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjYgdGhlIERlbm8gYXV0aG9ycy4gTUlUIGxpY2Vuc2UuXG4vLyBUaGlzIG1vZHVsZSBpcyBicm93c2VyIGNvbXBhdGlibGUuXG5cbi8qKlxuICogQ29tbWFuZCBsaW5lIGFyZ3VtZW50cyBwYXJzZXIgYmFzZWQgb25cbiAqIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vbWluaW1pc3Rqcy9taW5pbWlzdCB8IG1pbmltaXN0fS5cbiAqXG4gKiBTZWUge0BsaW5rY29kZSBwYXJzZUFyZ3N9IGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICpcbiAqIEBleGFtcGxlIFVzYWdlXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgcGFyc2VBcmdzIH0gZnJvbSBcIkBzdGQvY2xpL3BhcnNlLWFyZ3NcIjtcbiAqIGltcG9ydCB7IGFzc2VydEVxdWFscyB9IGZyb20gXCJAc3RkL2Fzc2VydC9lcXVhbHNcIjtcbiAqXG4gKiAvLyBGb3IgcHJvcGVyIHVzZSwgb25lIHNob3VsZCB1c2UgYHBhcnNlQXJncyhEZW5vLmFyZ3MpYFxuICogYXNzZXJ0RXF1YWxzKHBhcnNlQXJncyhbXCItLWZvb1wiLCBcIi0tYmFyPWJhelwiLCBcIi4vcXV1eC50eHRcIl0pLCB7XG4gKiAgIGZvbzogdHJ1ZSxcbiAqICAgYmFyOiBcImJhelwiLFxuICogICBfOiBbXCIuL3F1dXgudHh0XCJdLFxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBAZXhhbXBsZSBgc3RyaW5nYCBhbmQgYGJvb2xlYW5gIG9wdGlvbnNcbiAqXG4gKiBVc2UgYHN0cmluZ2AgYW5kIGBib29sZWFuYCBvcHRpb25zIHRvIHNwZWNpZnkgdGhlIHR5cGUgb2YgdGhlIGFyZ3VtZW50LlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBwYXJzZUFyZ3MgfSBmcm9tIFwiQHN0ZC9jbGkvcGFyc2UtYXJnc1wiO1xuICogaW1wb3J0IHsgYXNzZXJ0RXF1YWxzIH0gZnJvbSBcIkBzdGQvYXNzZXJ0L2VxdWFsc1wiO1xuICpcbiAqIGNvbnN0IGFyZ3MgPSBwYXJzZUFyZ3MoW1wiLS1mb29cIiwgXCItLWJhclwiLCBcImJhelwiXSwge1xuICogICBib29sZWFuOiBbXCJmb29cIl0sXG4gKiAgIHN0cmluZzogW1wiYmFyXCJdLFxuICogfSk7XG4gKlxuICogYXNzZXJ0RXF1YWxzKGFyZ3MsIHsgZm9vOiB0cnVlLCBiYXI6IFwiYmF6XCIsIF86IFtdIH0pO1xuICogYGBgXG4gKlxuICogQGV4YW1wbGUgYGNvbGxlY3RgIG9wdGlvblxuICpcbiAqIGBjb2xsZWN0YCBvcHRpb24gdGVsbHMgdGhlIHBhcnNlciB0byB0cmVhdCB0aGUgb3B0aW9uIGFzIGFuIGFycmF5LiBBbGxcbiAqIHZhbHVlcyB3aWxsIGJlIGNvbGxlY3RlZCBpbnRvIG9uZSBhcnJheS4gSWYgYSBub24tY29sbGVjdGFibGUgb3B0aW9uIGlzIHVzZWRcbiAqIG11bHRpcGxlIHRpbWVzLCB0aGUgbGFzdCB2YWx1ZSBpcyB1c2VkLlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBwYXJzZUFyZ3MgfSBmcm9tIFwiQHN0ZC9jbGkvcGFyc2UtYXJnc1wiO1xuICogaW1wb3J0IHsgYXNzZXJ0RXF1YWxzIH0gZnJvbSBcIkBzdGQvYXNzZXJ0L2VxdWFsc1wiO1xuICpcbiAqIGNvbnN0IGFyZ3MgPSBwYXJzZUFyZ3MoW1wiLS1mb29cIiwgXCJiYXJcIiwgXCItLWZvb1wiLCBcImJhelwiXSwge1xuICogIGNvbGxlY3Q6IFtcImZvb1wiXSxcbiAqIH0pO1xuICpcbiAqIGFzc2VydEVxdWFscyhhcmdzLCB7IGZvbzogW1wiYmFyXCIsIFwiYmF6XCJdLCBfOiBbXSB9KTtcbiAqIGBgYFxuICpcbiAqIEBleGFtcGxlIGBuZWdhdGFibGVgIG9wdGlvblxuICpcbiAqIGBuZWdhdGFibGVgIG9wdGlvbiB0ZWxscyB0aGUgcGFyc2VyIHRvIHRyZWF0IHRoZSBvcHRpb24gY2FuIGJlIG5lZ2F0ZWQgYnlcbiAqIHByZWZpeGluZyB0aGVtIHdpdGggYC0tbm8tYCwgbGlrZSBgLS1uby1jb25maWdgLlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBwYXJzZUFyZ3MgfSBmcm9tIFwiQHN0ZC9jbGkvcGFyc2UtYXJnc1wiO1xuICogaW1wb3J0IHsgYXNzZXJ0RXF1YWxzIH0gZnJvbSBcIkBzdGQvYXNzZXJ0L2VxdWFsc1wiO1xuICpcbiAqIGNvbnN0IGFyZ3MgPSBwYXJzZUFyZ3MoW1wiLS1uby1mb29cIl0sIHtcbiAqICAgYm9vbGVhbjogW1wiZm9vXCJdLFxuICogICBuZWdhdGFibGU6IFtcImZvb1wiXSxcbiAqIH0pO1xuICpcbiAqIGFzc2VydEVxdWFscyhhcmdzLCB7IGZvbzogZmFsc2UsIF86IFtdIH0pO1xuICogYGBgXG4gKlxuICogQG1vZHVsZVxuICovXG5cbi8qKiBDb21iaW5lcyByZWN1cnNpdmVseSBhbGwgaW50ZXJzZWN0aW9uIHR5cGVzIGFuZCByZXR1cm5zIGEgbmV3IHNpbmdsZSB0eXBlLlxuICogQGludGVybmFsXG4gKi9cbnR5cGUgSWQ8VFJlY29yZD4gPSBUUmVjb3JkIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgPyBUUmVjb3JkIGV4dGVuZHMgaW5mZXIgSW5mZXJyZWRSZWNvcmRcbiAgICA/IHsgW0tleSBpbiBrZXlvZiBJbmZlcnJlZFJlY29yZF06IElkPEluZmVycmVkUmVjb3JkW0tleV0+IH1cbiAgOiBuZXZlclxuICA6IFRSZWNvcmQ7XG5cbi8qKiBDb252ZXJ0cyBhIHVuaW9uIHR5cGUgYEEgfCBCIHwgQ2AgaW50byBhbiBpbnRlcnNlY3Rpb24gdHlwZSBgQSAmIEIgJiBDYC5cbiAqIEBpbnRlcm5hbFxuICovXG50eXBlIFVuaW9uVG9JbnRlcnNlY3Rpb248VFZhbHVlPiA9XG4gIChUVmFsdWUgZXh0ZW5kcyB1bmtub3duID8gKGFyZ3M6IFRWYWx1ZSkgPT4gdW5rbm93biA6IG5ldmVyKSBleHRlbmRzXG4gICAgKGFyZ3M6IGluZmVyIFIpID0+IHVua25vd24gPyBSIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPyBSIDogbmV2ZXJcbiAgICA6IG5ldmVyO1xuXG4vKiogQGludGVybmFsICovXG50eXBlIEJvb2xlYW5UeXBlID0gYm9vbGVhbiB8IHN0cmluZyB8IHVuZGVmaW5lZDtcbi8qKiBAaW50ZXJuYWwgKi9cbnR5cGUgU3RyaW5nVHlwZSA9IHN0cmluZyB8IHVuZGVmaW5lZDtcbi8qKiBAaW50ZXJuYWwgKi9cbnR5cGUgQXJnVHlwZSA9IFN0cmluZ1R5cGUgfCBCb29sZWFuVHlwZTtcblxuLyoqIEBpbnRlcm5hbCAqL1xudHlwZSBDb2xsZWN0YWJsZSA9IHN0cmluZyB8IHVuZGVmaW5lZDtcbi8qKiBAaW50ZXJuYWwgKi9cbnR5cGUgTmVnYXRhYmxlID0gc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG50eXBlIFVzZVR5cGVzPFxuICBUQm9vbGVhbnMgZXh0ZW5kcyBCb29sZWFuVHlwZSxcbiAgVFN0cmluZ3MgZXh0ZW5kcyBTdHJpbmdUeXBlLFxuICBUQ29sbGVjdGFibGUgZXh0ZW5kcyBDb2xsZWN0YWJsZSxcbj4gPSB1bmRlZmluZWQgZXh0ZW5kcyAoXG4gICYgKGZhbHNlIGV4dGVuZHMgVEJvb2xlYW5zID8gdW5kZWZpbmVkIDogVEJvb2xlYW5zKVxuICAmIFRDb2xsZWN0YWJsZVxuICAmIFRTdHJpbmdzXG4pID8gZmFsc2VcbiAgOiB0cnVlO1xuXG4vKipcbiAqIENyZWF0ZXMgYSByZWNvcmQgd2l0aCBhbGwgYXZhaWxhYmxlIGZsYWdzIHdpdGggdGhlIGNvcnJlc3BvbmRpbmcgdHlwZSBhbmRcbiAqIGRlZmF1bHQgdHlwZS5cbiAqIEBpbnRlcm5hbFxuICovXG50eXBlIFZhbHVlczxcbiAgVEJvb2xlYW5zIGV4dGVuZHMgQm9vbGVhblR5cGUsXG4gIFRTdHJpbmdzIGV4dGVuZHMgU3RyaW5nVHlwZSxcbiAgVENvbGxlY3RhYmxlIGV4dGVuZHMgQ29sbGVjdGFibGUsXG4gIFROZWdhdGFibGUgZXh0ZW5kcyBOZWdhdGFibGUsXG4gIFREZWZhdWx0IGV4dGVuZHMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCB1bmRlZmluZWQsXG4gIFRBbGlhc2VzIGV4dGVuZHMgQWxpYXNlcyB8IHVuZGVmaW5lZCxcbj4gPSBVc2VUeXBlczxUQm9vbGVhbnMsIFRTdHJpbmdzLCBUQ29sbGVjdGFibGU+IGV4dGVuZHMgdHJ1ZSA/XG4gICAgJiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICAgICYgQWRkQWxpYXNlczxcbiAgICAgIFNwcmVhZERlZmF1bHRzPFxuICAgICAgICAmIENvbGxlY3RWYWx1ZXM8VFN0cmluZ3MsIHN0cmluZywgVENvbGxlY3RhYmxlLCBUTmVnYXRhYmxlPlxuICAgICAgICAmIFJlY3Vyc2l2ZVJlcXVpcmVkPENvbGxlY3RWYWx1ZXM8VEJvb2xlYW5zLCBib29sZWFuLCBUQ29sbGVjdGFibGU+PlxuICAgICAgICAmIENvbGxlY3RVbmtub3duVmFsdWVzPFxuICAgICAgICAgIFRCb29sZWFucyxcbiAgICAgICAgICBUU3RyaW5ncyxcbiAgICAgICAgICBUQ29sbGVjdGFibGUsXG4gICAgICAgICAgVE5lZ2F0YWJsZVxuICAgICAgICA+LFxuICAgICAgICBEZWRvdFJlY29yZDxURGVmYXVsdD5cbiAgICAgID4sXG4gICAgICBUQWxpYXNlc1xuICAgID5cbiAgLy8gZGVuby1saW50LWlnbm9yZSBuby1leHBsaWNpdC1hbnlcbiAgOiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuXG4vKiogQGludGVybmFsICovXG50eXBlIEFsaWFzZXM8VEFyZ05hbWVzID0gc3RyaW5nLCBUQWxpYXNOYW1lcyBleHRlbmRzIHN0cmluZyA9IHN0cmluZz4gPSBQYXJ0aWFsPFxuICBSZWNvcmQ8RXh0cmFjdDxUQXJnTmFtZXMsIHN0cmluZz4sIFRBbGlhc05hbWVzIHwgUmVhZG9ubHlBcnJheTxUQWxpYXNOYW1lcz4+XG4+O1xuXG50eXBlIEFkZEFsaWFzZXM8XG4gIFRBcmdzLFxuICBUQWxpYXNlcyBleHRlbmRzIEFsaWFzZXMgfCB1bmRlZmluZWQsXG4+ID0ge1xuICBbVEFyZ05hbWUgaW4ga2V5b2YgVEFyZ3MgYXMgQWxpYXNOYW1lczxUQXJnTmFtZSwgVEFsaWFzZXM+XTogVEFyZ3NbVEFyZ05hbWVdO1xufTtcblxudHlwZSBBbGlhc05hbWVzPFxuICBUQXJnTmFtZSxcbiAgVEFsaWFzZXMgZXh0ZW5kcyBBbGlhc2VzIHwgdW5kZWZpbmVkLFxuPiA9IFRBcmdOYW1lIGV4dGVuZHMga2V5b2YgVEFsaWFzZXNcbiAgPyBzdHJpbmcgZXh0ZW5kcyBUQWxpYXNlc1tUQXJnTmFtZV0gPyBUQXJnTmFtZVxuICA6IFRBbGlhc2VzW1RBcmdOYW1lXSBleHRlbmRzIHN0cmluZyA/IFRBcmdOYW1lIHwgVEFsaWFzZXNbVEFyZ05hbWVdXG4gIDogVEFsaWFzZXNbVEFyZ05hbWVdIGV4dGVuZHMgQXJyYXk8c3RyaW5nPlxuICAgID8gVEFyZ05hbWUgfCBUQWxpYXNlc1tUQXJnTmFtZV1bbnVtYmVyXVxuICA6IFRBcmdOYW1lXG4gIDogVEFyZ05hbWU7XG5cbi8qKlxuICogU3ByZWFkcyBhbGwgZGVmYXVsdCB2YWx1ZXMgb2YgUmVjb3JkIGBURGVmYXVsdHNgIGludG8gUmVjb3JkIGBUQXJnc2BcbiAqIGFuZCBtYWtlcyBkZWZhdWx0IHZhbHVlcyByZXF1aXJlZC5cbiAqXG4gKiAqKkV4YW1wbGU6KipcbiAqIGBTcHJlYWRWYWx1ZXM8eyBmb28/OiBib29sZWFuLCBiYXI/OiBudW1iZXIgfSwgeyBmb286IG51bWJlciB9PmBcbiAqXG4gKiAqKlJlc3VsdDoqKiBgeyBmb286IGJvb2xlYW4gfCBudW1iZXIsIGJhcj86IG51bWJlciB9YFxuICovXG50eXBlIFNwcmVhZERlZmF1bHRzPFRBcmdzLCBURGVmYXVsdHM+ID0gVERlZmF1bHRzIGV4dGVuZHMgdW5kZWZpbmVkID8gVEFyZ3NcbiAgOiBUQXJncyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+ID9cbiAgICAgICYgT21pdDxUQXJncywga2V5b2YgVERlZmF1bHRzPlxuICAgICAgJiB7XG4gICAgICAgIFtEZWZhdWx0IGluIGtleW9mIFREZWZhdWx0c106IERlZmF1bHQgZXh0ZW5kcyBrZXlvZiBUQXJnc1xuICAgICAgICAgID8gKFRBcmdzW0RlZmF1bHRdICYgVERlZmF1bHRzW0RlZmF1bHRdIHwgVERlZmF1bHRzW0RlZmF1bHRdKSBleHRlbmRzXG4gICAgICAgICAgICBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICAgICAgICAgICAgPyBOb25OdWxsYWJsZTxTcHJlYWREZWZhdWx0czxUQXJnc1tEZWZhdWx0XSwgVERlZmF1bHRzW0RlZmF1bHRdPj5cbiAgICAgICAgICA6IFREZWZhdWx0c1tEZWZhdWx0XSB8IE5vbk51bGxhYmxlPFRBcmdzW0RlZmF1bHRdPlxuICAgICAgICAgIDogdW5rbm93bjtcbiAgICAgIH1cbiAgOiBuZXZlcjtcblxuLyoqXG4gKiBEZWZpbmVzIHRoZSBSZWNvcmQgZm9yIHRoZSBgZGVmYXVsdGAgb3B0aW9uIHRvIGFkZFxuICogYXV0by1zdWdnZXN0aW9uIHN1cHBvcnQgZm9yIElERSdzLlxuICogQGludGVybmFsXG4gKi9cbnR5cGUgRGVmYXVsdHM8VEJvb2xlYW5zIGV4dGVuZHMgQm9vbGVhblR5cGUsIFRTdHJpbmdzIGV4dGVuZHMgU3RyaW5nVHlwZT4gPSBJZDxcbiAgVW5pb25Ub0ludGVyc2VjdGlvbjxcbiAgICAmIFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gICAgLy8gRGVkb3R0ZWQgYXV0byBzdWdnZXN0aW9uczogeyBmb286IHsgYmFyOiB1bmtub3duIH0gfVxuICAgICYgTWFwVHlwZXM8VFN0cmluZ3MsIHVua25vd24+XG4gICAgJiBNYXBUeXBlczxUQm9vbGVhbnMsIHVua25vd24+XG4gICAgLy8gRmxhdCBhdXRvIHN1Z2dlc3Rpb25zOiB7IFwiZm9vLmJhclwiOiB1bmtub3duIH1cbiAgICAmIE1hcERlZmF1bHRzPFRCb29sZWFucz5cbiAgICAmIE1hcERlZmF1bHRzPFRTdHJpbmdzPlxuICA+XG4+O1xuXG50eXBlIE1hcERlZmF1bHRzPFRBcmdOYW1lcyBleHRlbmRzIEFyZ1R5cGU+ID0gUGFydGlhbDxcbiAgUmVjb3JkPFRBcmdOYW1lcyBleHRlbmRzIHN0cmluZyA/IFRBcmdOYW1lcyA6IHN0cmluZywgdW5rbm93bj5cbj47XG5cbnR5cGUgUmVjdXJzaXZlUmVxdWlyZWQ8VFJlY29yZD4gPSBUUmVjb3JkIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPyB7XG4gICAgW0tleSBpbiBrZXlvZiBUUmVjb3JkXS0/OiBSZWN1cnNpdmVSZXF1aXJlZDxUUmVjb3JkW0tleV0+O1xuICB9XG4gIDogVFJlY29yZDtcblxuLyoqIFNhbWUgYXMgYE1hcFR5cGVzYCBidXQgYWxzbyBzdXBwb3J0cyBjb2xsZWN0YWJsZSBvcHRpb25zLiAqL1xudHlwZSBDb2xsZWN0VmFsdWVzPFxuICBUQXJnTmFtZXMgZXh0ZW5kcyBBcmdUeXBlLFxuICBUVHlwZSxcbiAgVENvbGxlY3RhYmxlIGV4dGVuZHMgQ29sbGVjdGFibGUsXG4gIFROZWdhdGFibGUgZXh0ZW5kcyBOZWdhdGFibGUgPSB1bmRlZmluZWQsXG4+ID0gVW5pb25Ub0ludGVyc2VjdGlvbjxcbiAgRXh0cmFjdDxUQXJnTmFtZXMsIFRDb2xsZWN0YWJsZT4gZXh0ZW5kcyBzdHJpbmcgP1xuICAgICAgJiAoRXhjbHVkZTxUQXJnTmFtZXMsIFRDb2xsZWN0YWJsZT4gZXh0ZW5kcyBuZXZlciA/IFJlY29yZDxuZXZlciwgbmV2ZXI+XG4gICAgICAgIDogTWFwVHlwZXM8RXhjbHVkZTxUQXJnTmFtZXMsIFRDb2xsZWN0YWJsZT4sIFRUeXBlLCBUTmVnYXRhYmxlPilcbiAgICAgICYgKEV4dHJhY3Q8VEFyZ05hbWVzLCBUQ29sbGVjdGFibGU+IGV4dGVuZHMgbmV2ZXIgPyBSZWNvcmQ8bmV2ZXIsIG5ldmVyPlxuICAgICAgICA6IFJlY3Vyc2l2ZVJlcXVpcmVkPFxuICAgICAgICAgIE1hcFR5cGVzPEV4dHJhY3Q8VEFyZ05hbWVzLCBUQ29sbGVjdGFibGU+LCBBcnJheTxUVHlwZT4sIFROZWdhdGFibGU+XG4gICAgICAgID4pXG4gICAgOiBNYXBUeXBlczxUQXJnTmFtZXMsIFRUeXBlLCBUTmVnYXRhYmxlPlxuPjtcblxuLyoqIFNhbWUgYXMgYFJlY29yZGAgYnV0IGFsc28gc3VwcG9ydHMgZG90dGVkIGFuZCBuZWdhdGFibGUgb3B0aW9ucy4gKi9cbnR5cGUgTWFwVHlwZXM8XG4gIFRBcmdOYW1lcyBleHRlbmRzIEFyZ1R5cGUsXG4gIFRUeXBlLFxuICBUTmVnYXRhYmxlIGV4dGVuZHMgTmVnYXRhYmxlID0gdW5kZWZpbmVkLFxuPiA9IHVuZGVmaW5lZCBleHRlbmRzIFRBcmdOYW1lcyA/IFJlY29yZDxuZXZlciwgbmV2ZXI+XG4gIDogVEFyZ05hbWVzIGV4dGVuZHMgYCR7aW5mZXIgTmFtZX0uJHtpbmZlciBSZXN0fWAgPyB7XG4gICAgICBbS2V5IGluIE5hbWVdPzogTWFwVHlwZXM8XG4gICAgICAgIFJlc3QsXG4gICAgICAgIFRUeXBlLFxuICAgICAgICBUTmVnYXRhYmxlIGV4dGVuZHMgYCR7TmFtZX0uJHtpbmZlciBOZWdhdGV9YCA/IE5lZ2F0ZSA6IHVuZGVmaW5lZFxuICAgICAgPjtcbiAgICB9XG4gIDogVEFyZ05hbWVzIGV4dGVuZHMgc3RyaW5nID8gUGFydGlhbDxcbiAgICAgIFJlY29yZDxUQXJnTmFtZXMsIFROZWdhdGFibGUgZXh0ZW5kcyBUQXJnTmFtZXMgPyBUVHlwZSB8IGZhbHNlIDogVFR5cGU+XG4gICAgPlxuICA6IFJlY29yZDxuZXZlciwgbmV2ZXI+O1xuXG50eXBlIENvbGxlY3RVbmtub3duVmFsdWVzPFxuICBUQm9vbGVhbnMgZXh0ZW5kcyBCb29sZWFuVHlwZSxcbiAgVFN0cmluZ3MgZXh0ZW5kcyBTdHJpbmdUeXBlLFxuICBUQ29sbGVjdGFibGUgZXh0ZW5kcyBDb2xsZWN0YWJsZSxcbiAgVE5lZ2F0YWJsZSBleHRlbmRzIE5lZ2F0YWJsZSxcbj4gPSBVbmlvblRvSW50ZXJzZWN0aW9uPFxuICBUQ29sbGVjdGFibGUgZXh0ZW5kcyBUQm9vbGVhbnMgJiBUU3RyaW5ncyA/IFJlY29yZDxuZXZlciwgbmV2ZXI+XG4gICAgOiBEZWRvdFJlY29yZDxcbiAgICAgIC8vIFVua25vd24gY29sbGVjdGFibGUgJiBub24tbmVnYXRhYmxlIGFyZ3MuXG4gICAgICAmIFJlY29yZDxcbiAgICAgICAgRXhjbHVkZTxcbiAgICAgICAgICBFeHRyYWN0PEV4Y2x1ZGU8VENvbGxlY3RhYmxlLCBUTmVnYXRhYmxlPiwgc3RyaW5nPixcbiAgICAgICAgICBFeHRyYWN0PFRTdHJpbmdzIHwgVEJvb2xlYW5zLCBzdHJpbmc+XG4gICAgICAgID4sXG4gICAgICAgIEFycmF5PHVua25vd24+XG4gICAgICA+XG4gICAgICAvLyBVbmtub3duIGNvbGxlY3RhYmxlICYgbmVnYXRhYmxlIGFyZ3MuXG4gICAgICAmIFJlY29yZDxcbiAgICAgICAgRXhjbHVkZTxcbiAgICAgICAgICBFeHRyYWN0PEV4dHJhY3Q8VENvbGxlY3RhYmxlLCBUTmVnYXRhYmxlPiwgc3RyaW5nPixcbiAgICAgICAgICBFeHRyYWN0PFRTdHJpbmdzIHwgVEJvb2xlYW5zLCBzdHJpbmc+XG4gICAgICAgID4sXG4gICAgICAgIEFycmF5PHVua25vd24+IHwgZmFsc2VcbiAgICAgID5cbiAgICA+XG4+O1xuXG4vKiogQ29udmVydHMgYHsgXCJmb28uYmFyLmJhelwiOiB1bmtub3duIH1gIGludG8gYHsgZm9vOiB7IGJhcjogeyBiYXo6IHVua25vd24gfSB9IH1gLiAqL1xudHlwZSBEZWRvdFJlY29yZDxUUmVjb3JkPiA9IFJlY29yZDxzdHJpbmcsIHVua25vd24+IGV4dGVuZHMgVFJlY29yZCA/IFRSZWNvcmRcbiAgOiBUUmVjb3JkIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPyBVbmlvblRvSW50ZXJzZWN0aW9uPFxuICAgICAgVmFsdWVPZjxcbiAgICAgICAge1xuICAgICAgICAgIFtLZXkgaW4ga2V5b2YgVFJlY29yZF06IEtleSBleHRlbmRzIHN0cmluZyA/IERlZG90PEtleSwgVFJlY29yZFtLZXldPlxuICAgICAgICAgICAgOiBuZXZlcjtcbiAgICAgICAgfVxuICAgICAgPlxuICAgID5cbiAgOiBUUmVjb3JkO1xuXG50eXBlIERlZG90PFRLZXkgZXh0ZW5kcyBzdHJpbmcsIFRWYWx1ZT4gPSBUS2V5IGV4dGVuZHNcbiAgYCR7aW5mZXIgTmFtZX0uJHtpbmZlciBSZXN0fWAgPyB7IFtLZXkgaW4gTmFtZV06IERlZG90PFJlc3QsIFRWYWx1ZT4gfVxuICA6IHsgW0tleSBpbiBUS2V5XTogVFZhbHVlIH07XG5cbnR5cGUgVmFsdWVPZjxUVmFsdWU+ID0gVFZhbHVlW2tleW9mIFRWYWx1ZV07XG5cbi8qKiBUaGUgdmFsdWUgcmV0dXJuZWQgZnJvbSB7QGxpbmtjb2RlIHBhcnNlQXJnc30uICovXG5leHBvcnQgdHlwZSBBcmdzPFxuICAvLyBkZW5vLWxpbnQtaWdub3JlIG5vLWV4cGxpY2l0LWFueVxuICBUQXJncyBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0gUmVjb3JkPHN0cmluZywgYW55PixcbiAgVERvdWJsZURhc2ggZXh0ZW5kcyBib29sZWFuIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuPiA9IElkPFxuICAmIFRBcmdzXG4gICYge1xuICAgIC8qKiBDb250YWlucyBhbGwgdGhlIGFyZ3VtZW50cyB0aGF0IGRpZG4ndCBoYXZlIGFuIG9wdGlvbiBhc3NvY2lhdGVkIHdpdGhcbiAgICAgKiB0aGVtLiAqL1xuICAgIF86IEFycmF5PHN0cmluZyB8IG51bWJlcj47XG4gIH1cbiAgJiAoYm9vbGVhbiBleHRlbmRzIFREb3VibGVEYXNoID8gRG91YmxlRGFzaFxuICAgIDogdHJ1ZSBleHRlbmRzIFREb3VibGVEYXNoID8gUmVxdWlyZWQ8RG91YmxlRGFzaD5cbiAgICA6IFJlY29yZDxuZXZlciwgbmV2ZXI+KVxuPjtcblxuLyoqIEBpbnRlcm5hbCAqL1xudHlwZSBEb3VibGVEYXNoID0ge1xuICAvKiogQ29udGFpbnMgYWxsIHRoZSBhcmd1bWVudHMgdGhhdCBhcHBlYXIgYWZ0ZXIgdGhlIGRvdWJsZSBkYXNoOiBcIi0tXCIuICovXG4gIFwiLS1cIj86IEFycmF5PHN0cmluZz47XG59O1xuXG4vKiogT3B0aW9ucyBmb3Ige0BsaW5rY29kZSBwYXJzZUFyZ3N9LiAqL1xuZXhwb3J0IGludGVyZmFjZSBQYXJzZU9wdGlvbnM8XG4gIFRCb29sZWFucyBleHRlbmRzIEJvb2xlYW5UeXBlID0gQm9vbGVhblR5cGUsXG4gIFRTdHJpbmdzIGV4dGVuZHMgU3RyaW5nVHlwZSA9IFN0cmluZ1R5cGUsXG4gIFRDb2xsZWN0YWJsZSBleHRlbmRzIENvbGxlY3RhYmxlID0gQ29sbGVjdGFibGUsXG4gIFROZWdhdGFibGUgZXh0ZW5kcyBOZWdhdGFibGUgPSBOZWdhdGFibGUsXG4gIFREZWZhdWx0IGV4dGVuZHMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCB1bmRlZmluZWQgPVxuICAgIHwgUmVjb3JkPHN0cmluZywgdW5rbm93bj5cbiAgICB8IHVuZGVmaW5lZCxcbiAgVEFsaWFzZXMgZXh0ZW5kcyBBbGlhc2VzIHwgdW5kZWZpbmVkID0gQWxpYXNlcyB8IHVuZGVmaW5lZCxcbiAgVERvdWJsZURhc2ggZXh0ZW5kcyBib29sZWFuIHwgdW5kZWZpbmVkID0gYm9vbGVhbiB8IHVuZGVmaW5lZCxcbj4ge1xuICAvKipcbiAgICogV2hlbiBgdHJ1ZWAsIHBvcHVsYXRlIHRoZSByZXN1bHQgYF9gIHdpdGggZXZlcnl0aGluZyBiZWZvcmUgdGhlIGAtLWAgYW5kXG4gICAqIHRoZSByZXN1bHQgYFsnLS0nXWAgd2l0aCBldmVyeXRoaW5nIGFmdGVyIHRoZSBgLS1gLlxuICAgKlxuICAgKiBAZGVmYXVsdCB7ZmFsc2V9XG4gICAqXG4gICAqIEBleGFtcGxlIERvdWJsZSBkYXNoIG9wdGlvbiBpcyBmYWxzZVxuICAgKiBgYGB0c1xuICAgKiAvLyAkIGRlbm8gcnVuIGV4YW1wbGUudHMgLS0gYSBhcmcxXG4gICAqIGltcG9ydCB7IHBhcnNlQXJncyB9IGZyb20gXCJAc3RkL2NsaS9wYXJzZS1hcmdzXCI7XG4gICAqIGNvbnN0IGFyZ3MgPSBwYXJzZUFyZ3MoRGVuby5hcmdzLCB7IFwiLS1cIjogZmFsc2UgfSk7IC8vIGFyZ3MgZXF1YWxzIHsgXzogWyBcImFcIiwgXCJhcmcxXCIgXSB9XG4gICAqIGBgYFxuICAgKlxuICAgKiBAZXhhbXBsZSBEb3VibGUgZGFzaCBvcHRpb24gaXMgdHJ1ZVxuICAgKiBgYGB0c1xuICAgKiAvLyAkIGRlbm8gcnVuIGV4YW1wbGUudHMgLS0gYSBhcmcxXG4gICAqIGltcG9ydCB7IHBhcnNlQXJncyB9IGZyb20gXCJAc3RkL2NsaS9wYXJzZS1hcmdzXCI7XG4gICAqIGNvbnN0IGFyZ3MgPSBwYXJzZUFyZ3MoRGVuby5hcmdzLCB7IFwiLS1cIjogdHJ1ZSB9KTsgLy8gYXJncyBlcXVhbHMgeyBfOiBbXSwgLS06IFsgXCJhXCIsIFwiYXJnMVwiIF0gfVxuICAgKiBgYGBcbiAgICovXG4gIFwiLS1cIj86IFREb3VibGVEYXNoO1xuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgbWFwcGluZyBzdHJpbmcgbmFtZXMgdG8gc3RyaW5ncyBvciBhcnJheXMgb2Ygc3RyaW5nIGFyZ3VtZW50XG4gICAqIG5hbWVzIHRvIHVzZSBhcyBhbGlhc2VzLlxuICAgKlxuICAgKiBAZGVmYXVsdCB7e319XG4gICAqL1xuICBhbGlhcz86IFRBbGlhc2VzO1xuXG4gIC8qKlxuICAgKiBBIGJvb2xlYW4sIHN0cmluZyBvciBhcnJheSBvZiBzdHJpbmdzIHRvIGFsd2F5cyB0cmVhdCBhcyBib29sZWFucy4gSWZcbiAgICogYHRydWVgIHdpbGwgdHJlYXQgYWxsIGRvdWJsZSBoeXBoZW5hdGVkIGFyZ3VtZW50cyB3aXRob3V0IGVxdWFsIHNpZ25zIGFzXG4gICAqIGBib29sZWFuYCAoZS5nLiBhZmZlY3RzIGAtLWZvb2AsIG5vdCBgLWZgIG9yIGAtLWZvbz1iYXJgKS5cbiAgICogIEFsbCBgYm9vbGVhbmAgYXJndW1lbnRzIHdpbGwgYmUgc2V0IHRvIGBmYWxzZWAgYnkgZGVmYXVsdC5cbiAgICpcbiAgICogQGRlZmF1bHQge2ZhbHNlfVxuICAgKi9cbiAgYm9vbGVhbj86IFRCb29sZWFucyB8IFJlYWRvbmx5QXJyYXk8RXh0cmFjdDxUQm9vbGVhbnMsIHN0cmluZz4+O1xuXG4gIC8qKlxuICAgKiBBbiBvYmplY3QgbWFwcGluZyBzdHJpbmcgYXJndW1lbnQgbmFtZXMgdG8gZGVmYXVsdCB2YWx1ZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IHt7fX1cbiAgICovXG4gIGRlZmF1bHQ/OiBURGVmYXVsdCAmIERlZmF1bHRzPFRCb29sZWFucywgVFN0cmluZ3M+O1xuXG4gIC8qKlxuICAgKiBXaGVuIGB0cnVlYCwgcG9wdWxhdGUgdGhlIHJlc3VsdCBgX2Agd2l0aCBldmVyeXRoaW5nIGFmdGVyIHRoZSBmaXJzdFxuICAgKiBub24tb3B0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCB7ZmFsc2V9XG4gICAqL1xuICBzdG9wRWFybHk/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIHN0cmluZyBvciBhcnJheSBvZiBzdHJpbmdzIGFyZ3VtZW50IG5hbWVzIHRvIGFsd2F5cyB0cmVhdCBhcyBzdHJpbmdzLlxuICAgKlxuICAgKiBAZGVmYXVsdCB7W119XG4gICAqL1xuICBzdHJpbmc/OiBUU3RyaW5ncyB8IFJlYWRvbmx5QXJyYXk8RXh0cmFjdDxUU3RyaW5ncywgc3RyaW5nPj47XG5cbiAgLyoqXG4gICAqIEEgc3RyaW5nIG9yIGFycmF5IG9mIHN0cmluZ3MgYXJndW1lbnQgbmFtZXMgdG8gYWx3YXlzIHRyZWF0IGFzIGFycmF5cy5cbiAgICogQ29sbGVjdGFibGUgb3B0aW9ucyBjYW4gYmUgdXNlZCBtdWx0aXBsZSB0aW1lcy4gQWxsIHZhbHVlcyB3aWxsIGJlXG4gICAqIGNvbGxlY3RlZCBpbnRvIG9uZSBhcnJheS4gSWYgYSBub24tY29sbGVjdGFibGUgb3B0aW9uIGlzIHVzZWQgbXVsdGlwbGVcbiAgICogdGltZXMsIHRoZSBsYXN0IHZhbHVlIGlzIHVzZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IHtbXX1cbiAgICovXG4gIGNvbGxlY3Q/OiBUQ29sbGVjdGFibGUgfCBSZWFkb25seUFycmF5PEV4dHJhY3Q8VENvbGxlY3RhYmxlLCBzdHJpbmc+PjtcblxuICAvKipcbiAgICogQSBzdHJpbmcgb3IgYXJyYXkgb2Ygc3RyaW5ncyBhcmd1bWVudCBuYW1lcyB3aGljaCBjYW4gYmUgbmVnYXRlZFxuICAgKiBieSBwcmVmaXhpbmcgdGhlbSB3aXRoIGAtLW5vLWAsIGxpa2UgYC0tbm8tY29uZmlnYC5cbiAgICpcbiAgICogQGRlZmF1bHQge1tdfVxuICAgKi9cbiAgbmVnYXRhYmxlPzogVE5lZ2F0YWJsZSB8IFJlYWRvbmx5QXJyYXk8RXh0cmFjdDxUTmVnYXRhYmxlLCBzdHJpbmc+PjtcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB3aGljaCBpcyBpbnZva2VkIHdpdGggYSBjb21tYW5kIGxpbmUgcGFyYW1ldGVyIG5vdCBkZWZpbmVkIGluXG4gICAqIHRoZSBgb3B0aW9uc2AgY29uZmlndXJhdGlvbiBvYmplY3QuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIGBmYWxzZWAsIHRoZVxuICAgKiB1bmtub3duIG9wdGlvbiBpcyBub3QgYWRkZWQgdG8gYHBhcnNlZEFyZ3NgLlxuICAgKlxuICAgKiBAZGVmYXVsdCB7dW5rbm93bn1cbiAgICovXG4gIHVua25vd24/OiAoYXJnOiBzdHJpbmcsIGtleT86IHN0cmluZywgdmFsdWU/OiB1bmtub3duKSA9PiB1bmtub3duO1xufVxuXG5pbnRlcmZhY2UgTmVzdGVkTWFwcGluZyB7XG4gIFtrZXk6IHN0cmluZ106IE5lc3RlZE1hcHBpbmcgfCB1bmtub3duO1xufVxuXG5jb25zdCBGTEFHX1JFR0VYUCA9XG4gIC9eKD86LSg/Oig/PGRvdWJsZURhc2g+LSkoPzxuZWdhdGVkPm5vLSk/KT8pKD88a2V5Pi4rPykoPzo9KD88dmFsdWU+LiopKT8kL3M7XG5jb25zdCBMRVRURVJfUkVHRVhQID0gL1tBLVphLXpdLztcbmNvbnN0IE5VTUJFUl9SRUdFWFAgPSAvLT9cXGQrKFxcLlxcZCopPyhlLT9cXGQrKT8kLztcbmNvbnN0IEhZUEhFTl9SRUdFWFAgPSAvXigtfC0tKVteLV0vO1xuY29uc3QgVkFMVUVfUkVHRVhQID0gLz0oPzx2YWx1ZT4uKykvO1xuY29uc3QgRkxBR19OQU1FX1JFR0VYUCA9IC9eLS1bXj1dKyQvO1xuY29uc3QgU1BFQ0lBTF9DSEFSX1JFR0VYUCA9IC9cXFcvO1xuXG5jb25zdCBOT05fV0hJVEVTUEFDRV9SRUdFWFAgPSAvXFxTLztcblxuZnVuY3Rpb24gaXNOdW1iZXIoc3RyaW5nOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIE5PTl9XSElURVNQQUNFX1JFR0VYUC50ZXN0KHN0cmluZykgJiYgTnVtYmVyLmlzRmluaXRlKE51bWJlcihzdHJpbmcpKTtcbn1cblxuZnVuY3Rpb24gaXNDb25zdHJ1Y3Rvck9yUHJvdG8ob2JqOiBOZXN0ZWRNYXBwaW5nLCBrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gKGtleSA9PT0gXCJjb25zdHJ1Y3RvclwiICYmIHR5cGVvZiBvYmpba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB8fFxuICAgIGtleSA9PT0gXCJfX3Byb3RvX19cIjtcbn1cblxuZnVuY3Rpb24gc2V0TmVzdGVkKFxuICBvYmplY3Q6IE5lc3RlZE1hcHBpbmcsXG4gIGtleXM6IHN0cmluZ1tdLFxuICB2YWx1ZTogdW5rbm93bixcbiAgY29sbGVjdCA9IGZhbHNlLFxuKSB7XG4gIGtleXMgPSBbLi4ua2V5c107XG4gIGNvbnN0IGtleSA9IGtleXMucG9wKCkhO1xuXG4gIGZvciAoY29uc3QgayBvZiBrZXlzKSB7XG4gICAgaWYgKGlzQ29uc3RydWN0b3JPclByb3RvKG9iamVjdCwgaykpIHJldHVybjtcbiAgICBvYmplY3QgPSAob2JqZWN0W2tdID8/PSB7fSkgYXMgTmVzdGVkTWFwcGluZztcbiAgfVxuXG4gIGlmIChpc0NvbnN0cnVjdG9yT3JQcm90byhvYmplY3QsIGtleSkpIHJldHVybjtcblxuICBpZiAoY29sbGVjdCkge1xuICAgIGNvbnN0IHYgPSBvYmplY3Rba2V5XTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgdi5wdXNoKHZhbHVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YWx1ZSA9IHYgPyBbdiwgdmFsdWVdIDogW3ZhbHVlXTtcbiAgfVxuXG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGhhc05lc3RlZChvYmplY3Q6IE5lc3RlZE1hcHBpbmcsIGtleXM6IHN0cmluZ1tdKTogYm9vbGVhbiB7XG4gIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICBjb25zdCB2YWx1ZSA9IG9iamVjdFtrZXldO1xuICAgIGlmICghT2JqZWN0Lmhhc093bihvYmplY3QsIGtleSkpIHJldHVybiBmYWxzZTtcbiAgICBvYmplY3QgPSB2YWx1ZSBhcyBOZXN0ZWRNYXBwaW5nO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBhbGlhc0lzQm9vbGVhbihcbiAgYWxpYXNNYXA6IE1hcDxzdHJpbmcsIFNldDxzdHJpbmc+PixcbiAgYm9vbGVhblNldDogU2V0PHN0cmluZz4sXG4gIGtleTogc3RyaW5nLFxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHNldCA9IGFsaWFzTWFwLmdldChrZXkpO1xuICBpZiAoc2V0ID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgZm9yIChjb25zdCBhbGlhcyBvZiBzZXQpIGlmIChib29sZWFuU2V0LmhhcyhhbGlhcykpIHJldHVybiB0cnVlO1xuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzQm9vbGVhblN0cmluZyh2YWx1ZTogc3RyaW5nKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gXCJ0cnVlXCIgfHwgdmFsdWUgPT09IFwiZmFsc2VcIjtcbn1cblxuZnVuY3Rpb24gcGFyc2VCb29sZWFuU3RyaW5nKHZhbHVlOiB1bmtub3duKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gXCJmYWxzZVwiO1xufVxuXG4vKipcbiAqIFRha2UgYSBzZXQgb2YgY29tbWFuZCBsaW5lIGFyZ3VtZW50cywgb3B0aW9uYWxseSB3aXRoIGEgc2V0IG9mIG9wdGlvbnMsIGFuZFxuICogcmV0dXJuIGFuIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGZsYWdzIGZvdW5kIGluIHRoZSBwYXNzZWQgYXJndW1lbnRzLlxuICpcbiAqIEJ5IGRlZmF1bHQsIGFueSBhcmd1bWVudHMgc3RhcnRpbmcgd2l0aCBgLWAgb3IgYC0tYCBhcmUgY29uc2lkZXJlZCBib29sZWFuXG4gKiBmbGFncy4gSWYgdGhlIGFyZ3VtZW50IG5hbWUgaXMgZm9sbG93ZWQgYnkgYW4gZXF1YWwgc2lnbiAoYD1gKSBpdCBpc1xuICogY29uc2lkZXJlZCBhIGtleS12YWx1ZSBwYWlyLiBBbnkgYXJndW1lbnRzIHdoaWNoIGNvdWxkIG5vdCBiZSBwYXJzZWQgYXJlXG4gKiBhdmFpbGFibGUgaW4gdGhlIGBfYCBwcm9wZXJ0eSBvZiB0aGUgcmV0dXJuZWQgb2JqZWN0LlxuICpcbiAqIEJ5IGRlZmF1bHQsIHRoaXMgbW9kdWxlIHRyaWVzIHRvIGRldGVybWluZSB0aGUgdHlwZSBvZiBhbGwgYXJndW1lbnRzXG4gKiBhdXRvbWF0aWNhbGx5IGFuZCB0aGUgcmV0dXJuIHR5cGUgb2YgdGhpcyBmdW5jdGlvbiB3aWxsIGhhdmUgYW4gaW5kZXhcbiAqIHNpZ25hdHVyZSB3aXRoIGBhbnlgIGFzIHZhbHVlIChgeyBbeDogc3RyaW5nXTogYW55IH1gKS5cbiAqXG4gKiBJZiB0aGUgYHN0cmluZ2AsIGBib29sZWFuYCBvciBgY29sbGVjdGAgb3B0aW9uIGlzIHNldCwgdGhlIHJldHVybiB2YWx1ZSBvZlxuICogdGhpcyBmdW5jdGlvbiB3aWxsIGJlIGZ1bGx5IHR5cGVkIGFuZCB0aGUgaW5kZXggc2lnbmF0dXJlIG9mIHRoZSByZXR1cm5cbiAqIHR5cGUgd2lsbCBjaGFuZ2UgdG8gYHsgW3g6IHN0cmluZ106IHVua25vd24gfWAuXG4gKlxuICogQW55IGFyZ3VtZW50cyBhZnRlciBgJy0tJ2Agd2lsbCBub3QgYmUgcGFyc2VkIGFuZCB3aWxsIGVuZCB1cCBpbiBgcGFyc2VkQXJncy5fYC5cbiAqXG4gKiBOdW1lcmljLWxvb2tpbmcgYXJndW1lbnRzIHdpbGwgYmUgcmV0dXJuZWQgYXMgbnVtYmVycyB1bmxlc3MgYG9wdGlvbnMuc3RyaW5nYFxuICogb3IgYG9wdGlvbnMuYm9vbGVhbmAgaXMgc2V0IGZvciB0aGF0IGFyZ3VtZW50IG5hbWUuXG4gKlxuICogU2VlIHtAbGlua2NvZGUgUGFyc2VPcHRpb25zfSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqXG4gKiBAcGFyYW0gYXJncyBBbiBhcnJheSBvZiBjb21tYW5kIGxpbmUgYXJndW1lbnRzLlxuICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIHBhcnNlIGZ1bmN0aW9uLlxuICpcbiAqIEB0eXBlUGFyYW0gVEFyZ3MgVHlwZSBvZiByZXN1bHQuXG4gKiBAdHlwZVBhcmFtIFREb3VibGVEYXNoIFVzZWQgYnkgYFRBcmdzYCBmb3IgdGhlIHJlc3VsdC5cbiAqIEB0eXBlUGFyYW0gVEJvb2xlYW5zIFVzZWQgYnkgYFRBcmdzYCBmb3IgdGhlIHJlc3VsdC5cbiAqIEB0eXBlUGFyYW0gVFN0cmluZ3MgVXNlZCBieSBgVEFyZ3NgIGZvciB0aGUgcmVzdWx0LlxuICogQHR5cGVQYXJhbSBUQ29sbGVjdGFibGUgVXNlZCBieSBgVEFyZ3NgIGZvciB0aGUgcmVzdWx0LlxuICogQHR5cGVQYXJhbSBUTmVnYXRhYmxlIFVzZWQgYnkgYFRBcmdzYCBmb3IgdGhlIHJlc3VsdC5cbiAqIEB0eXBlUGFyYW0gVERlZmF1bHRzIFVzZWQgYnkgYFRBcmdzYCBmb3IgdGhlIHJlc3VsdC5cbiAqIEB0eXBlUGFyYW0gVEFsaWFzZXMgVXNlZCBieSBgVEFyZ3NgIGZvciB0aGUgcmVzdWx0LlxuICogQHR5cGVQYXJhbSBUQWxpYXNBcmdOYW1lcyBVc2VkIGJ5IGBUQXJnc2AgZm9yIHRoZSByZXN1bHQuXG4gKiBAdHlwZVBhcmFtIFRBbGlhc05hbWVzIFVzZWQgYnkgYFRBcmdzYCBmb3IgdGhlIHJlc3VsdC5cbiAqXG4gKiBAcmV0dXJuIFRoZSBwYXJzZWQgYXJndW1lbnRzLlxuICpcbiAqIEBleGFtcGxlIFVzYWdlXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgcGFyc2VBcmdzIH0gZnJvbSBcIkBzdGQvY2xpL3BhcnNlLWFyZ3NcIjtcbiAqIGltcG9ydCB7IGFzc2VydEVxdWFscyB9IGZyb20gXCJAc3RkL2Fzc2VydC9lcXVhbHNcIjtcbiAqXG4gKiAvLyBGb3IgcHJvcGVyIHVzZSwgb25lIHNob3VsZCB1c2UgYHBhcnNlQXJncyhEZW5vLmFyZ3MpYFxuICogYXNzZXJ0RXF1YWxzKHBhcnNlQXJncyhbXCItLWZvb1wiLCBcIi0tYmFyPWJhelwiLCBcIi4vcXV1eC50eHRcIl0pLCB7XG4gKiAgIGZvbzogdHJ1ZSxcbiAqICAgYmFyOiBcImJhelwiLFxuICogICBfOiBbXCIuL3F1dXgudHh0XCJdLFxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiBAZXhhbXBsZSBgc3RyaW5nYCBhbmQgYGJvb2xlYW5gIG9wdGlvbnNcbiAqXG4gKiBVc2UgYHN0cmluZ2AgYW5kIGBib29sZWFuYCBvcHRpb25zIHRvIHNwZWNpZnkgdGhlIHR5cGUgb2YgdGhlIGFyZ3VtZW50LlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBwYXJzZUFyZ3MgfSBmcm9tIFwiQHN0ZC9jbGkvcGFyc2UtYXJnc1wiO1xuICogaW1wb3J0IHsgYXNzZXJ0RXF1YWxzIH0gZnJvbSBcIkBzdGQvYXNzZXJ0L2VxdWFsc1wiO1xuICpcbiAqIGNvbnN0IGFyZ3MgPSBwYXJzZUFyZ3MoW1wiLS1mb29cIiwgXCItLWJhclwiLCBcImJhelwiXSwge1xuICogICBib29sZWFuOiBbXCJmb29cIl0sXG4gKiAgIHN0cmluZzogW1wiYmFyXCJdLFxuICogfSk7XG4gKlxuICogYXNzZXJ0RXF1YWxzKGFyZ3MsIHsgZm9vOiB0cnVlLCBiYXI6IFwiYmF6XCIsIF86IFtdIH0pO1xuICogYGBgXG4gKlxuICogQGV4YW1wbGUgYGNvbGxlY3RgIG9wdGlvblxuICpcbiAqIGBjb2xsZWN0YCBvcHRpb24gdGVsbHMgdGhlIHBhcnNlciB0byB0cmVhdCB0aGUgb3B0aW9uIGFzIGFuIGFycmF5LiBBbGxcbiAqIHZhbHVlcyB3aWxsIGJlIGNvbGxlY3RlZCBpbnRvIG9uZSBhcnJheS4gSWYgYSBub24tY29sbGVjdGFibGUgb3B0aW9uIGlzIHVzZWRcbiAqIG11bHRpcGxlIHRpbWVzLCB0aGUgbGFzdCB2YWx1ZSBpcyB1c2VkLlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBwYXJzZUFyZ3MgfSBmcm9tIFwiQHN0ZC9jbGkvcGFyc2UtYXJnc1wiO1xuICogaW1wb3J0IHsgYXNzZXJ0RXF1YWxzIH0gZnJvbSBcIkBzdGQvYXNzZXJ0L2VxdWFsc1wiO1xuICpcbiAqIGNvbnN0IGFyZ3MgPSBwYXJzZUFyZ3MoW1wiLS1mb29cIiwgXCJiYXJcIiwgXCItLWZvb1wiLCBcImJhelwiXSwge1xuICogIGNvbGxlY3Q6IFtcImZvb1wiXSxcbiAqIH0pO1xuICpcbiAqIGFzc2VydEVxdWFscyhhcmdzLCB7IGZvbzogW1wiYmFyXCIsIFwiYmF6XCJdLCBfOiBbXSB9KTtcbiAqIGBgYFxuICpcbiAqIEBleGFtcGxlIGBuZWdhdGFibGVgIG9wdGlvblxuICpcbiAqIGBuZWdhdGFibGVgIG9wdGlvbiB0ZWxscyB0aGUgcGFyc2VyIHRvIHRyZWF0IHRoZSBvcHRpb24gY2FuIGJlIG5lZ2F0ZWQgYnlcbiAqIHByZWZpeGluZyB0aGVtIHdpdGggYC0tbm8tYCwgbGlrZSBgLS1uby1jb25maWdgLlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBwYXJzZUFyZ3MgfSBmcm9tIFwiQHN0ZC9jbGkvcGFyc2UtYXJnc1wiO1xuICogaW1wb3J0IHsgYXNzZXJ0RXF1YWxzIH0gZnJvbSBcIkBzdGQvYXNzZXJ0L2VxdWFsc1wiO1xuICpcbiAqIGNvbnN0IGFyZ3MgPSBwYXJzZUFyZ3MoW1wiLS1uby1mb29cIl0sIHtcbiAqICAgYm9vbGVhbjogW1wiZm9vXCJdLFxuICogICBuZWdhdGFibGU6IFtcImZvb1wiXSxcbiAqIH0pO1xuICpcbiAqIGFzc2VydEVxdWFscyhhcmdzLCB7IGZvbzogZmFsc2UsIF86IFtdIH0pO1xuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUFyZ3M8XG4gIFRBcmdzIGV4dGVuZHMgVmFsdWVzPFxuICAgIFRCb29sZWFucyxcbiAgICBUU3RyaW5ncyxcbiAgICBUQ29sbGVjdGFibGUsXG4gICAgVE5lZ2F0YWJsZSxcbiAgICBURGVmYXVsdHMsXG4gICAgVEFsaWFzZXNcbiAgPixcbiAgVERvdWJsZURhc2ggZXh0ZW5kcyBib29sZWFuIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuICBUQm9vbGVhbnMgZXh0ZW5kcyBCb29sZWFuVHlwZSA9IHVuZGVmaW5lZCxcbiAgVFN0cmluZ3MgZXh0ZW5kcyBTdHJpbmdUeXBlID0gdW5kZWZpbmVkLFxuICBUQ29sbGVjdGFibGUgZXh0ZW5kcyBDb2xsZWN0YWJsZSA9IHVuZGVmaW5lZCxcbiAgVE5lZ2F0YWJsZSBleHRlbmRzIE5lZ2F0YWJsZSA9IHVuZGVmaW5lZCxcbiAgVERlZmF1bHRzIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQsXG4gIFRBbGlhc2VzIGV4dGVuZHMgQWxpYXNlczxUQWxpYXNBcmdOYW1lcywgVEFsaWFzTmFtZXM+IHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkLFxuICBUQWxpYXNBcmdOYW1lcyBleHRlbmRzIHN0cmluZyA9IHN0cmluZyxcbiAgVEFsaWFzTmFtZXMgZXh0ZW5kcyBzdHJpbmcgPSBzdHJpbmcsXG4+KFxuICBhcmdzOiByZWFkb25seSBzdHJpbmdbXSxcbiAgb3B0aW9ucz86IFBhcnNlT3B0aW9uczxcbiAgICBUQm9vbGVhbnMsXG4gICAgVFN0cmluZ3MsXG4gICAgVENvbGxlY3RhYmxlLFxuICAgIFROZWdhdGFibGUsXG4gICAgVERlZmF1bHRzLFxuICAgIFRBbGlhc2VzLFxuICAgIFREb3VibGVEYXNoXG4gID4sXG4pOiBBcmdzPFRBcmdzLCBURG91YmxlRGFzaD4ge1xuICBjb25zdCB7XG4gICAgXCItLVwiOiBkb3VibGVEYXNoID0gZmFsc2UsXG4gICAgYWxpYXMgPSB7fSBhcyBOb25OdWxsYWJsZTxUQWxpYXNlcz4sXG4gICAgYm9vbGVhbiA9IGZhbHNlLFxuICAgIGRlZmF1bHQ6IGRlZmF1bHRzID0ge30gYXMgVERlZmF1bHRzICYgRGVmYXVsdHM8VEJvb2xlYW5zLCBUU3RyaW5ncz4sXG4gICAgc3RvcEVhcmx5ID0gZmFsc2UsXG4gICAgc3RyaW5nID0gW10sXG4gICAgY29sbGVjdCA9IFtdLFxuICAgIG5lZ2F0YWJsZSA9IFtdLFxuICAgIHVua25vd246IHVua25vd25GbiA9IChpOiBzdHJpbmcpOiB1bmtub3duID0+IGksXG4gIH0gPSBvcHRpb25zID8/IHt9O1xuICBjb25zdCBhbGlhc01hcDogTWFwPHN0cmluZywgU2V0PHN0cmluZz4+ID0gbmV3IE1hcCgpO1xuICBjb25zdCBib29sZWFuU2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGNvbnN0IHN0cmluZ1NldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICBjb25zdCBjb2xsZWN0U2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gIGNvbnN0IG5lZ2F0YWJsZVNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gIGxldCBhbGxCb29scyA9IGZhbHNlO1xuXG4gIGlmIChhbGlhcykge1xuICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGFsaWFzKSkge1xuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFsaWFzIHZhbHVlIG11c3QgYmUgZGVmaW5lZFwiKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFsaWFzZXMgPSBBcnJheS5pc0FycmF5KHZhbHVlKSA/IHZhbHVlIDogW3ZhbHVlXTtcbiAgICAgIGFsaWFzTWFwLnNldChrZXksIG5ldyBTZXQoYWxpYXNlcykpO1xuICAgICAgYWxpYXNlcy5mb3JFYWNoKChhbGlhcykgPT5cbiAgICAgICAgYWxpYXNNYXAuc2V0KFxuICAgICAgICAgIGFsaWFzLFxuICAgICAgICAgIG5ldyBTZXQoW2tleSwgLi4uYWxpYXNlcy5maWx0ZXIoKGl0KSA9PiBpdCAhPT0gYWxpYXMpXSksXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGJvb2xlYW4pIHtcbiAgICBpZiAodHlwZW9mIGJvb2xlYW4gPT09IFwiYm9vbGVhblwiKSB7XG4gICAgICBhbGxCb29scyA9IGJvb2xlYW47XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJvb2xlYW5BcmdzID0gQXJyYXkuaXNBcnJheShib29sZWFuKSA/IGJvb2xlYW4gOiBbYm9vbGVhbl07XG4gICAgICBmb3IgKGNvbnN0IGtleSBvZiBib29sZWFuQXJncy5maWx0ZXIoQm9vbGVhbikpIHtcbiAgICAgICAgYm9vbGVhblNldC5hZGQoa2V5KTtcbiAgICAgICAgYWxpYXNNYXAuZ2V0KGtleSk/LmZvckVhY2goKGFsKSA9PiB7XG4gICAgICAgICAgYm9vbGVhblNldC5hZGQoYWwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoc3RyaW5nKSB7XG4gICAgY29uc3Qgc3RyaW5nQXJncyA9IEFycmF5LmlzQXJyYXkoc3RyaW5nKSA/IHN0cmluZyA6IFtzdHJpbmddO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIHN0cmluZ0FyZ3MuZmlsdGVyKEJvb2xlYW4pKSB7XG4gICAgICBzdHJpbmdTZXQuYWRkKGtleSk7XG4gICAgICBhbGlhc01hcC5nZXQoa2V5KT8uZm9yRWFjaCgoYWwpID0+IHN0cmluZ1NldC5hZGQoYWwpKTtcbiAgICB9XG4gIH1cblxuICBpZiAoY29sbGVjdCkge1xuICAgIGNvbnN0IGNvbGxlY3RBcmdzID0gQXJyYXkuaXNBcnJheShjb2xsZWN0KSA/IGNvbGxlY3QgOiBbY29sbGVjdF07XG4gICAgZm9yIChjb25zdCBrZXkgb2YgY29sbGVjdEFyZ3MuZmlsdGVyKEJvb2xlYW4pKSB7XG4gICAgICBjb2xsZWN0U2V0LmFkZChrZXkpO1xuICAgICAgYWxpYXNNYXAuZ2V0KGtleSk/LmZvckVhY2goKGFsKSA9PiBjb2xsZWN0U2V0LmFkZChhbCkpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChuZWdhdGFibGUpIHtcbiAgICBjb25zdCBuZWdhdGFibGVBcmdzID0gQXJyYXkuaXNBcnJheShuZWdhdGFibGUpID8gbmVnYXRhYmxlIDogW25lZ2F0YWJsZV07XG4gICAgZm9yIChjb25zdCBrZXkgb2YgbmVnYXRhYmxlQXJncy5maWx0ZXIoQm9vbGVhbikpIHtcbiAgICAgIG5lZ2F0YWJsZVNldC5hZGQoa2V5KTtcbiAgICAgIGFsaWFzTWFwLmdldChrZXkpPy5mb3JFYWNoKChhbGlhcykgPT4gbmVnYXRhYmxlU2V0LmFkZChhbGlhcykpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGFyZ3Y6IEFyZ3MgPSB7IF86IFtdIH07XG5cbiAgZnVuY3Rpb24gc2V0QXJndW1lbnQoXG4gICAga2V5OiBzdHJpbmcsXG4gICAgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4sXG4gICAgYXJnOiBzdHJpbmcsXG4gICAgY29sbGVjdDogYm9vbGVhbixcbiAgKSB7XG4gICAgaWYgKFxuICAgICAgIWJvb2xlYW5TZXQuaGFzKGtleSkgJiZcbiAgICAgICFzdHJpbmdTZXQuaGFzKGtleSkgJiZcbiAgICAgICFhbGlhc01hcC5oYXMoa2V5KSAmJlxuICAgICAgIWNvbGxlY3RTZXQuaGFzKGtleSkgJiZcbiAgICAgICEoYWxsQm9vbHMgJiYgRkxBR19OQU1FX1JFR0VYUC50ZXN0KGFyZykpICYmXG4gICAgICB1bmtub3duRm4/LihhcmcsIGtleSwgdmFsdWUpID09PSBmYWxzZVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwic3RyaW5nXCIgJiYgIXN0cmluZ1NldC5oYXMoa2V5KSkge1xuICAgICAgdmFsdWUgPSBpc051bWJlcih2YWx1ZSkgPyBOdW1iZXIodmFsdWUpIDogdmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgY29sbGVjdGFibGUgPSBjb2xsZWN0ICYmIGNvbGxlY3RTZXQuaGFzKGtleSk7XG4gICAgc2V0TmVzdGVkKGFyZ3YsIGtleS5zcGxpdChcIi5cIiksIHZhbHVlLCBjb2xsZWN0YWJsZSk7XG4gICAgYWxpYXNNYXAuZ2V0KGtleSk/LmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgc2V0TmVzdGVkKGFyZ3YsIGtleS5zcGxpdChcIi5cIiksIHZhbHVlLCBjb2xsZWN0YWJsZSk7XG4gICAgfSk7XG4gIH1cblxuICBsZXQgbm90RmxhZ3M6IHN0cmluZ1tdID0gW107XG5cbiAgLy8gYWxsIGFyZ3MgYWZ0ZXIgXCItLVwiIGFyZSBub3QgcGFyc2VkXG4gIGNvbnN0IGluZGV4ID0gYXJncy5pbmRleE9mKFwiLS1cIik7XG4gIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICBub3RGbGFncyA9IGFyZ3Muc2xpY2UoaW5kZXggKyAxKTtcbiAgICBhcmdzID0gYXJncy5zbGljZSgwLCBpbmRleCk7XG4gIH1cblxuICBhcmdzTG9vcDpcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgYXJnID0gYXJnc1tpXSE7XG5cbiAgICBjb25zdCBncm91cHMgPSBhcmcubWF0Y2goRkxBR19SRUdFWFApPy5ncm91cHM7XG5cbiAgICBpZiAoZ3JvdXBzKSB7XG4gICAgICBjb25zdCB7IGRvdWJsZURhc2gsIG5lZ2F0ZWQgfSA9IGdyb3VwcztcbiAgICAgIGxldCBrZXkgPSBncm91cHMua2V5ITtcbiAgICAgIGxldCB2YWx1ZTogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IHVuZGVmaW5lZCA9IGdyb3Vwcy52YWx1ZTtcblxuICAgICAgaWYgKGRvdWJsZURhc2gpIHtcbiAgICAgICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICBpZiAoYm9vbGVhblNldC5oYXMoa2V5KSkgdmFsdWUgPSBwYXJzZUJvb2xlYW5TdHJpbmcodmFsdWUpO1xuICAgICAgICAgIHNldEFyZ3VtZW50KGtleSwgdmFsdWUsIGFyZywgdHJ1ZSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmVnYXRlZCkge1xuICAgICAgICAgIGlmIChuZWdhdGFibGVTZXQuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHNldEFyZ3VtZW50KGtleSwgZmFsc2UsIGFyZywgZmFsc2UpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGtleSA9IGBuby0ke2tleX1gO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV4dCA9IGFyZ3NbaSArIDFdO1xuXG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgIWJvb2xlYW5TZXQuaGFzKGtleSkgJiZcbiAgICAgICAgICAgICFhbGxCb29scyAmJlxuICAgICAgICAgICAgIW5leHQuc3RhcnRzV2l0aChcIi1cIikgJiZcbiAgICAgICAgICAgICghYWxpYXNNYXAuaGFzKGtleSkgfHwgIWFsaWFzSXNCb29sZWFuKGFsaWFzTWFwLCBib29sZWFuU2V0LCBrZXkpKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdmFsdWUgPSBuZXh0O1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgc2V0QXJndW1lbnQoa2V5LCB2YWx1ZSwgYXJnLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc0Jvb2xlYW5TdHJpbmcobmV4dCkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gcGFyc2VCb29sZWFuU3RyaW5nKG5leHQpO1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgc2V0QXJndW1lbnQoa2V5LCB2YWx1ZSwgYXJnLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhbHVlID0gc3RyaW5nU2V0LmhhcyhrZXkpID8gXCJcIiA6IHRydWU7XG4gICAgICAgIHNldEFyZ3VtZW50KGtleSwgdmFsdWUsIGFyZywgdHJ1ZSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgY29uc3QgbGV0dGVycyA9IGFyZy5zbGljZSgxLCAtMSkuc3BsaXQoXCJcIik7XG5cbiAgICAgIGZvciAoY29uc3QgW2osIGxldHRlcl0gb2YgbGV0dGVycy5lbnRyaWVzKCkpIHtcbiAgICAgICAgY29uc3QgbmV4dCA9IGFyZy5zbGljZShqICsgMik7XG5cbiAgICAgICAgaWYgKG5leHQgPT09IFwiLVwiKSB7XG4gICAgICAgICAgc2V0QXJndW1lbnQobGV0dGVyLCBuZXh0LCBhcmcsIHRydWUpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5leHQgPT09IFwiPVwiKSB7XG4gICAgICAgICAgc2V0QXJndW1lbnQobGV0dGVyLCBcIlwiLCBhcmcsIHRydWUpO1xuICAgICAgICAgIGNvbnRpbnVlIGFyZ3NMb29wO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKExFVFRFUl9SRUdFWFAudGVzdChsZXR0ZXIpKSB7XG4gICAgICAgICAgY29uc3QgZ3JvdXBzID0gVkFMVUVfUkVHRVhQLmV4ZWMobmV4dCk/Lmdyb3VwcztcbiAgICAgICAgICBpZiAoZ3JvdXBzKSB7XG4gICAgICAgICAgICBzZXRBcmd1bWVudChsZXR0ZXIsIGdyb3Vwcy52YWx1ZSEsIGFyZywgdHJ1ZSk7XG4gICAgICAgICAgICBjb250aW51ZSBhcmdzTG9vcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKE5VTUJFUl9SRUdFWFAudGVzdChuZXh0KSkge1xuICAgICAgICAgICAgc2V0QXJndW1lbnQobGV0dGVyLCBuZXh0LCBhcmcsIHRydWUpO1xuICAgICAgICAgICAgY29udGludWUgYXJnc0xvb3A7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxldHRlcnNbaiArIDFdPy5tYXRjaChTUEVDSUFMX0NIQVJfUkVHRVhQKSkge1xuICAgICAgICAgIHNldEFyZ3VtZW50KGxldHRlciwgYXJnLnNsaWNlKGogKyAyKSwgYXJnLCB0cnVlKTtcbiAgICAgICAgICBjb250aW51ZSBhcmdzTG9vcDtcbiAgICAgICAgfVxuICAgICAgICBzZXRBcmd1bWVudChsZXR0ZXIsIHN0cmluZ1NldC5oYXMobGV0dGVyKSA/IFwiXCIgOiB0cnVlLCBhcmcsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICBrZXkgPSBhcmcuc2xpY2UoLTEpO1xuICAgICAgaWYgKGtleSA9PT0gXCItXCIpIGNvbnRpbnVlO1xuXG4gICAgICBjb25zdCBuZXh0QXJnID0gYXJnc1tpICsgMV07XG5cbiAgICAgIGlmIChuZXh0QXJnKSB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAhSFlQSEVOX1JFR0VYUC50ZXN0KG5leHRBcmcpICYmXG4gICAgICAgICAgIWJvb2xlYW5TZXQuaGFzKGtleSkgJiZcbiAgICAgICAgICAoIWFsaWFzTWFwLmhhcyhrZXkpIHx8ICFhbGlhc0lzQm9vbGVhbihhbGlhc01hcCwgYm9vbGVhblNldCwga2V5KSlcbiAgICAgICAgKSB7XG4gICAgICAgICAgc2V0QXJndW1lbnQoa2V5LCBuZXh0QXJnLCBhcmcsIHRydWUpO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNCb29sZWFuU3RyaW5nKG5leHRBcmcpKSB7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBwYXJzZUJvb2xlYW5TdHJpbmcobmV4dEFyZyk7XG4gICAgICAgICAgc2V0QXJndW1lbnQoa2V5LCB2YWx1ZSwgYXJnLCB0cnVlKTtcbiAgICAgICAgICBpKys7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldEFyZ3VtZW50KGtleSwgc3RyaW5nU2V0LmhhcyhrZXkpID8gXCJcIiA6IHRydWUsIGFyZywgdHJ1ZSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAodW5rbm93bkZuPy4oYXJnKSAhPT0gZmFsc2UpIHtcbiAgICAgIGFyZ3YuXy5wdXNoKFxuICAgICAgICBzdHJpbmdTZXQuaGFzKFwiX1wiKSB8fCAhaXNOdW1iZXIoYXJnKSA/IGFyZyA6IE51bWJlcihhcmcpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoc3RvcEVhcmx5KSB7XG4gICAgICBhcmd2Ll8ucHVzaCguLi5hcmdzLnNsaWNlKGkgKyAxKSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhkZWZhdWx0cykpIHtcbiAgICBjb25zdCBrZXlzID0ga2V5LnNwbGl0KFwiLlwiKTtcbiAgICBpZiAoIWhhc05lc3RlZChhcmd2LCBrZXlzKSkge1xuICAgICAgc2V0TmVzdGVkKGFyZ3YsIGtleXMsIHZhbHVlKTtcbiAgICAgIGFsaWFzTWFwLmdldChrZXkpPy5mb3JFYWNoKChrZXkpID0+XG4gICAgICAgIHNldE5lc3RlZChhcmd2LCBrZXkuc3BsaXQoXCIuXCIpLCB2YWx1ZSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChjb25zdCBrZXkgb2YgYm9vbGVhblNldC5rZXlzKCkpIHtcbiAgICBjb25zdCBrZXlzID0ga2V5LnNwbGl0KFwiLlwiKTtcbiAgICBpZiAoIWhhc05lc3RlZChhcmd2LCBrZXlzKSkge1xuICAgICAgY29uc3QgdmFsdWUgPSBjb2xsZWN0U2V0LmhhcyhrZXkpID8gW10gOiBmYWxzZTtcbiAgICAgIHNldE5lc3RlZChhcmd2LCBrZXlzLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChjb25zdCBrZXkgb2Ygc3RyaW5nU2V0LmtleXMoKSkge1xuICAgIGNvbnN0IGtleXMgPSBrZXkuc3BsaXQoXCIuXCIpO1xuICAgIGlmICghaGFzTmVzdGVkKGFyZ3YsIGtleXMpICYmIGNvbGxlY3RTZXQuaGFzKGtleSkpIHtcbiAgICAgIHNldE5lc3RlZChhcmd2LCBrZXlzLCBbXSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKGRvdWJsZURhc2gpIHtcbiAgICBhcmd2W1wiLS1cIl0gPSBub3RGbGFncztcbiAgfSBlbHNlIHtcbiAgICBhcmd2Ll8ucHVzaCguLi5ub3RGbGFncyk7XG4gIH1cblxuICByZXR1cm4gYXJndiBhcyBBcmdzPFRBcmdzLCBURG91YmxlRGFzaD47XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscURBQXFEO0FBQ3JELHFDQUFxQztBQUVyQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXNFQyxHQUVEOztDQUVDLEdBNlZELE1BQU0sY0FDSjtBQUNGLE1BQU0sZ0JBQWdCO0FBQ3RCLE1BQU0sZ0JBQWdCO0FBQ3RCLE1BQU0sZ0JBQWdCO0FBQ3RCLE1BQU0sZUFBZTtBQUNyQixNQUFNLG1CQUFtQjtBQUN6QixNQUFNLHNCQUFzQjtBQUU1QixNQUFNLHdCQUF3QjtBQUU5QixTQUFTLFNBQVMsTUFBYztFQUM5QixPQUFPLHNCQUFzQixJQUFJLENBQUMsV0FBVyxPQUFPLFFBQVEsQ0FBQyxPQUFPO0FBQ3RFO0FBRUEsU0FBUyxxQkFBcUIsR0FBa0IsRUFBRSxHQUFXO0VBQzNELE9BQU8sQUFBQyxRQUFRLGlCQUFpQixPQUFPLEdBQUcsQ0FBQyxJQUFJLEtBQUssY0FDbkQsUUFBUTtBQUNaO0FBRUEsU0FBUyxVQUNQLE1BQXFCLEVBQ3JCLElBQWMsRUFDZCxLQUFjLEVBQ2QsVUFBVSxLQUFLO0VBRWYsT0FBTztPQUFJO0dBQUs7RUFDaEIsTUFBTSxNQUFNLEtBQUssR0FBRztFQUVwQixLQUFLLE1BQU0sS0FBSyxLQUFNO0lBQ3BCLElBQUkscUJBQXFCLFFBQVEsSUFBSTtJQUNyQyxTQUFVLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQztFQUMzQjtFQUVBLElBQUkscUJBQXFCLFFBQVEsTUFBTTtFQUV2QyxJQUFJLFNBQVM7SUFDWCxNQUFNLElBQUksTUFBTSxDQUFDLElBQUk7SUFDckIsSUFBSSxNQUFNLE9BQU8sQ0FBQyxJQUFJO01BQ3BCLEVBQUUsSUFBSSxDQUFDO01BQ1A7SUFDRjtJQUVBLFFBQVEsSUFBSTtNQUFDO01BQUc7S0FBTSxHQUFHO01BQUM7S0FBTTtFQUNsQztFQUVBLE1BQU0sQ0FBQyxJQUFJLEdBQUc7QUFDaEI7QUFFQSxTQUFTLFVBQVUsTUFBcUIsRUFBRSxJQUFjO0VBQ3RELEtBQUssTUFBTSxPQUFPLEtBQU07SUFDdEIsTUFBTSxRQUFRLE1BQU0sQ0FBQyxJQUFJO0lBQ3pCLElBQUksQ0FBQyxPQUFPLE1BQU0sQ0FBQyxRQUFRLE1BQU0sT0FBTztJQUN4QyxTQUFTO0VBQ1g7RUFDQSxPQUFPO0FBQ1Q7QUFFQSxTQUFTLGVBQ1AsUUFBa0MsRUFDbEMsVUFBdUIsRUFDdkIsR0FBVztFQUVYLE1BQU0sTUFBTSxTQUFTLEdBQUcsQ0FBQztFQUN6QixJQUFJLFFBQVEsV0FBVyxPQUFPO0VBQzlCLEtBQUssTUFBTSxTQUFTLElBQUssSUFBSSxXQUFXLEdBQUcsQ0FBQyxRQUFRLE9BQU87RUFDM0QsT0FBTztBQUNUO0FBRUEsU0FBUyxnQkFBZ0IsS0FBYTtFQUNwQyxPQUFPLFVBQVUsVUFBVSxVQUFVO0FBQ3ZDO0FBRUEsU0FBUyxtQkFBbUIsS0FBYztFQUN4QyxPQUFPLFVBQVU7QUFDbkI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBc0dDLEdBQ0QsT0FBTyxTQUFTLFVBbUJkLElBQXVCLEVBQ3ZCLE9BUUM7RUFFRCxNQUFNLEVBQ0osTUFBTSxhQUFhLEtBQUssRUFDeEIsUUFBUSxDQUFDLENBQTBCLEVBQ25DLFVBQVUsS0FBSyxFQUNmLFNBQVMsV0FBVyxDQUFDLENBQThDLEVBQ25FLFlBQVksS0FBSyxFQUNqQixTQUFTLEVBQUUsRUFDWCxVQUFVLEVBQUUsRUFDWixZQUFZLEVBQUUsRUFDZCxTQUFTLFlBQVksQ0FBQyxJQUF1QixDQUFDLEVBQy9DLEdBQUcsV0FBVyxDQUFDO0VBQ2hCLE1BQU0sV0FBcUMsSUFBSTtFQUMvQyxNQUFNLGFBQWEsSUFBSTtFQUN2QixNQUFNLFlBQVksSUFBSTtFQUN0QixNQUFNLGFBQWEsSUFBSTtFQUN2QixNQUFNLGVBQWUsSUFBSTtFQUV6QixJQUFJLFdBQVc7RUFFZixJQUFJLE9BQU87SUFDVCxLQUFLLE1BQU0sQ0FBQyxLQUFLLE1BQU0sSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFRO01BQ2hELElBQUksVUFBVSxXQUFXO1FBQ3ZCLE1BQU0sSUFBSSxVQUFVO01BQ3RCO01BQ0EsTUFBTSxVQUFVLE1BQU0sT0FBTyxDQUFDLFNBQVMsUUFBUTtRQUFDO09BQU07TUFDdEQsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLElBQUk7TUFDMUIsUUFBUSxPQUFPLENBQUMsQ0FBQyxRQUNmLFNBQVMsR0FBRyxDQUNWLE9BQ0EsSUFBSSxJQUFJO1VBQUM7YUFBUSxRQUFRLE1BQU0sQ0FBQyxDQUFDLEtBQU8sT0FBTztTQUFPO0lBRzVEO0VBQ0Y7RUFFQSxJQUFJLFNBQVM7SUFDWCxJQUFJLE9BQU8sWUFBWSxXQUFXO01BQ2hDLFdBQVc7SUFDYixPQUFPO01BQ0wsTUFBTSxjQUFjLE1BQU0sT0FBTyxDQUFDLFdBQVcsVUFBVTtRQUFDO09BQVE7TUFDaEUsS0FBSyxNQUFNLE9BQU8sWUFBWSxNQUFNLENBQUMsU0FBVTtRQUM3QyxXQUFXLEdBQUcsQ0FBQztRQUNmLFNBQVMsR0FBRyxDQUFDLE1BQU0sUUFBUSxDQUFDO1VBQzFCLFdBQVcsR0FBRyxDQUFDO1FBQ2pCO01BQ0Y7SUFDRjtFQUNGO0VBRUEsSUFBSSxRQUFRO0lBQ1YsTUFBTSxhQUFhLE1BQU0sT0FBTyxDQUFDLFVBQVUsU0FBUztNQUFDO0tBQU87SUFDNUQsS0FBSyxNQUFNLE9BQU8sV0FBVyxNQUFNLENBQUMsU0FBVTtNQUM1QyxVQUFVLEdBQUcsQ0FBQztNQUNkLFNBQVMsR0FBRyxDQUFDLE1BQU0sUUFBUSxDQUFDLEtBQU8sVUFBVSxHQUFHLENBQUM7SUFDbkQ7RUFDRjtFQUVBLElBQUksU0FBUztJQUNYLE1BQU0sY0FBYyxNQUFNLE9BQU8sQ0FBQyxXQUFXLFVBQVU7TUFBQztLQUFRO0lBQ2hFLEtBQUssTUFBTSxPQUFPLFlBQVksTUFBTSxDQUFDLFNBQVU7TUFDN0MsV0FBVyxHQUFHLENBQUM7TUFDZixTQUFTLEdBQUcsQ0FBQyxNQUFNLFFBQVEsQ0FBQyxLQUFPLFdBQVcsR0FBRyxDQUFDO0lBQ3BEO0VBQ0Y7RUFFQSxJQUFJLFdBQVc7SUFDYixNQUFNLGdCQUFnQixNQUFNLE9BQU8sQ0FBQyxhQUFhLFlBQVk7TUFBQztLQUFVO0lBQ3hFLEtBQUssTUFBTSxPQUFPLGNBQWMsTUFBTSxDQUFDLFNBQVU7TUFDL0MsYUFBYSxHQUFHLENBQUM7TUFDakIsU0FBUyxHQUFHLENBQUMsTUFBTSxRQUFRLENBQUMsUUFBVSxhQUFhLEdBQUcsQ0FBQztJQUN6RDtFQUNGO0VBRUEsTUFBTSxPQUFhO0lBQUUsR0FBRyxFQUFFO0VBQUM7RUFFM0IsU0FBUyxZQUNQLEdBQVcsRUFDWCxLQUFnQyxFQUNoQyxHQUFXLEVBQ1gsT0FBZ0I7SUFFaEIsSUFDRSxDQUFDLFdBQVcsR0FBRyxDQUFDLFFBQ2hCLENBQUMsVUFBVSxHQUFHLENBQUMsUUFDZixDQUFDLFNBQVMsR0FBRyxDQUFDLFFBQ2QsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxRQUNoQixDQUFDLENBQUMsWUFBWSxpQkFBaUIsSUFBSSxDQUFDLElBQUksS0FDeEMsWUFBWSxLQUFLLEtBQUssV0FBVyxPQUNqQztNQUNBO0lBQ0Y7SUFFQSxJQUFJLE9BQU8sVUFBVSxZQUFZLENBQUMsVUFBVSxHQUFHLENBQUMsTUFBTTtNQUNwRCxRQUFRLFNBQVMsU0FBUyxPQUFPLFNBQVM7SUFDNUM7SUFFQSxNQUFNLGNBQWMsV0FBVyxXQUFXLEdBQUcsQ0FBQztJQUM5QyxVQUFVLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxPQUFPO0lBQ3ZDLFNBQVMsR0FBRyxDQUFDLE1BQU0sUUFBUSxDQUFDO01BQzFCLFVBQVUsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLE9BQU87SUFDekM7RUFDRjtFQUVBLElBQUksV0FBcUIsRUFBRTtFQUUzQixxQ0FBcUM7RUFDckMsTUFBTSxRQUFRLEtBQUssT0FBTyxDQUFDO0VBQzNCLElBQUksVUFBVSxDQUFDLEdBQUc7SUFDaEIsV0FBVyxLQUFLLEtBQUssQ0FBQyxRQUFRO0lBQzlCLE9BQU8sS0FBSyxLQUFLLENBQUMsR0FBRztFQUN2QjtFQUVBLFVBQ0EsSUFBSyxJQUFJLElBQUksR0FBRyxJQUFJLEtBQUssTUFBTSxFQUFFLElBQUs7SUFDcEMsTUFBTSxNQUFNLElBQUksQ0FBQyxFQUFFO0lBRW5CLE1BQU0sU0FBUyxJQUFJLEtBQUssQ0FBQyxjQUFjO0lBRXZDLElBQUksUUFBUTtNQUNWLE1BQU0sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEdBQUc7TUFDaEMsSUFBSSxNQUFNLE9BQU8sR0FBRztNQUNwQixJQUFJLFFBQStDLE9BQU8sS0FBSztNQUUvRCxJQUFJLFlBQVk7UUFDZCxJQUFJLFNBQVMsTUFBTTtVQUNqQixJQUFJLFdBQVcsR0FBRyxDQUFDLE1BQU0sUUFBUSxtQkFBbUI7VUFDcEQsWUFBWSxLQUFLLE9BQU8sS0FBSztVQUM3QjtRQUNGO1FBRUEsSUFBSSxTQUFTO1VBQ1gsSUFBSSxhQUFhLEdBQUcsQ0FBQyxNQUFNO1lBQ3pCLFlBQVksS0FBSyxPQUFPLEtBQUs7WUFDN0I7VUFDRjtVQUNBLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSztRQUNuQjtRQUVBLE1BQU0sT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFO1FBRXhCLElBQUksTUFBTTtVQUNSLElBQ0UsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxRQUNoQixDQUFDLFlBQ0QsQ0FBQyxLQUFLLFVBQVUsQ0FBQyxRQUNqQixDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsUUFBUSxDQUFDLGVBQWUsVUFBVSxZQUFZLElBQUksR0FDakU7WUFDQSxRQUFRO1lBQ1I7WUFDQSxZQUFZLEtBQUssT0FBTyxLQUFLO1lBQzdCO1VBQ0Y7VUFFQSxJQUFJLGdCQUFnQixPQUFPO1lBQ3pCLFFBQVEsbUJBQW1CO1lBQzNCO1lBQ0EsWUFBWSxLQUFLLE9BQU8sS0FBSztZQUM3QjtVQUNGO1FBQ0Y7UUFFQSxRQUFRLFVBQVUsR0FBRyxDQUFDLE9BQU8sS0FBSztRQUNsQyxZQUFZLEtBQUssT0FBTyxLQUFLO1FBQzdCO01BQ0Y7TUFDQSxNQUFNLFVBQVUsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO01BRXZDLEtBQUssTUFBTSxDQUFDLEdBQUcsT0FBTyxJQUFJLFFBQVEsT0FBTyxHQUFJO1FBQzNDLE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQyxJQUFJO1FBRTNCLElBQUksU0FBUyxLQUFLO1VBQ2hCLFlBQVksUUFBUSxNQUFNLEtBQUs7VUFDL0I7UUFDRjtRQUVBLElBQUksU0FBUyxLQUFLO1VBQ2hCLFlBQVksUUFBUSxJQUFJLEtBQUs7VUFDN0IsU0FBUztRQUNYO1FBRUEsSUFBSSxjQUFjLElBQUksQ0FBQyxTQUFTO1VBQzlCLE1BQU0sU0FBUyxhQUFhLElBQUksQ0FBQyxPQUFPO1VBQ3hDLElBQUksUUFBUTtZQUNWLFlBQVksUUFBUSxPQUFPLEtBQUssRUFBRyxLQUFLO1lBQ3hDLFNBQVM7VUFDWDtVQUNBLElBQUksY0FBYyxJQUFJLENBQUMsT0FBTztZQUM1QixZQUFZLFFBQVEsTUFBTSxLQUFLO1lBQy9CLFNBQVM7VUFDWDtRQUNGO1FBRUEsSUFBSSxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxzQkFBc0I7VUFDOUMsWUFBWSxRQUFRLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLO1VBQzNDLFNBQVM7UUFDWDtRQUNBLFlBQVksUUFBUSxVQUFVLEdBQUcsQ0FBQyxVQUFVLEtBQUssTUFBTSxLQUFLO01BQzlEO01BRUEsTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDO01BQ2pCLElBQUksUUFBUSxLQUFLO01BRWpCLE1BQU0sVUFBVSxJQUFJLENBQUMsSUFBSSxFQUFFO01BRTNCLElBQUksU0FBUztRQUNYLElBQ0UsQ0FBQyxjQUFjLElBQUksQ0FBQyxZQUNwQixDQUFDLFdBQVcsR0FBRyxDQUFDLFFBQ2hCLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxRQUFRLENBQUMsZUFBZSxVQUFVLFlBQVksSUFBSSxHQUNqRTtVQUNBLFlBQVksS0FBSyxTQUFTLEtBQUs7VUFDL0I7VUFDQTtRQUNGO1FBQ0EsSUFBSSxnQkFBZ0IsVUFBVTtVQUM1QixNQUFNLFFBQVEsbUJBQW1CO1VBQ2pDLFlBQVksS0FBSyxPQUFPLEtBQUs7VUFDN0I7VUFDQTtRQUNGO01BQ0Y7TUFDQSxZQUFZLEtBQUssVUFBVSxHQUFHLENBQUMsT0FBTyxLQUFLLE1BQU0sS0FBSztNQUN0RDtJQUNGO0lBRUEsSUFBSSxZQUFZLFNBQVMsT0FBTztNQUM5QixLQUFLLENBQUMsQ0FBQyxJQUFJLENBQ1QsVUFBVSxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsT0FBTyxNQUFNLE9BQU87SUFFeEQ7SUFFQSxJQUFJLFdBQVc7TUFDYixLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksS0FBSyxLQUFLLENBQUMsSUFBSTtNQUM5QjtJQUNGO0VBQ0Y7RUFFQSxLQUFLLE1BQU0sQ0FBQyxLQUFLLE1BQU0sSUFBSSxPQUFPLE9BQU8sQ0FBQyxVQUFXO0lBQ25ELE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQztJQUN2QixJQUFJLENBQUMsVUFBVSxNQUFNLE9BQU87TUFDMUIsVUFBVSxNQUFNLE1BQU07TUFDdEIsU0FBUyxHQUFHLENBQUMsTUFBTSxRQUFRLENBQUMsTUFDMUIsVUFBVSxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU07SUFFcEM7RUFDRjtFQUVBLEtBQUssTUFBTSxPQUFPLFdBQVcsSUFBSSxHQUFJO0lBQ25DLE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQztJQUN2QixJQUFJLENBQUMsVUFBVSxNQUFNLE9BQU87TUFDMUIsTUFBTSxRQUFRLFdBQVcsR0FBRyxDQUFDLE9BQU8sRUFBRSxHQUFHO01BQ3pDLFVBQVUsTUFBTSxNQUFNO0lBQ3hCO0VBQ0Y7RUFFQSxLQUFLLE1BQU0sT0FBTyxVQUFVLElBQUksR0FBSTtJQUNsQyxNQUFNLE9BQU8sSUFBSSxLQUFLLENBQUM7SUFDdkIsSUFBSSxDQUFDLFVBQVUsTUFBTSxTQUFTLFdBQVcsR0FBRyxDQUFDLE1BQU07TUFDakQsVUFBVSxNQUFNLE1BQU0sRUFBRTtJQUMxQjtFQUNGO0VBRUEsSUFBSSxZQUFZO0lBQ2QsSUFBSSxDQUFDLEtBQUssR0FBRztFQUNmLE9BQU87SUFDTCxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUk7RUFDakI7RUFFQSxPQUFPO0FBQ1QifQ==
// denoCacheMetadata=698563375246469632,2672622221363011131