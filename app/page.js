export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-yellow-500/20 sticky top-0 bg-black/90 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-yellow-400">TAKTIK NEWS</h1>
          <div className="flex gap-2 text-[10px]">
            <span className="bg-yellow-500 text-black px-3 py-1 font-bold rounded">EN VIVO SV + USA</span>
            <span className="border border-white/20 px-3 py-1 rounded">{new Date().toLocaleDateString('es-SV')}</span>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 pb-3 flex gap-6 text-xs tracking-widest overflow-x-auto">
          <a className="text-yellow-400 font-bold">EL SALVADOR</a><a>USA</a><a>MIGRACION</a><a>POLITICA USA</a><a>ECONOMIA</a>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 p-6 md:p-10 rounded-2xl">
            <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold">EL SALVADOR + USA</span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 leading-tight">El Salvador y EE.UU.: El acuerdo que cambia todo para los migrantes</h2>
            <p className="text-zinc-400 mt-4 text-lg">Analisis Taktik: Lo que pasa en Washington y como impacta directo en San Salvador.</p>
            <button className="mt-6 bg-yellow-500 text-black px-6 py-3 font-black rounded hover:bg-yellow-400">LEER ANALISIS COMPLETO</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {[
              {cat:"EL SALVADOR", t:"Bukele y nueva jugada economica: esto viene"},
              {cat:"USA", t:"Elecciones USA: lo que salvadoreños deben saber"},
              {cat:"MIGRACION", t:"TPS y cambios migratorios hoy"},
              {cat:"ECONOMIA", t:"Remesas y dolar: actualizacion en vivo"}
            ].map((n,i)=>(
              <div key={i} className="bg-zinc-900 border border-white/10 p-5 rounded-xl hover:border-yellow-500/30 transition">
                <span className="text-yellow-500 text-[10px] font-bold tracking-widest">{n.cat}</span>
                <h3 className="font-bold mt-2 leading-snug">{n.t}</h3>
                <p className="text-xs text-zinc-500 mt-2">Hace 2 horas • Taktik News SV-USA</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-yellow-500 text-black p-6 rounded-2xl">
            <h3 className="font-black text-xl">Robot 2x al dia: SV + USA</h3>
            <p className="text-sm mt-2 font-medium">A las 8am y 8pm hora El Salvador, subira noticias automaticamente de El Salvador y Estados Unidos.</p>
            <p className="text-xs mt-4 bg-black text-yellow-400 inline-block px-3 py-1 rounded-full">ACTIVADO</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-zinc-500 mt-10">
        TAKTIK NEWS SV-USA © 2026 • El Salvador + Estados Unidos • taktik-news.vercel.app
      </footer>
    </div>
  );
}
