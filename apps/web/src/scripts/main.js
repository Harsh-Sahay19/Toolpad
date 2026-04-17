'use strict';

// ── Tool index for search ──────────────────────────────────────────────────
const TOOLS = [
  { name: 'IMEI generator',           url: '/generators/imei',          icon: '📡', cat: 'Device & Network' },
  { name: 'UUID generator',           url: '/generators/uuid',          icon: '🔑', cat: 'Device & Network' },
  { name: 'MAC address generator',    url: '/generators/mac-address',   icon: '🖧',  cat: 'Device & Network' },
  { name: 'IP address generator',     url: '/generators/ip-address',    icon: '🌐', cat: 'Device & Network' },
  { name: 'IMSI generator',          url: '/generators/imsi',           icon: '📶', cat: 'Device & Network' },
  { name: 'Fake name generator',      url: '/generators/fake-name',     icon: '👤', cat: 'Personal' },
  { name: 'Fake email generator',     url: '/generators/fake-email',    icon: '✉',  cat: 'Personal' },
  { name: 'Phone number generator',   url: '/generators/fake-phone',    icon: '📱', cat: 'Personal' },
  { name: 'Full profile generator',   url: '/generators/fake-profile',  icon: '🪪', cat: 'Personal' },
  { name: 'Credit card generator',    url: '/generators/credit-card',   icon: '💳', cat: 'Financial' },
  { name: 'IBAN generator',           url: '/generators/iban',          icon: '🏦', cat: 'Financial' },
  { name: 'Fake address generator',   url: '/generators/fake-address',  icon: '📍', cat: 'Financial' },
  { name: 'JSON formatter',           url: '/formatters/json',          icon: '{ }', cat: 'Formatter' },
  { name: 'XML formatter',            url: '/formatters/xml',           icon: '</>', cat: 'Formatter' },
  { name: 'JSON to XML converter',    url: '/converters/json-to-xml',   icon: '⇄',  cat: 'Converter' },
  { name: 'XML to JSON converter',    url: '/converters/xml-to-json',   icon: '⇄',  cat: 'Converter' },
  { name: 'JSON to CSV',             url: '/converters/json-to-csv',    icon: '📊', cat: 'Converter' },
  { name: 'CSV to JSON',             url: '/converters/csv-to-json',    icon: '📊', cat: 'Converter' },
  { name: 'Text to JSON',            url: '/converters/text-to-json',   icon: '📝', cat: 'Converter' },
  { name: 'Text to XML',             url: '/converters/text-to-xml',    icon: '📝', cat: 'Converter' },
  { name: 'Base64 encoder/decoder',  url: '/converters/base64',         icon: '🔐', cat: 'Converter' },
  { name: 'Hex encoder/decoder',     url: '/converters/hex',            icon: '🔢', cat: 'Converter' },
  { name: 'DOCX to PDF converter',   url: '/converters/docx-to-pdf',    icon: '📄', cat: 'Converter' },
];

// ── Search ────────────────────────────────────────────────────────────────
const searchInput    = document.getElementById('toolSearch');
const searchDropdown = document.getElementById('searchDropdown');

if (searchInput && searchDropdown) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { searchDropdown.classList.remove('open'); return; }
    const hits = TOOLS.filter(t => t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q)).slice(0, 8);
    if (!hits.length) { searchDropdown.classList.remove('open'); return; }
    searchDropdown.innerHTML = hits.map(t =>
      `<a class="search-result" href="${t.url}">
         <span class="search-result-icon">${t.icon}</span>
         <span>
           <strong style="font-size:13px">${t.name}</strong>
           <span style="color:var(--slate-l);font-size:11px;margin-left:6px">${t.cat}</span>
         </span>
       </a>`
    ).join('');
    searchDropdown.classList.add('open');
  });

  document.addEventListener('click', e => {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      searchDropdown.classList.remove('open');
    }
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') { searchDropdown.classList.remove('open'); searchInput.blur(); }
  });
}

// ── Dark mode ─────────────────────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme  = localStorage.getItem('toolpad-theme') || (prefersDark ? 'dark' : '');

if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
if (themeToggle) themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀';

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const d    = document.documentElement;
    const dark = d.getAttribute('data-theme') === 'dark';
    const next = dark ? '' : 'dark';
    d.setAttribute('data-theme', next);
    themeToggle.textContent = next === 'dark' ? '🌙' : '☀';
    localStorage.setItem('toolpad-theme', next);
  });
}

// ── Recently used tools ───────────────────────────────────────────────────
function trackToolVisit(url) {
  try {
    const recent = JSON.parse(localStorage.getItem('toolpad-recent') || '[]');
    const updated = [url, ...recent.filter(u => u !== url)].slice(0, 3);
    localStorage.setItem('toolpad-recent', JSON.stringify(updated));
  } catch (_) {}
}

function renderRecentTools() {
  try {
    const recent = JSON.parse(localStorage.getItem('toolpad-recent') || '[]');
    if (!recent.length) return;
    const container = document.getElementById('recentTools');
    if (!container) return;
    const tools = recent.map(url => TOOLS.find(t => t.url === url)).filter(Boolean);
    if (!tools.length) return;
    container.innerHTML = `
      <div class="subsection">
        <h3 class="subsection-title">Recently used</h3>
        <div class="tool-grid">
          ${tools.map(t => `<a href="${t.url}" class="tool-card"><div class="tool-icon">${t.icon}</div><div class="tool-info"><h4>${t.name}</h4><p>${t.cat}</p></div></a>`).join('')}
        </div>
      </div>`;
    container.style.display = 'block';
  } catch (_) {}
}

if (window.location.pathname !== '/') {
  trackToolVisit(window.location.pathname);
}
renderRecentTools();

// FORCE REDIRECT FIX
document.addEventListener('click', function(e) {
    // 1. Find the closest anchor tag (the link)
    const link = e.target.closest('a');
    
    // 2. If it's a tool card link, force the navigation
    if (link && link.classList.contains('tool-card')) {
        const url = link.getAttribute('href');
        if (url && url !== '#' && !url.startsWith('#')) {
            // Stop any other script from messing with this click
            e.stopPropagation(); 
            // Manually change the location
            window.location.href = url;
        }
    }
}, true); // The "true" here makes this run BEFORE any other script can break it.
