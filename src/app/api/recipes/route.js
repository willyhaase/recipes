const KV_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

async function kvLRange(key, start, end) {
  const res = await fetch(`${KV_URL}/lrange/${key}/${start}/${end}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    cache: 'no-store',
  })
  const data = await res.json()
  return data.result || []
}

async function kvLPush(key, value) {
  const res = await fetch(`${KV_URL}/lpush/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([JSON.stringify(value)]),
  })
  return res.json()
}

export async function GET() {
  try {
    if (!KV_URL || !KV_TOKEN) return Response.json({ recipes: [], error: 'DB not configured' })
    const items = await kvLRange('recipes', 0, 199)
    const recipes = items.map(item => {
      try { return typeof item === 'string' ? JSON.parse(item) : item } catch { return null }
    }).filter(Boolean)
    return Response.json({ recipes })
  } catch (e) {
    return Response.json({ recipes: [], error: e.message })
  }
}

export async function POST(request) {
  try {
    if (!KV_URL || !KV_TOKEN) return Response.json({ ok: false, error: 'DB not configured' })
    const recipe = await request.json()
    await kvLPush('recipes', recipe)
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ ok: false, error: e.message })
  }
}
