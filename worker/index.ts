import handler from "vinext/server/fetch-handler";
import { runWithConnectorBinding } from "../lib/connector-context";
import type { ConnectorBinding } from "../lib/connector-contract.mjs";
import { canonicalPortfolioRedirect } from "../lib/canonical-url";

const worker = {
  fetch(request: Request, env: Cloudflare.Env, ctx: ExecutionContext<{ CONNECTORS?: ConnectorBinding }>) {
    const redirect = canonicalPortfolioRedirect(request);
    if (redirect) return redirect;
    // Worker-first routing also covers static assets on legacy hosts. Serve them
    // through the asset binding on the primary/local host, without starting auth.
    const assets = (env as Cloudflare.Env & { ASSETS?: Fetcher }).ASSETS;
    const path = new URL(request.url).pathname;
    if (assets && (request.method === 'GET' || request.method === 'HEAD') &&
        !path.startsWith('/api/') && /\.[a-z0-9]+$/i.test(path)) {
      return assets.fetch(request);
    }
    let binding = ctx.props?.CONNECTORS;
    // Local preview emulates the same request-scoped capability. This branch and
    // the auxiliary service binding are absent from production builds.
    if (import.meta.env.DEV && !binding && env.CONNECTORS) {
      const preview = env.CONNECTORS;
      const expiresAt = Date.now() + 60_000;
      binding = {
        async getContext() {
          if (Date.now() >= expiresAt) return { status: "request_context_expired" };
          return preview.getContext?.() ?? { status: "binding_unavailable" };
        },
        async invoke(connectorId, actionName, args) {
          if (Date.now() >= expiresAt) {
            return { status: "request_context_expired", message: "This request has expired. Please try again." };
          }
          return preview.invoke(connectorId, actionName, args);
        },
      };
    }
    return runWithConnectorBinding(binding, () => handler.fetch(request, env, ctx));
  },
};

export default worker;
