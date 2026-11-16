import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose';
import { safeGooglePhoto } from './profile-photo.js';
import type { FirebaseWebConfig } from './firebase-config';

const keys = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'), { timeoutDuration: 6500, cacheMaxAge: 3600000 });
export type FirebaseIdentity = { uid: string; email: string; displayName: string; photoURL?: string; provider: 'google.com' | 'password'; authTime: number; expiresAt: number; hasPassword?: boolean };
export async function verifyFirebaseToken(token: unknown, projectId: string, key: JWTVerifyGetKey = keys): Promise<FirebaseIdentity> {
  if (typeof token !== 'string' || token.length < 100 || token.length > 7000) throw Error('Identitas Firebase tidak valid.');
  const {payload, protectedHeader} = await jwtVerify(token, key, { algorithms:['RS256'], audience:projectId, issuer:'https://securetoken.google.com/'+projectId,
    requiredClaims:['sub','iat','exp','auth_time','email','email_verified'], maxTokenAge:'65 minutes', clockTolerance: 5 });
  const now = Math.floor(Date.now()/1000), firebase = payload.firebase as { sign_in_provider?: string; tenant?:string } | undefined, provider = firebase?.sign_in_provider;
  if (!protectedHeader.kid || !payload.sub || payload.sub.length > 128 || typeof payload.auth_time !== 'number' || payload.auth_time > now+5 || payload.auth_time < 0 || payload.auth_time > (payload.iat ?? 0)+5 || payload.email_verified !== true ||
    firebase?.tenant !== undefined || (provider !== 'google.com' && provider !== 'password') || typeof payload.email !== 'string' || payload.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) throw Error('Email Firebase belum terverifikasi atau penyedia login tidak diizinkan.');
  const photoURL = safeGooglePhoto(payload.picture);
  return { uid: payload.sub, email: payload.email.trim().toLowerCase(), displayName: typeof payload.name === 'string' && payload.name.trim() ? payload.name.trim().slice(0,60) : payload.email.split('@')[0].slice(0,60),
    ...(photoURL ? {photoURL} : {}), provider, authTime: payload.auth_time, expiresAt: payload.exp!*1000 };
}

// Signature verification alone cannot detect password reset, disabled users or
// revoked sessions. Check Firebase's native account record as well. No Admin key
// or refresh token is stored in D1. This cache bounds revocation delay to 30s.
const liveCache = new Map<string, { until: number; hasPassword: boolean }>();
export class FirebaseUnavailableError extends Error {}
export async function checkFirebaseAccount(token: string, identity: FirebaseIdentity, config: FirebaseWebConfig, sendFetch: typeof fetch = fetch, now = Date.now()) {
  const cacheKey = config.projectId+':'+token;
  const cached = sendFetch === fetch ? liveCache.get(cacheKey) : undefined;
  if (cached && cached.until > now) return {...identity, hasPassword:cached.hasPassword};
  let response:Response;
  try{response = await sendFetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key='+encodeURIComponent(config.apiKey), {
    method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:token}),signal:AbortSignal.timeout(6500),
  });}catch{throw new FirebaseUnavailableError('Koneksi Firebase belum tersedia. Coba lagi sebentar.');}
  if(response.status>=500||response.status===429||response.status===403)throw new FirebaseUnavailableError('Layanan Firebase belum tersedia. Coba lagi sebentar atau periksa konfigurasi proyek.');
  if (!response.ok) throw Error('Sesi Firebase sudah tidak berlaku. Silakan masuk kembali.');
  const data = await response.json() as { users?: { localId?:string; email?:string; emailVerified?:boolean; disabled?:boolean; validSince?:string; providerUserInfo?:{providerId?:string}[] }[] };
  const user = data.users?.[0], validSince = Number(user?.validSince);
  if (!user || user.localId !== identity.uid || user.email?.trim().toLowerCase() !== identity.email || user.emailVerified !== true || user.disabled || !Number.isFinite(validSince) || identity.authTime < validSince) throw Error('Sesi Firebase sudah dicabut atau email belum terverifikasi.');
  const hasPassword = user.providerUserInfo?.some(provider=>provider.providerId==='password') === true;
  if (sendFetch === fetch) {
    if (liveCache.size >= 300) liveCache.clear();
    liveCache.set(cacheKey,{until:Math.min(now+30_000,identity.expiresAt),hasPassword});
  }
  return {...identity,hasPassword};
}
export const FIREBASE_COOKIE = '__Host-sidaps_firebase';
export function firebaseCookie(token: string, expires: number) {
  return FIREBASE_COOKIE+'='+token+'; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age='+Math.max(0,Math.floor((expires-Date.now())/1000));
}
