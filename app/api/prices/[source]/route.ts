import { authenticatedUser } from '@/lib/account-store';
import { marketPriceGET, marketPricePOST } from '@/lib/market-price-response';
export const dynamic = 'force-dynamic';
type Context = {params: Promise<{source: string}>};
export async function GET(request: Request, context: Context) {
 try { await authenticatedUser(); return await marketPriceGET(request, context); }
 catch(error) { if(error instanceof Response)return error; return Response.json({error:'Sumber harga belum tersedia.'},{status:502}); }
}
export async function POST(request: Request, context: Context) {
 try { await authenticatedUser(); return await marketPricePOST(request, context); }
 catch(error) { if(error instanceof Response)return error; return Response.json({error:'Harga saham belum tersedia.'},{status:502}); }
}
