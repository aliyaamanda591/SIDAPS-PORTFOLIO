import type { GoogleIdentity } from './firebase-google';
type Credential={user_id:string;version:number};
export async function linkVerifiedGoogleAccount(db:D1Database,google:GoogleIdentity):Promise<Credential>{
 const get=()=>db.prepare('SELECT user_id,version FROM credentials WHERE email=?').bind(google.email).first<Credential>();
 let credential=await get();
 if(!credential){
  const account=await db.prepare('SELECT user_id FROM accounts WHERE lower(email)=? ORDER BY created_at LIMIT 1').bind(google.email).first<{user_id:string}>();
  const userId=account?.user_id||'google_'+google.uid,now=new Date().toISOString();
  await db.batch([db.prepare('INSERT INTO accounts (user_id,email,display_name,created_at,last_seen_at) VALUES (?,?,?,?,?) ON CONFLICT(user_id) DO NOTHING').bind(userId,google.email,google.displayName,now,now),db.prepare('INSERT INTO credentials (user_id,email,password_hash,recovery_hash,version,email_verified,updated_at) VALUES (?,?,?,?,1,1,?) ON CONFLICT(email) DO NOTHING').bind(userId,google.email,'!firebase-google-only','',now)]);
  credential=await get();
 }
 if(!credential)throw Error('Akun belum berhasil dihubungkan.');
 await db.batch([db.prepare('UPDATE credentials SET email_verified=1 WHERE user_id=?').bind(credential.user_id),db.prepare('UPDATE accounts SET last_seen_at=? WHERE user_id=?').bind(new Date().toISOString(),credential.user_id)]);
 return credential;
}
