'use strict';
const express = require('express');
const forge   = require('../../../../packages/core/src/index');
const router  = express.Router();

const ok  = (res, data) => res.json({ success: true, data, generatedAt: new Date().toISOString() });
const err = (res, msg, code = 400) => res.status(code).json({ success: false, error: msg });
const n   = (q, max = 100) => Math.min(Math.max(parseInt(q, 10) || 1, 1), max);
const multi = (count, fn) => count === 1 ? fn() : Array.from({ length: count }, fn);

// ── Root ──────────────────────────────────────────────────────────────────────
router.get('/', (req, res) => res.json({
  name: 'Toolpad API', version: '2.0.0',
  categories: {
    personal:  ['profile','name','email','phone'],
    financial: ['credit-card','iban','bank-account','transaction-id'],
    network:   ['uuid','mac','ip','imei','imsi','iccid','user-agent'],
    location:  ['address','coordinates','timezone'],
    datatools: ['format/json','format/xml','convert/json-to-xml','convert/xml-to-json',
                'convert/json-to-csv','convert/csv-to-json','convert/text-to-json',
                'convert/text-to-xml','encode/base64','decode/base64','encode/hex','decode/hex'],
    combined:  ['record'],
  },
}));

// ── Personal ──────────────────────────────────────────────────────────────────
router.get('/personal/profile', (req, res) => {
  const { gender = 'any', country = 'US' } = req.query;
  ok(res, multi(n(req.query.count), () => forge.personal.profile({ gender, country })));
});
router.get('/personal/name', (req, res) => {
  const { gender = 'any' } = req.query;
  ok(res, multi(n(req.query.count), () => ({ firstName: forge.personal.firstName(gender), lastName: forge.personal.lastName(), fullName: forge.personal.fullName(gender) })));
});
router.get('/personal/email',   (req, res) => ok(res, multi(n(req.query.count), () => forge.personal.email())));
router.get('/personal/phone',   (req, res) => ok(res, multi(n(req.query.count), () => forge.personal.phoneNumber(req.query.country || 'US'))));
router.get('/personal/username',(req, res) => ok(res, multi(n(req.query.count), () => forge.personal.username())));
router.get('/personal/dob',     (req, res) => ok(res, multi(n(req.query.count), () => forge.personal.dateOfBirth())));

// ── Financial ─────────────────────────────────────────────────────────────────
router.get('/financial/credit-card', (req, res) => {
  const VALID = ['visa','mastercard','amex','discover','jcb'];
  if (req.query.network && !VALID.includes(req.query.network)) return err(res, `network must be one of: ${VALID.join(', ')}`);
  ok(res, multi(n(req.query.count, 50), () => forge.financial.creditCard(req.query.network)));
});
router.get('/financial/iban', (req, res) => {
  const VALID = ['GB','DE','FR'];
  const cc = (req.query.country || 'GB').toUpperCase();
  if (!VALID.includes(cc)) return err(res, `country must be one of: ${VALID.join(', ')}`);
  ok(res, multi(n(req.query.count, 50), () => forge.financial.iban(cc)));
});
router.get('/financial/bank-account', (req, res) => {
  const fn = (req.query.country || 'US').toUpperCase() === 'IN' ? forge.financial.inBankAccount : forge.financial.usBankAccount;
  ok(res, multi(n(req.query.count, 50), fn));
});
router.get('/financial/transaction-id', (req, res) => ok(res, multi(n(req.query.count), forge.financial.transactionId)));

// ── Network & Device (includes IMEI) ─────────────────────────────────────────
router.get('/network/uuid', (req, res) => {
  const fn = req.query.version === '1' ? forge.network.uuidV1 : forge.network.uuidV4;
  ok(res, multi(n(req.query.count), fn));
});
router.get('/network/mac', (req, res) => {
  const { separator = ':' } = req.query;
  ok(res, multi(n(req.query.count), () => forge.network.macAddress({ separator })));
});
router.get('/network/ip', (req, res) => {
  const fn = req.query.version === '6' ? forge.network.ipv6 : () => forge.network.ipv4(req.query.type || 'public');
  ok(res, multi(n(req.query.count), fn));
});
// IMEI correctly under /network, not /financial
router.get('/network/imei',  (req, res) => ok(res, multi(n(req.query.count), forge.network.imei)));
router.get('/network/imsi',  (req, res) => ok(res, multi(n(req.query.count), () => forge.network.imsi(req.query.country))));
router.get('/network/iccid', (req, res) => ok(res, multi(n(req.query.count), forge.network.iccid)));
router.get('/network/user-agent', (req, res) => ok(res, multi(n(req.query.count, 20), forge.network.userAgent)));

// ── Location ──────────────────────────────────────────────────────────────────
router.get('/location/address', (req, res) => {
  ok(res, multi(n(req.query.count), () => forge.location.address(req.query.country || 'US')));
});
router.get('/location/coordinates', (req, res) => {
  const fn = req.query.country ? () => forge.location.coordinatesInCountry(req.query.country) : () => forge.location.coordinates();
  ok(res, multi(n(req.query.count), fn));
});
router.get('/location/timezone', (req, res) => ok(res, multi(n(req.query.count, 20), forge.location.timezone)));

// ── Data Tools ────────────────────────────────────────────────────────────────
const bodyOrErr = (req, res) => {
  const body = req.body?.input || req.body?.data;
  if (!body) { err(res, 'Request body must contain `input` field'); return null; }
  return body;
};

router.post('/datatools/format/json', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  const result = forge.datatools.formatJSON(input, req.body.indent || 2);
  result.success ? ok(res, result) : err(res, result.error);
});
router.post('/datatools/minify/json', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  const result = forge.datatools.minifyJSON(input);
  result.success ? ok(res, result) : err(res, result.error);
});
router.post('/datatools/validate/json', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  ok(res, forge.datatools.validateJSON(input));
});
router.post('/datatools/format/xml', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  const result = forge.datatools.formatXML(input);
  result.success ? ok(res, result) : err(res, result.error);
});
router.post('/datatools/minify/xml', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  const result = forge.datatools.minifyXML(input);
  result.success ? ok(res, result) : err(res, result.error);
});
router.post('/datatools/convert/json-to-xml', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  const result = forge.datatools.jsonToXML(input, req.body.rootTag || 'root');
  result.success ? ok(res, result) : err(res, result.error);
});
router.post('/datatools/convert/xml-to-json', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  const result = forge.datatools.xmlToJSON(input);
  result.success ? ok(res, result) : err(res, result.error);
});
router.post('/datatools/convert/json-to-csv', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  const result = forge.datatools.jsonToCSV(input);
  result.success ? ok(res, result) : err(res, result.error);
});
router.post('/datatools/convert/csv-to-json', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  const result = forge.datatools.csvToJSON(input);
  result.success ? ok(res, result) : err(res, result.error);
});
router.post('/datatools/convert/text-to-json', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  const result = forge.datatools.textToJSON(input);
  result.success ? ok(res, result) : err(res, result.error);
});
router.post('/datatools/convert/text-to-xml', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  const result = forge.datatools.textToXML(input, req.body.rootTag || 'record');
  result.success ? ok(res, result) : err(res, result.error);
});
router.post('/datatools/encode/base64', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  ok(res, forge.datatools.encodeBase64(input));
});
router.post('/datatools/decode/base64', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  const result = forge.datatools.decodeBase64(input);
  result.success ? ok(res, result) : err(res, result.error);
});
router.post('/datatools/encode/hex', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  ok(res, forge.datatools.encodeHex(input));
});
router.post('/datatools/decode/hex', (req, res) => {
  const input = bodyOrErr(req, res); if (!input) return;
  const result = forge.datatools.decodeHex(input);
  result.success ? ok(res, result) : err(res, result.error);
});

// ── Combined record ───────────────────────────────────────────────────────────
router.get('/record', (req, res) => {
  ok(res, multi(n(req.query.count, 20), () => forge.fullRecord({ country: req.query.country || 'US', gender: req.query.gender })));
});

router.use((req, res) => err(res, `Not found: ${req.method} ${req.path}`, 404));

module.exports = router;
