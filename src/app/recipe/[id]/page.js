import { notFound } from 'next/navigation'

const KV_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

async function getRecipe(id) {
  try {
    const res = await fetch(`${KV_URL}/lrange/recipes/0/199`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      cache: 'no-store',
    })
    const data = await res.json()
    const items = data.result || []
    for (const item of items) {
      try {
        const raw = typeof item === 'string' ? JSON.parse(item) : item
        const recipe = Array.isArray(raw) ? raw[0] : raw
        const parsed = typeof recipe === 'string' ? JSON.parse(recipe) : recipe
        if (String(parsed.id) === String(id)) return parsed
      } catch {}
    }
    return null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const recipe = await getRecipe(params.id)
  if (!recipe) return { title: 'Rezept nicht gefunden' }
  return {
    title: `${recipe.de?.title} / ${recipe.fr?.title} — Gourmondo`,
    description: recipe.de?.description,
    openGraph: {
      title: recipe.de?.title,
      description: recipe.de?.description,
      images: recipe.photo ? [{ url: recipe.photo, width: 800, height: 600 }] : [],
    },
  }
}

export default async function RecipePage({ params }) {
  const recipe = await getRecipe(params.id)
  if (!recipe) notFound()

  const de = recipe.de || {}
  const fr = recipe.fr || {}

  const schemaDE = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: de.title,
    description: de.description,
    image: recipe.photo ? [recipe.photo] : [],
    datePublished: recipe.publishedAt,
    prepTime: de.time ? `PT${de.time}M` : undefined,
    recipeYield: de.servings,
    recipeCategory: de.category,
    inLanguage: 'de',
    recipeIngredient: de.ingredients || [],
    recipeInstructions: (de.steps || []).map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: step,
    })),
    author: { '@type': 'Organization', name: 'Gourmondo' },
    publisher: {
      '@type': 'Organization',
      name: 'Gourmondo',
      url: 'https://recipes-flax-eight.vercel.app',
    },
  }

  const schemaFR = {
    ...schemaDE,
    name: fr.title,
    description: fr.description,
    inLanguage: 'fr',
    recipeIngredient: fr.ingredients || [],
    recipeInstructions: (fr.steps || []).map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: step,
    })),
  }

  const fmtDate = (d) =>
    new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d))

  const diffColor = (d) => {
    if (!d) return '#888'
    const s = d.toLowerCase()
    if (s === 'leicht' || s === 'facile') return '#6a994e'
    if (s === 'schwer' || s === 'difficile') return '#e63946'
    return '#c8952a'
  }

  return (
    <>
      {/* Schema.org structured data — both languages */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaDE) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFR) }}
      />

      <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#f5f3ee', minHeight: '100vh', color: '#1a1a1a' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          .back-btn{display:inline-flex;align-items:center;gap:8px;color:#6a5040;text-decoration:none;font-size:14px;font-weight:500;padding:8px 0;transition:color .2s}
          .back-btn:hover{color:#1a1a1a}
          .stat-chip{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.2);border-radius:100px;padding:6px 14px;font-size:13px;font-weight:500;color:#fff;backdrop-filter:blur(4px)}
          .ingredient-row{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f0ede8;font-size:15px;color:#333}
          .step-row{display:flex;gap:16px;margin-bottom:20px;align-items:flex-start}
          .lang-tab{cursor:pointer;border:none;background:none;padding:12px 24px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;transition:all .2s;border-bottom:3px solid transparent}
          .lang-tab.active{color:#1a1a1a;border-bottom-color:#1a1a1a}
          .lang-tab:not(.active){color:#999}
          ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#ccc;border-radius:2px}
        `}</style>

        {/* Header */}
        <header style={{ background: '#fff', borderBottom: '1px solid #ede9e3', padding: '0 32px', boxShadow: '0 2px 12px rgba(0,0,0,.04)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, justifyContent: 'space-between' }}>
            <a href="/" style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: '#1a1a1a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#2d6a4f,#40916c)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍽</div>
              Gourmondo
            </a>
            <a href="/" className="back-btn">← Alle Rezepte / Toutes les recettes</a>
          </div>
        </header>

        <main style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px 60px' }}>
          {/* Hero photo */}
          {recipe.photo && (
            <div style={{ margin: '0 -32px', height: 420, position: 'relative', overflow: 'hidden', background: '#e8e0d5' }}>
              <img
                src={recipe.photo}
                alt={de.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.1) 60%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
                  {de.category} / {fr.category}
                </div>
                <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 40, color: '#fff', lineHeight: 1.15, marginBottom: 16 }}>
                  {de.title}
                </h1>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: 'rgba(255,255,255,.7)', fontStyle: 'italic', marginBottom: 20 }}>
                  {fr.title}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {de.time && <span className="stat-chip">⏱ {de.time} Min.</span>}
                  {de.servings && <span className="stat-chip">👥 {de.servings} Port.</span>}
                  {de.difficulty && (
                    <span className="stat-chip" style={{ background: diffColor(de.difficulty) + 'cc' }}>
                      {de.difficulty} / {fr.difficulty}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div style={{ paddingTop: 40 }}>
            {/* Language tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #ede9e3', marginBottom: 36 }}>
              <button className="lang-tab active" id="tab-de" onClick={() => {
                document.getElementById('content-de').style.display = 'block'
                document.getElementById('content-fr').style.display = 'none'
                document.getElementById('tab-de').className = 'lang-tab active'
                document.getElementById('tab-fr').className = 'lang-tab'
              }}>
                🇩🇪 Deutsch
              </button>
              <button className="lang-tab" id="tab-fr" onClick={() => {
                document.getElementById('content-de').style.display = 'none'
                document.getElementById('content-fr').style.display = 'block'
                document.getElementById('tab-de').className = 'lang-tab'
                document.getElementById('tab-fr').className = 'lang-tab active'
              }}>
                🇫🇷 Français
              </button>
            </div>

            {/* German content */}
            <div id="content-de">
              <p style={{ fontSize: 17, color: '#555', lineHeight: 1.8, marginBottom: 40 }}>{de.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                {/* Ingredients */}
                <div>
                  <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, marginBottom: 20, color: '#1a1a1a' }}>Zutaten</h2>
                  <div>
                    {(de.ingredients || []).map((ing, i) => (
                      <div key={i} className="ingredient-row">
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2d6a4f', display: 'inline-block', flexShrink: 0 }} />
                        {ing}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tip */}
                <div>
                  {de.tip && (
                    <div style={{ background: '#fffbf0', border: '1px solid #f0e0a0', borderRadius: 16, padding: '24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#c8952a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>💡 Küchentipp</div>
                      <div style={{ fontSize: 15, color: '#5a4a1a', lineHeight: 1.7 }}>{de.tip}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Steps */}
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, marginTop: 40, marginBottom: 24, color: '#1a1a1a' }}>Zubereitung</h2>
              <div>
                {(de.steps || []).map((step, i) => (
                  <div key={i} className="step-row">
                    <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                    <span style={{ fontSize: 15, color: '#333', lineHeight: 1.75, paddingTop: 6 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* French content */}
            <div id="content-fr" style={{ display: 'none' }}>
              <p style={{ fontSize: 17, color: '#555', lineHeight: 1.8, marginBottom: 40 }}>{fr.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                <div>
                  <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, marginBottom: 20, color: '#1a1a1a' }}>Ingrédients</h2>
                  <div>
                    {(fr.ingredients || []).map((ing, i) => (
                      <div key={i} className="ingredient-row">
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2d6a4f', display: 'inline-block', flexShrink: 0 }} />
                        {ing}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  {fr.tip && (
                    <div style={{ background: '#fffbf0', border: '1px solid #f0e0a0', borderRadius: 16, padding: '24px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#c8952a', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>💡 Conseil du chef</div>
                      <div style={{ fontSize: 15, color: '#5a4a1a', lineHeight: 1.7 }}>{fr.tip}</div>
                    </div>
                  )}
                </div>
              </div>

              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, marginTop: 40, marginBottom: 24, color: '#1a1a1a' }}>Préparation</h2>
              <div>
                {(fr.steps || []).map((step, i) => (
                  <div key={i} className="step-row">
                    <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#1a1a1a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                    <span style={{ fontSize: 15, color: '#333', lineHeight: 1.75, paddingTop: 6 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer meta */}
            <div style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid #ede9e3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ fontSize: 13, color: '#aaa' }}>
                Veröffentlicht / Publié: {fmtDate(recipe.publishedAt)}
              </div>
              <a href="/" style={{ fontSize: 13, color: '#2d6a4f', textDecoration: 'none', fontWeight: 600 }}>
                ← Zurück zum Katalog / Retour au catalogue
              </a>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
