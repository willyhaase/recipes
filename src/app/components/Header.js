'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const CATEGORIES_DE = ['Frühstück','Suppen','Salate','Hauptgerichte','Backen','Desserts','Getränke','Vorspeisen']
const CATEGORIES_FR = ['Petit-déjeuner','Soupes','Salades','Plats principaux','Pâtisserie','Desserts','Boissons','Entrées']
const CAT_ICONS =     ['☀️','🍲','🥗','🍽️','🥐','🍮','🥂','🫙']

export default function Header({ lang = 'de', onLangChange, onSearch, onCategoryChange, activeCategory }) {
  const [searchValue, setSearchValue] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef(null)
  const pathname = usePathname()
  const isRecipePage = pathname?.startsWith('/recipe/')

  const categories = lang === 'de' ? CATEGORIES_DE : CATEGORIES_FR

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus()
  }, [searchOpen])

  const handleSearch = (val) => {
    setSearchValue(val)
    onSearch?.(val)
  }

  const handleCat = (cat) => {
    onCategoryChange?.(cat)
    setMenuOpen(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        .hdr { transition: box-shadow .3s ease, background .3s ease; }
        .hdr.scrolled { box-shadow: 0 2px 24px rgba(0,0,0,.07); }
        .nav-link { cursor:pointer; border:none; background:none; font-family:'DM Sans',sans-serif; font-size:14px; font-weight:500; color:#555; padding:6px 0; transition:color .2s; white-space:nowrap; text-decoration:none; display:inline-block; }
        .nav-link:hover { color:#1a1a1a; }
        .nav-link.active { color:#1a1a1a; font-weight:600; }
        .lang-btn { cursor:pointer; border:none; font-family:'DM Sans',sans-serif; font-weight:700; font-size:12px; letter-spacing:.5px; transition:all .2s; border-radius:100px; padding:5px 12px; }
        .icon-btn { cursor:pointer; border:none; background:none; display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:50%; transition:background .2s; color:#555; font-size:16px; }
        .icon-btn:hover { background:#f0ede8; color:#1a1a1a; }
        .search-input { width:100%; padding:0; border:none; outline:none; font-family:'DM Sans',sans-serif; font-size:15px; background:transparent; color:#1a1a1a; }
        .search-input::placeholder { color:#bbb; }
        .cat-dropdown { position:absolute; top:calc(100% + 8px); left:50%; transform:translateX(-50%); background:#fff; border-radius:16px; box-shadow:0 8px 40px rgba(0,0,0,.12); padding:16px; display:grid; grid-template-columns:repeat(4,1fr); gap:4px; min-width:480px; z-index:200; animation:dropIn .15s ease; }
        @keyframes dropIn { from{opacity:0;transform:translateX(-50%) translateY(-8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        .cat-item { cursor:pointer; border:none; background:none; display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 8px; border-radius:10px; transition:background .15s; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; color:#555; }
        .cat-item:hover { background:#f5f3ee; color:#1a1a1a; }
        .cat-item.active { background:#1a1a1a; color:#fff; }
        .overlay-bg { position:fixed; inset:0; z-index:100; }
      `}</style>

      <header className={`hdr${scrolled ? ' scrolled' : ''}`}
        style={{ position:'sticky', top:0, zIndex:150, background:'#fff', borderBottom:'1px solid #f0ede8' }}>

        {/* Search bar overlay */}
        {searchOpen && (
          <div style={{ position:'absolute', inset:0, background:'#fff', zIndex:10, display:'flex', alignItems:'center', padding:'0 24px', gap:12 }}>
            <span style={{ fontSize:18, color:'#bbb', flexShrink:0 }}>🔍</span>
            <input
              ref={searchRef}
              className="search-input"
              value={searchValue}
              onChange={e => handleSearch(e.target.value)}
              placeholder={lang === 'de' ? 'Rezept suchen...' : 'Rechercher une recette...'}
            />
            <button className="icon-btn" onClick={() => { setSearchOpen(false); handleSearch('') }} style={{ flexShrink:0 }}>✕</button>
          </div>
        )}

        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 32px' }}>
          {/* Main header row */}
          <div style={{ display:'flex', alignItems:'center', height:64, gap:32 }}>

            {/* Logo */}
            <a href="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', flexShrink:0 }}>
              <div style={{ width:34, height:34, background:'linear-gradient(135deg,#2d6a4f,#40916c)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>🍽</div>
              <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:'#1a1a1a', letterSpacing:'-0.3px' }}>Gourmondo</span>
            </a>

            {/* Nav — categories trigger */}
            {!isRecipePage && (
              <nav style={{ display:'flex', alignItems:'center', gap:24, flex:1 }}>
                <div style={{ position:'relative' }}>
                  <button className={`nav-link${menuOpen ? ' active' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    style={{ display:'flex', alignItems:'center', gap:5 }}>
                    {lang === 'de' ? 'Kategorien' : 'Catégories'}
                    <span style={{ fontSize:10, transition:'transform .2s', display:'inline-block', transform: menuOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                  </button>

                  {menuOpen && (
                    <>
                      <div className="overlay-bg" onClick={() => setMenuOpen(false)} />
                      <div className="cat-dropdown">
                        <button
                          className={`cat-item${!activeCategory || activeCategory === 'ALL' ? ' active' : ''}`}
                          onClick={() => handleCat('ALL')}
                          style={{ gridColumn:'span 4', flexDirection:'row', justifyContent:'center', gap:8, fontSize:13 }}>
                          {lang === 'de' ? '✦ Alle Rezepte' : '✦ Toutes les recettes'}
                        </button>
                        {categories.map((cat, i) => (
                          <button key={cat}
                            className={`cat-item${activeCategory === cat ? ' active' : ''}`}
                            onClick={() => handleCat(cat)}>
                            <span style={{ fontSize:20 }}>{CAT_ICONS[i]}</span>
                            <span>{cat}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </nav>
            )}

            {isRecipePage && (
              <a href="/" style={{ color:'#777', textDecoration:'none', fontSize:14, fontWeight:500, fontFamily:"'DM Sans',sans-serif", display:'flex', alignItems:'center', gap:6 }}>
                ← {lang === 'de' ? 'Alle Rezepte' : 'Toutes les recettes'}
              </a>
            )}

            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
              {/* Search icon */}
              {!isRecipePage && (
                <button className="icon-btn" onClick={() => setSearchOpen(true)} title="Suchen">
                  🔍
                </button>
              )}

              {/* Language switcher */}
              <div style={{ display:'flex', background:'#f5f3ee', borderRadius:100, padding:3, gap:2 }}>
                {['de','fr'].map(l => (
                  <button key={l} className="lang-btn"
                    onClick={() => onLangChange?.(l)}
                    style={{ background: lang===l ? '#1a1a1a' : 'transparent', color: lang===l ? '#fff' : '#888' }}>
                    {l === 'de' ? '🇩🇪 DE' : '🇫🇷 FR'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
