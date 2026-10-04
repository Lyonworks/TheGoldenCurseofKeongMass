# PHP to Next.js Migration Analysis
**The Golden Curse of Keong Mas**

---

## 1. EXISTING PROJECT STRUCTURE

### Root Directory Files
```
index.php                 → Home page (hero, about, merchandise, news, comments)
news.php                  → News listing page
news_detail.php           → Single news detail page
config/database.php       → MySQL connection (localhost:keongmas)
helpers/log.php           → Activity logging functions
layout/header.php         → Public header/nav component
layout/footer.php         → Public footer component
assets/style.css          → Custom CSS
assets/script.js          → Vanilla JavaScript
```

### Admin Panel
```
admin/login.php           → Admin login form
admin/dashboard.php       → Admin stats & recent activity
admin/about.php           → Edit about section description & images
admin/merchandise.php     → CRUD for merchandise
admin/news.php            → CRUD for news
admin/comment.php         → View & delete comments
admin/admin.php           → Admin settings
admin/logout.php          → Session terminator
admin/layout/header.php   → Admin header with sidebar nav
admin/layout/footer.php   → Admin footer
admin/assets/css/app.css  → Admin styling
```

### Processing (Backend Logic)
```
process/admin_login.php            → Handle login form submission
process/get_data.php               → Data fetching functions (getAllActivities, etc.)
process/add_news.php               → INSERT news with image upload
process/edit_news.php              → UPDATE news with image replacement
process/delete_news.php            → DELETE news
process/add_merchandise.php        → INSERT merchandise with image upload
process/edit_merchandise.php       → UPDATE merchandise
process/delete_merchandise.php     → DELETE merchandise
process/add_comment.php            → INSERT comments (threaded replies)
process/update_comment.php         → UPDATE comment by user_token
process/delete_comment.php         → DELETE comment by user_token
process/delete_comment_admin.php   → DELETE comment by admin
process/add_about.php              → INSERT about record
process/edit_about.php             → UPDATE about logic
process/update_about_desc.php      → UPDATE about description
process/update_about_image.php     → UPLOAD new about image
process/edit_about_image.php       → Rename/update about image
process/update_admin.php           → Update admin credentials
```

### Assets
```
assets/bootstrap/bootstrap-5.3.8-dist/  → Bootstrap CSS/JS
assets/aos/dist/                        → Animate On Scroll library
assets/img/news/                        → News images
assets/img/merchandise/                 → Merchandise images
assets/img/                             → General images (about, icons)
```

---

## 2. DATABASE SCHEMA

### Tables (MySQL/keongmas)

#### `admins` (Admin authentication)
```sql
id_admin    INT PRIMARY KEY AUTO_INCREMENT
username    VARCHAR(100) UNIQUE
password    VARCHAR(255) (bcrypt hashed)
```

#### `news` (Article management)
```sql
id_news     INT PRIMARY KEY AUTO_INCREMENT
title       VARCHAR(255)
content     LONGTEXT
author      VARCHAR(100)
image       VARCHAR(255) (filename only)
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### `merchandise` (Product catalog)
```sql
id          INT PRIMARY KEY AUTO_INCREMENT
name        VARCHAR(255)
description TEXT
price       INT
stock       INT
limited     BOOLEAN (0/1)
image       VARCHAR(255) (relative path)
```

#### `comments` (Forum/discussion system)
```sql
id_comments INT PRIMARY KEY AUTO_INCREMENT
name        VARCHAR(255)
message     LONGTEXT
id_parent   INT NULL (for nested replies, FK to comments.id_comments)
user_token  VARCHAR(255) (session-based, for ownership tracking)
is_read     BOOLEAN (0/1)
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

#### `about` (Static content)
```sql
id_about    INT PRIMARY KEY AUTO_INCREMENT
description LONGTEXT
```

#### `about_images` (About gallery)
```sql
id_image    INT PRIMARY KEY AUTO_INCREMENT
image       VARCHAR(255) (filename only)
```

#### `activity` (Admin audit log)
```sql
id          INT PRIMARY KEY AUTO_INCREMENT
user        VARCHAR(255)
action      VARCHAR(100)
description TEXT
created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

---

## 3. CURRENT FEATURES & FUNCTIONALITY

### Public Features
- **Home Page (index.php)**
  - Hero section with game image & CTA button (links to itch.io)
  - Embedded YouTube trailer with modal
  - About section with image gallery (clickable modals)
  - Developer info section
  - Merchandise grid with cards
  - News section (6 latest articles)
  - Comment/forum section with threaded replies
  - AOS animations on all sections

- **News Page (news.php)**
  - Full news listing
  - Card-based layout

- **News Detail (news_detail.php)**
  - Full article content
  - Author & date metadata
  - Back button to news listing

- **Comment System**
  - Public comments on home page
  - User identified by session token (not user accounts)
  - Threaded replies (nested comments)
  - Edit/delete own comments
  - Admin can delete any comment

- **Merchandise**
  - Product display with image, name, price
  - Stock & limited edition badges
  - WhatsApp order integration (hardcoded phone: 6285731590848)
  - Modal with full details & order button

### Admin Features
- **Login** (session-based)
  - Admin credentials stored in DB
  - Redirects to dashboard on success

- **Dashboard**
  - Recent activities list
  - Unread comments count
  - Merchandise count
  - News count
  - Latest 5 news preview

- **About Management**
  - Edit description
  - View/manage about images (upload new, edit)

- **Merchandise Management**
  - Add merchandise (with image upload)
  - Edit merchandise (with image replacement)
  - Delete merchandise
  - Fields: name, description, price, stock, limited flag

- **News Management**
  - Add news (with image upload)
  - Edit news (with image replacement)
  - Delete news
  - Fields: title, content, author, image

- **Comment Management**
  - View all comments (threaded)
  - Delete comments
  - Mark as read

- **Admin Settings**
  - Update admin credentials

---

## 4. AUTHENTICATION & AUTHORIZATION

### Admin Authentication
- Session-based (`$_SESSION['admin']`)
- Stores: `id_admin`, `username`
- Protected routes check `if (!isset($_SESSION['admin'])) redirect to login`
- Password verified with `password_verify()`

### User Authentication
- No registered user accounts
- Comment ownership tracked via `user_token` (random hex in session)
- Users can edit/delete only their own comments

### Security Issues (Current)
- Some SQL queries use string concatenation (SQL injection risk)
- Some use prepared statements (good)
- Password stored as bcrypt (good)
- File uploads not validated for MIME type
- No CSRF tokens in forms
- No rate limiting on comments/uploads

---

## 5. FILE UPLOAD SYSTEM

### Upload Locations
```
News images:        assets/img/news/        (server filesystem)
Merchandise images: assets/img/merchandise/ (server filesystem)
About images:       assets/img/             (server filesystem)
```

### Current Process
1. File uploaded to temp
2. Renamed: `time() . '_' . original_name`
3. Moved to target directory
4. Filename stored in DB
5. Served via direct HTTP path

---

## 6. DEPENDENCIES

### Frontend Libraries
- **Bootstrap 5.3.8** → CSS framework
- **AOS (Animate On Scroll)** → Scroll animations
- **Bootstrap JS** → Modal, navbar, dropdown

### PHP Libraries
- **MySQLi** → Database driver
- **Standard PHP** → Sessions, file handling

### External Services
- **YouTube** → Embedded video
- **WhatsApp Web** → Order links (https://wa.me/)
- **itch.io** → Game download link

---

## 7. PHP → NEXT.JS MAPPING

| PHP File | Next.js Equivalent | Notes |
|----------|-------------------|-------|
| index.php | app/page.tsx | Home page, all sections |
| news.php | app/news/page.tsx | News listing |
| news_detail.php | app/news/[id]/page.tsx | Dynamic route |
| admin/login.php | app/auth/login/page.tsx | Login form |
| admin/dashboard.php | app/admin/dashboard/page.tsx | Protected route |
| admin/about.php | app/admin/about/page.tsx | Protected route |
| admin/merchandise.php | app/admin/merchandise/page.tsx | Protected route |
| admin/news.php | app/admin/news/page.tsx | Protected route |
| admin/comment.php | app/admin/comments/page.tsx | Protected route |
| admin/admin.php | app/admin/settings/page.tsx | Protected route |
| process/*.php | app/api/route.ts | Server actions or API routes |

---

## 8. MYSQL → SUPABASE POSTGRESQL MAPPING

### Table Creation
All tables migrate 1:1 to PostgreSQL with:
- `INT PRIMARY KEY AUTO_INCREMENT` → `SERIAL PRIMARY KEY` or `INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY`
- `VARCHAR` → `VARCHAR` (same)
- `TEXT/LONGTEXT` → `TEXT`
- `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` → `TIMESTAMP DEFAULT NOW()`
- `BOOLEAN (0/1)` → `BOOLEAN`

### Foreign Keys
- `comments.id_parent` FK to `comments.id_comments`

### Indexes
- Index on `news.created_at` (for sorting)
- Index on `comments.user_token` (for comment lookup)
- Index on `comments.id_parent` (for nested queries)

---

## 9. REQUIRED SUPABASE COMPONENTS

### Tables (PostgreSQL)
1. `admins` (id, username, password)
2. `news` (id_news, title, content, author, image, created_at)
3. `merchandise` (id, name, description, price, stock, limited, image)
4. `comments` (id_comments, name, message, id_parent, user_token, is_read, created_at)
5. `about` (id_about, description)
6. `about_images` (id_image, image)
7. `activity` (id, user, action, description, created_at)

### Storage Buckets
1. `news-images` → news photos
2. `merchandise-images` → product photos
3. `about-images` → about gallery images

### RLS Policies
- `news` table: Public read, admin create/update/delete
- `merchandise` table: Public read, admin create/update/delete
- `comments` table: Public insert/read, users can update/delete own
- `about` table: Public read, admin update
- `about_images` table: Public read, admin create/delete
- `activity` table: Public read, admin create
- `admins` table: Admin only

### Supabase Auth
- Optional: Use Supabase Auth for admin login (alternative: custom table with passwords)

---

## 10. NEXT.JS PROJECT STRUCTURE

```
next-golden-curse/
├── public/
│   ├── images/
│   │   └── (game assets: keong.gif, teks.png, play.png, etc.)
│   └── icons/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    (home)
│   │   │   ├── news/
│   │   │   │   ├── page.tsx               (listing)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx           (detail)
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── logout/
│   │   │       └── route.ts
│   │   ├── admin/
│   │   │   ├── layout.tsx                 (protected)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── merchandise/
│   │   │   │   └── page.tsx
│   │   │   ├── news/
│   │   │   │   └── page.tsx
│   │   │   ├── comments/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── news/
│   │   │   │   ├── route.ts               (GET all, POST create)
│   │   │   │   └── [id]/route.ts          (GET one, PUT update, DELETE)
│   │   │   ├── merchandise/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── comments/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── about/
│   │   │   │   ├── route.ts
│   │   │   │   ├── images/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/route.ts
│   │   │   ├── admin/
│   │   │   │   ├── login/route.ts
│   │   │   │   └── profile/route.ts
│   │   │   └── activity/
│   │   │       └── route.ts
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── HomeHero.tsx
│   │   │   ├── HomeTrailer.tsx
│   │   │   ├── HomeAbout.tsx
│   │   │   ├── HomeDeveloper.tsx
│   │   │   ├── HomeMerchandise.tsx
│   │   │   ├── HomeNews.tsx
│   │   │   └── HomeComments.tsx
│   │   ├── ui/
│   │   │   ├── NewsCard.tsx
│   │   │   ├── MerchandiseCard.tsx
│   │   │   ├── CommentBox.tsx
│   │   │   └── Modal.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                  (client-side Supabase instance)
│   │   │   ├── server.ts                  (server-side Supabase instance)
│   │   │   ├── auth.ts                    (auth helpers)
│   │   │   └── middleware.ts              (protection middleware)
│   │   ├── db/
│   │   │   ├── news.ts                    (news queries)
│   │   │   ├── merchandise.ts             (merchandise queries)
│   │   │   ├── comments.ts                (comments queries)
│   │   │   ├── about.ts                   (about queries)
│   │   │   ├── admins.ts                  (admin queries)
│   │   │   └── activity.ts                (activity queries)
│   │   └── utils/
│   │       ├── validation.ts
│   │       ├── formatters.ts
│   │       └── constants.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useNews.ts
│   │   └── useMerchandise.ts
│   ├── types/
│   │   ├── index.ts                       (all TypeScript types)
│   │   ├── database.ts
│   │   └── api.ts
│   └── styles/
│       └── globals.css                    (merged from assets/style.css)
├── supabase/
│   └── migrations/
│       └── 001_create_tables.sql
├── .env.example
├── .env.local
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

---

## 11. SUPABASE RLS POLICIES

### `news` Table
```sql
-- Public read
CREATE POLICY "public_read" ON news
  FOR SELECT USING (true);

-- Admin create
CREATE POLICY "admin_create" ON news
  FOR INSERT WITH CHECK (auth.uid() = (SELECT id FROM admins LIMIT 1));

-- Admin update own
CREATE POLICY "admin_update" ON news
  FOR UPDATE USING (auth.uid() = (SELECT id FROM admins LIMIT 1));

-- Admin delete own
CREATE POLICY "admin_delete" ON news
  FOR DELETE USING (auth.uid() = (SELECT id FROM admins LIMIT 1));
```

### `comments` Table
```sql
-- Public read
CREATE POLICY "public_read" ON comments
  FOR SELECT USING (true);

-- Public insert
CREATE POLICY "public_insert" ON comments
  FOR INSERT WITH CHECK (true);

-- Users update own (by user_token)
CREATE POLICY "user_update_own" ON comments
  FOR UPDATE USING (user_token = current_setting('app.current_token'));

-- Users delete own
CREATE POLICY "user_delete_own" ON comments
  FOR DELETE USING (user_token = current_setting('app.current_token'));

-- Admin delete any
CREATE POLICY "admin_delete_any" ON comments
  FOR DELETE USING (auth.uid() = (SELECT id FROM admins LIMIT 1));
```

### Other Tables
- `merchandise`, `about`, `about_images`: Similar public read + admin write
- `activity`: Append-only for admins
- `admins`: Read-only for self, update self password

---

## 12. ENVIRONMENT VARIABLES

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx (server-side only)

# Auth
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000

# Storage
NEXT_PUBLIC_STORAGE_BUCKET_NEWS=news-images
NEXT_PUBLIC_STORAGE_BUCKET_MERCHANDISE=merchandise-images
NEXT_PUBLIC_STORAGE_BUCKET_ABOUT=about-images

# Other
NEXT_PUBLIC_WHATSAPP_PHONE=6285731590848
NEXT_PUBLIC_ITCH_IO_URL=https://ikmalionn.itch.io/the-golden-curse-of-keong-mas
```

---

## 13. MIGRATION RISKS & COMPATIBILITY

### High Priority
1. **File uploads**: Switch from local filesystem to Supabase Storage
   - Current: `assets/img/news/1234_file.jpg`
   - Future: Supabase CDN URL
   - Risk: Image references may change

2. **Session management**: Switch from PHP sessions to server actions + cookies
   - Current: `$_SESSION['user_token']` for comments
   - Future: Stored in secure cookie or database
   - Risk: User sessions may be invalidated

3. **Authentication**: Admin login refactoring
   - Current: POST form → PHP session
   - Future: Server action → Supabase or custom auth + secure cookie
   - Risk: Backwards incompatible

### Medium Priority
1. **Comment ownership**: User token tracking
   - Must preserve user_token association for edit/delete
   - Consider migration strategy for existing comments

2. **Password hashing**: Ensure bcrypt compatibility
   - Supabase Auth uses bcrypt
   - Custom table auth must also use bcrypt

3. **Timestamps**: UTC consistency
   - Current: MySQL NOW()
   - Future: PostgreSQL NOW() (same, but ensure UTC timezone)

### Low Priority
1. **Database encoding**: Ensure UTF-8 for special characters
2. **CORS**: Configure for Vercel deployment
3. **Rate limiting**: Implement for public endpoints (comments, uploads)

---

## 14. DEPLOYMENT NOTES

### Vercel Deployment
- Environment variables configured in Vercel dashboard
- Supabase connections via `NEXT_PUBLIC_SUPABASE_*` keys
- No local filesystem uploads (use Supabase Storage)
- Build command: `next build`
- Start command: `next start`

### Supabase Deployment
- Database hosted on Supabase (no migration needed post-setup)
- Storage buckets auto-replicated via CDN
- RLS policies enforced at database level

### Pre-Launch Checklist
- [ ] All images migrated to Supabase Storage
- [ ] Database schema migrated to PostgreSQL
- [ ] Admin accounts re-created in new system
- [ ] Existing comments/news/merchandise imported
- [ ] File paths updated in database (old → new CDN URLs)
- [ ] Email notifications configured (optional)
- [ ] SSL certificate verified
- [ ] Analytics configured (Vercel + Supabase)

---

## 15. SUMMARY: WHAT STAYS vs WHAT CHANGES

### Stays (Preserved)
- ✅ All visual design (colors, layout, typography)
- ✅ Bootstrap 5 grid system
- ✅ AOS animations
- ✅ All game assets (images, gifs, icons)
- ✅ Feature functionality (news, merchandise, comments, admin panel)
- ✅ URL structure (as closely as possible)

### Changes (Required)
- ❌ PHP → TypeScript/React
- ❌ MySQL → PostgreSQL (Supabase)
- ❌ Local files → Supabase Storage (CDN URLs)
- ❌ Sessions → Server actions + secure cookies
- ❌ Forms → React components
- ❌ Direct SQL → Supabase client library

### Implementation Order
1. **Phase 1**: Set up Next.js project, Supabase, TypeScript types
2. **Phase 2**: Migrate database schema
3. **Phase 3**: Create reusable components (Navbar, Footer, Cards, Modals)
4. **Phase 4**: Migrate public pages (Home, News, News Detail)
5. **Phase 5**: Migrate admin pages with auth
6. **Phase 6**: Set up file uploads → Supabase Storage
7. **Phase 7**: Connect all components to Supabase
8. **Phase 8**: Test all features end-to-end
9. **Phase 9**: Deploy to Vercel + Supabase

---

## STATUS: ANALYSIS COMPLETE ✅

**Ready to begin migration after user confirmation.**
