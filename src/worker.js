export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/scores" && request.method === "GET") {
      const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 10), 1), 50);
      const { results } = await env.DB.prepare(
        "SELECT name, score, created_at FROM scores ORDER BY score DESC, created_at ASC LIMIT ?"
      ).bind(limit).all();
      return json(results || [], 200, { "Cache-Control": "no-store" });
    }
    if (url.pathname === "/api/scores" && request.method === "POST") {
      let body;
      try { body = await request.json(); } catch { return json({error:"Invalid JSON"},400); }
      const name = String(body?.name || "").trim();
      const score = Number(body?.score);
      if (!name || name.length > 24) return json({error:"Name must be 1–24 characters"},400);
      if (!Number.isInteger(score) || score < 0 || score > 1000000) return json({error:"Invalid score"},400);
      await env.DB.prepare("INSERT INTO scores (name, score, created_at) VALUES (?, ?, datetime('now'))").bind(name,score).run();
      return json({ok:true},201);
    }
    // Cloudflare Workers Assets serves the static game.
    return env.ASSETS.fetch(request);
  }
};
function json(data,status=200,extra={}){return new Response(JSON.stringify(data),{status,headers:{"Content-Type":"application/json; charset=utf-8","Access-Control-Allow-Origin":"*",...extra}})}
