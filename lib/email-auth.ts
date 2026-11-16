import { database } from './database';
import { digest, SESSION_COOKIE, sessionCookie } from './auth-crypto';
import { env } from 'cloudflare:workers';
import { parseFirebaseConfig } from './firebase-config';
import { verifyFirebaseToken, checkFirebaseAccount, firebaseCookie, FirebaseUnavailableError } from './firebase-identity';
import { linkFirebaseAccount } from './firebase-account-link';

export class AuthError extends Error { constructor(message:string,public status=400){super(message);} }
async function limit(key:string,max:number){const now=Date.now(),cutoff=now-15*60000;const row=await database().prepare('INSERT INTO auth_limits (key,attempts,window_start) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN window_start<? THEN 1 ELSE attempts+1 END,window_start=CASE WHEN window_start<? THEN ? ELSE window_start END RETURNING attempts').bind(await digest(key),now,cutoff,cutoff,now).first<{attempts:number}>();if(!row||row.attempts>max)throw new AuthError('Terlalu banyak percobaan. Coba lagi dalam 15 menit.',429);}
export async function handleEmailAuth(action:string,body:Record<string,unknown>,request:Request):Promise<{data:Record<string,unknown>;cookie?:string|string[]}>{
 if(action==='logout'){
  const token=request.headers.get('cookie')?.split(';').map(c=>c.trim()).find(c=>c.startsWith(SESSION_COOKIE+'='))?.slice(SESSION_COOKIE.length+1);
  if(token&&/^[a-f0-9]{64}$/.test(token))await database().prepare('DELETE FROM sessions WHERE token_hash=?').bind(await digest(token)).run();
  return {data:{ok:true,redirect:'/'},cookie:[sessionCookie('',0),firebaseCookie('',0)]};
 }
 if(['register','login','recover','request-otp','reset-otp','activate','change-password'].includes(action))throw new AuthError('Gunakan Firebase Authentication pada halaman masuk. Pemulihan sandi sekarang melalui tautan email Firebase.',410);
 if(action!=='firebase'&&action!=='google')throw new AuthError('Halaman tidak ditemukan.',404);
 await limit('firebase-ip:'+(request.headers.get('cf-connecting-ip')||'local'),60);
 let config;try{config=parseFirebaseConfig(env.FIREBASE_WEB_CONFIG);}catch{throw new AuthError('Konfigurasi Firebase belum lengkap. Hubungi pengelola.',503);}
 let identity;
 try{identity=await verifyFirebaseToken(body.idToken,config.projectId);if(action==='google'&&identity.provider!=='google.com')throw Error('Provider mismatch');identity=await checkFirebaseAccount(body.idToken as string,identity,config);}catch(error){if(error instanceof FirebaseUnavailableError)throw new AuthError(error.message,503);throw new AuthError('Sesi Firebase tidak valid, email belum terverifikasi, atau sesi sudah dicabut. Silakan masuk kembali.',401);}
 try{await linkFirebaseAccount(database(),config.projectId,identity);}catch{throw new AuthError('Akun belum berhasil dihubungkan. Data lama tetap tersimpan; hubungi pengelola jika masalah berlanjut.',409);}
 return {data:{ok:true},cookie:[firebaseCookie(body.idToken as string,identity.expiresAt),sessionCookie('',0)]};
}
