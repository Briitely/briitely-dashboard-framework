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

## Revenue field mapping

The dashboard recognizes both the HighLevel custom-field IDs configured for
Briitely and their merge-field keys. Each mapping can be overridden per Vercel
project when another GHL location uses different custom-field IDs:

```env
GHL_FIELD_MRR=contact.mrr
GHL_FIELD_CONTRACT_START=contact.renewal_date
GHL_FIELD_CANCELLED=contact.cancelled_date
GHL_FIELD_ONE_TIME_FEE=opportunity.onetime_fee
GHL_FIELD_WON_DATE=opportunity.won_date
```

One-Time Fee and Won Date are read from opportunity records. MRR, contract
dates, referral source, and package are read from contact records.
