export const OFFICIAL_PORTFOLIO_HOST = 'sidaps.online';
export const OFFICIAL_PORTFOLIO_ORIGIN = 'https://' + OFFICIAL_PORTFOLIO_HOST;

// Use the request URL, never a forwarded host or a query-supplied destination.
export function canonicalPortfolioUrl(input:string):string|null {
 const url=new URL(input);
 const hostname=url.hostname.toLowerCase();
 const host=hostname.endsWith('.')?hostname.slice(0,-1):hostname;
 const legacy=host.endsWith('.workers.dev');
 const normalizePrimary=host===OFFICIAL_PORTFOLIO_HOST&&
  (hostname!==host||url.protocol!=='https:'||url.port!=='');
 if(!legacy&&!normalizePrimary)return null;
 url.protocol='https:';
 url.hostname=OFFICIAL_PORTFOLIO_HOST;
 url.port='';
 return url.toString();
}

export function canonicalPortfolioRedirect(request:Request):Response|null {
 const location=canonicalPortfolioUrl(request.url);
 return location?new Response(null,{status:301,headers:{
  // Redirects can carry one-use password-reset proofs in the query string.
  Location:location,'Cache-Control':'no-store'
 }}):null;
}
