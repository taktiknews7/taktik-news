import { NextResponse } from 'next/server';

// En Vercel no podemos usar fs, por eso el custom lo guardamos en el navegador
// El filtro de 24h lo hacemos en app/page.js

export async function GET(){
  return NextResponse.json({ custom: [] }, { headers:{'Cache-Control':'no-store'} });
}

export async function POST(req){
  const body = await req.json();
  // No guardamos en servidor, solo decimos OK y el page.js lo guarda con createdAt
  return NextResponse.json({ ok: true, item: { ...body, createdAt: new Date().toISOString() } });
}
