import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    robot: "TAKTIK NEWS SV-USA",
    paises: ["El Salvador", "Estados Unidos"],
    mensaje: "Robot funcionando 2x al dia",
    hora_sv: new Date().toLocaleString("es-SV", {timeZone: "America/El_Salvador"}),
    proxima_ejecucion: "8am y 8pm hora El Salvador"
  });
}

export async function POST() {
  return GET();
}
