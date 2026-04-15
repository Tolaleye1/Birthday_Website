import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

// ── Load environment variables from .env.local ──────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, "..", ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

// ── Connect to Supabase with the service role key ───────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Read parsed tributes ────────────────────────────────────────────────────
const jsonPath = join(__dirname, "tributes-parsed.json");
const tributes = JSON.parse(readFileSync(jsonPath, "utf-8"));

console.log(`\n📄 Loaded ${tributes.length} tributes from ${jsonPath}\n`);

// ── Upload one at a time, 100ms delay between each ─────────────────────────
// contributions table schema (from supabase/schema.sql):
//   id            UUID DEFAULT gen_random_uuid() PRIMARY KEY
//   type          TEXT NOT NULL  ('text' | 'photo' | 'video')
//   submitter_name TEXT NOT NULL
//   message       TEXT
//   caption       TEXT
//   asset_path    TEXT
//   asset_url     TEXT
//   asset_mime_type TEXT
//   asset_size_bytes BIGINT
//   video_duration_seconds INTEGER
//   is_deleted    BOOLEAN DEFAULT FALSE
//   created_at    TIMESTAMPTZ DEFAULT NOW()

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let success = 0;
let failed = 0;

for (let i = 0; i < tributes.length; i++) {
  const { name, message } = tributes[i];

  const { error } = await supabase.from("contributions").insert({
    type: "text",
    submitter_name: name,
    message: message,
    is_deleted: false,
    // created_at defaults to NOW() via the database
  });

  if (error) {
    console.error(`❌ [${i + 1}/${tributes.length}] FAILED "${name}": ${error.message}`);
    failed++;
  } else {
    console.log(`✅ [${i + 1}/${tributes.length}] Uploaded: "${name}"`);
    success++;
  }

  await sleep(100);
}

// ── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${"═".repeat(50)}`);
console.log(`📊 Upload complete:`);
console.log(`   ✅ Success: ${success}`);
console.log(`   ❌ Failed:  ${failed}`);
console.log(`   📋 Total:   ${tributes.length}`);
console.log(`${"═".repeat(50)}\n`);
