import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join('/tmp', 'taktik_db.json');

async function readDB(){
  try{
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  }catch(e){ 
    return { banners: [], custom: [] } 
  }
}

export async function GET(){
  const db = await readDB();
  return Response.json(db);
}

export async function POST(req){
  const body = await req.json();
  const current = await readDB();
  const nuevo = { ...current, ...body };
  await fs.writeFile(filePath, JSON.stringify(nuevo), 'utf8');
  return Response.json({ok:true, data:nuevo});
}
