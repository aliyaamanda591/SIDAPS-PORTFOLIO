declare namespace Cloudflare {
  interface Env {
    RESEND_API_KEY?: string;
    AUTH_EMAIL_FROM?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
