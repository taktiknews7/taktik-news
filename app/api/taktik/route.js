import { NextResponse } from 'next/server';

const NPOINT_URL = 'https://api.npoint.io/36feed7d3f00c3296cb9';

// Cargar desde npoint
async function getStore(){
  try{
    const r = await fetch(NPOINT_URL, { cache: 'no-store' });
    const data = await r.json();
    const store = { 
      custom: data.custom || [], 
      banners: data.banners || [] 
    };
    globalThis.taktikStore = store;
    return store;
  }catch(e){
    if (!globalThis.taktikStore) {
      globalThis.taktikStore = { custom: [], banners: [] };
    }
    return globalThis.taktikStore;
  }
}

// Guardar en npoint
async function saveStore(){
  try{
    await fetch(NPOINT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(globalThis.taktikStore)
    });
  }catch(e){
    console.log("Error guardando en npoint", e);
  }
}

if (!globalThis.taktikStore) {
  globalThis.taktikStore = { custom: [], banners: [] };
}

export async function GET(){
  const store = await getStore();
  return NextResponse.json(store, { headers:{'Cache-Control':'no-store, no-cache, must-revalidate'} });
}

export async function POST(req){
  const body = await req.json();
  if (!globalThis.taktikStore) globalThis.taktikStore = { custom: [], banners: [] };

  // Si vienen banners del admin #1 al #10
  if (body.banners) {
    globalThis.taktikStore.banners = body.banners;
    await saveStore();
    return NextResponse.json({ ok: true, banners: body.banners });
  }

  // Si es noticia custom
  if (body.title) {
    const item = { ...body, createdAt: new Date().toISOString() };
    globalThis.taktikStore.custom.unshift(item);
    globalThis.taktikStore.custom = globalThis.taktikStore.custom.slice(0,50);
    await saveStore();
    return NextResponse.json({ ok: true, item });
  }

  return NextResponse.json({ ok: true });
}
