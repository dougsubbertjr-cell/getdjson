# GetDJSON

**GetDJSON** is a dependency-free static browser app that creates a **DJSON v0.1.0** document for a business. It is deliberately local-first: business details are transformed in the browser and are not sent to GetDJSON.

## What it generates

The generator creates this stable shape:

```json
{
  "$schema": "https://djson.org/schema/djson-0.1.0.schema.json",
  "djson_version": "0.1.0",
  "generated_at": "2026-01-02T03:04:05.000Z",
  "generated_by": "getdjson",
  "business": {
    "name": "Example Business",
    "website": "https://example.com/",
    "category": "Example category",
    "description": "A concise business description.",
    "contact": {
      "email": "hello@example.com",
      "phone": "+1 555 0100"
    },
    "location": "Example City, Region"
  }
}
```

`business.name`, `business.website`, `business.category`, and `business.description` are required. `contact` and `location` are optional and omitted when blank. Website values are normalized to HTTPS public URLs. The generated timestamp naturally changes each time a document is created.

> The `$schema` field is a stable identifier for the intended DJSON v0.1.0 contract. This static application does not fetch it at runtime, so generating a file neither waits on nor contacts an external service.

## Privacy and security

- **No remote schema fetches, analytics, cookies, or built-in form submissions.**
- **No lead-submission endpoint is present in source.**
- Copy and download happen locally in the browser.
- The optional integration disclosure is collapsed and disabled by default; its field is informational only and does not store or submit data.
- A human-audit link is an ordinary outbound link opened only when the visitor chooses it.

Read [PRIVACY.md](PRIVACY.md) for the data-flow details and [DEPLOYMENT.md](DEPLOYMENT.md) for a safe hosting and consent model.

## Accessibility

The app uses native labels, field-level errors, a first-error focus target, live status messages, semantic landmarks, visible keyboard focus, a skip link, responsive layout, and reduced-motion support. It does not use color alone to communicate errors.

## Run locally

The app is plain HTML, CSS, and ES modules. It has no install step or production dependencies. Use a local static server rather than opening `index.html` directly, because browsers restrict ES modules on `file:` URLs.

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Test

Node's built-in test runner validates the pure DJSON module:

```bash
node --test
# or
npm test
```

The tests cover URL normalization, the required business fields, the v0.1.0 output shape, omission of blank optional data, and portable safe file names.

## Publish a generated document

After reviewing the file, place it at a stable public URL such as `/djson.json` or `/.well-known/djson.json`. Serve it as JSON and update it when the business changes. See [DEPLOYMENT.md](DEPLOYMENT.md).

## Project layout

| Path | Purpose |
|---|---|
| `index.html` | Accessible static application shell |
| `assets/djson.js` | Side-effect-free DJSON normalization, validation, and document builder |
| `assets/app.js` | Local UI behavior, copy, and download actions |
| `assets/styles.css` | Responsive visual and accessibility styles |
| `tests/djson.test.mjs` | Node tests for the document utility contract |
| `PRIVACY.md` | Privacy and data-flow statement |
| `DEPLOYMENT.md` | Static-hosting, headers, and opt-in integration guidance |

## License

[MIT](LICENSE)

## Human review

Generating structured data does not confirm that the claims are accurate, lawful, complete, or suitable for a particular platform. Use the **Request a human audit** control in the app when an independent review would be useful.
