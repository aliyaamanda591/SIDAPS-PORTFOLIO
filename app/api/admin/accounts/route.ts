import { authenticatedUser, database, isOwner } from "@/lib/account-store";
export const dynamic = "force-dynamic";
export async function GET() {
  try { const user = await authenticatedUser(); if (!isOwner(user)) return Response.json({ error: "Hanya pemilik situs." }, { status: 403 }); const row = await database().prepare("SELECT COUNT(*) AS count FROM accounts").first<{count:number}>(); return Response.json({ count: row?.count || 0 }, { headers: { "Cache-Control": "private, no-store" } }); }
  catch (error) { if (error instanceof Response) return error; return Response.json({ error: "Belum tersedia." }, { status: 503 }); }
}
