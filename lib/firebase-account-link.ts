import type { FirebaseIdentity } from './firebase-identity';
import { syncVerifiedGooglePhoto } from './google-account-link';
import { digest } from './auth-crypto';

export async function findFirebaseAccount(db:D1Database, project:string, user:FirebaseIdentity) {
  const row=await db.prepare('SELECT a.user_id,a.email,a.display_name,a.profile_display_name FROM firebase_accounts f JOIN accounts a ON a.user_id=f.user_id WHERE f.project_id=? AND f.firebase_uid=?').bind(project,user.uid).first<{user_id:string;email:string;display_name:string;profile_display_name:string|null}>();
  // Account email changes need an explicit conflict-resolution flow; never
  // silently move a UID or merge two people's financial records by a new email.
  if(row && row.email.toLowerCase()!==user.email) throw Error('Email akun berubah. Hubungi pengelola untuk pemeriksaan identitas.');
  return row;
}
export async function linkFirebaseAccount(db:D1Database, project:string, user:FirebaseIdentity) {
  let linked=await findFirebaseAccount(db,project,user);
  if(!linked){
    const credential=await db.prepare('SELECT user_id FROM credentials WHERE email=?').bind(user.email).first<{user_id:string}>();
    const accounts=await db.prepare('SELECT user_id FROM accounts WHERE lower(email)=? LIMIT 2').bind(user.email).all<{user_id:string}>();
    if((accounts.results?.length??0)>1)throw Error('Ada konflik identitas akun lama. Hubungi pengelola.');
    const userId=credential?.user_id||accounts.results?.[0]?.user_id||'firebase_'+await digest(project+':'+user.uid),now=new Date().toISOString();
    await db.batch([
      db.prepare('INSERT INTO accounts (user_id,email,display_name,created_at,last_seen_at) VALUES (?,?,?,?,?) ON CONFLICT(user_id) DO NOTHING').bind(userId,user.email,user.displayName,now,now),
      db.prepare("INSERT INTO credentials (user_id,email,password_hash,recovery_hash,version,email_verified,updated_at) VALUES (?,?, '!firebase-managed','',1,1,?) ON CONFLICT(email) DO NOTHING").bind(userId,user.email,now),
      db.prepare('INSERT INTO firebase_accounts (project_id,firebase_uid,user_id,created_at) SELECT ?,?,user_id,? FROM credentials WHERE email=? ON CONFLICT(project_id,firebase_uid) DO NOTHING').bind(project,user.uid,now,user.email),
    ]);
    linked=await findFirebaseAccount(db,project,user);
    if(!linked || linked.user_id!==userId)throw Error('Identitas akun belum berhasil dihubungkan.');
  }
  await db.batch([
    // Once Firebase proves mailbox ownership, old website passwords/codes and
    // all legacy sessions must stop granting access to that same account.
    db.prepare("UPDATE credentials SET password_hash='!firebase-managed',recovery_hash='',version=version+1,email_verified=1,updated_at=? WHERE user_id=? AND (password_hash<>'!firebase-managed' OR email_verified=0)").bind(new Date().toISOString(),linked.user_id),
    db.prepare('DELETE FROM sessions WHERE user_id=?').bind(linked.user_id),
    db.prepare('UPDATE accounts SET last_seen_at=? WHERE user_id=?').bind(new Date().toISOString(),linked.user_id),
  ]);
  if(user.photoURL)try{await syncVerifiedGooglePhoto(db,linked.user_id,user.photoURL);}catch{/* Optional avatar must not prevent sign-in. */}
  return linked;
}
