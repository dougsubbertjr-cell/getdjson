# Deployment guide

GetDJSON is a static HTML, CSS, and JavaScript application. It can be served from any static host that serves ES modules with a JavaScript MIME type. No build process, package installation, database, or server-side application is needed for the default privacy-preserving flow.

## Deploy the static files

Publish these paths together:

```text
index.html
assets/styles.css
assets/djson.js
assets/app.js
PRIVACY.md
README.md
DEPLOYMENT.md
```

Do not publish the `tests/` directory unless it is useful for repository transparency. Never publish local environment files, deployment credentials, or private keys.

Use HTTPS and serve:

| File type | Recommended `Content-Type` |
|---|---|
| `.html` | `text/html; charset=utf-8` |
| `.css` | `text/css; charset=utf-8` |
| `.js` | `text/javascript; charset=utf-8` |
| `.md` | `text/markdown; charset=utf-8` |

The app must be served over HTTPS for the standard asynchronous clipboard API to be available. The app has a manual-copy fallback; downloads do not require a server-side endpoint.

## Recommended security headers

Adapt these values to the selected host, test them on a staging site, and retain any host-required directives. The current source has no third-party scripts, fonts, images, fetches, frames, workers, or forms.

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
```

Set `Strict-Transport-Security` only after confirming the entire domain and all relevant subdomains safely support HTTPS.

## Cache and integrity

Use a short cache duration for `index.html` so privacy/security updates reach visitors promptly. Versioned immutable cache policies are appropriate only for assets that are actually fingerprinted. Keep a rollback process and verify MIME types, headers, and the form flow after each release.

## Publish a generated DJSON file

A business can publish its downloaded file at a stable, public HTTPS path such as:

```text
https://example.com/djson.json
https://example.com/.well-known/djson.json
```

Serve it as `application/json; charset=utf-8`. Avoid authentication walls and redirect chains. Review the generated file before publication, because it becomes a public representation of the business.

## Optional consented lead capture

The released app intentionally has `LEAD_CAPTURE.enabled` set to `false`; it has no endpoint and never transmits PII. The visible configuration field is explicitly informational. Do **not** turn that field into a client-side submission mechanism by inserting an arbitrary third-party URL.

If an operator has a documented reason to collect leads, implement a separate, reviewed integration with all of the following controls:

1. **Explicit activation:** Keep it disabled until a deployment-specific configuration enables it.
2. **Just-in-time notice and affirmative consent:** State data categories, recipient, purpose, retention period, and a privacy-policy link immediately before submission. Do not pre-check consent.
3. **First-party HTTPS endpoint:** Send only the minimum data to an owned or contractually controlled server endpoint, not a hard-coded vendor endpoint in the public client.
4. **Server-side controls:** Validate and minimize input, authenticate administrative access, protect logs, rate-limit/abuse-protect requests, and prevent email/header injection.
5. **Data lifecycle:** Define retention, deletion, access, and incident-response procedures before data arrives.
6. **Security policy revision:** Add the exact endpoint origin to `connect-src` only after it is required and reviewed.
7. **Documentation:** Update [PRIVACY.md](PRIVACY.md), test the consent flow with assistive technology, and obtain legal/privacy review appropriate to the operator's jurisdiction.

A consented integration is intentionally outside the default static app. It changes the privacy posture and should be designed, tested, and deployed as its own feature.

## Pre-release checklist

- [ ] `node --test` passes.
- [ ] The application works from an HTTPS static host.
- [ ] DJSON generation, copy, and download work without a network request.
- [ ] The form has visible labels, field errors, keyboard focus, and status announcements.
- [ ] No Formspree URL, direct PII submission, analytics key, or secret appears in published source.
- [ ] Content Security Policy and MIME types have been verified in the deployed host.
- [ ] Privacy documentation matches the actual deployment.
- [ ] Optional lead capture remains disabled unless the separate controls above are implemented.
