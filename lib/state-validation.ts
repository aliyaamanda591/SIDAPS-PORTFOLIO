import { safeGooglePhoto } from './profile-photo.js';
export type PortfolioState = {
  transactions: Record<string, unknown>[];
  assets: Record<string, unknown>[];
  profile: { displayName: string; photo: string; googlePhoto?:string; photoMode?:'google'|'custom'|'none' };
  logs: { t: string; m: string }[];
  sheetUrl: string;
  lastBackup: string;
};
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const finite = (value: unknown) => typeof value === "number" && Number.isFinite(value);
const string = (value: unknown, limit: number) => typeof value === "string" && value.length <= limit;
export function validateState(raw: unknown): PortfolioState {
  if (!object(raw) || !Array.isArray(raw.transactions) || !Array.isArray(raw.assets) || raw.transactions.length > 20000 || raw.assets.length > 200) throw Error("Data portofolio tidak valid atau terlalu besar.");
  const transactions = raw.transactions.map(t => {
    if (!object(t) || !string(t.id, 100) || !string(t.date, 10) || !/^\d{4}-\d{2}-\d{2}$/.test(String(t.date)) || !["MASUK", "KELUAR"].includes(String(t.type)) || !finite(t.amount) || Number(t.amount) <= 0 || !string(t.asset, 100) || !string(t.description ?? "", 500) || !string(t.platform ?? "", 100)) throw Error("Transaksi tidak valid.");
    const result: Record<string, unknown> = { id: t.id, date: t.date, type: t.type, amount: t.amount, asset: t.asset, description: t.description || "", platform: t.platform || "" };
    if (t.trade !== undefined) {
      if (!["buy", "sell"].includes(String(t.trade)) || !finite(t.quantityDelta) || (t.trade === "buy" && Number(t.quantityDelta) <= 0) || (t.trade === "sell" && Number(t.quantityDelta) >= 0)) throw Error("Jumlah unit transaksi tidak valid.");
      result.trade = t.trade; result.quantityDelta = t.quantityDelta;
      if (t.trade === "sell") {
        if (!finite(t.costBasis) || Number(t.costBasis) < 0 || !finite(t.realizedPnl) || Math.abs(Number(t.realizedPnl) - (Number(t.amount) - Number(t.costBasis))) > .02) throw Error("Modal penjualan tidak valid.");
        result.costBasis = t.costBasis; result.realizedPnl = t.realizedPnl;
      }
    }
    return result;
  });
  if (new Set(transactions.map(t => t.id)).size !== transactions.length) throw Error("ID transaksi berulang.");
  const assets = raw.assets.map(a => {
    if (!object(a) || !string(a.name, 100) || !string(a.unit, 30) || !["stock", "crypto", "gold24", "gold15"].includes(String(a.kind)) || (a.quantity !== null && (!finite(a.quantity) || Number(a.quantity) < 0)) || !string(a.symbol, 30) || !finite(a.valueSnapshot) || Number(a.valueSnapshot) < 0 || (a.manualPrice != null && (!finite(a.manualPrice) || Number(a.manualPrice) < 0))) throw Error("Aset tidak valid.");
    if (a.kind === "stock" && (!/^[A-Z]{4}$/.test(String(a.name)) || a.symbol !== a.name + ".JK")) throw Error("Kode saham tidak valid.");
    return { name: a.name, unit: a.unit, kind: a.kind, quantity: a.quantity, symbol: a.kind === "gold15" ? "XAU" : a.symbol, valueSnapshot: a.valueSnapshot, manualPrice: a.kind === "gold15" ? null : a.manualPrice ?? null, archived: a.archived === true, company: string(a.company, 150) ? a.company : "" };
  });
  if (new Set(assets.map(a => a.name)).size !== assets.length) throw Error("Nama aset berulang.");
  const p = object(raw.profile) ? raw.profile : {};
  const photo = typeof p.photo === "string" && p.photo.length <= 512000 && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(p.photo) ? p.photo : "";
  const googlePhoto=safeGooglePhoto(p.googlePhoto),photoMode=['google','custom','none'].includes(String(p.photoMode))?p.photoMode as 'google'|'custom'|'none':undefined;
  const profile = { displayName: typeof p.displayName === "string" ? p.displayName.trim().slice(0, 60) : "", photo,...(googlePhoto?{googlePhoto}:{}),...(photoMode?{photoMode}:{}) };
  const logs = (Array.isArray(raw.logs) ? raw.logs : []).filter(l => object(l) && string(l.m, 500) && typeof l.t === "string" && Number.isFinite(Date.parse(l.t))).slice(0, 60).map(l => ({ t: l.t as string, m: l.m as string }));
  return { transactions, assets, profile, logs, sheetUrl: string(raw.sheetUrl, 1500) ? raw.sheetUrl as string : "", lastBackup: string(raw.lastBackup, 60) ? raw.lastBackup as string : "" };
}
