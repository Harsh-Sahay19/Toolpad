'use strict';
const { randomFrom, randomInt, randomDigits, zeroPad, luhnGenerate, luhnValidate } = require('../utils');

const CARD_NETWORKS = {
  visa:       { prefix: ['4'],                    length: 16 },
  mastercard: { prefix: ['51','52','53','54','55'], length: 16 },
  amex:       { prefix: ['34','37'],               length: 15 },
  discover:   { prefix: ['6011','65'],             length: 16 },
  jcb:        { prefix: ['3528','3589'],           length: 16 },
};

function creditCard(network) {
  const key    = network || randomFrom(Object.keys(CARD_NETWORKS));
  const net    = CARD_NETWORKS[key] || CARD_NETWORKS.visa;
  const prefix = randomFrom(net.prefix);
  const number = luhnGenerate(prefix, net.length);
  const fmt    = key === 'amex'
    ? `${number.slice(0,4)} ${number.slice(4,10)} ${number.slice(10)}`
    : number.match(/.{1,4}/g).join(' ');
  const expMonth = zeroPad(randomInt(1,12),2);
  const expYear  = randomInt(new Date().getFullYear()+1, new Date().getFullYear()+5);
  return { network: key, number, formatted: fmt, expiry: `${expMonth}/${String(expYear).slice(-2)}`, cvv: key === 'amex' ? randomDigits(4) : randomDigits(3), isValid: luhnValidate(number) };
}

function computeIbanCheck(cc, bban) {
  const raw = (bban + cc + '00').toUpperCase().split('').map(c => c >= 'A' && c <= 'Z' ? (c.charCodeAt(0)-55).toString() : c).join('');
  return zeroPad(String(98n - BigInt(raw) % 97n), 2);
}

function iban(country = 'GB') {
  const cc = country.toUpperCase();
  let bban;
  if (cc === 'GB') bban = randomFrom(['NWBK','BARC','HSBC','LOYD']) + randomDigits(14);
  else if (cc === 'DE') bban = randomDigits(18);
  else if (cc === 'FR') bban = randomDigits(23);
  else bban = randomDigits(16);
  const check = computeIbanCheck(cc, bban);
  const str   = `${cc}${check}${bban}`;
  return { iban: str, formatted: str.match(/.{1,4}/g).join(' '), country: cc, bban, isValid: true };
}

const US_ROUTING = ['021000021','021001088','011000138','121042882','322271627'];
function usBankAccount() {
  return { routingNumber: randomFrom(US_ROUTING), accountNumber: randomDigits(randomInt(8,12)), accountType: randomFrom(['checking','savings']) };
}

const IN_BANKS = [
  { name:'State Bank of India', ifsc:'SBIN' }, { name:'HDFC Bank', ifsc:'HDFC' },
  { name:'ICICI Bank', ifsc:'ICIC' },          { name:'Axis Bank', ifsc:'UTIB' },
  { name:'Kotak Mahindra', ifsc:'KKBK' },
];
function inBankAccount() {
  const b = randomFrom(IN_BANKS);
  return { bankName: b.name, ifscCode: `${b.ifsc}0${randomDigits(6)}`, accountNumber: randomDigits(randomInt(9,18)), accountType: randomFrom(['savings','current']) };
}

function currencyAmount(min = 1, max = 10000, currency = 'USD') {
  const amount = (Math.random() * (max - min) + min).toFixed(2);
  return { amount: parseFloat(amount), currency, formatted: `${amount} ${currency}` };
}

function transactionId() {
  const ts = Date.now().toString(36).toUpperCase();
  return `TXN-${ts}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
}

module.exports = { creditCard, iban, usBankAccount, inBankAccount, currencyAmount, transactionId };
