export default function Home() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;700&display=swap');
        body{margin:0;background:#f9f6f0;font-family:'Inter',sans-serif}
        .serif{font-family:'Playfair Display',serif}
      `}</style>
      <main style={{minHeight:'100vh'}}>
        <header style={{background:'black', color:'white'}}>
          <div style={{maxWidth:1200, margin:'0 auto', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #c9a86a'}}>
            <div>
              <div className="serif" style={{fontSize:26, fontWeight:900, letterSpacing:2}}>TAKTIK NEWS</div>
              <div style={{fontSize:10, letterSpacing:4, color:'#c9a86a', marginTop:2}}>EL MUNDO AL REVES</div>
            </div>
            <div style={{display:'flex', gap:12, fontSize:11}}> 
              <span>El Salvador</span><span>Internacional</span><span>Economía</span><span>Política</span>
            </div>
          </div>
          <div style={{maxWidth:1200, margin:'0 auto', padding:'6px 16px', display:'flex', justifyContent:'space-between', fontSize:11, opacity:0.7}}>
            <span>VIERNES 3 DE OCTUBRE DE 2025 - 16:32 GMT-6 - SAN SALVADOR</span>
            <span>Mercados -0.32% - USD/SVP 1.00 = 8.75</span>
          </div>
        </header>

        <div style={{maxWidth:1200, margin:'0 auto', padding:20, display:'grid', gridTemplateColumns:'1.7fr 1fr', gap:28}}>
          <div>
            <h1 className="serif" style={{fontSize:32, lineHeight:1.1, fontWeight:700}}>
              El Salvador: Gobierno anuncia nueva reforma de seguridad para la zona metropolitana
            </h1>
            <div style={{marginTop:10}}><span style={{background:'#c9a86a', padding:'3px 8px', fontSize:10, fontWeight:700}}>EL SALVADOR - PORTADA</span></div>
            <img src="https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800" style={{width:'100%', height:300, objectFit:'cover', marginTop:12, borderRadius:6}} />
            <p style={{fontSize:11, color:'#666', marginTop:6}}>Operativo de seguridad implementado este viernes en el Área Metropolitana de San Salvador<br/>Foto: Archivo TAKTIK NEWS</p>
            <p style={{marginTop:14, fontSize:14, lineHeight:1.6}}>
              El presidente presentó el nuevo plan de seguridad que reforzará la presencia policial en los 14 municipios del área metropolitana. La medida busca reducir los índices de violencia y fortalecer la coordinación entre la Fuerza Armada y la Policía Nacional Civil...
            </p>
            <h3 style={{marginTop:30, fontWeight:800, fontSize:13, borderBottom:'2px solid black', paddingBottom:6}}>ÚLTIMAS NOTICIAS - EL SALVADOR</h3>
            <div style={{marginTop:12}}>
              <div style={{display:'flex', gap:10, borderBottom:'1px solid #ddd', padding:'10px 0'}}><div style={{width:60, height:45, background:'#ddd'}}></div><div style={{fontSize:13, fontWeight:700}}>Asamblea Legislativa aprueba reformas al sistema de pensiones<br/><span style={{fontSize:11, fontWeight:400, color:'#888'}}>Hace 2 horas</span></div></div>
              <div style={{display:'flex', gap:10, borderBottom:'1px solid #ddd', padding:'10px 0'}}><div style={{width:60, height:45, background:'#ddd'}}></div><div style={{fontSize:13, fontWeight:700}}>Ministerio de Salud reporta descenso en casos de dengue<br/><span style={{fontSize:11, fontWeight:400, color:'#888'}}>Hace 3 horas</span></div></div>
              <div style={{display:'flex', gap:10, padding:'10px 0'}}><div style={{width:60, height:45, background:'#ddd'}}></div><div style={{fontSize:13, fontWeight:700}}>Empresarios piden incentivos para impulsar inversión<br/><span style={{fontSize:11, fontWeight:400, color:'#888'}}>Hace 4 horas</span></div></div>
            </div>
          </div>

          <div>
            <div style={{background:'white', border:'1px solid #ddd', padding:14}}>
              <div className="serif" style={{fontSize:13, letterSpacing:2, borderBottom:'1px solid #ddd', paddingBottom:8, marginBottom:10}}>INTERNACIONAL</div>
              <p style={{fontSize:12}}><b style={{color:'#b68a3a', fontSize:10}}>• Medio Oriente: Nuevas negociaciones en Ginebra buscan alto al fuego</b><br/><span style={{fontSize:11, color:'#888'}}>Hace 1 hora - Ginebra</span></p>
              <p style={{fontSize:12, marginTop:10}}><b style={{fontSize:10}}>• UE aprueba nuevo paquete de sanciones económicas contra Rusia</b><br/><span style={{fontSize:11, color:'#888'}}>Hace 3 horas - Bruselas</span></p>
              <p style={{fontSize:12, marginTop:10}}><b style={{fontSize:10}}>• ONU advierte sobre crisis humanitaria en Haití</b><br/><span style={{fontSize:11, color:'#888'}}>Hace 6 horas - ONU</span></p>
            </div>
            <div style={{background:'black', color:'white', padding:14, marginTop:16}}>
              <div style={{fontSize:10, letterSpacing:3, color:'#c9a86a'}}>ANALISIS</div>
              <div style={{fontSize:13, marginTop:6}}>Por qué el giro diplomático en América Latina redefine alianzas regionales</div>
              <div style={{fontSize:10, marginTop:8, opacity:0.5}}>Opinión →</div>
            </div>
            <div style={{background:'#111', color:'white', fontSize:9, textAlign:'center', padding:10, marginTop:16}}>© 2025 TAKTIK NEWS - Robot ACTIVO 8am y 8pm SV ✅</div>
          </div>
        </div>
      </main>
    </>
  )
}
