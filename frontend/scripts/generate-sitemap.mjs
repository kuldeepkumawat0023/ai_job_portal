import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://aijobfit.com';
const APP_DIR = path.join(__dirname, '../src/app');
const PUBLIC_DIR = path.join(__dirname, '../public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap-0.xml');

// 🚫 BLOCKED ROUTES (ONLY PRIVATE PAGES)
const EXCLUDED_ROUTES = [
  '/auth',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-otp',
  '/recruiter/settings',
  '/candidate/settings'
];

function isExcluded(route) {
  return EXCLUDED_ROUTES.some((ex) => route.startsWith(ex));
}

function getPaths(dir, currentRoute = '') {
  let paths = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Handle group folders (e.g., (public), (auth))
      if (file.startsWith('(') && file.endsWith(')')) {
        paths = paths.concat(getPaths(fullPath, currentRoute));
      } else if (!file.startsWith('_') && !file.startsWith('[')) {
        paths = paths.concat(getPaths(fullPath, `${currentRoute}/${file}`));
      }
    } else if (file === 'page.tsx') {
      paths.push(currentRoute || '/');
    }
  }
  return paths;
}

function generateSitemap() {
  console.log('🚀 Generating AI JobFit sitemap...');

  const routes = getPaths(APP_DIR);
  const uniqueRoutes = [...new Set(routes)].filter((route) => !isExcluded(route)).sort();

  const urlsetOpening = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  const urlTags = uniqueRoutes.map(route => {
    let priority = 0.5;
    let freq = 'monthly';

    if (route === '/') { priority = 1.0; freq = 'daily'; }
    else if (route.startsWith('/jobs')) { priority = 0.95; freq = 'daily'; }
    else if (route.startsWith('/candidate') || route.startsWith('/recruiter')) { priority = 0.9; freq = 'daily'; }
    else if (route.startsWith('/news')) { priority = 0.85; freq = 'daily'; }
    else if (route.startsWith('/about') || route.startsWith('/contact')) { priority = 0.6; freq = 'monthly'; }

    return `  <url><loc>${BASE_URL}${route}</loc><lastmod>${new Date().toISOString().split('T')[0]}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`;
  }).join('\n');

  const sitemapContent = `${urlsetOpening}\n${urlTags}\n</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, sitemapContent);
  console.log(`✅ Sitemap updated successfully at ${SITEMAP_PATH}`);
}

generateSitemap();
