#!/usr/bin/env node
'use strict';

const forge = require('../packages/core/src/index');
let pass = 0, fail = 0;

function check(name, fn) {
  try { fn(); console.log('  PASS', name); pass++; }
  catch(e) { console.log('  FAIL', name, '-', e.message); fail++; }
}

console.log('\n── Categorisation ──');
check('IMEI under network (not financial)', () => { if (forge.financial.imei) throw new Error('IMEI still in financial!'); });
check('forge.network.imei() works',         () => { const r = forge.network.imei(); if (!r.isValid) throw new Error('invalid'); });
check('forge.imei() shortcut works',        () => { const r = forge.imei(); if (r.imei.length !== 15) throw new Error('wrong length'); });

console.log('\n── Personal ──');
check('profile(US)', () => { const p = forge.personal.profile({country:'US'}); if (!p.email.includes('@')) throw new Error(); });
check('profile(IN)', () => { const p = forge.personal.profile({country:'IN'}); if (!p.phoneNumber.startsWith('+91')) throw new Error(); });

console.log('\n── Financial ──');
check('creditCard(visa) Luhn',  () => { if (!forge.financial.creditCard('visa').isValid) throw new Error(); });
check('creditCard(amex) Luhn',  () => { if (!forge.financial.creditCard('amex').isValid) throw new Error(); });
check('iban(GB) valid',         () => { const i = forge.financial.iban('GB'); if (!i.iban.startsWith('GB')) throw new Error(); });
check('transactionId format',   () => { if (!forge.financial.transactionId().startsWith('TXN-')) throw new Error(); });

console.log('\n── Network & Device ──');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
check('uuidV4 RFC4122',   () => { if (!uuidRegex.test(forge.network.uuidV4())) throw new Error(); });
check('macAddress format',() => { if (!/^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/.test(forge.network.macAddress().address)) throw new Error(); });
check('ipv4(public)',     () => { const f = parseInt(forge.network.ipv4('public')); if ([10,127,172,192].includes(f)) throw new Error('reserved'); });
check('ipv4(private)',    () => { const ip = forge.network.ipv4('private'); if (!ip.match(/^(10\.|172\.|192\.168)/)) throw new Error(); });
check('imsi(IN)',         () => { if (forge.network.imsi('IN').country !== 'IN') throw new Error(); });
check('iccid starts 89', () => { if (!forge.network.iccid().iccid.startsWith('89')) throw new Error(); });

console.log('\n── Location ──');
check('address(US)', () => { const a = forge.location.address('US'); if (!a.zipCode) throw new Error(); });
check('address(IN)', () => { const a = forge.location.address('IN'); if (!a.pinCode) throw new Error(); });
check('address(UK)', () => { const a = forge.location.address('UK'); if (!a.postcode) throw new Error(); });

console.log('\n── Data tools ──');
const dt = forge.datatools;
check('formatJSON valid',   () => { if (!dt.formatJSON('{"a":1}').success) throw new Error(); });
check('formatJSON invalid', () => { if (dt.formatJSON('not json').success) throw new Error('should fail'); });
check('minifyJSON',         () => { if (dt.minifyJSON('{"a": 1}').output !== '{"a":1}') throw new Error(); });
check('formatXML',          () => { if (!dt.formatXML('<root><a>1</a></root>').success) throw new Error(); });
check('jsonToXML',          () => { if (!dt.jsonToXML('{"name":"John"}').output.includes('<root>')) throw new Error(); });
check('textToJSON',         () => { if (!dt.textToJSON('name: John\nage: 30').success) throw new Error(); });
check('jsonToCSV',          () => { if (!dt.jsonToCSV('[{"a":1,"b":2}]').output.includes('a,b')) throw new Error(); });
check('csvToJSON',          () => { if (!dt.csvToJSON('name,age\nJohn,30').success) throw new Error(); });
check('encodeBase64',       () => { if (dt.encodeBase64('toolpad').output !== 'dG9vbHBhZA==') throw new Error(); });
check('decodeBase64',       () => { if (dt.decodeBase64('dG9vbHBhZA==').output !== 'toolpad') throw new Error(); });
check('encodeHex',          () => { if (dt.encodeHex('hi').output !== '6869') throw new Error(); });
check('decodeHex',          () => { if (dt.decodeHex('6869').output !== 'hi') throw new Error(); });

console.log('\n── Full record ──');
check('fullRecord(IN) structure', () => {
  const r = forge.fullRecord({country:'IN'});
  ['personal','address','financial','device','coordinates','meta'].forEach(k => { if (!r[k]) throw new Error('missing: '+k); });
  if (!r.device.imei.isValid)  throw new Error('IMEI invalid in record');
  if (r.financial.imei)        throw new Error('IMEI should not be in financial');
  if (r.meta.country !== 'IN') throw new Error('wrong country');
});

console.log('\n─────────────────────────────────');
console.log(`Results: ${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
else console.log('All tests passed.\n');
