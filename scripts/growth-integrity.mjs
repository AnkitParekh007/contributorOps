import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const failures = [];
const passes = [];

function read(relativePath) {
	const filePath = path.join(root, relativePath);
	if (!fs.existsSync(filePath)) {
		fail(`Missing required file: ${relativePath}`);
		return "";
	}
	return fs.readFileSync(filePath, "utf8");
}

function pass(message) {
	passes.push(message);
}

function fail(message) {
	failures.push(message);
}

function assert(condition, message) {
	condition ? pass(message) : fail(message);
}

const campaigns = read("apps/site/src/lib/campaigns.ts");
const analytics = read("apps/site/src/lib/analytics.ts");
const adoption = read("apps/site/src/pages/Adoption.tsx");
const share = read("apps/site/src/pages/Share.tsx");
const guide = read("docs/phase-9-growth-operating-system.md");

assert(/CAMPAIGN_ID\s*=\s*["']phase9-growth["']/.test(campaigns), "Phase 9 campaign id is canonical");
for (const channel of ["show-hn", "product-hunt", "developer-community", "recruiter", "maintainer", "github-readme"]) {
	assert(campaigns.includes(`id: \"${channel}\"`), `Campaign registry includes ${channel}`);
}
for (const parameter of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
	assert(campaigns.includes(`params.set(\"${parameter}\"`), `Campaign URLs include ${parameter}`);
}
assert(/campaignAttribution\(\)/.test(analytics), "Analytics events read canonical campaign attribution");
assert(/const mergedProps = \{ \.\.\.campaign, \.\.\.props \}/.test(analytics), "Campaign attribution is merged into optional analytics events");
assert(/CAMPAIGN_CHANNELS/.test(adoption), "Growth dashboard renders the canonical campaign registry");
assert(/no conversion rate is fabricated/i.test(adoption), "Growth dashboard states the no-fabricated-conversion boundary");
assert(/campaignUrl/.test(share), "Share Hub uses the shared campaign URL builder");
assert(!/phase8-public-launch/.test(share), "Share Hub no longer hardcodes the Phase 8 campaign id");
assert(/48-hour/i.test(guide), "Growth guide defines a 48-hour review");
assert(/7-day/i.test(guide), "Growth guide defines a 7-day review");
assert(/anti-gaming/i.test(guide), "Growth guide documents anti-gaming rules");
assert(/do not.*coordinated.*stars/i.test(guide), "Growth guide rejects coordinated star campaigns");

console.log(`\nContributorOps growth integrity checks: ${passes.length} passed, ${failures.length} failed.\n`);
for (const message of passes) console.log(`✓ ${message}`);
for (const message of failures) console.error(`✗ ${message}`);

if (failures.length) {
	console.error("\nGrowth integrity gate failed. Fix attribution or launch-policy drift before merge.\n");
	process.exit(1);
}

console.log("\nGrowth integrity gate passed.\n");
