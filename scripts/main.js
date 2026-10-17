'use strict';

// ── Tool index: one source for search, the home grid and recent tools ───────
const TOOLS = [
  { name: 'Test name generator',        url: '/generators/test-name',        tag: 'NAME', cat: 'Generators', group: 'Personal',         desc: 'Realistic test names, with Indian regional pools.' },
  { name: 'Test email generator',       url: '/generators/test-email',       tag: 'MAIL', cat: 'Generators', group: 'Personal',         desc: 'Test email addresses for signup and form testing.' },
  { name: 'Phone number generator',     url: '/generators/test-phone',       tag: 'TEL',  cat: 'Generators', group: 'Personal',         desc: 'Formatted test phone numbers for several countries.' },
  { name: 'Full profile generator',     url: '/generators/test-profile',     tag: 'USER', cat: 'Generators', group: 'Personal',         desc: 'A complete test person with name, contact and address.' },
  { name: 'Test address generator',     url: '/generators/test-address',     tag: 'ADDR', cat: 'Generators', group: 'Personal',         desc: 'Test postal addresses for the US, India and the UK.' },
  { name: 'Test address for India',     url: '/generators/test-address-india', tag: 'PIN', cat: 'Generators', group: 'Personal',        desc: 'Indian test addresses with PIN codes by state.' },
  { name: 'Credit card generator',      url: '/generators/credit-card',      tag: 'CARD', cat: 'Generators', group: 'Financial',        desc: 'Luhn-valid test card numbers for payment flows.' },
  { name: 'IBAN generator',             url: '/generators/iban',             tag: 'IBAN', cat: 'Generators', group: 'Financial',        desc: 'MOD-97-valid test IBANs for GB, DE and FR.' },
  { name: 'IMEI generator',             url: '/generators/imei',             tag: 'IMEI', cat: 'Generators', group: 'Device & network', desc: 'Luhn-valid test IMEI numbers, and a validator.' },
  { name: 'IMSI generator',             url: '/generators/imsi',             tag: 'IMSI', cat: 'Generators', group: 'Device & network', desc: 'Test IMSI numbers with operator MCC-MNC codes.' },
  { name: 'MAC address generator',      url: '/generators/mac-address',      tag: 'MAC',  cat: 'Generators', group: 'Device & network', desc: 'MAC addresses with real vendor prefixes.' },
  { name: 'IP address generator',       url: '/generators/ip-address',       tag: 'IP',   cat: 'Generators', group: 'Device & network', desc: 'IPv4 and IPv6 addresses for network testing.' },
  { name: 'UUID generator',             url: '/generators/uuid',             tag: 'UUID', cat: 'Generators', group: 'Device & network', desc: 'RFC 4122 UUIDs, v4 and v1, up to 1000 at once.' },
  { name: 'Password generator',         url: '/generators/password',         tag: 'PASS', cat: 'Generators', group: 'Other',            desc: 'Strong random passwords, generated in your browser.' },
  { name: 'Lorem ipsum generator',      url: '/generators/lorem-ipsum',      tag: 'TEXT', cat: 'Generators', group: 'Other',            desc: 'Placeholder paragraphs, sentences, words or lists.' },
  { name: 'Color converter',            url: '/generators/color-converter',  tag: 'HEX',  cat: 'Generators', group: 'Other',            desc: 'Convert colours between HEX, RGB and HSL.' },
  { name: 'Unix timestamp converter',   url: '/generators/unix-timestamp',   tag: 'TIME', cat: 'Generators', group: 'Other',            desc: 'Convert Unix timestamps to dates and back.' },
  { name: 'JSON formatter',             url: '/formatters/json',             tag: '{ }',  cat: 'Formatters', group: 'Formatters',       desc: 'Prettify, minify and validate JSON with line numbers.' },
  { name: 'XML formatter',              url: '/formatters/xml',              tag: '</>',  cat: 'Formatters', group: 'Formatters',       desc: 'Format and validate XML documents.' },
  { name: 'JSON to XML',                url: '/converters/json-to-xml',      tag: 'J→X',  cat: 'Converters', group: 'Structured data',  desc: 'Convert JSON into well-formed XML.' },
  { name: 'XML to JSON',                url: '/converters/xml-to-json',      tag: 'X→J',  cat: 'Converters', group: 'Structured data',  desc: 'Convert XML into JSON.' },
  { name: 'JSON to CSV',                url: '/converters/json-to-csv',      tag: 'J→C',  cat: 'Converters', group: 'Structured data',  desc: 'Export a JSON array as a CSV spreadsheet.' },
  { name: 'CSV to JSON',                url: '/converters/csv-to-json',      tag: 'C→J',  cat: 'Converters', group: 'Structured data',  desc: 'Convert CSV rows into a JSON array.' },
  { name: 'Text to JSON',               url: '/converters/text-to-json',     tag: 'T→J',  cat: 'Converters', group: 'Structured data',  desc: 'Turn key: value lines into JSON.' },
  { name: 'Text to XML',                url: '/converters/text-to-xml',      tag: 'T→X',  cat: 'Converters', group: 'Structured data',  desc: 'Turn key: value lines into XML.' },
  { name: 'Base64 encoder and decoder', url: '/converters/base64',           tag: 'B64',  cat: 'Converters', group: 'Encoding',         desc: 'Encode and decode Base64 text.' },
  { name: 'Hex encoder and decoder',    url: '/converters/hex',              tag: '0x',   cat: 'Converters', group: 'Encoding',         desc: 'Convert text to hexadecimal and back.' },
  { name: 'URL encoder and decoder',    url: '/converters/url-encoder',      tag: '%20',  cat: 'Converters', group: 'Encoding',         desc: 'Percent-encode and decode URLs and query strings.' },
  { name: 'EMI calculator',             url: '/utilities/emi-calculator',    tag: 'EMI',  cat: 'Utilities',  group: 'Finance',          desc: 'Monthly loan instalments and total interest.' },
  { name: 'GST calculator',             url: '/utilities/gst-calculator',    tag: 'GST',  cat: 'Utilities',  group: 'Finance',          desc: 'Add or remove GST at 5, 12, 18 and 28 percent.' },
  { name: 'SIP calculator',             url: '/utilities/sip-calculator',    tag: 'SIP',  cat: 'Utilities',  group: 'Finance',          desc: 'Projected value of a monthly investment plan.' },
];

// Small helper for building HTML from trusted, static strings and tool data.
function esc(s) {
  return String(s).replace(/[&<>"']/g, function(c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// ── Theme: the initial value is applied in <head>; this only handles the toggle
(function() {
  var KEY = 'toolpad-theme';
  var btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', function() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    btn.setAttribute('aria-pressed', String(next === 'dark'));
    try { localStorage.setItem(KEY, next); } catch (e) {}
  });
  btn.setAttribute('aria-pressed', String(document.documentElement.getAttribute('data-theme') === 'dark'));
})();

// ── Header menus (hover and focus via CSS; touch and keyboard via .open) ───
(function() {
  var items = document.querySelectorAll('.nav-item');
  items.forEach(function(item) {
    var btn = item.querySelector('.nav-btn');
    if (!btn) return;
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var open = !item.classList.contains('open');
      items.forEach(function(i) { i.classList.remove('open'); });
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function() {
    items.forEach(function(i) { i.classList.remove('open'); });
    document.querySelectorAll('.nav-btn').forEach(function(b) { b.setAttribute('aria-expanded', 'false'); });
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      items.forEach(function(i) { i.classList.remove('open'); });
    }
  });
})();

// ── Mobile navigation ──────────────────────────────────────────────────────
(function() {
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('mobileNav');
  if (!toggle || !panel) return;
  toggle.addEventListener('click', function() {
    var open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
})();

// ── FAQ accordions ─────────────────────────────────────────────────────────
(function() {
  document.querySelectorAll('.faq-q').forEach(function(q) {
    var answer = q.nextElementSibling;
    if (!answer || !answer.classList.contains('faq-a')) return;
    var open = q.getAttribute('aria-expanded') === 'true';
    answer.hidden = !open;
    q.addEventListener('click', function() {
      var nowOpen = q.getAttribute('aria-expanded') !== 'true';
      q.setAttribute('aria-expanded', String(nowOpen));
      answer.hidden = !nowOpen;
      var mark = q.querySelector('.faq-toggle');
      if (mark) mark.textContent = nowOpen ? '−' : '+';
    });
  });
})();

// ── Search: used by the home hero search ───────────────────────────────────
function matchTools(q) {
  var needle = q.trim().toLowerCase();
  if (!needle) return [];
  return TOOLS.filter(function(t) {
    return [t.name, t.tag, t.desc, t.cat, t.group].join(' ').toLowerCase().indexOf(needle) !== -1;
  }).slice(0, 6);
}

(function() {
  var input = document.getElementById('toolSearch');
  var box = document.getElementById('searchResults');
  if (!input || !box) return;

  function render() {
    var q = input.value;
    if (!q.trim()) { box.classList.remove('open'); box.innerHTML = ''; return; }
    var hits = matchTools(q);
    if (!hits.length) {
      box.innerHTML = '<p class="search-empty">No tool matches that search yet.</p>';
    } else {
      box.innerHTML = hits.map(function(t) {
        return '<a class="search-result" href="' + esc(t.url) + '">' +
          '<span class="tool-tag">' + esc(t.tag) + '</span>' +
          '<span><span class="sr-name">' + esc(t.name) + '</span><br><span class="sr-cat">' + esc(t.cat) + '</span></span></a>';
      }).join('');
    }
    box.classList.add('open');
  }

  input.addEventListener('input', render);
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { box.classList.remove('open'); input.blur(); }
  });
  document.addEventListener('click', function(e) {
    if (!box.contains(e.target) && e.target !== input) box.classList.remove('open');
  });
  document.querySelectorAll('[data-q]').forEach(function(b) {
    b.addEventListener('click', function() {
      input.value = b.getAttribute('data-q');
      render();
      input.focus();
    });
  });
  if (window.location.hash === '#search') input.focus();
})();

// ── Home grid with category filter ─────────────────────────────────────────
(function() {
  var grid = document.getElementById('toolGrid');
  if (!grid) return;
  var filterRow = document.getElementById('toolFilters');
  var current = 'All';

  var cats = ['All', 'Generators', 'Formatters', 'Converters', 'Utilities'];
  if (filterRow) {
    filterRow.innerHTML = cats.map(function(c) {
      var count = c === 'All' ? TOOLS.length : TOOLS.filter(function(t) { return t.cat === c; }).length;
      return '<button type="button" class="chip" data-cat="' + c + '" aria-pressed="' + (c === current) + '">' +
        esc(c) + '<span class="chip-count">' + count + '</span></button>';
    }).join('');
  }

  function draw() {
    var list = current === 'All' ? TOOLS : TOOLS.filter(function(t) { return t.cat === current; });
    grid.innerHTML = list.map(function(t) {
      return '<a class="card" href="' + esc(t.url) + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px">' +
        '<span class="tool-tag">' + esc(t.tag) + '</span><span class="card-cat">' + esc(t.cat) + '</span></div>' +
        '<h3>' + esc(t.name) + '</h3><p>' + esc(t.desc) + '</p></a>';
    }).join('');
    if (filterRow) {
      filterRow.querySelectorAll('[data-cat]').forEach(function(b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-cat') === current));
      });
    }
  }

  if (filterRow) {
    filterRow.addEventListener('click', function(e) {
      var b = e.target.closest('[data-cat]');
      if (!b) return;
      current = b.getAttribute('data-cat');
      draw();
    });
  }
  draw();
})();

// ── Recently used tools (last three visited) ───────────────────────────────
function trackToolVisit(url) {
  try {
    var recent = JSON.parse(localStorage.getItem('toolpad-recent') || '[]');
    var updated = [url].concat(recent.filter(function(u) { return u !== url; })).slice(0, 3);
    localStorage.setItem('toolpad-recent', JSON.stringify(updated));
  } catch (e) {}
}

function renderRecentTools() {
  var container = document.getElementById('recentTools');
  if (!container) return;
  try {
    var recent = JSON.parse(localStorage.getItem('toolpad-recent') || '[]');
    var tools = recent.map(function(url) {
      return TOOLS.find(function(t) { return t.url === url; });
    }).filter(Boolean);
    if (!tools.length) { container.hidden = true; return; }
    container.innerHTML = '<div class="workspace-head" style="border:0;padding:0 0 12px"><span class="card-cat">Recently used</span></div>' +
      '<div class="popular">' + tools.map(function(t) {
        return '<a class="chip" href="' + esc(t.url) + '">' + esc(t.name) + '</a>';
      }).join('') + '</div>';
    container.hidden = false;
  } catch (e) { container.hidden = true; }
}

if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
  trackToolVisit(window.location.pathname);
}
document.addEventListener('DOMContentLoaded', renderRecentTools);
