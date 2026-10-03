export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* HEADER */}
      <header className="border-b border-yellow-500/20 sticky top-0 bg-black/90 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-yellow-400">TAKTIK NEWS</h1>
          <div className="flex gap-2 text-[10px]">
            <span className="bg-yellow-500 text-black px-3 py-1 font-bold rounded">EN VIVO</span>
            <span className="border border-white/20 px-3 py-1 rounded">{new Date().toLocaleDateString('es-BO')}</span>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 pb-3 flex gap-6 text-xs tracking-widest overflow-x-auto">
          <a className="text-yellow-400 font-bold">ULTIMO</a><a>POLITICA</a><a>ECONOMIA</a><a>DEPORTES</a><a>MUNDO</a><a>TECNOLOGIA</a>
        </nav>
      </header>

      {/* HERO */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 p-6 md:p-10 rounded-2xl">
            <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded font-bold">URGENTE</span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 leading-tight">Bolivia: La jugada Taktik que cambia el juego politico</h2>
            <p className="text-zinc-400 mt-4 text-lg">Análisis exclusivo. Por qué esta semana será decisiva y qué nadie te está contando.</p>
            <button className="mt-6 bg-yellow-500 text-black px-6 py-3 font-black rounded hover:bg-yellow-400">LEER ANALISIS COMPLETO</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {[
              {cat:"ECONOMIA", t:"Dolar paralelo: 3 claves que debes saber hoy"},
              {cat:"MUNDO", t:"El giro que sorprende a toda America Latina"},
              {cat:"POLITICA", t:"Taktik News revela documento exclusivo"},
              {cat:"DEPORTE", t:"La seleccion y la estrategia final"}
            ].map((n,i)=>(
              <div key={i} className="bg-zinc-900 border border-white/10 p-5 rounded-xl hover:border-yellow-500/30 transition">
                <span className="text-yellow-500 text-[10px] font-bold tracking-widest">{n.cat}</span>
                <h3 className="font-bold mt-2 leading-snug">{n.t}</h3>
                <p className="text-xs text-zinc-500 mt-2">Hace 2 horas • 3 min lectura</p>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          <div className="bg-yellow-500 text-black p-6 rounded-2xl">
            <h3 className="font-black text-xl">¿Quieres noticias 2x al día en automático?</h3>
            <p className="text-sm mt-2 font-medium">Ya estamos configurando el robot de Taktik News.</p>
            <p className="text-xs mt-4 bg-black text-yellow-400 inline-block px-3 py-1 rounded-full">PROXIMAMENTE: AUTO-POST</p>
          </div>
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl">
            <h4 className="font-black tracking-widest text-sm">LO MAS LEIDO HOY</h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="border-b border-white/5 pb-2">1. La verdad del gabinete</li>
              <li className="border-b border-white/5 pb-2">2. Precio del dolar hoy</li>
              <li className="border-b border-white/5 pb-2">3. Bloqueos: mapa en vivo</li>
              <li>4. Taktik explica: que sigue</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 text-center text-xs text-zinc-500 mt-10">
        TAKTIK NEWS © 2026 • Hecho en Bolivia • taktik-news.vercel.app
      </footer>
    </div>
  );
}
