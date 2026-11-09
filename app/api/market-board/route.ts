import { marketBoard } from '@/lib/market-board';
export const dynamic='force-dynamic';
export async function GET(){
  const quotes=await marketBoard.get();
  return Response.json({quotes,checkedAt:new Date().toISOString(),refreshSeconds:300},{headers:{'Cache-Control':quotes.length?'public, max-age=30':'no-store'}});
}
