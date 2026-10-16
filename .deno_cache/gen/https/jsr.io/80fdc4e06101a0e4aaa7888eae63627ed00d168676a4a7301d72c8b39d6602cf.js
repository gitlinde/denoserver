// Copyright 2018-2026 the Deno authors. MIT license.
// This module is browser compatible.
// This module is generated from {@link https://www.iana.org/assignments/http-fields/http-fields.xhtml#field-names | IANA Hypertext Transfer Protocol (HTTP) Field Name Registry}
/**
 * HTTP Headers with status permanent
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 *
 * @see {@link https://www.iana.org/assignments/http-fields/http-fields.xhtml#field-names | IANA Hypertext Transfer Protocol (HTTP) Field Name Registry}
 */ export const HEADER = {
  /**
   * HTTP Header A-IM
   *
   * @see {@link https://www.iana.org/go/rfc3229 | RFC 3229: Delta encoding in HTTP}
   */ AIm: "A-IM",
  /**
   * HTTP Header Accept
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 12.5.1: HTTP Semantics}
   */ Accept: "Accept",
  /**
   * HTTP Header Accept-Additions
   *
   * @see {@link https://www.iana.org/go/rfc2324 | RFC 2324: Hyper Text Coffee Pot Control Protocol (HTCPCP/1.0)}
   */ AcceptAdditions: "Accept-Additions",
  /**
   * HTTP Header Accept-CH
   *
   * @see {@link https://www.iana.org/go/rfc8942 | RFC 8942, Section 3.1: HTTP Client Hints}
   */ AcceptCh: "Accept-CH",
  /**
   * HTTP Header Accept-Datetime
   *
   * @see {@link https://www.iana.org/go/rfc7089 | RFC 7089: HTTP Framework for Time-Based Access to Resource States -- Memento}
   */ AcceptDatetime: "Accept-Datetime",
  /**
   * HTTP Header Accept-Encoding
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 12.5.3: HTTP Semantics}
   */ AcceptEncoding: "Accept-Encoding",
  /**
   * HTTP Header Accept-Features
   *
   * @see {@link https://www.iana.org/go/rfc2295 | RFC 2295: Transparent Content Negotiation in HTTP}
   */ AcceptFeatures: "Accept-Features",
  /**
   * HTTP Header Accept-Language
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 12.5.4: HTTP Semantics}
   */ AcceptLanguage: "Accept-Language",
  /**
   * HTTP Header Accept-Patch
   *
   * @see {@link https://www.iana.org/go/rfc5789 | RFC 5789: PATCH Method for HTTP}
   */ AcceptPatch: "Accept-Patch",
  /**
   * HTTP Header Accept-Post
   *
   * @see {@link https://www.w3.org/TR/ldp | Linked Data Platform 1.0}
   */ AcceptPost: "Accept-Post",
  /**
   * HTTP Header Accept-Ranges
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 14.3: HTTP Semantics}
   */ AcceptRanges: "Accept-Ranges",
  /**
   * HTTP Header Accept-Signature
   *
   * @see {@link https://www.iana.org/go/draft-ietf-httpbis-message-signatures-19 | RFC-ietf-httpbis-message-signatures-19, Section 5.1: HTTP Message Signatures}
   */ AcceptSignature: "Accept-Signature",
  /**
   * HTTP Header Access-Control-Allow-Credentials
   *
   * @see {@link https://fetch.spec.whatwg.org/#http-access-control-allow-credentials | Fetch}
   */ AccessControlAllowCredentials: "Access-Control-Allow-Credentials",
  /**
   * HTTP Header Access-Control-Allow-Headers
   *
   * @see {@link https://fetch.spec.whatwg.org/#http-access-control-allow-headers | Fetch}
   */ AccessControlAllowHeaders: "Access-Control-Allow-Headers",
  /**
   * HTTP Header Access-Control-Allow-Methods
   *
   * @see {@link https://fetch.spec.whatwg.org/#http-access-control-allow-methods | Fetch}
   */ AccessControlAllowMethods: "Access-Control-Allow-Methods",
  /**
   * HTTP Header Access-Control-Allow-Origin
   *
   * @see {@link https://fetch.spec.whatwg.org/#http-access-control-allow-origin | Fetch}
   */ AccessControlAllowOrigin: "Access-Control-Allow-Origin",
  /**
   * HTTP Header Access-Control-Expose-Headers
   *
   * @see {@link https://fetch.spec.whatwg.org/#http-access-control-expose-headers | Fetch}
   */ AccessControlExposeHeaders: "Access-Control-Expose-Headers",
  /**
   * HTTP Header Access-Control-Max-Age
   *
   * @see {@link https://fetch.spec.whatwg.org/#http-access-control-max-age | Fetch}
   */ AccessControlMaxAge: "Access-Control-Max-Age",
  /**
   * HTTP Header Access-Control-Request-Headers
   *
   * @see {@link https://fetch.spec.whatwg.org/#http-access-control-request-headers | Fetch}
   */ AccessControlRequestHeaders: "Access-Control-Request-Headers",
  /**
   * HTTP Header Access-Control-Request-Method
   *
   * @see {@link https://fetch.spec.whatwg.org/#http-access-control-request-method | Fetch}
   */ AccessControlRequestMethod: "Access-Control-Request-Method",
  /**
   * HTTP Header Age
   *
   * @see {@link https://www.iana.org/go/rfc9111 | RFC9111, Section 5.1: HTTP Caching}
   */ Age: "Age",
  /**
   * HTTP Header Allow
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 10.2.1: HTTP Semantics}
   */ Allow: "Allow",
  /**
   * HTTP Header ALPN
   *
   * @see {@link https://www.iana.org/go/rfc7639 | RFC 7639, Section 2: The ALPN HTTP Header Field}
   */ ALPN: "ALPN",
  /**
   * HTTP Header Alt-Svc
   *
   * @see {@link https://www.iana.org/go/rfc7838 | RFC 7838: HTTP Alternative Services}
   */ AltSvc: "Alt-Svc",
  /**
   * HTTP Header Alt-Used
   *
   * @see {@link https://www.iana.org/go/rfc7838 | RFC 7838: HTTP Alternative Services}
   */ AltUsed: "Alt-Used",
  /**
   * HTTP Header Alternates
   *
   * @see {@link https://www.iana.org/go/rfc2295 | RFC 2295: Transparent Content Negotiation in HTTP}
   */ Alternates: "Alternates",
  /**
   * HTTP Header Apply-To-Redirect-Ref
   *
   * @see {@link https://www.iana.org/go/rfc4437 | RFC 4437: Web Distributed Authoring and Versioning (WebDAV) Redirect Reference Resources}
   */ ApplyToRedirectRef: "Apply-To-Redirect-Ref",
  /**
   * HTTP Header Authentication-Control
   *
   * @see {@link https://www.iana.org/go/rfc8053 | RFC 8053, Section 4: HTTP Authentication Extensions for Interactive Clients}
   */ AuthenticationControl: "Authentication-Control",
  /**
   * HTTP Header Authentication-Info
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 11.6.3: HTTP Semantics}
   */ AuthenticationInfo: "Authentication-Info",
  /**
   * HTTP Header Authorization
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 11.6.2: HTTP Semantics}
   */ Authorization: "Authorization",
  /**
   * HTTP Header Cache-Control
   *
   * @see {@link https://www.iana.org/go/rfc9111 | RFC9111, Section 5.2}
   */ CacheControl: "Cache-Control",
  /**
   * HTTP Header Cache-Status
   *
   * @see {@link https://www.iana.org/go/rfc9211 | RFC9211: The Cache-Status HTTP Response Header Field}
   */ CacheStatus: "Cache-Status",
  /**
   * HTTP Header Cal-Managed-ID
   *
   * @see {@link https://www.iana.org/go/rfc8607 | RFC 8607, Section 5.1: Calendaring Extensions to WebDAV (CalDAV): Managed Attachments}
   */ CalManagedId: "Cal-Managed-ID",
  /**
   * HTTP Header CalDAV-Timezones
   *
   * @see {@link https://www.iana.org/go/rfc7809 | RFC 7809, Section 7.1: Calendaring Extensions to WebDAV (CalDAV): Time Zones by Reference}
   */ CaldavTimezones: "CalDAV-Timezones",
  /**
   * HTTP Header Capsule-Protocol
   *
   * @see {@link https://www.iana.org/go/rfc9297 | RFC9297}
   */ CapsuleProtocol: "Capsule-Protocol",
  /**
   * HTTP Header CDN-Cache-Control
   *
   * @see {@link https://www.iana.org/go/rfc9213 | RFC9213: Targeted HTTP Cache Control}
   */ CdnCacheControl: "CDN-Cache-Control",
  /**
   * HTTP Header CDN-Loop
   *
   * @see {@link https://www.iana.org/go/rfc8586 | RFC 8586: Loop Detection in Content Delivery Networks (CDNs)}
   */ CdnLoop: "CDN-Loop",
  /**
   * HTTP Header Cert-Not-After
   *
   * @see {@link https://www.iana.org/go/rfc8739 | RFC 8739, Section 3.3: Support for Short-Term, Automatically Renewed (STAR) Certificates in the Automated Certificate Management Environment (ACME)}
   */ CertNotAfter: "Cert-Not-After",
  /**
   * HTTP Header Cert-Not-Before
   *
   * @see {@link https://www.iana.org/go/rfc8739 | RFC 8739, Section 3.3: Support for Short-Term, Automatically Renewed (STAR) Certificates in the Automated Certificate Management Environment (ACME)}
   */ CertNotBefore: "Cert-Not-Before",
  /**
   * HTTP Header Clear-Site-Data
   *
   * @see {@link https://w3.org/TR/clear-site-data/#header | Clear Site Data}
   */ ClearSiteData: "Clear-Site-Data",
  /**
   * HTTP Header Client-Cert
   *
   * @see {@link https://www.iana.org/go/rfc9440 | RFC9440, Section 2: Client-Cert HTTP Header Field}
   */ ClientCert: "Client-Cert",
  /**
   * HTTP Header Client-Cert-Chain
   *
   * @see {@link https://www.iana.org/go/rfc9440 | RFC9440, Section 2: Client-Cert HTTP Header Field}
   */ ClientCertChain: "Client-Cert-Chain",
  /**
   * HTTP Header Close
   *
   * @see {@link https://www.iana.org/go/rfc9112 | RFC9112, Section 9.6: HTTP/1.1}
   */ Close: "Close",
  /**
   * HTTP Header Connection
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 7.6.1: HTTP Semantics}
   */ Connection: "Connection",
  /**
   * HTTP Header Content-Digest
   *
   * @see {@link https://www.iana.org/go/draft-ietf-httpbis-digest-headers-13 | RFC-ietf-httpbis-digest-headers-13, Section 2: Digest Fields}
   */ ContentDigest: "Content-Digest",
  /**
 * HTTP Header Content-Disposition
 *
 * @see {@link https://www.iana.org/go/rfc6266 | RFC 6266: Use of the Content-Disposition Header Field in the
        Hypertext Transfer Protocol (HTTP)}
 */ ContentDisposition: "Content-Disposition",
  /**
   * HTTP Header Content-Encoding
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 8.4: HTTP Semantics}
   */ ContentEncoding: "Content-Encoding",
  /**
   * HTTP Header Content-Language
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 8.5: HTTP Semantics}
   */ ContentLanguage: "Content-Language",
  /**
   * HTTP Header Content-Length
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 8.6: HTTP Semantics}
   */ ContentLength: "Content-Length",
  /**
   * HTTP Header Content-Location
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 8.7: HTTP Semantics}
   */ ContentLocation: "Content-Location",
  /**
   * HTTP Header Content-Range
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 14.4: HTTP Semantics}
   */ ContentRange: "Content-Range",
  /**
   * HTTP Header Content-Security-Policy
   *
   * @see {@link https://www.w3.org/TR/CSP/#csp-header | Content Security Policy Level 3}
   */ ContentSecurityPolicy: "Content-Security-Policy",
  /**
   * HTTP Header Content-Security-Policy-Report-Only
   *
   * @see {@link https://www.w3.org/TR/CSP/#cspro-header | Content Security Policy Level 3}
   */ ContentSecurityPolicyReportOnly: "Content-Security-Policy-Report-Only",
  /**
   * HTTP Header Content-Type
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 8.3: HTTP Semantics}
   */ ContentType: "Content-Type",
  /**
   * HTTP Header Cookie
   *
   * @see {@link https://www.iana.org/go/rfc6265 | RFC 6265: HTTP State Management Mechanism}
   */ Cookie: "Cookie",
  /**
   * HTTP Header Cross-Origin-Embedder-Policy
   *
   * @see {@link https://html.spec.whatwg.org/multipage/origin.html#cross-origin-embedder-policy | HTML}
   */ CrossOriginEmbedderPolicy: "Cross-Origin-Embedder-Policy",
  /**
   * HTTP Header Cross-Origin-Embedder-Policy-Report-Only
   *
   * @see {@link https://html.spec.whatwg.org/multipage/origin.html#cross-origin-embedder-policy-report-only | HTML}
   */ CrossOriginEmbedderPolicyReportOnly: "Cross-Origin-Embedder-Policy-Report-Only",
  /**
   * HTTP Header Cross-Origin-Opener-Policy
   *
   * @see {@link https://html.spec.whatwg.org/multipage/origin.html#cross-origin-opener-policy-2 | HTML}
   */ CrossOriginOpenerPolicy: "Cross-Origin-Opener-Policy",
  /**
   * HTTP Header Cross-Origin-Opener-Policy-Report-Only
   *
   * @see {@link https://html.spec.whatwg.org/multipage/origin.html#cross-origin-opener-policy-report-only | HTML}
   */ CrossOriginOpenerPolicyReportOnly: "Cross-Origin-Opener-Policy-Report-Only",
  /**
   * HTTP Header Cross-Origin-Resource-Policy
   *
   * @see {@link https://fetch.spec.whatwg.org/#cross-origin-resource-policy-header | Fetch}
   */ CrossOriginResourcePolicy: "Cross-Origin-Resource-Policy",
  /**
   * HTTP Header DASL
   *
   * @see {@link https://www.iana.org/go/rfc5323 | RFC 5323: Web Distributed Authoring and Versioning (WebDAV) SEARCH}
   */ DASL: "DASL",
  /**
   * HTTP Header Date
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 6.6.1: HTTP Semantics}
   */ Date: "Date",
  /**
   * HTTP Header DAV
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)}
   */ DAV: "DAV",
  /**
   * HTTP Header Delta-Base
   *
   * @see {@link https://www.iana.org/go/rfc3229 | RFC 3229: Delta encoding in HTTP}
   */ DeltaBase: "Delta-Base",
  /**
   * HTTP Header Depth
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)}
   */ Depth: "Depth",
  /**
   * HTTP Header Destination
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)}
   */ Destination: "Destination",
  /**
   * HTTP Header DPoP
   *
   * @see {@link https://www.iana.org/go/rfc9449 | RFC9449: OAuth 2.0 Demonstrating Proof of Possession (DPoP)}
   */ DPoP: "DPoP",
  /**
   * HTTP Header DPoP-Nonce
   *
   * @see {@link https://www.iana.org/go/rfc9449 | RFC9449: OAuth 2.0 Demonstrating Proof of Possession (DPoP)}
   */ DpopNonce: "DPoP-Nonce",
  /**
   * HTTP Header Early-Data
   *
   * @see {@link https://www.iana.org/go/rfc8470 | RFC 8470: Using Early Data in HTTP}
   */ EarlyData: "Early-Data",
  /**
   * HTTP Header ETag
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 8.8.3: HTTP Semantics}
   */ ETag: "ETag",
  /**
   * HTTP Header Expect
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 10.1.1: HTTP Semantics}
   */ Expect: "Expect",
  /**
   * HTTP Header Expires
   *
   * @see {@link https://www.iana.org/go/rfc9111 | RFC9111, Section 5.3: HTTP Caching}
   */ Expires: "Expires",
  /**
   * HTTP Header Forwarded
   *
   * @see {@link https://www.iana.org/go/rfc7239 | RFC 7239: Forwarded HTTP Extension}
   */ Forwarded: "Forwarded",
  /**
   * HTTP Header From
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 10.1.2: HTTP Semantics}
   */ From: "From",
  /**
   * HTTP Header Hobareg
   *
   * @see {@link https://www.iana.org/go/rfc7486 | RFC 7486, Section 6.1.1: HTTP Origin-Bound Authentication (HOBA)}
   */ Hobareg: "Hobareg",
  /**
   * HTTP Header Host
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 7.2: HTTP Semantics}
   */ Host: "Host",
  /**
   * HTTP Header If
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)}
   */ If: "If",
  /**
   * HTTP Header If-Match
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 13.1.1: HTTP Semantics}
   */ IfMatch: "If-Match",
  /**
   * HTTP Header If-Modified-Since
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 13.1.3: HTTP Semantics}
   */ IfModifiedSince: "If-Modified-Since",
  /**
   * HTTP Header If-None-Match
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 13.1.2: HTTP Semantics}
   */ IfNoneMatch: "If-None-Match",
  /**
   * HTTP Header If-Range
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 13.1.5: HTTP Semantics}
   */ IfRange: "If-Range",
  /**
   * HTTP Header If-Schedule-Tag-Match
   *
   * @see {@link https://www.iana.org/go/rfc6638 |  RFC 6338: Scheduling Extensions to CalDAV}
   */ IfScheduleTagMatch: "If-Schedule-Tag-Match",
  /**
   * HTTP Header If-Unmodified-Since
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 13.1.4: HTTP Semantics}
   */ IfUnmodifiedSince: "If-Unmodified-Since",
  /**
   * HTTP Header IM
   *
   * @see {@link https://www.iana.org/go/rfc3229 | RFC 3229: Delta encoding in HTTP}
   */ IM: "IM",
  /**
   * HTTP Header Include-Referred-Token-Binding-ID
   *
   * @see {@link https://www.iana.org/go/rfc8473 | RFC 8473: Token Binding over HTTP}
   */ IncludeReferredTokenBindingId: "Include-Referred-Token-Binding-ID",
  /**
   * HTTP Header Keep-Alive
   *
   * @see {@link https://www.iana.org/go/rfc2068 | RFC 2068: Hypertext Transfer Protocol -- HTTP/1.1}
   */ KeepAlive: "Keep-Alive",
  /**
   * HTTP Header Label
   *
   * @see {@link https://www.iana.org/go/rfc3253 | RFC 3253: Versioning Extensions to WebDAV: (Web Distributed Authoring and Versioning)}
   */ Label: "Label",
  /**
   * HTTP Header Last-Event-ID
   *
   * @see {@link https://html.spec.whatwg.org/multipage/server-sent-events.html#last-event-id | HTML}
   */ LastEventId: "Last-Event-ID",
  /**
   * HTTP Header Last-Modified
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 8.8.2: HTTP Semantics}
   */ LastModified: "Last-Modified",
  /**
   * HTTP Header Link
   *
   * @see {@link https://www.iana.org/go/rfc8288 | RFC 8288: Web Linking}
   */ Link: "Link",
  /**
   * HTTP Header Location
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 10.2.2: HTTP Semantics}
   */ Location: "Location",
  /**
   * HTTP Header Lock-Token
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)}
   */ LockToken: "Lock-Token",
  /**
   * HTTP Header Max-Forwards
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 7.6.2: HTTP Semantics}
   */ MaxForwards: "Max-Forwards",
  /**
   * HTTP Header Memento-Datetime
   *
   * @see {@link https://www.iana.org/go/rfc7089 | RFC 7089: HTTP Framework for Time-Based Access to Resource States -- Memento}
   */ MementoDatetime: "Memento-Datetime",
  /**
   * HTTP Header Meter
   *
   * @see {@link https://www.iana.org/go/rfc2227 | RFC 2227: Simple Hit-Metering and Usage-Limiting for HTTP}
   */ Meter: "Meter",
  /**
   * HTTP Header MIME-Version
   *
   * @see {@link https://www.iana.org/go/rfc9112 | RFC9112, Appendix B.1: HTTP/1.1}
   */ MimeVersion: "MIME-Version",
  /**
   * HTTP Header Negotiate
   *
   * @see {@link https://www.iana.org/go/rfc2295 | RFC 2295: Transparent Content Negotiation in HTTP}
   */ Negotiate: "Negotiate",
  /**
   * HTTP Header NEL
   *
   * @see {@link https://www.w3.org/TR/network-error-logging/ | Network Error Logging}
   */ NEL: "NEL",
  /**
   * HTTP Header OData-EntityId
   *
   * @see {@link http://docs.oasis-open.org/odata/odata/v4.01/csprd05/part1-protocol/odata-v4.01-csprd05-part1-protocol.html#_Toc14172735 | OData Version 4.01 Part 1: Protocol}
   * @see {@link #OASIS | OASIS}
   * @see {@link #Chet_Ensign | Chet_Ensign}
   */ OdataEntityid: "OData-EntityId",
  /**
   * HTTP Header OData-Isolation
   *
   * @see {@link http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_HeaderIsolationODataIsolation | OData Version 4.01 Part 1: Protocol}
   * @see {@link #OASIS | OASIS}
   * @see {@link #Chet_Ensign | Chet_Ensign}
   */ OdataIsolation: "OData-Isolation",
  /**
   * HTTP Header OData-MaxVersion
   *
   * @see {@link http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_HeaderODataMaxVersion | OData Version 4.01 Part 1: Protocol}
   * @see {@link #OASIS | OASIS}
   * @see {@link #Chet_Ensign | Chet_Ensign}
   */ OdataMaxversion: "OData-MaxVersion",
  /**
   * HTTP Header OData-Version
   *
   * @see {@link http://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part1-protocol.html#sec_HeaderODataVersion | OData Version 4.01 Part 1: Protocol}
   * @see {@link #OASIS | OASIS}
   * @see {@link #Chet_Ensign | Chet_Ensign}
   */ OdataVersion: "OData-Version",
  /**
   * HTTP Header Optional-WWW-Authenticate
   *
   * @see {@link https://www.iana.org/go/rfc8053 | RFC 8053, Section 3: HTTP Authentication Extensions for Interactive Clients}
   */ OptionalWwwAuthenticate: "Optional-WWW-Authenticate",
  /**
   * HTTP Header Ordering-Type
   *
   * @see {@link https://www.iana.org/go/rfc3648 | RFC 3648: Web Distributed Authoring and Versioning (WebDAV) Ordered Collections Protocol}
   */ OrderingType: "Ordering-Type",
  /**
   * HTTP Header Origin
   *
   * @see {@link https://www.iana.org/go/rfc6454 | RFC 6454: The Web Origin Concept}
   */ Origin: "Origin",
  /**
   * HTTP Header Origin-Agent-Cluster
   *
   * @see {@link https://html.spec.whatwg.org/multipage/origin.html#origin-agent-cluster | HTML}
   */ OriginAgentCluster: "Origin-Agent-Cluster",
  /**
   * HTTP Header OSCORE
   *
   * @see {@link https://www.iana.org/go/rfc8613 | RFC 8613, Section 11.1: Object Security for Constrained RESTful Environments (OSCORE)}
   */ OSCORE: "OSCORE",
  /**
   * HTTP Header OSLC-Core-Version
   *
   * @see {@link https://docs.oasis-open-projects.org/oslc-op/core/v3.0/oslc-core.html | OASIS Project Specification 01}
   * @see {@link #OASIS | OASIS}
   * @see {@link #Chet_Ensign | Chet_Ensign}
   */ OslcCoreVersion: "OSLC-Core-Version",
  /**
   * HTTP Header Overwrite
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)}
   */ Overwrite: "Overwrite",
  /**
   * HTTP Header Ping-From
   *
   * @see {@link https://html.spec.whatwg.org/multipage/links.html#ping-from | HTML}
   */ PingFrom: "Ping-From",
  /**
   * HTTP Header Ping-To
   *
   * @see {@link https://html.spec.whatwg.org/multipage/links.html#ping-to | HTML}
   */ PingTo: "Ping-To",
  /**
   * HTTP Header Position
   *
   * @see {@link https://www.iana.org/go/rfc3648 | RFC 3648: Web Distributed Authoring and Versioning (WebDAV) Ordered Collections Protocol}
   */ Position: "Position",
  /**
   * HTTP Header Prefer
   *
   * @see {@link https://www.iana.org/go/rfc7240 | RFC 7240: Prefer Header for HTTP}
   */ Prefer: "Prefer",
  /**
   * HTTP Header Preference-Applied
   *
   * @see {@link https://www.iana.org/go/rfc7240 | RFC 7240: Prefer Header for HTTP}
   */ PreferenceApplied: "Preference-Applied",
  /**
   * HTTP Header Priority
   *
   * @see {@link https://www.iana.org/go/rfc9218 | RFC9218: Extensible Prioritization Scheme for HTTP}
   */ Priority: "Priority",
  /**
   * HTTP Header Proxy-Authenticate
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 11.7.1: HTTP Semantics}
   */ ProxyAuthenticate: "Proxy-Authenticate",
  /**
   * HTTP Header Proxy-Authentication-Info
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 11.7.3: HTTP Semantics}
   */ ProxyAuthenticationInfo: "Proxy-Authentication-Info",
  /**
   * HTTP Header Proxy-Authorization
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 11.7.2: HTTP Semantics}
   */ ProxyAuthorization: "Proxy-Authorization",
  /**
   * HTTP Header Proxy-Status
   *
   * @see {@link https://www.iana.org/go/rfc9209 | RFC9209: The Proxy-Status HTTP Response Header Field}
   */ ProxyStatus: "Proxy-Status",
  /**
   * HTTP Header Public-Key-Pins
   *
   * @see {@link https://www.iana.org/go/rfc7469 | RFC 7469: Public Key Pinning Extension for HTTP}
   */ PublicKeyPins: "Public-Key-Pins",
  /**
   * HTTP Header Public-Key-Pins-Report-Only
   *
   * @see {@link https://www.iana.org/go/rfc7469 | RFC 7469: Public Key Pinning Extension for HTTP}
   */ PublicKeyPinsReportOnly: "Public-Key-Pins-Report-Only",
  /**
   * HTTP Header Range
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 14.2: HTTP Semantics}
   */ Range: "Range",
  /**
   * HTTP Header Redirect-Ref
   *
   * @see {@link https://www.iana.org/go/rfc4437 | RFC 4437: Web Distributed Authoring and Versioning (WebDAV) Redirect Reference Resources}
   */ RedirectRef: "Redirect-Ref",
  /**
   * HTTP Header Referer
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 10.1.3: HTTP Semantics}
   */ Referer: "Referer",
  /**
   * HTTP Header Refresh
   *
   * @see {@link https://html.spec.whatwg.org/multipage/browsing-the-web.html#refresh | HTML}
   */ Refresh: "Refresh",
  /**
   * HTTP Header Replay-Nonce
   *
   * @see {@link https://www.iana.org/go/rfc8555 | RFC 8555, Section 6.5.1: Automatic Certificate Management Environment (ACME)}
   */ ReplayNonce: "Replay-Nonce",
  /**
   * HTTP Header Repr-Digest
   *
   * @see {@link https://www.iana.org/go/draft-ietf-httpbis-digest-headers-13 | RFC-ietf-httpbis-digest-headers-13, Section 3: Digest Fields}
   */ ReprDigest: "Repr-Digest",
  /**
   * HTTP Header Retry-After
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 10.2.3: HTTP Semantics}
   */ RetryAfter: "Retry-After",
  /**
   * HTTP Header Schedule-Reply
   *
   * @see {@link https://www.iana.org/go/rfc6638 | RFC 6638: Scheduling Extensions to CalDAV}
   */ ScheduleReply: "Schedule-Reply",
  /**
   * HTTP Header Schedule-Tag
   *
   * @see {@link https://www.iana.org/go/rfc6638 | RFC 6338: Scheduling Extensions to CalDAV}
   */ ScheduleTag: "Schedule-Tag",
  /**
   * HTTP Header Sec-Purpose
   *
   * @see {@link https://fetch.spec.whatwg.org/#sec-purpose-header | Fetch}
   */ SecPurpose: "Sec-Purpose",
  /**
   * HTTP Header Sec-Token-Binding
   *
   * @see {@link https://www.iana.org/go/rfc8473 | RFC 8473: Token Binding over HTTP}
   */ SecTokenBinding: "Sec-Token-Binding",
  /**
   * HTTP Header Sec-WebSocket-Accept
   *
   * @see {@link https://www.iana.org/go/rfc6455 | RFC 6455: The WebSocket Protocol}
   */ SecWebsocketAccept: "Sec-WebSocket-Accept",
  /**
   * HTTP Header Sec-WebSocket-Extensions
   *
   * @see {@link https://www.iana.org/go/rfc6455 | RFC 6455: The WebSocket Protocol}
   */ SecWebsocketExtensions: "Sec-WebSocket-Extensions",
  /**
   * HTTP Header Sec-WebSocket-Key
   *
   * @see {@link https://www.iana.org/go/rfc6455 | RFC 6455: The WebSocket Protocol}
   */ SecWebsocketKey: "Sec-WebSocket-Key",
  /**
   * HTTP Header Sec-WebSocket-Protocol
   *
   * @see {@link https://www.iana.org/go/rfc6455 | RFC 6455: The WebSocket Protocol}
   */ SecWebsocketProtocol: "Sec-WebSocket-Protocol",
  /**
   * HTTP Header Sec-WebSocket-Version
   *
   * @see {@link https://www.iana.org/go/rfc6455 | RFC 6455: The WebSocket Protocol}
   */ SecWebsocketVersion: "Sec-WebSocket-Version",
  /**
   * HTTP Header Server
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 10.2.4: HTTP Semantics}
   */ Server: "Server",
  /**
   * HTTP Header Server-Timing
   *
   * @see {@link https://www.w3.org/TR/server-timing/ | Server Timing}
   */ ServerTiming: "Server-Timing",
  /**
   * HTTP Header Set-Cookie
   *
   * @see {@link https://www.iana.org/go/rfc6265 | RFC 6265: HTTP State Management Mechanism}
   */ SetCookie: "Set-Cookie",
  /**
   * HTTP Header Signature
   *
   * @see {@link https://www.iana.org/go/draft-ietf-httpbis-message-signatures-19 | RFC-ietf-httpbis-message-signatures-19, Section 4.2: HTTP Message Signatures}
   */ Signature: "Signature",
  /**
   * HTTP Header Signature-Input
   *
   * @see {@link https://www.iana.org/go/draft-ietf-httpbis-message-signatures-19 | RFC-ietf-httpbis-message-signatures-19, Section 4.1: HTTP Message Signatures}
   */ SignatureInput: "Signature-Input",
  /**
   * HTTP Header SLUG
   *
   * @see {@link https://www.iana.org/go/rfc5023 | RFC 5023: The Atom Publishing Protocol}
   */ SLUG: "SLUG",
  /**
   * HTTP Header SoapAction
   *
   * @see {@link https://www.w3.org/TR/2000/NOTE-SOAP-20000508 | Simple Object Access Protocol (SOAP) 1.1}
   */ SoapAction: "SoapAction",
  /**
   * HTTP Header Status-URI
   *
   * @see {@link https://www.iana.org/go/rfc2518 | RFC 2518: HTTP Extensions for Distributed Authoring -- WEBDAV}
   */ StatusUri: "Status-URI",
  /**
   * HTTP Header Strict-Transport-Security
   *
   * @see {@link https://www.iana.org/go/rfc6797 | RFC 6797: HTTP Strict Transport Security (HSTS)}
   */ StrictTransportSecurity: "Strict-Transport-Security",
  /**
   * HTTP Header Sunset
   *
   * @see {@link https://www.iana.org/go/rfc8594 | RFC 8594: The Sunset HTTP Header Field}
   */ Sunset: "Sunset",
  /**
   * HTTP Header TCN
   *
   * @see {@link https://www.iana.org/go/rfc2295 | RFC 2295: Transparent Content Negotiation in HTTP}
   */ TCN: "TCN",
  /**
   * HTTP Header TE
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 10.1.4: HTTP Semantics}
   */ TE: "TE",
  /**
   * HTTP Header Timeout
   *
   * @see {@link https://www.iana.org/go/rfc4918 | RFC 4918: HTTP Extensions for Web Distributed Authoring and Versioning (WebDAV)}
   */ Timeout: "Timeout",
  /**
   * HTTP Header Topic
   *
   * @see {@link https://www.iana.org/go/rfc8030 | RFC 8030, Section 5.4: Generic Event Delivery Using HTTP Push}
   */ Topic: "Topic",
  /**
   * HTTP Header Traceparent
   *
   * @see {@link https://www.w3.org/TR/trace-context/#traceparent-header | Trace Context}
   */ Traceparent: "Traceparent",
  /**
   * HTTP Header Tracestate
   *
   * @see {@link https://www.w3.org/TR/trace-context/#tracestate-header | Trace Context}
   */ Tracestate: "Tracestate",
  /**
   * HTTP Header Trailer
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 6.6.2: HTTP Semantics}
   */ Trailer: "Trailer",
  /**
   * HTTP Header Transfer-Encoding
   *
   * @see {@link https://www.iana.org/go/rfc9112 | RFC9112, Section 6.1: HTTP Semantics}
   */ TransferEncoding: "Transfer-Encoding",
  /**
   * HTTP Header TTL
   *
   * @see {@link https://www.iana.org/go/rfc8030 | RFC 8030, Section 5.2: Generic Event Delivery Using HTTP Push}
   */ TTL: "TTL",
  /**
   * HTTP Header Upgrade
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 7.8: HTTP Semantics}
   */ Upgrade: "Upgrade",
  /**
   * HTTP Header Urgency
   *
   * @see {@link https://www.iana.org/go/rfc8030 | RFC 8030, Section 5.3: Generic Event Delivery Using HTTP Push}
   */ Urgency: "Urgency",
  /**
   * HTTP Header User-Agent
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 10.1.5: HTTP Semantics}
   */ UserAgent: "User-Agent",
  /**
   * HTTP Header Variant-Vary
   *
   * @see {@link https://www.iana.org/go/rfc2295 | RFC 2295: Transparent Content Negotiation in HTTP}
   */ VariantVary: "Variant-Vary",
  /**
   * HTTP Header Vary
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 12.5.5: HTTP Semantics}
   */ Vary: "Vary",
  /**
   * HTTP Header Via
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 7.6.3: HTTP Semantics}
   */ Via: "Via",
  /**
   * HTTP Header Want-Content-Digest
   *
   * @see {@link https://www.iana.org/go/draft-ietf-httpbis-digest-headers-13 | RFC-ietf-httpbis-digest-headers-13, Section 4: Digest Fields}
   */ WantContentDigest: "Want-Content-Digest",
  /**
   * HTTP Header Want-Repr-Digest
   *
   * @see {@link https://www.iana.org/go/draft-ietf-httpbis-digest-headers-13 | RFC-ietf-httpbis-digest-headers-13, Section 4: Digest Fields}
   */ WantReprDigest: "Want-Repr-Digest",
  /**
   * HTTP Header WWW-Authenticate
   *
   * @see {@link https://www.iana.org/go/rfc9110 | RFC9110, Section 11.6.1: HTTP Semantics}
   */ WwwAuthenticate: "WWW-Authenticate",
  /**
   * HTTP Header X-Content-Type-Options
   *
   * @see {@link https://fetch.spec.whatwg.org/#x-content-type-options-header | Fetch}
   */ XContentTypeOptions: "X-Content-Type-Options",
  /**
   * HTTP Header X-Frame-Options
   *
   * @see {@link https://html.spec.whatwg.org/multipage/browsing-the-web.html#x-frame-options | HTML}
   */ XFrameOptions: "X-Frame-Options"
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImh0dHBzOi8vanNyLmlvL0BzdGQvaHR0cC8xLjEuNC91bnN0YWJsZV9oZWFkZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IDIwMTgtMjAyNiB0aGUgRGVubyBhdXRob3JzLiBNSVQgbGljZW5zZS5cbi8vIFRoaXMgbW9kdWxlIGlzIGJyb3dzZXIgY29tcGF0aWJsZS5cbi8vIFRoaXMgbW9kdWxlIGlzIGdlbmVyYXRlZCBmcm9tIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9hc3NpZ25tZW50cy9odHRwLWZpZWxkcy9odHRwLWZpZWxkcy54aHRtbCNmaWVsZC1uYW1lcyB8IElBTkEgSHlwZXJ0ZXh0IFRyYW5zZmVyIFByb3RvY29sIChIVFRQKSBGaWVsZCBOYW1lIFJlZ2lzdHJ5fVxuXG4vKipcbiAqIEhUVFAgSGVhZGVycyB3aXRoIHN0YXR1cyBwZXJtYW5lbnRcbiAqXG4gKiBAZXhwZXJpbWVudGFsICoqVU5TVEFCTEUqKjogTmV3IEFQSSwgeWV0IHRvIGJlIHZldHRlZC5cbiAqXG4gKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9hc3NpZ25tZW50cy9odHRwLWZpZWxkcy9odHRwLWZpZWxkcy54aHRtbCNmaWVsZC1uYW1lcyB8IElBTkEgSHlwZXJ0ZXh0IFRyYW5zZmVyIFByb3RvY29sIChIVFRQKSBGaWVsZCBOYW1lIFJlZ2lzdHJ5fVxuICovXG5leHBvcnQgY29uc3QgSEVBREVSID0ge1xuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQS1JTVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmMzMjI5IHwgUkZDIDMyMjk6IERlbHRhIGVuY29kaW5nIGluIEhUVFB9XG4gICAqL1xuICBBSW06IFwiQS1JTVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBBY2NlcHRcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gMTIuNS4xOiBIVFRQIFNlbWFudGljc31cbiAgICovXG4gIEFjY2VwdDogXCJBY2NlcHRcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQWNjZXB0LUFkZGl0aW9uc1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmMyMzI0IHwgUkZDIDIzMjQ6IEh5cGVyIFRleHQgQ29mZmVlIFBvdCBDb250cm9sIFByb3RvY29sIChIVENQQ1AvMS4wKX1cbiAgICovXG4gIEFjY2VwdEFkZGl0aW9uczogXCJBY2NlcHQtQWRkaXRpb25zXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEFjY2VwdC1DSFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM4OTQyIHwgUkZDIDg5NDIsIFNlY3Rpb24gMy4xOiBIVFRQIENsaWVudCBIaW50c31cbiAgICovXG4gIEFjY2VwdENoOiBcIkFjY2VwdC1DSFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBBY2NlcHQtRGF0ZXRpbWVcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNzA4OSB8IFJGQyA3MDg5OiBIVFRQIEZyYW1ld29yayBmb3IgVGltZS1CYXNlZCBBY2Nlc3MgdG8gUmVzb3VyY2UgU3RhdGVzIC0tIE1lbWVudG99XG4gICAqL1xuICBBY2NlcHREYXRldGltZTogXCJBY2NlcHQtRGF0ZXRpbWVcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQWNjZXB0LUVuY29kaW5nXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTAgfCBSRkM5MTEwLCBTZWN0aW9uIDEyLjUuMzogSFRUUCBTZW1hbnRpY3N9XG4gICAqL1xuICBBY2NlcHRFbmNvZGluZzogXCJBY2NlcHQtRW5jb2RpbmdcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQWNjZXB0LUZlYXR1cmVzXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzIyOTUgfCBSRkMgMjI5NTogVHJhbnNwYXJlbnQgQ29udGVudCBOZWdvdGlhdGlvbiBpbiBIVFRQfVxuICAgKi9cbiAgQWNjZXB0RmVhdHVyZXM6IFwiQWNjZXB0LUZlYXR1cmVzXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEFjY2VwdC1MYW5ndWFnZVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiAxMi41LjQ6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgQWNjZXB0TGFuZ3VhZ2U6IFwiQWNjZXB0LUxhbmd1YWdlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEFjY2VwdC1QYXRjaFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM1Nzg5IHwgUkZDIDU3ODk6IFBBVENIIE1ldGhvZCBmb3IgSFRUUH1cbiAgICovXG4gIEFjY2VwdFBhdGNoOiBcIkFjY2VwdC1QYXRjaFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBBY2NlcHQtUG9zdFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy53My5vcmcvVFIvbGRwIHwgTGlua2VkIERhdGEgUGxhdGZvcm0gMS4wfVxuICAgKi9cbiAgQWNjZXB0UG9zdDogXCJBY2NlcHQtUG9zdFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBBY2NlcHQtUmFuZ2VzXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTAgfCBSRkM5MTEwLCBTZWN0aW9uIDE0LjM6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgQWNjZXB0UmFuZ2VzOiBcIkFjY2VwdC1SYW5nZXNcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQWNjZXB0LVNpZ25hdHVyZVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9kcmFmdC1pZXRmLWh0dHBiaXMtbWVzc2FnZS1zaWduYXR1cmVzLTE5IHwgUkZDLWlldGYtaHR0cGJpcy1tZXNzYWdlLXNpZ25hdHVyZXMtMTksIFNlY3Rpb24gNS4xOiBIVFRQIE1lc3NhZ2UgU2lnbmF0dXJlc31cbiAgICovXG4gIEFjY2VwdFNpZ25hdHVyZTogXCJBY2NlcHQtU2lnbmF0dXJlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNodHRwLWFjY2Vzcy1jb250cm9sLWFsbG93LWNyZWRlbnRpYWxzIHwgRmV0Y2h9XG4gICAqL1xuICBBY2Nlc3NDb250cm9sQWxsb3dDcmVkZW50aWFsczogXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFsc1wiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNodHRwLWFjY2Vzcy1jb250cm9sLWFsbG93LWhlYWRlcnMgfCBGZXRjaH1cbiAgICovXG4gIEFjY2Vzc0NvbnRyb2xBbGxvd0hlYWRlcnM6IFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNodHRwLWFjY2Vzcy1jb250cm9sLWFsbG93LW1ldGhvZHMgfCBGZXRjaH1cbiAgICovXG4gIEFjY2Vzc0NvbnRyb2xBbGxvd01ldGhvZHM6IFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kc1wiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI2h0dHAtYWNjZXNzLWNvbnRyb2wtYWxsb3ctb3JpZ2luIHwgRmV0Y2h9XG4gICAqL1xuICBBY2Nlc3NDb250cm9sQWxsb3dPcmlnaW46IFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEFjY2Vzcy1Db250cm9sLUV4cG9zZS1IZWFkZXJzXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNodHRwLWFjY2Vzcy1jb250cm9sLWV4cG9zZS1oZWFkZXJzIHwgRmV0Y2h9XG4gICAqL1xuICBBY2Nlc3NDb250cm9sRXhwb3NlSGVhZGVyczogXCJBY2Nlc3MtQ29udHJvbC1FeHBvc2UtSGVhZGVyc1wiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBBY2Nlc3MtQ29udHJvbC1NYXgtQWdlXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNodHRwLWFjY2Vzcy1jb250cm9sLW1heC1hZ2UgfCBGZXRjaH1cbiAgICovXG4gIEFjY2Vzc0NvbnRyb2xNYXhBZ2U6IFwiQWNjZXNzLUNvbnRyb2wtTWF4LUFnZVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBBY2Nlc3MtQ29udHJvbC1SZXF1ZXN0LUhlYWRlcnNcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI2h0dHAtYWNjZXNzLWNvbnRyb2wtcmVxdWVzdC1oZWFkZXJzIHwgRmV0Y2h9XG4gICAqL1xuICBBY2Nlc3NDb250cm9sUmVxdWVzdEhlYWRlcnM6IFwiQWNjZXNzLUNvbnRyb2wtUmVxdWVzdC1IZWFkZXJzXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEFjY2Vzcy1Db250cm9sLVJlcXVlc3QtTWV0aG9kXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNodHRwLWFjY2Vzcy1jb250cm9sLXJlcXVlc3QtbWV0aG9kIHwgRmV0Y2h9XG4gICAqL1xuICBBY2Nlc3NDb250cm9sUmVxdWVzdE1ldGhvZDogXCJBY2Nlc3MtQ29udHJvbC1SZXF1ZXN0LU1ldGhvZFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBBZ2VcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMSB8IFJGQzkxMTEsIFNlY3Rpb24gNS4xOiBIVFRQIENhY2hpbmd9XG4gICAqL1xuICBBZ2U6IFwiQWdlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEFsbG93XG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTAgfCBSRkM5MTEwLCBTZWN0aW9uIDEwLjIuMTogSFRUUCBTZW1hbnRpY3N9XG4gICAqL1xuICBBbGxvdzogXCJBbGxvd1wiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBBTFBOXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzc2MzkgfCBSRkMgNzYzOSwgU2VjdGlvbiAyOiBUaGUgQUxQTiBIVFRQIEhlYWRlciBGaWVsZH1cbiAgICovXG4gIEFMUE46IFwiQUxQTlwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBBbHQtU3ZjXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzc4MzggfCBSRkMgNzgzODogSFRUUCBBbHRlcm5hdGl2ZSBTZXJ2aWNlc31cbiAgICovXG4gIEFsdFN2YzogXCJBbHQtU3ZjXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEFsdC1Vc2VkXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzc4MzggfCBSRkMgNzgzODogSFRUUCBBbHRlcm5hdGl2ZSBTZXJ2aWNlc31cbiAgICovXG4gIEFsdFVzZWQ6IFwiQWx0LVVzZWRcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQWx0ZXJuYXRlc1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmMyMjk1IHwgUkZDIDIyOTU6IFRyYW5zcGFyZW50IENvbnRlbnQgTmVnb3RpYXRpb24gaW4gSFRUUH1cbiAgICovXG4gIEFsdGVybmF0ZXM6IFwiQWx0ZXJuYXRlc1wiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBBcHBseS1Uby1SZWRpcmVjdC1SZWZcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNDQzNyB8IFJGQyA0NDM3OiBXZWIgRGlzdHJpYnV0ZWQgQXV0aG9yaW5nIGFuZCBWZXJzaW9uaW5nIChXZWJEQVYpIFJlZGlyZWN0IFJlZmVyZW5jZSBSZXNvdXJjZXN9XG4gICAqL1xuICBBcHBseVRvUmVkaXJlY3RSZWY6IFwiQXBwbHktVG8tUmVkaXJlY3QtUmVmXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEF1dGhlbnRpY2F0aW9uLUNvbnRyb2xcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjODA1MyB8IFJGQyA4MDUzLCBTZWN0aW9uIDQ6IEhUVFAgQXV0aGVudGljYXRpb24gRXh0ZW5zaW9ucyBmb3IgSW50ZXJhY3RpdmUgQ2xpZW50c31cbiAgICovXG4gIEF1dGhlbnRpY2F0aW9uQ29udHJvbDogXCJBdXRoZW50aWNhdGlvbi1Db250cm9sXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEF1dGhlbnRpY2F0aW9uLUluZm9cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gMTEuNi4zOiBIVFRQIFNlbWFudGljc31cbiAgICovXG4gIEF1dGhlbnRpY2F0aW9uSW5mbzogXCJBdXRoZW50aWNhdGlvbi1JbmZvXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEF1dGhvcml6YXRpb25cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gMTEuNi4yOiBIVFRQIFNlbWFudGljc31cbiAgICovXG4gIEF1dGhvcml6YXRpb246IFwiQXV0aG9yaXphdGlvblwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBDYWNoZS1Db250cm9sXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTEgfCBSRkM5MTExLCBTZWN0aW9uIDUuMn1cbiAgICovXG4gIENhY2hlQ29udHJvbDogXCJDYWNoZS1Db250cm9sXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIENhY2hlLVN0YXR1c1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MjExIHwgUkZDOTIxMTogVGhlIENhY2hlLVN0YXR1cyBIVFRQIFJlc3BvbnNlIEhlYWRlciBGaWVsZH1cbiAgICovXG4gIENhY2hlU3RhdHVzOiBcIkNhY2hlLVN0YXR1c1wiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBDYWwtTWFuYWdlZC1JRFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM4NjA3IHwgUkZDIDg2MDcsIFNlY3Rpb24gNS4xOiBDYWxlbmRhcmluZyBFeHRlbnNpb25zIHRvIFdlYkRBViAoQ2FsREFWKTogTWFuYWdlZCBBdHRhY2htZW50c31cbiAgICovXG4gIENhbE1hbmFnZWRJZDogXCJDYWwtTWFuYWdlZC1JRFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBDYWxEQVYtVGltZXpvbmVzXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzc4MDkgfCBSRkMgNzgwOSwgU2VjdGlvbiA3LjE6IENhbGVuZGFyaW5nIEV4dGVuc2lvbnMgdG8gV2ViREFWIChDYWxEQVYpOiBUaW1lIFpvbmVzIGJ5IFJlZmVyZW5jZX1cbiAgICovXG4gIENhbGRhdlRpbWV6b25lczogXCJDYWxEQVYtVGltZXpvbmVzXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIENhcHN1bGUtUHJvdG9jb2xcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTI5NyB8IFJGQzkyOTd9XG4gICAqL1xuICBDYXBzdWxlUHJvdG9jb2w6IFwiQ2Fwc3VsZS1Qcm90b2NvbFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBDRE4tQ2FjaGUtQ29udHJvbFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MjEzIHwgUkZDOTIxMzogVGFyZ2V0ZWQgSFRUUCBDYWNoZSBDb250cm9sfVxuICAgKi9cbiAgQ2RuQ2FjaGVDb250cm9sOiBcIkNETi1DYWNoZS1Db250cm9sXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIENETi1Mb29wXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzg1ODYgfCBSRkMgODU4NjogTG9vcCBEZXRlY3Rpb24gaW4gQ29udGVudCBEZWxpdmVyeSBOZXR3b3JrcyAoQ0ROcyl9XG4gICAqL1xuICBDZG5Mb29wOiBcIkNETi1Mb29wXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIENlcnQtTm90LUFmdGVyXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzg3MzkgfCBSRkMgODczOSwgU2VjdGlvbiAzLjM6IFN1cHBvcnQgZm9yIFNob3J0LVRlcm0sIEF1dG9tYXRpY2FsbHkgUmVuZXdlZCAoU1RBUikgQ2VydGlmaWNhdGVzIGluIHRoZSBBdXRvbWF0ZWQgQ2VydGlmaWNhdGUgTWFuYWdlbWVudCBFbnZpcm9ubWVudCAoQUNNRSl9XG4gICAqL1xuICBDZXJ0Tm90QWZ0ZXI6IFwiQ2VydC1Ob3QtQWZ0ZXJcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQ2VydC1Ob3QtQmVmb3JlXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzg3MzkgfCBSRkMgODczOSwgU2VjdGlvbiAzLjM6IFN1cHBvcnQgZm9yIFNob3J0LVRlcm0sIEF1dG9tYXRpY2FsbHkgUmVuZXdlZCAoU1RBUikgQ2VydGlmaWNhdGVzIGluIHRoZSBBdXRvbWF0ZWQgQ2VydGlmaWNhdGUgTWFuYWdlbWVudCBFbnZpcm9ubWVudCAoQUNNRSl9XG4gICAqL1xuICBDZXJ0Tm90QmVmb3JlOiBcIkNlcnQtTm90LUJlZm9yZVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBDbGVhci1TaXRlLURhdGFcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93My5vcmcvVFIvY2xlYXItc2l0ZS1kYXRhLyNoZWFkZXIgfCBDbGVhciBTaXRlIERhdGF9XG4gICAqL1xuICBDbGVhclNpdGVEYXRhOiBcIkNsZWFyLVNpdGUtRGF0YVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBDbGllbnQtQ2VydFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5NDQwIHwgUkZDOTQ0MCwgU2VjdGlvbiAyOiBDbGllbnQtQ2VydCBIVFRQIEhlYWRlciBGaWVsZH1cbiAgICovXG4gIENsaWVudENlcnQ6IFwiQ2xpZW50LUNlcnRcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQ2xpZW50LUNlcnQtQ2hhaW5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTQ0MCB8IFJGQzk0NDAsIFNlY3Rpb24gMjogQ2xpZW50LUNlcnQgSFRUUCBIZWFkZXIgRmllbGR9XG4gICAqL1xuICBDbGllbnRDZXJ0Q2hhaW46IFwiQ2xpZW50LUNlcnQtQ2hhaW5cIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQ2xvc2VcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMiB8IFJGQzkxMTIsIFNlY3Rpb24gOS42OiBIVFRQLzEuMX1cbiAgICovXG4gIENsb3NlOiBcIkNsb3NlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIENvbm5lY3Rpb25cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gNy42LjE6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgQ29ubmVjdGlvbjogXCJDb25uZWN0aW9uXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIENvbnRlbnQtRGlnZXN0XG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL2RyYWZ0LWlldGYtaHR0cGJpcy1kaWdlc3QtaGVhZGVycy0xMyB8IFJGQy1pZXRmLWh0dHBiaXMtZGlnZXN0LWhlYWRlcnMtMTMsIFNlY3Rpb24gMjogRGlnZXN0IEZpZWxkc31cbiAgICovXG4gIENvbnRlbnREaWdlc3Q6IFwiQ29udGVudC1EaWdlc3RcIixcblxuICAvKipcbiAqIEhUVFAgSGVhZGVyIENvbnRlbnQtRGlzcG9zaXRpb25cbiAqXG4gKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM2MjY2IHwgUkZDIDYyNjY6IFVzZSBvZiB0aGUgQ29udGVudC1EaXNwb3NpdGlvbiBIZWFkZXIgRmllbGQgaW4gdGhlXG4gICAgICAgIEh5cGVydGV4dCBUcmFuc2ZlciBQcm90b2NvbCAoSFRUUCl9XG4gKi9cbiAgQ29udGVudERpc3Bvc2l0aW9uOiBcIkNvbnRlbnQtRGlzcG9zaXRpb25cIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQ29udGVudC1FbmNvZGluZ1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiA4LjQ6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgQ29udGVudEVuY29kaW5nOiBcIkNvbnRlbnQtRW5jb2RpbmdcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQ29udGVudC1MYW5ndWFnZVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiA4LjU6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgQ29udGVudExhbmd1YWdlOiBcIkNvbnRlbnQtTGFuZ3VhZ2VcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQ29udGVudC1MZW5ndGhcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gOC42OiBIVFRQIFNlbWFudGljc31cbiAgICovXG4gIENvbnRlbnRMZW5ndGg6IFwiQ29udGVudC1MZW5ndGhcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQ29udGVudC1Mb2NhdGlvblxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiA4Ljc6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgQ29udGVudExvY2F0aW9uOiBcIkNvbnRlbnQtTG9jYXRpb25cIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQ29udGVudC1SYW5nZVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiAxNC40OiBIVFRQIFNlbWFudGljc31cbiAgICovXG4gIENvbnRlbnRSYW5nZTogXCJDb250ZW50LVJhbmdlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIENvbnRlbnQtU2VjdXJpdHktUG9saWN5XG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9DU1AvI2NzcC1oZWFkZXIgfCBDb250ZW50IFNlY3VyaXR5IFBvbGljeSBMZXZlbCAzfVxuICAgKi9cbiAgQ29udGVudFNlY3VyaXR5UG9saWN5OiBcIkNvbnRlbnQtU2VjdXJpdHktUG9saWN5XCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIENvbnRlbnQtU2VjdXJpdHktUG9saWN5LVJlcG9ydC1Pbmx5XG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LnczLm9yZy9UUi9DU1AvI2NzcHJvLWhlYWRlciB8IENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IExldmVsIDN9XG4gICAqL1xuICBDb250ZW50U2VjdXJpdHlQb2xpY3lSZXBvcnRPbmx5OiBcIkNvbnRlbnQtU2VjdXJpdHktUG9saWN5LVJlcG9ydC1Pbmx5XCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIENvbnRlbnQtVHlwZVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiA4LjM6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgQ29udGVudFR5cGU6IFwiQ29udGVudC1UeXBlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIENvb2tpZVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM2MjY1IHwgUkZDIDYyNjU6IEhUVFAgU3RhdGUgTWFuYWdlbWVudCBNZWNoYW5pc219XG4gICAqL1xuICBDb29raWU6IFwiQ29va2llXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIENyb3NzLU9yaWdpbi1FbWJlZGRlci1Qb2xpY3lcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvb3JpZ2luLmh0bWwjY3Jvc3Mtb3JpZ2luLWVtYmVkZGVyLXBvbGljeSB8IEhUTUx9XG4gICAqL1xuICBDcm9zc09yaWdpbkVtYmVkZGVyUG9saWN5OiBcIkNyb3NzLU9yaWdpbi1FbWJlZGRlci1Qb2xpY3lcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgQ3Jvc3MtT3JpZ2luLUVtYmVkZGVyLVBvbGljeS1SZXBvcnQtT25seVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9vcmlnaW4uaHRtbCNjcm9zcy1vcmlnaW4tZW1iZWRkZXItcG9saWN5LXJlcG9ydC1vbmx5IHwgSFRNTH1cbiAgICovXG4gIENyb3NzT3JpZ2luRW1iZWRkZXJQb2xpY3lSZXBvcnRPbmx5OlxuICAgIFwiQ3Jvc3MtT3JpZ2luLUVtYmVkZGVyLVBvbGljeS1SZXBvcnQtT25seVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBDcm9zcy1PcmlnaW4tT3BlbmVyLVBvbGljeVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9vcmlnaW4uaHRtbCNjcm9zcy1vcmlnaW4tb3BlbmVyLXBvbGljeS0yIHwgSFRNTH1cbiAgICovXG4gIENyb3NzT3JpZ2luT3BlbmVyUG9saWN5OiBcIkNyb3NzLU9yaWdpbi1PcGVuZXItUG9saWN5XCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIENyb3NzLU9yaWdpbi1PcGVuZXItUG9saWN5LVJlcG9ydC1Pbmx5XG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL29yaWdpbi5odG1sI2Nyb3NzLW9yaWdpbi1vcGVuZXItcG9saWN5LXJlcG9ydC1vbmx5IHwgSFRNTH1cbiAgICovXG4gIENyb3NzT3JpZ2luT3BlbmVyUG9saWN5UmVwb3J0T25seTogXCJDcm9zcy1PcmlnaW4tT3BlbmVyLVBvbGljeS1SZXBvcnQtT25seVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBDcm9zcy1PcmlnaW4tUmVzb3VyY2UtUG9saWN5XG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNjcm9zcy1vcmlnaW4tcmVzb3VyY2UtcG9saWN5LWhlYWRlciB8IEZldGNofVxuICAgKi9cbiAgQ3Jvc3NPcmlnaW5SZXNvdXJjZVBvbGljeTogXCJDcm9zcy1PcmlnaW4tUmVzb3VyY2UtUG9saWN5XCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIERBU0xcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNTMyMyB8IFJGQyA1MzIzOiBXZWIgRGlzdHJpYnV0ZWQgQXV0aG9yaW5nIGFuZCBWZXJzaW9uaW5nIChXZWJEQVYpIFNFQVJDSH1cbiAgICovXG4gIERBU0w6IFwiREFTTFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBEYXRlXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTAgfCBSRkM5MTEwLCBTZWN0aW9uIDYuNi4xOiBIVFRQIFNlbWFudGljc31cbiAgICovXG4gIERhdGU6IFwiRGF0ZVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBEQVZcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNDkxOCB8IFJGQyA0OTE4OiBIVFRQIEV4dGVuc2lvbnMgZm9yIFdlYiBEaXN0cmlidXRlZCBBdXRob3JpbmcgYW5kIFZlcnNpb25pbmcgKFdlYkRBVil9XG4gICAqL1xuICBEQVY6IFwiREFWXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIERlbHRhLUJhc2VcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjMzIyOSB8IFJGQyAzMjI5OiBEZWx0YSBlbmNvZGluZyBpbiBIVFRQfVxuICAgKi9cbiAgRGVsdGFCYXNlOiBcIkRlbHRhLUJhc2VcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgRGVwdGhcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNDkxOCB8IFJGQyA0OTE4OiBIVFRQIEV4dGVuc2lvbnMgZm9yIFdlYiBEaXN0cmlidXRlZCBBdXRob3JpbmcgYW5kIFZlcnNpb25pbmcgKFdlYkRBVil9XG4gICAqL1xuICBEZXB0aDogXCJEZXB0aFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBEZXN0aW5hdGlvblxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM0OTE4IHwgUkZDIDQ5MTg6IEhUVFAgRXh0ZW5zaW9ucyBmb3IgV2ViIERpc3RyaWJ1dGVkIEF1dGhvcmluZyBhbmQgVmVyc2lvbmluZyAoV2ViREFWKX1cbiAgICovXG4gIERlc3RpbmF0aW9uOiBcIkRlc3RpbmF0aW9uXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIERQb1BcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTQ0OSB8IFJGQzk0NDk6IE9BdXRoIDIuMCBEZW1vbnN0cmF0aW5nIFByb29mIG9mIFBvc3Nlc3Npb24gKERQb1ApfVxuICAgKi9cbiAgRFBvUDogXCJEUG9QXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIERQb1AtTm9uY2VcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTQ0OSB8IFJGQzk0NDk6IE9BdXRoIDIuMCBEZW1vbnN0cmF0aW5nIFByb29mIG9mIFBvc3Nlc3Npb24gKERQb1ApfVxuICAgKi9cbiAgRHBvcE5vbmNlOiBcIkRQb1AtTm9uY2VcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgRWFybHktRGF0YVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM4NDcwIHwgUkZDIDg0NzA6IFVzaW5nIEVhcmx5IERhdGEgaW4gSFRUUH1cbiAgICovXG4gIEVhcmx5RGF0YTogXCJFYXJseS1EYXRhXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEVUYWdcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gOC44LjM6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgRVRhZzogXCJFVGFnXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEV4cGVjdFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiAxMC4xLjE6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgRXhwZWN0OiBcIkV4cGVjdFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBFeHBpcmVzXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTEgfCBSRkM5MTExLCBTZWN0aW9uIDUuMzogSFRUUCBDYWNoaW5nfVxuICAgKi9cbiAgRXhwaXJlczogXCJFeHBpcmVzXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEZvcndhcmRlZFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM3MjM5IHwgUkZDIDcyMzk6IEZvcndhcmRlZCBIVFRQIEV4dGVuc2lvbn1cbiAgICovXG4gIEZvcndhcmRlZDogXCJGb3J3YXJkZWRcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgRnJvbVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiAxMC4xLjI6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgRnJvbTogXCJGcm9tXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEhvYmFyZWdcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNzQ4NiB8IFJGQyA3NDg2LCBTZWN0aW9uIDYuMS4xOiBIVFRQIE9yaWdpbi1Cb3VuZCBBdXRoZW50aWNhdGlvbiAoSE9CQSl9XG4gICAqL1xuICBIb2JhcmVnOiBcIkhvYmFyZWdcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgSG9zdFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiA3LjI6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgSG9zdDogXCJIb3N0XCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIElmXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzQ5MTggfCBSRkMgNDkxODogSFRUUCBFeHRlbnNpb25zIGZvciBXZWIgRGlzdHJpYnV0ZWQgQXV0aG9yaW5nIGFuZCBWZXJzaW9uaW5nIChXZWJEQVYpfVxuICAgKi9cbiAgSWY6IFwiSWZcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgSWYtTWF0Y2hcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gMTMuMS4xOiBIVFRQIFNlbWFudGljc31cbiAgICovXG4gIElmTWF0Y2g6IFwiSWYtTWF0Y2hcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgSWYtTW9kaWZpZWQtU2luY2VcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gMTMuMS4zOiBIVFRQIFNlbWFudGljc31cbiAgICovXG4gIElmTW9kaWZpZWRTaW5jZTogXCJJZi1Nb2RpZmllZC1TaW5jZVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBJZi1Ob25lLU1hdGNoXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTAgfCBSRkM5MTEwLCBTZWN0aW9uIDEzLjEuMjogSFRUUCBTZW1hbnRpY3N9XG4gICAqL1xuICBJZk5vbmVNYXRjaDogXCJJZi1Ob25lLU1hdGNoXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIElmLVJhbmdlXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTAgfCBSRkM5MTEwLCBTZWN0aW9uIDEzLjEuNTogSFRUUCBTZW1hbnRpY3N9XG4gICAqL1xuICBJZlJhbmdlOiBcIklmLVJhbmdlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIElmLVNjaGVkdWxlLVRhZy1NYXRjaFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM2NjM4IHwgIFJGQyA2MzM4OiBTY2hlZHVsaW5nIEV4dGVuc2lvbnMgdG8gQ2FsREFWfVxuICAgKi9cbiAgSWZTY2hlZHVsZVRhZ01hdGNoOiBcIklmLVNjaGVkdWxlLVRhZy1NYXRjaFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBJZi1Vbm1vZGlmaWVkLVNpbmNlXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTAgfCBSRkM5MTEwLCBTZWN0aW9uIDEzLjEuNDogSFRUUCBTZW1hbnRpY3N9XG4gICAqL1xuICBJZlVubW9kaWZpZWRTaW5jZTogXCJJZi1Vbm1vZGlmaWVkLVNpbmNlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIElNXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzMyMjkgfCBSRkMgMzIyOTogRGVsdGEgZW5jb2RpbmcgaW4gSFRUUH1cbiAgICovXG4gIElNOiBcIklNXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEluY2x1ZGUtUmVmZXJyZWQtVG9rZW4tQmluZGluZy1JRFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM4NDczIHwgUkZDIDg0NzM6IFRva2VuIEJpbmRpbmcgb3ZlciBIVFRQfVxuICAgKi9cbiAgSW5jbHVkZVJlZmVycmVkVG9rZW5CaW5kaW5nSWQ6IFwiSW5jbHVkZS1SZWZlcnJlZC1Ub2tlbi1CaW5kaW5nLUlEXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIEtlZXAtQWxpdmVcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjMjA2OCB8IFJGQyAyMDY4OiBIeXBlcnRleHQgVHJhbnNmZXIgUHJvdG9jb2wgLS0gSFRUUC8xLjF9XG4gICAqL1xuICBLZWVwQWxpdmU6IFwiS2VlcC1BbGl2ZVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBMYWJlbFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmMzMjUzIHwgUkZDIDMyNTM6IFZlcnNpb25pbmcgRXh0ZW5zaW9ucyB0byBXZWJEQVY6IChXZWIgRGlzdHJpYnV0ZWQgQXV0aG9yaW5nIGFuZCBWZXJzaW9uaW5nKX1cbiAgICovXG4gIExhYmVsOiBcIkxhYmVsXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIExhc3QtRXZlbnQtSURcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2Uvc2VydmVyLXNlbnQtZXZlbnRzLmh0bWwjbGFzdC1ldmVudC1pZCB8IEhUTUx9XG4gICAqL1xuICBMYXN0RXZlbnRJZDogXCJMYXN0LUV2ZW50LUlEXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIExhc3QtTW9kaWZpZWRcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gOC44LjI6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgTGFzdE1vZGlmaWVkOiBcIkxhc3QtTW9kaWZpZWRcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgTGlua1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM4Mjg4IHwgUkZDIDgyODg6IFdlYiBMaW5raW5nfVxuICAgKi9cbiAgTGluazogXCJMaW5rXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIExvY2F0aW9uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTAgfCBSRkM5MTEwLCBTZWN0aW9uIDEwLjIuMjogSFRUUCBTZW1hbnRpY3N9XG4gICAqL1xuICBMb2NhdGlvbjogXCJMb2NhdGlvblwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBMb2NrLVRva2VuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzQ5MTggfCBSRkMgNDkxODogSFRUUCBFeHRlbnNpb25zIGZvciBXZWIgRGlzdHJpYnV0ZWQgQXV0aG9yaW5nIGFuZCBWZXJzaW9uaW5nIChXZWJEQVYpfVxuICAgKi9cbiAgTG9ja1Rva2VuOiBcIkxvY2stVG9rZW5cIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgTWF4LUZvcndhcmRzXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTAgfCBSRkM5MTEwLCBTZWN0aW9uIDcuNi4yOiBIVFRQIFNlbWFudGljc31cbiAgICovXG4gIE1heEZvcndhcmRzOiBcIk1heC1Gb3J3YXJkc1wiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBNZW1lbnRvLURhdGV0aW1lXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzcwODkgfCBSRkMgNzA4OTogSFRUUCBGcmFtZXdvcmsgZm9yIFRpbWUtQmFzZWQgQWNjZXNzIHRvIFJlc291cmNlIFN0YXRlcyAtLSBNZW1lbnRvfVxuICAgKi9cbiAgTWVtZW50b0RhdGV0aW1lOiBcIk1lbWVudG8tRGF0ZXRpbWVcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgTWV0ZXJcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjMjIyNyB8IFJGQyAyMjI3OiBTaW1wbGUgSGl0LU1ldGVyaW5nIGFuZCBVc2FnZS1MaW1pdGluZyBmb3IgSFRUUH1cbiAgICovXG4gIE1ldGVyOiBcIk1ldGVyXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIE1JTUUtVmVyc2lvblxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEyIHwgUkZDOTExMiwgQXBwZW5kaXggQi4xOiBIVFRQLzEuMX1cbiAgICovXG4gIE1pbWVWZXJzaW9uOiBcIk1JTUUtVmVyc2lvblwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBOZWdvdGlhdGVcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjMjI5NSB8IFJGQyAyMjk1OiBUcmFuc3BhcmVudCBDb250ZW50IE5lZ290aWF0aW9uIGluIEhUVFB9XG4gICAqL1xuICBOZWdvdGlhdGU6IFwiTmVnb3RpYXRlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIE5FTFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy53My5vcmcvVFIvbmV0d29yay1lcnJvci1sb2dnaW5nLyB8IE5ldHdvcmsgRXJyb3IgTG9nZ2luZ31cbiAgICovXG4gIE5FTDogXCJORUxcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgT0RhdGEtRW50aXR5SWRcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvb2RhdGEvb2RhdGEvdjQuMDEvY3NwcmQwNS9wYXJ0MS1wcm90b2NvbC9vZGF0YS12NC4wMS1jc3ByZDA1LXBhcnQxLXByb3RvY29sLmh0bWwjX1RvYzE0MTcyNzM1IHwgT0RhdGEgVmVyc2lvbiA0LjAxIFBhcnQgMTogUHJvdG9jb2x9XG4gICAqIEBzZWUge0BsaW5rICNPQVNJUyB8IE9BU0lTfVxuICAgKiBAc2VlIHtAbGluayAjQ2hldF9FbnNpZ24gfCBDaGV0X0Vuc2lnbn1cbiAgICovXG4gIE9kYXRhRW50aXR5aWQ6IFwiT0RhdGEtRW50aXR5SWRcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgT0RhdGEtSXNvbGF0aW9uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL29kYXRhL29kYXRhL3Y0LjAxL29kYXRhLXY0LjAxLXBhcnQxLXByb3RvY29sLmh0bWwjc2VjX0hlYWRlcklzb2xhdGlvbk9EYXRhSXNvbGF0aW9uIHwgT0RhdGEgVmVyc2lvbiA0LjAxIFBhcnQgMTogUHJvdG9jb2x9XG4gICAqIEBzZWUge0BsaW5rICNPQVNJUyB8IE9BU0lTfVxuICAgKiBAc2VlIHtAbGluayAjQ2hldF9FbnNpZ24gfCBDaGV0X0Vuc2lnbn1cbiAgICovXG4gIE9kYXRhSXNvbGF0aW9uOiBcIk9EYXRhLUlzb2xhdGlvblwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBPRGF0YS1NYXhWZXJzaW9uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL29kYXRhL29kYXRhL3Y0LjAxL29kYXRhLXY0LjAxLXBhcnQxLXByb3RvY29sLmh0bWwjc2VjX0hlYWRlck9EYXRhTWF4VmVyc2lvbiB8IE9EYXRhIFZlcnNpb24gNC4wMSBQYXJ0IDE6IFByb3RvY29sfVxuICAgKiBAc2VlIHtAbGluayAjT0FTSVMgfCBPQVNJU31cbiAgICogQHNlZSB7QGxpbmsgI0NoZXRfRW5zaWduIHwgQ2hldF9FbnNpZ259XG4gICAqL1xuICBPZGF0YU1heHZlcnNpb246IFwiT0RhdGEtTWF4VmVyc2lvblwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBPRGF0YS1WZXJzaW9uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL29kYXRhL29kYXRhL3Y0LjAxL29kYXRhLXY0LjAxLXBhcnQxLXByb3RvY29sLmh0bWwjc2VjX0hlYWRlck9EYXRhVmVyc2lvbiB8IE9EYXRhIFZlcnNpb24gNC4wMSBQYXJ0IDE6IFByb3RvY29sfVxuICAgKiBAc2VlIHtAbGluayAjT0FTSVMgfCBPQVNJU31cbiAgICogQHNlZSB7QGxpbmsgI0NoZXRfRW5zaWduIHwgQ2hldF9FbnNpZ259XG4gICAqL1xuICBPZGF0YVZlcnNpb246IFwiT0RhdGEtVmVyc2lvblwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBPcHRpb25hbC1XV1ctQXV0aGVudGljYXRlXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzgwNTMgfCBSRkMgODA1MywgU2VjdGlvbiAzOiBIVFRQIEF1dGhlbnRpY2F0aW9uIEV4dGVuc2lvbnMgZm9yIEludGVyYWN0aXZlIENsaWVudHN9XG4gICAqL1xuICBPcHRpb25hbFd3d0F1dGhlbnRpY2F0ZTogXCJPcHRpb25hbC1XV1ctQXV0aGVudGljYXRlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIE9yZGVyaW5nLVR5cGVcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjMzY0OCB8IFJGQyAzNjQ4OiBXZWIgRGlzdHJpYnV0ZWQgQXV0aG9yaW5nIGFuZCBWZXJzaW9uaW5nIChXZWJEQVYpIE9yZGVyZWQgQ29sbGVjdGlvbnMgUHJvdG9jb2x9XG4gICAqL1xuICBPcmRlcmluZ1R5cGU6IFwiT3JkZXJpbmctVHlwZVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBPcmlnaW5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNjQ1NCB8IFJGQyA2NDU0OiBUaGUgV2ViIE9yaWdpbiBDb25jZXB0fVxuICAgKi9cbiAgT3JpZ2luOiBcIk9yaWdpblwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBPcmlnaW4tQWdlbnQtQ2x1c3RlclxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9vcmlnaW4uaHRtbCNvcmlnaW4tYWdlbnQtY2x1c3RlciB8IEhUTUx9XG4gICAqL1xuICBPcmlnaW5BZ2VudENsdXN0ZXI6IFwiT3JpZ2luLUFnZW50LUNsdXN0ZXJcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgT1NDT1JFXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzg2MTMgfCBSRkMgODYxMywgU2VjdGlvbiAxMS4xOiBPYmplY3QgU2VjdXJpdHkgZm9yIENvbnN0cmFpbmVkIFJFU1RmdWwgRW52aXJvbm1lbnRzIChPU0NPUkUpfVxuICAgKi9cbiAgT1NDT1JFOiBcIk9TQ09SRVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBPU0xDLUNvcmUtVmVyc2lvblxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL2RvY3Mub2FzaXMtb3Blbi1wcm9qZWN0cy5vcmcvb3NsYy1vcC9jb3JlL3YzLjAvb3NsYy1jb3JlLmh0bWwgfCBPQVNJUyBQcm9qZWN0IFNwZWNpZmljYXRpb24gMDF9XG4gICAqIEBzZWUge0BsaW5rICNPQVNJUyB8IE9BU0lTfVxuICAgKiBAc2VlIHtAbGluayAjQ2hldF9FbnNpZ24gfCBDaGV0X0Vuc2lnbn1cbiAgICovXG4gIE9zbGNDb3JlVmVyc2lvbjogXCJPU0xDLUNvcmUtVmVyc2lvblwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBPdmVyd3JpdGVcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNDkxOCB8IFJGQyA0OTE4OiBIVFRQIEV4dGVuc2lvbnMgZm9yIFdlYiBEaXN0cmlidXRlZCBBdXRob3JpbmcgYW5kIFZlcnNpb25pbmcgKFdlYkRBVil9XG4gICAqL1xuICBPdmVyd3JpdGU6IFwiT3ZlcndyaXRlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFBpbmctRnJvbVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9saW5rcy5odG1sI3BpbmctZnJvbSB8IEhUTUx9XG4gICAqL1xuICBQaW5nRnJvbTogXCJQaW5nLUZyb21cIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgUGluZy1Ub1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS9saW5rcy5odG1sI3BpbmctdG8gfCBIVE1MfVxuICAgKi9cbiAgUGluZ1RvOiBcIlBpbmctVG9cIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgUG9zaXRpb25cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjMzY0OCB8IFJGQyAzNjQ4OiBXZWIgRGlzdHJpYnV0ZWQgQXV0aG9yaW5nIGFuZCBWZXJzaW9uaW5nIChXZWJEQVYpIE9yZGVyZWQgQ29sbGVjdGlvbnMgUHJvdG9jb2x9XG4gICAqL1xuICBQb3NpdGlvbjogXCJQb3NpdGlvblwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBQcmVmZXJcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNzI0MCB8IFJGQyA3MjQwOiBQcmVmZXIgSGVhZGVyIGZvciBIVFRQfVxuICAgKi9cbiAgUHJlZmVyOiBcIlByZWZlclwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBQcmVmZXJlbmNlLUFwcGxpZWRcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNzI0MCB8IFJGQyA3MjQwOiBQcmVmZXIgSGVhZGVyIGZvciBIVFRQfVxuICAgKi9cbiAgUHJlZmVyZW5jZUFwcGxpZWQ6IFwiUHJlZmVyZW5jZS1BcHBsaWVkXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFByaW9yaXR5XG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkyMTggfCBSRkM5MjE4OiBFeHRlbnNpYmxlIFByaW9yaXRpemF0aW9uIFNjaGVtZSBmb3IgSFRUUH1cbiAgICovXG4gIFByaW9yaXR5OiBcIlByaW9yaXR5XCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFByb3h5LUF1dGhlbnRpY2F0ZVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiAxMS43LjE6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgUHJveHlBdXRoZW50aWNhdGU6IFwiUHJveHktQXV0aGVudGljYXRlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFByb3h5LUF1dGhlbnRpY2F0aW9uLUluZm9cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gMTEuNy4zOiBIVFRQIFNlbWFudGljc31cbiAgICovXG4gIFByb3h5QXV0aGVudGljYXRpb25JbmZvOiBcIlByb3h5LUF1dGhlbnRpY2F0aW9uLUluZm9cIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgUHJveHktQXV0aG9yaXphdGlvblxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiAxMS43LjI6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgUHJveHlBdXRob3JpemF0aW9uOiBcIlByb3h5LUF1dGhvcml6YXRpb25cIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgUHJveHktU3RhdHVzXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkyMDkgfCBSRkM5MjA5OiBUaGUgUHJveHktU3RhdHVzIEhUVFAgUmVzcG9uc2UgSGVhZGVyIEZpZWxkfVxuICAgKi9cbiAgUHJveHlTdGF0dXM6IFwiUHJveHktU3RhdHVzXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFB1YmxpYy1LZXktUGluc1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM3NDY5IHwgUkZDIDc0Njk6IFB1YmxpYyBLZXkgUGlubmluZyBFeHRlbnNpb24gZm9yIEhUVFB9XG4gICAqL1xuICBQdWJsaWNLZXlQaW5zOiBcIlB1YmxpYy1LZXktUGluc1wiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBQdWJsaWMtS2V5LVBpbnMtUmVwb3J0LU9ubHlcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNzQ2OSB8IFJGQyA3NDY5OiBQdWJsaWMgS2V5IFBpbm5pbmcgRXh0ZW5zaW9uIGZvciBIVFRQfVxuICAgKi9cbiAgUHVibGljS2V5UGluc1JlcG9ydE9ubHk6IFwiUHVibGljLUtleS1QaW5zLVJlcG9ydC1Pbmx5XCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFJhbmdlXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTAgfCBSRkM5MTEwLCBTZWN0aW9uIDE0LjI6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgUmFuZ2U6IFwiUmFuZ2VcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgUmVkaXJlY3QtUmVmXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzQ0MzcgfCBSRkMgNDQzNzogV2ViIERpc3RyaWJ1dGVkIEF1dGhvcmluZyBhbmQgVmVyc2lvbmluZyAoV2ViREFWKSBSZWRpcmVjdCBSZWZlcmVuY2UgUmVzb3VyY2VzfVxuICAgKi9cbiAgUmVkaXJlY3RSZWY6IFwiUmVkaXJlY3QtUmVmXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFJlZmVyZXJcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gMTAuMS4zOiBIVFRQIFNlbWFudGljc31cbiAgICovXG4gIFJlZmVyZXI6IFwiUmVmZXJlclwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBSZWZyZXNoXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Jyb3dzaW5nLXRoZS13ZWIuaHRtbCNyZWZyZXNoIHwgSFRNTH1cbiAgICovXG4gIFJlZnJlc2g6IFwiUmVmcmVzaFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBSZXBsYXktTm9uY2VcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjODU1NSB8IFJGQyA4NTU1LCBTZWN0aW9uIDYuNS4xOiBBdXRvbWF0aWMgQ2VydGlmaWNhdGUgTWFuYWdlbWVudCBFbnZpcm9ubWVudCAoQUNNRSl9XG4gICAqL1xuICBSZXBsYXlOb25jZTogXCJSZXBsYXktTm9uY2VcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgUmVwci1EaWdlc3RcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vZHJhZnQtaWV0Zi1odHRwYmlzLWRpZ2VzdC1oZWFkZXJzLTEzIHwgUkZDLWlldGYtaHR0cGJpcy1kaWdlc3QtaGVhZGVycy0xMywgU2VjdGlvbiAzOiBEaWdlc3QgRmllbGRzfVxuICAgKi9cbiAgUmVwckRpZ2VzdDogXCJSZXByLURpZ2VzdFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBSZXRyeS1BZnRlclxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiAxMC4yLjM6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgUmV0cnlBZnRlcjogXCJSZXRyeS1BZnRlclwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBTY2hlZHVsZS1SZXBseVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM2NjM4IHwgUkZDIDY2Mzg6IFNjaGVkdWxpbmcgRXh0ZW5zaW9ucyB0byBDYWxEQVZ9XG4gICAqL1xuICBTY2hlZHVsZVJlcGx5OiBcIlNjaGVkdWxlLVJlcGx5XCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFNjaGVkdWxlLVRhZ1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM2NjM4IHwgUkZDIDYzMzg6IFNjaGVkdWxpbmcgRXh0ZW5zaW9ucyB0byBDYWxEQVZ9XG4gICAqL1xuICBTY2hlZHVsZVRhZzogXCJTY2hlZHVsZS1UYWdcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgU2VjLVB1cnBvc2VcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI3NlYy1wdXJwb3NlLWhlYWRlciB8IEZldGNofVxuICAgKi9cbiAgU2VjUHVycG9zZTogXCJTZWMtUHVycG9zZVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBTZWMtVG9rZW4tQmluZGluZ1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM4NDczIHwgUkZDIDg0NzM6IFRva2VuIEJpbmRpbmcgb3ZlciBIVFRQfVxuICAgKi9cbiAgU2VjVG9rZW5CaW5kaW5nOiBcIlNlYy1Ub2tlbi1CaW5kaW5nXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFNlYy1XZWJTb2NrZXQtQWNjZXB0XG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzY0NTUgfCBSRkMgNjQ1NTogVGhlIFdlYlNvY2tldCBQcm90b2NvbH1cbiAgICovXG4gIFNlY1dlYnNvY2tldEFjY2VwdDogXCJTZWMtV2ViU29ja2V0LUFjY2VwdFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBTZWMtV2ViU29ja2V0LUV4dGVuc2lvbnNcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNjQ1NSB8IFJGQyA2NDU1OiBUaGUgV2ViU29ja2V0IFByb3RvY29sfVxuICAgKi9cbiAgU2VjV2Vic29ja2V0RXh0ZW5zaW9uczogXCJTZWMtV2ViU29ja2V0LUV4dGVuc2lvbnNcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgU2VjLVdlYlNvY2tldC1LZXlcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNjQ1NSB8IFJGQyA2NDU1OiBUaGUgV2ViU29ja2V0IFByb3RvY29sfVxuICAgKi9cbiAgU2VjV2Vic29ja2V0S2V5OiBcIlNlYy1XZWJTb2NrZXQtS2V5XCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFNlYy1XZWJTb2NrZXQtUHJvdG9jb2xcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNjQ1NSB8IFJGQyA2NDU1OiBUaGUgV2ViU29ja2V0IFByb3RvY29sfVxuICAgKi9cbiAgU2VjV2Vic29ja2V0UHJvdG9jb2w6IFwiU2VjLVdlYlNvY2tldC1Qcm90b2NvbFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBTZWMtV2ViU29ja2V0LVZlcnNpb25cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNjQ1NSB8IFJGQyA2NDU1OiBUaGUgV2ViU29ja2V0IFByb3RvY29sfVxuICAgKi9cbiAgU2VjV2Vic29ja2V0VmVyc2lvbjogXCJTZWMtV2ViU29ja2V0LVZlcnNpb25cIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgU2VydmVyXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTAgfCBSRkM5MTEwLCBTZWN0aW9uIDEwLjIuNDogSFRUUCBTZW1hbnRpY3N9XG4gICAqL1xuICBTZXJ2ZXI6IFwiU2VydmVyXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFNlcnZlci1UaW1pbmdcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cudzMub3JnL1RSL3NlcnZlci10aW1pbmcvIHwgU2VydmVyIFRpbWluZ31cbiAgICovXG4gIFNlcnZlclRpbWluZzogXCJTZXJ2ZXItVGltaW5nXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFNldC1Db29raWVcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjNjI2NSB8IFJGQyA2MjY1OiBIVFRQIFN0YXRlIE1hbmFnZW1lbnQgTWVjaGFuaXNtfVxuICAgKi9cbiAgU2V0Q29va2llOiBcIlNldC1Db29raWVcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgU2lnbmF0dXJlXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL2RyYWZ0LWlldGYtaHR0cGJpcy1tZXNzYWdlLXNpZ25hdHVyZXMtMTkgfCBSRkMtaWV0Zi1odHRwYmlzLW1lc3NhZ2Utc2lnbmF0dXJlcy0xOSwgU2VjdGlvbiA0LjI6IEhUVFAgTWVzc2FnZSBTaWduYXR1cmVzfVxuICAgKi9cbiAgU2lnbmF0dXJlOiBcIlNpZ25hdHVyZVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBTaWduYXR1cmUtSW5wdXRcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vZHJhZnQtaWV0Zi1odHRwYmlzLW1lc3NhZ2Utc2lnbmF0dXJlcy0xOSB8IFJGQy1pZXRmLWh0dHBiaXMtbWVzc2FnZS1zaWduYXR1cmVzLTE5LCBTZWN0aW9uIDQuMTogSFRUUCBNZXNzYWdlIFNpZ25hdHVyZXN9XG4gICAqL1xuICBTaWduYXR1cmVJbnB1dDogXCJTaWduYXR1cmUtSW5wdXRcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgU0xVR1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM1MDIzIHwgUkZDIDUwMjM6IFRoZSBBdG9tIFB1Ymxpc2hpbmcgUHJvdG9jb2x9XG4gICAqL1xuICBTTFVHOiBcIlNMVUdcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgU29hcEFjdGlvblxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy53My5vcmcvVFIvMjAwMC9OT1RFLVNPQVAtMjAwMDA1MDggfCBTaW1wbGUgT2JqZWN0IEFjY2VzcyBQcm90b2NvbCAoU09BUCkgMS4xfVxuICAgKi9cbiAgU29hcEFjdGlvbjogXCJTb2FwQWN0aW9uXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFN0YXR1cy1VUklcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjMjUxOCB8IFJGQyAyNTE4OiBIVFRQIEV4dGVuc2lvbnMgZm9yIERpc3RyaWJ1dGVkIEF1dGhvcmluZyAtLSBXRUJEQVZ9XG4gICAqL1xuICBTdGF0dXNVcmk6IFwiU3RhdHVzLVVSSVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBTdHJpY3QtVHJhbnNwb3J0LVNlY3VyaXR5XG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzY3OTcgfCBSRkMgNjc5NzogSFRUUCBTdHJpY3QgVHJhbnNwb3J0IFNlY3VyaXR5IChIU1RTKX1cbiAgICovXG4gIFN0cmljdFRyYW5zcG9ydFNlY3VyaXR5OiBcIlN0cmljdC1UcmFuc3BvcnQtU2VjdXJpdHlcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgU3Vuc2V0XG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzg1OTQgfCBSRkMgODU5NDogVGhlIFN1bnNldCBIVFRQIEhlYWRlciBGaWVsZH1cbiAgICovXG4gIFN1bnNldDogXCJTdW5zZXRcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgVENOXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzIyOTUgfCBSRkMgMjI5NTogVHJhbnNwYXJlbnQgQ29udGVudCBOZWdvdGlhdGlvbiBpbiBIVFRQfVxuICAgKi9cbiAgVENOOiBcIlRDTlwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBURVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiAxMC4xLjQ6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgVEU6IFwiVEVcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgVGltZW91dFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM0OTE4IHwgUkZDIDQ5MTg6IEhUVFAgRXh0ZW5zaW9ucyBmb3IgV2ViIERpc3RyaWJ1dGVkIEF1dGhvcmluZyBhbmQgVmVyc2lvbmluZyAoV2ViREFWKX1cbiAgICovXG4gIFRpbWVvdXQ6IFwiVGltZW91dFwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBUb3BpY1xuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM4MDMwIHwgUkZDIDgwMzAsIFNlY3Rpb24gNS40OiBHZW5lcmljIEV2ZW50IERlbGl2ZXJ5IFVzaW5nIEhUVFAgUHVzaH1cbiAgICovXG4gIFRvcGljOiBcIlRvcGljXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFRyYWNlcGFyZW50XG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LnczLm9yZy9UUi90cmFjZS1jb250ZXh0LyN0cmFjZXBhcmVudC1oZWFkZXIgfCBUcmFjZSBDb250ZXh0fVxuICAgKi9cbiAgVHJhY2VwYXJlbnQ6IFwiVHJhY2VwYXJlbnRcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgVHJhY2VzdGF0ZVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy53My5vcmcvVFIvdHJhY2UtY29udGV4dC8jdHJhY2VzdGF0ZS1oZWFkZXIgfCBUcmFjZSBDb250ZXh0fVxuICAgKi9cbiAgVHJhY2VzdGF0ZTogXCJUcmFjZXN0YXRlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFRyYWlsZXJcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gNi42LjI6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgVHJhaWxlcjogXCJUcmFpbGVyXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFRyYW5zZmVyLUVuY29kaW5nXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzkxMTIgfCBSRkM5MTEyLCBTZWN0aW9uIDYuMTogSFRUUCBTZW1hbnRpY3N9XG4gICAqL1xuICBUcmFuc2ZlckVuY29kaW5nOiBcIlRyYW5zZmVyLUVuY29kaW5nXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFRUTFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM4MDMwIHwgUkZDIDgwMzAsIFNlY3Rpb24gNS4yOiBHZW5lcmljIEV2ZW50IERlbGl2ZXJ5IFVzaW5nIEhUVFAgUHVzaH1cbiAgICovXG4gIFRUTDogXCJUVExcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgVXBncmFkZVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiA3Ljg6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgVXBncmFkZTogXCJVcGdyYWRlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFVyZ2VuY3lcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjODAzMCB8IFJGQyA4MDMwLCBTZWN0aW9uIDUuMzogR2VuZXJpYyBFdmVudCBEZWxpdmVyeSBVc2luZyBIVFRQIFB1c2h9XG4gICAqL1xuICBVcmdlbmN5OiBcIlVyZ2VuY3lcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgVXNlci1BZ2VudFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9yZmM5MTEwIHwgUkZDOTExMCwgU2VjdGlvbiAxMC4xLjU6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgVXNlckFnZW50OiBcIlVzZXItQWdlbnRcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgVmFyaWFudC1WYXJ5XG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL3JmYzIyOTUgfCBSRkMgMjI5NTogVHJhbnNwYXJlbnQgQ29udGVudCBOZWdvdGlhdGlvbiBpbiBIVFRQfVxuICAgKi9cbiAgVmFyaWFudFZhcnk6IFwiVmFyaWFudC1WYXJ5XCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFZhcnlcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gMTIuNS41OiBIVFRQIFNlbWFudGljc31cbiAgICovXG4gIFZhcnk6IFwiVmFyeVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBWaWFcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gNy42LjM6IEhUVFAgU2VtYW50aWNzfVxuICAgKi9cbiAgVmlhOiBcIlZpYVwiLFxuXG4gIC8qKlxuICAgKiBIVFRQIEhlYWRlciBXYW50LUNvbnRlbnQtRGlnZXN0XG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LmlhbmEub3JnL2dvL2RyYWZ0LWlldGYtaHR0cGJpcy1kaWdlc3QtaGVhZGVycy0xMyB8IFJGQy1pZXRmLWh0dHBiaXMtZGlnZXN0LWhlYWRlcnMtMTMsIFNlY3Rpb24gNDogRGlnZXN0IEZpZWxkc31cbiAgICovXG4gIFdhbnRDb250ZW50RGlnZXN0OiBcIldhbnQtQ29udGVudC1EaWdlc3RcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgV2FudC1SZXByLURpZ2VzdFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL3d3dy5pYW5hLm9yZy9nby9kcmFmdC1pZXRmLWh0dHBiaXMtZGlnZXN0LWhlYWRlcnMtMTMgfCBSRkMtaWV0Zi1odHRwYmlzLWRpZ2VzdC1oZWFkZXJzLTEzLCBTZWN0aW9uIDQ6IERpZ2VzdCBGaWVsZHN9XG4gICAqL1xuICBXYW50UmVwckRpZ2VzdDogXCJXYW50LVJlcHItRGlnZXN0XCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFdXVy1BdXRoZW50aWNhdGVcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly93d3cuaWFuYS5vcmcvZ28vcmZjOTExMCB8IFJGQzkxMTAsIFNlY3Rpb24gMTEuNi4xOiBIVFRQIFNlbWFudGljc31cbiAgICovXG4gIFd3d0F1dGhlbnRpY2F0ZTogXCJXV1ctQXV0aGVudGljYXRlXCIsXG5cbiAgLyoqXG4gICAqIEhUVFAgSGVhZGVyIFgtQ29udGVudC1UeXBlLU9wdGlvbnNcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9mZXRjaC5zcGVjLndoYXR3Zy5vcmcvI3gtY29udGVudC10eXBlLW9wdGlvbnMtaGVhZGVyIHwgRmV0Y2h9XG4gICAqL1xuICBYQ29udGVudFR5cGVPcHRpb25zOiBcIlgtQ29udGVudC1UeXBlLU9wdGlvbnNcIixcblxuICAvKipcbiAgICogSFRUUCBIZWFkZXIgWC1GcmFtZS1PcHRpb25zXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2Jyb3dzaW5nLXRoZS13ZWIuaHRtbCN4LWZyYW1lLW9wdGlvbnMgfCBIVE1MfVxuICAgKi9cbiAgWEZyYW1lT3B0aW9uczogXCJYLUZyYW1lLU9wdGlvbnNcIixcbn0gYXMgY29uc3Q7XG5cbi8qKlxuICogQSBIVFRQIEhlYWRlclxuICpcbiAqIEBleHBlcmltZW50YWwgKipVTlNUQUJMRSoqOiBOZXcgQVBJLCB5ZXQgdG8gYmUgdmV0dGVkLlxuICovXG5leHBvcnQgdHlwZSBIZWFkZXIgPSB0eXBlb2YgSEVBREVSW2tleW9mIHR5cGVvZiBIRUFERVJdO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFEQUFxRDtBQUNyRCxxQ0FBcUM7QUFDckMsaUxBQWlMO0FBRWpMOzs7Ozs7Q0FNQyxHQUNELE9BQU8sTUFBTSxTQUFTO0VBQ3BCOzs7O0dBSUMsR0FDRCxLQUFLO0VBRUw7Ozs7R0FJQyxHQUNELFFBQVE7RUFFUjs7OztHQUlDLEdBQ0QsaUJBQWlCO0VBRWpCOzs7O0dBSUMsR0FDRCxVQUFVO0VBRVY7Ozs7R0FJQyxHQUNELGdCQUFnQjtFQUVoQjs7OztHQUlDLEdBQ0QsZ0JBQWdCO0VBRWhCOzs7O0dBSUMsR0FDRCxnQkFBZ0I7RUFFaEI7Ozs7R0FJQyxHQUNELGdCQUFnQjtFQUVo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
// denoCacheMetadata=4734336693198523735,4219304478682588723