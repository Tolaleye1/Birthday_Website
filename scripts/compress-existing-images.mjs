import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(process.cwd(), ".env.local") });
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

// ── Config ──
const BUCKET = "media";
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 82;
const SIZE_THRESHOLD = 1 * 1024 * 1024; // 1 MB
const DELAY_MS = 200;
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// ── Supabase client ──
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function isImage(name) {
  const lower = name.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatMB(bytes) {
  return (bytes / (1024 * 1024)).toFixed(2);
}

/**
 * Recursively list every file in the bucket.
 * Supabase storage.list() returns items and folders for one level at a time.
 */
async function listAllFiles(prefix = "") {
  const allFiles = [];

  const { data, error } = await supabase.storage.from(BUCKET).list(prefix, {
    limit: 1000,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    console.error(`❌ Error listing files in "${prefix}":`, error.message);
    return allFiles;
  }

  for (const item of data || []) {
    const fullPath = prefix ? `${prefix}/${item.name}` : item.name;

    if (item.id) {
      // It's a file (has an id)
      allFiles.push(fullPath);
    } else {
      // It's a folder — recurse
      const nested = await listAllFiles(fullPath);
      allFiles.push(...nested);
    }
  }

  return allFiles;
}

// ── Main ──
async function main() {
  console.log("🔍 Scanning media bucket for images...\n");

  const allFiles = await listAllFiles();
  const imageFiles = allFiles.filter(isImage);

  console.log(`Found ${allFiles.length} total files, ${imageFiles.length} are images.\n`);

  let totalChecked = 0;
  let totalCompressed = 0;
  let totalSkipped = 0;
  let totalBytesSaved = 0;

  for (const filePath of imageFiles) {
    totalChecked++;

    try {
      // Download
      const { data: blob, error: dlError } = await supabase.storage
        .from(BUCKET)
        .download(filePath);

      if (dlError || !blob) {
        console.error(`  ❌ Failed to download ${filePath}: ${dlError?.message}`);
        continue;
      }

      const originalBytes = blob.size;

      if (originalBytes <= SIZE_THRESHOLD) {
        console.log(`  ⏭  Skipping ${filePath} — already small (${formatMB(originalBytes)} MB)`);
        totalSkipped++;
        await sleep(DELAY_MS);
        continue;
      }

      // Compress with sharp
      const buffer = Buffer.from(await blob.arrayBuffer());
      const compressed = await sharp(buffer)
        .resize({ width: MAX_WIDTH, height: MAX_WIDTH, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toBuffer();

      const newBytes = compressed.length;
      const saved = originalBytes - newBytes;

      // Re-upload, overwriting the original
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, compressed, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (uploadError) {
        console.error(`  ❌ Failed to upload ${filePath}: ${uploadError.message}`);
        await sleep(DELAY_MS);
        continue;
      }

      totalCompressed++;
      totalBytesSaved += saved;
      console.log(`  ✅ Compressed ${filePath}: ${formatMB(originalBytes)} MB → ${formatMB(newBytes)} MB`);
    } catch (err) {
      console.error(`  ❌ Error processing ${filePath}:`, err.message || err);
    }

    await sleep(DELAY_MS);
  }

  // ── Summary ──
  console.log("\n" + "═".repeat(50));
  console.log("📊 Compression Summary");
  console.log("═".repeat(50));
  console.log(`  Total files checked:  ${totalChecked}`);
  console.log(`  Compressed:           ${totalCompressed}`);
  console.log(`  Skipped (< 1MB):      ${totalSkipped}`);
  console.log(`  Space saved:          ${formatMB(totalBytesSaved)} MB`);
  console.log("═".repeat(50));
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
