# SEO changelog

Changes made in the SEO pass, grouped by PR. Each PR is stacked on the one before it:

1. `seo/t1-t3-indexing-metadata` (base: `main`)
2. `seo/t4-tool-guides` (base: PR 1)
3. `seo/t5-t6-trust-hub` (base: PR 2)

Nothing has been deployed by this pass. Review the PRs before merging.

## Titles and descriptions changed (PR 1)

Titles over 60 characters and descriptions over 155 characters were shortened. The Open Graph title and description on each page were kept in step with the new text.

| Page | Title before | Title after |
|---|---|---|
| `/converters/base64` | Base64 Encoder Decoder — Encode & Decode Instantly Online \| Free | Base64 Encoder and Decoder – Free Online Tool \| Toolpad |
| `/converters/hex` | Hex Encoder / Decoder — Convert Text to Hexadecimal \| Toolpad | Hex Encoder and Decoder – Text to Hexadecimal \| Toolpad |
| `/converters` | Converters — JSON, XML, CSV, Base64, Hex Converters \| Toolpad | Converters – JSON, XML, CSV and Base64 \| Toolpad |
| `/converters/json-to-csv` | JSON to CSV Converter — Export JSON Array as Spreadsheet \| Toolpad | JSON to CSV Converter – Export JSON Array \| Toolpad |
| `/converters/text-to-json` | Text to JSON Converter — Convert Plain Text to JSON \| Toolpad | Text to JSON Converter – Plain Text to JSON \| Toolpad |
| `/generators/credit-card` | Credit Card Generator — Luhn-Valid Visa, Mastercard & Amex Test Numbers | Credit Card Generator – Luhn-Valid Test Numbers \| Toolpad |
| `/generators/iban` | IBAN Generator — Free MOD-97 Valid IBANs for GB, DE, FR \| Toolpad | IBAN Generator – MOD-97 Valid Test IBANs \| Toolpad |
| `/generators/imei` | IMEI Generator — Free Luhn-Valid IMEI Numbers \| Toolpad | IMEI Generator – Random Valid IMEI Numbers for Testing |
| `/generators/imsi` | IMSI Generator — Free Random IMSI Numbers with Real MCC-MNC \| Toolpad | IMSI Generator – Random Test IMSI Numbers \| Toolpad |
| `/generators` | Data Generators — Fake Name, Address, IMEI, UUID & More \| Toolpad | Test Data Generators – Names, Emails, IBANs \| Toolpad |
| `/generators/ip-address` | IP Address Generator — Random IPv4 & IPv6 Addresses \| Toolpad | IP Address Generator – Random IPv4 and IPv6 \| Toolpad |
| `/generators/lorem-ipsum` | Lorem Ipsum Generator — Placeholder Text Generator Online \| Free | Lorem Ipsum Generator – Placeholder Text \| Toolpad |
| `/generators/mac-address` | MAC Address Generator — Free Online Tool with Real OUI Prefixes \| Toolpad | MAC Address Generator – Vendor Prefixes \| Toolpad |
| `/generators/test-address-india` | Test Indian Address Generator with PIN Codes — Free \| Toolpad | Test Indian Address Generator with PIN Codes \| Toolpad |
| `/generators/test-email` | Test Email Generator — Random Email Addresses for Testing \| Toolpad | Test Email Generator – Random Test Addresses \| Toolpad |
| `/generators/test-name` | Test Name Generator India — Random Indian Names for Testing \| Free | Test Name Generator – Indian and Global Names \| Toolpad |
| `/generators/test-phone` | Phone Number Generator — Test Numbers for US, India, UK & More \| Toolpad | Phone Number Generator – Test Numbers \| Toolpad |
| `/generators/test-profile` | Test Person Generator — Full Profiles for US, India & UK \| Free | Test Person Generator – Full Profiles \| Toolpad |
| `/generators/unix-timestamp` | Unix Timestamp Converter — Date to Timestamp & Back \| Toolpad | Unix Timestamp Converter – Dates and Back \| Toolpad |
| `/generators/uuid` | UUID Generator — Free Online RFC 4122 UUID v4 & v1 \| Toolpad | UUID Generator – RFC 4122 UUIDs v4 and v1 \| Toolpad |

The IMEI page's title has no site suffix, to fit the 60-character limit. The spec's wording was used.

Descriptions changed on `/`, `/generators`, `/generators/credit-card`, `/generators/mac-address`, `/generators/password`, `/generators/test-address-india`, `/generators/test-name`, `/generators/imei`, `/utilities/emi-calculator` and `/utilities/sip-calculator`. The IMEI description now reads: "Generate random, Luhn-valid IMEI numbers for software testing, with an optional brand TAC prefix. Free and instant. Test data only, not a real device."

## Other PR 1 changes

- `scripts/seo-audit.js` (new): checks every page for title and description length, one `<h1>`, a self-referencing canonical, `lang`, and Open Graph and Twitter tags. The baseline run found 30 problems. It now passes on all 40 pages.
- Twitter card tags added to `/contact` and `/privacy`.
- `scripts/generate-sitemap.js` (new): builds `sitemap.xml` from each page's canonical link, with `lastmod` from git history. Pages marked noindex are skipped.
- The sitemap now lists 40 URLs. It previously listed 37, and it was missing `/about`, `/generators/imsi` and `/generators/uuid`.
- `scripts/add-structured-data.js` (new): adds a `BreadcrumbList` to every page, built from the URL and the `<h1>`. It adds a `FAQPage` only where the FAQ questions and answers are visible on the page. Existing `WebApplication` blocks use `applicationCategory` `UtilitiesApplication`. No ratings or reviews were added.

## Tool guides (PR 2)

Each page gets a "What this does / How to use it / How it works / Limits" section above the existing SEO copy. Drafts are also in `docs/content-drafts/` for editing. The owner should review all of them before merging.

- `/generators/imei`, `/generators/imsi`, `/generators/uuid`, `/generators/iban`, `/generators/test-address`, `/generators/test-name`, `/generators/test-profile`, `/converters/text-to-json`, `/formatters/json`.
- Each guide has a limits section. The IMEI guide says that changing a device's IMEI is illegal in many countries, including India and the United States. Please have this wording checked before it is published.

Word counts are 275–400 per guide. That is below the 400–800 target in the spec. Adding words to reach the target would mean padding, so they were not added.

## Trust pages and navigation (PR 3)

- `/terms` (new). Contains placeholders for the governing law, the legal entity name and the date. These must be completed by the owner.
- `/disclaimer` (new). Covers test data, the calculators as estimates, and the fact that nothing is financial, tax or legal advice.
- `/tools` (new): a static list of all 31 tools, grouped by category. Linked from the header and footer.
- `/privacy`: a placeholder section for advertising and cookies. It must be finalised before ads go live.
- The header and footer now link to All tools, Terms and Disclaimer.
- Sitemap regenerated: 43 URLs.

## Checks not performed

- Google Rich Results Test has not been run. The JSON-LD was checked for valid JSON only.
- Lighthouse, mobile, on `/generators/imei` (run locally, simulated throttling): performance 64, LCP 7.1 s, CLS 0. Adding font preconnect hints did not change these numbers, so that change was reverted. The LCP cause has not been identified.
- `robots.txt` was not changed. It only blocks `/api/`, and it already points to the sitemap. The three URLs blocked in Search Console and the 404 and 403 URLs have not been identified, because they are in the owner's Search Console export, not the repo.
- The redirects in `vercel.json` do not take effect on the live site yet. Old `fake-*` and DOCX URLs currently return the home page. The Vercel root directory needs checking.
