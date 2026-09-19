import { buildDjson, safeFileName, validateBusiness } from './djson.js';

/*
 * Deliberately local-first. Leave disabled unless an operator adds a separate,
 * consented server-side integration; this static app never transmits PII.
 */
const LEAD_CAPTURE = Object.freeze({ enabled: false });

const form = document.querySelector('#djson-form');
const output = document.querySelector('#output');
const copyButton = document.querySelector('#copy-button');
const downloadButton = document.querySelector('#download-button');
const formStatus = document.querySelector('#form-status');
const actionStatus = document.querySelector('#action-status');

let generatedText = '';
let downloadName = 'business.djson';
const errorElementIds = Object.freeze({
  name: 'business-name-error',
  website: 'website-error',
  category: 'category-error',
  description: 'description-error',
  email: 'contact-email-error',
});

function getBusinessInput() {
  return Object.fromEntries(new FormData(form).entries());
}

function setStatus(element, message, state = '') {
  element.textContent = message;
  element.dataset.state = state;
}

function clearErrors() {
  for (const field of form.querySelectorAll('input, textarea')) {
    field.removeAttribute('aria-invalid');
  }
  for (const message of form.querySelectorAll('.field-error')) {
    message.textContent = '';
  }
}

function showErrors(errors) {
  clearErrors();
  const firstFieldName = Object.keys(errors)[0];

  for (const [fieldName, message] of Object.entries(errors)) {
    const field = form.elements.namedItem(fieldName);
    const error = document.getElementById(errorElementIds[fieldName]);
    if (field instanceof HTMLElement) field.setAttribute('aria-invalid', 'true');
    if (error) error.textContent = message;
  }

  if (firstFieldName) {
    const firstField = form.elements.namedItem(firstFieldName);
    if (firstField instanceof HTMLElement) firstField.focus();
  }
}

function updateOutput(documentData, name) {
  generatedText = `${JSON.stringify(documentData, null, 2)}\n`;
  downloadName = safeFileName(name);
  output.textContent = generatedText;
  copyButton.disabled = false;
  downloadButton.disabled = false;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = getBusinessInput();
  const errors = validateBusiness(input);

  if (Object.keys(errors).length) {
    showErrors(errors);
    setStatus(formStatus, 'Fix the highlighted fields, then generate the document.', 'error');
    return;
  }

  clearErrors();
  const djson = buildDjson(input);
  updateOutput(djson, input.name);
  setStatus(formStatus, 'DJSON document generated locally. Nothing was sent.', 'success');
  setStatus(actionStatus, 'Review the document, then copy or download it.', '');

  if (LEAD_CAPTURE.enabled) {
    // Intentional no-op: consented lead capture must be supplied separately by an operator.
    // This app does not post business or personal information anywhere.
  }
});

async function copyText(text) {
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const temporary = document.createElement('textarea');
  temporary.value = text;
  temporary.setAttribute('readonly', '');
  temporary.style.position = 'fixed';
  temporary.style.opacity = '0';
  document.body.append(temporary);
  temporary.select();
  const copied = document.execCommand('copy');
  temporary.remove();
  if (!copied) throw new Error('Clipboard copy was unavailable.');
}

copyButton.addEventListener('click', async () => {
  if (!generatedText) return;
  try {
    await copyText(generatedText);
    setStatus(actionStatus, 'DJSON copied to your clipboard.', 'success');
  } catch {
    setStatus(actionStatus, 'Copy was unavailable. Select the document above and copy it manually.', 'error');
    output.focus();
  }
});

downloadButton.addEventListener('click', () => {
  if (!generatedText) return;
  const blob = new Blob([generatedText], { type: 'application/json;charset=utf-8' });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = downloadName;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  setStatus(actionStatus, `Download started: ${downloadName}`, 'success');
});
