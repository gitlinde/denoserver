// Copyright 2018-2026 the Deno authors. MIT license.
/**
 * Gets the IPv4 or IPv6 network address of the machine.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.

 *
 * This is inspired by the util of the same name in
 * {@linkcode https://www.npmjs.com/package/serve | npm:serve}.
 *
 * For more advanced use, use {@linkcode Deno.networkInterfaces} directly.
 *
 * @see {@link https://github.com/vercel/serve/blob/1ea55b1b5004f468159b54775e4fb3090fedbb2b/source/utilities/http.ts#L33}
 *
 * @param family The IP protocol version of the interface to get the address of.
 * @returns The IPv4 network address of the machine or `undefined` if not found.
 *
 * @example Get the IPv4 network address (default)
 * ```ts no-assert ignore
 * import { getNetworkAddress } from "@std/net/unstable-get-network-address";
 *
 * const hostname = getNetworkAddress()!;
 *
 * Deno.serve({ port: 0, hostname }, () => new Response("Hello, world!"));
 * ```
 *
 * @example Get the IPv6 network address
 * ```ts no-assert ignore
 * import { getNetworkAddress } from "@std/net/unstable-get-network-address";
 *
 * const hostname = getNetworkAddress("IPv6")!;
 *
 * Deno.serve({ port: 0, hostname }, () => new Response("Hello, world!"));
 * ```
 */ export function getNetworkAddress(family = "IPv4") {
  return Deno.networkInterfaces().find((i)=>i.family === family && i.mac !== "00:00:00:00:00:00" && (family === "IPv4" ? !i.address.startsWith("127") : !(i.address === "::1" || i.address === "fe80::1") && i.scopeid === 0))?.address;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vanNyLmlvL0BzdGQvbmV0LzEuMC43L3Vuc3RhYmxlX2dldF9uZXR3b3JrX2FkZHJlc3MudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyNiB0aGUgRGVubyBhdXRob3JzLiBNSVQgbGljZW5zZS5cbi8qKlxuICogR2V0cyB0aGUgSVB2NCBvciBJUHY2IG5ldHdvcmsgYWRkcmVzcyBvZiB0aGUgbWFjaGluZS5cbiAqXG4gKiBAZXhwZXJpbWVudGFsICoqVU5TVEFCTEUqKjogTmV3IEFQSSwgeWV0IHRvIGJlIHZldHRlZC5cblxuICpcbiAqIFRoaXMgaXMgaW5zcGlyZWQgYnkgdGhlIHV0aWwgb2YgdGhlIHNhbWUgbmFtZSBpblxuICoge0BsaW5rY29kZSBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9zZXJ2ZSB8IG5wbTpzZXJ2ZX0uXG4gKlxuICogRm9yIG1vcmUgYWR2YW5jZWQgdXNlLCB1c2Uge0BsaW5rY29kZSBEZW5vLm5ldHdvcmtJbnRlcmZhY2VzfSBkaXJlY3RseS5cbiAqXG4gKiBAc2VlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vdmVyY2VsL3NlcnZlL2Jsb2IvMWVhNTViMWI1MDA0ZjQ2ODE1OWI1NDc3NWU0ZmIzMDkwZmVkYmIyYi9zb3VyY2UvdXRpbGl0aWVzL2h0dHAudHMjTDMzfVxuICpcbiAqIEBwYXJhbSBmYW1pbHkgVGhlIElQIHByb3RvY29sIHZlcnNpb24gb2YgdGhlIGludGVyZmFjZSB0byBnZXQgdGhlIGFkZHJlc3Mgb2YuXG4gKiBAcmV0dXJucyBUaGUgSVB2NCBuZXR3b3JrIGFkZHJlc3Mgb2YgdGhlIG1hY2hpbmUgb3IgYHVuZGVmaW5lZGAgaWYgbm90IGZvdW5kLlxuICpcbiAqIEBleGFtcGxlIEdldCB0aGUgSVB2NCBuZXR3b3JrIGFkZHJlc3MgKGRlZmF1bHQpXG4gKiBgYGB0cyBuby1hc3NlcnQgaWdub3JlXG4gKiBpbXBvcnQgeyBnZXROZXR3b3JrQWRkcmVzcyB9IGZyb20gXCJAc3RkL25ldC91bnN0YWJsZS1nZXQtbmV0d29yay1hZGRyZXNzXCI7XG4gKlxuICogY29uc3QgaG9zdG5hbWUgPSBnZXROZXR3b3JrQWRkcmVzcygpITtcbiAqXG4gKiBEZW5vLnNlcnZlKHsgcG9ydDogMCwgaG9zdG5hbWUgfSwgKCkgPT4gbmV3IFJlc3BvbnNlKFwiSGVsbG8sIHdvcmxkIVwiKSk7XG4gKiBgYGBcbiAqXG4gKiBAZXhhbXBsZSBHZXQgdGhlIElQdjYgbmV0d29yayBhZGRyZXNzXG4gKiBgYGB0cyBuby1hc3NlcnQgaWdub3JlXG4gKiBpbXBvcnQgeyBnZXROZXR3b3JrQWRkcmVzcyB9IGZyb20gXCJAc3RkL25ldC91bnN0YWJsZS1nZXQtbmV0d29yay1hZGRyZXNzXCI7XG4gKlxuICogY29uc3QgaG9zdG5hbWUgPSBnZXROZXR3b3JrQWRkcmVzcyhcIklQdjZcIikhO1xuICpcbiAqIERlbm8uc2VydmUoeyBwb3J0OiAwLCBob3N0bmFtZSB9LCAoKSA9PiBuZXcgUmVzcG9uc2UoXCJIZWxsbywgd29ybGQhXCIpKTtcbiAqIGBgYFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0TmV0d29ya0FkZHJlc3MoXG4gIGZhbWlseTogRGVuby5OZXR3b3JrSW50ZXJmYWNlSW5mb1tcImZhbWlseVwiXSA9IFwiSVB2NFwiLFxuKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIERlbm8ubmV0d29ya0ludGVyZmFjZXMoKVxuICAgIC5maW5kKChpKSA9PlxuICAgICAgaS5mYW1pbHkgPT09IGZhbWlseSAmJlxuICAgICAgaS5tYWMgIT09IFwiMDA6MDA6MDA6MDA6MDA6MDBcIiAmJlxuICAgICAgKGZhbWlseSA9PT0gXCJJUHY0XCJcbiAgICAgICAgLy8gQ2Fubm90IGxpZSB3aXRoaW4gMTI3LjAuMC4wLzhcbiAgICAgICAgPyAhaS5hZGRyZXNzLnN0YXJ0c1dpdGgoXCIxMjdcIilcbiAgICAgICAgLy8gQ2Fubm90IGJlIGxvb3BiYWNrIG9yIGxpbmstbG9jYWwgYWRkcmVzc2VzXG4gICAgICAgIDogIShpLmFkZHJlc3MgPT09IFwiOjoxXCIgfHwgaS5hZGRyZXNzID09PSBcImZlODA6OjFcIikgJiYgaS5zY29wZWlkID09PSAwKVxuICAgIClcbiAgICA/LmFkZHJlc3M7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscURBQXFEO0FBQ3JEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FpQ0MsR0FDRCxPQUFPLFNBQVMsa0JBQ2QsU0FBOEMsTUFBTTtFQUVwRCxPQUFPLEtBQUssaUJBQWlCLEdBQzFCLElBQUksQ0FBQyxDQUFDLElBQ0wsRUFBRSxNQUFNLEtBQUssVUFDYixFQUFFLEdBQUcsS0FBSyx1QkFDVixDQUFDLFdBQVcsU0FFUixDQUFDLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxTQUV0QixDQUFDLENBQUMsRUFBRSxPQUFPLEtBQUssU0FBUyxFQUFFLE9BQU8sS0FBSyxTQUFTLEtBQUssRUFBRSxPQUFPLEtBQUssQ0FBQyxJQUV4RTtBQUNOIn0=
// denoCacheMetadata=6874844276359813843,15984426976630263216