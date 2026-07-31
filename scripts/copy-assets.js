const fs = require("fs");
const path = require("path");

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log("🌸 Copying chapters and assets to public directory...");

// 1. Copy E:\Hari\chapters -> E:\Hari\public\chapters
copyDirRecursive(
  path.join(__dirname, "..", "chapters"),
  path.join(__dirname, "..", "public", "chapters")
);

// 2. Copy E:\Hari\assets -> E:\Hari\public\assets
copyDirRecursive(
  path.join(__dirname, "..", "assets"),
  path.join(__dirname, "..", "public", "assets")
);

console.log("✅ Assets copied successfully to public directory!");
