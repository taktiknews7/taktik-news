"use client";
import { useState, useEffect } from 'react';

export default function Admin() {
  const [pass, setPass] = useState('Notitaktik@26');
  const [inputPass, setInputPass] = useState('');
  const [pin, setPin] = useState('');
  const [pinActual, setPinActual] = useState('');
  const [pinNuevo, setPinNuevo] = useState('');
  const [titulo, setTitulo] = useState('');
  const [cat, setCat] = useState('El Salvador');
  const [img, setImg] = useState('');
  const [contenido, setContenido] = useState('');
  const [tab, setTab] = useState('noticia');
  const [banners, setBanners] = useState(Array.from({length:10},(_,i)=>({id:i+1, img:'', link:'https://wa.me/14694728325', led:`BANNER #${i+1} DISPONIBLE - (469) 472-8325`, activo:true})));
  const [logueado, setLogueado] = useState(false);

  useEffect(()=>{
    const p = localStorage.getItem('taktik_pass'); if(p) setPass(p);
    const pc = localStorage.getItem('taktik_pin_ceo'); if(pc) setPin(pc); else { setPin('2026'); localStorage.setItem('taktik_pin_ceo','2026'); }
    fetch('/api/taktik').then(r=>r.json()).then(db=>{
      if(db.banners?.length){ 
        setBanners(prev=> prev.map(pr=> db.banners.find(s=>s.id===pr.id) || pr)); 
        localStorage.setItem('taktik_banners', JSON.stringify(db.banners));
      } else {
        const b = localStorage.getItem('taktik_banners'); 
        if(b){ try{ const saved=JSON.parse(b); setBanners(prev=> prev.map(pr=> saved.find(s=>s.id===pr.id) || pr)); }catch(e){} }
      }
    });
  },[]);

  const guardarEnServidor = async (data)=>{
    await fetch('/api/taktik', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)});
  }

  const login = ()=>{ if(inputPass===pass){ setLogueado(true); } else alert('Password incorrecto'); }

  // --- NUEVO: CAMBIAR CONTRASEÑA CON PIN - NO TOCA NADA EXISTENTE ---
  const cambiarPasswordConPin = async ()=>{
    if(!pinActual || !pinNuevo){ alert('Llena PIN actual y nueva contraseña'); return; }
    if(pinActual !== pin){ alert('PIN de acceso incorrecto'); return; }
    if(pinNuevo.length < 4){ alert('La nueva contraseña muy corta'); return; }
    setPass(pinNuevo);
    localStorage.setItem('taktik_pass', pinNuevo);
    // También valida con tu API nueva
    await fetch('/api/cambiar-pin', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({actual: pinActual, nuevo: pinNuevo})}).catch(()=>{});
    alert('¡Contraseña cambiada con PIN! ✅ Nueva: ' + pinNuevo);
    setPinActual(''); setPinNuevo('');
  }

  const cambiarPinCEO = ()=>{
    if(!pinActual || !pinNuevo){ alert('Llena PIN actual y nuevo PIN'); return; }
    if(pinActual !== pin){ alert('PIN actual incorrecto'); return; }
    setPin(pinNuevo);
    localStorage.setItem('taktik_pin_ceo', pinNuevo);
    alert('¡PIN de acceso cambiado! Nuevo PIN: ' + pinNuevo);
    setPinActual(''); setPinNuevo('');
  }

  if(!logueado) return (
    <div style={{maxWidth:400, margin:'100px auto', padding:20, border:'1px solid #ddd', borderRadius:8}}>
      <a href="/" style={{textDecoration:'none', fontWeight:800}}>← Volver a Taktik News</a>
      <h2>🔐 Login Taktik</h2>
      <input value={inputPass} onChange={e=>setInputPass(e.target.value)} placeholder="Password" type="password" style={{width:'100%', padding:10, marginTop:10}} />
      <button onClick={login} style={{width:'100%', marginTop:10, padding:10, background:'black', color:'white', fontWeight:800}}>Entrar</button>

      {/* SOLO AGREGADO - CAMBIAR CONTRASEÑA CON PIN DESDE LOGIN */}
      <details style={{marginTop:20, background:'#f7f7f7', padding:10, borderRadius:8}}>
        <summary style={{cursor:'pointer', color:'#6b46c1', fontWeight:800, fontSize:'13px'}}>🔑 ¿Cambiar contraseña con PIN de acceso?</summary>
        <div style={{display:'flex', flexDirection:'column', gap:8, marginTop:10}}>
          <input value={pinActual} onChange={e=>setPinActual(e.target.value)} placeholder="PIN de acceso actual" type="password" style={{padding:10, border:'1px solid #ccc', borderRadius:6}} />
          <input value={pinNuevo} onChange={e=>setPinNuevo(e.target.value)} placeholder="Nueva contraseña" type="password" style={{padding:10, border:'1px solid #ccc', borderRadius:6}} />
          <button onClick={cambiarPasswordConPin} style={{padding:10, background:'#222', color:'white', borderRadius:6, fontWeight:800}}>Cambiar contraseña con PIN</button>
          <small style={{color:'#666'}}>PIN por defecto: 2026 - Cámbialo adentro del panel</small>
        </div>
      </details>
    </div>
  );

  return (
    <div style={{maxWidth:900, margin:'20px auto', padding:10, fontFamily:'Arial'}}>
      <a href="/" style={{display:'inline-block', marginBottom:10, textDecoration:'none', background:'black', color:'#FFD700', padding:'8px 14px', borderRadius:20, fontWeight:900, fontSize:13}}>← Regresar a Taktik News</a>
      <h1 style={{fontFamily:'serif'}}>📝 Panel Taktik News - PERMANENTE ✅</h1>

      <div style={{display:'flex', gap:10, marginTop:15, flexWrap:'wrap'}}>
        <button onClick={()=>setTab('noticia')} style={{background:tab==='noticia'?'#c9a86a':'white', padding:'10px 16px', borderRadius:8, fontWeight:800, border:'1px solid black'}}>📰 PUBLICAR NOTICIA</button>
        <button onClick={()=>setTab('banners')} style={{background:tab==='banners'?'#c9a86a':'white', padding:'10px 16px', borderRadius:8, fontWeight:800, border:'1px solid black'}}>🔥 BANNERS #1 al #10</button>
        <button onClick={()=>setTab('seguridad')} style={{background:tab==='seguridad'?'#c9a86a':'white', padding:'10px 16px', borderRadius:8, fontWeight:800, border:'1px solid black'}}>🔐 SEGURIDAD</button>
      </div>

      {tab==='noticia' && (
        <div style={{background:'#fdf6e3', border:'1px solid #ddd', padding:12, marginTop:15, borderRadius:8}}>
          <input value={titulo} onChange={e=>setTitulo(e.target.value)} placeholder="Título" style={{width:'100%', padding:10, marginBottom:8}} />
          <select value={cat} onChange={e=>setCat(e.target.value)} style={{width:'100%', padding:10, marginBottom:8}}><option>El Salvador</option><option>Internacional</option><option>Economía</option><option>Política</option></select>
          <input value={img} onChange={e=>setImg(e.target.value)} placeholder="Link de foto" style={{width:'100%', padding:10, marginBottom:8}} />
          <textarea value={contenido} onChange={e=>setContenido(e.target.value)} placeholder="Contenido..." style={{width:'100%', height:200, padding:10}} />
          <button onClick={async ()=>{
            const current = await fetch('/api/taktik').then(r=>r.json());
            const custom = current.custom || JSON.parse(localStorage.getItem('taktik_custom')||'[]');
            const nueva = {id:Date.now(), title:titulo, cat, img, desc:contenido, fecha:new Date().toLocaleDateString()};
            custom.unshift(nueva);
            localStorage.setItem('taktik_custom', JSON.stringify(custom));
            await guardarEnServidor({custom});
            alert('Publicado PERMANENTE ✅ Ahora no se borra al apagar'); setTitulo(''); setImg(''); setContenido('');
          }} style={{width:'100%', marginTop:10, padding:12, background:'#c9a86a', fontWeight:900}}>🚀 PUBLICAR PERMANENTE</button>
        </div>
      )}

      {tab==='banners' && (
        <div style={{marginTop:15}}>
          {banners.map((b,i)=>(
            <div key={b.id} style={{border:'1px solid #ddd', padding:10, marginBottom:10, borderRadius:8, background: b.img?'#e6ffed':'white'}}>
              <div style={{fontWeight:900}}>BANNER #{b.id} {b.img?'✅ OCUPADO':'⚪ LIBRE'}</div>
              <input value={b.img} onChange={e=>{ const nb=[...banners]; nb[i].img=e.target.value; setBanners(nb); }} placeholder="Link imagen" style={{width:'100%', padding:8, marginTop:6}} />
              <input value={b.link} onChange={e=>{ const nb=[...banners]; nb[i].link=e.target.value; setBanners(nb); }} placeholder="Link destino" style={{width:'100%', padding:8, marginTop:6}} />
              <input value={b.led} onChange={e=>{ const nb=[...banners]; nb[i].led=e.target.value; setBanners(nb); }} placeholder="Texto LED" style={{width:'100%', padding:8, marginTop:6}} />
              <div style={{display:'flex', gap:6, marginTop:6}}>
                <button onClick={async ()=>{ localStorage.setItem('taktik_banners', JSON.stringify(banners)); await guardarEnServidor({banners}); alert('Banner #'+b.id+' guardado PERMANENTE ✅'); }} style={{flex:1, background:'black', color:'#FFD700', padding:8, borderRadius:6, fontWeight:800}}>Guardar Permanente</button>
                <button onClick={async ()=>{ const nb=[...banners]; nb[i].img=''; nb[i].led=`BANNER #${b.id} DISPONIBLE`; setBanners(nb); localStorage.setItem('taktik_banners', JSON.stringify(nb)); await guardarEnServidor({banners:nb}); }} style={{background:'red', color:'white', padding:8, borderRadius:6}}>Borrar</button>
              </div>
            </div>
          ))}
          <button onClick={async ()=>{ localStorage.setItem('taktik_banners', JSON.stringify(banners)); await guardarEnServidor({banners}); alert('Todos guardados PERMANENTE ✅'); }} style={{width:'100%', padding:12, background:'#FFD700', fontWeight:900, borderRadius:8, marginTop:10}}>Guardar todos Permanente</button>
        </div>
      )}

      {tab==='seguridad' && (
        <div style={{marginTop:15, display:'flex', flexDirection:'column', gap:15}}>
          <div style={{border:'1px solid #ddd', padding:15, borderRadius:8, background:'#fff'}}>
            <h3>🔑 Cambiar contraseña con PIN de acceso</h3>
            <p style={{fontSize:13, color:'#666'}}>Tu PIN actual de acceso es el que te permite cambiar la contraseña sin saber la contraseña vieja.</p>
            <input value={pinActual} onChange={e=>setPinActual(e.target.value)} placeholder="PIN actual (por defecto 2026)" type="password" style={{width:'100%', padding:10, marginBottom:8}} />
            <input value={pinNuevo} onChange={e=>setPinNuevo(e.target.value)} placeholder="Nueva contraseña (ej: MiClave2026)" type="password" style={{width:'100%', padding:10, marginBottom:8}} />
            <button onClick={cambiarPasswordConPin} style={{width:'100%', padding:12, background:'black', color:'white', fontWeight:900, borderRadius:8}}>Cambiar contraseña con PIN</button>
            <div style={{marginTop:10, fontSize:12}}>Contraseña actual guardada: <b>{pass}</b> | PIN actual: <b>{pin}</b></div>
          </div>
          <div style={{border:'1px solid #ddd', padding:15, borderRadius:8, background:'#f0f7ff'}}>
            <h3>🔐 Cambiar PIN de acceso</h3>
            <input value={pinActual} onChange={e=>setPinActual(e.target.value)} placeholder="PIN actual" type="password" style={{width:'100%', padding:10, marginBottom:8}} />
            <input value={pinNuevo} onChange={e=>setPinNuevo(e.target.value)} placeholder="Nuevo PIN" type="password" style={{width:'100%', padding:10, marginBottom:8}} />
            <button onClick={cambiarPinCEO} style={{width:'100%', padding:12, background:'#6b46c1', color:'white', fontWeight:900, borderRadius:8}}>Cambiar PIN de acceso</button>
          </div>
        </div>
      )}

      <div style={{marginTop:30, borderTop:'2px solid black', paddingTop:15}}>
        <a href="/" style={{display:'block', textAlign:'center', background:'black', color:'#FFD700', padding:'14px', borderRadius:10, fontWeight:900, textDecoration:'none'}}>✅ HECHO - IR A TAKTIK NEWS →</a>
      </div>
    </div>
  )
}
