            {principal && (
              <div style={{background:'white', padding:'10px', borderRadius:'8px', border:'1px solid #e5e5e5'}}>
                <span style={{background: customFiltradas.length>0 && principal.id? '#b30000' : '#c9a86a', color: customFiltradas.length>0 && principal.id? 'white' : 'black', padding:'4px 10px', fontSize:10, fontWeight:800, borderRadius:4, display:'inline-block'}}>{customFiltradas.length>0 && principal.id? '🔥 EXCLUSIVA TAKTIK' : catActiva.toUpperCase() + ' • EN VIVO'}</span>
                <a href={principal.id? "/noticia?title=" + encodeURIComponent(principal.title) + "&cat=" + encodeURIComponent(principal.cat) + "&custom=" + principal.id : "/noticia?title=" + encodeURIComponent(principal.title) + "&link=" + encodeURIComponent(principal.link) + "&cat=" + encodeURIComponent(catActiva)} style={{textDecoration:'none', color:'#111', display:'block', marginTop:'6px'}}>
                  <h1 className="serif" style={{fontSize:22, lineHeight:1.2, margin:'0 0 6px 0', color:'#111', fontWeight:900}}>{principal.title}</h1>
                  <img src={principal.img && principal.img.startsWith('http')? principal.img : imgCat[catActiva]} onError={(e)=>{e.currentTarget.onerror=null; e.currentTarget.src=imgCat[catActiva]}} alt="principal" style={{width:'100%', height:'220px', objectFit:'cover', borderRadius:'8px', border:'1px solid #ddd', display:'block'}} />
                </a>
              </div>
            )}
