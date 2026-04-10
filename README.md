# AI Resume Editor (Next.js + Firebase + OpenRouter)

This project implements an ATS-focused resume editor with:
- Firebase Auth (login/signup)
- Firebase Firestore (user and resume metadata)
- Firebase Storage (uploaded PDFs)
- OpenRouter for AI line-by-line rewrite suggestions
- Live ATS score refresh after each accepted change

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
FIREBASE_STORAGE_BUCKET=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-4o-mini
```

3. Start:

```bash
npm run dev
```

## Workflow implemented

1. User signs up / logs in.
2. User uploads PDF CV (job description optional).
3. Backend parses PDF into line-level JSON model.
4. ATS score + breakdown are computed.
5. OpenRouter returns line-level suggestions.
6. User accepts a single line change.
7. Server updates that line, recalculates ATS, and refreshes suggestions.

## Notes

- Current login endpoint validates email existence only (MVP).
- Export-to-PDF from edited document is planned next.
- You should enforce Firebase security rules in production.
