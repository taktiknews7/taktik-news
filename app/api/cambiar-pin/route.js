import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { actual, nuevo } = await req.json();
    const PIN_ACTUAL = process.env.ADMIN_PIN || "taktik2024";

    if (!actual || !nuevo) {
      return NextResponse.json({ ok: false, msg: 'Faltan datos' }, { status: 400 });
    }
    if (actual !== PIN_ACTUAL) {
      return NextResponse.json({ ok: false, msg: 'PIN actual incorrecto' }, { status: 401 });
    }
    if (nuevo.length < 4) {
      return NextResponse.json({ ok: false, msg: 'PIN muy corto' }, { status: 400 });
    }

    return NextResponse.json({ 
      ok: true, 
      msg: 'PIN validado',
      nuevoPin: nuevo 
    });
  } catch (e) {
    return NextResponse.json({ ok: false, msg: e.message }, { status: 500 });
  }
}
