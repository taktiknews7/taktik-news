"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [catActiva, setCatActiva] = useState('El Salvador');
  const [noticias, setNoticias] = useState([]);
  // ... lo demás igual
  const [custom, setCustom] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [bannersAdmin, setBannersAdmin] = useState([]);
  const [fechaHoy, setFechaHoy] = useState('');
  const cats = ['El Salvador', 'Internacional', 'Economía', 'Política'];

  useEffect(() => {    setFechaHoy(new Date().toLocaleDateString('es-SV', {weekday:'long', day:'numeric', month:'long'}) + ' - ROBOT ACTIVO ✅');
    const saved = localStorage.getItem('taktik_custom');
    if(saved) setCustom(JSON.parse(saved));
    const b = localStorage.getItem('taktik_banners');
    if(b){ try{ setBannersAdmin(JSON.parse(b)); }catch(e){} }
    setCargando(true);
    fetch(`/api/noticias?cat=${encodeURIComponent(catActiva)}`, { cache: 'no-store' })
     .then(r=>r.json()).then(data=>{ setNoticias(data); setCargando(false); });
  }, [catActiva]);

  const customFiltradas = custom.filter(c=>c.cat===catActiva);
  const todas = [...customFiltradas,...noticias];
  const principal = todas[0];

  const imgCat = {
    'El Salvador': 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900',
    'Internacional': 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=900',
    'Economía': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=900',
    'Política': 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900'
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;700&display=swap'); body{margin:0;background:#f9f6f0;font-family:Inter,sans-serif}.serif{font-family:'Playfair Display',serif}`}</style>
      <main>
        <header style={{background:'black', color:'white', position:'sticky', top:0, zIndex:50}}>
          <div style={{maxWidth:1200, margin:'0 auto', padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
  <img src="/logo.png" alt="Taktik News" style={{width:'52px', height:'52px', borderRadius:'50%', background:'white', padding:'2px', objectFit:'cover'}} />
  <div style={{display:'flex', flexDirection:'column', lineHeight:1}}>
  <div style={{fontSize:28, fontWeight:900, fontFamily:'serif', letterSpacing:'1px'}}>TAKTIK NEWS</div>
  <div style={{fontSize:11, fontWeight:400, fontStyle:'italic', opacity:0.7, letterSpacing:'1px', marginTop:'2px'}}>Un mundo al Revés</div>
</div>
</div>
            <div style={{display:'flex', gap:6}}>{cats.map(c=>(<button key={c} onClick={()=>setCatActiva(c)} style={{background: catActiva===c? '#c9a86a' : '#222', color: catActiva===c? 'black' : 'white', border: catActiva===c? '1px solid #c9a86a' : '1px solid #444', padding:'8px 14px', borderRadius:20, cursor:'pointer', fontWeight:700, fontSize:12}}>{c}</button>))}</div>
          </div>
          <div style={{maxWidth:1200, margin:'0 auto', padding:'6px 16px', fontSize:11, opacity:0.7, display:'flex', justifyContent:'space-between', borderTop:'1px solid #222'}}>
            <span>{fechaHoy}</span>
            <span>{cargando? 'Buscando...' : `${todas.length} noticias de ${catActiva}`} <a href="/admin" style={{color:'#c9a86a', marginLeft:10}}>⚙️ Admin</a></span>
          </div>
        </header>

        <div style={{maxWidth:1200, margin:'0 auto', padding:20, display:'grid', gridTemplateColumns:'1.7fr 0.8fr', gap:28}}>
          <div>
            {principal && (
              <>
                <span style={{background: customFiltradas.length>0 && principal.id? '#b30000' : '#c9a86a', color: customFiltradas.length>0 && principal.id? 'white' : 'black', padding:'4px 10px', fontSize:10, fontWeight:800}}>{customFiltradas.length>0 && principal.id? '🔥 EXCLUSIVA TAKTIK' : `${catActiva.toUpperCase()} • EN VIVO`}</span>
                <a href={principal.id? `/noticia?title=${encodeURIComponent(principal.title)}&cat=${encodeURIComponent(principal.cat)}&custom=${principal.id}` : `/noticia?title=${encodeURIComponent(principal.title)}&link=${encodeURIComponent(principal.link)}&cat=${encodeURIComponent(catActiva)}`} style={{textDecoration:'none', color:'black'}}>
                  <h1 className="serif" style={{fontSize:34, lineHeight:1.1, marginTop:10}}>{principal.title}</h1>
                  <img src={principal.img || imgCat[catActiva]} style={{width:'100%', height:360, objectFit:'cover', marginTop:12, borderRadius:8, border:'1px solid #ddd'}} />
                </a>
              </>
            )}

            <div style={{marginTop:24, background:'white', border:'1px solid #e5e5e5', borderRadius:8, overflow:'hidden'}}>
              <div style={{padding:'12px 16px', fontWeight:800, fontSize:13, borderBottom:'2px solid black', display:'flex', justifyContent:'space-between'}}><span>📰 NOTICIAS DE {catActiva.toUpperCase()} {customFiltradas.length>0? `+ ${customFiltradas.length} PROPIAS` : '- ROBOT GOOGLE'}</span><span style={{fontSize:10, background:'black', color:'white', padding:'2px 6px', borderRadius:4}}>AUTO</span></div>
              {cargando? <div style={{padding:20}}>⏳ El robot está buscando...</div> :
                todas.map((n,i)=>(
                  <a key={i} href={n.id? `/noticia?title=${encodeURIComponent(n.title)}&cat=${encodeURIComponent(n.cat)}&custom=${n.id}` : `/noticia?title=${encodeURIComponent(n.title)}&link=${encodeURIComponent(n.link)}&cat=${encodeURIComponent(catActiva)}`} style={{display:'flex', gap:12, padding:'14px 16px', borderBottom:'1px solid #f0f0f0', textDecoration:'none', color:'black', background: n.id? '#fff8e7' : 'white'}}>
                    <div style={{minWidth:44, height:44, background: n.id? '#b30000' : catActiva==='El Salvador'? '#00205b' : '#0a5c36', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, borderRadius:6, fontSize:12}}>{n.id? '★' : i+1}</div>
                    <div><div style={{fontSize:14, fontWeight:600, lineHeight:1.3}}>{n.title} {n.id && <span style={{background:'#b30000', color:'white', fontSize:9, padding:'2px 5px', borderRadius:3, marginLeft:6}}>PROPIA</span>}</div><div style={{fontSize:11, color:'#888', marginTop:4}}>{n.id? `Redacción Taktik • ${n.fecha}` : `Fuente: Google News • ${catActiva}`} • Click →</div></div>
                  </a>
                ))}
            </div>
          </div>
          <div>
            <div style={{background:'white', border:'1px solid #ddd', padding:16, borderRadius:8}}>
              <div className="serif" style={{fontSize:13, letterSpacing:2, fontWeight:800, marginBottom:10}}>CATEGORÍAS ACTIVAS</div>
              {cats.map(c=>(<button key={c} onClick={()=>setCatActiva(c)} style={{width:'100%', textAlign:'left', marginTop:8, padding:'12px', background: catActiva===c? 'black' : '#f9f6f0', color: catActiva===c? 'white' : 'black', border:'1px solid #ddd', borderRadius:6, cursor:'pointer', fontWeight:600, fontSize:13}}>{catActiva===c? '● ' : '○ '}{c} {catActiva===c? '(viendo)' : ''}</button>))}
              <a href="/admin" style={{display:'block', marginTop:16, padding:12, background:'#c9a86a', textAlign:'center', fontWeight:800, textDecoration:'none', color:'black', borderRadius:6}}>➕ Subir Noticia Propia</a>
              {/* ===== 10 BANNERS ENUMERADOS - CONECTADO A /admin ===== */}
<div style={{marginTop:'20px', display:'flex', flexDirection:'column', gap:'20px'}}>
  {Array.from({length:10}).map((_,i)=>{
    const num = i+1;
    const b = bannersAdmin.find(x=>x.id===num) || {id:num, img:'', link:'https://wa.me/14694728325', led:`BANNER #${num} DISPONIBLE - (469) 472-8325`, activo:true};
    if(b.activo===false) return null;
    return (
      <div key={num} style={{background:'black', borderRadius:'12px', border:'3px solid #FFD700', overflow:'hidden'}}>
        <div style={{background:'#FFD700', color:'black', fontSize:10, fontWeight:900, padding:'6px 10px', display:'flex', justifyContent:'space-between'}}>
          <span>🔥 BANNER #{num} {num<=3?'▲ ARRIBA':num<=7?'● MEDIO':'▼ ABAJO'}</span>
          <span style={{background:'black', color:'#FFD700', padding:'2px 6px', borderRadius:4, fontSize:9}}>{b.img?'OCUPADO':'DISPONIBLE'}</span>
        </div>
        <div style={{background:'black', color:'#FFD700', fontSize:11, fontWeight:900, padding:'6px', overflow:'hidden', whiteSpace:'nowrap', borderBottom:'1px solid #333'}}>
          <div style={{display:'inline-block', animation:`taktikScroll${num} 15s linear infinite`}}> ★ {b.led} ★ {b.led} ★ </div>
        </div>
        <a href={b.link} target="_blank" style={{display:'block'}}>
          {b.img ? <img src={b.img} style={{width:'100%', height:'170px', objectFit:'cover', display:'block'}} /> : <div style={{height:'170px', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', color:'white', padding:'15px', textAlign:'center', background:'#111'}}><div style={{fontSize:20, fontWeight:900, color:'#FFD700'}}>¡ANÚNCIATE AQUÍ!</div><div style={{fontSize:11, marginTop:4}}>BANNER #{num}</div><div style={{marginTop:8, background:'#FFD700', color:'black', padding:'5px 12px', borderRadius:6, fontWeight:900, fontSize:11}}>(469) 472-8325</div></div>}
        </a>
      </div>
    );
  })}
</div>
<style>{`${Array.from({length:10}).map((_,i)=>`@keyframes taktikScroll${i+1} { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }`).join('\n')}`}</style>  
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
