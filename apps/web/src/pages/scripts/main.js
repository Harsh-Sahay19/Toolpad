'use strict';

// ── Tool index for search ──────────────────────────────────────────────────
const TOOLS = [
  { name: 'IMEI generator',        url: '/generators/imei',          icon: '📡', cat: 'Device & Network' },
  { name: 'UUID generator',        url: '/generators/uuid',          icon: '🔑', cat: 'Device & Network' },
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

// ── Global Click Manager (The Fix) ──────────────────────────────────────────
// This catches clicks before they "clog" and forces navigation for cards.
document.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (!link) return;

  // If it's a tool card or search result, track it and ensure navigation
  if (link.classList.contains('tool-card') || link.classList.contains('search-result')) {
    const url = link.getAttribute('href');
    if (url && url !== '#') {
      trackToolVisit(url);
      // We let the default behavior happen unless you're seeing weird bugs, 
      // in which case window.location.href = url; would go here.
    }
  }
});

// ── Search Logic ───────────────────────────────────────────────────────────
const searchInput    = document.getElementById('toolSearch');
const searchDropdown = document.getElementById('searchDropdown');

if (searchInput && searchDropdown) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) { searchDropdown.classList.remove('open'); return; }
    
    const hits = TOOLS.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.cat.toLowerCase().includes(q)
    ).slice(0, 8);

    if (!hits.length) { 
      searchDropdown.classList.remove('open'); 
      return; 
    }

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

  // Close search when clicking outside
  document.addEventListener('mousedown', e => {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      searchDropdown.classList.remove('open');
    }
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') { 
      searchDropdown.classList.remove('open'); 
      searchInput.blur(); 
    }
  });
}

// ── Theme Management ───────────────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const updateThemeUI = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeToggle) themeToggle.textContent = theme === 'dark' ? '🌙' : '☀';
};

// Initial Load
const savedTheme = localStorage.getItem('toolpad-theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : '');
updateThemeUI(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? '' : 'dark';
    updateThemeUI(nextTheme);
    localStorage.setItem('toolpad-theme', nextTheme);
  });
}

// ── Recently Used Tools ────────────────────────────────────────────────────
function trackToolVisit(url) {
  try {
    const recent = JSON.parse(localStorage.getItem('toolpad-recent') || '[]');
    const updated = [url, ...recent.filter(u => u !== url)].slice(0, 3);
    localStorage.setItem('toolpad-recent', JSON.stringify(updated));
  } catch (e) { console.error("Recent tools error", e); }
}

function renderRecentTools() {
  const container = document.getElementById('recentTools');
  if (!container) return;

  try {
    const recent = JSON.parse(localStorage.getItem('toolpad-recent') || '[]');
    if (!recent.length) {
      container.style.display = 'none';
      return;
    }

    const tools = recent.map(url => TOOLS.find(t => t.url === url)).filter(Boolean);
    if (!tools.length) return;

    container.innerHTML = `
      <div class="subsection">
        <h3 class="subsection-title">Recently used</h3>
        <div class="tool-grid">
          ${tools.map(t => `
            <a href="${t.url}" class="tool-card">
              <div class="tool-icon">${t.icon}</div>
              <div class="tool-info">
                <h4>${t.name}</h4>
                <p>${t.cat}</p>
              </div>
            </a>`).join('')}
        </div>
      </div>`;
    container.style.display = 'block';
  } catch (e) { container.style.display = 'none'; }
}

// Track page visit if we are on a tool page
if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
  trackToolVisit(window.location.pathname);
}

// Run on load
document.addEventListener('DOMContentLoaded', renderRecentTools);
