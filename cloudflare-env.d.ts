declare namespace Cloudflare {
  interface Env {
    RESEND_API_KEY?: string;
    BREVO_API_KEY?: string;
    MAIL_WEBHOOK_URL?: string;
    MAIL_WEBHOOK_SECRET?: string;
    AUTH_EMAIL_FROM?: string;
    OWNER_EMAIL?: string;
    APP_URL?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
