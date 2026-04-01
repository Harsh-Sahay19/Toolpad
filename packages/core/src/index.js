'use strict';

/**
 * @package @toolpad/core
 *
 * Tool categories:
 *   forge.personal   — names, email, phone, profiles
 *   forge.financial  — credit cards, IBAN, bank accounts (NOT IMEI)
 *   forge.network    — UUID, MAC, IP, IMEI, IMSI, ICCID  ← IMEI lives here
 *   forge.location   — addresses, GPS, timezone
 *   forge.datatools  — JSON/XML format, convert, create from text, Base64, Hex
 */

const personal  = require('./generators/personal');
const financial = require('./generators/financial');
const network   = require('./generators/network');   // includes imei()
const location  = require('./generators/location');
const datatools = require('./generators/datatools');

function fullRecord(options = {}) {
  const country = options.country || 'US';
  const person  = personal.profile({ gender: options.gender, country });
  const addr    = location.address(country);
  const coords  = location.coordinatesInCountry(country);
  const card    = financial.creditCard();
  return {
    personal:    person,
    address:     addr,
    coordinates: coords,
    financial: {
      creditCard:   card,
      bankAccount:  country === 'IN' ? financial.inBankAccount() : financial.usBankAccount(),
      transactionId: financial.transactionId(),
    },
    device: {
      imei:       network.imei(),    // ← correctly under network/device
      imsi:       network.imsi(country),
      iccid:      network.iccid(),
      macAddress: network.macAddress(),
      ipAddress:  network.ipv4('public'),
      uuid:       network.uuidV4(),
    },
    meta: { generatedAt: new Date().toISOString(), country },
  };
}

module.exports = {
  personal, financial, network, location, datatools,
  fullRecord,
  // Top-level shortcuts
  uuid:       network.uuidV4,
  ip:         network.ipv4,
  mac:        network.macAddress,
  imei:       network.imei,       // forge.imei() — from network, not financial
  creditCard: financial.creditCard,
  iban:       financial.iban,
  address:    location.address,
  profile:    personal.profile,
};
