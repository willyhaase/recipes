import { notFound } from 'next/navigation'
import RecipeContent from './RecipeContent'

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaDE) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFR) }} />

      <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: '#f5f3ee', minHeight: '100vh', color: '#1a1a1a' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#ccc;border-radius:2px}
        `}</style>

        {/* Header */}
        <header style={{ background: '#fff', borderBottom: '1px solid #ede9e3', padding: '0 32px', boxShadow: '0 2px 12px rgba(0,0,0,.04)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, justifyContent: 'space-between' }}>
            <a href="/" style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: '#1a1a1a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#2d6a4f,#40916c)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🍽</div>
              Gourmondo
            </a>
            <a href="/" style={{ display:'inline-flex', alignItems:'center', gap:8, color:'#6a5040', textDecoration:'none', fontSize:14, fontWeight:500 }}>
              ← Alle Rezepte / Toutes les recettes
            </a>
          </div>
        </header>

        <main style={{ maxWidth: 900, margin: '0 auto', padding: '0 32px 60px' }}>
          <RecipeContent de={de} fr={fr} photo={recipe.photo} />

          {/* Published date */}
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #ede9e3', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 13, color: '#aaa' }}>
              Veröffentlicht / Publié: {fmtDate(recipe.publishedAt)}
            </div>
            <a href="/" style={{ fontSize: 13, color: '#2d6a4f', textDecoration: 'none', fontWeight: 600 }}>
              ← Zurück zum Katalog / Retour au catalogue
            </a>
          </div>
        </main>
      </div>
    </>
  )
}
