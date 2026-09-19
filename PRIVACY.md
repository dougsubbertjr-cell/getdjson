# Privacy statement

**Effective date:** 2026-09-19

## Summary

GetDJSON is designed so that the ordinary generation flow runs **entirely in the visitor's browser**. Typing business information, generating DJSON, copying it, and downloading it do not transmit that information to GetDJSON.

## What this static app does not collect

The source application contains no analytics SDK, tracking pixel, cookie banner, form backend, CRM connector, lead-submission endpoint, or remote schema lookup. It does not send form values, generated documents, browser identifiers, or IP addresses from its JavaScript.

The app's DJSON output is created in page memory. It is retained only by the browser page until the visitor changes, reloads, or closes it. The app does not use local storage, session storage, IndexedDB, or cookies to save form data.

## Visitor-controlled actions

| Action | Where data goes |
|---|---|
| Generate DJSON | Nowhere; it runs in the current browser. |
| Copy DJSON | The visitor's device clipboard, subject to browser permissions. |
| Download DJSON | A file selected by the visitor's browser download behavior. |
| Request a human audit | The visitor is taken to `digitaljson.com` only after activating the link. That destination has its own privacy practices. |

## Optional lead-capture configuration

The UI contains a collapsed **informational** configuration note to help an operator plan a separate, consented integration. It is **disabled by default** and cannot send, save, or use the value entered into its endpoint field.

An operator who adds a real lead-capture service must not simply enable arbitrary client-side transmission. Before collecting contact or business details, they should:

1. state the recipient, purpose, and retention period next to the collection control;
2. collect only data needed for that stated purpose;
3. obtain an affirmative, unbundled consent where required;
4. provide links to applicable privacy and deletion/contact processes;
5. send data only to a controlled HTTPS endpoint; and
6. implement server-side validation, rate limiting, access controls, retention/deletion practices, and an abuse-monitoring process.

Those changes create a different data flow and require a revised privacy statement, technical review, and jurisdiction-specific legal assessment.

## Hosting logs and third parties

A static hosting provider may independently create standard access logs (for example, IP address, user agent, time, and requested path) while serving this site. This app cannot control a host's logs. Site operators should select a host, configure log retention, and publish notices appropriate to their deployment.

Outbound links are activated only by a visitor. The human-audit link includes `rel="noopener noreferrer"` to avoid passing a referrer from the browser where supported.

## Changes and contact

If this app gains a data-collection feature, its privacy documentation and deployment review must be updated before that feature is enabled. Questions about a particular deployment should be directed to the operator of that deployment.
