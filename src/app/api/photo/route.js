export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || 'food dish'
  const PEXELS_KEY = process.env.PEXELS_API_KEY

  if (!PEXELS_KEY) {
    // Fallback: deterministic food photo based on query hash
    const fallbacks = [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?w=800&h=600&fit=crop',
    ]
    let hash = 0
    for (let i = 0; i < query.length; i++) hash = query.charCodeAt(i) + ((hash << 5) - hash)
    const url = fallbacks[Math.abs(hash) % fallbacks.length]
    return Response.json({ url })
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + ' food')}&per_page=5&orientation=landscape`,
      { headers: { Authorization: PEXELS_KEY }, cache: 'force-cache' }
    )
    const data = await res.json()
    const photos = data.photos || []
    if (photos.length === 0) throw new Error('no photos')

    // Pick deterministically based on query
    let hash = 0
    for (let i = 0; i < query.length; i++) hash = query.charCodeAt(i) + ((hash << 5) - hash)
    const photo = photos[Math.abs(hash) % photos.length]
    const url = photo.src.large || photo.src.medium

    return Response.json({ url, photographer: photo.photographer, pexelsUrl: photo.url })
  } catch {
    // Fallback photos (Pexels CDN, no auth needed for display)
    const fallbacks = [
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
    ]
    let hash = 0
    for (let i = 0; i < query.length; i++) hash = query.charCodeAt(i) + ((hash << 5) - hash)
    return Response.json({ url: fallbacks[Math.abs(hash) % fallbacks.length] })
  }
}
