# Briitely Dashboard Framework

Reusable Next.js foundation for Briitely client dashboards and embedded HighLevel widgets.

## Local setup

1. Install Node.js 20.
2. Copy `.env.example` to `.env.local`.
3. Add the required HighLevel credentials.
4. Run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify deployment

- Home page: `/`
- Health endpoint: `/api/health`

## Vercel

Import the GitHub repository into Vercel. The project uses Node.js 20.x and requires no custom build settings.
