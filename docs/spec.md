# Toolpad website specification

> **Status:** the visual sections (5 and 7) and the review points (12) describe the site before the redesign. The redesign replaced the colour tokens, typeface, header, footer and home page, and fixed several review points. The shared stylesheet is `apps/web/src/styles/main.css`; a copy is served from `apps/web/src/pages/styles/main.css`, and both must be kept identical.

This document describes how the Toolpad website is built and why it looks and behaves the way it does. It is written for design review: each section states the current design choice, the reason behind it where the code shows one, and any point that is inconsistent or needs a decision. Section 12 collects those review points in one place.

Facts in this document come from the repository at the time of writing (the `main` branch, after commit `5767bb1`). Where a choice is not documented in code, the section says so instead of guessing.

---

## 1. Purpose and audience

- **What it is:** a free suite of browser-based developer utilities. Tools generate test data (names, addresses, emails, phone numbers, IMEI and IMSI numbers, UUIDs, and similar), format or convert data (JSON, XML, CSV, Base64, hex, URL encoding), and provide a few personal-finance calculators (EMI, GST, SIP).
- **Who it is for:** developers, QA engineers and testers who need realistic-looking test data quickly. Some visitors arrive from search for "fake address generator" style queries.
- **Positioning:** free, no sign-up, no limits, with a public REST API. Every generated value is labelled as test or sample data. The site must never imply that generated numbers or addresses belong to real people or devices.
- **Business model:** advertising through Google AdSense (see section 9).

## 2. Scope and tool inventory

The site has 40 HTML pages under `apps/web/src/pages`. The URL is the file path with the `.html` extension removed (Vercel `cleanUrls: true`).

| Area | Route | Page | Purpose |
|---|---|---|---|
| Home | `/` | `index.html` | Hero, search, tool grid |
| Generators | `/generators` | `generators/index.html` | Category index |
| | `/generators/test-name` | `test-name.html` | Test names (Indian regional pools plus US, UK, Canada, Australia) |
| | `/generators/test-email` | `test-email.html` | Test email addresses |
| | `/generators/test-phone` | `test-phone.html` | Phone numbers (US, India, UK, Australia, Germany) |
| | `/generators/test-profile` | `test-profile.html` | Full test person profile |
| | `/generators/test-address` | `test-address.html` | Addresses (US, India, UK) |
| | `/generators/test-address-india` | `test-address-india.html` | India-specific address page |
| | `/generators/credit-card` | `credit-card.html` | Luhn-valid test card numbers |
| | `/generators/iban` | `iban.html` | MOD-97-valid IBANs (GB, DE, FR) |
| | `/generators/imei` | `imei.html` | IMEI generator and validator |
| | `/generators/imsi` | `imsi.html` | IMSI numbers |
| | `/generators/uuid` | `uuid.html` | UUIDs |
| | `/generators/mac-address` | `mac-address.html` | MAC addresses |
| | `/generators/ip-address` | `ip-address.html` | IP addresses |
| | `/generators/color-converter` | `color-converter.html` | HEX, RGB, HSL |
| | `/generators/unix-timestamp` | `unix-timestamp.html` | Timestamp conversion |
| | `/generators/password` | `password.html` | Random passwords |
| | `/generators/lorem-ipsum` | `lorem-ipsum.html` | Placeholder text |
| Formatters | `/formatters` | `formatters/index.html` | Category index |
| | `/formatters/json` | `formatters/json.html` | JSON format, minify, validate |
| | `/formatters/xml` | `formatters/xml.html` | XML formatter (see review point R5) |
| Converters | `/converters` | `converters/index.html` | Category index |
| | `/converters/json-to-xml`, `xml-to-json`, `json-to-csv`, `csv-to-json`, `text-to-json`, `text-to-xml` | matching files | Data format conversion |
| | `/converters/base64`, `hex`, `url-encoder` | matching files | Encoding |
| | `/converters/docx-to-pdf` | `docx-to-pdf.html` | DOCX to PDF (server-side, not working; see R1) |
| Utilities | `/utilities` | `utilities/index.html` | Category index |
| | `/utilities/emi-calculator`, `gst-calculator`, `sip-calculator` | matching files | Finance calculators |
| Information | `/about` | `about.html` | About the project |
| | `/contact` | `contact.html` | Contact options |
| | `/privacy` | `privacy.html` | Privacy policy |
| | `/api-docs` | `api-docs.html` | REST API documentation |

Other files at the site root: `sitemap.xml`, `robots.txt`, `ads.txt` (Google AdSense publisher entry), and a Search Console verification file.

## 3. Information architecture and navigation

- **Top-level sections:** Generators, Formatters, Converters, Utilities, API. The utilities section sits in the navigation alongside the others.
- **Navigation bar:** sticky white bar with the logo at left, section links in the centre, a tool search box at right, and a theme toggle. On the home page and most tool pages the Generators, Formatters and Converters links open dropdown menus grouped by subcategory (for example "Personal", "Financial", "Device & Network" under Generators).
- **Search:** the search box filters a fixed list of tools defined in `scripts/main.js` (the `TOOLS` array). The list is hand-maintained, so new pages must be added there to appear in search.
- **Recently used:** the last three visited tools are listed on tool pages (see section 10).
- **Footer:** a brand block plus link columns (Generators, Tools, Info). The Info column links API docs, About, Contact and Privacy. Every page that has a Privacy link in its footer also has About and Contact links.
- **Breadcrumbs:** tool pages show `Home › Section › Tool name` above the H1.
- **Related tools:** each tool page ends with a "Related tools" grid of 3–6 cards linking to adjacent tools.

**Review point:** the navigation has two different dropdown patterns in use. The home and generator pages use hover dropdowns, and some utility and information pages use a plain text bar with no dropdowns. See R9.

## 4. Page template anatomy

A tool page follows this order from top to bottom. Pages that use the template are consistent in order, though the exact markup varies between pages.

1. `<head>`: charset, viewport, `<title>`, meta description, optional keywords, canonical URL, optional Open Graph and Twitter tags, JSON-LD `WebApplication` block, font link, stylesheet, and optionally the AdSense script.
2. Header: navbar (section 3).
3. Leaderboard ad slot (`.ad-slot.ad-leaderboard`), directly under the navbar.
4. `.tool-page` container:
   - `.tool-page-header`: breadcrumb, H1 (the tool name), one-paragraph description (`.tool-desc`).
   - Tool controls: selects, buttons and inputs, usually in a flex row with 8px gaps.
   - Output area: a table in a `.workspace-panel`, or a card grid.
   - In-content ad slot (90px high, dashed border).
   - `.seo-content`: H2 "About this tool" section, then H3 subsections (how it works, use cases, API access), then FAQ items.
   - `.related-tools`: H3 "Related tools" and a `.related-grid`.
5. Footer.
6. Inline scripts: tool logic, FAQ toggle, theme toggle.
7. Shared `scripts/main.js` (search, recent tools, nav dropdowns, theme logic on some pages).

**Design intent:** the tool comes first, so the visitor can use it without scrolling. The SEO copy sits below the tool, which keeps the search-facing text on the page while keeping the interface uncluttered.

## 5. Visual system

### 5.1 Colour tokens

Defined on `:root` in `apps/web/src/styles/main.css`. Dark mode overrides the same tokens under `[data-theme="dark"]`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--orange` | `#F97316` | same | Brand accent, primary buttons, active states, hero border |
| `--orange-l` | `#FED7AA` | same | Tags, active nav background |
| `--orange-d` | `#C2410C` | same | Text on orange-light backgrounds |
| `--purple` | `#7C3AED` | same | Defined in the token set |
| `--slate` | `#1E293B` | `#F1F5F9` | Primary text |
| `--slate-m` | `#475569` | `#CBD5E1` | Secondary text |
| `--slate-l` | `#94A3B8` | `#64748B` | Tertiary text, labels |
| `--bg` | `#F8FAFC` | `#0F172A` | Page background |
| `--white` | `#ffffff` | `#1E293B` | Cards, panels, navbar |
| `--border` | `#E2E8F0` | `#1E293B` | Hairlines |
| `--border-2` | `#CBD5E1` | `#334155` | Inputs, buttons |
| `--green` | `#10B981` | same | Defined; success states use inline colours |

Success and error states on the IMEI validator use inline colours (`#D1FAE5`/`#065F46` and `#FEE2E2`/`#991B1B`), not tokens. Returns in the SIP calculator use `#22C55E`. These are not in the token set.

**Concept:** orange is the single accent. Everything else is a neutral slate scale on a near-white or near-black background. The orange reads as "action" throughout.

### 5.2 Typography

- **Display and body:** the intended family is Plus Jakarta Sans (`--font-display` and `--font-body`).
- **Actual use:** pages load three font families. Plus Jakarta Sans is on 15 pages, Syne on 15, and Inter (with IBM Plex Mono) on 11. The About, Privacy and Contact pages use Syne and DM Sans. Monospace output uses `font-family: monospace` or IBM Plex Mono.
- **Scale:** H1 on tool pages is roughly 26–36px at weight 800. The hero title uses `clamp(22px, 5vw, 48px)`. Body text is 14–15px. Labels are 11–12px, uppercase, with letter-spacing.

**Review point:** the three font families are a clear inconsistency (R3). Decide on one.

### 5.3 Shape, elevation and spacing

- **Radii:** 8px for controls (`--radius-sm`), 12px for cards and panels (`--radius`), 18px for large panels (`--radius-lg`), 999px for pills and badges.
- **Elevation:** two shadows, `--shadow` (small) and `--shadow-md` (cards on hover or emphasis). Dark mode uses stronger shadows.
- **Spacing:** multiples of 4 and 8px, mostly 8, 12, 16, 20, 24, 32, 40 and 56px. Page gutter is 24px on the navbar and main content.
- **Max width:** 1200px for the navbar and main content; 780px for prose pages (About, Privacy, Contact); 960px for the SIP calculator.

### 5.4 Iconography

No icon library. Icons are emoji in the logo (🔧), nav dropdowns and related-tool cards. This keeps the page weight low and avoids icon-font dependencies, but emoji render differently on each platform (see R8).

## 6. Components

| Component | Where | Notes |
|---|---|---|
| `.btn`, `.btn-primary`, `.btn-sm` | All tools | Primary is orange fill, default is outlined. Used for Generate, Copy, Download. |
| `.workspace-panel` and `.panel-header` | Output areas | White card with a header row and a body. Holds output tables. |
| `.ctrl-group` | Calculators | Label, number input and range slider stacked. |
| `.faq-item`, `.faq-q`, `.faq-a` | Bottom of tool pages | Accordion. Answers start hidden and toggle the `+`/`−` marker. Behaviour is in inline script on each page. |
| `.related-grid`, `.related-card` | Bottom of tool pages | Card grid linking to related tools. |
| `.ad-slot` variants | Between sections | See section 9. |
| Tab switcher | IMEI page | Two-button segmented control (Generate / Validate). Inline styles, not a shared component. |
| Hero | Home and generator index | Large white block with an orange bottom border, badge, title and subtitle. |
| Theme toggle | Navbar | Sun/moon emoji button. Persists the choice. |
| Search dropdown | Navbar | Filters the tool list from `main.js`. |

**Review point:** most components are reimplemented per page with inline styles (for example the tab switcher, the calculator inputs, and the table headers). Only the buttons, cards, FAQ and navbar come from `main.css`. This makes global changes harder and creates visual drift (R4).

## 7. Layout and responsiveness

- **Grid:** tool pages use inline CSS grid (for example, two columns for the SIP calculator inputs and results, and `repeat(auto-fill, minmax(280px, 1fr))` for address cards). Flex rows wrap with `flex-wrap: wrap`.
- **Media queries:** `main.css` contains **no `@media` rules**. The site has no defined breakpoints.
- **Result:** flex rows that wrap are fine on phones. Fixed two-column grids (such as the SIP calculator at `grid-template-columns: 1fr 1fr`) do not collapse, so content is cramped on narrow screens. Tables are not wrapped in a horizontal-scroll container on every page.

**Review point:** the original brief required phone-width layouts with a 16px side gutter and no horizontal scroll. Responsive behaviour has not been implemented in the stylesheet (R2). Test every tool at 375px width before signing off.

## 8. Content and SEO conventions

These are the rules the copy follows. They come from the code and from the SEO work done so far.

- **Title pattern:** `Tool name – benefit or scope | Toolpad`. Target 60 characters or fewer. The main search phrase comes first.
- **Meta description:** 140–155 characters, one clear benefit, and a closing note that the tool is free and needs no sign-up where true.
- **Test-data wording:** every generator says it creates test or sample data. Copy must not claim that output is real or registered. The IMEI page explicitly says generated IMEIs are not registered to any device.
- **Canonical URL:** every page has a `<link rel="canonical">`. The current convention is `https://toolpad.in/<path>` with no trailing slash.
- **Structured data:** each tool page includes a `WebApplication` JSON-LD block. The IMEI page also includes `HowTo` steps.
- **Open Graph:** the IMEI and contact pages include `og:title`, `og:description` and `og:type`. Most other pages do not, which is a gap for social sharing (R6).
- **Copy structure:** H2 "About this tool", then H3 subsections, then 3–6 FAQ items. FAQ answers are plain and short.
- **URL naming:** generator URLs use the `test-` prefix (for example `test-address`, `test-name`). Earlier URLs used `fake-` and are redirected with permanent 301 rules in `vercel.json`.
- **Sitemap:** `sitemap.xml` lists every indexable page with `priority` and `changefreq`. New pages must be added manually.
- **Robots:** `robots.txt` allows all pages and disallows `/api/`.

**Review point:** several pages still carry generic or repetitive copy, and some FAQ answers were written as placeholders. The content outlines in `docs/content-outlines.md` plan the next round for the five highest-traffic tools.

## 9. Advertising

- **Provider:** Google AdSense, publisher `pub-6178110448665517`. The matching entry in `ads.txt` is `google.com, pub-6178110448665517, DIRECT, f08c47fec0942fa0`.
- **Ad slots:** three styles, all dashed-border placeholders in the layout:
  - `.ad-leaderboard`: full-width (max 1200px), 90px minimum height, directly under the navbar.
  - Inline: 90px high, between the tool and the SEO copy.
  - `.ad-infeed`: defined in the CSS; usage across pages was not counted.
- **Coverage:** 38 pages contain ad slot markup. Only 22 load the AdSense script, so the other pages show empty dashed boxes with no ads. This should be resolved one way or the other (R7).
- **Policy constraints:** the ad slots must not sit in the tool's input or output area in a way that could be mistaken for part of the tool. Current placement is between sections.
- **Status:** AdSense reported the site as "Needs attention" for "Low value content". The content work in this repository targets that issue. Ads.txt is served at the site root and returns 200.

## 10. Interaction and client-side behaviour

- **Processing:** data generators, formatters and calculators run in the browser with plain JavaScript. The DOCX to PDF converter is the one tool that sends a file to the server (see R1).
- **API:** the REST API (`apps/api`, Express) exposes the same generators and converters under `/api/v1`. It returns JSON. Section 11 summarises the routes; the API documentation page lists them for users.
- **Local storage keys:** `toolpad-theme` (light or dark choice) and `toolpad-recent` (the last three visited tool URLs). Tool pages read these inside `try/catch` blocks only in some scripts; the shared `main.js` tracks recent tools without a fallback beyond its own `try/catch`. The theme script runs at the end of each page's body, so a page can briefly render in the default theme before the saved one is applied. Moving that script into `<head>` would avoid the flash (see R13).
- **Theme logic:** dark mode is applied automatically between 8pm and 6am when no choice has been saved. A manual toggle overrides the automatic setting and is saved.
- **Copy and download:** most tools provide "Copy all" (writes to the clipboard, then briefly shows "Copied!") and "Download CSV" (creates a Blob and triggers a download named after the tool).
- **Errors:** validation messages appear inline in the output area. There is no global error toast.
- **Empty states:** tools that generate on load (most generators) show results immediately. Calculators compute on load with default values.

## 11. API (summary)

Base path `/api/v1`. CORS is enabled for all origins. JSON bodies are limited to 2 MB.

- **Personal:** `/personal/profile`, `/personal/name`, `/personal/email`, `/personal/phone`, `/personal/username`, `/personal/dob`
- **Financial:** `/financial/credit-card`, `/financial/iban`, `/financial/bank-account`, `/financial/transaction-id`
- **Network:** `/network/uuid`, `/network/mac`, `/network/ip`, `/network/imei`, `/network/imsi`, `/network/iccid`, `/network/user-agent`
- **Location:** `/location/address`, `/location/coordinates`, `/location/timezone`
- **Data tools (POST):** format, minify and validate JSON and XML; convert JSON↔XML, JSON↔CSV, text→JSON and text→XML; encode and decode Base64 and hex
- **Combined:** `/record` returns a full profile with address, coordinates and other fields

No authentication or rate limiting was found in the API code reviewed. There is no route for DOCX conversion (R1).

## 12. Review points

These are the design and content issues found while writing this spec. Each needs a decision. Items are ordered by how much they affect users.

| ID | Area | Issue | Suggested decision |
|---|---|---|---|
| R1 | Converters | The DOCX to PDF page uploads to `/api/v1/doc/docx-to-pdf`, which does not exist. Conversions fail, and the page says files are "deleted immediately", which the code does not show. | Build the endpoint with a stated retention policy, or remove the page and its nav link. |
| R2 | Layout | `main.css` has no media queries. Fixed two-column grids do not collapse on phones. | Add breakpoints (for example at 768px and 480px), collapse grids to one column, and test at 375px. |
| R3 | Typography | Three font families across 40 pages (Plus Jakarta Sans, Syne, Inter). The token set names only Plus Jakarta Sans. | Pick one family for headings and one for body, and set them only through tokens. |
| R4 | Components | Components are rebuilt inline on many pages, so global style changes do not reach them. | Move repeated patterns (tabs, inputs, tables, calculator controls) into `main.css`. |
| R5 | Formatters | `formatters/xml.html` contains the Base64 tool. The XML formatter page is missing its own content. | Replace the page content with the XML formatter, or redirect the route. |
| R6 | SEO / sharing | Most pages lack Open Graph and Twitter tags, so shared links show no preview. | Add the OG and Twitter tags to every tool page using the title and description. |
| R7 | Ads | 38 pages show empty ad placeholders; 22 load the AdSense script. | Load the script on every page that shows a slot, or remove the slots from pages that have no ads. |
| R8 | Icons | Emoji are used as icons in navigation and cards. Their appearance varies by platform. | Keep if acceptable; otherwise adopt a small SVG icon set. |
| R9 | Navigation | Two dropdown patterns exist (hover menus and plain text links), depending on the page. | Use one navigation component on every page. |
| R10 | Footer claims | Footers say "No tracking", but AdSense sets cookies on the site. | Change the wording to match the privacy policy. |
| R11 | Accessibility | Theme toggle labels differ between pages, and some pages have no skip link or visible focus style beyond the browser default. Ad placeholders have `aria-label` text only. | Add consistent `aria-label` text, a skip link, and a visible focus style to every page. |
| R12 | Content | Several FAQ answers and "compliance" statements need checking (for example the test-name page's PDPB section). | Follow the checklist in `docs/content-outlines.md` before publishing changes. |
| R13 | Theme | The saved theme is applied from a script at the end of each page's body, so pages can flash the default theme on load. | Move the theme script into `<head>` on every page. |

## 13. Design decisions with rationale

- **Browser-first processing.** Most tools run in JavaScript on the client. This keeps the site fast to use, cheap to host, and avoids storing what visitors type.
- **Tool first, copy second.** The interface is above the fold; search copy and FAQs sit below it.
- **One accent colour.** Orange is used for actions and emphasis only, so the visitor always knows where to click.
- **Neutral slate scale for everything else.** Keeps the palette calm and makes dark mode a simple token swap.
- **Plain HTML with no build step.** Easy to deploy, easy to edit, and no framework to upgrade. The trade-off is that shared components have to be copied between pages (see R4).
- **Clean URLs and permanent redirects.** Vercel's `cleanUrls` gives short paths. Renamed pages keep their ranking through 301 redirects.
- **Labelled test data.** Every generator says its output is for testing. This is both an accuracy rule and a guard against misuse.

## 14. Maintenance

- **Adding a tool:** create the HTML page, add it to the category index, the navigation dropdown, the footer, `sitemap.xml`, and the `TOOLS` array in `scripts/main.js`.
- **Changing a tool name:** update the title, H1, breadcrumb, canonical URL, JSON-LD, sitemap, navigation, footer and `TOOLS` entry, and add a 301 redirect in `vercel.json` from the old URL.
- **Checks before deploy:** run `node scripts/test.js` (currently 31 tests) and load the changed pages locally. The repo has no lint configuration.
- **Deploy:** the site appears to deploy from the `main` branch on GitHub, since pushes have gone live without a manual step. The Vercel project settings were not checked from this repository.
