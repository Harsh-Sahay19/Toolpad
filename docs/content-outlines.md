# Content outlines for high-traffic tool pages

These outlines plan the expanded content for the highest-traffic tool pages. They are planning documents only: the final copy still needs to be written and reviewed. Each outline covers a how-to section, an FAQ, use cases, and a short explanation of how the tool works.

Every outline ends with **Accuracy checks**. Confirm these before any claim goes live. Tools in this suite generate test or sample data, so the copy must never suggest the output is a real IMEI, IMSI, person, address or phone number.

Pages covered (in priority order):

1. `/generators/imei`
2. `/generators/imsi`
3. `/generators/test-address` (renamed from fake-address)
4. `/converters/text-to-json`
5. `/generators/test-name` (renamed from fake-name)

---

## 1. IMEI generator — `/generators/imei`

**Target queries:** IMEI generator, IMEI number generator, valid IMEI generator, test IMEI

**Current state:** Generator and validator tabs, brand selector, up to 100 IMEIs per run, CSV export. The SEO section covers the IMEI structure, TAC prefixes, validation and use cases.

### Outline

- **H1 and intro (about 60 words):** what the tool does (generates Luhn-valid, 15-digit test IMEIs and validates existing ones), and who it is for (app and QA testing).
- **How to generate test IMEIs (numbered steps):**
  1. Choose a brand, or leave "Any brand" for a mix.
  2. Choose how many IMEIs to generate (5 to 100).
  3. Click Generate, then copy or download the CSV.
- **How to validate an IMEI (numbered steps):** paste one IMEI, or several one per line in bulk. Explain the three checks: 15 digits, digits only, Luhn checksum.
- **How it works:** a 15-digit IMEI is an 8-digit TAC, a 6-digit serial, and a Luhn check digit. The generator starts with a brand's TAC prefix, fills the middle with random digits, and calculates the check digit.
- **What a valid IMEI does and does not mean:** a passing check means the format is right. It does not mean the number belongs to a registered device. Link to the FAQ.
- **Use cases:** mobile app device-ID logic, QA of input forms and telecom billing tests, MDM and fleet simulations, blacklist-lookup API tests.
- **FAQ (suggested questions):**
  - Are generated IMEIs registered to real devices?
  - What is a TAC and how do I look one up?
  - Is it legal to generate IMEI numbers?
  - Can I use generated IMEIs in production?
  - How does the Luhn check work?
  - What is the difference between IMEI and IMSI?
- **Internal links:** IMSI generator, UUID generator, full profile generator.
- **API section:** `GET /api/v1/network/imei?count=50`, with `&brand=` filter.

### Accuracy checks

- Brand TAC prefixes are the fixed values in the page script. Do not describe them as "sourced from the GSMA" or as passing "TAC lookup checks" unless verified. The current page no longer makes these claims; keep it that way.
- Generated IMEIs use random serial digits. The copy must not imply they match any real handset.

---

## 2. IMSI generator — `/generators/imsi`

**Target queries:** IMSI generator, random IMSI number, IMSI number format, test IMSI

**Current state:** 15-digit IMSI generator with MCC-MNC pairs for named operators. The SEO section covers IMSI structure, MCC-MNC pairs and API access. FAQs cover IMEI, MSISDN and ICCID.

### Outline

- **H1 and intro:** generates test IMSI numbers (15-digit subscriber identifiers) using MCC-MNC operator codes. Name the operators shown on the page only.
- **How to generate test IMSIs (numbered steps):** pick an operator or country, choose a count, generate, export CSV.
- **How it works:** an IMSI is the mobile country code (MCC, 3 digits), the mobile network code (MNC, 2 to 3 digits), and the subscriber identification number (MSIN). The generator fills MSIN with random digits.
- **IMSI vs IMEI vs MSISDN vs ICCID:** a short comparison table. This is the main differentiator for search intent.
- **Use cases:** telecom billing and provisioning test data, HLR/HSS simulator input, SIM-profile tests.
- **FAQ (suggested questions):**
  - What is an IMSI number?
  - Can an IMSI be used to identify a real person?
  - How is an IMSI different from an IMEI?
  - Which MCC-MNC codes are used?
  - Is this legal to use?
- **Internal links:** IMEI generator, ICCID or SIM-related tools if added, phone number generator.

### Accuracy checks

- The existing FAQ says an ICCID is "19–20 digits" and that a SIM can store "multiple IMSI profiles". Verify both before keeping them. The "dual-SIM-on-one-chip" example is speculative and should be removed or sourced.
- Only list operators whose MCC-MNC codes are confirmed against an official source.
- State clearly that generated IMSIs are not assigned to any SIM or subscriber.

---

## 3. Test address generator — `/generators/test-address`

**Target queries:** fake address generator (existing ranking), test address generator, random address generator India, fake address generator India

**Current state:** United States, India and United Kingdom formats; cards or CSV output; 50 addresses per run; API endpoints for addresses and coordinates. A dedicated India page exists at `/generators/test-address-india`. The India section has been expanded.

### Outline

- **H1 and intro:** random test addresses for US, India and UK formats, for forms, databases and demos.
- **How to generate addresses (numbered steps):** choose a country, choose a count, pick cards or CSV, generate, copy or download.
- **Country formats:** one short block per country (already partly on the page). For India, link to the dedicated page.
- **How it works:** random street or locality, city from a fixed list per region, and a postal code in a valid range for that region (ZIP range, PIN prefix, UK postcode pattern).
- **What the addresses are not:** not real properties, and they do not resolve on mapping services.
- **Use cases:** address-form validation, e-commerce seed data, logistics and mapping demos, UI mockups.
- **FAQ (suggested questions):**
  - Are these real addresses?
  - Why are the postal codes in the right range?
  - Can I get GPS coordinates with addresses?
  - Can I use these in production?
  - How do I export a CSV?
- **Internal links:** India address page, full profile generator, test name generator, phone number generator.

### Accuracy checks

- The "Why are ZIP/PIN codes in the right range?" answer states that Delhi PINs start with 110 and Bengaluru with 560. Keep those prefixes, since they match the generator's data.
- The India page states that PIN codes are random within a range. Do not promise exact PIN-to-locality matching.
- The GPS coordinates feature must be checked against the API before it is described again.

---

## 4. Text to JSON converter — `/converters/text-to-json`

**Target queries:** text to JSON converter, convert text to JSON online, key value to JSON, plain text to JSON

**Current state:** text input with a JSON output panel, copy and download. One short "How text to JSON works" section and little else.

### Outline

- **H1 and intro:** converts plain `key: value` text into JSON in the browser, with no sign-up and no data sent to the server.
- **How to convert (numbered steps):** write one `key: value` pair per line, check the JSON output, copy or download.
- **Input format and rules:** how keys and values are split, how types are detected (numbers, `true`/`false`), and what happens to lines without a colon. Verify each rule against the code first.
- **Example:** show the placeholder input (`name`, `age`, `city`, `active`) and its JSON output.
- **How it works:** the page splits each line at the first colon, trims whitespace, and builds an object. Verify before publishing.
- **Use cases:** turning notes or config snippets into JSON, creating test fixtures, converting settings into an API request body.
- **FAQ (suggested questions):**
  - Is my text sent to a server?
  - What types does the converter detect?
  - What happens to nested data or lists?
  - Can it handle multi-line values?
  - How is this different from the JSON formatter?
- **Internal links:** JSON formatter, JSON to XML, text to XML, JSON to CSV.

### Accuracy checks

- The "Free, browser-based, no data stored" wording must match the code. Confirm the converter does not send text to the API.
- The FAQ answers must describe the exact parsing rules in the page script.

---

## 5. Test name generator — `/generators/test-name`

**Target queries:** fake name generator India, random Indian name generator, test name generator India, fake name generator

**Current state:** name generator with an India-focused heading, regional name pools, bulk generation with CSV, and six FAQs. The page already has the most copy of any tool page, so the outline mainly restructures it and removes unverified claims.

### Outline

- **H1 and intro:** generates realistic test names, including Indian regional name pools, for forms, databases and demos.
- **How to generate names (numbered steps):** pick a region or name pool, choose a gender (if available), choose a count, generate, export CSV.
- **Regions and name pools:** a short table of the regions and languages covered (Hindi, South Indian, Gujarati, Bengali, plus US, UK, Canada and Australia). Verify against the code first.
- **How it works:** names are combined from first-name and last-name pools per region. Verify the actual generation logic in the page script before describing it.
- **Use cases:** test user accounts, seed data, demo screenshots, testing name-field validation with varied characters.
- **FAQ:** keep the six existing questions, after review:
  - Are generated Indian names based on real people?
  - What Indian regions and languages are supported?
  - Can I use these names in a test database?
  - How many unique names can be generated?
  - Why do some Indian names appear with different spellings?
  - Can I generate names with a username or email address?
- **Internal links:** test profile generator, test email generator, test address generator, India address page.

### Accuracy checks

- The "Data privacy and PDPB compliance" section makes a compliance claim. Remove it or rewrite it as a factual description of what the tool does. Do not state legal compliance.
- Confirm the "unique names" claim against the name pool sizes.
- The current heading "Test name generator for India" and the FAQ wording should match the actual regional coverage.

---

## Review checklist (apply to every page before publishing)

- [ ] Title under about 60 characters, main query first.
- [ ] Meta description 140–155 characters, no keyword stuffing.
- [ ] Every claim checked against the code or a named source.
- [ ] No suggestion that generated data is real.
- [ ] Internal links point to pages that exist.
- [ ] Canonical, Open Graph and Twitter tags match the title and description.
- [ ] Renamed URLs (`test-*`) used, not the old `fake-*` ones.
