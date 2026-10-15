import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { GET as countryHandler } from "../api/country.js";

const root = fileURLToPath(new URL("../dist/", import.meta.url));
const args = process.argv.slice(2);
const portArg = args.find((arg) => arg.startsWith("--port="));
const countryArg = args.find((arg) => arg.startsWith("--country="));
const port = portArg ? Number(portArg.split("=")[1]) : 4173;
const simulatedCountry = countryArg?.split("=")[1] ?? "";
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("Invalid port");
if (simulatedCountry && !/^[A-Z]{2}$/.test(simulatedCountry)) throw new Error("Use a two-letter country code such as KR");
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".mp4": "video/mp4", ".webm": "video/webm" };

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/api/country") {
      if (req.method !== "GET") { res.writeHead(405, { Allow: "GET" }); res.end(); return; }
      // Local simulation is opt-in at server startup, never inferred from locale.
      const headers = simulatedCountry ? { "x-vercel-ip-country": simulatedCountry } : {};
      const response = countryHandler(new Request(url, { headers }));
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(await response.text());
      return;
    }
    if (!["GET", "HEAD"].includes(req.method)) { res.writeHead(405, { Allow: "GET, HEAD" }); res.end(); return; }
    const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const path = resolve(root, `.${pathname}`);
    if (!path.startsWith(resolve(root) + sep)) { res.writeHead(403); res.end("Forbidden"); return; }
    const file = await readFile(path);
    res.writeHead(200, { "Content-Type": mime[extname(path)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(req.method === "HEAD" ? undefined : file);
  } catch (error) {
    const status = error.code === "ENOENT" || error.code === "EISDIR" ? 404 : 400;
    res.writeHead(status); res.end(status === 404 ? "Not found" : "Bad request");
  }
});
server.listen(port, "127.0.0.1", () => {
  console.log(`Local: http://127.0.0.1:${port}`);
  console.log(simulatedCountry ? `Country simulation: ${simulatedCountry} (QA only)` : "Country: unknown locally; default language: English");
});
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close(() => process.exit(0)));
