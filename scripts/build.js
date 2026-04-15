const fs = require("fs/promises");
const path = require("path");

async function main() {
  const root = path.join(__dirname, "..");
  const srcDir = path.join(root, "src");
  const distDir = path.join(root, "dist");

  await fs.rm(distDir, { recursive: true, force: true });
  await fs.cp(srcDir, distDir, { recursive: true });
  console.log(`Build output: ${distDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
