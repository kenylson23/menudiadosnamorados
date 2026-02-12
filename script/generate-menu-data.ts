import { storage } from "../server/storage";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generate() {
  try {
    const menu = await storage.getPublicMenu();
    const outputPath = path.resolve(__dirname, "../client/public/menu-data.json");
    fs.writeFileSync(outputPath, JSON.stringify(menu, null, 2));
    console.log("Successfully generated menu-data.json");
    process.exit(0);
  } catch (err) {
    console.error("Failed to generate menu-data.json:", err);
    process.exit(1);
  }
}

generate();
