'use client'
import { useState, useEffect, useRef } from 'react'

// ─── UI TRANSLATIONS (interface only) ────────────────────────────────────────
const UI = {
  de: {
    siteName: 'GourmetWelt',
    tagline: 'Kulinarischer Rezeptkatalog',
    searchPlaceholder: 'Rezept suchen...',
    allCat: 'Alle',
    categories: ['Frühstück','Suppen','Salate','Hauptgerichte','Backen','Desserts','Getränke','Vorspeisen'],
    autoPublish: '▶ Autopublizierung',
    stop: '⏹ Stopp',
    panel: '⚙ Steuerung',
    hidePanel: 'Ausblenden',
    recipes: 'Rezepte',
    publishOne: '+ Ein Rezept',
    loading: '⏳ Lädt...',
    waiting: 'Warten...',
    active: 'Aktiv',
    management: 'Steuerung',
    logEmpty: 'Log leer. Starten Sie die Autopublizierung.',
    noRecipes: 'Noch keine Rezepte',
    noRecipesHint: 'Klicken Sie auf «Autopublizierung»',
    noResults: 'Nichts gefunden',
    noResultsHint: 'Versuchen Sie eine andere Suchanfrage',
    ingredients: 'Zutaten',
    preparation: 'Zubereitung',
    chefTip: '💡 Küchentipp',
    publishedLabel: 'Veröffentlicht:',
    locale: 'de-DE',
  },
  fr: {
    siteName: 'GourmetMonde',
    tagline: 'Catalogue de recettes culinaires',
    searchPlaceholder: 'Rechercher une recette...',
    allCat: 'Tout',
    categories: ['Petit-déjeuner','Soupes','Salades','Plats principaux','Pâtisserie','Desserts','Boissons','Entrées'],
    autoPublish: '▶ Autopublication',
    stop: '⏹ Arrêter',
    panel: '⚙ Panneau',
    hidePanel: 'Masquer',
    recipes: 'recettes',
    publishOne: '+ Une recette',
    loading: '⏳ Chargement...',
    waiting: 'En attente...',
    active: 'Actif',
    management: 'Gestion',
    logEmpty: "Journal vide. Démarrez l'autopublication.",
    noRecipes: 'Pas encore de recettes',
    noRecipesHint: "Cliquez sur «Autopublication»",
    noResults: 'Rien trouvé',
    noResultsHint: 'Essayez une autre recherche',
    ingredients: 'Ingrédients',
    preparation: 'Préparation',
    chefTip: '💡 Conseil du chef',
    publishedLabel: 'Publié le :',
    locale: 'fr-FR',
  },
}

// Category mapping DE → FR
const CAT_MAP = {
  'Frühstück': 'Petit-déjeuner', 'Suppen': 'Soupes', 'Salate': 'Salades',
  'Hauptgerichte': 'Plats principaux', 'Backen': 'Pâtisserie', 'Desserts': 'Desserts',
  'Getränke': 'Boissons', 'Vorspeisen': 'Entrées',
}
const CAT_MAP_FR = Object.fromEntries(Object.entries(CAT_MAP).map(([k,v]) => [v,k]))

const TOPICS = [
  { query: 'French onion soup recipe', de: 'Suppen', fr: 'Soupes' },
  { query: 'Wiener Schnitzel recipe', de: 'Hauptgerichte', fr: 'Plats principaux' },
  { query: 'Tiramisu dessert recipe', de: 'Desserts', fr: 'Desserts' },
  { query: 'Beef bourguignon recipe', de: 'Hauptgerichte', fr: 'Plats principaux' },
  { query: 'Apple strudel recipe', de: 'Backen', fr: 'Pâtisserie' },
  { query: 'Crème brûlée recipe', de: 'Desserts', fr: 'Desserts' },
  { query: 'Salade niçoise recipe', de: 'Salate', fr: 'Salades' },
  { query: 'Kartoffelsuppe recipe', de: 'Suppen', fr: 'Soupes' },
  { query: 'Quiche Lorraine recipe', de: 'Backen', fr: 'Pâtisserie' },
  { query: 'Ratatouille recipe', de: 'Hauptgerichte', fr: 'Plats principaux' },
  { query: 'Schwarzwälder Kirschtorte recipe', de: 'Desserts', fr: 'Desserts' },
  { query: 'Bouillabaisse recipe', de: 'Suppen', fr: 'Soupes' },
  { query: 'Flammkuchen Tarte flambée recipe', de: 'Vorspeisen', fr: 'Entrées' },
  { query: 'Mousse au chocolat recipe', de: 'Desserts', fr: 'Desserts' },
  { query: 'Käsespätzle recipe', de: 'Hauptgerichte', fr: 'Plats principaux' },
  { query: 'Croissants recipe', de: 'Backen', fr: 'Pâtisserie' },
  { query: 'Sauerbraten recipe', de: 'Hauptgerichte', fr: 'Plats principaux' },
  { query: 'Coq au vin recipe', de: 'Hauptgerichte', fr: 'Plats principaux' },
]

const COLORS = ['#c0392b','#e67e22','#27ae60','#2980b9','#8e44ad','#16a085','#d35400','#34495e']
const genColor = (s) => { let h=0; for(let i=0;i<s.length;i++) h=s.charCodeAt(i)+((h<<5)-h); return COLORS[Math.abs(h)%COLORS.length] }
const fmtDate = (d, locale) => new Intl.DateTimeFormat(locale,{day:'numeric',month:'long',year:'numeric'}).format(new Date(d))

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function RecipeCatalog() {
  const [lang, setLang] = useState('de')
  const ui = UI[lang]

  const [recipes, setRecipes] = useState([])       // each recipe has .de and .fr fields
  const [activeCat, setActiveCat] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [autoPublishing, setAutoPublishing] = useState(false)
  const [log, setLog] = useState([])
  const [status, setStatus] = useState('')
  const [showPanel, setShowPanel] = useState(false)
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef(null)
  const logRef = useRef(null)

  const addLog = (msg, type='info') => {
    setLog(prev => [...prev.slice(-49), { msg, type, time: new Date().toLocaleTimeString(ui.locale) }])
    setTimeout(() => { if(logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight }, 50)
  }

  const switchLang = (l) => { setLang(l); setActiveCat('ALL'); setSearchQuery('') }

  // Current language version of a recipe
  const r = (recipe) => recipe?.[lang] || {}

  // Category label for current language
  const catLabel = (recipe) => lang === 'de' ? recipe.de?.category : recipe.fr?.category

  const callClaude = async (prompt) => {
    const res = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: 'Du bist ein mehrsprachiger Kochredakteur. Antworte NUR mit gültigem JSON ohne Markdown.',
        messages: [{ role: 'user', content: prompt }],
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      }),
    })
    const data = await res.json()
    return data.content?.filter(b => b.type==='text').map(b => b.text).join('\n') || ''
  }

  const publishOneRecipe = async () => {
    if (loading) return
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)]
    setLoading(true)
    addLog(`🔍 Suche / Recherche: «${topic.query}»...`, 'search')
    setStatus(topic.query)

    try {
      const rawText = await callClaude(`
Search the web for a recipe about: "${topic.query}".
Then write a unique rewritten version of this recipe in BOTH German AND French.

Return ONLY this JSON object (no markdown, no explanation):
{
  "de": {
    "title": "Dish name in German",
    "description": "Appetizing description in German (2-3 sentences)",
    "ingredients": ["ingredient with amount in German"],
    "steps": ["Step 1 in German", "Step 2 in German"],
    "time": "Preparation time in German (e.g. 45 Minuten)",
    "servings": "Servings in German (e.g. 4 Portionen)",
    "difficulty": "Leicht or Mittel or Schwer",
    "tip": "Chef tip in German",
    "category": "${topic.de}"
  },
  "fr": {
    "title": "Dish name in French",
    "description": "Appetizing description in French (2-3 sentences)",
    "ingredients": ["ingredient with amount in French"],
    "steps": ["Étape 1 en français", "Étape 2 en français"],
    "time": "Temps de préparation en français (e.g. 45 minutes)",
    "servings": "Portions en français (e.g. 4 portions)",
    "difficulty": "Facile or Moyen or Difficile",
    "tip": "Conseil du chef en français",
    "category": "${topic.fr}"
  }
}`)

      addLog('✍️ Übersetze / Traduction...', 'rewrite')

      let data
      try {
        const clean = rawText.replace(/```json|```/g, '').trim()
        const match = clean.match(/\{[\s\S]*\}/)
        data = JSON.parse(match ? match[0] : clean)
      } catch {
        data = {
          de: { title: topic.query, description: 'Ein klassisches Gericht.', ingredients: ['Zutaten'], steps: ['Zubereiten.'], time: '40 Minuten', servings: '4 Portionen', difficulty: 'Mittel', tip: 'Frische Zutaten.', category: topic.de },
          fr: { title: topic.query, description: 'Un plat classique.', ingredients: ['Ingrédients'], steps: ['Préparer.'], time: '40 minutes', servings: '4 portions', difficulty: 'Moyen', tip: 'Ingrédients frais.', category: topic.fr },
        }
      }

      const newRecipe = {
        id: Date.now(),
        de: data.de,
        fr: data.fr,
        publishedAt: new Date().toISOString(),
        color: genColor(data.de?.title || topic.query),
        views: Math.floor(Math.random() * 200) + 10,
        likes: Math.floor(Math.random() * 50) + 1,
      }

      setRecipes(prev => [newRecipe, ...prev])
      addLog(`✅ DE: «${data.de?.title}» | FR: «${data.fr?.title}»`, 'success')
      setStatus(`${data.de?.title} / ${data.fr?.title}`)
    } catch (err) {
      addLog(`❌ Fehler / Erreur: ${err.message}`, 'error')
      setStatus('Fehler / Erreur')
    } finally {
      setLoading(false)
    }
  }

  const toggleAuto = () => {
    if (autoPublishing) {
      clearInterval(intervalRef.current)
      setAutoPublishing(false)
      setStatus('Gestoppt / Arrêtée')
      addLog('⏹ Gestoppt / Arrêtée', 'info')
    } else {
      setAutoPublishing(true)
      setShowPanel(true)
      addLog('▶️ Gestartet / Démarrée (alle 40 Sek.)', 'info')
      publishOneRecipe()
      intervalRef.current = setInterval(publishOneRecipe, 40000)
    }
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  // Filter using current language data
  const allCats = UI[lang].categories
  const filtered = recipes.filter(recipe => {
    const rv = r(recipe)
    const matchCat = activeCat === 'ALL' || rv.category === activeCat
    const q = searchQuery.toLowerCase()
    return matchCat && (!q || rv.title?.toLowerCase().includes(q) || rv.description?.toLowerCase().includes(q))
  })

  return (
    <div style={{ fontFamily:"'Georgia',serif", background:'#f8f5f0', minHeight:'100vh', color:'#1e140a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Sans+3:wght@300;400;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        .card{transition:transform .22s cubic-bezier(.4,0,.2,1),box-shadow .22s;cursor:pointer}
        .card:hover{transform:translateY(-5px);box-shadow:0 18px 52px rgba(0,0,0,.14)!important}
        .btn{cursor:pointer;border:none;transition:all .18s}
        .btn:hover{filter:brightness(1.12)}
        .catbtn{cursor:pointer;background:none;border:none;white-space:nowrap;transition:all .18s}
        .langbtn{cursor:pointer;transition:all .2s}
        .log-info{color:#888} .log-search{color:#2980b9} .log-rewrite{color:#8e44ad}
        .log-success{color:#27ae60;font-weight:600} .log-error{color:#c0392b}
        .pulse{animation:pulse 1.4s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)}
        .modal{background:#fff;border-radius:16px;max-width:740px;width:100%;max-height:92vh;overflow-y:auto}
        ::-webkit-scrollbar{width:5px} ::-webkit-scrollbar-thumb{background:#c0392b;border-radius:3px}
        input:focus{outline:2px solid #c0392b;outline-offset:1px}
        .lang-badge{display:inline-block;padding:2px 8px;border-radius:8px;font-size:10px;font-family:'Source Sans 3',sans-serif;font-weight:700;letter-spacing:.5px}
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ background:'linear-gradient(135deg,#1a0c06 0%,#2d1508 100%)', color:'#fff', padding:'0 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'22px 0 18px', flexWrap:'wrap', gap:14 }}>
            <div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:900, color:'#f0d5a8', letterSpacing:-0.5 }}>
                🍽 {ui.siteName}
              </div>
              <div style={{ fontSize:11, color:'#b89060', letterSpacing:3.5, textTransform:'uppercase', fontFamily:"'Source Sans 3',sans-serif", marginTop:2 }}>
                {ui.tagline}
              </div>
            </div>

            <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
              {/* Language switcher */}
              <div style={{ display:'flex', background:'#ffffff18', borderRadius:10, overflow:'hidden', border:'1px solid #ffffff25' }}>
                {['de','fr'].map(l => (
                  <button key={l} className="langbtn" onClick={() => switchLang(l)}
                    style={{ padding:'9px 20px', fontFamily:"'Source Sans 3',sans-serif", fontWeight:700, fontSize:13, border:'none', cursor:'pointer', letterSpacing:1, background:lang===l?'#c0392b':'transparent', color:lang===l?'#fff':'#d4b896', textTransform:'uppercase' }}>
                    {l==='de'?'🇩🇪 DE':'🇫🇷 FR'}
                  </button>
                ))}
              </div>

              {recipes.length > 0 && (
                <div style={{ background:'#27ae6088', color:'#fff', padding:'7px 14px', borderRadius:20, fontSize:13, fontFamily:"'Source Sans 3',sans-serif", border:'1px solid #27ae6055' }}>
                  📚 {recipes.length} {ui.recipes}
                </div>
              )}
              <button className="btn" onClick={() => setShowPanel(!showPanel)}
                style={{ background:'#ffffff15', color:'#f0d5a8', padding:'8px 16px', borderRadius:8, fontFamily:"'Source Sans 3',sans-serif", fontSize:13, border:'1px solid #ffffff25' }}>
                {showPanel ? ui.hidePanel : ui.panel}
              </button>
              <button className="btn" onClick={toggleAuto}
                style={{ background:autoPublishing?'#c0392b':'#27ae60', color:'#fff', padding:'9px 22px', borderRadius:8, fontFamily:"'Source Sans 3',sans-serif", fontWeight:700, fontSize:14 }}>
                {autoPublishing ? ui.stop : ui.autoPublish}
              </button>
            </div>
          </div>

          {/* Search */}
          <div style={{ paddingBottom:22 }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={ui.searchPlaceholder}
              style={{ width:'100%', padding:'13px 22px', borderRadius:10, border:'none', background:'#ffffff12', color:'#f0d5a8', fontSize:15, fontFamily:"'Source Sans 3',sans-serif" }} />
          </div>
        </div>
      </header>

      {/* ── PUBLISH PANEL ── */}
      {showPanel && (
        <div style={{ background:'#130a04', color:'#f0d5a8', padding:'16px 24px', borderBottom:'1px solid #2a1408' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', gap:20, flexWrap:'wrap', alignItems:'flex-start' }}>
            <div style={{ flex:1, minWidth:220 }}>
              <div style={{ fontSize:11, color:'#9a7050', marginBottom:8, fontFamily:"'Source Sans 3',sans-serif", textTransform:'uppercase', letterSpacing:2 }}>
                {autoPublishing && <span className="pulse" style={{ marginRight:6 }}>●</span>}
                {autoPublishing ? ui.active : ui.management}
              </div>
              <div style={{ fontSize:12, color:'#c8a070', fontFamily:"'Source Sans 3',sans-serif", marginBottom:12, minHeight:16, lineHeight:1.5 }}>{status || ui.waiting}</div>
              <button className="btn" onClick={publishOneRecipe} disabled={loading || autoPublishing}
                style={{ background:'#c0392b', color:'#fff', padding:'7px 16px', borderRadius:6, fontSize:12, fontFamily:"'Source Sans 3',sans-serif", opacity:(loading||autoPublishing)?.45:1 }}>
                {loading ? ui.loading : `🇩🇪+🇫🇷 ${ui.publishOne}`}
              </button>
            </div>
            <div ref={logRef} style={{ flex:2, minWidth:280, maxHeight:120, overflowY:'auto', background:'#0a0502', borderRadius:8, padding:'10px 14px', fontFamily:'monospace', fontSize:12 }}>
              {log.length===0
                ? <div className="log-info">{ui.logEmpty}</div>
                : log.map((l,i) => <div key={i} className={`log-${l.type}`}><span style={{ color:'#444', marginRight:8 }}>{l.time}</span>{l.msg}</div>)}
            </div>
          </div>
        </div>
      )}

      {/* ── CATEGORIES ── */}
      <div style={{ background:'#fff', borderBottom:'2px solid #ede8e0', position:'sticky', top:0, zIndex:10, boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', display:'flex', overflowX:'auto' }}>
          <button className="catbtn" onClick={() => setActiveCat('ALL')}
            style={{ padding:'15px 18px', fontFamily:"'Source Sans 3',sans-serif", fontSize:13, color:activeCat==='ALL'?'#c0392b':'#6b5040', fontWeight:activeCat==='ALL'?700:400, borderBottom:`3px solid ${activeCat==='ALL'?'#c0392b':'transparent'}` }}>
            {ui.allCat}
          </button>
          {allCats.map(cat => (
            <button key={cat} className="catbtn" onClick={() => setActiveCat(cat)}
              style={{ padding:'15px 18px', fontFamily:"'Source Sans 3',sans-serif", fontSize:13, color:activeCat===cat?'#c0392b':'#6b5040', fontWeight:activeCat===cat?700:400, borderBottom:`3px solid ${activeCat===cat?'#c0392b':'transparent'}` }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── RECIPE GRID ── */}
      <main style={{ maxWidth:1200, margin:'0 auto', padding:'36px 24px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'90px 20px', color:'#a08060' }}>
            <div style={{ fontSize:72, marginBottom:20 }}>🍳</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:10, color:'#3a2010' }}>
              {recipes.length===0 ? ui.noRecipes : ui.noResults}
            </div>
            <div style={{ fontFamily:"'Source Sans 3',sans-serif", fontSize:15 }}>
              {recipes.length===0 ? ui.noRecipesHint : ui.noResultsHint}
            </div>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))', gap:26 }}>
            {filtered.map(recipe => {
              const rv = r(recipe)
              return (
                <div key={recipe.id} className="card" onClick={() => setSelected(recipe)}
                  style={{ background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 18px rgba(0,0,0,.07)' }}>
                  <div style={{ height:6, background:recipe.color }} />
                  <div style={{ padding:'22px 24px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                      <span style={{ background:recipe.color+'20', color:recipe.color, padding:'3px 11px', borderRadius:12, fontSize:11, fontFamily:"'Source Sans 3',sans-serif", fontWeight:700 }}>
                        {rv.category}
                      </span>
                      <div style={{ display:'flex', gap:4 }}>
                        <span className="lang-badge" style={{ background:'#2980b920', color:'#2980b9' }}>🇩🇪</span>
                        <span className="lang-badge" style={{ background:'#c0392b20', color:'#c0392b' }}>🇫🇷</span>
                      </div>
                    </div>
                    <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, marginBottom:8, lineHeight:1.3, color:'#1a0c06' }}>{rv.title}</h3>
                    {/* Show other language title as subtitle */}
                    <div style={{ fontSize:12, color:'#9a8060', fontFamily:"'Source Sans 3',sans-serif", marginBottom:10, fontStyle:'italic' }}>
                      {lang==='de' ? recipe.fr?.title : recipe.de?.title}
                    </div>
                    <p style={{ fontFamily:"'Source Sans 3',sans-serif", fontSize:13.5, color:'#6a5040', lineHeight:1.65, marginBottom:16, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {rv.description}
                    </p>
                    <div style={{ display:'flex', gap:14, fontSize:12, color:'#9a8060', fontFamily:"'Source Sans 3',sans-serif" }}>
                      <span>⏱ {rv.time}</span><span>👥 {rv.servings}</span>
                      <span>👁 {recipe.views}</span><span>❤️ {recipe.likes}</span>
                    </div>
                    <div style={{ marginTop:10, fontSize:11, color:'#baa888', fontFamily:"'Source Sans 3',sans-serif" }}>
                      {fmtDate(recipe.publishedAt, ui.locale)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* ── MODAL ── */}
      {selected && (() => {
        const rv = r(selected)
        const otherLang = lang === 'de' ? 'fr' : 'de'
        const otherV = selected[otherLang]
        return (
          <div className="overlay" onClick={() => setSelected(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div style={{ height:7, background:selected.color, borderRadius:'16px 16px 0 0' }} />
              <div style={{ padding:'30px 34px 34px' }}>
                {/* Header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                  <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                    <span style={{ background:selected.color+'20', color:selected.color, padding:'4px 12px', borderRadius:12, fontSize:11, fontFamily:"'Source Sans 3',sans-serif", fontWeight:700 }}>
                      {rv.category}
                    </span>
                    <span style={{ fontSize:11, color:'#9a8060', fontFamily:"'Source Sans 3',sans-serif" }}>{rv.difficulty}</span>
                  </div>
                  <button className="btn" onClick={() => setSelected(null)}
                    style={{ background:'#f0ebe2', width:34, height:34, borderRadius:17, fontSize:18, color:'#6a5040', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
                </div>

                {/* Title + other lang title */}
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:900, marginBottom:6, color:'#1a0c06', lineHeight:1.2 }}>{rv.title}</h2>
                <div style={{ fontSize:14, color:'#9a8060', fontStyle:'italic', fontFamily:"'Playfair Display',serif", marginBottom:16 }}>
                  {lang==='de'?'🇫🇷':'🇩🇪'} {otherV?.title}
                </div>

                <p style={{ fontFamily:"'Source Sans 3',sans-serif", fontSize:15, color:'#6a5040', lineHeight:1.75, marginBottom:22 }}>{rv.description}</p>

                {/* Stats */}
                <div style={{ display:'flex', gap:24, marginBottom:26, padding:'16px 22px', background:'#faf6f0', borderRadius:12 }}>
                  {[['⏱', rv.time],['👥', rv.servings],['📊', rv.difficulty]].map(([ic,val]) => (
                    <div key={ic} style={{ textAlign:'center' }}>
                      <div style={{ fontSize:20 }}>{ic}</div>
                      <div style={{ fontSize:12, fontFamily:"'Source Sans 3',sans-serif", color:'#6a5040', marginTop:4 }}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Ingredients */}
                <h4 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:14, color:'#1a0c06' }}>{ui.ingredients}</h4>
                <ul style={{ listStyle:'none', marginBottom:26 }}>
                  {(rv.ingredients||[]).map((ing,i) => (
                    <li key={i} style={{ fontFamily:"'Source Sans 3',sans-serif", fontSize:14, color:'#3a2810', padding:'7px 0', borderBottom:'1px dashed #e8e0d0', display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ width:7, height:7, borderRadius:'50%', background:selected.color, display:'inline-block', flexShrink:0 }} />{ing}
                    </li>
                  ))}
                </ul>

                {/* Steps */}
                <h4 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:14, color:'#1a0c06' }}>{ui.preparation}</h4>
                <ol style={{ listStyle:'none', marginBottom:26 }}>
                  {(rv.steps||[]).map((step,i) => (
                    <li key={i} style={{ display:'flex', gap:14, fontFamily:"'Source Sans 3',sans-serif", fontSize:14, color:'#3a2810', lineHeight:1.65, marginBottom:14 }}>
                      <span style={{ background:selected.color, color:'#fff', width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0, marginTop:1 }}>{i+1}</span>
                      {step}
                    </li>
                  ))}
                </ol>

                {/* Tip */}
                {rv.tip && (
                  <div style={{ background:selected.color+'12', border:`1px solid ${selected.color}30`, borderRadius:12, padding:'16px 20px', marginBottom:20 }}>
                    <div style={{ fontFamily:"'Source Sans 3',sans-serif", fontSize:11, fontWeight:700, color:selected.color, marginBottom:6, textTransform:'uppercase', letterSpacing:1.5 }}>{ui.chefTip}</div>
                    <div style={{ fontFamily:"'Source Sans 3',sans-serif", fontSize:14, color:'#3a2810', lineHeight:1.7 }}>{rv.tip}</div>
                  </div>
                )}

                {/* Other language preview */}
                {otherV && (
                  <div style={{ background:'#f4f1ec', borderRadius:12, padding:'16px 20px' }}>
                    <div style={{ fontFamily:"'Source Sans 3',sans-serif", fontSize:11, fontWeight:700, color:'#9a8060', marginBottom:10, textTransform:'uppercase', letterSpacing:1.5 }}>
                      {lang==='de'?'🇫🇷 En français':'🇩🇪 Auf Deutsch'}
                    </div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700, color:'#3a2010', marginBottom:6 }}>{otherV.title}</div>
                    <div style={{ fontFamily:"'Source Sans 3',sans-serif", fontSize:13, color:'#6a5040', lineHeight:1.6 }}>{otherV.description}</div>
                  </div>
                )}

                <div style={{ marginTop:18, fontSize:12, color:'#baa888', fontFamily:"'Source Sans 3',sans-serif", textAlign:'right' }}>
                  {ui.publishedLabel} {fmtDate(selected.publishedAt, ui.locale)}
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
