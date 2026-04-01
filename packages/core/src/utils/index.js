'use strict';

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function zeroPad(num, length) { return String(num).padStart(length, '0'); }
function randomDigits(n) { return Array.from({ length: n }, () => randomInt(0, 9)).join(''); }
function randomHex(n) { return Array.from({ length: n }, () => randomInt(0, 15).toString(16)).join(''); }

function luhnCheckDigit(partial) {
  const d = partial.split('').map(Number).reverse();
  let s = 0;
  for (let i = 0; i < d.length; i++) { let x = d[i]; if (i % 2 === 0) { x *= 2; if (x > 9) x -= 9; } s += x; }
  return (10 - (s % 10)) % 10;
}
function luhnValidate(number) {
  const d = String(number).replace(/\D/g, '').split('').map(Number).reverse();
  let s = 0;
  for (let i = 0; i < d.length; i++) { let x = d[i]; if (i % 2 !== 0) { x *= 2; if (x > 9) x -= 9; } s += x; }
  return s % 10 === 0;
}
function luhnGenerate(prefix, totalLength) {
  const partial = prefix + randomDigits(totalLength - prefix.length - 1);
  return partial + luhnCheckDigit(partial);
}

module.exports = { randomInt, randomFrom, zeroPad, randomDigits, randomHex, luhnCheckDigit, luhnValidate, luhnGenerate };
