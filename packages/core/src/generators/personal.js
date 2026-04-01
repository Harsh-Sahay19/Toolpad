'use strict';
const { randomFrom, randomInt, zeroPad, randomDigits } = require('../utils');

const FIRST_M = ['James','John','Robert','Michael','David','Aarav','Arjun','Liam','Noah','Oliver','Wei','Carlos','Lucas','Ethan','Rohan','Vikram'];
const FIRST_F = ['Mary','Patricia','Jennifer','Emma','Olivia','Priya','Ananya','Sophia','Mia','Mei','Ana','Sofia','Laura','Divya','Shreya','Pooja'];
const LAST    = ['Smith','Johnson','Williams','Brown','Garcia','Sharma','Patel','Kumar','Singh','Anderson','Wang','Tanaka','Rodriguez','Lopez','Gupta','Mehta'];
const DOMAINS = ['gmail.com','yahoo.com','outlook.com','hotmail.com','protonmail.com','icloud.com','testmail.com','example.com'];
const PHONE_FMT = {
  US: () => `+1 (${randomInt(200,999)}) ${randomInt(200,999)}-${zeroPad(randomInt(0,9999),4)}`,
  IN: () => `+91 ${randomFrom(['6','7','8','9'])}${randomInt(100000000,999999999)}`,
  UK: () => `+44 7${randomInt(100,999)} ${randomInt(100,999)} ${randomInt(1000,9999)}`,
  AU: () => `+61 4${randomInt(10,99)} ${randomInt(100,999)} ${randomInt(100,999)}`,
  DE: () => `+49 1${randomFrom(['5','6','7'])}${randomInt(10000000,99999999)}`,
};

function firstName(gender = 'any') {
  if (gender === 'male')   return randomFrom(FIRST_M);
  if (gender === 'female') return randomFrom(FIRST_F);
  return randomFrom([...FIRST_M, ...FIRST_F]);
}
function lastName() { return randomFrom(LAST); }
function fullName(gender = 'any') { return `${firstName(gender)} ${lastName()}`; }
function email(name) {
  const domain = randomFrom(DOMAINS);
  if (name) {
    const [fn, ln = ''] = name.toLowerCase().replace(/[^a-z ]/g, '').split(' ');
    const styles = [() => `${fn}.${ln}`, () => `${fn}_${ln}`, () => `${fn}${ln[0] || ''}`, () => `${fn}${randomInt(1,999)}`];
    return `${randomFrom(styles)()}@${domain}`;
  }
  return `${firstName().toLowerCase()}.${lastName().toLowerCase()}${randomInt(1,99)}@${domain}`;
}
function phoneNumber(country = 'US') { return (PHONE_FMT[country] || PHONE_FMT.US)(); }
function username(base) {
  if (base) return base.toLowerCase().replace(/\s+/g,'_') + randomInt(1,999);
  return `${firstName().toLowerCase()}_${lastName().toLowerCase()}${randomInt(1,99)}`;
}
function dateOfBirth(minAge = 18, maxAge = 80) {
  const y = new Date().getFullYear() - randomInt(minAge, maxAge);
  return `${y}-${zeroPad(randomInt(1,12),2)}-${zeroPad(randomInt(1,28),2)}`;
}
function profile(options = {}) {
  const gender  = options.gender || randomFrom(['male','female']);
  const country = options.country || 'US';
  const fn = firstName(gender), ln = lastName(), name = `${fn} ${ln}`;
  return { firstName: fn, lastName: ln, fullName: name, gender, email: email(name), username: username(name), phoneNumber: phoneNumber(country), dateOfBirth: dateOfBirth() };
}

module.exports = { firstName, lastName, fullName, email, phoneNumber, username, dateOfBirth, profile };
