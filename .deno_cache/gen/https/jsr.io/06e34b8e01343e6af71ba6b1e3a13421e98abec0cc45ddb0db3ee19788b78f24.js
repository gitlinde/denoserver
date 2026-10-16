// Copyright 2018-2026 the Deno authors. MIT license.
// This module is browser compatible.
/** Object structure for a list of HTML entities. */ const rawToEntityEntries = [
  [
    "&",
    "&amp;"
  ],
  [
    "<",
    "&lt;"
  ],
  [
    ">",
    "&gt;"
  ],
  [
    '"',
    "&quot;"
  ],
  [
    "'",
    "&#39;"
  ]
];
const defaultEntityList = Object.fromEntries([
  ...rawToEntityEntries.map(([raw, entity])=>[
      entity,
      raw
    ]),
  [
    "&apos;",
    "'"
  ],
  [
    "&nbsp;",
    "\xa0"
  ]
]);
const rawToEntity = new Map(rawToEntityEntries);
const rawRe = new RegExp(`[${[
  ...rawToEntity.keys()
].join("")}]`, "g");
/**
 * Escapes text for safe interpolation into HTML text content and quoted attributes.
 *
 * @example Usage
 * ```ts
 * import { escape } from "@std/html/entities";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(escape("<>'&AA"), "&lt;&gt;&#39;&amp;AA");
 *
 * // Characters that don't need to be escaped will be left alone,
 * // even if named HTML entities exist for them.
 * assertEquals(escape("þð"), "þð");
 * ```
 *
 * @param str The string to escape.
 * @returns The escaped string.
 */ export function escape(str) {
  return str.replaceAll(rawRe, (m)=>rawToEntity.get(m));
}
const defaultUnescapeOptions = {
  entityList: defaultEntityList
};
const MAX_CODE_POINT = 0x10ffff;
const DEC_ENTITY_REGEXP = /&#([0-9]+);/g;
const HEX_ENTITY_REGEXP = /&#x(\p{AHex}+);/gu;
const entityListRegexCache = new WeakMap();
/**
 * Unescapes HTML entities in text.
 *
 * Default options only handle `&<>'"` and numeric entities.
 *
 * @example Basic usage
 * ```ts
 * import { unescape } from "@std/html/entities";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(unescape("&lt;&gt;&#39;&amp;AA"), "<>'&AA");
 * assertEquals(unescape("&thorn;&eth;"), "&thorn;&eth;");
 * ```
 *
 * @example Using a custom entity list
 *
 * This uses the full named entity list from the HTML spec (~47K un-minified)
 *
 * ```ts
 * import { unescape } from "@std/html/entities";
 * import entityList from "@std/html/named-entity-list.json" with { type: "json" };
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(unescape("&lt;&gt;&#39;&amp;AA", { entityList }), "<>'&AA");
 * ```
 *
 * @param str The string to unescape.
 * @param options Options for unescaping.
 * @returns The unescaped string.
 */ export function unescape(str, options = {}) {
  const { entityList } = {
    ...defaultUnescapeOptions,
    ...options
  };
  let entityRe = entityListRegexCache.get(entityList);
  if (!entityRe) {
    entityRe = new RegExp(`(${Object.keys(entityList).sort((a, b)=>b.length - a.length).join("|")})`, "g");
    entityListRegexCache.set(entityList, entityRe);
  }
  return str.replaceAll(entityRe, (m)=>entityList[m]).replaceAll(DEC_ENTITY_REGEXP, (_, dec)=>codePointStrToChar(dec, 10)).replaceAll(HEX_ENTITY_REGEXP, (_, hex)=>codePointStrToChar(hex, 16));
}
function codePointStrToChar(codePointStr, radix) {
  const codePoint = parseInt(codePointStr, radix);
  return codePoint > MAX_CODE_POINT ? "�" : String.fromCodePoint(codePoint);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vanNyLmlvL0BzdGQvaHRtbC8xLjAuNy9lbnRpdGllcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgMjAxOC0yMDI2IHRoZSBEZW5vIGF1dGhvcnMuIE1JVCBsaWNlbnNlLlxuLy8gVGhpcyBtb2R1bGUgaXMgYnJvd3NlciBjb21wYXRpYmxlLlxuXG4vKiogT2JqZWN0IHN0cnVjdHVyZSBmb3IgYSBsaXN0IG9mIEhUTUwgZW50aXRpZXMuICovXG5leHBvcnQgdHlwZSBFbnRpdHlMaXN0ID0gUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcblxuY29uc3QgcmF3VG9FbnRpdHlFbnRyaWVzID0gW1xuICBbXCImXCIsIFwiJmFtcDtcIl0sXG4gIFtcIjxcIiwgXCImbHQ7XCJdLFxuICBbXCI+XCIsIFwiJmd0O1wiXSxcbiAgWydcIicsIFwiJnF1b3Q7XCJdLFxuICBbXCInXCIsIFwiJiMzOTtcIl0sXG5dIGFzIGNvbnN0O1xuXG5jb25zdCBkZWZhdWx0RW50aXR5TGlzdDogRW50aXR5TGlzdCA9IE9iamVjdC5mcm9tRW50cmllcyhbXG4gIC4uLnJhd1RvRW50aXR5RW50cmllcy5tYXAoKFtyYXcsIGVudGl0eV0pID0+IFtlbnRpdHksIHJhd10pLFxuICBbXCImYXBvcztcIiwgXCInXCJdLFxuICBbXCImbmJzcDtcIiwgXCJcXHhhMFwiXSxcbl0pO1xuXG5jb25zdCByYXdUb0VudGl0eSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KHJhd1RvRW50aXR5RW50cmllcyk7XG5cbmNvbnN0IHJhd1JlID0gbmV3IFJlZ0V4cChgWyR7Wy4uLnJhd1RvRW50aXR5LmtleXMoKV0uam9pbihcIlwiKX1dYCwgXCJnXCIpO1xuXG4vKipcbiAqIEVzY2FwZXMgdGV4dCBmb3Igc2FmZSBpbnRlcnBvbGF0aW9uIGludG8gSFRNTCB0ZXh0IGNvbnRlbnQgYW5kIHF1b3RlZCBhdHRyaWJ1dGVzLlxuICpcbiAqIEBleGFtcGxlIFVzYWdlXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgZXNjYXBlIH0gZnJvbSBcIkBzdGQvaHRtbC9lbnRpdGllc1wiO1xuICogaW1wb3J0IHsgYXNzZXJ0RXF1YWxzIH0gZnJvbSBcIkBzdGQvYXNzZXJ0XCI7XG4gKlxuICogYXNzZXJ0RXF1YWxzKGVzY2FwZShcIjw+JyZBQVwiKSwgXCImbHQ7Jmd0OyYjMzk7JmFtcDtBQVwiKTtcbiAqXG4gKiAvLyBDaGFyYWN0ZXJzIHRoYXQgZG9uJ3QgbmVlZCB0byBiZSBlc2NhcGVkIHdpbGwgYmUgbGVmdCBhbG9uZSxcbiAqIC8vIGV2ZW4gaWYgbmFtZWQgSFRNTCBlbnRpdGllcyBleGlzdCBmb3IgdGhlbS5cbiAqIGFzc2VydEVxdWFscyhlc2NhcGUoXCLDvsOwXCIpLCBcIsO+w7BcIik7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gc3RyIFRoZSBzdHJpbmcgdG8gZXNjYXBlLlxuICogQHJldHVybnMgVGhlIGVzY2FwZWQgc3RyaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlKHN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlQWxsKHJhd1JlLCAobSkgPT4gcmF3VG9FbnRpdHkuZ2V0KG0pISk7XG59XG5cbi8qKiBPcHRpb25zIGZvciB7QGxpbmtjb2RlIHVuZXNjYXBlfS4gKi9cbmV4cG9ydCB0eXBlIFVuZXNjYXBlT3B0aW9ucyA9IHsgZW50aXR5TGlzdDogRW50aXR5TGlzdCB9O1xuXG5jb25zdCBkZWZhdWx0VW5lc2NhcGVPcHRpb25zOiBVbmVzY2FwZU9wdGlvbnMgPSB7XG4gIGVudGl0eUxpc3Q6IGRlZmF1bHRFbnRpdHlMaXN0LFxufTtcblxuY29uc3QgTUFYX0NPREVfUE9JTlQgPSAweDEwZmZmZjtcblxuY29uc3QgREVDX0VOVElUWV9SRUdFWFAgPSAvJiMoWzAtOV0rKTsvZztcbmNvbnN0IEhFWF9FTlRJVFlfUkVHRVhQID0gLyYjeChcXHB7QUhleH0rKTsvZ3U7XG5cbmNvbnN0IGVudGl0eUxpc3RSZWdleENhY2hlID0gbmV3IFdlYWtNYXA8RW50aXR5TGlzdCwgUmVnRXhwPigpO1xuXG4vKipcbiAqIFVuZXNjYXBlcyBIVE1MIGVudGl0aWVzIGluIHRleHQuXG4gKlxuICogRGVmYXVsdCBvcHRpb25zIG9ubHkgaGFuZGxlIGAmPD4nXCJgIGFuZCBudW1lcmljIGVudGl0aWVzLlxuICpcbiAqIEBleGFtcGxlIEJhc2ljIHVzYWdlXG4gKiBgYGB0c1xuICogaW1wb3J0IHsgdW5lc2NhcGUgfSBmcm9tIFwiQHN0ZC9odG1sL2VudGl0aWVzXCI7XG4gKiBpbXBvcnQgeyBhc3NlcnRFcXVhbHMgfSBmcm9tIFwiQHN0ZC9hc3NlcnRcIjtcbiAqXG4gKiBhc3NlcnRFcXVhbHModW5lc2NhcGUoXCImbHQ7Jmd0OyYjMzk7JmFtcDtBQVwiKSwgXCI8PicmQUFcIik7XG4gKiBhc3NlcnRFcXVhbHModW5lc2NhcGUoXCImdGhvcm47JmV0aDtcIiksIFwiJnRob3JuOyZldGg7XCIpO1xuICogYGBgXG4gKlxuICogQGV4YW1wbGUgVXNpbmcgYSBjdXN0b20gZW50aXR5IGxpc3RcbiAqXG4gKiBUaGlzIHVzZXMgdGhlIGZ1bGwgbmFtZWQgZW50aXR5IGxpc3QgZnJvbSB0aGUgSFRNTCBzcGVjICh+NDdLIHVuLW1pbmlmaWVkKVxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyB1bmVzY2FwZSB9IGZyb20gXCJAc3RkL2h0bWwvZW50aXRpZXNcIjtcbiAqIGltcG9ydCBlbnRpdHlMaXN0IGZyb20gXCJAc3RkL2h0bWwvbmFtZWQtZW50aXR5LWxpc3QuanNvblwiIHdpdGggeyB0eXBlOiBcImpzb25cIiB9O1xuICogaW1wb3J0IHsgYXNzZXJ0RXF1YWxzIH0gZnJvbSBcIkBzdGQvYXNzZXJ0XCI7XG4gKlxuICogYXNzZXJ0RXF1YWxzKHVuZXNjYXBlKFwiJmx0OyZndDsmIzM5OyZhbXA7QUFcIiwgeyBlbnRpdHlMaXN0IH0pLCBcIjw+JyZBQVwiKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSBzdHIgVGhlIHN0cmluZyB0byB1bmVzY2FwZS5cbiAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHVuZXNjYXBpbmcuXG4gKiBAcmV0dXJucyBUaGUgdW5lc2NhcGVkIHN0cmluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuZXNjYXBlKFxuICBzdHI6IHN0cmluZyxcbiAgb3B0aW9uczogUGFydGlhbDxVbmVzY2FwZU9wdGlvbnM+ID0ge30sXG4pOiBzdHJpbmcge1xuICBjb25zdCB7IGVudGl0eUxpc3QgfSA9IHsgLi4uZGVmYXVsdFVuZXNjYXBlT3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuXG4gIGxldCBlbnRpdHlSZSA9IGVudGl0eUxpc3RSZWdleENhY2hlLmdldChlbnRpdHlMaXN0KTtcblxuICBpZiAoIWVudGl0eVJlKSB7XG4gICAgZW50aXR5UmUgPSBuZXcgUmVnRXhwKFxuICAgICAgYCgke1xuICAgICAgICBPYmplY3Qua2V5cyhlbnRpdHlMaXN0KVxuICAgICAgICAgIC5zb3J0KChhLCBiKSA9PiBiLmxlbmd0aCAtIGEubGVuZ3RoKVxuICAgICAgICAgIC5qb2luKFwifFwiKVxuICAgICAgfSlgLFxuICAgICAgXCJnXCIsXG4gICAgKTtcblxuICAgIGVudGl0eUxpc3RSZWdleENhY2hlLnNldChlbnRpdHlMaXN0LCBlbnRpdHlSZSk7XG4gIH1cblxuICByZXR1cm4gc3RyXG4gICAgLnJlcGxhY2VBbGwoZW50aXR5UmUsIChtKSA9PiBlbnRpdHlMaXN0W21dISlcbiAgICAucmVwbGFjZUFsbChERUNfRU5USVRZX1JFR0VYUCwgKF8sIGRlYykgPT4gY29kZVBvaW50U3RyVG9DaGFyKGRlYywgMTApKVxuICAgIC5yZXBsYWNlQWxsKEhFWF9FTlRJVFlfUkVHRVhQLCAoXywgaGV4KSA9PiBjb2RlUG9pbnRTdHJUb0NoYXIoaGV4LCAxNikpO1xufVxuXG5mdW5jdGlvbiBjb2RlUG9pbnRTdHJUb0NoYXIoY29kZVBvaW50U3RyOiBzdHJpbmcsIHJhZGl4OiBudW1iZXIpIHtcbiAgY29uc3QgY29kZVBvaW50ID0gcGFyc2VJbnQoY29kZVBvaW50U3RyLCByYWRpeCk7XG5cbiAgcmV0dXJuIGNvZGVQb2ludCA+IE1BWF9DT0RFX1BPSU5UID8gXCLvv71cIiA6IFN0cmluZy5mcm9tQ29kZVBvaW50KGNvZGVQb2ludCk7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscURBQXFEO0FBQ3JELHFDQUFxQztBQUVyQyxrREFBa0QsR0FHbEQsTUFBTSxxQkFBcUI7RUFDekI7SUFBQztJQUFLO0dBQVE7RUFDZDtJQUFDO0lBQUs7R0FBTztFQUNiO0lBQUM7SUFBSztHQUFPO0VBQ2I7SUFBQztJQUFLO0dBQVM7RUFDZjtJQUFDO0lBQUs7R0FBUTtDQUNmO0FBRUQsTUFBTSxvQkFBZ0MsT0FBTyxXQUFXLENBQUM7S0FDcEQsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLEdBQUs7TUFBQztNQUFRO0tBQUk7RUFDMUQ7SUFBQztJQUFVO0dBQUk7RUFDZjtJQUFDO0lBQVU7R0FBTztDQUNuQjtBQUVELE1BQU0sY0FBYyxJQUFJLElBQW9CO0FBRTVDLE1BQU0sUUFBUSxJQUFJLE9BQU8sQ0FBQyxDQUFDLEVBQUU7S0FBSSxZQUFZLElBQUk7Q0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0FBRWxFOzs7Ozs7Ozs7Ozs7Ozs7OztDQWlCQyxHQUNELE9BQU8sU0FBUyxPQUFPLEdBQVc7RUFDaEMsT0FBTyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBTSxZQUFZLEdBQUcsQ0FBQztBQUN0RDtBQUtBLE1BQU0seUJBQTBDO0VBQzlDLFlBQVk7QUFDZDtBQUVBLE1BQU0saUJBQWlCO0FBRXZCLE1BQU0sb0JBQW9CO0FBQzFCLE1BQU0sb0JBQW9CO0FBRTFCLE1BQU0sdUJBQXVCLElBQUk7QUFFakM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBNkJDLEdBQ0QsT0FBTyxTQUFTLFNBQ2QsR0FBVyxFQUNYLFVBQW9DLENBQUMsQ0FBQztFQUV0QyxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUc7SUFBRSxHQUFHLHNCQUFzQjtJQUFFLEdBQUcsT0FBTztFQUFDO0VBRS9ELElBQUksV0FBVyxxQkFBcUIsR0FBRyxDQUFDO0VBRXhDLElBQUksQ0FBQyxVQUFVO0lBQ2IsV0FBVyxJQUFJLE9BQ2IsQ0FBQyxDQUFDLEVBQ0EsT0FBTyxJQUFJLENBQUMsWUFDVCxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQU0sRUFBRSxNQUFNLEdBQUcsRUFBRSxNQUFNLEVBQ2xDLElBQUksQ0FBQyxLQUNULENBQUMsQ0FBQyxFQUNIO0lBR0YscUJBQXFCLEdBQUcsQ0FBQyxZQUFZO0VBQ3ZDO0VBRUEsT0FBTyxJQUNKLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBTSxVQUFVLENBQUMsRUFBRSxFQUN6QyxVQUFVLENBQUMsbUJBQW1CLENBQUMsR0FBRyxNQUFRLG1CQUFtQixLQUFLLEtBQ2xFLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLE1BQVEsbUJBQW1CLEtBQUs7QUFDdkU7QUFFQSxTQUFTLG1CQUFtQixZQUFvQixFQUFFLEtBQWE7RUFDN0QsTUFBTSxZQUFZLFNBQVMsY0FBYztFQUV6QyxPQUFPLFlBQVksaUJBQWlCLE1BQU0sT0FBTyxhQUFhLENBQUM7QUFDakUifQ==
// denoCacheMetadata=9571155559247416329,1823644651441132082