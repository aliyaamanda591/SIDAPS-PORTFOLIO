import { blogHtml } from '../../../lib/blog-html';

// Public editorial route: independent of authentication, accounts and market APIs.
export function GET() {
  return new Response(blogHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'same-origin',
    },
  });
}
