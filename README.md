# The Golden Curse of Keong Mas

Official website untuk indie game "The Golden Curse of Keong Mas", dibangun dengan Next.js, Supabase, dan Vercel.

## Fitur

- **Frontend Modern**: React + Next.js 16 dengan TypeScript
- **Database**: Supabase PostgreSQL (realtime, scalable)
- **Storage**: Supabase Storage untuk images
- **Hosting**: Vercel (serverless, auto-scaling)
- **Admin Panel**: Kelola news, merchandise, about, comments
- **Forum**: System komentar dengan nested replies
- **Merchandise**: Product catalog dengan stock management

## Tech Stack

- **Frontend**: React 19, Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase Client
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage
- **Auth**: Session-based (cookies)
- **Hosting**: Vercel

## Quick Start

### Prerequisites

- Node.js 20+
- npm/yarn
- Supabase account
- Vercel account

### Local Development

1. Clone repository:
   ```bash
   git clone <repo>
   cd keongmas-next
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment (see [SETUP.md](./SETUP.md)):
   ```bash
   cp .env.example .env.local
   # Edit .env.local dengan Supabase credentials
   ```

4. Run dev server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

### Admin Access

- Login page: http://localhost:3000/login
- Default: `admin` / `admin123` (change after first login)
- Dashboard: http://localhost:3000/admin

## Deployment

See [SETUP.md](./SETUP.md) untuk instruksi deployment ke Vercel.

## Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   ├── news/               # News pages
│   ├── login/              # Login page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # Reusable components
├── lib/                    # Utilities (Supabase client)
├── public/                 # Static assets
├── supabase/               # Database migrations
├── middleware.ts           # Auth middleware
└── SETUP.md                # Setup guide
```

## API Endpoints

### Public
- `GET /api/news` - List news
- `GET /api/merchandise` - List products
- `GET /api/about` - Get about section
- `GET /api/comments` - List comments (with replies)

### Public (POST)
- `POST /api/comments` - Add comment
- `POST /api/auth/login` - Admin login

### Protected (Admin)
- `POST /api/news` - Create news
- `PUT /api/news/[id]` - Update news
- `DELETE /api/news/[id]` - Delete news
- `POST /api/merchandise` - Create product
- `PUT /api/merchandise/[id]` - Update product
- `DELETE /api/merchandise/[id]` - Delete product
- `POST /api/about` - Update about section
- `DELETE /api/about/[id]` - Delete about image
- `PUT /api/comments/[id]` - Update comment
- `DELETE /api/comments/[id]` - Delete comment

## Database Schema

- `comments` - Forum comments with nested replies
- `news` - News articles
- `merchandise` - Product catalog
- `about` - About section content
- `about_images` - About section images
- `admin_users` - Admin authentication
- `activity_logs` - Action logging

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=              # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=         # Supabase anon key (public)
SUPABASE_SERVICE_ROLE_KEY=             # Service role key (server-only)
NODE_ENV=production|development        # Environment
```

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Test locally: `npm run dev`
4. Commit: `git commit -am 'Add feature'`
5. Push: `git push origin feature/name`
6. Create pull request

## License

© 2026 Ikmalion Ardyansyah. All rights reserved.

## Support

- Game itch.io: https://ikmalionn.itch.io/the-golden-curse-of-keong-mas
- Setup issues: See [SETUP.md](./SETUP.md)
