// Copyright 2018-2026 the Deno authors. MIT license.
// This module is browser compatible.
/**
 * A transform stream that only transforms from the zero-indexed `start` and
 * `end` bytes (both inclusive).
 *
 * @example Basic usage
 * ```ts
 * import { ByteSliceStream } from "@std/streams/byte-slice-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const stream = ReadableStream.from([
 *   new Uint8Array([0, 1]),
 *   new Uint8Array([2, 3, 4]),
 * ]);
 * const slicedStream = stream.pipeThrough(new ByteSliceStream(1, 3));
 *
 * assertEquals(
 *   await Array.fromAsync(slicedStream),
 *  [new Uint8Array([1]), new Uint8Array([2, 3])]
 * );
 * ```
 *
 * @example Get a range of bytes from a fetch response body
 * ```ts
 * import { ByteSliceStream } from "@std/streams/byte-slice-stream";
 * import { assertEquals } from "@std/assert";
 *
 * const response = await fetch("https://example.com");
 * const rangedStream = response.body!
 *   .pipeThrough(new ByteSliceStream(3, 8));
 * const collected = await Array.fromAsync(rangedStream);
 * assertEquals(collected[0]?.length, 6);
 * ```
 */ export class ByteSliceStream extends TransformStream {
  #offsetStart = 0;
  #offsetEnd = 0;
  /**
   * Constructs a new instance.
   *
   * @param start The zero-indexed byte index to start reading from.
   * @param end The zero-indexed byte index to stop reading at. Inclusive.
   */ constructor(start = 0, end = Infinity){
    super({
      start: ()=>{
        if (start < 0) {
          throw new RangeError(`Cannot construct ByteSliceStream as start must be >= 0: received ${start}`);
        }
        end += 1;
      },
      transform: (chunk, controller)=>{
        this.#offsetStart = this.#offsetEnd;
        this.#offsetEnd += chunk.byteLength;
        if (this.#offsetEnd > start) {
          if (this.#offsetStart < start) {
            chunk = chunk.slice(start - this.#offsetStart);
          }
          if (this.#offsetEnd >= end) {
            chunk = chunk.slice(0, chunk.byteLength - this.#offsetEnd + end);
            controller.enqueue(chunk);
            controller.terminate();
          } else {
            controller.enqueue(chunk);
          }
        }
      }
    });
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vanNyLmlvL0BzdGQvc3RyZWFtcy8xLjIuMC9ieXRlX3NsaWNlX3N0cmVhbS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDI2IHRoZSBEZW5vIGF1dGhvcnMuIE1JVCBsaWNlbnNlLlxuLy8gVGhpcyBtb2R1bGUgaXMgYnJvd3NlciBjb21wYXRpYmxlLlxuXG4vKipcbiAqIEEgdHJhbnNmb3JtIHN0cmVhbSB0aGF0IG9ubHkgdHJhbnNmb3JtcyBmcm9tIHRoZSB6ZXJvLWluZGV4ZWQgYHN0YXJ0YCBhbmRcbiAqIGBlbmRgIGJ5dGVzIChib3RoIGluY2x1c2l2ZSkuXG4gKlxuICogQGV4YW1wbGUgQmFzaWMgdXNhZ2VcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBCeXRlU2xpY2VTdHJlYW0gfSBmcm9tIFwiQHN0ZC9zdHJlYW1zL2J5dGUtc2xpY2Utc3RyZWFtXCI7XG4gKiBpbXBvcnQgeyBhc3NlcnRFcXVhbHMgfSBmcm9tIFwiQHN0ZC9hc3NlcnRcIjtcbiAqXG4gKiBjb25zdCBzdHJlYW0gPSBSZWFkYWJsZVN0cmVhbS5mcm9tKFtcbiAqICAgbmV3IFVpbnQ4QXJyYXkoWzAsIDFdKSxcbiAqICAgbmV3IFVpbnQ4QXJyYXkoWzIsIDMsIDRdKSxcbiAqIF0pO1xuICogY29uc3Qgc2xpY2VkU3RyZWFtID0gc3RyZWFtLnBpcGVUaHJvdWdoKG5ldyBCeXRlU2xpY2VTdHJlYW0oMSwgMykpO1xuICpcbiAqIGFzc2VydEVxdWFscyhcbiAqICAgYXdhaXQgQXJyYXkuZnJvbUFzeW5jKHNsaWNlZFN0cmVhbSksXG4gKiAgW25ldyBVaW50OEFycmF5KFsxXSksIG5ldyBVaW50OEFycmF5KFsyLCAzXSldXG4gKiApO1xuICogYGBgXG4gKlxuICogQGV4YW1wbGUgR2V0IGEgcmFuZ2Ugb2YgYnl0ZXMgZnJvbSBhIGZldGNoIHJlc3BvbnNlIGJvZHlcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBCeXRlU2xpY2VTdHJlYW0gfSBmcm9tIFwiQHN0ZC9zdHJlYW1zL2J5dGUtc2xpY2Utc3RyZWFtXCI7XG4gKiBpbXBvcnQgeyBhc3NlcnRFcXVhbHMgfSBmcm9tIFwiQHN0ZC9hc3NlcnRcIjtcbiAqXG4gKiBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiaHR0cHM6Ly9leGFtcGxlLmNvbVwiKTtcbiAqIGNvbnN0IHJhbmdlZFN0cmVhbSA9IHJlc3BvbnNlLmJvZHkhXG4gKiAgIC5waXBlVGhyb3VnaChuZXcgQnl0ZVNsaWNlU3RyZWFtKDMsIDgpKTtcbiAqIGNvbnN0IGNvbGxlY3RlZCA9IGF3YWl0IEFycmF5LmZyb21Bc3luYyhyYW5nZWRTdHJlYW0pO1xuICogYXNzZXJ0RXF1YWxzKGNvbGxlY3RlZFswXT8ubGVuZ3RoLCA2KTtcbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgQnl0ZVNsaWNlU3RyZWFtIGV4dGVuZHMgVHJhbnNmb3JtU3RyZWFtPFVpbnQ4QXJyYXksIFVpbnQ4QXJyYXk+IHtcbiAgI29mZnNldFN0YXJ0ID0gMDtcbiAgI29mZnNldEVuZCA9IDA7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2UuXG4gICAqXG4gICAqIEBwYXJhbSBzdGFydCBUaGUgemVyby1pbmRleGVkIGJ5dGUgaW5kZXggdG8gc3RhcnQgcmVhZGluZyBmcm9tLlxuICAgKiBAcGFyYW0gZW5kIFRoZSB6ZXJvLWluZGV4ZWQgYnl0ZSBpbmRleCB0byBzdG9wIHJlYWRpbmcgYXQuIEluY2x1c2l2ZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHN0YXJ0ID0gMCwgZW5kOiBudW1iZXIgPSBJbmZpbml0eSkge1xuICAgIHN1cGVyKHtcbiAgICAgIHN0YXJ0OiAoKSA9PiB7XG4gICAgICAgIGlmIChzdGFydCA8IDApIHtcbiAgICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgICAgIGBDYW5ub3QgY29uc3RydWN0IEJ5dGVTbGljZVN0cmVhbSBhcyBzdGFydCBtdXN0IGJlID49IDA6IHJlY2VpdmVkICR7c3RhcnR9YCxcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIGVuZCArPSAxO1xuICAgICAgfSxcbiAgICAgIHRyYW5zZm9ybTogKGNodW5rLCBjb250cm9sbGVyKSA9PiB7XG4gICAgICAgIHRoaXMuI29mZnNldFN0YXJ0ID0gdGhpcy4jb2Zmc2V0RW5kO1xuICAgICAgICB0aGlzLiNvZmZzZXRFbmQgKz0gY2h1bmsuYnl0ZUxlbmd0aDtcbiAgICAgICAgaWYgKHRoaXMuI29mZnNldEVuZCA+IHN0YXJ0KSB7XG4gICAgICAgICAgaWYgKHRoaXMuI29mZnNldFN0YXJ0IDwgc3RhcnQpIHtcbiAgICAgICAgICAgIGNodW5rID0gY2h1bmsuc2xpY2Uoc3RhcnQgLSB0aGlzLiNvZmZzZXRTdGFydCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLiNvZmZzZXRFbmQgPj0gZW5kKSB7XG4gICAgICAgICAgICBjaHVuayA9IGNodW5rLnNsaWNlKDAsIGNodW5rLmJ5dGVMZW5ndGggLSB0aGlzLiNvZmZzZXRFbmQgKyBlbmQpO1xuICAgICAgICAgICAgY29udHJvbGxlci5lbnF1ZXVlKGNodW5rKTtcbiAgICAgICAgICAgIGNvbnRyb2xsZXIudGVybWluYXRlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZW5xdWV1ZShjaHVuayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscURBQXFEO0FBQ3JELHFDQUFxQztBQUVyQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FnQ0MsR0FDRCxPQUFPLE1BQU0sd0JBQXdCO0VBQ25DLENBQUEsV0FBWSxHQUFHLEVBQUU7RUFDakIsQ0FBQSxTQUFVLEdBQUcsRUFBRTtFQUVmOzs7OztHQUtDLEdBQ0QsWUFBWSxRQUFRLENBQUMsRUFBRSxNQUFjLFFBQVEsQ0FBRTtJQUM3QyxLQUFLLENBQUM7TUFDSixPQUFPO1FBQ0wsSUFBSSxRQUFRLEdBQUc7VUFDYixNQUFNLElBQUksV0FDUixDQUFDLGlFQUFpRSxFQUFFLE9BQU87UUFFL0U7UUFDQSxPQUFPO01BQ1Q7TUFDQSxXQUFXLENBQUMsT0FBTztRQUNqQixJQUFJLENBQUMsQ0FBQSxXQUFZLEdBQUcsSUFBSSxDQUFDLENBQUEsU0FBVTtRQUNuQyxJQUFJLENBQUMsQ0FBQSxTQUFVLElBQUksTUFBTSxVQUFVO1FBQ25DLElBQUksSUFBSSxDQUFDLENBQUEsU0FBVSxHQUFHLE9BQU87VUFDM0IsSUFBSSxJQUFJLENBQUMsQ0FBQSxXQUFZLEdBQUcsT0FBTztZQUM3QixRQUFRLE1BQU0sS0FBSyxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUEsV0FBWTtVQUMvQztVQUNBLElBQUksSUFBSSxDQUFDLENBQUEsU0FBVSxJQUFJLEtBQUs7WUFDMUIsUUFBUSxNQUFNLEtBQUssQ0FBQyxHQUFHLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxDQUFBLFNBQVUsR0FBRztZQUM1RCxXQUFXLE9BQU8sQ0FBQztZQUNuQixXQUFXLFNBQVM7VUFDdEIsT0FBTztZQUNMLFdBQVcsT0FBTyxDQUFDO1VBQ3JCO1FBQ0Y7TUFDRjtJQUNGO0VBQ0Y7QUFDRiJ9
// denoCacheMetadata=17368359697048466439,5723438740659673020