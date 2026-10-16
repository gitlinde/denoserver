// Copyright 2018-2026 the Deno authors. MIT license.
// This module is browser compatible.
// This module is generated from {@link https://www.iana.org/assignments/http-methods/http-methods.xhtml#methods | IANA Hypertext Transfer Protocol (HTTP) Method Registry}
/**
 * HTTP Methods derived from IANA Hypertext Transfer Protocol (HTTP) Method Registry
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @see {@link https://www.iana.org/assignments/http-methods/http-methods.xhtml#methods | IANA Hypertext Transfer Protocol (HTTP) Method Registry}
 */ export const METHOD = {
  /**
   * ACL (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc3744 | RFC3744, Section 8.1}
   */ Acl: "ACL",
  /**
   * BASELINE-CONTROL (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc3253 | RFC3253, Section 12.6}
   */ BaselineControl: "BASELINE-CONTROL",
  /**
   * BIND (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc5842 | RFC5842, Section 4}
   */ Bind: "BIND",
  /**
   * CHECKIN (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc3253 | RFC3253, Section 4.4, Section 9.4}
   */ Checkin: "CHECKIN",
  /**
   * CHECKOUT (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc3253 | RFC3253, Section 4.3, Section 8.8}
   */ Checkout: "CHECKOUT",
  /**
   * CONNECT (Safe: no; Idempotent: no)
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 9.3.6}
   */ Connect: "CONNECT",
  /**
   * COPY (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC4918, Section 9.8}
   */ Copy: "COPY",
  /**
   * DELETE (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 9.3.5}
   */ Delete: "DELETE",
  /**
   * GET (Safe: yes; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 9.3.1}
   */ Get: "GET",
  /**
   * HEAD (Safe: yes; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 9.3.2}
   */ Head: "HEAD",
  /**
   * LABEL (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc3253 | RFC3253, Section 8.2}
   */ Label: "LABEL",
  /**
   * LINK (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc2068 | RFC2068, Section 19.6.1.2}
   */ Link: "LINK",
  /**
   * LOCK (Safe: no; Idempotent: no)
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC4918, Section 9.10}
   */ Lock: "LOCK",
  /**
   * MERGE (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc3253 | RFC3253, Section 11.2}
   */ Merge: "MERGE",
  /**
   * MKACTIVITY (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc3253 | RFC3253, Section 13.5}
   */ Mkactivity: "MKACTIVITY",
  /**
   * MKCALENDAR (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc4791 | RFC4791, Section 5.3.1}
   * @see {@link https://www.iana.org/go/rfc8144 | RFC8144, Section 2.3}
   */ Mkcalendar: "MKCALENDAR",
  /**
   * MKCOL (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC4918, Section 9.3}
   * @see {@link https://www.iana.org/go/rfc5689 | RFC5689, Section 3}
   * @see {@link https://www.iana.org/go/rfc8144 | RFC8144, Section 2.3}
   */ Mkcol: "MKCOL",
  /**
   * MKREDIRECTREF (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc4437 | RFC4437, Section 6}
   */ Mkredirectref: "MKREDIRECTREF",
  /**
   * MKWORKSPACE (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc3253 | RFC3253, Section 6.3}
   */ Mkworkspace: "MKWORKSPACE",
  /**
   * MOVE (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC4918, Section 9.9}
   */ Move: "MOVE",
  /**
   * OPTIONS (Safe: yes; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 9.3.7}
   */ Options: "OPTIONS",
  /**
   * ORDERPATCH (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc3648 | RFC3648, Section 7}
   */ Orderpatch: "ORDERPATCH",
  /**
   * PATCH (Safe: no; Idempotent: no)
   *
   * @see {@link https://www.iana.org/go/rfc5789 | RFC5789, Section 2}
   */ Patch: "PATCH",
  /**
   * POST (Safe: no; Idempotent: no)
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 9.3.3}
   */ Post: "POST",
  /**
   * PRI (Safe: yes; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc9113 | RFC9113, Section 3.4}
   */ Pri: "PRI",
  /**
   * PROPFIND (Safe: yes; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC4918, Section 9.1}
   * @see {@link https://www.iana.org/go/rfc8144 | RFC8144, Section 2.1}
   */ Propfind: "PROPFIND",
  /**
   * PROPPATCH (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC4918, Section 9.2}
   * @see {@link https://www.iana.org/go/rfc8144 | RFC8144, Section 2.2}
   */ Proppatch: "PROPPATCH",
  /**
   * PUT (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 9.3.4}
   */ Put: "PUT",
  /**
   * REBIND (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc5842 | RFC5842, Section 6}
   */ Rebind: "REBIND",
  /**
   * REPORT (Safe: yes; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc3253 | RFC3253, Section 3.6}
   * @see {@link https://www.iana.org/go/rfc8144 | RFC8144, Section 2.1}
   */ Report: "REPORT",
  /**
   * SEARCH (Safe: yes; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc5323 | RFC5323, Section 2}
   */ Search: "SEARCH",
  /**
   * TRACE (Safe: yes; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 9.3.8}
   */ Trace: "TRACE",
  /**
   * UNBIND (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc5842 | RFC5842, Section 5}
   */ Unbind: "UNBIND",
  /**
   * UNCHECKOUT (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc3253 | RFC3253, Section 4.5}
   */ Uncheckout: "UNCHECKOUT",
  /**
   * UNLINK (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc2068 | RFC2068, Section 19.6.1.3}
   */ Unlink: "UNLINK",
  /**
   * UNLOCK (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC4918, Section 9.11}
   */ Unlock: "UNLOCK",
  /**
   * UPDATE (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc3253 | RFC3253, Section 7.1}
   */ Update: "UPDATE",
  /**
   * UPDATEREDIRECTREF (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc4437 | RFC4437, Section 7}
   */ Updateredirectref: "UPDATEREDIRECTREF",
  /**
   * VERSION-CONTROL (Safe: no; Idempotent: yes)
   *
   * @see {@link https://www.iana.org/go/rfc3253 | RFC3253, Section 3.5}
   */ VersionControl: "VERSION-CONTROL"
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vanNyLmlvL0BzdGQvaHR0cC8xLjEuNC91bnN0YWJsZV9tZXRob2QudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyNiB0aGUgRGVubyBhdXRob3JzLiBNSVQgbGljZW5zZS5cbi8vIFRoaXMgbW9kdWxlIGlzIGJyb3dzZXIgY29tcGF0aWJsZS5cbi8vIFRoaXMgbW9kdWxlIGlzIGdlbmVyYXRlZCBmcm9tIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9hc3NpZ25tZW50cy9odHRwLW1ldGhvZHMvaHR0cC1tZXRob2RzLnhodG1sI21ldGhvZHMgfCBJQU5BIEh5cGVydGV4dCBUcmFuc2ZlciBQcm90b2NvbCAoSFRUUCkgTWV0aG9kIFJlZ2lzdHJ5fVxuXG4vKipcbiAqIEhUVFAgTWV0aG9kcyBkZXJpdmVkIGZyb20gSUFOQSBIeXBlcnRleHQgVHJhbnNmZXIgUHJvdG9jb2wgKEhUVFApIE1ldGhvZCBSZWdpc3RyeVxuICpcbiAqIEBleHBlcmltZW50YWwgKipVTlNUQUJMRSoqOiBOZXcgQVBJLCB5ZXQgdG8gYmUgdmV0dGVkLlxuICpcbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2Fzc2lnbm1lbnRzL2h0dHAtbWV0aG9kcy9odHRwLW1ldGhvZHMueGh0bWwjbWV0aG9kcyB8IElBTkEgSHlwZXJ0ZXh0IFRyYW5zZmVyIFByb3RvY29sIChIVFRQKSBNZXRob2QgUmVnaXN0cnl9XG4gKi9cbmV4cG9ydCBjb25zdCBNRVRIT0QgPSB7XG4gIC8qKlxuICAgKiBBQ0wgKFNhZmU6IG5vOyBJZGVtcG90ZW50OiB5ZXMpXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzM3NDQgfCBSRkMzNzQ0LCBTZWN0aW9uIDguMX1cbiAgICovXG4gIEFjbDogXCJBQ0xcIixcblxuICAvKipcbiAgICogQkFTRUxJTkUtQ09OVFJPTCAoU2FmZTogbm87IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjMzI1MyB8IFJGQzMyNTMsIFNlY3Rpb24gMTIuNn1cbiAgICovXG4gIEJhc2VsaW5lQ29udHJvbDogXCJCQVNFTElORS1DT05UUk9MXCIsXG5cbiAgLyoqXG4gICAqIEJJTkQgKFNhZmU6IG5vOyBJZGVtcG90ZW50OiB5ZXMpXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzU4NDIgfCBSRkM1ODQyLCBTZWN0aW9uIDR9XG4gICAqL1xuICBCaW5kOiBcIkJJTkRcIixcblxuICAvKipcbiAgICogQ0hFQ0tJTiAoU2FmZTogbm87IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjMzI1MyB8IFJGQzMyNTMsIFNlY3Rpb24gNC40LCBTZWN0aW9uIDkuNH1cbiAgICovXG4gIENoZWNraW46IFwiQ0hFQ0tJTlwiLFxuXG4gIC8qKlxuICAgKiBDSEVDS09VVCAoU2FmZTogbm87IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjMzI1MyB8IFJGQzMyNTMsIFNlY3Rpb24gNC4zLCBTZWN0aW9uIDguOH1cbiAgICovXG4gIENoZWNrb3V0OiBcIkNIRUNLT1VUXCIsXG5cbiAgLyoqXG4gICAqIENPTk5FQ1QgKFNhZmU6IG5vOyBJZGVtcG90ZW50OiBubylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gOS4zLjZ9XG4gICAqL1xuICBDb25uZWN0OiBcIkNPTk5FQ1RcIixcblxuICAvKipcbiAgICogQ09QWSAoU2FmZTogbm87IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNDkxOCB8IFJGQzQ5MTgsIFNlY3Rpb24gOS44fVxuICAgKi9cbiAgQ29weTogXCJDT1BZXCIsXG5cbiAgLyoqXG4gICAqIERFTEVURSAoU2FmZTogbm87IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gOS4zLjV9XG4gICAqL1xuICBEZWxldGU6IFwiREVMRVRFXCIsXG5cbiAgLyoqXG4gICAqIEdFVCAoU2FmZTogeWVzOyBJZGVtcG90ZW50OiB5ZXMpXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTAgfCBSRkM5MTEwLCBTZWN0aW9uIDkuMy4xfVxuICAgKi9cbiAgR2V0OiBcIkdFVFwiLFxuXG4gIC8qKlxuICAgKiBIRUFEIChTYWZlOiB5ZXM7IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gOS4zLjJ9XG4gICAqL1xuICBIZWFkOiBcIkhFQURcIixcblxuICAvKipcbiAgICogTEFCRUwgKFNhZmU6IG5vOyBJZGVtcG90ZW50OiB5ZXMpXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzMyNTMgfCBSRkMzMjUzLCBTZWN0aW9uIDguMn1cbiAgICovXG4gIExhYmVsOiBcIkxBQkVMXCIsXG5cbiAgLyoqXG4gICAqIExJTksgKFNhZmU6IG5vOyBJZGVtcG90ZW50OiB5ZXMpXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzIwNjggfCBSRkMyMDY4LCBTZWN0aW9uIDE5LjYuMS4yfVxuICAgKi9cbiAgTGluazogXCJMSU5LXCIsXG5cbiAgLyoqXG4gICAqIExPQ0sgKFNhZmU6IG5vOyBJZGVtcG90ZW50OiBubylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNDkxOCB8IFJGQzQ5MTgsIFNlY3Rpb24gOS4xMH1cbiAgICovXG4gIExvY2s6IFwiTE9DS1wiLFxuXG4gIC8qKlxuICAgKiBNRVJHRSAoU2FmZTogbm87IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjMzI1MyB8IFJGQzMyNTMsIFNlY3Rpb24gMTEuMn1cbiAgICovXG4gIE1lcmdlOiBcIk1FUkdFXCIsXG5cbiAgLyoqXG4gICAqIE1LQUNUSVZJVFkgKFNhZmU6IG5vOyBJZGVtcG90ZW50OiB5ZXMpXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzMyNTMgfCBSRkMzMjUzLCBTZWN0aW9uIDEzLjV9XG4gICAqL1xuICBNa2FjdGl2aXR5OiBcIk1LQUNUSVZJVFlcIixcblxuICAvKipcbiAgICogTUtDQUxFTkRBUiAoU2FmZTogbm87IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNDc5MSB8IFJGQzQ3OTEsIFNlY3Rpb24gNS4zLjF9XG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzgxNDQgfCBSRkM4MTQ0LCBTZWN0aW9uIDIuM31cbiAgICovXG4gIE1rY2FsZW5kYXI6IFwiTUtDQUxFTkRBUlwiLFxuXG4gIC8qKlxuICAgKiBNS0NPTCAoU2FmZTogbm87IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNDkxOCB8IFJGQzQ5MTgsIFNlY3Rpb24gOS4zfVxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM1Njg5IHwgUkZDNTY4OSwgU2VjdGlvbiAzfVxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM4MTQ0IHwgUkZDODE0NCwgU2VjdGlvbiAyLjN9XG4gICAqL1xuICBNa2NvbDogXCJNS0NPTFwiLFxuXG4gIC8qKlxuICAgKiBNS1JFRElSRUNUUkVGIChTYWZlOiBubzsgSWRlbXBvdGVudDogeWVzKVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM0NDM3IHwgUkZDNDQzNywgU2VjdGlvbiA2fVxuICAgKi9cbiAgTWtyZWRpcmVjdHJlZjogXCJNS1JFRElSRUNUUkVGXCIsXG5cbiAgLyoqXG4gICAqIE1LV09SS1NQQUNFIChTYWZlOiBubzsgSWRlbXBvdGVudDogeWVzKVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmMzMjUzIHwgUkZDMzI1MywgU2VjdGlvbiA2LjN9XG4gICAqL1xuICBNa3dvcmtzcGFjZTogXCJNS1dPUktTUEFDRVwiLFxuXG4gIC8qKlxuICAgKiBNT1ZFIChTYWZlOiBubzsgSWRlbXBvdGVudDogeWVzKVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM0OTE4IHwgUkZDNDkxOCwgU2VjdGlvbiA5Ljl9XG4gICAqL1xuICBNb3ZlOiBcIk1PVkVcIixcblxuICAvKipcbiAgICogT1BUSU9OUyAoU2FmZTogeWVzOyBJZGVtcG90ZW50OiB5ZXMpXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTAgfCBSRkM5MTEwLCBTZWN0aW9uIDkuMy43fVxuICAgKi9cbiAgT3B0aW9uczogXCJPUFRJT05TXCIsXG5cbiAgLyoqXG4gICAqIE9SREVSUEFUQ0ggKFNhZmU6IG5vOyBJZGVtcG90ZW50OiB5ZXMpXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzM2NDggfCBSRkMzNjQ4LCBTZWN0aW9uIDd9XG4gICAqL1xuICBPcmRlcnBhdGNoOiBcIk9SREVSUEFUQ0hcIixcblxuICAvKipcbiAgICogUEFUQ0ggKFNhZmU6IG5vOyBJZGVtcG90ZW50OiBubylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNTc4OSB8IFJGQzU3ODksIFNlY3Rpb24gMn1cbiAgICovXG4gIFBhdGNoOiBcIlBBVENIXCIsXG5cbiAgLyoqXG4gICAqIFBPU1QgKFNhZmU6IG5vOyBJZGVtcG90ZW50OiBubylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gOS4zLjN9XG4gICAqL1xuICBQb3N0OiBcIlBPU1RcIixcblxuICAvKipcbiAgICogUFJJIChTYWZlOiB5ZXM7IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMyB8IFJGQzkxMTMsIFNlY3Rpb24gMy40fVxuICAgKi9cbiAgUHJpOiBcIlBSSVwiLFxuXG4gIC8qKlxuICAgKiBQUk9QRklORCAoU2FmZTogeWVzOyBJZGVtcG90ZW50OiB5ZXMpXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzQ5MTggfCBSRkM0OTE4LCBTZWN0aW9uIDkuMX1cbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjODE0NCB8IFJGQzgxNDQsIFNlY3Rpb24gMi4xfVxuICAgKi9cbiAgUHJvcGZpbmQ6IFwiUFJPUEZJTkRcIixcblxuICAvKipcbiAgICogUFJPUFBBVENIIChTYWZlOiBubzsgSWRlbXBvdGVudDogeWVzKVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM0OTE4IHwgUkZDNDkxOCwgU2VjdGlvbiA5LjJ9XG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzgxNDQgfCBSRkM4MTQ0LCBTZWN0aW9uIDIuMn1cbiAgICovXG4gIFByb3BwYXRjaDogXCJQUk9QUEFUQ0hcIixcblxuICAvKipcbiAgICogUFVUIChTYWZlOiBubzsgSWRlbXBvdGVudDogeWVzKVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiA5LjMuNH1cbiAgICovXG4gIFB1dDogXCJQVVRcIixcblxuICAvKipcbiAgICogUkVCSU5EIChTYWZlOiBubzsgSWRlbXBvdGVudDogeWVzKVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM1ODQyIHwgUkZDNTg0MiwgU2VjdGlvbiA2fVxuICAgKi9cbiAgUmViaW5kOiBcIlJFQklORFwiLFxuXG4gIC8qKlxuICAgKiBSRVBPUlQgKFNhZmU6IHllczsgSWRlbXBvdGVudDogeWVzKVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmMzMjUzIHwgUkZDMzI1MywgU2VjdGlvbiAzLjZ9XG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzgxNDQgfCBSRkM4MTQ0LCBTZWN0aW9uIDIuMX1cbiAgICovXG4gIFJlcG9ydDogXCJSRVBPUlRcIixcblxuICAvKipcbiAgICogU0VBUkNIIChTYWZlOiB5ZXM7IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNTMyMyB8IFJGQzUzMjMsIFNlY3Rpb24gMn1cbiAgICovXG4gIFNlYXJjaDogXCJTRUFSQ0hcIixcblxuICAvKipcbiAgICogVFJBQ0UgKFNhZmU6IHllczsgSWRlbXBvdGVudDogeWVzKVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiA5LjMuOH1cbiAgICovXG4gIFRyYWNlOiBcIlRSQUNFXCIsXG5cbiAgLyoqXG4gICAqIFVOQklORCAoU2FmZTogbm87IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNTg0MiB8IFJGQzU4NDIsIFNlY3Rpb24gNX1cbiAgICovXG4gIFVuYmluZDogXCJVTkJJTkRcIixcblxuICAvKipcbiAgICogVU5DSEVDS09VVCAoU2FmZTogbm87IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjMzI1MyB8IFJGQzMyNTMsIFNlY3Rpb24gNC41fVxuICAgKi9cbiAgVW5jaGVja291dDogXCJVTkNIRUNLT1VUXCIsXG5cbiAgLyoqXG4gICAqIFVOTElOSyAoU2FmZTogbm87IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjMjA2OCB8IFJGQzIwNjgsIFNlY3Rpb24gMTkuNi4xLjN9XG4gICAqL1xuICBVbmxpbms6IFwiVU5MSU5LXCIsXG5cbiAgLyoqXG4gICAqIFVOTE9DSyAoU2FmZTogbm87IElkZW1wb3RlbnQ6IHllcylcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNDkxOCB8IFJGQzQ5MTgsIFNlY3Rpb24gOS4xMX1cbiAgICovXG4gIFVubG9jazogXCJVTkxPQ0tcIixcblxuICAvKipcbiAgICogVVBEQVRFIChTYWZlOiBubzsgSWRlbXBvdGVudDogeWVzKVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmMzMjUzIHwgUkZDMzI1MywgU2VjdGlvbiA3LjF9XG4gICAqL1xuICBVcGRhdGU6IFwiVVBEQVRFXCIsXG5cbiAgLyoqXG4gICAqIFVQREFURVJFRElSRUNUUkVGIChTYWZlOiBubzsgSWRlbXBvdGVudDogeWVzKVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM0NDM3IHwgUkZDNDQzNywgU2VjdGlvbiA3fVxuICAgKi9cbiAgVXBkYXRlcmVkaXJlY3RyZWY6IFwiVVBEQVRFUkVESVJFQ1RSRUZcIixcblxuICAvKipcbiAgICogVkVSU0lPTi1DT05UUk9MIChTYWZlOiBubzsgSWRlbXBvdGVudDogeWVzKVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmMzMjUzIHwgUkZDMzI1MywgU2VjdGlvbiAzLjV9XG4gICAqL1xuICBWZXJzaW9uQ29udHJvbDogXCJWRVJTSU9OLUNPTlRST0xcIixcbn0gYXMgY29uc3Q7XG5cbi8qKlxuICogQSBIVFRQIE1ldGhvZFxuICpcbiAqIEBleHBlcmltZW50YWwgKipVTlNUQUJMRSoqOiBOZXcgQVBJLCB5ZXQgdG8gYmUgdmV0dGVkLlxuICovXG5leHBvcnQgdHlwZSBNZXRob2QgPSB0eXBlb2YgTUVUSE9EW2tleW9mIHR5cGVvZiBNRVRIT0RdO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFEQUFxRDtBQUNyRCxxQ0FBcUM7QUFDckMsMktBQTJLO0FBRTNLOzs7Ozs7Q0FNQyxHQUNELE9BQU8sTUFBTSxTQUFTO0VBQ3BCOzs7O0dBSUMsR0FDRCxLQUFLO0VBRUw7Ozs7R0FJQyxHQUNELGlCQUFpQjtFQUVqQjs7OztHQUlDLEdBQ0QsTUFBTTtFQUVOOzs7O0dBSUMsR0FDRCxTQUFTO0VBRVQ7Ozs7R0FJQyxHQUNELFVBQVU7RUFFVjs7OztHQUlDLEdBQ0QsU0FBUztFQUVUOzs7O0dBSUMsR0FDRCxNQUFNO0VBRU47Ozs7R0FJQyxHQUNELFFBQVE7RUFFUjs7OztHQUlDLEdBQ0QsS0FBSztFQUVMOzs7O0dBSUMsR0FDRCxNQUFNO0VBRU47Ozs7R0FJQyxHQUNELE9BQU87RUFFUDs7OztHQUlDLEdBQ0QsTUFBTTtFQUVOOzs7O0dBSUMsR0FDRCxNQUFNO0VBRU47Ozs7R0FJQyxHQUNELE9BQU87RUFFUDs7OztHQUlDLEdBQ0QsWUFBWTtFQUVaOzs7OztHQUtDLEdBQ0QsWUFBWTtFQUVaOzs7Ozs7R0FNQyxHQUNELE9BQU87RUFFUDs7OztHQUlDLEdBQ0QsZUFBZTtFQUVmOzs7O0dBSUMsR0FDRCxhQUFhO0VBRWI7Ozs7R0FJQyxHQUNELE1BQU07RUFFTjs7OztHQUlDLEdBQ0QsU0FBUztFQUVUOzs7O0dBSUMsR0FDRCxZQUFZO0VBRVo7Ozs7R0FJQyxHQUNELE9BQU87RUFFUDs7OztHQUlDLEdBQ0QsTUFBTTtFQUVOOzs7O0dBSUMsR0FDRCxLQUFLO0VBRUw7Ozs7O0dBS0MsR0FDRCxVQUFVO0VBRVY7Ozs7O0dBS0MsR0FDRCxXQUFXO0VBRVg7Ozs7R0FJQyxHQUNELEtBQUs7RUFFTDs7OztHQUlDLEdBQ0QsUUFBUTtFQUVSOzs7OztHQUtDLEdBQ0QsUUFBUTtFQUVSOzs7O0dBSUMsR0FDRCxRQUFRO0VBRVI7Ozs7R0FJQyxHQUNELE9BQU87RUFFUDs7OztHQUlDLEdBQ0QsUUFBUTtFQUVSOzs7O0dBSUMsR0FDRCxZQUFZO0VBRVo7Ozs7R0FJQyxHQUNELFFBQVE7RUFFUjs7OztHQUlDLEdBQ0QsUUFBUTtFQUVSOzs7O0dBSUMsR0FDRCxRQUFRO0VBRVI7Ozs7R0FJQyxHQUNELG1CQUFtQjtFQUVuQjs7OztHQUlDLEdBQ0QsZ0JBQWdCO0FBQ2xCLEVBQVcifQ==
// denoCacheMetadata=2895105973693570092,16648469164254126186