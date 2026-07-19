/**
 * capture-ui.js
 * Automated UI screenshot tool for Portfolio Advance Version.
 * Visits every route, logs in where required, and saves
 * desktop (1440x900) + mobile (390x844) screenshots.
 *
 * Run: node scripts/capture-ui.js
 */

const { chromium } = require('../frontend/node_modules/playwright');
const fs = require('fs');
const path = require('path');

// ─── Config ─────────────────────────────────────────────────────────────────
const BASE_URL   = 'http://localhost:5173';
const ADMIN_USER = 'admin'; // Update if needed
const ADMIN_PASS = 'admin'; // Update if needed

const OUT_DESKTOP = path.join(__dirname, '..', 'screenshots', 'desktop');
const OUT_MOBILE  = path.join(__dirname, '..', 'screenshots', 'mobile');
const OUT_META    = path.join(__dirname, '..', 'screenshots', 'meta');
const UI_MAP_FILE = path.join(__dirname, '..', 'screenshots', 'ui-map.md');

// Route → component/css mapping
const PAGES = [
  {
    name: 'home',
    route: '/',
    label: 'Home / Portfolio',
    component: 'src/components/Home.jsx',
    css: 'src/index.css',
    public: true,
  },
  {
    name: 'login',
    route: '/login',
    label: 'Admin Login',
    component: 'src/components/Login.jsx',
    css: 'src/index.css',
    public: true,
  },
  {
    name: 'admin-panel',
    route: '/admin',
    label: 'Admin Panel (Public Route)',
    component: 'src/components/AdminPanel.jsx',
    css: 'src/index.css',
    public: true,
  },
  {
    name: 'dashboard',
    route: '/dashboard',
    label: 'Unified Dashboard',
    component: 'src/components/UnifiedDashboard.jsx',
    css: 'src/index.css',
    requiresAuth: 'admin',
  }
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function ensureDirs() {
  [OUT_DESKTOP, OUT_MOBILE, OUT_META].forEach(d => fs.mkdirSync(d, { recursive: true }));
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Navigate to a URL and wait for network to settle + extra delay.
 */
async function goto(page, url) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await wait(1500); // let dynamic content render
}

/**
 * Admin login — fills username/password on /login and submits.
 * Returns true on success.
 */
async function loginAsAdmin(browser) {
  const ctx  = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await goto(page, `${BASE_URL}/login`);

  try {
    await page.fill('input[type="text"], input[name="username"]', ADMIN_USER);
    await page.fill('input[type="password"], input[name="password"]', ADMIN_PASS);
    await page.click('button[type="submit"]');

    // Wait up to 8s for redirect away from /login
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 8000 });
  } catch (err) {
    console.warn(`⚠ Admin login issue (maybe credentials wrong or redirect timed out): ${err.message}`);
  }

  return { ctx, page };
}

/**
 * Capture desktop (1440×900) and mobile (390×844) screenshots for one page.
 * Waits for async data (projects, skills etc.) to fully render before snapping.
 */
async function capture(ctx, pageName, route) {
  const page = await ctx.newPage();

  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await goto(page, `${BASE_URL}${route}`);

  // Wait for data to finish loading — home page has lazy-fetched projects/skills
  if (route === '/') {
    try {
      // Wait until the "Loading projects..." text disappears (means data is fetched)
      await page.waitForFunction(
        () => !document.body.innerText.includes('Loading projects...'),
        { timeout: 15000 }
      );
      // Also wait for at least one project card to appear in the DOM
      await page.waitForSelector('#projects .grid > div', { timeout: 15000 }).catch(() => {});
    } catch {
      console.warn(`  ⚠ Timed out waiting for projects to load on ${route}, snapping anyway.`);
    }
    // Extra buffer for images/animations to settle
    await wait(1500);
  } else {
    // For other pages, just wait a generous extra delay for any async content
    await wait(2000);
  }

  const desktopPath = path.join(OUT_DESKTOP, `${pageName}-desktop.png`);
  await page.screenshot({ path: desktopPath, fullPage: true });
  console.log(`  📸 Desktop → ${desktopPath}`);

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await wait(800); // let layout reflow
  await page.screenshot({ path: path.join(OUT_MOBILE, `${pageName}-mobile.png`), fullPage: true });
  console.log(`  📱 Mobile  → screenshots/mobile/${pageName}-mobile.png`);

  await page.close();
}

/**
 * Write a .txt metadata file for a page.
 */
function writeMeta(p) {
  fs.mkdirSync(OUT_META, { recursive: true }); // guarantee folder exists
  const content = [
    `Route: ${p.route}`,
    `Desktop screenshot: screenshots/desktop/${p.name}-desktop.png`,
    `Mobile screenshot:  screenshots/mobile/${p.name}-mobile.png`,
    `Component file: ${p.component}`,
    `CSS file: ${p.css ?? 'src/index.css (shared)'}`,
    `Auth required: ${p.requiresAuth ?? 'none'}`,
  ].join('\n');
  fs.writeFileSync(path.join(OUT_META, `${p.name}.txt`), content);
}

/**
 * Build the ui-map.md file from PAGES config.
 */
function buildUiMap(results) {
  const lines = ['# UI Screenshot Map', ''];
  for (const { page, ok } of results) {
    lines.push(`## ${page.label}`);
    lines.push(`- Route: \`${page.route}\``);
    lines.push(`- Desktop screenshot: \`screenshots/desktop/${page.name}-desktop.png\``);
    lines.push(`- Mobile screenshot: \`screenshots/mobile/${page.name}-mobile.png\``);
    lines.push(`- Component file: \`${page.component}\``);
    lines.push(`- CSS file: \`${page.css ?? 'src/index.css (shared)'}\``);
    lines.push(`- Auth required: \`${page.requiresAuth ?? 'none'}\``);
    lines.push(`- Status: ${ok ? '✅ Captured' : '❌ Failed'}`);
    lines.push('');
  }
  fs.writeFileSync(UI_MAP_FILE, lines.join('\n'));
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  ensureDirs();

  // Point directly at the already-downloaded Chrome for Testing binary
  const execPath = 'C:\\Users\\salim\\AppData\\Local\\ms-playwright\\chromium-1228\\chrome-win64\\chrome.exe';
  let browser;
  try {
    browser = await chromium.launch({ headless: true, executablePath: execPath });
  } catch (err) {
    console.warn(`Could not launch Chrome from ${execPath}. Trying default playwright browser.`);
    browser = await chromium.launch({ headless: true });
  }
  const results = [];

  // ── Admin-authenticated context ──────────────────────────────────────────
  console.log('\n🔐 Logging in as admin…');
  const { ctx: adminCtx } = await loginAsAdmin(browser);

  // ── Public context (no auth) ─────────────────────────────────────────────
  const publicCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // ── Screenshot each route ─────────────────────────────────────────────────
  for (const p of PAGES) {
    console.log(`\n▶ ${p.label} (${p.route})`);
    try {
      const ctx = p.requiresAuth === 'admin' ? adminCtx : publicCtx;

      await capture(ctx, p.name, p.route);
      writeMeta(p);
      results.push({ page: p, ok: true });
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
      results.push({ page: p, ok: false, error: err.message });
    }
  }

  buildUiMap(results);
  await browser.close();

  // ── Summary ───────────────────────────────────────────────────────────────
  const ok   = results.filter(r => r.ok);
  const fail = results.filter(r => !r.ok);

  console.log('\n─────────────────────────────────────────────');
  console.log(`✅  Captured: ${ok.length} / ${results.length} pages`);
  if (fail.length) {
    console.log(`❌  Failed (${fail.length}):`);
    fail.forEach(r => console.log(`   • ${r.page.label}: ${r.error}`));
  }
  console.log(`📄  UI map written → screenshots/ui-map.md`);
  console.log('─────────────────────────────────────────────\n');
})();
