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
    const b = localStorage.getItem('taktik_banners'); if(b){ try{ const saved=JSON.parse(b); setBanners(prev=> prev.map(pr=> saved.find(s=>s.id===pr.id) || pr)); }catch(e){} }
    const pc = localStorage.getItem('taktik_pin_ceo'); if(pc) setPin(pc);
  },[]);

  const login = ()=>{ if(inputPass===pass){ setLogueado(true); } else alert('Password incorrecto'); }

  const cambiarPass = ()=>{
    if(!pin) return alert('Poné tu PIN CEO (6 dig)');
    if(pin!== localStorage.getItem('taktik_pin_ceo')) return alert('PIN CEO incorrecto - Solo el CEO puede cambiar pass');
    if(inputPass.length<4) return alert('Nuevo pass muy corto');
    localStorage.setItem('taktik_pass', inputPass);
    setPass(inputPass); alert('Pass cambiado ✅'); setInputPass('');
  }

  const cambiarPin = ()=>{
    const actual = localStorage.getItem('taktik_pin_ceo');
    if(actual && pinActual!== actual) return alert('PIN actual incorrecto');
    if(pinNuevo.length!==6) return alert('El PIN debe ser 6 dígitos exactos');
    localStorage.setItem('taktik_pin_ceo', pinNuevo);
    setPin(pinNuevo); alert('PIN CEO creado/cambiado ✅'); setPinActual(''); setPinNuevo('');
  }

  if(!logueado) return (
    <div style={{maxWidth:400, margin:'100px auto', padding:20, border:'1px solid #ddd', borderRadius:8}}>
      <a href="/" style={{textDecoration:'none', fontWeight:800}}>← Volver a Taktik News</a>
      <h2>🔐 Login Taktik</h2>
      <input value={inputPass} onChange={e=>setInputPass(e.target.value)} placeholder="Password" type="password" style={{width:'100%', padding:10, marginTop:10}} />
      <button onClick={login} style={{width:'100%', marginTop:10, padding:10, background:'black', color:'white', fontWeight:800}}>Entrar</button>
    </div>
  );

  return (
    <div style={{maxWidth:900, margin:'20px auto', padding:10, fontFamily:'Arial'}}>

      {/* 1- FLECHITA PARA REGRESAR */}
      <a href="/" style={{display:'inline-block', marginBottom:10, textDecoration:'none', background:'black', color:'#FFD700', padding:'8px 14px', borderRadius:20, fontWeight:900, fontSize:13}}>← Regresar a Taktik News</a>

      <h1 style={{fontFamily:'serif'}}>📝 Panel Taktik News</h1>

      <div style={{background:'#fef3c7', border:'1px solid #c9a86a', padding:12, borderRadius:8}}>
        <div style={{fontWeight:800, fontSize:14}}>🔑 Password Actual: {pass}</div>
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <input value={inputPass} onChange={e=>setInputPass(e.target.value)} placeholder="Nuevo password" style={{flex:1, padding:8}} />
          <input value={pin} onChange={e=>setPin(e.target.value)} placeholder="Tu PIN CEO (6 dig)" style={{width:140, padding:8, border:'2px solid red'}} />
          <button onClick={cambiarPass} style={{background:'black', color:'white', padding:'8px 12px', borderRadius:6, fontWeight:800}}>Cambiar Pass</button>
        </div>

        <div style={{background:'black', color:'white', padding:10, marginTop:10, borderRadius:6}}>
          <div style={{fontWeight:800, color:'#FFD700', fontSize:12}}>👑 CONFIGURAR TU PIN DE CEO (6 digitos) - Solo vos:</div>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <input value={pinActual} onChange={e=>setPinActual(e.target.value)} placeholder="PIN actual" style={{flex:1, padding:8}} />
            <input value={pinNuevo} onChange={e=>setPinNuevo(e.target.value)} placeholder="Nuevo PIN 6 digitos" style={{flex:1, padding:8}} />
            <button onClick={cambiarPin} style={{background:'#FFD700', color:'black', padding:'8px 12px', borderRadius:6, fontWeight:900}}>Cambiar PIN</button>
          </div>
          <div style={{fontSize:10, marginTop:6, color:'#0f0'}}>Estado: {localStorage.getItem('taktik_pin_ceo')? `✅ PIN CEO creado (****${localStorage.getItem('taktik_pin_ceo')?.slice(-2)})` : '❌ Sin PIN'}</div>
        </div>
        <button onClick={()=>setLogueado(false)} style={{marginTop:8, fontSize:11}}>Cerrar sesión</button>
      </div>

      <div style={{display:'flex', gap:10, marginTop:15}}>
        <button onClick={()=>setTab('noticia')} style={{background:tab==='noticia'?'#c9a86a':'white', padding:'10px 16px', borderRadius:8, fontWeight:800, border:'1px solid black'}}>📰 PUBLICAR NOTICIA</button>
        <button onClick={()=>setTab('banners')} style={{background:tab==='banners'?'#c9a86a':'white', padding:'10px 16px', borderRadius:8, fontWeight:800, border:'1px solid black'}}>🔥 BANNERS #1 al #10</button>
      </div>

      {tab==='noticia' && (
        <div style={{background:'#fdf6e3', border:'1px solid #ddd', padding:12, marginTop:15, borderRadius:8}}>
          <input value={titulo} onChange={e=>setTitulo(e.target.value)} placeholder="Título" style={{width:'100%', padding:10, marginBottom:8}} />
          <select value={cat} onChange={e=>setCat(e.target.value)} style={{width:'100%', padding:10, marginBottom:8}}><option>El Salvador</option><option>Internacional</option><option>Economía</option><option>Política</option></select>
          <input value={img} onChange={e=>setImg(e.target.value)} placeholder="Link de foto" style={{width:'100%', padding:10, marginBottom:8}} />
          <textarea value={contenido} onChange={e=>setContenido(e.target.value)} placeholder="Contenido..." style={{width:'100%', height:200, padding:10}} />
          <button onClick={()=>{
            const custom = JSON.parse(localStorage.getItem('taktik_custom')||'[]');
            custom.unshift({id:Date.now(), title:titulo, cat, img, desc:contenido, fecha:new Date().toLocaleDateString()});
            localStorage.setItem('taktik_custom', JSON.stringify(custom));
            alert('Publicado ✅'); setTitulo(''); setImg(''); setContenido('');
          }} style={{width:'100%', marginTop:10, padding:12, background:'#c9a86a', fontWeight:900}}>🚀 PUBLICAR</button>
        </div>
      )}

      {tab==='banners' && (
        <div style={{marginTop:15}}>
          {banners.map((b,i)=>(
            <div key={b.id} style={{border:'1px solid #ddd', padding:10, marginBottom:10, borderRadius:8, background: b.img?'#e6ffed':'white'}}>
              <div style={{fontWeight:900}}>BANNER #{b.id} {b.img?'✅ OCUPADO':'⚪ LIBRE'}</div>
              <input value={b.img} onChange={e=>{ const nb=[...banners]; nb[i].img=e.target.value; setBanners(nb); }} placeholder="Link imagen (https://i.postimg.cc/...)" style={{width:'100%', padding:8, marginTop:6}} />
              <input value={b.link} onChange={e=>{ const nb=[...banners]; nb[i].link=e.target.value; setBanners(nb); }} placeholder="Link destino (WhatsApp)" style={{width:'100%', padding:8, marginTop:6}} />
              <input value={b.led} onChange={e=>{ const nb=[...banners]; nb[i].led=e.target.value; setBanners(nb); }} placeholder="Texto LED" style={{width:'100%', padding:8, marginTop:6}} />
              <div style={{display:'flex', gap:6, marginTop:6}}>
                <button onClick={()=>{ localStorage.setItem('taktik_banners', JSON.stringify(banners)); alert('Banner #'+b.id+' guardado ✅'); }} style={{flex:1, background:'black', color:'#FFD700', padding:8, borderRadius:6, fontWeight:800}}>Guardar Banner #{b.id} (arriba)</button>
                <button onClick={()=>{ const nb=[...banners]; nb[i].img=''; nb[i].led=`BANNER #${b.id} DISPONIBLE - (469) 472-8325`; setBanners(nb); localStorage.setItem('taktik_banners', JSON.stringify(nb)); }} style={{background:'red', color:'white', padding:8, borderRadius:6}}>Borrar</button>
              </div>
            </div>
          ))}
          <button onClick={()=>{ localStorage.setItem('taktik_banners', JSON.stringify(banners)); alert('Todos los banners guardados ✅'); }} style={{width:'100%', padding:12, background:'#FFD700', fontWeight:900, borderRadius:8, marginTop:10}}>Guardar todos (abajo)</button>
        </div>
      )}

      {/* 2- BOTON FINALIZAR ABAJO */}
      <div style={{marginTop:30, borderTop:'2px solid black', paddingTop:15}}>
        <a href="/" style={{display:'block', textAlign:'center', background:'black', color:'#FFD700', padding:'14px', borderRadius:10, fontWeight:900, textDecoration:'none', fontSize:16, letterSpacing:1}}>✅ HECHO - FINALIZAR E IR A TAKTIK NEWS →</a>
        <div style={{textAlign:'center', fontSize:11, marginTop:6, opacity:0.6}}>Al picar aquí volvés a la página principal y verás tus banners activos</div>
      </div>

    </div>
  )
}
