// Node-only support for TypeScript's extensionless imports; no application transforms.
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {registerHooks} from 'node:module';
import ts from 'typescript';
// A test must explicitly inject its synthetic transport. Never contact Firebase/mail/production.
globalThis.fetch=async()=>{throw Error('Network disabled in offline tests; inject a synthetic transport.');};
registerHooks({
 resolve(specifier, context, next) {
  if(specifier==='cloudflare:workers')return {url:'data:text/javascript,'+encodeURIComponent('export const env = new Proxy({}, {get(){throw Error("Worker environment unavailable in offline tests; inject a synthetic environment.");}});'),shortCircuit:true};
  try{return next(specifier,context);}catch(error){
   if(/^\.\.?\//.test(specifier)&&context.parentURL){
    const base=new URL(specifier,context.parentURL);
    if(base.protocol==='file:')for(const ext of ['.ts','.tsx','.js','.mjs']){
     const url=new URL(base.href+ext);if(fs.existsSync(fileURLToPath(url)))return next(url.href,context);
    }
   }
   throw error;
  }
 },
 load(url,context,next){
  if(url.startsWith('file:')&&url.endsWith('.json'))return {format:'module',source:'export default '+fs.readFileSync(fileURLToPath(url),'utf8')+';',shortCircuit:true};
  if(url.startsWith('file:')&&url.endsWith('.ts'))return {
   format:'module',shortCircuit:true,
   source:ts.transpileModule(fs.readFileSync(fileURLToPath(url),'utf8'),{
    compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}
   }).outputText
  };
  return next(url,context);
 }
});
