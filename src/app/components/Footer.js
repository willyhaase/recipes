export default function Footer({ lang = 'de' }) {
  const year = new Date().getFullYear()

  const links = {
    de: [
      { label: 'Frühstück', href: '/?cat=Frühstück' },
      { label: 'Suppen', href: '/?cat=Suppen' },
      { label: 'Salate', href: '/?cat=Salate' },
      { label: 'Hauptgerichte', href: '/?cat=Hauptgerichte' },
      { label: 'Backen', href: '/?cat=Backen' },
      { label: 'Desserts', href: '/?cat=Desserts' },
    ],
    fr: [
      { label: 'Petit-déjeuner', href: '/?cat=Petit-déjeuner' },
      { label: 'Soupes', href: '/?cat=Soupes' },
      { label: 'Salades', href: '/?cat=Salades' },
      { label: 'Plats principaux', href: '/?cat=Plats principaux' },
      { label: 'Pâtisserie', href: '/?cat=Pâtisserie' },
      { label: 'Desserts', href: '/?cat=Desserts' },
    ],
  }

  return (
    <footer style={{ background: '#fff', borderTop: '1px solid #f0ede8', marginTop: 80 }}>
      {/* Main footer */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 32px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#2d6a4f,#40916c)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🍽</div>
              <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: '#1a1a1a' }}>Gourmondo</span>
            </div>
            <p style={{ fontSize: 14, color: '#999', lineHeight: 1.7, maxWidth: 280, fontFamily: "'DM Sans',sans-serif" }}>
              {lang === 'de'
                ? 'Entdecken Sie authentische Rezepte aus Deutschland und Frankreich — zweisprachig, mit KI kuratiert.'
                : 'Découvrez des recettes authentiques d\'Allemagne et de France — bilingues, curatées par IA.'}
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              {['🇩🇪', '🇫🇷'].map((flag, i) => (
                <span key={i} style={{ fontSize: 20 }}>{flag}</span>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
              {lang === 'de' ? 'Kategorien' : 'Catégories'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {links[lang].map(link => (
                <a key={link.label} href={link.href}
                  style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#666', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => e.target.style.color = '#1a1a1a'}
                  onMouseLeave={e => e.target.style.color = '#666'}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
              {lang === 'de' ? 'Über uns' : 'À propos'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                lang === 'de' ? 'KI-generierte Rezepte' : 'Recettes générées par IA',
                lang === 'de' ? 'Zweisprachig DE / FR' : 'Bilingue DE / FR',
                lang === 'de' ? 'Täglich neue Rezepte' : 'Nouvelles recettes chaque jour',
                lang === 'de' ? 'Kostenlos & frei' : 'Gratuit & libre',
              ].map((item, i) => (
                <span key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: '#666', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#2d6a4f', fontSize: 12 }}>✓</span> {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid #f0ede8' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#bbb' }}>
            © {year} Gourmondo. {lang === 'de' ? 'Alle Rechte vorbehalten.' : 'Tous droits réservés.'}
          </span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: '#bbb', display: 'flex', alignItems: 'center', gap: 6 }}>
            {lang === 'de' ? 'Betrieben von' : 'Propulsé par'}
            <span style={{ color: '#2d6a4f', fontWeight: 600 }}>Claude AI</span>
            <span>·</span>
            <span>{lang === 'de' ? 'Fotos von' : 'Photos par'}</span>
            <a href="https://pexels.com" target="_blank" rel="noopener" style={{ color: '#2d6a4f', fontWeight: 600, textDecoration: 'none' }}>Pexels</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
