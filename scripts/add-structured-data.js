// Adds JSON-LD structured data to every page under apps/web/src/pages.
// Usage: node scripts/add-structured-data.js
//
// For each page it writes (idempotently, replacing its own earlier output):
//   - BreadcrumbList, built from the URL path and the page's <h1>
//   - FAQPage, only when the page shows FAQ questions and answers
// It also sets applicationCategory to UtilitiesApplication on existing
// WebApplication blocks. It never adds ratings, reviews or offers beyond
// the price 0 already present.

const fs = require('fs');
const path = require('path');

const PAGES = path.join(__dirname, '..', 'apps', 'web', 'src', 'pages');
const SITE = 'https://toolpad.in';
const MARK = 'data-generated="seo"';

const SECTION_NAMES = {
  generators: 'Generators',
  formatters: 'Formatters',
  converters: 'Converters',
  utilities: 'Utilities',
};

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

function decode(s) {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function pageParts(file, html) {
  const rel = path.relative(PAGES, file).split(path.sep).join('/').replace(/\.html$/, '');
  const url = rel === 'index' ? SITE + '/' : SITE + '/' + rel.replace(/\/index$/, '');
  const segments = rel === 'index' ? [] : rel.replace(/\/index$/, '').split('/');
  const h1 = decode((/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(html) || [])[1] || '');
  return { rel, url, segments, h1 };
}

function breadcrumbs(parts) {
  const items = [{ name: 'Home', url: SITE + '/' }];
  if (parts.segments.length === 2) {
    const section = parts.segments[0];
    if (SECTION_NAMES[section]) {
      items.push({ name: SECTION_NAMES[section], url: SITE + '/' + section });
    }
  }
  if (parts.segments.length > 0 && parts.rel !== 'index') {
    const isIndex = parts.segments.length === 1 && SECTION_NAMES[parts.segments[0]];
    if (!isIndex && parts.h1) items.push({ name: parts.h1, url: parts.url });
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function faqs(html) {
  const out = [];
  const re = /<(?:div|button) class="faq-q"[^>]*>([\s\S]*?)<\/(?:div|button)>\s*<div class="faq-a">([\s\S]*?)<\/div>/g;
  let m;
  while ((m = re.exec(html))) {
    const question = decode(m[1].replace(/<span class="faq-toggle">[\s\S]*?<\/span>/, ''));
    const answer = decode(m[2]);
    if (question && answer) out.push({ question, answer });
  }
  return out;
}

function faqPage(list) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

function scriptTag(obj) {
  return '<script type="application/ld+json" ' + MARK + '>' + JSON.stringify(obj) + '</script>';
}

let touched = 0;
for (const file of walk(PAGES, []).sort()) {
  let html = fs.readFileSync(file, 'utf8');
  const parts = pageParts(file, html);

  // Remove earlier output from this script, so re-running is safe.
  html = html.replace(new RegExp('<script type="application/ld\\+json" ' + MARK + '>[\\s\\S]*?</script>\\n?', 'g'), '');

  // Keep the WebApplication category consistent with the rest of the schema.
  html = html.replace(/"applicationCategory":"[^"]*"/g, '"applicationCategory":"UtilitiesApplication"');

  const blocks = [scriptTag(breadcrumbs(parts))];
  const list = faqs(html);
  if (list.length) blocks.push(scriptTag(faqPage(list)));

  html = html.replace(/<\/head>/i, blocks.join('\n') + '\n</head>');
  fs.writeFileSync(file, html);
  touched++;
}
console.log('updated structured data on ' + touched + ' pages');
