'use client'
import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'

const UI = {
  de: {
    siteName: 'Gourmondo',
    tagline: 'Rezepte entdecken',
    searchPlaceholder: 'Rezept suchen...',
    allCat: 'Alle Rezepte',
    categories: ['Frühstück','Suppen','Salate','Hauptgerichte','Backen','Desserts','Getränke','Vorspeisen'],
    catIcons: ['☀️','🍲','🥗','🍽️','🥐','🍮','🥂','🫙'],
    autoPublish: 'Autopublizierung starten',
    stop: 'Stopp',
    panel: 'Steuerung',
    hidePanel: 'Ausblenden',
    recipes: 'Rezepte',
    publishOne: 'Ein Rezept hinzufügen',
    loading: 'Wird geladen...',
    waiting: 'Bereit',
    active: 'Aktiv',
    management: 'Steuerung',
    logEmpty: 'Starten Sie die Autopublizierung.',
    noRecipes: 'Noch keine Rezepte',
    noRecipesHint: 'Starten Sie die Autopublizierung, um Rezepte zu entdecken',
    noResults: 'Keine Ergebnisse',
    noResultsHint: 'Versuchen Sie einen anderen Suchbegriff',
    ingredients: 'Zutaten',
    preparation: 'Zubereitung',
    chefTip: 'Küchentipp',
    publishedLabel: 'Veröffentlicht:',
    min: 'Min.',
    portions: 'Port.',
    locale: 'de-DE',
    difficulty: { Leicht: 'Leicht', Mittel: 'Mittel', Schwer: 'Schwer' },
  },
  fr: {
    siteName: 'Gourmondo',
    tagline: 'Découvrir des recettes',
    searchPlaceholder: 'Rechercher une recette...',
    allCat: 'Toutes les recettes',
    categories: ['Petit-déjeuner','Soupes','Salades','Plats principaux','Pâtisserie','Desserts','Boissons','Entrées'],
    catIcons: ['☀️','🍲','🥗','🍽️','🥐','🍮','🥂','🫙'],
    autoPublish: 'Démarrer l\'autopublication',
    stop: 'Arrêter',
    panel: 'Panneau',
    hidePanel: 'Masquer',
    recipes: 'recettes',
    publishOne: 'Ajouter une recette',
    loading: 'Chargement...',
    waiting: 'Prêt',
    active: 'Actif',
    management: 'Gestion',
    logEmpty: "Démarrez l'autopublication.",
    noRecipes: 'Pas encore de recettes',
    noRecipesHint: "Démarrez l'autopublication pour découvrir des recettes",
    noResults: 'Aucun résultat',
    noResultsHint: 'Essayez un autre terme de recherche',
    ingredients: 'Ingrédients',
    preparation: 'Préparation',
    chefTip: 'Conseil du chef',
    publishedLabel: 'Publié le :',
    min: 'min.',
    portions: 'pers.',
    locale: 'fr-FR',
    difficulty: { Leicht: 'Facile', Mittel: 'Moyen', Schwer: 'Difficile' },
  },
}

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
  { query: 'Croissants maison recipe', de: 'Backen', fr: 'Pâtisserie' },
  { query: 'Sauerbraten recipe', de: 'Hauptgerichte', fr: 'Plats principaux' },
  { query: 'Coq au vin recipe', de: 'Hauptgerichte', fr: 'Plats principaux' },
  { query: 'Eggs Benedict brunch recipe', de: 'Frühstück', fr: 'Petit-déjeuner' },
  { query: 'Caesar salad recipe', de: 'Salate', fr: 'Salades' },
]

// Food-themed gradient backgrounds (no real photos needed)
const CARD_THEMES = [
  { bg: 'linear-gradient(145deg, #f4a261 0%, #e76f51 100%)', text: '#fff' },
  { bg: 'linear-gradient(145deg, #457b9d 0%, #1d3557 100%)', text: '#fff' },
  { bg: 'linear-gradient(145deg, #6a994e 0%, #386641 100%)', text: '#fff' },
  { bg: 'linear-gradient(145deg, #e9c46a 0%, #f4a261 100%)', text: '#2d2d2d' },
  { bg: 'linear-gradient(145deg, #9c6644 0%, #7f4f24 100%)', text: '#fff' },
  { bg: 'linear-gradient(145deg, #b7b7a4 0%, #6b705c 100%)', text: '#fff' },
  { bg: 'linear-gradient(145deg, #e07a5f 0%, #c1440e 100%)', text: '#fff' },
  { bg: 'linear-gradient(145deg, #3d405b 0%, #202040 100%)', text: '#fff' },
  { bg: 'linear-gradient(145deg, #8ecae6 0%, #219ebc 100%)', text: '#fff' },
  { bg: 'linear-gradient(145deg, #a8dadc 0%, #457b9d 100%)', text: '#fff' },
]

const FOOD_EMOJIS = ['🥘','🍲','🥗','🍝','🍜','🥩','🍰','🥐','🫕','🍱','🥞','🍳','🥙','🫔','🥧']

const genTheme = (s) => { let h=0; for(let i=0;i<s.length;i++) h=s.charCodeAt(i)+((h<<5)-h); return CARD_THEMES[Math.abs(h)%CARD_THEMES.length] }
const genEmoji = (s) => { let h=0; for(let i=0;i<s.length;i++) h=s.charCodeAt(i)+((h<<5)-h); return FOOD_EMOJIS[Math.abs(h)%FOOD_EMOJIS.length] }
const fmtDate = (d, locale) => new Intl.DateTimeFormat(locale,{day:'numeric',month:'long'}).format(new Date(d))

export default function RecipeCatalog() {
  const [lang, setLang] = useState('de')
  const ui = UI[lang]

  const [recipes, setRecipes] = useState([])
  const [activeCat, setActiveCat] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [autoPublishing, setAutoPublishing] = useState(false)
  const [log, setLog] = useState([])
  const [status, setStatus] = useState('')
  const [showPanel, setShowPanel] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const intervalRef = useRef(null)
  const logRef = useRef(null)
  const [serverLoading, setServerLoading] = useState(true)

  // Load recipes from server on mount
  useEffect(() => {
    fetch('/api/recipes')
      .then(r => r.json())
      .then(data => { if (data.recipes?.length) setRecipes(data.recipes) })
      .catch(() => {})
      .finally(() => setServerLoading(false))
  }, [])

  const addLog = (msg, type='info') => {
    setLog(prev => [...prev.slice(-49), { msg, type, time: new Date().toLocaleTimeString(ui.locale) }])
    setTimeout(() => { if(logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight }, 50)
  }

  const switchLang = (l) => { setLang(l); setActiveCat('ALL'); setSearchQuery('') }
  const handleCategoryChange = (cat) => { setActiveCat(cat); setSearchQuery('') }
  const r = (recipe) => recipe?.[lang] || {}

  const callClaude = async (prompt, useSearch = false) => {
    const body = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: 'You are a multilingual culinary editor. You MUST respond with ONLY a valid JSON object. No markdown, no explanation, no text before or after the JSON. Start your response with { and end with }.',
      messages: [{ role: 'user', content: prompt }],
    }
    if (useSearch) body.tools = [{ type: 'web_search_20250305', name: 'web_search' }]
    const res = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return data.content?.filter(b => b.type === 'text').map(b => b.text).join('\n') || ''
  }

  const parseJSON = (text) => {
    try { return JSON.parse(text.trim()) } catch {}
    const stripped = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    try { return JSON.parse(stripped) } catch {}
    const match = stripped.match(/\{[\s\S]*\}/)
    if (match) { try { return JSON.parse(match[0]) } catch {} }
    return null
  }

  const publishOneRecipe = async () => {
    if (loading) return

    // Pick a topic not yet published — avoid duplicates
    const available = TOPICS.filter(t => !recipes.some(r =>
      r.de?.title?.toLowerCase().includes(t.query.split(' ')[0].toLowerCase()) ||
      r.fr?.title?.toLowerCase().includes(t.query.split(' ')[0].toLowerCase())
    ))

    if (available.length === 0) {
      addLog('✅ Alle Themen veröffentlicht / Tous les sujets publiés!', 'success')
      clearInterval(intervalRef.current)
      setAutoPublishing(false)
      setLoading(false)
      return
    }

    const topic = available[Math.floor(Math.random() * available.length)]
    setLoading(true)
    addLog(`🔍 ${topic.query}...`, 'search')
    setStatus(topic.query)
    try {
      const searchText = await callClaude(
        `Search the web for a recipe about: "${topic.query}". Return a brief summary with dish name, ingredients list, and cooking steps.`,
        true
      )
      addLog('✍️ Generiere bilinguale Version...', 'rewrite')
      const rawText = await callClaude(`
Based on this recipe:
${searchText.slice(0, 1500)}

Write a complete recipe in German and French. Return ONLY this JSON:
{"de":{"title":"Name auf Deutsch","description":"2-3 Sätze auf Deutsch","ingredients":["200g Butter","3 Eier","100ml Milch","2 TL Zucker"],"steps":["Schritt 1","Schritt 2","Schritt 3","Schritt 4"],"time":"45","servings":"4","difficulty":"Mittel","tip":"Tipp auf Deutsch","category":"${topic.de}"},"fr":{"title":"Nom en français","description":"2-3 phrases en français","ingredients":["200g de beurre","3 oeufs","100ml de lait","2 c. à c. de sucre"],"steps":["Étape 1","Étape 2","Étape 3","Étape 4"],"time":"45","servings":"4","difficulty":"Moyen","tip":"Conseil en français","category":"${topic.fr}"}}`, false)

      let data = parseJSON(rawText)
      if (!data?.de || !data?.fr) {
        data = {
          de: { title: topic.query, description: 'Ein klassisches Gericht mit reichem Geschmack.', ingredients: ['500g Hauptzutat','2 Zwiebeln','3 Knoblauchzehen','Salz und Pfeffer','2 EL Olivenöl'], steps: ['Zutaten vorbereiten.','Zwiebeln und Knoblauch hacken.','In Olivenöl anbraten.','Alles zusammen 20 Min. köcheln.','Abschmecken und servieren.'], time: '40', servings: '4', difficulty: 'Mittel', tip: 'Frische Zutaten verwenden.', category: topic.de },
          fr: { title: topic.query, description: 'Un plat classique avec une saveur riche.', ingredients: ['500g ingrédient principal','2 oignons','3 gousses d\'ail','Sel et poivre','2 c. à s. d\'huile d\'olive'], steps: ['Préparer les ingrédients.','Émincer oignons et ail.','Faire revenir dans l\'huile.','Laisser mijoter 20 min.','Assaisonner et servir.'], time: '40', servings: '4', difficulty: 'Moyen', tip: 'Utiliser des ingrédients frais.', category: topic.fr },
        }
      }
      if (!Array.isArray(data.de?.ingredients)) data.de.ingredients = ['Zutaten nach Rezept']
      if (!Array.isArray(data.de?.steps)) data.de.steps = ['Nach klassischer Methode zubereiten.']
      if (!Array.isArray(data.fr?.ingredients)) data.fr.ingredients = ['Ingrédients selon la recette']
      if (!Array.isArray(data.fr?.steps)) data.fr.steps = ['Préparer selon la méthode classique.']

      // Fetch food photo via our API route (Pexels)
      let photoUrl = ''
      try {
        const photoQuery = (data.de?.title || topic.query)
        const photoRes = await fetch(`/api/photo?q=${encodeURIComponent(photoQuery)}`)
        const photoData = await photoRes.json()
        photoUrl = photoData.url || ''
      } catch {
        photoUrl = ''
      }

      const newRecipe = {
        id: Date.now(),
        de: data.de, fr: data.fr,
        publishedAt: new Date().toISOString(),
        theme: genTheme(data.de?.title || topic.query),
        emoji: genEmoji(data.de?.title || topic.query),
        photo: photoUrl,
        views: Math.floor(Math.random() * 500) + 50,
        likes: Math.floor(Math.random() * 80) + 5,
      }
      setRecipes(prev => [newRecipe, ...prev])
      // Save to server
      fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe),
      }).catch(() => {})
      addLog(`✅ «${data.de?.title}» / «${data.fr?.title}»`, 'success')
      setStatus(`${data.de?.title}`)
    } catch (err) {
      addLog(`❌ ${err.message}`, 'error')
      setStatus('Fehler')
    } finally {
      setLoading(false)
    }
  }

  const toggleAuto = () => {
    if (autoPublishing) {
      clearInterval(intervalRef.current)
      setAutoPublishing(false)
      setStatus('')
      addLog('⏹ Gestoppt', 'info')
    } else {
      setAutoPublishing(true)
      setShowPanel(true)
      addLog('▶️ Gestartet — alle 40 Sek.', 'info')
      publishOneRecipe()
      intervalRef.current = setInterval(publishOneRecipe, 40000)
    }
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const allCats = UI[lang].categories
  const filtered = recipes.filter(recipe => {
    const rv = r(recipe)
    const matchCat = activeCat === 'ALL' || rv.category === activeCat
    const q = searchQuery.toLowerCase()
    return matchCat && (!q || rv.title?.toLowerCase().includes(q) || rv.description?.toLowerCase().includes(q))
  })

  const difficultyColor = (d) => {
    if (!d) return '#888'
    const s = d.toLowerCase()
    if (s === 'leicht' || s === 'facile') return '#6a994e'
    if (s === 'schwer' || s === 'difficile') return '#e63946'
    return '#e9c46a'
  }

  return (
    <div style={{ fontFamily:"'DM Sans', 'Helvetica Neue', sans-serif", background:'#f5f3ee', minHeight:'100vh', color:'#1a1a1a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .card {
          cursor:pointer;
          transition: transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .25s ease;
          border-radius: 20px;
          overflow: hidden;
        }
        .card:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 24px 60px rgba(0,0,0,.18) !important; }

        .catpill {
          cursor:pointer;
          border:none;
          transition: all .2s ease;
          white-space:nowrap;
          border-radius: 100px;
          padding: 8px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
        }
        .catpill:hover { transform: translateY(-1px); }

        .langbtn { cursor:pointer; border:none; transition:all .2s; }

        .log-info{color:#aaa} .log-search{color:#6baed6} .log-rewrite{color:#9e9ac8}
        .log-success{color:#74c476;font-weight:600} .log-error{color:#fb6a4a}

        .pulse{animation:pulse 1.6s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}

        @keyframes fadeInUp {
          from { opacity:0; transform: translateY(20px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .card-appear { animation: fadeInUp .4s ease forwards; }

        .overlay{
          position:fixed;inset:0;
          background:rgba(15,12,8,.7);
          z-index:200;
          display:flex;align-items:center;justify-content:center;
          padding:20px;
          backdrop-filter: blur(8px);
        }
        .modal{
          background:#fff;
          border-radius:24px;
          max-width:680px;width:100%;
          max-height:90vh;overflow-y:auto;
          box-shadow: 0 40px 100px rgba(0,0,0,.3);
        }
        .modal-hero {
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px 24px 0 0;
          position: relative;
        }
        .modal-emoji { font-size: 80px; filter: drop-shadow(0 4px 12px rgba(0,0,0,.2)); }

        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#ccc;border-radius:2px}

        .search-wrap {
          position: relative;
          transition: all .2s;
        }
        .search-input {
          width: 100%;
          padding: 14px 20px 14px 48px;
          border-radius: 14px;
          border: 2px solid transparent;
          background: #fff;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          color: #1a1a1a;
          transition: all .2s;
          box-shadow: 0 2px 12px rgba(0,0,0,.06);
        }
        .search-input:focus {
          outline: none;
          border-color: #2d6a4f;
          box-shadow: 0 4px 20px rgba(45,106,79,.15);
        }
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          font-size: 18px;
          pointer-events: none;
        }

        .stat-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,.18);
          border-radius: 100px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(255,255,255,.95);
          backdrop-filter: blur(4px);
        }

        .ingredient-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #f0ede8;
          font-size: 14px;
          color: #333;
        }
        .ingredient-dot {
          width: 6px;height:6px;
          border-radius:50%;
          flex-shrink:0;
        }
        .step-row {
          display: flex;
          gap: 16px;
          margin-bottom: 18px;
          align-items: flex-start;
        }
        .step-num {
          width: 30px;height:30px;
          border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          font-size:13px;font-weight:600;
          flex-shrink:0;
          margin-top:1px;
          color:#fff;
        }

        .pub-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          border: none;
          transition: all .2s;
        }
        .pub-btn:hover { transform: translateY(-1px); filter: brightness(1.08); }
        .pub-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

        .other-lang-block {
          background: #f8f6f2;
          border-radius: 16px;
          padding: 20px 24px;
          margin-top: 8px;
        }
      `}</style>

      {/* ── HEADER ── */}
      <Header
        lang={lang}
        onLangChange={switchLang}
        onSearch={setSearchQuery}
        onCategoryChange={handleCategoryChange}
        activeCategory={activeCat}
      />

      {/* ── PUBLISH PANEL ── */}
      {showPanel && (
        <div style={{ background:'#1a1a1a', color:'#f0ede8', padding:'16px 32px' }}>
          <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', gap:24, flexWrap:'wrap', alignItems:'center' }}>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ fontSize:11, color:'#666', marginBottom:4, textTransform:'uppercase', letterSpacing:2 }}>
                {autoPublishing && <span className="pulse" style={{ marginRight:6, color:'#74c476' }}>●</span>}
                {autoPublishing ? ui.active : ui.management}
              </div>
              <div style={{ fontSize:13, color:'#ccc', minHeight:18 }}>{status || ui.waiting}</div>
            </div>
            <button className="pub-btn" onClick={publishOneRecipe} disabled={loading || autoPublishing}
              style={{ background:'#2d2d2d', color:'#f0ede8', border:'1px solid #333' }}>
              {loading ? ui.loading : `🇩🇪+🇫🇷 ${ui.publishOne}`}
            </button>
            <div ref={logRef} style={{ flex:2, minWidth:260, maxHeight:80, overflowY:'auto', background:'#111', borderRadius:10, padding:'10px 14px', fontFamily:'monospace', fontSize:11 }}>
              {log.length===0
                ? <div className="log-info">{ui.logEmpty}</div>
                : log.map((l,i) => <div key={i} className={`log-${l.type}`}><span style={{ color:'#555', marginRight:8 }}>{l.time}</span>{l.msg}</div>)}
            </div>
          </div>
        </div>
      )}

      {/* ── HERO + CATEGORIES ── */}
      <div style={{ background:'#faf8f5', borderBottom:'1px solid #f0ede8', padding:'32px 32px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:38, lineHeight:1.15, letterSpacing:'-0.5px', color:'#1a1a1a', marginBottom:6 }}>{ui.tagline}</h1>
          {recipes.length > 0 && <p style={{ fontSize:14, color:'#aaa', fontFamily:"'DM Sans',sans-serif" }}>{filtered.length} {ui.recipes}</p>}
        </div>
      </div>

      {/* ── GRID ── */}
      <main style={{ maxWidth:1280, margin:'0 auto', padding:'36px 32px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'100px 20px' }}>
            <div style={{ fontSize:80, marginBottom:20 }}>🍳</div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, marginBottom:12, color:'#1a1a1a' }}>
              {recipes.length===0 ? ui.noRecipes : ui.noResults}
            </h2>
            <p style={{ fontSize:15, color:'#999' }}>
              {recipes.length===0 ? ui.noRecipesHint : ui.noResultsHint}
            </p>
            {recipes.length === 0 && (
              <button className="pub-btn" onClick={toggleAuto}
                style={{ background:'#2d6a4f', color:'#fff', margin:'24px auto 0', boxShadow:'0 4px 16px rgba(45,106,79,.3)' }}>
                ▶ {ui.autoPublish}
              </button>
            )}
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:24 }}>
            {filtered.map((recipe, idx) => {
              const rv = r(recipe)
              const theme = recipe.theme
              return (
                <div key={recipe.id} className="card card-appear" onClick={() => setSelected(recipe)}
                  style={{ boxShadow:'0 4px 20px rgba(0,0,0,.08)', animationDelay:`${idx * 0.05}s` }}>
                  {/* Card image area */}
                  <div style={{ height:220, position:'relative', overflow:'hidden', background:'#e8e0d5', flexShrink:0 }}>
                    <img
                      src={recipe.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'}
                      alt={rv.title}
                      style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'transform .5s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform='scale(1.07)'}
                      onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                      loading="lazy"
                    />
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.6) 0%, rgba(0,0,0,.05) 55%, transparent 100%)' }} />
                    {/* Top badges */}
                    <div style={{ position:'absolute', top:14, left:14, right:14, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <span style={{ background:'rgba(255,255,255,.93)', backdropFilter:'blur(8px)', color:'#1a1a1a', padding:'4px 12px', borderRadius:100, fontSize:11, fontWeight:700 }}>
                        {rv.category}
                      </span>
                      <div style={{ display:'flex', gap:4 }}>
                        <span style={{ fontSize:10, color:'#fff', background:'rgba(0,0,0,.4)', borderRadius:4, padding:'3px 7px', fontWeight:700, backdropFilter:'blur(4px)' }}>DE</span>
                        <span style={{ fontSize:10, color:'#fff', background:'rgba(0,0,0,.4)', borderRadius:4, padding:'3px 7px', fontWeight:700, backdropFilter:'blur(4px)' }}>FR</span>
                      </div>
                    </div>
                    {/* Bottom stats */}
                    <div style={{ position:'absolute', bottom:14, left:14, display:'flex', gap:8 }}>
                      {rv.time && <span className="stat-chip">⏱ {rv.time} {ui.min}</span>}
                      {rv.servings && <span className="stat-chip">👥 {rv.servings} {ui.portions}</span>}
                    </div>
                  </div>

                  {/* Card body */}
                  <div style={{ background:'#fff', padding:'18px 20px 20px' }}>
                    <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:19, lineHeight:1.3, marginBottom:6, color:'#1a1a1a' }}>
                      {rv.title}
                    </h3>
                    <div style={{ fontSize:12, color:'#bbb', fontStyle:'italic', marginBottom:10 }}>
                      {lang==='de' ? recipe.fr?.title : recipe.de?.title}
                    </div>
                    <p style={{ fontSize:13, color:'#777', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', marginBottom:14 }}>
                      {rv.description}
                    </p>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                      <span style={{ fontSize:12, fontWeight:600, color: difficultyColor(rv.difficulty) }}>
                        {rv.difficulty}
                      </span>
                      <span style={{ fontSize:11, color:'#ccc' }}>{fmtDate(recipe.publishedAt, ui.locale)}</span>
                    </div>
                    <a
                      href={`/recipe/${recipe.id}`}
                      onClick={e => e.stopPropagation()}
                      style={{ display:'block', textAlign:'center', padding:'8px', borderRadius:8, background:'#f5f3ee', fontSize:12, fontWeight:600, color:'#2d6a4f', textDecoration:'none', transition:'background .2s' }}
                      onMouseEnter={e => e.currentTarget.style.background='#e8f5ee'}
                      onMouseLeave={e => e.currentTarget.style.background='#f5f3ee'}
                    >
                      {lang === 'de' ? 'Rezept öffnen →' : 'Voir la recette →'}
                    </a>
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
        const theme = selected.theme
        return (
          <div className="overlay" onClick={() => setSelected(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              {/* Hero photo */}
              <div style={{ height:300, borderRadius:'24px 24px 0 0', position:'relative', overflow:'hidden', background:'#e8e0d5' }}>
                <img
                  src={selected.photo || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop'}
                  alt={rv.title}
                  style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.1) 60%, transparent 100%)' }} />
                <button onClick={() => setSelected(null)}
                  style={{ position:'absolute', top:16, right:16, width:38, height:38, borderRadius:'50%', background:'rgba(0,0,0,.35)', border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>✕</button>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'24px 28px' }}>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:700, textTransform:'uppercase', letterSpacing:2, marginBottom:6 }}>{rv.category}</div>
                  <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:'#fff', lineHeight:1.2, marginBottom:10 }}>{rv.title}</h2>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {rv.time && <span className="stat-chip">⏱ {rv.time} {ui.min}</span>}
                    {rv.servings && <span className="stat-chip">👥 {rv.servings} {ui.portions}</span>}
                    {rv.difficulty && <span className="stat-chip">{rv.difficulty}</span>}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding:'24px 32px 36px' }}>
                <div style={{ fontSize:13, color:'#bbb', fontStyle:'italic', marginBottom:14 }}>
                  {lang==='de'?'🇫🇷':'🇩🇪'} {otherV?.title}
                </div>
                <p style={{ fontSize:15, color:'#555', lineHeight:1.75, marginBottom:28 }}>{rv.description}</p>

                {/* Ingredients */}
                <h4 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, marginBottom:14, color:'#1a1a1a' }}>{ui.ingredients}</h4>
                <div style={{ marginBottom:28 }}>
                  {(rv.ingredients||[]).map((ing,i) => (
                    <div key={i} className="ingredient-row">
                      <span className="ingredient-dot" style={{ background: '#2d6a4f' }} />
                      {ing}
                    </div>
                  ))}
                </div>

                {/* Steps */}
                <h4 style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, marginBottom:16, color:'#1a1a1a' }}>{ui.preparation}</h4>
                <div style={{ marginBottom:24 }}>
                  {(rv.steps||[]).map((step,i) => (
                    <div key={i} className="step-row">
                      <span className="step-num" style={{ background:'#1a1a1a', fontSize:12 }}>{i+1}</span>
                      <span style={{ fontSize:14, color:'#444', lineHeight:1.7, paddingTop:5 }}>{step}</span>
                    </div>
                  ))}
                </div>

                {/* Tip */}
                {rv.tip && (
                  <div style={{ background:'#fffbf0', border:'1px solid #f0e0a0', borderRadius:16, padding:'16px 20px', marginBottom:20 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#c8952a', marginBottom:6, textTransform:'uppercase', letterSpacing:1 }}>💡 {ui.chefTip}</div>
                    <div style={{ fontSize:14, color:'#5a4a1a', lineHeight:1.7 }}>{rv.tip}</div>
                  </div>
                )}

                {/* Other language */}
                {otherV && (
                  <div className="other-lang-block">
                    <div style={{ fontSize:11, fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:1.5, marginBottom:10 }}>
                      {lang==='de'?'🇫🇷 En français':'🇩🇪 Auf Deutsch'}
                    </div>
                    <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:17, color:'#1a1a1a', marginBottom:6 }}>{otherV.title}</div>
                    <div style={{ fontSize:13, color:'#777', lineHeight:1.6 }}>{otherV.description}</div>
                  </div>
                )}

                <div style={{ marginTop:20, fontSize:11, color:'#ccc', textAlign:'right' }}>
                  {ui.publishedLabel} {fmtDate(selected.publishedAt, ui.locale)}
                </div>
              </div>
            </div>
          </div>
        )
      })()}
    <Footer lang={lang} />
      <Footer lang={lang} />
    </div>
  )
}
