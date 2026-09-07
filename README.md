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
GHL_FIELD_DIRECT_REFERRER=contact.direct_referrer
GHL_FIELD_REVENUE_REFERRER=contact.revenue_referrer
GHL_FIELD_ONE_TIME_FEE=opportunity.onetime_fee
GHL_FIELD_WON_DATE=opportunity.won_date
```

One-Time Fee and Won Date are read from opportunity records. MRR, contract
dates, referral source, package, Direct Referrer, and Revenue Referrer are read
from contact records.

### Referral attribution

The framework separates acquisition source from individual referral credit:

- **Referral Source** answers where the business came from (for example BNI,
  Breakfast Club, Referral, Website, or Trade Show).
- **Direct Referrer** records the person or client who made the immediate
  introduction.
- **Revenue Referrer** records the original individual who should receive
  ongoing revenue credit. If Revenue Referrer is blank, the dashboard falls
  back to Direct Referrer.

The Acquisition table groups revenue by Referral Source. Sources with attributed
referrers can be expanded to show each Revenue Referrer, their client count, and
the total revenue credited to them. This supports cascading attribution: a client
referred by an existing referred client can retain the new client's Direct
Referrer while assigning Revenue Referrer to the original person who should
receive ongoing credit.
