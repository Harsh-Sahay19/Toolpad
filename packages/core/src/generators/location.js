'use strict';
const { randomFrom, randomInt, zeroPad, randomDigits } = require('../utils');

const STREETS = ['Main','Oak','Maple','Cedar','Elm','Washington','Park','Sunset','Willow','Broadway','Forest','River','Highland','Valley','Ridge'];
const STYPES  = ['Street','Avenue','Boulevard','Drive','Lane','Road','Court','Way','Circle','Terrace'];
const US_STATES = [
  { name:'California', abbr:'CA', cities:['Los Angeles','San Francisco','San Diego','Sacramento'] },
  { name:'New York',   abbr:'NY', cities:['New York City','Buffalo','Albany','Rochester'] },
  { name:'Texas',      abbr:'TX', cities:['Houston','Dallas','Austin','San Antonio'] },
  { name:'Florida',    abbr:'FL', cities:['Miami','Orlando','Tampa','Jacksonville'] },
  { name:'Illinois',   abbr:'IL', cities:['Chicago','Springfield','Naperville'] },
  { name:'Washington', abbr:'WA', cities:['Seattle','Spokane','Tacoma','Bellevue'] },
];
const IN_STATES = [
  { name:'Karnataka',   cities:['Bengaluru','Mysuru','Hubli'],    pin:[560001,560100] },
  { name:'Maharashtra', cities:['Mumbai','Pune','Nagpur'],        pin:[400001,400100] },
  { name:'Tamil Nadu',  cities:['Chennai','Coimbatore','Madurai'],pin:[600001,600100] },
  { name:'Delhi',       cities:['New Delhi','Dwarka','Rohini'],   pin:[110001,110100] },
];
const UK_AREAS = [
  { city:'London',     prefix:'EC' }, { city:'Manchester', prefix:'M' },
  { city:'Birmingham', prefix:'B' },  { city:'Edinburgh',  prefix:'EH' },
];

function streetLine() { return `${randomInt(1,9999)} ${randomFrom(STREETS)} ${randomFrom(STYPES)}`; }

function usAddress() {
  const st = randomFrom(US_STATES), city = randomFrom(st.cities);
  const zip = zeroPad(randomInt(10000,99999), 5);
  const apt = Math.random() > 0.7 ? `, Apt ${randomInt(1,999)}` : '';
  return { street: streetLine() + apt, city, state: st.name, stateCode: st.abbr, zipCode: zip, country: 'United States', formatted: `${streetLine()}, ${city}, ${st.abbr} ${zip}, US` };
}
function inAddress() {
  const st = randomFrom(IN_STATES), city = randomFrom(st.cities);
  const pin = randomInt(st.pin[0], st.pin[1]);
  const sector = `${randomFrom(['Sector','Block','Layout','Colony'])} ${randomInt(1,50)}`;
  return { street: `${randomInt(1,999)}, ${sector}`, city, state: st.name, pinCode: String(pin), country: 'India', formatted: `${randomInt(1,999)}, ${sector}, ${city}, ${st.name} - ${pin}, India` };
}
function ukAddress() {
  const a = randomFrom(UK_AREAS);
  const pc = `${a.prefix}${randomInt(1,9)} ${randomInt(1,9)}${String.fromCharCode(65+randomInt(0,25))}${String.fromCharCode(65+randomInt(0,25))}`;
  return { street: streetLine(), city: a.city, postcode: pc, country: 'United Kingdom', formatted: `${streetLine()}, ${a.city}, ${pc}, UK` };
}
function address(country = 'US') {
  switch (country.toUpperCase()) { case 'IN': return inAddress(); case 'UK': return ukAddress(); default: return usAddress(); }
}

const BOUNDS = {
  US: { lat:[24.5,49.4],  lng:[-125,-66.9] },
  IN: { lat:[8.4,37.1],   lng:[68.7,97.4]  },
  UK: { lat:[49.9,60.8],  lng:[-8.6,1.8]   },
  AU: { lat:[-43.6,-10.7],lng:[113.3,153.6] },
};
function coordinates(bounds) {
  const b = bounds || { lat:[-90,90], lng:[-180,180] };
  return { latitude: parseFloat((Math.random()*(b.lat[1]-b.lat[0])+b.lat[0]).toFixed(6)), longitude: parseFloat((Math.random()*(b.lng[1]-b.lng[0])+b.lng[0]).toFixed(6)) };
}
function coordinatesInCountry(country = 'US') { return coordinates(BOUNDS[country.toUpperCase()]); }

const TIMEZONES = ['America/New_York','America/Chicago','America/Denver','America/Los_Angeles','Europe/London','Europe/Paris','Europe/Berlin','Asia/Kolkata','Asia/Tokyo','Asia/Shanghai','Australia/Sydney'];
function timezone() { return randomFrom(TIMEZONES); }

module.exports = { streetLine, address, usAddress, inAddress, ukAddress, coordinates, coordinatesInCountry, timezone };
