This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contact Inbox

Contact submissions are stored in PostgreSQL through Prisma. Create a PostgreSQL database with a hosted provider (for example, Neon or Supabase), then copy `.env.example` to `.env.local` and set `DATABASE_URL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET`. Apply the schema locally with `npx prisma migrate deploy`. Production builds also apply pending migrations, so configure these values in Vercel before deploying.

Portfolio content is versioned in `src/data/portfolio.ts` and ships with the app from GitHub. Contact messages are private runtime data stored in hosted PostgreSQL, not committed to GitHub; the deployed filesystem is not persistent storage. Never commit `.env.local` or database credentials.

Generate a session secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Choose a strong, unique admin password. Open `/admin` to review messages.

Reply drafts are saved with each message. “Open email draft” fills in the sender, subject, and response in your default mail app; send it there, then mark the message as replied in the inbox.
