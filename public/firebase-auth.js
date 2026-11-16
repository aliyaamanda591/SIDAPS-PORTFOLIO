/* Firebase owns signup, password checks, email verification and reset emails.
   SIDAPS receives only a verified ID token; portfolio storage remains private. */
(()=>{
 if(new URL(location.href).searchParams.get('demo')==='1')return;
 const $=id=>document.getElementById(id),form=$('emailAuthForm');if(!form)return;
 const nativeFetch=window.fetch.bind(window),current=()=>typeof getAuth==='function'?getAuth():null;
 let sdk=null,preparing=null,busy=false,exchanging=false,leaving=false,verificationUser=null,resendAt=0,resendTimer=null,resetAt=0;
 const verify=document.createElement('section');verify.id='firebaseVerification';verify.hidden=true;verify.className='firebase-verification';
 verify.innerHTML='<p id="firebaseVerifyIntro"></p><p>Tekan tautan verifikasi dari Firebase di kotak masuk atau folder Spam. Setelah selesai, kembali ke halaman ini.</p><button type="button" class="btn primary" id="firebaseVerifyCheck">Sudah verifikasi, lanjutkan</button><button type="button" class="btn soft" id="firebaseVerifyResend">Kirim ulang email</button><button type="button" class="btn ghost" id="firebaseVerifyCancel">Gunakan akun lain</button>';
 form.after(verify);
 verify.after($('emailAuthMessage'));
 const legacy=document.createElement('button');legacy.type='button';legacy.className='firebase-legacy-help';legacy.textContent='Akun lama? Hubungkan dengan email yang sama';form.after(legacy);
 function status(text,state=''){$('emailAuthMessage').textContent=text;$('emailAuthMessage').setAttribute('data-state',state);}
 function googleStatus(text,state=''){const el=$('googleAuthMessage');if(el){el.textContent=text;el.setAttribute('data-state',state);}}
 function errorText(error){return ({'auth/invalid-credential':'Email atau sandi tidak sesuai. Akun lama yang belum memakai Firebase perlu didaftarkan sekali dengan email yang sama.',
  'auth/user-not-found':'Jika email ini belum ada di Firebase, daftar sekali dengan email yang sama untuk menghubungkan akun lama.',
  'auth/wrong-password':'Email atau sandi tidak sesuai. Gunakan Lupa sandi bila diperlukan.',
  'auth/email-already-in-use':'Email sudah terdaftar di Firebase. Gunakan Masuk, Google, atau Lupa sandi.',
  'auth/weak-password':'Gunakan sandi yang memenuhi kebijakan Firebase dan minimal 12 karakter.',
  'auth/password-does-not-meet-requirements':'Sandi belum memenuhi kebijakan keamanan Firebase.',
  'auth/invalid-email':'Masukkan alamat email yang valid.',
  'auth/operation-not-allowed':'Metode login ini belum diaktifkan di Firebase. Hubungi pengelola.',
  'auth/too-many-requests':'Terlalu banyak percobaan. Tunggu sebentar sebelum mencoba lagi.',
  'auth/network-request-failed':'Koneksi ke Firebase terputus. Periksa internet dan coba lagi.',
  'auth/unauthorized-domain':'Alamat website belum diizinkan di Firebase Authentication.',
  'auth/account-exists-with-different-credential':'Email ini memakai metode masuk lain. Masuk dengan metode sebelumnya, lalu hubungkan penyedia di Firebase.',
  'auth/popup-closed-by-user':'Login Google dibatalkan.',
  'auth/cancelled-popup-request':'Jendela login sebelumnya dibatalkan.',
  'auth/popup-blocked':'Izinkan popup untuk website ini, lalu coba Google kembali.',
  'auth/user-disabled':'Akun dinonaktifkan. Hubungi pengelola.',
  'auth/requires-recent-login':'Masuk kembali sebelum melanjutkan.',
 })[error?.code]||error?.message||'Autentikasi belum berhasil. Silakan coba lagi.';}
 function buttons(on){$('emailSubmit').disabled=on;const button=$('googleSignInButton');if(button)button.disabled=on;}
 async function exchange(user,navigate){
  if(leaving||exchanging)return;exchanging=true;
  try{
   if(!user.emailVerified)throw Error('Verifikasi email terlebih dahulu.');
   const idToken=await user.getIdToken();await emailAuthRequest('firebase',{idToken});
   if(navigate){leaving=true;if(window.SidapsLoginExperience)await window.SidapsLoginExperience.authenticated();else location.reload();}
  }finally{exchanging=false;}
 }
 async function prepare(){
  if(sdk)return sdk;if(preparing)return preparing;
  preparing=(async()=>{
   const [configResponse,appSdk,authSdk]=await Promise.all([
    nativeFetch('/api/auth/config',{cache:'no-store',signal:AbortSignal.timeout(10000)}),
    import('https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js'),
   ]);
   const config=await configResponse.json();if(!configResponse.ok)throw Error(config.error||'Konfigurasi Firebase belum siap.');
   const app=appSdk.getApps().find(a=>a.name==='sidaps-auth')||appSdk.initializeApp(config,'sidaps-auth'),auth=authSdk.getAuth(app);
   await authSdk.setPersistence(auth,authSdk.browserLocalPersistence);auth.languageCode='id';
   sdk={authSdk,auth,provider:new authSdk.GoogleAuthProvider()};
   authSdk.onIdTokenChanged(auth,async user=>{
    if(busy||leaving||!user||sessionStorage.getItem('sidaps_firebase_logout')==='1')return;
    try{
     if(current()){
      if(user.email?.toLowerCase()===current().email?.toLowerCase()&&user.emailVerified)await exchange(user,false);
     }else if(user.emailVerified)await exchange(user,true);else showVerification(user);
    }catch(error){if(!current())status(errorText(error),'error');}
   });
   return sdk;
  })().catch(error=>{preparing=null;throw error;});return preparing;
 }
 function countdown(){clearTimeout(resendTimer);if(verify.hidden)return;const n=Math.max(0,Math.ceil((resendAt-Date.now())/1000));$('firebaseVerifyResend').textContent=n?'Kirim ulang dalam '+n+' dtk':'Kirim ulang email';$('firebaseVerifyResend').disabled=busy||n>0;if(n)resendTimer=setTimeout(countdown,1000);}
 function showVerification(user){verificationUser=user;form.hidden=true;verify.hidden=false;legacy.hidden=true;$('authTitle').textContent='Verifikasi email';$('authSub').textContent='Satu langkah lagi sebelum membuka portofolio Anda.';$('firebaseVerifyIntro').textContent='Email: '+user.email;countdown();}
 function modeChanged(){
  if(busy)return;verificationUser=null;verify.hidden=true;form.hidden=false;legacy.hidden=!!current();clearTimeout(resendTimer);
  if(emailAuthMode==='recover')status('Akun lama yang belum ada di Firebase: daftar sekali memakai email yang sama, lalu verifikasi email.');
 }
 const baseMode=window.cloudAuthSetMode;window.cloudAuthSetMode=mode=>{if(!busy&&!leaving)baseMode(mode);};
 legacy.onclick=()=>{if(busy)return;cloudAuthSetMode('register');status('Gunakan email akun lama yang sama. Setelah email diverifikasi, SIDAPS akan menghubungkan portofolio lama, tanpa membuat salinannya.');};
 form.onsubmit=async event=>{
  event.preventDefault();if(busy||leaving)return;busy=true;sessionStorage.removeItem('sidaps_firebase_logout');buttons(true);status('Menghubungkan ke Firebase…');
  try{
   const {authSdk,auth}=await prepare(),email=$('emailAddress').value.trim(),password=$('emailPassword').value;
   if(emailAuthMode==='recover'){
    if(Date.now()<resetAt)throw Error('Tunggu 60 detik sebelum meminta tautan lagi.');
    try{await authSdk.sendPasswordResetEmail(auth,email);}catch(error){if(error.code!=='auth/user-not-found')throw error;}
    resetAt=Date.now()+60000;status('Jika email terdaftar di Firebase, tautan pemulihan dikirim ke email tersebut. Periksa kotak masuk dan Spam.','success');return;
   }
   if(emailAuthMode==='register'){
    if(password.length<12)throw Error('Sandi minimal 12 karakter.');if(password!==$('emailConfirm').value)throw Error('Konfirmasi sandi tidak sama.');
    const name=$('emailName').value.trim();if(name.length<2||name.length>60)throw Error('Nama tampilan harus 2–60 karakter.');
    const result=await authSdk.createUserWithEmailAndPassword(auth,email,password);await authSdk.updateProfile(result.user,{displayName:name});
    showVerification(result.user);
    try{await authSdk.sendEmailVerification(result.user);resendAt=Date.now()+60000;status('Email verifikasi Firebase telah diminta. Periksa inbox dan Spam.','success');}catch(error){status('Akun sudah dibuat, tetapi email verifikasi belum berhasil dikirim. '+errorText(error),'error');}
   }else{
    const result=await authSdk.signInWithEmailAndPassword(auth,email,password);
    if(!result.user.emailVerified){showVerification(result.user);status('Verifikasi email sebelum membuka portofolio. Gunakan Kirim ulang jika diperlukan.');}
    else await exchange(result.user,true);
   }
  }catch(error){status(errorText(error),'error');}
  finally{busy=false;buttons(false);$('emailPassword').value='';$('emailConfirm').value='';countdown();}
 };
 $('firebaseVerifyResend').onclick=async()=>{
  if(busy||!verificationUser||Date.now()<resendAt)return;busy=true;countdown();
  try{const {authSdk}=await prepare();await authSdk.sendEmailVerification(verificationUser);resendAt=Date.now()+60000;status('Email verifikasi diminta kembali. Periksa inbox dan Spam.','success');}catch(error){status(errorText(error),'error');}finally{busy=false;countdown();}
 };
 $('firebaseVerifyCheck').onclick=async()=>{
  if(busy||!verificationUser)return;busy=true;$('firebaseVerifyCheck').disabled=true;
  try{const {authSdk}=await prepare();await authSdk.reload(verificationUser);if(!verificationUser.emailVerified)throw Error('Email belum terverifikasi. Tekan tautan di email terlebih dahulu.');await verificationUser.getIdToken(true);await exchange(verificationUser,true);}catch(error){status(errorText(error),'error');}finally{busy=false;$('firebaseVerifyCheck').disabled=false;}
 };
 $('firebaseVerifyCancel').onclick=async()=>{if(busy)return;busy=true;try{const s=await prepare();await s.authSdk.signOut(s.auth);}finally{busy=false;cloudAuthSetMode('login');}};
 async function google(){
  if(busy||leaving)return;
  if(!sdk){try{await prepare();googleStatus('Google siap. Tekan tombol Google kembali.');}catch(error){googleStatus(errorText(error),'error');}return;}
  busy=true;sessionStorage.removeItem('sidaps_firebase_logout');buttons(true);googleStatus('Pilih akun Google…');
  try{const result=await sdk.authSdk.signInWithPopup(sdk.auth,sdk.provider);await exchange(result.user,true);}catch(error){googleStatus(errorText(error),'error');}finally{busy=false;buttons(false);}
 }
 async function signOut(){leaving=true;try{const s=await prepare();await s.authSdk.signOut(s.auth);}catch{/* Server logout already revoked the cookie. Do not restore automatically. */sessionStorage.setItem('sidaps_firebase_logout','1');}}
 function refreshSecurity(){
  const target=$('cloudPasswordForm');if(!target||!current()||target.dataset.firebaseManaged)return;target.dataset.firebaseManaged='true';
  target.innerHTML='<p id="cloudPasswordIntro">Sandi dan verifikasi akun dikelola Firebase. Minta tautan untuk mengatur ulang sandi SIDAPS melalui email akun Anda. Sandi Google/Gmail tidak berubah.</p><button type="submit" class="btn primary" id="cloudPasswordSave">Kirim tautan ubah sandi</button><p id="cloudPasswordMessage" role="status"></p>';
  target.onsubmit=async e=>{e.preventDefault();const button=$('cloudPasswordSave'),message=$('cloudPasswordMessage');button.disabled=true;
   try{const {authSdk,auth}=await prepare();await authSdk.sendPasswordResetEmail(auth,current().email);message.textContent='Tautan pemulihan Firebase telah diminta. Periksa email akun Anda.';}catch(error){message.textContent=errorText(error);}finally{button.disabled=false;}
  };
 }
 window.SidapsFirebaseAuth={prepare,google,signOut,modeChanged,refreshSecurity};
 refreshSecurity();buttons(true);
 prepare().then(async s=>{if(sessionStorage.getItem('sidaps_firebase_logout')==='1'){await s.authSdk.signOut(s.auth);sessionStorage.removeItem('sidaps_firebase_logout');}buttons(false);}).catch(error=>{buttons(false);status(errorText(error),'error');});
 window.addEventListener('pagehide',()=>clearTimeout(resendTimer));
})();
