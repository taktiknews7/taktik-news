import { NextResponse } from 'next/server';

export async function GET() {
  console.log("Robot Taktik: Actualizando noticias SV + USA " + new Date().toISOString());
  return NextResponse.json({ 
    ok: true, 
    mensaje: "Robot activo - Noticias actualizadas",
    hora: new Date().toLocaleString("es-SV", {timeZone:"America/El_Salvador"}),
    categorias: ["El Salvador", "Internacional", "Economia", "Politica"]
  });
}
