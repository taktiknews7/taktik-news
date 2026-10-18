import { NextResponse } from 'next/server';

if (!globalThis.taktikStore) {
  globalThis.taktikStore = { custom: [], banners: [] };
}

export async function GET(){
  return NextResponse.json(globalThis.taktikStore, { headers:{'Cache-Control':'no-store, no-cache, must-revalidate'} });
}

export async function POST(req){
  const body = await req.json();
  if (!globalThis.taktikStore) globalThis.taktikStore = { custom: [], banners: [] };

  // Si vienen banners del admin #1 al #10
  if (body.banners) {
    globalThis.taktikStore.banners = body.banners;
    return NextResponse.json({ ok: true, banners: body.banners });
  }

  // Si es noticia custom
  if (body.title) {
    const item = { ...body, createdAt: new Date().toISOString() };
    globalThis.taktikStore.custom.unshift(item);
    // Solo guardamos las últimas 50
    globalThis.taktikStore.custom = globalThis.taktikStore.custom.slice(0,50);
    return NextResponse.json({ ok: true, item });
  }

  return NextResponse.json({ ok: true });
}
