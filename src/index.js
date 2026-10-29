/**
 * Magic Mirror worker.
 *
 * Everything is static except one route. /api/token mints a short lived
 * ElevenLabs conversation token using an API key that lives in Cloudflare and
 * never reaches the browser.
 *
 * Why this exists: the agent id is readable in the page source, and an
 * ElevenLabs agent with authentication off will talk to anybody who has it.
 * Anyone could point their own page at the agent and spend the credits. With
 * authentication on, the id alone is useless and only this route can start a
 * conversation.
 */

const ALLOWED_ORIGINS = new Set([
  'https://your-mirror.example.com',
  'https://your-mirror.workers.dev',
]);

/* Per isolate, so this is approximate across the edge rather than a global
 * count. That is fine: the job is to bound a runaway, not to be exact. A real
 * mirror asks for one token per conversation, so a dozen a minute is generous. */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
let recent = [];

const json = (body, status) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/token') return env.ASSETS.fetch(request);

    /* Browsers omit Origin on same origin GETs, so Sec-Fetch-Site is the
     * reliable signal here. Origin is kept as a fallback for anything that
     * does send it. Neither can be set by page script, though curl can forge
     * both, which is what the rate limit is for. */
    const site = request.headers.get('Sec-Fetch-Site');
    const origin = request.headers.get('Origin');
    const sameOrigin = site === 'same-origin' || site === 'none';
    const allowedOrigin = origin && ALLOWED_ORIGINS.has(origin);
    if (!sameOrigin && !allowedOrigin) {
      return json({ error: 'This mirror only serves its own page.' }, 403);
    }

    const now = Date.now();
    recent = recent.filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) {
      return json({ error: 'Too many requests. Wait a moment.' }, 429);
    }
    recent.push(now);

    if (!env.ELEVENLABS_API_KEY) {
      return json(
        { error: 'Server is missing ELEVENLABS_API_KEY. Add it as a Worker secret.' },
        500
      );
    }

    const upstream = await fetch(
      'https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=' +
        encodeURIComponent(env.AGENT_ID),
      { headers: { 'xi-api-key': env.ELEVENLABS_API_KEY } }
    );

    if (!upstream.ok) {
      const detail = await upstream.text();
      return json(
        { error: `ElevenLabs returned ${upstream.status}`, detail: detail.slice(0, 300) },
        upstream.status
      );
    }

    return new Response(await upstream.text(), {
      status: 200,
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  },
};
