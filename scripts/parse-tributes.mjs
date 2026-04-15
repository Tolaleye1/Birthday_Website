import mammoth from "mammoth";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCX_PATH = join(
  __dirname,
  "..",
  "docs",
  "Pastor Laitan's Tributes Majority.docx"
);

// ── Step 1: Convert to HTML (preserves bold/italic formatting) ───────────────
const { value: html } = await mammoth.convertToHtml({ path: DOCX_PATH });

// ── Step 2: Parse HTML into top-level elements (<p> and <ul>) ───────────────
const elements = [];
const tagRegex = /<(p|ul)>([\s\S]*?)<\/\1>/g;
let match;
while ((match = tagRegex.exec(html)) !== null) {
  elements.push({ tag: match[1], content: match[2] });
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function stripHtml(s) {
  return s.replace(/<[^>]+>/g, "").trim();
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function clean(s) {
  return decodeEntities(stripHtml(s));
}

/**
 * True if the <p>'s visible text comes entirely from <strong> tags.
 * Minor trailing punctuation (periods, spaces) outside bold is tolerated.
 */
function isBoldOnlyParagraph(content) {
  // Remove all bold spans, then strip remaining HTML tags
  const withoutBold = content.replace(/<strong>[\s\S]*?<\/strong>/g, "");
  const leftover = withoutBold
    .replace(/<[^>]+>/g, "")
    .replace(/[\s.,;:!?\-–—'"()]/g, "");

  // Must have meaningful bold text (>2 chars after stripping punctuation)
  const boldText = (content.match(/<strong>([\s\S]*?)<\/strong>/g) || [])
    .map((b) => stripHtml(b))
    .join(" ")
    .replace(/[\s.,;:!?\-–—'"()]/g, "");

  return /<strong>/.test(content) && leftover === "" && boldText.length > 2;
}

/**
 * True if the bold text is a section title / subtitle, NOT a person's name.
 * Titles: "TRIBUTE TO A WONDERFUL SISTER AT 50", "Celebrating Greatness @50"
 * Subtitles: "APICP CSR, Lagos Province 44", "PH Rivers state."
 */
function isTitleText(text) {
  const t = text.trim();
  if (/tribute/i.test(t)) return true;
  if (/^celebrating\b/i.test(t)) return true;
  if (/\bat\s*50\b/i.test(t)) return true;
  if (/\b(PICP|APICP|CSR)\b/.test(t)) return true;
  if (/\bProvince\b/i.test(t)) return true;
  if (/\bPH\s+Rivers\b/i.test(t)) return true;
  return false;
}

// ── Step 3: Walk elements linearly, split on signature markers ──────────────
// Pattern A:  <ul><li><strong>NAME</strong></li></ul>  → always a signature
// Pattern B:  <p><strong>NAME</strong></p>              → signature if not a title
// Everything else is message content accumulated between signatures.

const tributes = [];
let msgParts = [];

for (const el of elements) {
  // ── Case A: <ul><li><strong>NAME</strong></li></ul> ──
  if (el.tag === "ul" && /<li>\s*<strong>/.test(el.content)) {
    const nameMatch = el.content.match(/<strong>([\s\S]*?)<\/strong>/);
    const name = clean(nameMatch[1]);

    if (msgParts.length) {
      tributes.push({ name, message: msgParts.join("\n\n").trim() });
    }
    msgParts = [];
    continue;
  }

  // ── Case B: <p> whose visible text is entirely bold ──
  if (el.tag === "p" && isBoldOnlyParagraph(el.content)) {
    const text = clean(el.content);

    if (isTitleText(text)) {
      // Title / subtitle → keep as message content
      msgParts.push(text);
    } else {
      // Person's name → emit tribute
      if (msgParts.length) {
        const finalName = text.replace(/\.$/, "").trim();
        tributes.push({
          name: finalName,
          message: msgParts.join("\n\n").trim(),
        });
      }
      msgParts = [];
    }
    continue;
  }

  // ── Case C: regular paragraph → accumulate ──
  const text = clean(el.content);
  if (text) msgParts.push(text);
}

// Handle any leftover content (no signature at the very end)
if (msgParts.length) {
  tributes.push({
    name: "Unknown",
    message: msgParts.join("\n\n").trim(),
  });
}

// ── Step 4: Write output ────────────────────────────────────────────────────
const outputPath = join(__dirname, "tributes-parsed.json");
writeFileSync(outputPath, JSON.stringify(tributes, null, 2), "utf-8");

console.log(`\n✅ Parsed ${tributes.length} tributes → ${outputPath}\n`);

// Show first 3 and last 3 for verification
console.log("── First 3 ──");
tributes.slice(0, 3).forEach((t, i) => {
  console.log(`[${i + 1}] Name: "${t.name}"`);
  console.log(`    Message preview: "${t.message.slice(0, 120)}..."\n`);
});

console.log("── Last 3 ──");
tributes.slice(-3).forEach((t, i) => {
  const idx = tributes.length - 3 + i + 1;
  console.log(`[${idx}] Name: "${t.name}"`);
  console.log(`    Message preview: "${t.message.slice(0, 120)}..."\n`);
});
