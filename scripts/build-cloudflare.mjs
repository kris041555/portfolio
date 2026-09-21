import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "cloudflare-dist");
const files = ["app.js", "favicon.svg", "index.html", "styles.css"];
const directories = [
  "assets/audio",
  "assets/covers",
  "assets/cursor",
];
const remoteVideos =
  "https://kris041555.github.io/portfolio/assets/videos/";

await rm(output, { force: true, recursive: true });
await mkdir(output, { recursive: true });

for (const file of files) {
  await cp(path.join(root, file), path.join(output, file));
}

for (const directory of directories) {
  await cp(path.join(root, directory), path.join(output, directory), {
    recursive: true,
  });
}

const appPath = path.join(output, "app.js");
const app = await readFile(appPath, "utf8");
await writeFile(
  appPath,
  app.replaceAll("assets/videos/", remoteVideos),
);

console.log(`Cloudflare asset bundle written to ${output}`);
