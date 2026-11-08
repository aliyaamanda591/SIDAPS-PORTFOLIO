import { env } from "cloudflare:workers";
import { getChatGPTUser, type ChatGPTUser } from "@/app/chatgpt-auth";
import { validateState, type PortfolioState } from "./state-validation";

export function isOwnerEmail(userEmail: string) {
  const email = (env as unknown as { OWNER_EMAIL?: string }).OWNER_EMAIL;
  return !!email && userEmail.trim().toLowerCase() === email.trim().toLowerCase();
}
export function isOwner(user: ChatGPTUser) {
  return isOwnerEmail(user.email);
}
export function database() {
  if (!env.DB) throw Error("Database belum tersedia.");
  return env.DB;
}
export async function authenticatedUser() {
  const user = await getChatGPTUser();
  if (!user) throw new Response(JSON.stringify({ error: "Silakan masuk kembali." }), { status: 401, headers: { "Content-Type": "application/json" } });
  return user;
}
export async function ensureAccount(user: ChatGPTUser, recordVisit = false) {
  await database().prepare("INSERT INTO accounts (user_id,email,display_name,created_at) VALUES (?,?,?,?) ON CONFLICT(user_id) DO NOTHING").bind(user.userId, user.email, user.displayName, new Date().toISOString()).run();
  if (recordVisit) await database().prepare("UPDATE accounts SET email=?,display_name=?,last_seen_at=? WHERE user_id=?").bind(user.email,user.displayName,new Date().toISOString(),user.userId).run();
}
export async function readState(user: ChatGPTUser) {
  await ensureAccount(user, true);
  const row = await database().prepare("SELECT data,revision FROM portfolios WHERE user_id=?").bind(user.userId).first<{ data: string; revision: number }>();
  return row ? { state: validateState(JSON.parse(row.data)), revision: row.revision } : { state: null, revision: 0 };
}
export async function writeState(user: ChatGPTUser, raw: unknown, revision: number) {
  const state: PortfolioState = validateState(raw);
  const serialized = JSON.stringify(state);
  if (serialized.length > 1900000) throw Error("Data melebihi batas penyimpanan akun.");
  await ensureAccount(user);
  await database().prepare("INSERT INTO portfolios (user_id,data,revision,updated_at) VALUES (?,?,0,?) ON CONFLICT(user_id) DO NOTHING").bind(user.userId, JSON.stringify({ ...state, transactions: [], assets: [] }), new Date().toISOString()).run();
  const updated = await database().prepare("UPDATE portfolios SET data=?,revision=revision+1,updated_at=? WHERE user_id=? AND revision=? RETURNING revision").bind(serialized, new Date().toISOString(), user.userId, revision).first<{ revision: number }>();
  if (!updated) return null;
  await database().prepare("UPDATE accounts SET profile_display_name=? WHERE user_id=?").bind(state.profile.displayName || null,user.userId).run();
  return updated.revision;
}
