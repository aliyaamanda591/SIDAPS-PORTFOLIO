import assert from 'node:assert/strict';
import {withoutUnusedStarterCards} from '../lib/starter-portfolio.ts';
import {validateState} from '../lib/state-validation.ts';
const templates=[['BMRI','stock','BMRI.JK','lembar'],['BUMI','stock','BUMI.JK','lembar'],['BTC INDODAX','crypto','bitcoin','BTC'],['BBCA','stock','BBCA.JK','lembar'],['EMAS K24','gold24','XAU','gram'],['EMAS K15','gold15','XAU','gram']];
const raw={transactions:[],assets:templates.map(([name,kind,symbol,unit])=>({name,kind,symbol,unit,quantity:0,valueSnapshot:0,manualPrice:null})),profile:{displayName:'Member',photo:''},logs:[{t:'2026-11-09T11:00:00Z',m:'Login berhasil'}],sheetUrl:'',lastBackup:''};
const state=validateState(raw),original=JSON.stringify(state),clean=withoutUnusedStarterCards(state);
assert.equal(clean.assets.length,0);assert.equal(JSON.stringify(state),original,'Read compatibility never mutates the stored portfolio');assert.deepEqual(clean.profile,state.profile);assert.deepEqual(clean.logs,state.logs);
for(const patch of [{quantity:1},{valueSnapshot:1},{manualPrice:10},{archived:true},{company:'Chosen by member'},{symbol:'CUSTOM'}]){const chosen=structuredClone(state);Object.assign(chosen.assets[0],patch);assert.equal(withoutUnusedStarterCards(chosen),chosen,'An edited/owned card preserves the complete state');}
const transactionState={...state,transactions:[{id:'buy',amount:10}]};assert.equal(withoutUnusedStarterCards(transactionState),transactionState,'Any transaction preserves all cards');
const custom={...state,assets:[{...state.assets[0],name:'AALI'}]};assert.equal(withoutUnusedStarterCards(custom),custom,'User-added zero-unit watchlist remains intact');
const empty={...state,assets:[]};assert.equal(withoutUnusedStarterCards(empty),empty);
console.log('PASS: unused starter compatibility, empty accounts, preserved holdings, prices, archives, chosen watchlists, transactions, profile/logs and nonmutating reads.');
