import { env } from 'cloudflare:workers';
import { parseFirebaseConfig } from '@/lib/firebase-config';
export const dynamic='force-dynamic';
export async function GET(){
  try{return Response.json(parseFirebaseConfig(env.FIREBASE_WEB_CONFIG),{headers:{'Cache-Control':'public, max-age=60','X-Content-Type-Options':'nosniff'}});}
  catch{return Response.json({error:'Firebase Web Config belum lengkap. Hubungi pengelola.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
