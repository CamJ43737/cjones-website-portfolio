import fs from "fs";
import path from "path";

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (/\.(ts|tsx|json)$/.test(e.name)) a.push(p);
  }
  return a;
}

const files = walk("src");
const re = /["'`](\/(?:images|videos)\/[^"'`]+)["'`]/g;
const refs = new Map();
for (const f of files) {
  const t = fs.readFileSync(f, "utf8");
  let m;
  while ((m = re.exec(t))) {
    if (!refs.has(m[1])) refs.set(m[1], []);
    refs.get(m[1]).push(path.basename(f));
  }
}

const missing = [];
for (const [p, from] of [...refs.entries()].sort()) {
  const full = path.join("public", p.replace(/^\//, "").replace(/\//g, path.sep));
  if (!fs.existsSync(full)) missing.push(`${p} <- ${from.slice(0, 4).join(", ")}`);
}
console.log(`refs ${refs.size} missing ${missing.length}`);
missing.forEach((x) => console.log(x));
