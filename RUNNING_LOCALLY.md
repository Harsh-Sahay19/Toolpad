# Running Toolpad locally

## Quick start (3 commands)

```bash
# 1. Install API dependencies
cd apps/api && npm install && cd ../..

# 2. Start the API server (port 3001)
node apps/api/src/server.js

# 3. In a new terminal — serve the frontend (port 3000)
npx serve apps/web/src -p 3000
```

Then open:
- Frontend: http://localhost:3000
- API:      http://localhost:3001/api/v1

---

## Run tests

```bash
node scripts/test.js
```

Expected output: 30 passed, 0 failed

---

## API examples

```bash
# Generate 10 IMEI numbers (device identifier — correctly under /network/)
curl "http://localhost:3001/api/v1/network/imei?count=10"

# Generate a full fake profile for India
curl "http://localhost:3001/api/v1/personal/profile?country=IN"

# Generate UUID v4
curl "http://localhost:3001/api/v1/network/uuid?count=5"

# Format JSON
curl -X POST http://localhost:3001/api/v1/datatools/format/json \
  -H "Content-Type: application/json" \
  -d '{"input": "{\"name\":\"John\",\"age\":30}"}'

# Encode Base64
curl -X POST http://localhost:3001/api/v1/datatools/encode/base64 \
  -H "Content-Type: application/json" \
  -d '{"input": "toolpad.in"}'

# Full combined record (all generators)
curl "http://localhost:3001/api/v1/record?country=IN&count=2"
```

---

## Project structure

```
toolpad/
├── package.json              ← root monorepo config
├── .gitignore
├── README.md
├── scripts/
│   └── test.js               ← run with: node scripts/test.js
├── .github/
│   └── workflows/ci.yml      ← GitHub Actions CI
├── packages/
│   └── core/
│       ├── package.json
│       └── src/
│           ├── index.js       ← main export
│           ├── utils/index.js ← Luhn, MOD-97, random helpers
│           └── generators/
│               ├── personal.js   ← names, email, phone, profile
│               ├── financial.js  ← credit cards, IBAN, bank accounts
│               ├── network.js    ← UUID, MAC, IP, IMEI*, IMSI, ICCID
│               ├── location.js   ← addresses, GPS, timezone
│               └── datatools.js  ← JSON/XML format/convert, Base64, Hex
└── apps/
    ├── api/
    │   ├── package.json
    │   └── src/
    │       ├── server.js
    │       └── routes/index.js
    └── web/
        └── src/
            ├── pages/
            │   ├── index.html          ← homepage
            │   ├── api-docs.html
            │   ├── generators/
            │   │   ├── imei.html       ← SEO: "IMEI generator" 50K/mo
            │   │   ├── uuid.html       ← SEO: "UUID generator" 200K/mo
            │   │   └── mac-address.html
            │   ├── formatters/
            │   │   └── json.html       ← SEO: "JSON formatter"
            │   └── converters/
            │       ├── base64.html
            │       └── text-to-json.html
            ├── styles/main.css         ← shared styles, dark mode
            └── scripts/main.js        ← search, theme, recent tools
```

*IMEI is a device identifier and lives in network.js — not financial.js
