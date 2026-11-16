import defaults from '../config/firebase.web.json' with { type: 'json' };

export type FirebaseWebConfig = { apiKey: string; authDomain: string; projectId: string; appId: string; storageBucket?: string; messagingSenderId?: string; measurementId?: string };
// Firebase WEB config is public by design. Never accept an Admin/service-account
// private key here; only these browser-safe fields can leave the server.
export function parseFirebaseConfig(raw?: string): FirebaseWebConfig {
  const value = raw?.trim() ? JSON.parse(raw) : defaults;
  if (!value || typeof value !== 'object' || Array.isArray(value) || value.private_key || value.client_email || value.type === 'service_account') throw Error('Gunakan Firebase Web Config, bukan service account.');
  const config: Record<string, string> = {};
  for (const key of ['apiKey','authDomain','projectId','appId','storageBucket','messagingSenderId','measurementId']) {
    if (value[key] !== undefined) {
      if (typeof value[key] !== 'string' || !value[key].trim() || value[key].length > 300) throw Error('Firebase Web Config tidak valid.');
      config[key] = value[key].trim();
    }
  }
  if (!config.apiKey || !/^[a-z0-9][a-z0-9-]{3,62}$/.test(config.projectId || '') || !/^[a-z0-9.-]+$/.test(config.authDomain || '') || !config.appId) throw Error('Firebase Web Config belum lengkap.');
  return config as FirebaseWebConfig;
}
