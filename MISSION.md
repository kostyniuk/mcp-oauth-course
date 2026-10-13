# Mission: OAuth for the AMFG ↔ Claude connector

## Why
Alex built the OAuth sign-in that lets Claude connect to AMFG and now has to explain it to the team and defend the design in review — without leaning on the agent that wrote it.

## Success looks like
- Draws the handshake from memory: who talks to whom, front vs back channel, which AMFG endpoint does what
- Answers "why not just…?" review questions in one or two sentences each: PKCE, CIMD instead of DCR, `resource`, refresh rotation, token families, hashing, separate `oauth_tokens` table, root paths
- Can read a real exchange (401 header, metadata JSON, an `oauth_tokens` row) and say what it means
- Runs a 15-minute team walkthrough using the course's reference sheets

## Constraints
- Starting point: has used OAuth ("sign in with Google"), never built it
- Short lessons; grounded in the actual engine-service code and dev recordings

## Out of scope
- OpenID Connect / ID tokens, SAML, enterprise SSO
- Sender-constrained tokens (DPoP, mTLS) beyond knowing they exist
- Writing a different OAuth server from scratch
