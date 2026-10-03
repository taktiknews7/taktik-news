'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function Contenido() {
  const params = useSearchParams()
  const title = params.get('title') || ''
  const link = params.get('link') || ''
  const cat = params.get('cat') || ''

  return (
    <div style={{minHeight:'100vh', background:'#f5f5f5', fontFamily:'sans-serif'}}>
      <div style={{background:'black', color:'white', padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <a href="/" style={{color:'white', textDecoration:'none', fontWeight:900, letterSpacing:1}}>TAKTIK NEWS</a>
        <span style={{background:'#00e676', color:'black', padding:'4px 10px', borderRadius:6, fontSize:12, fontWeight:700}}>{cat}</span>
      </div>
      <div style={{maxWidth:800, margin:'0 auto', background:'white', padding:24, marginTop:16}}>
        <h1 style={{fontSize:28, fontWeight:800, lineHeight:1.2}}>{title}</h1>
        <p style={{color:'#888', fontSize:12, marginTop:8}}>Fuente: {link ? new URL(link).hostname : ''} • Redacción Taktik</p>
        <div style={{marginTop:20, padding:16, background:'#f6fff8', borderLeft:'4px solid #00e676'}}>
          <b>Resumen Taktik:</b> {title}. Nuestro equipo le da seguimiento a esta información desde San Salvador con análisis propio.
        </div>
        <div style={{background:'#eee', height:90, display:'flex', alignItems:'center', justifyContent:'center', margin:'20px 0', borderRadius:8}}>TU ANUNCIO 1 - ADSENSE</div>
        <a href={link} target="_blank" style={{display:'block', background:'black', color:'white', textAlign:'center', padding:'14px', borderRadius:8, textDecoration:'none', fontWeight:700}}>VER NOTA ORIGINAL EN {link ? new URL(link).hostname : ''} ↗</a>
        <div style={{background:'#eee', height:90, display:'flex', alignItems:'center', justifyContent:'center', margin:'20px 0', borderRadius:8}}>TU ANUNCIO 2 - ADSENSE</div>
        <a href="/" style={{display:'block', textAlign:'center', padding:10, color:'#666', textDecoration:'none'}}>← Volver al inicio</a>
      </div>
    </div>
  )
}

export default function Page() {
  return <Suspense><Contenido /></Suspense>
}
