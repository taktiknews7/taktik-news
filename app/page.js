export default function Home() {
  return (
    <main className="min-h-screen bg-[#f9f6f0] text-[#111]">
      {/* HEADER PRO */}
      <header className="bg-black text-white">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex justify-between items-center border-b border-[#c9a86a]/30">
          <div>
            <h1 className="text-2xl font-serif font-black tracking-widest">TAKTIK NEWS</h1>
            <p className="text-[10px] tracking-[0.3em] text-[#c9a86a]">EL MUNDO AL REVES</p>
          </div>
          <div className="hidden md:flex gap-4 text-xs">
            <span>El Salvador</span><span>Internacional</span><span>Economía</span><span>Política</span><span>Opinión</span><span>Deportes</span>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-4 py-1.5 flex justify-between text-[11px] opacity-70">
          <span>VIERNES 3 DE OCTUBRE DE 2025 - 16:32 GMT-6 - SAN SALVADOR</span>
          <span className="hidden md:block">Mercados -0.32% - USD/SVP 1.00 = 8.75</span>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-4 py-6 grid md:grid-cols-[1.6fr_1fr] gap-8">
        {/* COLUMNA IZQUIERDA */}
        <div>
          <h2 className="text-[32px] font-serif font-bold leading-tight">
            El Salvador: Gobierno anuncia nueva reforma de seguridad para la zona metropolitana
          </h2>
          <div className="mt-3">
            <span className="bg-[#c9a86a] text-black text-[10px] px-2 py-1 font-bold">EL SALVADOR - PORTADA</span>
          </div>
          <div className="mt-4 bg-gray-300 h-[280px] rounded flex items-center justify-center text-sm text-gray-600">
            [Foto: Puente Cuscatlán - San Salvador]
          </div>
          <p className="text-[11px] mt-2 text-gray-500">Operativo de seguridad implementado este viernes en el Área Metropolitana de San Salvador<br/>Foto: Archivo TAKTIK NEWS</p>

          <p className="mt-4 text-[14px] leading-relaxed">
            El presidente presentó el nuevo plan de seguridad que reforzará la presencia policial en los 14 municipios del área metropolitana. La medida busca reducir los índices de violencia y fortalecer la coordinación entre la Fuerza Armada y la Policía Nacional Civil...
          </p>
          <p className="text-[12px] mt-2 underline">Leer más →</p>

          <h3 className="mt-8 font-bold text-sm border-b border-black pb-1">ÚLTIMAS NOTICIAS - EL SALVADOR</h3>
          <div className="mt-4 space-y-4">
            {[
              "Asamblea Legislativa aprueba reformas al sistema de pensiones",
              "Ministerio de Salud reporta descenso en casos de dengue en el último mes",
              "Empresarios piden incentivos para impulsar inversión en la zona oriental"
            ].map((t,i)=>(
              <div key={i} className="flex gap-3 border-b pb-3">
                <div className="w-16 h-12 bg-gray-300 rounded"></div>
                <p className="text-[13px] font-semibold leading-tight">{t}<br/><span className="text-[11px] font-normal text-gray-500">Hace {2+i} horas</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-6">
          <div className="bg-white border p-4">
            <h3 className="font-serif text-sm tracking-widest border-b pb-2 mb-3">INTERNACIONAL</h3>
            <div className="space-y-4 text-[13px]">
              <div>
                <span className="text-[10px] text-[#c9a86a] font-bold">• Medio Oriente: Nuevas negociaciones en Ginebra buscan alto al fuego</span>
                <p className="text-[11px] text-gray-500">Hace 1 hora - Ginebra</p>
              </div>
              <div>
                <span className="text-[10px]">• UE aprueba nuevo paquete de sanciones económicas contra Rusia</span>
                <p className="text-[11px] text-gray-500">Hace 3 horas - Bruselas</p>
              </div>
              <div>
                <span className="text-[10px]">• ONU advierte sobre crisis humanitaria en Haití tras recientes disturbios</span>
                <p className="text-[11px] text-gray-500">Hace 6 horas - Naciones Unidas</p>
              </div>
            </div>
          </div>

          <div className="bg-black text-white p-4">
            <h3 className="text-[11px] tracking-widest text-[#c9a86a]">ANÁLISIS</h3>
            <p className="text-sm mt-2 leading-tight">Por qué el giro diplomático en América Latina redefine alianzas regionales</p>
            <p className="text-[11px] mt-2 opacity-60">Opinión →</p>
          </div>

          <div className="border p-3 text-[10px] text-center bg-[#111] text-white">
            TAKTIK NEWS - Contacto - Privacidad - Publicidad<br/>© 2025 TAKTIK NEWS - Todos los derechos reservados
          </div>
        </div>
      </div>

      {/* ROBOT STATUS */}
      <div className="max-w-[1200px] mx-auto px-4 pb-10">
        <div className="bg-black text-white rounded-xl p-4 text-xs">
          🤖 Robot SV + USA: ACTIVO ✅ - Corre 8am y 8pm hora El Salvador en /api/cron
        </div>
      </div>
    </main>
  )
}
