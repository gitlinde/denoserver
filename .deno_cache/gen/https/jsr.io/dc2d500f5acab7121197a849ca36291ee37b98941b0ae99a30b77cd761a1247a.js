// Copyright 2018-2026 the Deno authors. MIT license.
// This module is browser compatible.
/**
 * A template literal tag function for creating HTML strings with interpolated
 * values.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * This function processes template literals and concatenates them with
 * interpolated values. Values are inserted as-is without any HTML escaping or
 * sanitization. Undefined values are treated as empty strings.
 *
 * > [!WARNING]
 * > **Security Warning**: This function does NOT escape HTML. When
 * > interpolating user-provided data, you must manually escape it to prevent
 * > XSS (Cross-Site Scripting) attacks. Only use this function with trusted
 * > data or data that has been properly sanitized. Use
 * > {@linkcode https://jsr.io/@std/html/doc/~/escape | escape()} for escaping.
 *
 * @param strings The template string array containing the static parts of the template
 * @param values The values to be interpolated into the template
 * @returns The resulting HTML string with interpolated values
 *
 * @example Usage with trusted content
 * ```ts
 * import { html } from "@std/html/unstable-html";
 * import { assertEquals } from "@std/assert/equals";
 *
 * const name = "Alice";
 * const color = "blue";
 * const htmlContent = html`
 *   <div>
 *     <h1>Hello, ${name}!</h1>
 *     <p style="color: ${color};">Welcome to our site.</p>
 *   </div>
 * `;
 *
 * assertEquals(htmlContent, `
 *   <div>
 *     <h1>Hello, Alice!</h1>
 *     <p style="color: blue;">Welcome to our site.</p>
 *   </div>
 * `);
 * ```
 *
 * @example Usage with untrusted content that needs to be escaped
 * ```ts
 * import { html } from "@std/html/unstable-html";
 * import { assertEquals } from "@std/assert/equals";
 * import { escape } from "@std/html/entities";
 *
 * // WARNING: This is vulnerable to XSS attacks!
 * const userInput = '<script>alert("XSS")</script>';
 * const unsafeHtml = html`<div>${userInput}</div>`;
 *
 * const safeHtml = html`<div>${escape(userInput)}</div>`;
 *
 * assertEquals(unsafeHtml, '<div><script>alert("XSS")</script></div>');
 * assertEquals(safeHtml, "<div>&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</div>");
 * ```
 */ export function html(strings, ...values) {
  return strings.reduce((result, str, i)=>result + str + (values[i] ?? ""), "");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vanNyLmlvL0BzdGQvaHRtbC8xLjAuNy91bnN0YWJsZV9odG1sLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjYgdGhlIERlbm8gYXV0aG9ycy4gTUlUIGxpY2Vuc2UuXG4vLyBUaGlzIG1vZHVsZSBpcyBicm93c2VyIGNvbXBhdGlibGUuXG5cbi8qKlxuICogQSB0ZW1wbGF0ZSBsaXRlcmFsIHRhZyBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgSFRNTCBzdHJpbmdzIHdpdGggaW50ZXJwb2xhdGVkXG4gKiB2YWx1ZXMuXG4gKlxuICogQGV4cGVyaW1lbnRhbCAqKlVOU1RBQkxFKio6IE5ldyBBUEksIHlldCB0byBiZSB2ZXR0ZWQuXG4gKlxuICogVGhpcyBmdW5jdGlvbiBwcm9jZXNzZXMgdGVtcGxhdGUgbGl0ZXJhbHMgYW5kIGNvbmNhdGVuYXRlcyB0aGVtIHdpdGhcbiAqIGludGVycG9sYXRlZCB2YWx1ZXMuIFZhbHVlcyBhcmUgaW5zZXJ0ZWQgYXMtaXMgd2l0aG91dCBhbnkgSFRNTCBlc2NhcGluZyBvclxuICogc2FuaXRpemF0aW9uLiBVbmRlZmluZWQgdmFsdWVzIGFyZSB0cmVhdGVkIGFzIGVtcHR5IHN0cmluZ3MuXG4gKlxuICogPiBbIVdBUk5JTkddXG4gKiA+ICoqU2VjdXJpdHkgV2FybmluZyoqOiBUaGlzIGZ1bmN0aW9uIGRvZXMgTk9UIGVzY2FwZSBIVE1MLiBXaGVuXG4gKiA+IGludGVycG9sYXRpbmcgdXNlci1wcm92aWRlZCBkYXRhLCB5b3UgbXVzdCBtYW51YWxseSBlc2NhcGUgaXQgdG8gcHJldmVudFxuICogPiBYU1MgKENyb3NzLVNpdGUgU2NyaXB0aW5nKSBhdHRhY2tzLiBPbmx5IHVzZSB0aGlzIGZ1bmN0aW9uIHdpdGggdHJ1c3RlZFxuICogPiBkYXRhIG9yIGRhdGEgdGhhdCBoYXMgYmVlbiBwcm9wZXJseSBzYW5pdGl6ZWQuIFVzZVxuICogPiB7QGxpbmtjb2RlIGh0dHBzOi8vanNyLmlvL0BzdGQvaHRtbC9kb2Mvfi9lc2NhcGUgfCBlc2NhcGUoKX0gZm9yIGVzY2FwaW5nLlxuICpcbiAqIEBwYXJhbSBzdHJpbmdzIFRoZSB0ZW1wbGF0ZSBzdHJpbmcgYXJyYXkgY29udGFpbmluZyB0aGUgc3RhdGljIHBhcnRzIG9mIHRoZSB0ZW1wbGF0ZVxuICogQHBhcmFtIHZhbHVlcyBUaGUgdmFsdWVzIHRvIGJlIGludGVycG9sYXRlZCBpbnRvIHRoZSB0ZW1wbGF0ZVxuICogQHJldHVybnMgVGhlIHJlc3VsdGluZyBIVE1MIHN0cmluZyB3aXRoIGludGVycG9sYXRlZCB2YWx1ZXNcbiAqXG4gKiBAZXhhbXBsZSBVc2FnZSB3aXRoIHRydXN0ZWQgY29udGVudFxuICogYGBgdHNcbiAqIGltcG9ydCB7IGh0bWwgfSBmcm9tIFwiQHN0ZC9odG1sL3Vuc3RhYmxlLWh0bWxcIjtcbiAqIGltcG9ydCB7IGFzc2VydEVxdWFscyB9IGZyb20gXCJAc3RkL2Fzc2VydC9lcXVhbHNcIjtcbiAqXG4gKiBjb25zdCBuYW1lID0gXCJBbGljZVwiO1xuICogY29uc3QgY29sb3IgPSBcImJsdWVcIjtcbiAqIGNvbnN0IGh0bWxDb250ZW50ID0gaHRtbGBcbiAqICAgPGRpdj5cbiAqICAgICA8aDE+SGVsbG8sICR7bmFtZX0hPC9oMT5cbiAqICAgICA8cCBzdHlsZT1cImNvbG9yOiAke2NvbG9yfTtcIj5XZWxjb21lIHRvIG91ciBzaXRlLjwvcD5cbiAqICAgPC9kaXY+XG4gKiBgO1xuICpcbiAqIGFzc2VydEVxdWFscyhodG1sQ29udGVudCwgYFxuICogICA8ZGl2PlxuICogICAgIDxoMT5IZWxsbywgQWxpY2UhPC9oMT5cbiAqICAgICA8cCBzdHlsZT1cImNvbG9yOiBibHVlO1wiPldlbGNvbWUgdG8gb3VyIHNpdGUuPC9wPlxuICogICA8L2Rpdj5cbiAqIGApO1xuICogYGBgXG4gKlxuICogQGV4YW1wbGUgVXNhZ2Ugd2l0aCB1bnRydXN0ZWQgY29udGVudCB0aGF0IG5lZWRzIHRvIGJlIGVzY2FwZWRcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBodG1sIH0gZnJvbSBcIkBzdGQvaHRtbC91bnN0YWJsZS1odG1sXCI7XG4gKiBpbXBvcnQgeyBhc3NlcnRFcXVhbHMgfSBmcm9tIFwiQHN0ZC9hc3NlcnQvZXF1YWxzXCI7XG4gKiBpbXBvcnQgeyBlc2NhcGUgfSBmcm9tIFwiQHN0ZC9odG1sL2VudGl0aWVzXCI7XG4gKlxuICogLy8gV0FSTklORzogVGhpcyBpcyB2dWxuZXJhYmxlIHRvIFhTUyBhdHRhY2tzIVxuICogY29uc3QgdXNlcklucHV0ID0gJzxzY3JpcHQ+YWxlcnQoXCJYU1NcIik8L3NjcmlwdD4nO1xuICogY29uc3QgdW5zYWZlSHRtbCA9IGh0bWxgPGRpdj4ke3VzZXJJbnB1dH08L2Rpdj5gO1xuICpcbiAqIGNvbnN0IHNhZmVIdG1sID0gaHRtbGA8ZGl2PiR7ZXNjYXBlKHVzZXJJbnB1dCl9PC9kaXY+YDtcbiAqXG4gKiBhc3NlcnRFcXVhbHModW5zYWZlSHRtbCwgJzxkaXY+PHNjcmlwdD5hbGVydChcIlhTU1wiKTwvc2NyaXB0PjwvZGl2PicpO1xuICogYXNzZXJ0RXF1YWxzKHNhZmVIdG1sLCBcIjxkaXY+Jmx0O3NjcmlwdCZndDthbGVydCgmcXVvdDtYU1MmcXVvdDspJmx0Oy9zY3JpcHQmZ3Q7PC9kaXY+XCIpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBodG1sKFxuICBzdHJpbmdzOiBUZW1wbGF0ZVN0cmluZ3NBcnJheSxcbiAgLi4udmFsdWVzOiB1bmtub3duW11cbik6IHN0cmluZyB7XG4gIHJldHVybiBzdHJpbmdzLnJlZHVjZShcbiAgICAocmVzdWx0LCBzdHIsIGkpID0+IHJlc3VsdCArIHN0ciArICh2YWx1ZXNbaV0gPz8gXCJcIiksXG4gICAgXCJcIixcbiAgKTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxREFBcUQ7QUFDckQscUNBQXFDO0FBRXJDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBMERDLEdBQ0QsT0FBTyxTQUFTLEtBQ2QsT0FBNkIsRUFDN0IsR0FBRyxNQUFpQjtFQUVwQixPQUFPLFFBQVEsTUFBTSxDQUNuQixDQUFDLFFBQVEsS0FBSyxJQUFNLFNBQVMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxHQUNuRDtBQUVKIn0=
// denoCacheMetadata=16093110537264447071,4037410646333688931