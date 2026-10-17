"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [catActiva, setCatActiva] = useState('El Salvador');
  const [noticias, setNoticias] = useState([]);
  const [custom, setCustom] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [bannersAdmin, setBannersAdmin] = useState([]);
  const [fechaHoy, setFechaHoy] = useState('');
  const cats = ['El Salvador', 'Internacional', 'Economía', 'Política'];

  useEffect(() => {
    setFechaHoy(new Date().toLocaleDateString('es-SV', {weekday:'long', day:'numeric', month:'long'}) + ' - ROBOT BBC+INFOBAE ACTIVO ✅');

    // JALAR DEL SERVIDOR PERMANENTE
    fetch('/api/taktik').then(r=>r.json()).then(db=>{
    const filtrar24h = (arr) => (arr||[]).filter(c=>{ 
  const t = new Date(c.createdAt || 0).getTime(); 
  return Date.now() - t < 24*60*60*1000; 
});
if(db.custom?.length){ 
  const f = filtrar24h(db.custom); 
  setCustom(f); 
  localStorage.setItem('taktik_custom', JSON.stringify(f)); 
} else { 
  const saved = localStorage.getItem('taktik_custom'); 
  if(saved){ try{ setCustom(filtrar24h(JSON.parse(saved))); }catch(e){} } 
}  
      if(db.banners?.length){ setBannersAdmin(db.banners); localStorage.setItem('taktik_banners', JSON.stringify(db.banners)); }
      else { const b = localStorage.getItem('taktik_banners'); if(b){ try{ setBannersAdmin(JSON.parse(b)); }catch(e){} } }
    });

    const ultimaJalada = localStorage.getItem('taktik_ultima_' + catActiva);
    const ahora = Date.now();
    const unDia = 24 * 60 * 60 * 1000;
    const cache = localStorage.getItem('taktik_cache_' + catActiva);

    if (!ultimaJalada || (ahora - parseInt(ultimaJalada) > unDia)) {
        setCargando(true);
        fetch("/api/noticias?cat=" + encodeURIComponent(catActiva))
      .then(r=>r.json()).then(data=>{
            setNoticias(data);
            setCargando(false);
            localStorage.setItem('taktik_ultima_' + catActiva, ahora.toString());
            localStorage.setItem('taktik_cache_' + catActiva, JSON.stringify(data));
        });
    } else {
        if(cache){
          setNoticias(JSON.parse(cache));
          setCargando(false);
        } else {
          setCargando(true);
          fetch("/api/noticias?cat=" + encodeURIComponent(catActiva))
        .then(r=>r.json()).then(data=>{
              setNoticias(data);
              setCargando(false);
              localStorage.setItem('taktik_ultima_' + catActiva, ahora.toString());
              localStorage.setItem('taktik_cache_' + catActiva, JSON.stringify(data));
          });
        }
    }
  }, [catActiva]);

  const customFiltradas = custom.filter(c=>c.cat===catActiva);
  const todas = [...customFiltradas,...noticias];
  const principal = todas[0];
  const listaCorta = todas.slice(1, 11);
  const listaLarga = todas.slice(11, 26);

  const imgCat = {
    'El Salvador': 'https://images.unsplash.com/photo-1518638150340-f706e86654b8?w=900',
    'Internacional': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900',
    'Economía': 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900',
    'Política': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=900'
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;700&display=swap');
        body{margin:0;background:#f9f6f0;font-family:Inter,sans-serif}.serif{font-family:'Playfair Display',serif}
        @keyframes scrollLED { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
      `}</style>
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
            <span>{cargando? 'Buscando...' : todas.length + ' noticias de ' + catActiva} <a href="/admin" style={{color:'#c9a86a', marginLeft:10}}>⚙️ Admin</a></span>
          </div>
        </header>

        <div style={{maxWidth:1200, margin:'0 auto', padding:20, display:'grid', gridTemplateColumns:'1.7fr 0.8fr', gap:28}}>
          <div>
            {principal && (
              <div>
                <span style={{background: customFiltradas.length>0 && principal.id? '#b30000' : '#c9a86a', color: customFiltradas.length>0 && principal.id? 'white' : 'black', padding:'4px 10px', fontSize:10, fontWeight:800}}>{customFiltradas.length>0 && principal.id? '🔥 EXCLUSIVA TAKTIK' : catActiva.toUpperCase() + ' • EN VIVO'}</span>
                <a href={principal.id? "/noticia?title=" + encodeURIComponent(principal.title) + "&cat=" + encodeURIComponent(principal.cat) + "&custom=" + principal.id : "/noticia?title=" + encodeURIComponent(principal.title) + "&link=" + encodeURIComponent(principal.link) + "&cat=" + encodeURIComponent(catActiva)} style={{textDecoration:'none', color:'black'}}>
                  <h1 className="serif" style={{fontSize:34, lineHeight:1.1, marginTop:10}}>{principal.title}</h1>
                  <p style={{fontSize:13, color:'#555'}}>{principal.desc}</p>
                  <img src={principal.img && principal.img.startsWith('http')? principal.img : imgCat[catActiva]} onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src=imgCat[catActiva]}} alt="principal" style={{width:'100%', height:360, objectFit:'cover', background:'white', marginTop:12, borderRadius:8, border:'1px solid #ddd'}} />
                </a>
              </div>
            )}
            <div style={{marginTop:24, background:'white', border:'1px solid #e5e5e5', borderRadius:8, overflow:'hidden'}}>
              <div style={{padding:'12px 16px', fontWeight:800, fontSize:13, borderBottom:'2px solid black'}}>📰 NOTICIAS DE {catActiva.toUpperCase()}</div>
              {cargando? <div style={{padding:20}}>⏳ Buscando...</div> :
                listaCorta.map((n,i)=>(
                  <a key={i} href={n.id? "/noticia?title=" + encodeURIComponent(n.title) + "&cat=" + encodeURIComponent(n.cat) + "&custom=" + n.id : "/noticia?title=" + encodeURIComponent(n.title) + "&link=" + encodeURIComponent(n.link) + "&cat=" + encodeURIComponent(catActiva)} style={{display:'flex', gap:12, padding:'14px 16px', borderBottom:'1px solid #f0f0f0', textDecoration:'none', color:'black', background: n.id? '#fff8e7' : 'white'}}>
                    <div style={{minWidth:44, height:44, background: n.id? '#b30000' : '#00205b', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, borderRadius:6, fontSize:12}}>{n.id? '★' : i+2}</div>
                    <div><div style={{fontSize:14, fontWeight:600}}>{n.title}</div><div style={{fontSize:11, color:'#888', marginTop:4}}>{n.id? "Redacción Taktik • " + n.fecha : "BBC/Infobae"} • Click →</div></div>
                  </a>
                ))}
            </div>
          </div>
          <div>
            <div style={{background:'white', border:'1px solid #ddd', padding:16, borderRadius:8, position:'sticky', top:90}}>
              <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
                {Array.from({length:10}).map((_,i)=>{
                  const num = i+1;
                  const b = bannersAdmin.find(x=>x.id===num) || {id:num, img:'', link:'https://wa.me/14694728325', led:'BANNER #' + num + ' DISPONIBLE', activo:true};
                  if(b.activo===false) return null;
                  return (
                    <div key={num} style={{background:'black', borderRadius:'12px', border:'2px solid #FFD700', overflow:'hidden'}}>
                      <div style={{background:'#FFD700', color:'black', fontSize:9, fontWeight:900, padding:'4px 8px', display:'flex', justifyContent:'space-between'}}><span>BANNER #{num}</span><span style={{background:'black', color:'#FFD700', padding:'1px 5px', borderRadius:3, fontSize:8}}>{b.img?'OCUPADO':'LIBRE'}</span></div>
                      <a href={b.link} target="_blank" style={{display:'block'}}>
                        {b.img?
                          <>
                            <div style={{width:'100%', height:'100px', background:'white', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
                              <img src={b.img} style={{maxWidth:'80%', maxHeight:'90px', width:'auto', height:'auto', objectFit:'contain', display:'block'}} alt="" />
                            </div>
                            <div style={{background:'black', overflow:'hidden', whiteSpace:'nowrap', borderTop:'1px solid #FFD700'}}>
                              <div style={{display:'inline-block', color:'#FFD700', fontSize:11, fontWeight:700, padding:'4px 0', animation:'scrollLED 10s linear infinite'}}>{b.led} • {b.led}</div>
                            </div>
                          </>
                        : <div style={{height:'120px', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', color:'white', padding:'10px', textAlign:'center', background:'#111'}}><div style={{fontSize:14, fontWeight:900, color:'#FFD700'}}>¡ANÚNCIATE AQUÍ!</div><div style={{fontSize:10, marginTop:4}}>BANNER #{num}</div><div style={{marginTop:6, background:'#FFD700', color:'black', padding:'4px 10px', borderRadius:5, fontWeight:900, fontSize:10}}>(469) 472-8325</div></div>}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
