// Public market quotes only. No identity, account state, cookies or database access.
import { marketPriceGET, marketPricePOST } from '@/lib/market-price-response';
export const dynamic = 'force-dynamic';
export const GET = marketPriceGET;
export const POST = marketPricePOST;
