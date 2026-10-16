// Copyright 2018-2026 the Deno authors. MIT license.
// This module is browser compatible.
function toUint8Array(value) {
  if (value instanceof Uint8Array) {
    return value;
  }
  return ArrayBuffer.isView(value) ? new Uint8Array(value.buffer, value.byteOffset, value.byteLength) : new Uint8Array(value);
}
/**
 * When checking the values of cryptographic hashes are equal, default
 * comparisons can be susceptible to timing based attacks, where attacker is
 * able to find out information about the host system by repeatedly checking
 * response times to equality comparisons of values.
 *
 * It is likely some form of timing safe equality will make its way to the
 * WebCrypto standard (see:
 * {@link https://github.com/w3c/webcrypto/issues/270 | w3c/webcrypto#270}), but until
 * that time, `timingSafeEqual()` is provided.
 *
 * Note: This is a best-effort constant-time comparison implemented in
 * JavaScript. The V8 JIT compiler does not provide formal constant-time
 * guarantees, and inputs backed by `SharedArrayBuffer` are susceptible to
 * concurrent modification during comparison.
 *
 * @example Usage
 * ```ts
 * import { timingSafeEqual } from "@std/crypto/timing-safe-equal";
 * import { assert } from "@std/assert";
 *
 * const a = await crypto.subtle.digest(
 *   "SHA-384",
 *   new TextEncoder().encode("hello world"),
 * );
 * const b = await crypto.subtle.digest(
 *   "SHA-384",
 *   new TextEncoder().encode("hello world"),
 * );
 *
 * assert(timingSafeEqual(a, b));
 * ```
 *
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @returns `true` if the values are equal, otherwise `false`.
 * @throws {TypeError} If the byte lengths of the two buffers are not equal.
 */ export function timingSafeEqual(a, b) {
  if (a.byteLength !== b.byteLength) {
    throw new TypeError(`Cannot compare buffers of different byte lengths (${a.byteLength} vs ${b.byteLength})`);
  }
  const ua = toUint8Array(a);
  const ub = toUint8Array(b);
  const length = ua.length;
  let out = 0;
  for(let i = 0; i < length; i++){
    out |= ua[i] ^ ub[i];
  }
  return out === 0;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vanNyLmlvL0BzdGQvY3J5cHRvLzEuMS4wL3RpbWluZ19zYWZlX2VxdWFsLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAyMDE4LTIwMjYgdGhlIERlbm8gYXV0aG9ycy4gTUlUIGxpY2Vuc2UuXG4vLyBUaGlzIG1vZHVsZSBpcyBicm93c2VyIGNvbXBhdGlibGUuXG5cbmZ1bmN0aW9uIHRvVWludDhBcnJheShcbiAgdmFsdWU6IEFycmF5QnVmZmVyVmlldyB8IEFycmF5QnVmZmVyTGlrZSxcbik6IFVpbnQ4QXJyYXkge1xuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBVaW50OEFycmF5KSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJldHVybiBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsdWUpXG4gICAgPyBuZXcgVWludDhBcnJheSh2YWx1ZS5idWZmZXIsIHZhbHVlLmJ5dGVPZmZzZXQsIHZhbHVlLmJ5dGVMZW5ndGgpXG4gICAgOiBuZXcgVWludDhBcnJheSh2YWx1ZSk7XG59XG5cbi8qKlxuICogV2hlbiBjaGVja2luZyB0aGUgdmFsdWVzIG9mIGNyeXB0b2dyYXBoaWMgaGFzaGVzIGFyZSBlcXVhbCwgZGVmYXVsdFxuICogY29tcGFyaXNvbnMgY2FuIGJlIHN1c2NlcHRpYmxlIHRvIHRpbWluZyBiYXNlZCBhdHRhY2tzLCB3aGVyZSBhdHRhY2tlciBpc1xuICogYWJsZSB0byBmaW5kIG91dCBpbmZvcm1hdGlvbiBhYm91dCB0aGUgaG9zdCBzeXN0ZW0gYnkgcmVwZWF0ZWRseSBjaGVja2luZ1xuICogcmVzcG9uc2UgdGltZXMgdG8gZXF1YWxpdHkgY29tcGFyaXNvbnMgb2YgdmFsdWVzLlxuICpcbiAqIEl0IGlzIGxpa2VseSBzb21lIGZvcm0gb2YgdGltaW5nIHNhZmUgZXF1YWxpdHkgd2lsbCBtYWtlIGl0cyB3YXkgdG8gdGhlXG4gKiBXZWJDcnlwdG8gc3RhbmRhcmQgKHNlZTpcbiAqIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vdzNjL3dlYmNyeXB0by9pc3N1ZXMvMjcwIHwgdzNjL3dlYmNyeXB0byMyNzB9KSwgYnV0IHVudGlsXG4gKiB0aGF0IHRpbWUsIGB0aW1pbmdTYWZlRXF1YWwoKWAgaXMgcHJvdmlkZWQuXG4gKlxuICogTm90ZTogVGhpcyBpcyBhIGJlc3QtZWZmb3J0IGNvbnN0YW50LXRpbWUgY29tcGFyaXNvbiBpbXBsZW1lbnRlZCBpblxuICogSmF2YVNjcmlwdC4gVGhlIFY4IEpJVCBjb21waWxlciBkb2VzIG5vdCBwcm92aWRlIGZvcm1hbCBjb25zdGFudC10aW1lXG4gKiBndWFyYW50ZWVzLCBhbmQgaW5wdXRzIGJhY2tlZCBieSBgU2hhcmVkQXJyYXlCdWZmZXJgIGFyZSBzdXNjZXB0aWJsZSB0b1xuICogY29uY3VycmVudCBtb2RpZmljYXRpb24gZHVyaW5nIGNvbXBhcmlzb24uXG4gKlxuICogQGV4YW1wbGUgVXNhZ2VcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyB0aW1pbmdTYWZlRXF1YWwgfSBmcm9tIFwiQHN0ZC9jcnlwdG8vdGltaW5nLXNhZmUtZXF1YWxcIjtcbiAqIGltcG9ydCB7IGFzc2VydCB9IGZyb20gXCJAc3RkL2Fzc2VydFwiO1xuICpcbiAqIGNvbnN0IGEgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdChcbiAqICAgXCJTSEEtMzg0XCIsXG4gKiAgIG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShcImhlbGxvIHdvcmxkXCIpLFxuICogKTtcbiAqIGNvbnN0IGIgPSBhd2FpdCBjcnlwdG8uc3VidGxlLmRpZ2VzdChcbiAqICAgXCJTSEEtMzg0XCIsXG4gKiAgIG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZShcImhlbGxvIHdvcmxkXCIpLFxuICogKTtcbiAqXG4gKiBhc3NlcnQodGltaW5nU2FmZUVxdWFsKGEsIGIpKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIGIgVGhlIHNlY29uZCB2YWx1ZSB0byBjb21wYXJlLlxuICogQHJldHVybnMgYHRydWVgIGlmIHRoZSB2YWx1ZXMgYXJlIGVxdWFsLCBvdGhlcndpc2UgYGZhbHNlYC5cbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gSWYgdGhlIGJ5dGUgbGVuZ3RocyBvZiB0aGUgdHdvIGJ1ZmZlcnMgYXJlIG5vdCBlcXVhbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWluZ1NhZmVFcXVhbChcbiAgYTogQXJyYXlCdWZmZXJWaWV3IHwgQXJyYXlCdWZmZXJMaWtlLFxuICBiOiBBcnJheUJ1ZmZlclZpZXcgfCBBcnJheUJ1ZmZlckxpa2UsXG4pOiBib29sZWFuIHtcbiAgaWYgKGEuYnl0ZUxlbmd0aCAhPT0gYi5ieXRlTGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgIGBDYW5ub3QgY29tcGFyZSBidWZmZXJzIG9mIGRpZmZlcmVudCBieXRlIGxlbmd0aHMgKCR7YS5ieXRlTGVuZ3RofSB2cyAke2IuYnl0ZUxlbmd0aH0pYCxcbiAgICApO1xuICB9XG4gIGNvbnN0IHVhID0gdG9VaW50OEFycmF5KGEpO1xuICBjb25zdCB1YiA9IHRvVWludDhBcnJheShiKTtcbiAgY29uc3QgbGVuZ3RoID0gdWEubGVuZ3RoO1xuICBsZXQgb3V0ID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIG91dCB8PSB1YVtpXSEgXiB1YltpXSE7XG4gIH1cbiAgcmV0dXJuIG91dCA9PT0gMDtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxREFBcUQ7QUFDckQscUNBQXFDO0FBRXJDLFNBQVMsYUFDUCxLQUF3QztFQUV4QyxJQUFJLGlCQUFpQixZQUFZO0lBQy9CLE9BQU87RUFDVDtFQUNBLE9BQU8sWUFBWSxNQUFNLENBQUMsU0FDdEIsSUFBSSxXQUFXLE1BQU0sTUFBTSxFQUFFLE1BQU0sVUFBVSxFQUFFLE1BQU0sVUFBVSxJQUMvRCxJQUFJLFdBQVc7QUFDckI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXFDQyxHQUNELE9BQU8sU0FBUyxnQkFDZCxDQUFvQyxFQUNwQyxDQUFvQztFQUVwQyxJQUFJLEVBQUUsVUFBVSxLQUFLLEVBQUUsVUFBVSxFQUFFO0lBQ2pDLE1BQU0sSUFBSSxVQUNSLENBQUMsa0RBQWtELEVBQUUsRUFBRSxVQUFVLENBQUMsSUFBSSxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztFQUUzRjtFQUNBLE1BQU0sS0FBSyxhQUFhO0VBQ3hCLE1BQU0sS0FBSyxhQUFhO0VBQ3hCLE1BQU0sU0FBUyxHQUFHLE1BQU07RUFDeEIsSUFBSSxNQUFNO0VBQ1YsSUFBSyxJQUFJLElBQUksR0FBRyxJQUFJLFFBQVEsSUFBSztJQUMvQixPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUksRUFBRSxDQUFDLEVBQUU7RUFDdkI7RUFDQSxPQUFPLFFBQVE7QUFDakIifQ==
// denoCacheMetadata=14697778774109510448,7935447504232876585