'use strict';
const { randomFrom, randomInt, randomHex, randomDigits, zeroPad, luhnGenerate, luhnValidate, luhnCheckDigit } = require('../utils');

// ── UUID ──────────────────────────────────────────────────────────────────────
function uuidV4() {
  const s = n => Array.from({ length: n }, () => randomHex(1)).join('');
  return `${s(8)}-${s(4)}-4${s(3)}-${(8+randomInt(0,3)).toString(16)}${s(3)}-${s(12)}`;
}
function uuidV1() {
  const now  = BigInt(Date.now()) * 10000n + 122192928000000000n;
  const tLow = (now & 0xFFFFFFFFn).toString(16).padStart(8,'0');
  const tMid = ((now >> 32n) & 0xFFFFn).toString(16).padStart(4,'0');
  const tHi  = ((now >> 48n) & 0x0FFFn | 0x1000n).toString(16).padStart(4,'0');
  const clock = (randomInt(0,0x3FFF) | 0x8000).toString(16).padStart(4,'0');
  return `${tLow}-${tMid}-${tHi}-${clock}-${randomHex(12)}`;
}

// ── MAC address ───────────────────────────────────────────────────────────────
const OUI = ['00:1A:2B','00:50:56','F4:5C:89','00:23:AE','B8:27:EB','DC:A6:32','00:1B:21','E4:5F:01'];
function macAddress(options = {}) {
  const sep  = options.separator !== undefined ? options.separator : ':';
  const oui  = options.oui || randomFrom(OUI);
  const ouiP = oui.replace(/[:\-]/g,'').match(/.{2}/g);
  const nic  = [randomHex(2), randomHex(2), randomHex(2)];
  return { address: [...ouiP,...nic].join(sep), oui: ouiP.join(':'), nic: nic.join(':'), type: 'unicast' };
}

// ── IP ────────────────────────────────────────────────────────────────────────
function ipv4(type = 'public') {
  if (type === 'private')  return `${randomFrom(['10','172.'+randomInt(16,31),'192.168'])}.${randomInt(0,255)}.${randomInt(1,254)}`;
  if (type === 'loopback') return `127.0.0.${randomInt(1,254)}`;
  let f; do { f = randomInt(1,254); } while ([10,127,172,192].includes(f));
  return `${f}.${randomInt(0,255)}.${randomInt(0,255)}.${randomInt(1,254)}`;
}
function ipv6() { return Array.from({length:8}, () => randomHex(4)).join(':'); }
function cidr(v = 4) { return v === 6 ? `${ipv6()}/${randomInt(48,128)}` : `${ipv4('private')}/${randomInt(16,30)}`; }

// ── IMEI — moved from financial ───────────────────────────────────────────────
// IMEI is a device identifier, not a financial instrument.
// It uses the Luhn algorithm for checksum validation, same as credit cards,
// but conceptually belongs with device/network identifiers.
const TAC_PREFIXES = ['35674108','35841709','86751404','35310507','86800002','35456810','35726211'];
function imei() {
  const tac    = randomFrom(TAC_PREFIXES);
  const number = luhnGenerate(tac, 15);
  const fmt    = `${number.slice(0,2)}-${number.slice(2,8)}-${number.slice(8,14)}-${number.slice(14)}`;
  return { imei: number, tac, formatted: fmt, isValid: luhnValidate(number) };
}

// ── IMSI ──────────────────────────────────────────────────────────────────────
const MCC_MNC = [
  { mcc:'310', mnc:'410', operator:'AT&T',         country:'US' },
  { mcc:'310', mnc:'260', operator:'T-Mobile',     country:'US' },
  { mcc:'311', mnc:'480', operator:'Verizon',      country:'US' },
  { mcc:'404', mnc:'20',  operator:'Airtel',       country:'IN' },
  { mcc:'405', mnc:'840', operator:'Reliance Jio', country:'IN' },
  { mcc:'234', mnc:'30',  operator:'EE',           country:'UK' },
  { mcc:'234', mnc:'20',  operator:'Three',        country:'UK' },
  { mcc:'505', mnc:'01',  operator:'Telstra',      country:'AU' },
];
function imsi(country) {
  const pool = country ? MCC_MNC.filter(m => m.country === country.toUpperCase()) : MCC_MNC;
  const net  = randomFrom(pool.length ? pool : MCC_MNC);
  const msin = randomDigits(15 - net.mcc.length - net.mnc.length);
  return { imsi: `${net.mcc}${net.mnc}${msin}`, mcc: net.mcc, mnc: net.mnc, msin, operator: net.operator, country: net.country };
}

// ── ICCID ─────────────────────────────────────────────────────────────────────
function iccid() {
  const industry = '89';
  const cc       = randomFrom(['1','44','91','61']);
  const partial  = (industry + cc.padStart(2,'0') + randomDigits(4) + randomDigits(12)).slice(0,18);
  return { iccid: partial + luhnCheckDigit(partial), industry, countryCode: cc };
}

// ── Port / User-Agent ─────────────────────────────────────────────────────────
const COMMON_PORTS = [80,443,8080,8443,3000,5000,3306,5432,6379,27017,22,21,25];
function port(range = 'any') {
  if (range === 'well-known') return randomFrom(COMMON_PORTS);
  if (range === 'registered') return randomInt(1024,49151);
  if (range === 'dynamic')    return randomInt(49152,65535);
  return randomInt(1,65535);
}
const UA_LIST = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1',
];
function userAgent() { return randomFrom(UA_LIST); }

module.exports = { uuidV4, uuidV1, macAddress, ipv4, ipv6, cidr, imei, imsi, iccid, port, userAgent };
