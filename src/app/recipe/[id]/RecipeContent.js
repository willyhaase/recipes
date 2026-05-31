'use client'
import { useState } from 'react'

export default function RecipeContent({ de, fr, photo }) {
  const [lang, setLang] = useState('de')
  const rv = lang === 'de' ? de : fr

  const diffColor = (d) => {
    if (!d) return '#888'
    const s = d.toLowerCase()
    if (s === 'leicht' || s === 'facile') return '#6a994e'
    if (s === 'schwer' || s === 'difficile') return '#e63946'
    return '#c8952a'
  }

  return (
    <>
      {/* Hero photo */}
      {photo && (
        <div style={{ margin: '0 -32px', height: 420, position: 'relative', overflow: 'hidden', background: '#e8e0d5' }}>
          <img
            src={photo}
            alt={rv.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.1) 60%, transparent 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
              {de.category} / {fr.category}
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 38, color: '#fff', lineHeight: 1.15, marginBottom: 10 }}>
              {lang === 'de' ? de.title : fr.title}
            </h1>
            <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: 'rgba(255,255,255,.65)', fontStyle: 'italic', marginBottom: 20 }}>
              {lang === 'de' ? fr.title : de.title}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {rv.time && <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(255,255,255,.18)', borderRadius:100, padding:'6px 14px', fontSize:13, fontWeight:500, color:'#fff', backdropFilter:'blur(4px)' }}>⏱ {rv.time} {lang === 'de' ? 'Min.' : 'min.'}</span>}
              {rv.servings && <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(255,255,255,.18)', borderRadius:100, padding:'6px 14px', fontSize:13, fontWeight:500, color:'#fff', backdropFilter:'blur(4px)' }}>👥 {rv.servings}</span>}
              {rv.difficulty && <span style={{ display:'inline-flex', alignItems:'center', gap:5, background: diffColor(rv.difficulty)+'cc', borderRadius:100, padding:'6px 14px', fontSize:13, fontWeight:500, color:'#fff', backdropFilter:'blur(4px)' }}>{rv.difficulty}</span>}
            </div>
          </div>
        </div>
      )}

      <div style={{ paddingTop: 40 }}>
        {/* Language tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #ede9e3', marginBottom: 36 }}>
          {['de', 'fr'].map(l => (
            <button key={l} onClick={() => setLang(l)}
              style={{ cursor:'pointer', border:'none', background:'none', padding:'12px 28px', fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:600, transition:'all .2s', borderBottom: lang===l ? '3px solid #1a1a1a' : '3px solid transparent', color: lang===l ? '#1a1a1a' : '#999' }}>
              {l === 'de' ? '🇩🇪 Deutsch' : '🇫🇷 Français'}
            </button>
          ))}
        </div>

        {/* Description */}
        <p style={{ fontSize: 17, color: '#555', lineHeight: 1.8, marginBottom: 40 }}>{rv.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {/* Ingredients */}
          <div>
            <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, marginBottom: 20, color: '#1a1a1a' }}>
              {lang === 'de' ? 'Zutaten' : 'Ingrédients'}
            </h2>
            <div>
              {(rv.ingredients || []).map((ing, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #f0ede8', fontSize:15, color:'#333' }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:'#2d6a4f', display:'inline-block', flexShrink:0 }} />
                  {ing}
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div>
            {rv.tip && (
              <div style={{ background:'#fffbf0', border:'1px solid #f0e0a0', borderRadius:16, padding:'24px' }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#c8952a', marginBottom:8, textTransform:'uppercase', letterSpacing:1.5 }}>
                  💡 {lang === 'de' ? 'Küchentipp' : 'Conseil du chef'}
                </div>
                <div style={{ fontSize:15, color:'#5a4a1a', lineHeight:1.7 }}>{rv.tip}</div>
              </div>
            )}
          </div>
        </div>

        {/* Steps */}
        <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, marginTop: 40, marginBottom: 24, color: '#1a1a1a' }}>
          {lang === 'de' ? 'Zubereitung' : 'Préparation'}
        </h2>
        <div>
          {(rv.steps || []).map((step, i) => (
            <div key={i} style={{ display:'flex', gap:16, marginBottom:20, alignItems:'flex-start' }}>
              <span style={{ width:34, height:34, borderRadius:'50%', background:'#1a1a1a', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0, marginTop:2 }}>{i + 1}</span>
              <span style={{ fontSize:15, color:'#333', lineHeight:1.75, paddingTop:6 }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Other language block */}
        <div style={{ marginTop:48, background:'#f8f6f2', borderRadius:16, padding:'24px 28px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:'#aaa', textTransform:'uppercase', letterSpacing:1.5, marginBottom:12 }}>
            {lang === 'de' ? '🇫🇷 En français' : '🇩🇪 Auf Deutsch'}
          </div>
          <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:'#1a1a1a', marginBottom:8 }}>
            {lang === 'de' ? fr.title : de.title}
          </div>
          <div style={{ fontSize:14, color:'#777', lineHeight:1.6 }}>
            {lang === 'de' ? fr.description : de.description}
          </div>
        </div>
      </div>
    </>
  )
}
