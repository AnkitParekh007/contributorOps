import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const siteRoot = path.join(root, "apps", "site");
const srcRoot = path.join(siteRoot, "src");
const appPath = path.join(srcRoot, "App.tsx");
const routeMetaPath = path.join(srcRoot, "components", "RouteMeta.tsx");
const indexPath = path.join(siteRoot, "index.html");
const distIndexPath = path.join(siteRoot, "dist", "index.html");

const failures = [];
const passes = [];

function pass(message) {
	passes.push(message);
}

function fail(message) {
	failures.push(message);
}

function assert(condition, message) {
	condition ? pass(message) : fail(message);
}

function read(filePath) {
	if (!fs.existsSync(filePath)) {
		fail(`Missing required file: ${path.relative(root, filePath)}`);
		return "";
	}
	return fs.readFileSync(filePath, "utf8");
}

function walk(directory) {
	return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) return walk(fullPath);
		return fullPath;
	});
}

function routeMatches(link, routes) {
	if (routes.has(link)) return true;
	if (link.startsWith("/docs/") && routes.has("/docs/:slug")) return true;
	return false;
}

const indexHtml = read(indexPath);
const appSource = read(appPath);
const routeMetaSource = read(routeMetaPath);
const distHtml = read(distIndexPath);

assert(/<html[^>]+lang=["']en["']/i.test(indexHtml), "index.html declares an English document language");
assert(/<meta[^>]+name=["']viewport["']/i.test(indexHtml), "index.html declares a viewport");
assert(/<meta[^>]+name=["']description["']/i.test(indexHtml), "index.html has a description meta tag");
assert(/<link[^>]+rel=["']canonical["']/i.test(indexHtml), "index.html has a canonical link");
assert(/<meta[^>]+property=["']og:title["']/i.test(indexHtml), "index.html has Open Graph title metadata");
assert(/<meta[^>]+property=["']og:description["']/i.test(indexHtml), "index.html has Open Graph description metadata");
assert(/<meta[^>]+name=["']twitter:card["']/i.test(indexHtml), "index.html has Twitter card metadata");
assert(/<link[^>]+rel=["']manifest["']/i.test(indexHtml), "index.html links the web manifest");
assert(/<title>[^<]+<\/title>/i.test(indexHtml), "index.html has a non-empty title");

const routeMatchesRaw = [...appSource.matchAll(/<Route\s+path=["']([^"']+)["']/g)].map((match) => match[1]);
const routes = new Set(routeMatchesRaw.filter((route) => route !== "*"));
assert(routes.size >= 10, `App.tsx exposes ${routes.size} public routes`);

const metaKeys = new Set([...routeMetaSource.matchAll(/^\s*["'](\/[^"']*)["']:\s*\{/gm)].map((match) => match[1]));
const metadataRoutes = [...routes].filter((route) => !route.includes(":"));
for (const route of metadataRoutes) {
	assert(metaKeys.has(route), `Route metadata exists for ${route}`);
}
assert(/pathname\.startsWith\(["']\/docs\/["']\)/.test(routeMetaSource), "Dynamic documentation routes receive generated metadata");

const tsxFiles = walk(srcRoot).filter((file) => file.endsWith(".tsx"));
const literalLinks = new Set();
for (const file of tsxFiles) {
	const source = read(file);
	for (const match of source.matchAll(/\bto=["'](\/[^"']*)["']/g)) {
		literalLinks.add(match[1]);
	}
}

for (const link of literalLinks) {
	assert(routeMatches(link, routes), `Internal Link target resolves to a declared route: ${link}`);
}

const imageTags = tsxFiles.flatMap((file) => {
	const source = read(file);
	return [...source.matchAll(/<img\b[^>]*>/gi)].map((match) => ({ file, tag: match[0] }));
});
for (const { file, tag } of imageTags) {
	assert(/\balt=/.test(tag), `Image has alt text in ${path.relative(root, file)}`);
}

const buttonTags = tsxFiles.flatMap((file) => {
	const source = read(file);
	return [...source.matchAll(/<button\b[^>]*>/gi)].map((match) => ({ file, tag: match[0] }));
});
for (const { file, tag } of buttonTags) {
	assert(/\btype=/.test(tag), `Button declares an explicit type in ${path.relative(root, file)}`);
}

assert(Boolean(distHtml), "Site build output exists at apps/site/dist/index.html");
if (distHtml) {
	assert(/\/contributorOps\/assets\//.test(distHtml), "Built site assets use the GitHub Pages /contributorOps/ base path");
	assert(!/src=["']\/assets\//.test(distHtml), "Built site does not emit root-relative /assets paths");
}

console.log(`\nContributorOps site quality checks: ${passes.length} passed, ${failures.length} failed.\n`);
for (const message of passes) console.log(`✓ ${message}`);
for (const message of failures) console.error(`✗ ${message}`);

if (failures.length > 0) {
	console.error("\nSite quality gate failed. Fix the items above before merge.\n");
	process.exit(1);
}

console.log("\nSite quality gate passed.\n");
