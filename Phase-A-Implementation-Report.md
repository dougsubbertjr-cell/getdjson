# Superseded implementation note

This historical report has been replaced to prevent retired architecture from being treated as current deployment guidance.

The current GetDJSON implementation is a **static, local-first DJSON v0.1.0 generator**. It does not fetch a schema at runtime, does not contain a lead-capture endpoint, and does not transmit business or contact information during document generation.

For current behavior and operating guidance, use the following documents:

- [README.md](README.md) for the DJSON document shape, local usage, and testing.
- [PRIVACY.md](PRIVACY.md) for data-flow and privacy details.
- [DEPLOYMENT.md](DEPLOYMENT.md) for hosting headers and optional consented-integration requirements.
