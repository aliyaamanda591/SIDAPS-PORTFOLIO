// Local-only visual fixture. No live account or financial transactions are used.
const origin='http://127.0.0.1:5178',email='mobile-'+Date.now()+'@example.test',password='Local-Mobile-Preview-2026!';
const r=await fetch(origin+'/api/auth/register',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({email,password,confirm:password,displayName:'Pratinjau HP'})});
if(!r.ok)throw Error('Local preview registration failed: '+r.status);
const cookie=r.headers.getSetCookie()[0].split(';')[0];
const state={transactions:[{id:'mobile-fixture-buy',date:'2026-11-09',type:'MASUK',trade:'buy',quantityDelta:100,amount:500000,asset:'BMRI',description:'Contoh pembelian untuk pratinjau lokal',platform:'STOCKBIT'}],assets:[{name:'BMRI',unit:'lembar',kind:'stock',symbol:'BMRI.JK',quantity:100,valueSnapshot:500000,manualPrice:null,archived:false,company:'Bank Mandiri'}],profile:{displayName:'Pratinjau HP',photo:''},logs:[],sheetUrl:'',lastBackup:''};
const saved=await fetch(origin+'/api/state',{method:'PUT',headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify({revision:0,state})});if(!saved.ok)throw Error('Local fixture save failed');
console.log(JSON.stringify({email,password,localOnly:true}));
