import { resolveIdentity } from '@/lib/identity';
import { isOwner, readState } from "@/lib/account-store";
import { portfolioHtml } from "@/lib/portfolio-html";
export const dynamic="force-dynamic";
export async function GET(){
  const user=await resolveIdentity();let bootstrap:unknown=null;
  if(user){try{const stored=await readState(user);bootstrap={user:{id:user.userId,username:user.fullName||user.email,email:user.email,authMethod:user.authMethod,hasPassword:user.hasPassword,roles:isOwner(user)?["admin","developer"]:["member"]},...stored};}catch{return new Response("Database belum siap. Silakan coba beberapa saat lagi.",{status:503,headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"}});}}
  const serialized=JSON.stringify(bootstrap).replaceAll("<","\\u003c").replaceAll("\u2028","\\u2028").replaceAll("\u2029","\\u2029");
  return new Response(portfolioHtml.replace("/*__CLOUD_BOOTSTRAP__*/null",serialized),{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"private, no-store","Vary":"Cookie,oai-authenticated-user-id","X-Content-Type-Options":"nosniff","Referrer-Policy":"same-origin"}});
}
