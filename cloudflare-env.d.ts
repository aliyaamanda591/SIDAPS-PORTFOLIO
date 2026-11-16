declare namespace Cloudflare {
  interface Env {
    FIREBASE_WEB_CONFIG?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
