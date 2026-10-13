// Shared terminology for the course: one source for the glossary page and the inline <dfn> pop-ups.
// Usage in a lesson: <dfn data-t="pkce">PKCE</dfn> ... <script src="../assets/terms.js"></script>
window.TERMS = [
  // ── Big picture
  {id: 'oauth', group: 'Big picture', term: 'OAuth 2.1', plain: 'A standard way for an app to get limited access to your account on another service without ever seeing your password. 2.1 is the cleaned-up modern version of OAuth 2.0.', amfg: 'How Claude gets permission to call AMFG tools for a user.', src: ['oauth.net: OAuth 2.1', 'https://oauth.net/2.1/']},
  {id: 'mcp', group: 'Big picture', term: 'MCP (Model Context Protocol)', plain: 'An open protocol that lets AI apps call external tools and read data in a standard way.', amfg: "engine-service's /mcp endpoint speaks MCP and offers 9 tools (get_ticket, create_part, …).", src: ['modelcontextprotocol.io', 'https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/authorization-server-discovery']},
  {id: 'connector', group: 'Big picture', term: 'Connector', plain: "Claude's name for an MCP server that a user or org has added to Claude.", amfg: '"AMFG (dev)" added under Customize → Connectors in claude.ai.', src: ['Claude docs: custom connectors', 'https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp']},
  {id: 'incoming-secret', group: 'Big picture', term: 'Incoming Secret', plain: "AMFG's existing static API key for an app. An admin creates it, it identifies the whole app (no user), and it lasts until deleted.", amfg: 'Still works on /mcp and the REST API, unchanged. OAuth is an additional way in, not a replacement.', src: ['engine-service: public-api/incoming-secret']},

  // ── Roles
  {id: 'resource-owner', group: 'Roles', term: 'Resource owner', plain: 'The person whose data is being shared and who grants access.', amfg: 'The AMFG user who clicks Allow on the consent screen.', src: ['RFC 6749 §1.1', 'https://www.rfc-editor.org/rfc/rfc6749#section-1.1']},
  {id: 'client', group: 'Roles', term: 'Client', plain: 'The app that wants access on the user’s behalf. "Client" here means an application, not a customer.', amfg: 'Claude: claude.ai in the browser, or Claude Code in a terminal.', src: ['RFC 6749 §1.1', 'https://www.rfc-editor.org/rfc/rfc6749#section-1.1']},
  {id: 'authorization-server', group: 'Roles', term: 'Authorization server (AS)', plain: 'The service that checks who is asking, shows consent, and issues codes and tokens.', amfg: 'engine-service under /public-api/v1/oauth/*.', src: ['RFC 6749 §1.1', 'https://www.rfc-editor.org/rfc/rfc6749#section-1.1']},
  {id: 'resource-server', group: 'Roles', term: 'Resource server (RS)', plain: 'The API that holds the data and accepts tokens. It may be the same service as the authorization server.', amfg: "engine-service's /mcp.", src: ['RFC 6749 §1.1', 'https://www.rfc-editor.org/rfc/rfc6749#section-1.1']},
  {id: 'public-client', group: 'Roles', term: 'Public client', plain: "A client that can't keep a secret safe (it runs on a user's machine or its code is visible), so it authenticates with PKCE instead of a client secret.", amfg: "Both Claude clients are public: token_endpoint_auth_method is 'none'.", src: ['RFC 6749 §2.1', 'https://www.rfc-editor.org/rfc/rfc6749#section-2.1']},

  // ── The flow
  {id: 'front-channel', group: 'The flow', term: 'Front channel', plain: "Messages carried by redirecting the user's browser. Anything here can leak through history, logs or extensions.", amfg: 'The trip to /authorize, the Management Console login, and the redirect back with ?code=.', src: ['Parecki: OAuth 2 Simplified', 'https://aaronparecki.com/oauth-2-simplified/']},
  {id: 'back-channel', group: 'The flow', term: 'Back channel', plain: 'Direct HTTPS calls between servers, never visible in a URL bar.', amfg: 'Claude calling /oauth/token and /mcp.', src: ['Parecki: OAuth 2 Simplified', 'https://aaronparecki.com/oauth-2-simplified/']},
  {id: 'authorization-code', group: 'The flow', term: 'Authorization code', plain: 'A short-lived, single-use value sent through the browser, which the client then swaps for tokens on the back channel.', amfg: 'Lives 5 minutes; a second use revokes the whole grant.', src: ['RFC 6749 §4.1.2', 'https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2']},
  {id: 'consent', group: 'The flow', term: 'Consent', plain: "The user's explicit decision to allow (or deny) the access the client asked for.", amfg: '"Allow Claude to access Test88?" with an optional Read-only checkbox.', src: ['MCP security considerations', 'https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations']},
  {id: 'redirect-uri', group: 'The flow', term: 'Redirect URI', plain: 'Where the authorization server sends the browser back after consent. It must match one the client registered, or the request is refused.', amfg: 'claude.ai: https://claude.ai/api/mcp/auth_callback. Fragments (#) are rejected.', src: ['RFC 9700 §2.1', 'https://www.rfc-editor.org/rfc/rfc9700.html#section-2.1']},
  {id: 'loopback', group: 'The flow', term: 'Loopback redirect', plain: 'A redirect to http://localhost or 127.0.0.1, used by desktop and command-line apps that run a tiny local web server. The port changes each time, so servers must allow any port.', amfg: 'Claude Code uses http://localhost:<random>/callback; we match it ignoring the port.', src: ['RFC 8252 §7.3', 'https://www.rfc-editor.org/rfc/rfc8252#section-7.3']},
  {id: 'state', group: 'The flow', term: 'state', plain: 'A random value the client sends to /authorize and checks when the browser comes back, so nobody can inject a forged response.', amfg: 'We pass it through unchanged; Claude checks it.', src: ['RFC 6749 §10.12', 'https://www.rfc-editor.org/rfc/rfc6749#section-10.12']},
  {id: 'iss', group: 'The flow', term: 'iss (issuer identification)', plain: 'The authorization server names itself in the redirect back to the client, so a client talking to several servers cannot be tricked into mixing them up.', amfg: 'Every redirect from /approve carries iss=https://console.amfg.ai (dev: dev.example.com).', src: ['RFC 9207', 'https://www.rfc-editor.org/rfc/rfc9207']},
  {id: 'open-redirect', group: 'The flow', term: 'Open redirector', plain: 'An endpoint that redirects the browser to any URL it is given. Attackers use a trusted domain to bounce victims to a phishing page, or to collect codes.', amfg: 'An unknown client_id or unregistered redirect_uri gets a 400 page from /authorize, never a redirect.', src: ['RFC 6749 §4.1.2.1', 'https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2.1']},
  {id: 'signed-request', group: 'The flow', term: 'Signed authorization request', plain: 'Our own hand-off: engine-service packs the checked request into a signed token so the Management Console can show it but cannot change it.', amfg: '/login?oauth=<signed request>, signed with a key derived from AUTH_KEY (not AUTH_KEY itself), valid 10 minutes.', src: ['engine-service: oauth/authorization-request.js']},

  // ── Proof and identity
  {id: 'pkce', group: 'Proof & identity', term: 'PKCE', aka: 'Proof Key for Code Exchange', plain: "The client makes a random secret, sends only its hash at the start, and must show the original secret when swapping the code. A stolen code is useless without it.", amfg: 'Required on every flow; only the S256 method is accepted.', src: ['RFC 7636', 'https://www.rfc-editor.org/rfc/rfc7636']},
  {id: 'code-verifier', group: 'Proof & identity', term: 'Code verifier / code challenge', plain: 'The verifier is the random secret the client keeps. The challenge is its SHA-256 hash, sent to /authorize. The verifier is revealed only at /token.', amfg: 'We store the challenge with the code (metadata column) and check the verifier at /token.', src: ['RFC 7636 §4', 'https://www.rfc-editor.org/rfc/rfc7636#section-4']},
  {id: 's256', group: 'Proof & identity', term: 'S256', plain: 'The PKCE method where the challenge is the SHA-256 hash of the verifier. The other method, "plain", sends it unhashed and is not allowed.', amfg: 'code_challenge_method=S256 or the request is refused.', src: ['RFC 7636 §4.2', 'https://www.rfc-editor.org/rfc/rfc7636#section-4.2']},
  {id: 'code-interception', group: 'Proof & identity', term: 'Code interception', plain: 'Someone other than the client catches the redirect carrying the code (another local app, a browser extension, a log) and redeems it first.', amfg: 'The attack PKCE exists for. Most relevant to Claude Code, whose code arrives at http://localhost:<port>/callback.', src: ['RFC 7636 §1', 'https://www.rfc-editor.org/rfc/rfc7636#section-1']},
  {id: 'code-injection', group: 'Proof & identity', term: 'Code injection', plain: "The reverse attack: a stolen code is pushed into the victim's own callback, so the victim's client redeems the attacker's grant.", amfg: "Fails under PKCE: the victim's Claude holds a different verifier, so /token answers invalid_grant.", src: ['RFC 9700 §4.5', 'https://www.rfc-editor.org/rfc/rfc9700.html#section-4.5']},
  {id: 'ssrf', group: 'Proof & identity', term: 'SSRF', aka: 'Server-side request forgery', plain: 'Tricking a server into fetching a URL the attacker chose, for example an internal address the attacker cannot reach directly.', amfg: 'CIMD makes engine-service fetch the client_id URL, so we fetch only allowlisted ids, with a 5 s timeout, no redirects and a 5 KB cap.', src: ['OWASP: SSRF', 'https://owasp.org/www-community/attacks/Server_Side_Request_Forgery']},
  {id: 'client-id', group: 'Proof & identity', term: 'Client ID', plain: 'The identifier of the client app. Usually a random string handed out at registration; with CIMD it is a URL.', amfg: 'https://claude.ai/oauth/mcp-oauth-client-metadata (claude.ai) and …/claude-code-client-metadata (Claude Code).', src: ['RFC 6749 §2.2', 'https://www.rfc-editor.org/rfc/rfc6749#section-2.2']},
  {id: 'cimd', group: 'Proof & identity', term: 'CIMD', aka: 'Client ID Metadata Document', plain: 'The client ID is an HTTPS URL. The authorization server fetches that URL to read a JSON document naming the client and its allowed redirect URIs. No registration step is needed.', amfg: 'claude.ai showed "Use Claude’s published identity — Detected". We allow only the Claude URLs plus configured extras.', src: ['MCP client registration', 'https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/client-registration']},
  {id: 'dcr', group: 'Proof & identity', term: 'DCR', aka: 'Dynamic Client Registration', plain: 'A client registers itself through an API to get a client ID. MCP 2026-07-28 deprecates it in favour of CIMD.', amfg: "Not supported: it would let anyone create clients and fill the database.", src: ['RFC 7591', 'https://www.rfc-editor.org/rfc/rfc7591']},
  {id: 'pinned-metadata', group: 'Proof & identity', term: 'Pinned metadata', plain: "Our built-in copy of Claude's CIMD documents, used when fetching the live document fails.", amfg: "claude.ai's bot protection sometimes blocks server fetches (claude-ai-mcp#650); the pinned copy is cached for 60 seconds.", src: ['engine-service: oauth/clients.js']},

  // ── Discovery
  {id: 'well-known', group: 'Discovery', term: '/.well-known/', plain: 'A standard URL prefix where a site publishes machine-readable information, so clients know where to look without being told.', amfg: '/.well-known/oauth-authorization-server and /.well-known/oauth-protected-resource/mcp at the host root.', src: ['RFC 8615', 'https://www.rfc-editor.org/rfc/rfc8615']},
  {id: 'www-authenticate', group: 'Discovery', term: 'WWW-Authenticate header', plain: 'The header a 401 or 403 response uses to say how to authenticate. MCP puts the address of the protected resource metadata in it.', amfg: 'Bearer resource_metadata="…/oauth/protected-resource", scope="mcp:read mcp:write".', src: ['RFC 9728 §5.1', 'https://www.rfc-editor.org/rfc/rfc9728#section-5.1']},
  {id: 'prm', group: 'Discovery', term: 'Protected Resource Metadata (PRM)', plain: 'A JSON document published by the API that says "I am this resource, and this is my authorization server".', amfg: '{"resource":"https://console.amfg.ai/mcp","authorization_servers":["https://console.amfg.ai"], …}', src: ['RFC 9728', 'https://www.rfc-editor.org/rfc/rfc9728']},
  {id: 'as-metadata', group: 'Discovery', term: 'Authorization Server Metadata', plain: "A JSON document listing the authorization server's endpoints and what it supports (PKCE methods, grant types, CIMD…).", amfg: 'Served at /.well-known/oauth-authorization-server; includes client_id_metadata_document_supported: true.', src: ['RFC 8414', 'https://www.rfc-editor.org/rfc/rfc8414']},
  {id: 'issuer', group: 'Discovery', term: 'Issuer', plain: "The authorization server's identity: a base URL that must match where its metadata was fetched from.", amfg: 'https://console.amfg.ai, set by MCP_OAUTH_ISSUER (dev: https://dev.example.com).', src: ['RFC 8414 §2', 'https://www.rfc-editor.org/rfc/rfc8414#section-2']},
  {id: 'resource-indicator', group: 'Discovery', term: 'Resource indicator (resource)', plain: 'A parameter naming which API the token is for, so a token for one API cannot be replayed against another.', amfg: 'resource=https://console.amfg.ai/mcp; anything else gets invalid_target. Stored on every token row and checked on every call.', src: ['RFC 8707', 'https://www.rfc-editor.org/rfc/rfc8707']},

  // ── Tokens
  {id: 'access-token', group: 'Tokens', term: 'Access token', plain: 'The credential the client sends with every API call. Short-lived on purpose.', amfg: '1 hour; sent to /mcp as Authorization: Bearer <token>.', src: ['RFC 6749 §1.4', 'https://www.rfc-editor.org/rfc/rfc6749#section-1.4']},
  {id: 'refresh-token', group: 'Tokens', term: 'Refresh token', plain: 'A longer-lived credential used only at /token to get a new access token without asking the user again.', amfg: '30 days; issued because Claude asks for offline_access.', src: ['RFC 6749 §1.5', 'https://www.rfc-editor.org/rfc/rfc6749#section-1.5']},
  {id: 'bearer', group: 'Tokens', term: 'Bearer token', plain: 'A token that works for whoever holds it, like cash. That is why tokens must be short-lived, sent only over HTTPS, and never stored in plain text.', amfg: 'Our access tokens are bearer tokens; the database keeps only their hashes.', src: ['RFC 6750', 'https://www.rfc-editor.org/rfc/rfc6750']},
  {id: 'rotation', group: 'Tokens', term: 'Refresh token rotation', plain: 'Every refresh returns a new refresh token and invalidates the old one, so a stolen refresh token stops working as soon as either party uses it.', amfg: 'The old row gets revoked_at; the new tokens share the same family_id.', src: ['RFC 9700 §4.14', 'https://www.rfc-editor.org/rfc/rfc9700.html#section-4.14']},
  {id: 'grant', group: 'Tokens', term: 'Grant (token family)', plain: 'Everything that comes from one Allow click: the code and every access and refresh token rotated from it.', amfg: 'Rows sharing one family_id. Revoking the family disconnects Claude completely.', src: ['engine-service: oauth/model.js']},
  {id: 'replay', group: 'Tokens', term: 'Replay', plain: 'Using a code or refresh token that was already used. Legitimate clients never do this, so it means a copy was stolen.', amfg: 'Detected because used rows are kept as revoked; the whole family is revoked at once.', src: ['RFC 9700 §4.14', 'https://www.rfc-editor.org/rfc/rfc9700.html#section-4.14']},
  {id: 'revocation', group: 'Tokens', term: 'Revocation', plain: 'Invalidating a token before it expires.', amfg: 'POST /oauth/revoke (RFC 7009) revokes the whole grant; also used automatically on replay.', src: ['RFC 7009', 'https://www.rfc-editor.org/rfc/rfc7009']},
  {id: 'opaque-token', group: 'Tokens', term: 'Opaque token', plain: 'A token that is just a random string. Its meaning lives in the server database, unlike a JWT, which carries its claims inside and is checked by signature.', amfg: 'Ours are opaque: every /mcp call looks up the token hash, so revocation takes effect immediately.', src: ['RFC 9068 (the JWT alternative)', 'https://www.rfc-editor.org/rfc/rfc9068']},
  {id: 'hash', group: 'Tokens', term: 'Hash (SHA-256)', plain: "A one-way fingerprint: easy to compute from the token, impossible to turn back into the token.", amfg: 'oauth_tokens.token_hash. A database leak exposes no usable tokens. Tokens are 256 random bits, so no salt is needed.', src: ['RFC 9700 §4.14 (protect tokens at rest)', 'https://www.rfc-editor.org/rfc/rfc9700.html#section-4.14']},

  // ── Permissions
  {id: 'scope', group: 'Permissions', term: 'Scope', plain: 'A named permission included in a token.', amfg: 'mcp:read (get tools), mcp:write (create/update tools), offline_access (gives a refresh token).', src: ['RFC 6749 §3.3', 'https://www.rfc-editor.org/rfc/rfc6749#section-3.3']},
  {id: 'read-only', group: 'Permissions', term: 'Read-only access', plain: 'Our consent option that grants mcp:read without mcp:write.', amfg: 'The "Read-only access" checkbox on the consent screen.', src: ['engine-service: oauth/config.js']},
  {id: 'step-up', group: 'Permissions', term: 'Step-up (insufficient_scope)', plain: 'A 403 response saying "your token is valid but needs more scopes". The client can then ask the user for more access.', amfg: 'A read-only token calling create_ticket gets 403 with error="insufficient_scope", scope="mcp:read mcp:write".', src: ['RFC 6750 §3.1', 'https://www.rfc-editor.org/rfc/rfc6750#section-3.1']},
  {id: '401-403', group: 'Permissions', term: '401 vs 403', plain: '401 means "no valid token: sign in". 403 means "valid token, but not allowed to do this".', amfg: 'No or expired token on /mcp → 401. Read-only token on a write tool → 403.', src: ['RFC 6750 §3.1', 'https://www.rfc-editor.org/rfc/rfc6750#section-3.1']},
  {id: 'read-only-hint', group: 'Permissions', term: 'Tool annotations (readOnlyHint)', plain: 'MCP metadata on each tool saying whether it only reads, overwrites, deletes, and so on.', amfg: 'readOnlyHint decides each tool’s required scope; claude.ai groups the tools by it (3 read-only, 6 write/delete).', src: ['MCP tools spec', 'https://modelcontextprotocol.io/specification/2026-07-28/server/tools']},
  {id: 'app-scoped', group: 'Permissions', term: 'App-scoped identity', plain: "Tools run as the app, not as the individual user, exactly like an Incoming Secret.", amfg: 'Downstream calls carry userId -1 and the appId; the real user is kept on the token row and in authInfo.', src: ['engine-service: resolve-app-by-oauth-token.js']},

  // ── AMFG infrastructure
  {id: 'oauth-tokens-table', group: 'AMFG infrastructure', term: 'oauth_tokens table', plain: 'The new engine-service table holding one row per issued code or token. It stores hashes only.', amfg: 'Columns: type, token_hash, app_id, user_id, client_id, scope, resource, family_id, metadata, expires_at, revoked_at.', src: ['Migration 20260929120000-add-oauth-tokens']},
  {id: 'cleanup-job', group: 'AMFG infrastructure', term: 'OAuthTokenCleanup job', plain: 'An hourly job that deletes old grants.', amfg: 'Deletes a family only when every token in it has been expired for more than a day, so replays are still caught until then.', src: ['engine-service: jobs/oauth-token-cleanup.js']},
  {id: 'issuer-flag', group: 'AMFG infrastructure', term: 'MCP_OAUTH_ISSUER', plain: 'The environment variable that switches the whole OAuth feature on and sets the issuer URL.', amfg: 'Unset → all /oauth routes return 404 and /mcp accepts only Incoming Secrets. Set on the dev environment; off in prod until release.', src: ['engine-service: oauth/config.js']},
  {id: 'root-paths', group: 'AMFG infrastructure', term: 'Root paths', plain: 'engine-service answers /mcp and the two /.well-known/ documents at the host root, not only under /engine-service/….', amfg: 'public-api/root-paths.js rewrites them to the /public-api/v1 routes.', src: ['engine-service: public-api/root-paths.js']},
  {id: 'rewrite-target', group: 'AMFG infrastructure', term: 'rewrite-target', plain: 'An ingress-nginx annotation that rewrites the request path before forwarding it. It is set on the whole Ingress object, so every rule in it gets the same rewrite.', amfg: "engine-service doesn't use it: it receives /engine-service/… unchanged and strips its own prefix. So /mcp arrives as-is, and root-paths.js maps it.", src: ['ingress-nginx: rewrite', 'https://kubernetes.github.io/ingress-nginx/examples/rewrite/']},
  {id: 'ingress', group: 'AMFG infrastructure', term: 'Ingress (Exact rules)', plain: 'The Kubernetes component that routes incoming URLs to services. An Exact rule matches one path precisely.', amfg: 'extraIngressRules send exactly /mcp and the two /.well-known paths to engine-service.', src: ['Kubernetes: Ingress', 'https://kubernetes.io/docs/concepts/services-networking/ingress/']},
  {id: 'deployment-template', group: 'AMFG infrastructure', term: 'deployment-template', plain: "AMFG's npm package that generates every environment's Kubernetes manifests from one config file.", amfg: 'extraIngressRules first appears in 4.0.8; older versions silently ignore the key. Dev runs 4.0.9; prod pins ^3.0.1.', src: ["Kubernetes: Ingress path types", "https://kubernetes.io/docs/concepts/services-networking/ingress/#path-types"]}
];

(() => {
  const byId = Object.fromEntries(window.TERMS.map((t) => [t.id, t]));
  const glossaryHref = (id) => {
    const inLessons = /\/lessons\//.test(location.pathname);
    return `${inLessons ? '../reference/' : ''}glossary.html#${id}`;
  };
  const style = document.createElement('style');
  style.textContent = `
    dfn[data-t] { font-style: normal; border-bottom: 1.5px dotted var(--accent, #1f6f78); cursor: help; position: relative; }
    .term-tip { position: absolute; z-index: 50; width: min(340px, 86vw); background: #fff; color: #1b1b1b; border: 1px solid #d9d6c8; border-top: 3px solid var(--accent, #1f6f78); border-radius: 8px; padding: 12px 14px; box-shadow: 0 12px 32px rgba(0,0,0,.14); font: 14px/1.45 var(--sans, system-ui, sans-serif); }
    .term-tip b { display: block; font-size: 15px; margin-bottom: 4px; }
    .term-tip .aka { color: #5d5d5a; font-size: 12px; margin: -2px 0 6px; }
    .term-tip .amfg { margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; color: #3a3a38; }
    .term-tip .amfg::before { content: 'In AMFG: '; font-weight: 600; color: var(--accent, #1f6f78); }
    .term-tip .links { margin-top: 8px; font-size: 12px; display: flex; gap: 12px; flex-wrap: wrap; }
    @media print { .term-tip { display: none !important; } }
  `;
  document.head.appendChild(style);

  let tip = null;
  const close = () => { tip?.remove(); tip = null; };
  const open = (el) => {
    const t = byId[el.dataset.t];
    if (!t) return;
    close();
    tip = document.createElement('div');
    tip.className = 'term-tip';
    tip.innerHTML = `<b>${t.term}</b>${t.aka ? `<div class="aka">${t.aka}</div>` : ''}<div>${t.plain}</div>${t.amfg ? `<div class="amfg">${t.amfg}</div>` : ''}
      <div class="links"><a href="${glossaryHref(t.id)}">Glossary</a>${t.src[1] ? `<a href="${t.src[1]}" target="_blank" rel="noopener">Source: ${t.src[0]}</a>` : `<span>Source: ${t.src[0]}</span>`}</div>`;
    document.body.appendChild(tip);
    const r = el.getBoundingClientRect();
    const left = Math.min(window.scrollX + r.left, window.scrollX + document.documentElement.clientWidth - tip.offsetWidth - 12);
    tip.style.left = `${Math.max(12, left)}px`;
    tip.style.top = `${window.scrollY + r.bottom + 8}px`;
  };
  document.addEventListener('mouseover', (e) => { const d = e.target.closest('dfn[data-t]'); if (d) open(d); });
  document.addEventListener('click', (e) => {
    const d = e.target.closest('dfn[data-t]');
    if (d) { e.preventDefault(); open(d); return; }
    if (tip && !e.target.closest('.term-tip')) close();
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
  document.querySelectorAll('dfn[data-t]').forEach((d) => {
    d.tabIndex = 0;
    d.addEventListener('focus', () => open(d));
    if (!byId[d.dataset.t]) console.warn('unknown term', d.dataset.t);
  });
})();
