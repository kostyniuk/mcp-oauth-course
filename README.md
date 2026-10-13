# OAuth for MCP: a short course

Eight short interactive lessons on how an MCP server authorizes Claude with OAuth 2.1: PKCE, discovery and the `resource` parameter, Client ID Metadata Documents instead of dynamic registration, refresh token rotation and token families, scopes and step-up, and routing the root paths. Each lesson ends with exercises; lesson 0008 is a review drill of "why not just…?" questions.

The examples come from a real implementation (AMFG's engine-service), with hostnames replaced by `example.com`.

Open `index.html` in a browser, or read it online at https://kostyniuk.github.io/mcp-oauth-course/. No build step or dependencies.
