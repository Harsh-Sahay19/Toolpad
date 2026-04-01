# Toolpad — Complete Developer Tools Suite

> Full-stack package: backend API + frontend pages for all tools.
> Editorial Concept B design. Google Ads ready. SEO optimised.

## Project structure

```
toolpad/
├── packages/
│   └── core/                        # @toolpad/core — all generators & data tools
│       └── src/
│           ├── generators/
│           │   ├── personal.js      # Names, email, phone, profile
│           │   ├── financial.js     # Credit cards, IBAN, bank accounts
│           │   ├── network.js       # UUID, MAC, IP, IMEI*, IMSI, ICCID
│           │   ├── location.js      # Addresses, GPS, timezone
│           │   └── datatools.js     # JSON/XML format, convert, encode
│           ├── utils/index.js       # Luhn, shared helpers
│           └── index.js             # Public API
└── apps/
    ├── api/                         # Express REST API (port 3001)
    │   └── src/
    │       ├── routes/index.js      # All endpoints
    │       └── server.js
    └── web/                         # Static frontend
        └── src/
            ├── pages/
            │   ├── index.html       # Homepage (editorial layout)
            │   ├── generators/
            │   │   └── imei.html    # IMEI tool page (SEO landing page)
            │   └── formatters/
            │       └── json.html    # JSON formatter page
            ├── styles/main.css      # All styles (Concept B)
            └── scripts/main.js      # Search, dark mode, recent tools
```

*IMEI was moved from `financial` to `network` — it is a device identifier, not a financial instrument.

## Tool categorisation (corrected)

| Category | Tools |
|---|---|
| **Personal** | Fake name, email, phone, full profile |
| **Financial** | Credit card, IBAN, bank account, transaction ID |
| **Device & Network** | IMEI, UUID, MAC address, IP, IMSI, ICCID |
| **Location** | Address (US/IN/UK), GPS coordinates, timezone |
| **Data tools** | JSON format/minify/validate, XML format/minify, JSON↔XML, JSON↔CSV, text→JSON/XML, Base64, Hex |

## Quick start

```bash
# Install API dependencies
cd apps/api && npm install

# Start API server
npm start
# → http://localhost:3001/api/v1

# Serve frontend (any static server)
cd apps/web/src && npx serve .
# → http://localhost:3000
```

## All API endpoints

### Personal
```
GET /api/v1/personal/profile?gender=male&country=IN&count=5
GET /api/v1/personal/name?gender=female
GET /api/v1/personal/email?count=10
GET /api/v1/personal/phone?country=IN
```

### Financial
```
GET /api/v1/financial/credit-card?network=visa
GET /api/v1/financial/iban?country=GB
GET /api/v1/financial/bank-account?country=IN
GET /api/v1/financial/transaction-id
```

### Device & Network (IMEI is here, not financial)
```
GET /api/v1/network/imei?count=10
GET /api/v1/network/uuid?version=4&count=20
GET /api/v1/network/mac?separator=-
GET /api/v1/network/ip?type=private&version=4
GET /api/v1/network/imsi?country=IN
GET /api/v1/network/iccid
```

### Location
```
GET /api/v1/location/address?country=IN
GET /api/v1/location/coordinates?country=IN
GET /api/v1/location/timezone
```

### Data tools
```
POST /api/v1/datatools/format/json      body: {"input": "..."}
POST /api/v1/datatools/minify/json      body: {"input": "..."}
POST /api/v1/datatools/validate/json    body: {"input": "..."}
POST /api/v1/datatools/format/xml       body: {"input": "..."}
POST /api/v1/datatools/convert/json-to-xml   body: {"input":"...", "rootTag":"root"}
POST /api/v1/datatools/convert/xml-to-json   body: {"input": "..."}
POST /api/v1/datatools/convert/json-to-csv   body: {"input": "..."}
POST /api/v1/datatools/convert/csv-to-json   body: {"input": "..."}
POST /api/v1/datatools/convert/text-to-json  body: {"input": "name: John\nage: 30"}
POST /api/v1/datatools/convert/text-to-xml   body: {"input": "..."}
POST /api/v1/datatools/encode/base64    body: {"input": "text"}
POST /api/v1/datatools/decode/base64    body: {"input": "dGV4dA=="}
POST /api/v1/datatools/encode/hex       body: {"input": "text"}
POST /api/v1/datatools/decode/hex       body: {"input": "74657874"}

GET  /api/v1/record?country=IN&count=5
```

## SEO pages to build next

| Priority | Page | Target keyword |
|---|---|---|
| P1 | `/generators/imei` | "IMEI generator" — 50K/mo |
| P1 | `/generators/uuid` | "UUID generator" — 200K/mo |
| P1 | `/generators/mac-address` | "MAC address generator" — 30K/mo |
| P1 | `/formatters/json` | "JSON formatter" — high volume |
| P1 | `/generators/fake-address` | "fake address generator" — 150K/mo |
| P2 | `/generators/credit-card` | "credit card generator" — 40K/mo |
| P2 | `/generators/iban` | "IBAN generator" — 20K/mo |
| P2 | `/generators/ip-address` | "random IP generator" — 8K/mo |
| P3 | `/generators/imsi` | "IMSI generator" — 2K/mo, very low competition |

## Disclaimer
All generated data is fictional and for software testing only.
Never use for fraud, deception, or any illegal activity.
