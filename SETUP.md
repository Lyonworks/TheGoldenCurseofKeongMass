# Vercel + Supabase Setup Guide

## 1. Create Supabase Project

1. Go to https://supabase.com and sign up
2. Create new project (note Project URL and anon key)
3. Go to SQL Editor and run migration:
   - Copy all SQL from `supabase/migrations/001_init_schema.sql`
   - Paste into SQL Editor and execute

## 2. Create Storage Buckets

In Supabase dashboard, create these public buckets:
- `news-images`
- `merchandise-images`
- `about-images`

Set all to public (so images display without auth token)

## 3. Setup Environment Variables

Copy `.env.example` to `.env.local` and fill:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these from Supabase Settings → API

## 4. Setup Admin User

Default admin credentials (in migration):
- Username: `admin`
- Password hash: `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

To set new password:
1. Hash your password using SHA256
2. Update in Supabase: `admin_users` table

## 5. Local Testing

```bash
npm run dev
```

Visit:
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/login
- Admin Dashboard: http://localhost:3000/admin

## 6. Deploy to Vercel

```bash
git push origin main
```

Then:
1. Connect repo to Vercel (vercel.com)
2. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy

## Notes

- Images stored in Supabase Storage (not database)
- Session tokens stored in HTTP-only cookies
- All API routes are serverless functions on Vercel
- Database queries go through Supabase client library

## Migration from Old PHP

To migrate existing data from MySQL:
1. Export MySQL data as JSON/CSV
2. Transform and import to Supabase tables
3. Upload images to storage buckets
4. Update image paths in database

Contact support if you need help with data migration.
