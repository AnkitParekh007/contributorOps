import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const source = path.join(root, "apps", "site", "dist");
const harnessRoot = path.join(root, ".lighthouse-pages");
const target = path.join(harnessRoot, "contributorOps");

if (!fs.existsSync(source)) {
	throw new Error("apps/site/dist does not exist. Run the site build before preparing Lighthouse.");
}

fs.rmSync(harnessRoot, { recursive: true, force: true });
fs.mkdirSync(target, { recursive: true });
fs.cpSync(source, target, { recursive: true });

console.log("Prepared Lighthouse harness at .lighthouse-pages/contributorOps");
