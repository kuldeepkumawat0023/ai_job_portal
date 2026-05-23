import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ AIJobFit DOMAIN FIXED
const BASE_URL = "https://aijobfit.com";

const APP_DIR = path.join(__dirname, "../src/app");
const PUBLIC_DIR = path.join(__dirname, "../public");
const SITEMAP_PATH = path.join(PUBLIC_DIR, "sitemap-0.xml");

// 🚫 BLOCKED ROUTES (ONLY PRIVATE PAGES)
const EXCLUDED_ROUTES = [
  "/auth",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
];

// 🎯 PRIORITY SYSTEM (AI JOB FIT OPTIMIZED)
function getPriority(route) {
  if (route === "/") return 1.0;

  // 🔥 JOB PLATFORM CORE
  if (route.startsWith("/jobs")) return 0.95;
  if (route.startsWith("/candidate")) return 0.9;
  if (route.startsWith("/recruiter")) return 0.9;

  if (route.startsWith("/news")) return 0.85;

  if (route.startsWith("/about") || route.startsWith("/contact"))
    return 0.6;

  return 0.5;
}

// ⏱️ CHANGE FREQUENCY
function getFreq(route) {
  if (route === "/") return "daily";

  if (route.startsWith("/jobs")) return "daily"; // 🔥 IMPORTANT
  if (route.startsWith("/news")) return "daily";

  return "monthly";
}

// 🚫 FILTER FUNCTION
function isExcluded(route) {
  return EXCLUDED_ROUTES.some((ex) => route.startsWith(ex));
}

// 📁 SCAN NEXT.JS APP ROUTES
function getPaths(dir, currentRoute = "") {
  let paths = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Handle Next.js route groups (VERY IMPORTANT)
      if (file.startsWith("(") && file.endsWith(")")) {
        paths = paths.concat(getPaths(fullPath, currentRoute));
      } else if (!file.startsWith("_") && !file.startsWith("[")) {
        paths = paths.concat(
          getPaths(fullPath, `${currentRoute}/${file}`)
        );
      }
    } else if (file === "page.tsx") {
      const route = currentRoute || "/";
      paths.push(route);
    }
  }

  return paths;
}

// 🚀 GENERATE SITEMAP
function generateSitemap() {
  console.log("🚀 Generating AIJobFit sitemap...");

  const routes = getPaths(APP_DIR);

  const uniqueRoutes = [...new Set(routes)]
    .filter((route) => !isExcluded(route))
    .sort();

  const urls = uniqueRoutes
    .map((route) => {
      const priority = getPriority(route);
      const freq = getFreq(route);

      return `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync(SITEMAP_PATH, sitemap.trim());

  console.log("✅ Sitemap updated successfully!");
  console.log("📍 Path:", SITEMAP_PATH);
}

generateSitemap();