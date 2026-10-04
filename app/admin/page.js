"use client";
import { useState, useEffect } from 'react';

export default function Admin() {
  const CLAVE_DEFAULT = 'taktik2026';
  const [pass, setPass] = useState('');
  const [ok, setOk] = useState(false);
  const [form, setForm] = useState({ title:'', cat:'El Salvador', img:'', content:'' });
  const [lista, setLista] = useState([]);
  const [nuevaClave, setNuevaClave] = useState('');

  const getClaveActual = () => {
    return localStorage.getItem('taktik_pass') || CLAVE_DEFAULT;
  }

  useEffect(()=>{
    const saved = localStorage.getItem('taktik_custom');
    if(saved) setLista(JSON.parse(saved));
  },[]);

  const login = () => {
    if(pass === getClaveActual()) setOk(true);
    else alert('Clave incorrecta');
  }

  const publicar = () => {
    if(!form.title ||!form.content) return alert('Falta título y contenido');
    const nueva = {...form, id: Date.now(), fecha: new Date().toLocaleDateString('es-SV') };
    const nuevas = [nueva,...lista];
    setLista(nuevas);
    localStorage.setItem('taktik_custom', JSON.stringify(nuevas));
    setForm({ title:'', cat:'El Salvador', img:'', content:'' });
    alert('¡Noticia publicada!');
  }

  const borrar = (id) => {
    const f = lista.filter(n=>n.id!==id);
    setLista(f);
    localStorage.setItem('taktik_custom', JSON.stringify(f));
  }

  const cambiarClave = () => {
    if(nuevaClave.length < 4) return alert('Mínimo 4 caracteres');
    localStorage.setItem('taktik_pass', nuevaClave);
    setNuevaClave('');
    alert(`¡Contraseña cambiada!`);
  }

  if(!ok) return (
    <div style={{minHeight:'100vh', background:'black', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Inter'}}>
      <div style={{background:'white', padding:30, borderRadius:10, width:320}}>
        <h2>🔒 ADMIN TAKTIK</h2>
        <input type="password" placeholder="Contraseña" value={pass} onChange={e=>setPass(e.target.value)} style={{width:'100%', padding:12, marginTop:12, border:'1px solid #ddd', borderRadius:4}} />
        <button onClick={login} style={{width:'100%', marginTop:12, padding:12, background:'black', color:'white', cursor:'pointer', fontWeight:700, borderRadius:4, border:0}}>Entrar</button>
      </div>
    </div>
  )

  return (
    <div style={{maxWidth:800, margin:'0 auto', padding:20, fontFamily:'Inter'}}>
      <h1>📝 Panel Taktik News</h1>
      <div style={{background:'#fff3cd', border:'1px solid #ffc107', padding:12, borderRadius:8, marginTop:10}}>
        <b>🔑 Cambiar Contraseña:</b>
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <input placeholder="Nueva contraseña" value={nuevaClave} onChange={e=>setNuevaClave(e.target.value)} style={{flex:1, padding:10}} />
          <button onClick={cambiarClave} style={{padding:'10px 16px', background:'black', color:'white', cursor:'pointer'}}>Cambiar</button>
        </div>
      </div>
      <div style={{background:'#f9f6f0', padding:16, borderRadius:8, border:'1px solid #ddd', marginTop:20}}>
        <input placeholder="Título" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={{width:'100%', padding:12, marginBottom:10}} />
        <select value={form.cat} onChange={e=>setForm({...form, cat:e.target.value})} style={{width:'100%', padding:12, marginBottom:10}}>
          <option>El Salvador</option><option>Internacional</option><option>Economía</option><option>Política</option>
        </select>
        <input placeholder="Link de foto" value={form.img} onChange={e=>setForm({...form, img:e.target.value})} style={{width:'100%', padding:12, marginBottom:10}} />
        <textarea placeholder="Contenido..." value={form.content} onChange={e=>setForm({...form, content:e.target.value})} style={{width:'100%', padding:12, height:150}} />
        <button onClick={publicar} style={{width:'100%', padding:14, background:'#c9a86a', fontWeight:800, cursor:'pointer', marginTop:10}}>🚀 PUBLICAR</button>
      </div>
      <h3 style={{marginTop:30}}>Tus noticias ({lista.length})</h3>
      {lista.map(n=>(
        <div key={n.id} style={{border:'1px solid #ddd', padding:12, marginTop:10, borderRadius:6, display:'flex', justifyContent:'space-between'}}>
          <div><b>{n.title}</b><br/><small>{n.cat}</small></div>
          <button onClick={()=>borrar(n.id)} style={{background:'red', color:'white', border:0, padding:'6px 10px', borderRadius:4, cursor:'pointer'}}>Borrar</button>
        </div>
      ))}
      <div style={{marginTop:20}}><a href="/">← Volver</a></div>
    </div>
  )
}
