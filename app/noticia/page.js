"use client";
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function Contenido(){
  const params = useSearchParams();
  const title = params.get('title') || 'Sin título';
  const link = params.get('link') || '';
  const cat = params.get('cat') || 'General';
  const customId = params.get('custom');
  const [customNota, setCustomNota] = useState(null);

  useEffect(()=>{
    if(customId){
      const saved = localStorage.getItem('taktik_custom');
      if(saved){
        try{
          const arr = JSON.parse(saved);
          const found = arr.find(x=>x.id==customId);
          if(found) setCustomNota(found);
        }catch{}
      }
    }
  }, [customId]);

  const hostname = link? (()=>{ try{ return new URL(link).hostname.replace('www.','').toUpperCase(); }catch{ return 'FUENTE ORIGINAL'; } })() : 'TAKTIK';

  return (
    <div style={{maxWidth:720, margin:'20px auto', padding:20, background:'white', borderRadius:10, border:'1px solid #ddd'}}>
      <a href="/" style={{fontSize:12, textDecoration:'none', color:'#555'}}>← Volver a Taktik News</a>

      <h1 style={{fontSize:28, marginTop:12, fontWeight:900, lineHeight:1.2}}>{customNota?.title || title}</h1>
      <div style={{fontSize:11, color:'#888', marginTop:8}}>{cat.toUpperCase()} • {customNota? 'Redacción Taktik' : 'Fuente: ' + hostname} • {customNota?.fecha || ''}</div>

      {customNota?.img && <img src={customNota.img} style={{width:'100%', height:360, objectFit:'cover', marginTop:14, borderRadius:8}} alt="" />}

      <p style={{marginTop:16, lineHeight:1.6, color:'#222', fontSize:15, whiteSpace:'pre-wrap'}}>
        {customNota?.contenido || 'Resumen Taktik generado automáticamente. Esta es una referencia de la nota original. Para leer el contenido completo, debes visitar la fuente.'}
      </p>

      {/* ESTE ES EL BOTÓN NEGRO QUE NO TE ABRÍA - YA ARREGLADO */}
      {!customNota && link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{display:'block', background:'black', color:'white', textAlign:'center', padding:'16px', borderRadius:8, textDecoration:'none', fontWeight:900, marginTop:20, cursor:'pointer'}}
        >
          VER NOTA ORIGINAL EN {hostname} ↗
        </a>
      )}

      <a href={`https://wa.me/14694728325?text=${encodeURIComponent((customNota?.title || title) + " " + (link || ""))}`} target="_blank" style={{display:'block', background:'#25D366', color:'white', textAlign:'center', padding:'12px', borderRadius:8, textDecoration:'none', fontWeight:800, marginTop:10}}>Compartir por WhatsApp</a>
    </div>
  );
}

export default function NoticiaPage(){
  return (
    <Suspense fallback={<div style={{padding:20}}>Cargando...</div>}>
      <Contenido />
    </Suspense>
  );
}
