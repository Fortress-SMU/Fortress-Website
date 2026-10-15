import test from "node:test";
import assert from "node:assert/strict";
import "../dist/language.js";
import { GET } from "../api/country.js";

const { chooseLanguage, detectLanguage } = globalThis.FortressLanguage;

test("first visit: English without country; Korean only for KR", () => {
  for (const country of [undefined, null, "", "US", "JP", "XX", "ko-KR"]) assert.equal(chooseLanguage(null, country), "en");
  assert.equal(chooseLanguage(null, "KR"), "ko");
});
test("an explicit saved selection takes priority over country", () => {
  assert.equal(chooseLanguage("en", "KR"), "en");
  assert.equal(chooseLanguage("ko", "US"), "ko");
  assert.equal(chooseLanguage("invalid", "KR"), "ko");
});
test("a selection made while geolocation is pending must win", async () => {
  let resolveCountry;
  let choice;
  const applied = [];
  const pending = detectLanguage({ saved: null, getChoice: () => choice, apply: (lang) => applied.push(lang), fetchCountry: () => new Promise((resolve) => { resolveCountry = resolve; }) });
  choice = "en";
  resolveCountry("KR");
  await pending;
  assert.deepEqual(applied, ["en"]);
});
test("country success and network failure keep the site usable", async () => {
  const applied = [];
  await detectLanguage({ saved: null, getChoice: () => null, apply: (lang) => applied.push(lang), fetchCountry: async () => "KR" });
  assert.deepEqual(applied, ["en", "ko"]);
  const fallback = [];
  await detectLanguage({ saved: null, getChoice: () => null, apply: (lang) => fallback.push(lang), fetchCountry: async () => { throw new Error("offline"); } });
  assert.deepEqual(fallback, ["en"]);
});
test("saved choice avoids an unnecessary country request", async () => {
  let calls = 0;
  const applied = [];
  await detectLanguage({ saved: "ko", getChoice: () => "ko", apply: (lang) => applied.push(lang), fetchCountry: async () => { calls++; } });
  assert.equal(calls, 0);
  assert.deepEqual(applied, ["ko"]);
});
test("API returns country or null and disallows shared caching", async () => {
  for (const [header, expected] of [["KR", "KR"], ["US", "US"], ["kr", null], ["invalid", null], ["", null]]) {
    const response = GET(new Request("http://localhost/api/country", { headers: { "x-vercel-ip-country": header } }));
    assert.deepEqual(await response.json(), { country: expected });
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.equal(response.headers.get("vary"), "x-vercel-ip-country");
  }
});
