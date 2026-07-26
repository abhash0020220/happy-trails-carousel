/* Happy Trails caption proxy
 * Holds the Gemini API key server-side (as a Worker secret) and forwards
 * a small, fixed prompt built from the carousel's own content. The public
 * GitHub Pages site never sees the key.
 */

const ALLOWED_ORIGINS = new Set([
  "https://abhash0020220.github.io",
  "http://localhost:8123",
  "http://127.0.0.1:8123",
]);

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function buildPrompt({ hook, mission, services, rates, dogName }) {
  return `You write short, warm Instagram captions for "Happy Trails Dog Walking," \
a dog walking and pet care business run by local teens in the Cambrian area.

Write ONE Instagram caption for a 3-slide carousel post with this content:
- Hook / headline: "${hook}"
- Mission: "${mission}"
- Services: "${services}"
- Rates: "${rates}"
- Featured dog in the photo: "${dogName}"

Requirements:
- Friendly, upbeat, casual teen-run-small-business voice. Not corporate.
- 2-4 short sentences or lines, plus a short call to action (e.g. book a walk, DM us, contact us).
- End with 5-8 relevant hashtags (mix of local + dog walking + pet care tags, e.g. #CambrianPark #DogWalker #PetCare).
- Do not use markdown formatting, asterisks, or quotation marks around the whole caption.
- Output ONLY the caption text, nothing else.`;
}

async function generateCaption(env, payload) {
  const prompt = buildPrompt(payload);

  const resp = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 1500,
        },
      }),
    }
  );

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Gemini API error ${resp.status}: ${errText}`);
  }

  const data = await resp.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  if (!text.trim()) throw new Error("Gemini returned an empty caption");
  return text.trim();
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers });
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), {
        status: 403,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    try {
      const caption = await generateCaption(env, payload);
      return new Response(JSON.stringify({ caption }), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err.message || err) }), {
        status: 502,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }
  },
};
