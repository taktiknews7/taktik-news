export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET() {
  const FOTO = 'https://images.unsplash.com/photo-1544985361-b420d7a77043?w=900';
  const data = [
    { title: "Asamblea Legislativa discute reformas clave hoy", link: "#", img: FOTO },
    { title: "Clima en El Salvador: pronóstico para hoy sábado", link: "#", img: FOTO },
    { title: "Economía salvadoreña muestra crecimiento según BCR", link: "#", img: FOTO },
    { title: "Selección de El Salvador prepara próximos partidos FIFA", link: "#", img: FOTO },
    { title: "Obras en Centro Histórico de San Salvador avanzan 80%", link: "#", img: FOTO },
    { title: "Seguridad: PNC reporta capturas en operativo nacional", link: "#", img: FOTO },
    { title: "Turismo en El Salvador aumenta este fin de semana", link: "#", img: FOTO },
    { title: "Precio del Bitcoin hoy - actualización El Salvador", link: "#", img: FOTO },
    { title: "Salud: MINSAL brinda recomendaciones por lluvias", link: "#", img: FOTO },
    { title: "Internacional: últimas noticias del mundo hoy", link: "#", img: FOTO },
    { title: "Política: reacciones tras anuncios del gobierno", link: "#", img: FOTO },
    { title: "Transporte colectivo: cambios en rutas de San Salvador", link: "#", img: FOTO },
    { title: "Estados Unidos canaliza $55 millones como apoyo por sequía", link: "#", img: FOTO },
    { title: "La niñez, el primer eslabón del proceso educativo en El Salvador", link: "#", img: FOTO },
    { title: "Congresistas piden extensión del TPS en Capitolio Washington", link: "#", img: FOTO },
    { title: "Remesas familiares aumentan 8% en El Salvador este mes", link: "#", img: FOTO },
    { title: "Alcaldía de San Salvador anuncia nuevo mercado central", link: "#", img: FOTO },
    { title: "FOVIAL inicia bacheo en carretera Panamericana", link: "#", img: FOTO },
    { title: "Jóvenes salvadoreños ganan beca internacional", link: "#", img: FOTO },
    { title: "Precio de la canasta básica se mantiene estable", link: "#", img: FOTO },
    { title: "Puerto de La Unión registra movimiento récord", link: "#", img: FOTO },
    { title: "INJUVE lanza nuevo programa de empleo juvenil", link: "#", img: FOTO },
    { title: "Carnaval de San Miguel: preparativos a todo vapor", link: "#", img: FOTO },
    { title: "Exportaciones salvadoreñas crecen 12% según informe", link: "#", img: FOTO },
    { title: "Migración: consulado ayuda a salvadoreños en Washington", link: "#", img: FOTO },
    { title: "Agricultura: cosecha de café con buenos resultados", link: "#", img: FOTO },
  ];
  return Response.json(data);
}
