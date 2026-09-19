/*
 * DJSON v0.1.0 document utilities.
 * This module is deliberately dependency-free and has no network side effects.
 */

export const DJSON_VERSION = '0.1.0';
export const DJSON_SCHEMA_URL = 'https://djson.org/schema/djson-0.1.0.schema.json';

const LOCAL_HOSTS = new Set(['localhost', 'localhost.localdomain', '::1', '[::1]']);
const WINDOWS_RESERVED_NAMES = new Set([
  'con', 'prn', 'aux', 'nul',
  'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9',
  'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9',
]);

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPrivateIpv4(hostname) {
  const octets = hostname.split('.').map((part) => Number(part));
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }

  const [first, second] = octets;
  return first === 0 || first === 10 || first === 127 ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168);
}

function isPublicHostname(hostname) {
  const host = hostname.toLowerCase();
  const isIpv4 = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(host);
  return Boolean(host) &&
    !LOCAL_HOSTS.has(host) &&
    !host.endsWith('.local') &&
    (isIpv4 || host.includes('.')) &&
    !isPrivateIpv4(host) &&
    host !== '::1';
}

/**
 * Produces a canonical HTTPS URL for a public web address.
 * Returns null rather than throwing when the value is not a safe public URL.
 */
export function normalizeUrl(value) {
  const raw = cleanText(value);
  if (!raw || /[\u0000-\u001F\u007F\s]/.test(raw)) return null;

  const withScheme = raw.startsWith('//')
    ? `https:${raw}`
    : /^[a-z][a-z\d+.-]*:/i.test(raw)
      ? raw
      : `https://${raw}`;

  try {
    const parsed = new URL(withScheme);
    if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) return null;
    if (!isPublicHostname(parsed.hostname)) return null;

    parsed.protocol = 'https:';
    parsed.hash = '';
    return parsed.href;
  } catch {
    return null;
  }
}

function isValidEmail(value) {
  const email = cleanText(value);
  return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Returns field-level errors. Name, website, category, and description are the
 * required business fields in DJSON v0.1.0. Contact details are optional.
 */
export function validateBusiness(input = {}) {
  const errors = {};
  if (!cleanText(input.name)) errors.name = 'Enter the business name.';
  if (!normalizeUrl(input.website)) errors.website = 'Enter a valid public website URL.';
  if (!cleanText(input.category)) errors.category = 'Enter a business category.';
  if (!cleanText(input.description)) errors.description = 'Enter a short description.';
  if (!isValidEmail(input.email)) errors.email = 'Enter a valid contact email or leave it blank.';
  return errors;
}

/**
 * Builds a compact, predictable DJSON v0.1.0 business document.
 */
export function buildDjson(input = {}, generatedAt = new Date().toISOString()) {
  const errors = validateBusiness(input);
  if (Object.keys(errors).length) {
    throw new TypeError('Cannot build DJSON from invalid business data.');
  }

  const email = cleanText(input.email);
  const phone = cleanText(input.phone);
  const location = cleanText(input.location);
  const contact = {};

  if (email) contact.email = email;
  if (phone) contact.phone = phone;

  const business = {
    name: cleanText(input.name),
    website: normalizeUrl(input.website),
    category: cleanText(input.category),
    description: cleanText(input.description),
  };

  if (Object.keys(contact).length) business.contact = contact;
  if (location) business.location = location;

  return {
    $schema: DJSON_SCHEMA_URL,
    djson_version: DJSON_VERSION,
    generated_at: generatedAt,
    generated_by: 'getdjson',
    business,
  };
}

/**
 * Creates a conservative file name which is portable across common file systems.
 */
export function safeFileName(value) {
  let stem = cleanText(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');

  if (!stem || WINDOWS_RESERVED_NAMES.has(stem)) stem = 'business';
  return `${stem}.djson`;
}

export const DJSON_SHAPE = Object.freeze({
  version: DJSON_VERSION,
  requiredBusinessFields: Object.freeze(['name', 'website', 'category', 'description']),
});
