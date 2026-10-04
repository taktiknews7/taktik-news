"use client";
import { useState, useEffect } from "react";

export default function Admin() {
  const [tab, setTab] = useState('noticias'); // noticias | banners
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('El Salvador');
  const [foto, setFoto] = useState('');
  const [contenido, setContenido] = useState('');
  const [noticias, setNoticias] = useState([]);
  const [pass, setPass] = useState('');
  
  // BANNERS
  const [banners, setBanners] = useState(Array.from({length:6},(_,i)=>({id:i+1, img:'', link:'https://wa.me/14694728325', led:`BANNER #${i+1} DISPONIBLE - (469) 472-8325`, activo:true})));

  useEffect(()=>{
    const n = JSON.parse(localStorage.getItem('taktik_noticias')||'[]');
    setNoticias(n);
    const b = JSON.parse(localStorage.getItem('taktik_banners')||'null');
    if(b) setBanners(b);
  },[]);

  const publicar = ()=>{
    if(!titulo || !contenido) return alert('Falta titulo o contenido');
    const nueva = {titulo, categoria, foto, contenido, fecha:new Date().toISOString(), id:Date.now()};
    const nuevas = [nueva, ...noticias];
    localStorage.setItem('taktik_noticias', JSON.stringify(nuevas));
    setNoticias(nuevas);
    setTitulo(''); setFoto(''); setContenido('');
    alert('¡Publicado!');
  };

  const guardarBanners = ()=>{
    localStorage.setItem('taktik_banners', JSON.stringify(banners));
    alert(`¡Banners guardados! Banner #1 al #6 actualizados en tu página principal`);
  };

  const cambiarBanner = (id, campo, valor)=>{
    setBanners(banners.map(b=> b.id===id ? {...b, [campo]:valor} : b));
  };

  return (
    <div style={{maxWidth:900, margin:'20px auto', padding:20, fontFamily:'serif'}}>
      <h1>📝 Panel Taktik News</h1>

      {/* CAMBIAR CONTRASEÑA - igual que tenés */}
      <div style={{background:'#fef3c7', border:'1px solid #facc15', padding:15, borderRadius:8, margin:'20px 0'}}>
        <div style={{fontWeight:900, marginBottom:8}}>🔑 Cambiar Contraseña:</div>
        <div style={{display:'flex', gap:8}}>
          <input value={pass} onChange={e=>setPass(e.target.value)} placeholder="Nueva contraseña" style={{flex:1, padding:10}} />
          <button style={{background:'black', color:'white', padding:'10px 20px', fontWeight:900}}>Cambiar</button>
        </div>
      </div>

      {/* PESTAÑAS */}
      <div style={{display:'flex', gap:10, marginBottom:20}}>
        <button onClick={()=>setTab('noticias')} style={{padding:'10px 20px', fontWeight:900, background: tab==='noticias' ? '#c9a86a' : 'white', border:'2px solid black', borderRadius:6}}>📰 PUBLICAR NOTICIA</button>
        <button onClick={()=>setTab('banners')} style={{padding:'10px 20px', fontWeight:900, background: tab==='banners' ? '#FFD700' : 'white', border:'2px solid black', borderRadius:6}}>🔥 BANNERS #{banners.length} - PUBLICIDAD</button>
      </div>

      {tab==='noticias' && (
        <div style={{background:'#fffaf0', border:'1px solid #e5d5b0', padding:15, borderRadius:8}}>
          <input value={titulo} onChange={e=>setTitulo(e.target.value)} placeholder="Titulo" style={{width:'100%', padding:12, marginBottom:10}} />
          <select value={categoria} onChange={e=>setCategoria(e.target.value)} style={{width:'100%', padding:12, marginBottom:10}}>
            <option>El Salvador</option><option>Mundo</option><option>Deportes</option><option>Comunidad</option>
          </select>
          <input value={foto} onChange={e=>setFoto(e.target.value)} placeholder="Link de foto" style={{width:'100%', padding:12, marginBottom:10}} />
          <textarea value={contenido} onChange={e=>setContenido(e.target.value)} placeholder="Contenido..." style={{width:'100%', height:180, padding:12}} />
          <button onClick={publicar} style={{width:'100%', marginTop:12, padding:14, background:'#c9a86a', fontWeight:900, border:'1px solid black'}}>🚀 PUBLICAR</button>
          <div style={{marginTop:20}}><b>Tus noticias ({noticias.length})</b></div>
        </div>
      )}

      {tab==='banners' && (
        <div style={{background:'#ffffe0', border:'2px solid #FFD700', padding:15, borderRadius:12}}>
          <h3>🔥 Administrar Banners LED - Distribuidos hasta abajo</h3>
          <p style={{fontSize:13, opacity:0.7}}>Cada banner es un espacio en tu página principal. Elige Banner #1, #2, etc y coloca el anuncio del cliente. Cuando no tiene imagen, muestra "¡ANÚNCIATE AQUÍ!"</p>
          
          {banners.map(b=>(
            <div key={b.id} style={{background:'white', border:'2px solid black', borderRadius:10, padding:12, marginBottom:14}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
                <span style={{background:'black', color:'#FFD700', padding:'4px 10px', borderRadius:6, fontWeight:900, fontSize:12}}>BANNER #{b.id} {b.id<=2 ? '- ARRIBA' : b.id<=4 ? '- MEDIO' : '- ABAJO'}</span>
                <label style={{fontSize:12}}><input type="checkbox" checked={b.activo} onChange={e=>cambiarBanner(b.id,'activo',e.target.checked)} /> Activo</label>
              </div>
              <input value={b.img} onChange={e=>cambiarBanner(b.id,'img',e.target.value)} placeholder={`Link imagen Banner #${b.id} (ej: https://...jpg) o /anuncio${b.id}.png`} style={{width:'100%', padding:10, marginBottom:6, fontSize:12}} />
              <input value={b.link} onChange={e=>cambiarBanner(b.id,'link',e.target.value)} placeholder={`Link destino al dar click (WhatsApp del cliente)`} style={{width:'100%', padding:10, marginBottom:6, fontSize:12}} />
              <input value={b.led} onChange={e=>cambiarBanner(b.id,'led',e.target.value)} placeholder={`Texto LED que se mueve: EJ: PUPUSERIA DOÑA MARIA (469) 123-4567`} style={{width:'100%', padding:10, fontSize:12, background:'#000', color:'#FFD700', fontWeight:900}} />
            </div>
          ))}

          <button onClick={guardarBanners} style={{width:'100%', padding:14, background:'black', color:'#FFD700', fontWeight:900, borderRadius:8, fontSize:16}}>💾 GUARDAR TODOS LOS BANNERS #1 al #6</button>
        </div>
      )}

      <div style={{marginTop:20}}><a href="/">← Volver</a></div>
    </div>
  );
}
