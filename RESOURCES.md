# OAuth for MCP Resources

## Knowledge

- [Spec: MCP Authorization (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/authorization-server-discovery)
  The contract Claude follows: Protected Resource Metadata, discovery order, `resource` binding. Use for: anything "why does Claude expect X".
- [Spec: MCP Client Registration (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/client-registration)
  CIMD preferred, DCR deprecated. Use for: defending "no dynamic client registration".
- [Spec: MCP Authorization Security Considerations](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations)
  Threats specific to MCP servers. Use for: guardrail questions.
- [Tutorial: Understanding Authorization in MCP](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/authorization)
  Friendly walk-through of the same flow. Use for: first exposure before the spec.
- [Guide: OAuth 2 Simplified — Aaron Parecki](https://aaronparecki.com/oauth-2-simplified/)
  The clearest intro to roles and the authorization code flow, by the OAuth 2.1 editor. Use for: lesson 1-2 primary reading.
- [Guide: PKCE — OAuth 2.0 Simplified](https://www.oauth.com/oauth2-servers/pkce/)
  Verifier/challenge mechanics. Use for: the PKCE lesson.
- [Draft: OAuth 2.1 (draft-ietf-oauth-v2-1)](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1)
  Consolidated modern OAuth: PKCE required, no implicit, refresh rules. Use for: authoritative wording.
- [RFC 9700: OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700.html)
  Refresh token rotation/replay detection (§4.14), redirect URI rules. Use for: defending rotation + family revocation.
- [RFC 7636: PKCE](https://www.rfc-editor.org/rfc/rfc7636) · [RFC 8707: Resource Indicators](https://www.rfc-editor.org/rfc/rfc8707) · [RFC 9728: Protected Resource Metadata](https://www.rfc-editor.org/rfc/rfc9728) · [RFC 8414: AS Metadata](https://www.rfc-editor.org/rfc/rfc8414)
  The individual building blocks. Use for: exact definitions when a reviewer quotes a spec.
- [Summary: OAuth 2.1 on oauth.net](https://oauth.net/2.1/)
  One-page list of what changed from 2.0. Use for: quick refresher.

## Wisdom (Communities)
- [IETF OAuth WG mailing list](https://mailarchive.ietf.org/arch/browse/oauth/) — where the spec authors argue edge cases. Use for: reading, rarely posting.
- [MCP GitHub Discussions](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions) — implementers of MCP auth. Use for: "is this how others do CIMD/PRM?"

## Gaps
- No single source on CIMD for authorization servers (server side); rely on the MCP client-registration page + the CIMD IETF draft.
