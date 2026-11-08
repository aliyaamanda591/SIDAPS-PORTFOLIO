import { env } from 'cloudflare:workers';
export function database(){if(!env.DB)throw Error('Database belum tersedia.');return env.DB;}
