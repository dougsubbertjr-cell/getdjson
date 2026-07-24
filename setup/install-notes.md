# DJSON Install Notes (v1.0)

## Purpose
These notes explain how to install, store, validate, and maintain a Digital JSON (DJSON) file for any business.

---

## 1. File Location
Recommended storage locations:

- `/digitaljson.json` at the root of the website
- `/ai/djson.json` for structured setups
- CMS: upload as a static file

---

## 2. Hosting Requirements
- Must be publicly accessible
- Must return valid JSON
- Must not require authentication
- Must not be behind a redirect loop

Test with:
