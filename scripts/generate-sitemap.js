// Writes apps/web/src/pages/sitemap.xml from the pages themselves.
// Usage: node scripts/generate-sitemap.js
//
// A page is listed when it has a canonical link pointing at its own URL and it
// is not marked noindex. lastmod is the date of the last git commit that
// touched the page's file (today's date if git history is not available).

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = path.join(__dirname, '..');
const PAGES = path.join(REPO, 'apps', 'web', 'src', 'pages');
const OUT = path.join(PAGES, 'sitemap.xml');
const SITE = 'https://toolpad.in';

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

function urlFor(file) {
  const rel = path.relative(PAGES, file).split(path.sep).join('/').replace(/\.html$/, '');
  if (rel === 'index') return SITE + '/';
  if (rel.endsWith('/index')) return SITE + '/' + rel.slice(0, -'/index'.length);
  return SITE + '/' + rel;
}

function lastmod(file) {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      cwd: REPO,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out || today;
  } catch (e) {
    return today;
  }
}

function priorityFor(url) {
  if (url === SITE + '/') return '1.0';
  if (/\/(about|contact|privacy|api-docs)$/.test(url)) return '0.3';
  if (/\/(generators|formatters|converters|utilities)$/.test(url)) return '0.8';
  return '0.9';
}

const entries = [];
for (const file of walk(PAGES, []).sort()) {
  const html = fs.readFileSync(file, 'utf8');
  if (/<meta name="robots" content="[^"]*noindex/i.test(html)) continue;
  const canonical = (/<link rel="canonical" href="([^"]+)"/i.exec(html) || [])[1];
  const url = urlFor(file);
  if (canonical !== url) continue;
  entries.push({ url, lastmod: lastmod(file), priority: priorityFor(url) });
}

entries.sort((a, b) => (a.url < b.url ? -1 : a.url > b.url ? 1 : 0));

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map((e) =>
    '  <url>\n' +
    '    <loc>' + e.url + '</loc>\n' +
    '    <lastmod>' + e.lastmod + '</lastmod>\n' +
    '    <priority>' + e.priority + '</priority>\n' +
    '  </url>'
  ),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(OUT, xml);
console.log('wrote ' + entries.length + ' URLs to ' + path.relative(REPO, OUT));
