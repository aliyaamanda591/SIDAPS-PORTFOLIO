let emailAuthMode='login';
function cloudAuthSetMode(mode){
 emailAuthMode=mode;authBack.setAttribute('data-auth-mode',mode);
 const register=mode==='register',recover=mode==='recover';
 authTitle.textContent=register?'Buat akun pribadi':recover?'Pulihkan sandi':'Selamat datang';
 authSub.textContent=register?'Daftar dan verifikasi email melalui Firebase.':recover?'Firebase akan mengirim tautan untuk membuat sandi baru.':'Masuk untuk melanjutkan catatan investasimu.';
 const name=document.getElementById('emailName'),recovery=document.getElementById('emailRecovery'),password=document.getElementById('emailPassword'),confirm=document.getElementById('emailConfirm');
 document.getElementById('emailNameField').hidden=!register;name.required=register;
 document.getElementById('emailRecoveryField').hidden=true;recovery.required=false;recovery.value='';
 document.getElementById('emailConfirmField').hidden=!register;confirm.required=register;
 const passwordField=password.closest?.('.field');if(passwordField)passwordField.hidden=recover;password.required=!recover;password.minLength=register?12:1;password.autocomplete=register?'new-password':'current-password';password.value='';confirm.value='';
 document.getElementById('emailSubmit').textContent=register?'Daftar & verifikasi email':recover?'Kirim tautan pemulihan':'Masuk';document.getElementById('emailAuthMessage').textContent='';
 const security=document.getElementById('registerSecurityNote');if(security){security.hidden=!register;security.textContent='Verifikasi email diperlukan sebelum membuka portofolio. Gunakan sandi khusus SIDAPS, bukan sandi Gmail. Akun lama dapat terhubung kembali setelah email yang sama diverifikasi.';}
 window.SidapsFirebaseAuth?.modeChanged(mode);hideAllPasswords();
}
async function emailAuthRequest(action,body){const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);try{const response=await cloudNativeFetch('/api/auth/'+action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:controller.signal});let data;try{data=await response.json();}catch{throw Error('Server belum merespons dengan benar. Silakan coba lagi.');}if(!response.ok)throw Error(data.error||'Permintaan belum berhasil.');return data;}catch(error){if(controller.signal.aborted)throw Error('Koneksi terlalu lama. Periksa internet, lalu coba lagi.');throw error;}finally{clearTimeout(timeout);}}
function updateCloudPasswordForm(){window.SidapsFirebaseAuth?.refreshSecurity();}
document.getElementById('emailAuthForm').onsubmit=e=>{e.preventDefault();document.getElementById('emailAuthMessage').textContent='Autentikasi sedang disiapkan. Silakan coba lagi.';};
