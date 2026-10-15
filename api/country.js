// Vercel supplies this header from the visitor's public IP. No IP is stored.
// The response is per visitor and must never be shared by a CDN cache.
export function GET(request) {
  const rawCountry = request.headers.get("x-vercel-ip-country");
  const country = /^[A-Z]{2}$/.test(rawCountry ?? "") ? rawCountry : null;
  return Response.json({ country }, {
    headers: { "Cache-Control": "private, no-store", "Vary": "x-vercel-ip-country" }
  });
}
