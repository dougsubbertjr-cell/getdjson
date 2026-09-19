import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DJSON_SCHEMA_URL,
  DJSON_VERSION,
  buildDjson,
  normalizeUrl,
  safeFileName,
  validateBusiness,
} from '../assets/djson.js';

const validBusiness = Object.freeze({
  name: 'Northwind Coffee',
  website: 'northwind.example/path',
  category: 'Coffee shop',
  description: 'Neighbourhood coffee and pastries.',
  email: 'hello@northwind.example',
  phone: '+1 555 0100',
  location: 'Portland, OR',
});

test('normalizes a bare domain into an HTTPS URL', () => {
  assert.equal(normalizeUrl('northwind.example/path'), 'https://northwind.example/path');
});

test('normalizes an HTTP URL to HTTPS without changing its path', () => {
  assert.equal(normalizeUrl(' HTTP://Northwind.Example/services '), 'https://northwind.example/services');
});

test('rejects URLs without a public host or with unsafe schemes', () => {
  assert.equal(normalizeUrl('javascript:alert(1)'), null);
  assert.equal(normalizeUrl('https://'), null);
  assert.equal(normalizeUrl('intranet'), null);
  assert.equal(normalizeUrl('localhost:3000'), null);
});

test('requires the business fields needed to make a useful DJSON file', () => {
  assert.deepEqual(validateBusiness({}), {
    name: 'Enter the business name.',
    website: 'Enter a valid public website URL.',
    category: 'Enter a business category.',
    description: 'Enter a short description.',
  });
});

test('builds the DJSON v0.1.0 document shape with normalized contact data', () => {
  const djson = buildDjson(validBusiness, '2026-01-02T03:04:05.000Z');

  assert.deepEqual(djson, {
    $schema: DJSON_SCHEMA_URL,
    djson_version: DJSON_VERSION,
    generated_at: '2026-01-02T03:04:05.000Z',
    generated_by: 'getdjson',
    business: {
      name: 'Northwind Coffee',
      website: 'https://northwind.example/path',
      category: 'Coffee shop',
      description: 'Neighbourhood coffee and pastries.',
      contact: {
        email: 'hello@northwind.example',
        phone: '+1 555 0100',
      },
      location: 'Portland, OR',
    },
  });
});

test('omits optional empty contact and location values from the DJSON document', () => {
  const djson = buildDjson({ ...validBusiness, email: '', phone: '', location: '' }, '2026-01-02T03:04:05.000Z');

  assert.deepEqual(djson.business, {
    name: 'Northwind Coffee',
    website: 'https://northwind.example/path',
    category: 'Coffee shop',
    description: 'Neighbourhood coffee and pastries.',
  });
});

test('creates a portable and bounded DJSON file name', () => {
  assert.equal(safeFileName('ACME / Plumbing: East?'), 'acme-plumbing-east.djson');
  assert.equal(safeFileName('../../'), 'business.djson');
  assert.equal(safeFileName('A'.repeat(150)), `${'a'.repeat(80)}.djson`);
});
