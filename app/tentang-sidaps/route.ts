import { aboutHtml } from '../../lib/about-html';

// Public product information; never reads an account, session or portfolio.
export function GET() {
  return new Response(aboutHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'same-origin',
    },
  });
}
