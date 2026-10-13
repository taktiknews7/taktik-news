import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'taktik.json');
const UN_DIA = 24*60*60*1000;

function leerDB(){
  try{
    if(!fs.existsSync(DB_PATH)) return { custom: [] };
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const db = JSON.parse(raw);
    // FILTRAR: solo los de menos de 24h quedan
    const ahora = Date.now();
    db.custom = (db.custom || []).filter(c => {
      const t = new Date(c.createdAt || 0).getTime();
      return ahora - t < UN_DIA;
    });
    return db;
  }catch(e){ return { custom: [] }; }
}

export async function GET(){
  const db = leerDB();
  return NextResponse.json(db, { headers:{'Cache-Control':'no-store'} });
}

export async function POST(req){
  const body = await req.json();
  const db = leerDB();
  const nuevo = {
    ...body,
    createdAt: new Date().toISOString(), // FECHA PARA QUE DURE 24H
    id: Date.now()
  };
  db.custom = [...(db.custom||[]), nuevo];
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  return NextResponse.json({ ok: true, custom: db.custom });
}
