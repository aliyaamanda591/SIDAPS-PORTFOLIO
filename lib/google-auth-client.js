let firebaseGoogleReady=null,firebaseGoogleSdk=null;
async function prepareGoogleSignIn(){
 if(firebaseGoogleReady)return firebaseGoogleReady;
 const button=document.getElementById('googleSignInButton'),message=document.getElementById('googleAuthMessage');button.disabled=true;
 firebaseGoogleReady=(async()=>{
  const [appSdk,authSdk]=await Promise.all([import('https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js')]);
  const app=appSdk.getApps().find(a=>a.name==='sidaps-google')||appSdk.initializeApp(FIREBASE_WEB_CONFIG,'sidaps-google'),auth=authSdk.getAuth(app);
  await authSdk.setPersistence(auth,authSdk.inMemoryPersistence);auth.languageCode='id';
  const provider=new authSdk.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
  firebaseGoogleSdk={authSdk,auth,provider};button.disabled=false;document.getElementById('googleSignInText').textContent='Lanjutkan dengan Google';message.textContent='';return firebaseGoogleSdk;
 })().catch(()=>{firebaseGoogleReady=null;button.disabled=false;document.getElementById('googleSignInText').textContent='Coba muat login Google';message.textContent='Login Google belum dapat dimuat. Email/password tetap bisa digunakan.';return null;});
 return firebaseGoogleReady;
}
async function googleSignIn(){
 const button=document.getElementById('googleSignInButton'),message=document.getElementById('googleAuthMessage');
 if(!firebaseGoogleSdk){await prepareGoogleSignIn();if(firebaseGoogleSdk)message.textContent='Google siap. Tekan Lanjutkan dengan Google.';return;}
 button.disabled=true;message.textContent='Pilih akun pada jendela Google…';
 try{const {authSdk,auth,provider}=firebaseGoogleSdk,result=await authSdk.signInWithPopup(auth,provider);message.textContent='Menghubungkan akun…';const idToken=await result.user.getIdToken(true);await emailAuthRequest('google',{idToken});authSdk.signOut(auth).catch(()=>{});location.reload();}
 catch(error){const messages={'auth/popup-closed-by-user':'Login Google dibatalkan.','auth/cancelled-popup-request':'Jendela login sebelumnya dibatalkan.','auth/popup-blocked':'Browser memblokir jendela Google. Izinkan popup untuk website ini lalu coba lagi.','auth/unauthorized-domain':'Domain website belum diizinkan untuk login Google.','auth/network-request-failed':'Koneksi ke Google terputus. Coba lagi.'};message.textContent=messages[error.code]||error.message||'Login Google belum berhasil. Coba lagi.';try{await firebaseGoogleSdk.authSdk.signOut(firebaseGoogleSdk.auth);}catch{}}
 finally{button.disabled=false;}
}
if(!getAuth())prepareGoogleSignIn();
