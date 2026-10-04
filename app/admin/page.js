"use client"
import { useState, useEffect } from 'react';

export default function Admin(){
  const [tab, setTab] = useState('noticia'); // noticia | banners
  const [banners, setBanners] = useState(Array.from({length:10}).map((_,i)=>({id:i+1, img:'', link:'https://wa.me/14694728325', led:`BANNER #${i+1} DISPONIBLE - (469) 472-8325`, activo:true})));
  const [bannerEditando, setBannerEditando] = useState(1);
  const [titulo, setTitulo] = useState('');
  const [cat, setCat] = useState('El Salvador');
  const [img, setImg] = useState('');
  const [contenido, setContenido] = useState('');

  useEffect(()=>{
    const b = localStorage.getItem('taktik_banners');
    if(b){ try{ 
      const saved = JSON.parse(b);
      // Mezclar guardados con defaults
      setBanners(prev=> prev.map(p=> saved.find(s=>s.id===p.id) || p));
    }catch(e){} }
  },[]);

  const guardarBanners = (nuevos) => {
    setBanners(nuevos);
    localStorage.setItem('taktik_banners', JSON.stringify(nuevos));
    alert('✅ Banner guardado! Ahora recarga la página principal');
  };

  const bannerActual = banners.find(b=>b.id===bannerEditando);

  return (
    <div style={{padding:20, maxWidth:900, margin:'0 auto', fontFamily:'serif'}}>
      <h1>📝 Panel Taktik News</h1>

      <div style={{display:'flex', gap:10, marginBottom:20}}>
        <button onClick={()=>setTab('noticia')} style={{padding:'10px 20px', background:tab==='noticia'?'#c9a86a':'white', fontWeight:900, border:'2px solid black', borderRadius:8}}>📰 PUBLICAR NOTICIA</button>
        <button onClick={()=>setTab('banners')} style={{padding:'10px 20px', background:tab==='banners'?'#FFD700':'white', fontWeight:900, border:'2px solid black', borderRadius:8}}>🔥 BANNERS #1 al #10 - PUBLICIDAD</button>
      </div>

      {tab==='noticia' ? (
        <div style={{background:'#fffaf0', padding:15, border:'1px solid #ddd', borderRadius:8}}>
          <input placeholder="Título" value={titulo} onChange={e=>setTitulo(e.target.value)} style={{width:'100%', padding:10, marginBottom:10}} />
          <select value={cat} onChange={e=>setCat(e.target.value)} style={{width:'100%', padding:10, marginBottom:10}}><option>El Salvador</option><option>Internacional</option><option>Economía</option><option>Política</option></select>
          <input placeholder="Link de foto" value={img} onChange={e=>setImg(e.target.value)} style={{width:'100%', padding:10, marginBottom:10}} />
          <textarea placeholder="Contenido..." value={contenido} onChange={e=>setContenido(e.target.value)} style={{width:'100%', height:200, padding:10, marginBottom:10}} />
          <button onClick={()=>{
            const news = {id:Date.now(), titulo, categoria:cat, imagen:img, contenido, fecha:new Date().toISOString()};
            const saved = JSON.parse(localStorage.getItem('taktik_custom')||'[]');
            saved.unshift(news);
            localStorage.setItem('taktik_custom', JSON.stringify(saved));
            alert('Noticia publicada!');
            setTitulo(''); setImg(''); setContenido('');
          }} style={{width:'100%', padding:12, background:'#c9a86a', fontWeight:900}}>🚀 PUBLICAR</button>
        </div>
      ) : (
        <div style={{background:'black', padding:15, borderRadius:12, border:'3px solid #FFD700'}}>
          <h3 style={{color:'#FFD700', marginTop:0}}>🔥 EDITAR 10 BANNERS</h3>
          <div style={{display:'flex', flexWrap:'wrap', gap:6, marginBottom:15}}>
            {banners.map(b=>(
              <button key={b.id} onClick={()=>setBannerEditando(b.id)} style={{padding:'6px 10px', background:bannerEditando===b.id?'#FFD700':'#333', color:bannerEditando===b.id?'black':'white', border:'1px solid #FFD700', borderRadius:6, fontWeight:900, fontSize:12}}>
                #{b.id} {b.img?'✅':''}
              </button>
            ))}
          </div>

          <div style={{background:'white', padding:15, borderRadius:8}}>
            <h4 style={{margin:'0 0 10px 0'}}>Editando BANNER #{bannerEditando} - {bannerEditando<=3?'▲ ARRIBA':bannerEditando<=7?'● MEDIO':'▼ ABAJO'}</h4>
            <label style={{fontSize:12, fontWeight:800}}>Link Imagen (del anuncio):</label>
            <input value={bannerActual?.img||''} onChange={e=>{
              const nuevos = banners.map(x=> x.id===bannerEditando ? {...x, img:e.target.value} : x);
              setBanners(nuevos);
            }} placeholder="https://..." style={{width:'100%', padding:8, marginBottom:10}} />

            <label style={{fontSize:12, fontWeight:800}}>Link destino (WhatsApp o web del cliente):</label>
            <input value={bannerActual?.link||''} onChange={e=>{
              const nuevos = banners.map(x=> x.id===bannerEditando ? {...x, link:e.target.value} : x);
              setBanners(nuevos);
            }} placeholder="https://wa.me/..." style={{width:'100%', padding:8, marginBottom:10}} />

            <label style={{fontSize:12, fontWeight:800}}>Texto LED amarillo (se mueve):</label>
            <input value={bannerActual?.led||''} onChange={e=>{
              const nuevos = banners.map(x=> x.id===bannerEditando ? {...x, led:e.target.value} : x);
              setBanners(nuevos);
            }} style={{width:'100%', padding:8, marginBottom:10}} />

            <label style={{display:'flex', gap:8, alignItems:'center', marginBottom:12}}><input type="checkbox" checked={bannerActual?.activo} onChange={e=>{
              const nuevos = banners.map(x=> x.id===bannerEditando ? {...x, activo:e.target.checked} : x);
              setBanners(nuevos);
            }} /> Activo</label>

            <button onClick={()=>guardarBanners(banners)} style={{width:'100%', padding:12, background:'#FFD700', color:'black', fontWeight:900, borderRadius:8, border:'2px solid black'}}>💾 GUARDAR BANNER #{bannerEditando}</button>
            
            {bannerActual?.img && <div style={{marginTop:15}}><p style={{fontSize:12}}>Vista previa:</p><img src={bannerActual.img} style={{width:'100%', maxHeight:150, objectFit:'cover', border:'1px solid #ddd'}} /></div>}
          </div>
          <button onClick={()=>guardarBanners(banners)} style={{marginTop:10, width:'100%', padding:10, background:'#222', color:'#FFD700', border:'1px solid #FFD700', borderRadius:8}}>💾 GUARDAR TODOS LOS BANNERS</button>
        </div>
      )}
    </div>
  )
}
