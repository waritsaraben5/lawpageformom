import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

const path = process.argv[2] || "scripts/knowledge-30weeks.pdf";
const buffer = fs.readFileSync(path);
const data = await pdf(buffer);
fs.writeFileSync("scripts/knowledge-30weeks.txt", data.text, "utf8");
console.log("Pages:", data.numpages, "Chars:", data.text.length);
