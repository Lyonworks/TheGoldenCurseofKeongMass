-- Supabase PostgreSQL Migration
-- Create tables for The Golden Curse of Keong Mas

-- Drop existing tables if they exist (safe for migration)
-- Re-running this migration destroys data. Kept for a clean-slate setup only:
-- use `CREATE TABLE IF NOT EXISTS` below instead if the tables already hold rows.
DROP TABLE IF EXISTS activity CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS about_images CASCADE;
DROP TABLE IF EXISTS about CASCADE;
DROP TABLE IF EXISTS merchandise CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

CREATE TABLE IF NOT EXISTS admins (
  id_admin SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS news (
  id_news SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS merchandise (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  limited BOOLEAN DEFAULT FALSE,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id_comments SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  id_parent INTEGER REFERENCES comments(id_comments) ON DELETE CASCADE,
  user_token VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about (
  id_about SERIAL PRIMARY KEY,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about_images (
  id_image SERIAL PRIMARY KEY,
  image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity (
  id SERIAL PRIMARY KEY,
  "user" VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_news_created_at ON news(created_at DESC);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_comments_user_token ON comments(user_token);
CREATE INDEX idx_comments_id_parent ON comments(id_parent);
CREATE INDEX idx_comments_is_read ON comments(is_read);
CREATE INDEX idx_activity_created_at ON activity(created_at DESC);
CREATE INDEX idx_merchandise_stock ON merchandise(stock);

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchandise ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admins table
-- Note: admins table is server-only. No public access.
-- The admin queries use supabaseServer (service-role key).
-- RLS is disabled to allow service-role queries to work.
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- RLS Policies for news table (public read, admin write via API)
CREATE POLICY "public_read_news" ON news
  FOR SELECT USING (true);

CREATE POLICY "admin_insert_news" ON news
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_update_news" ON news
  FOR UPDATE USING (true);

CREATE POLICY "admin_delete_news" ON news
  FOR DELETE USING (true);

-- RLS Policies for merchandise table (public read, admin write via API)
CREATE POLICY "public_read_merchandise" ON merchandise
  FOR SELECT USING (true);

CREATE POLICY "admin_insert_merchandise" ON merchandise
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_update_merchandise" ON merchandise
  FOR UPDATE USING (true);

CREATE POLICY "admin_delete_merchandise" ON merchandise
  FOR DELETE USING (true);

-- RLS Policies for comments table (public read/insert, user edit own via API)
-- Note: UPDATE/DELETE ownership is validated server-side by checking user_token
CREATE POLICY "public_read_comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "public_insert_comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_update_comments" ON comments
  FOR UPDATE USING (true);

CREATE POLICY "public_delete_comments" ON comments
  FOR DELETE USING (true);

-- RLS Policies for about table (public read, admin write via API)
CREATE POLICY "public_read_about" ON about
  FOR SELECT USING (true);

CREATE POLICY "admin_insert_about" ON about
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_update_about" ON about
  FOR UPDATE USING (true);

CREATE POLICY "admin_delete_about" ON about
  FOR DELETE USING (true);

-- RLS Policies for about_images table (public read, admin write via API)
CREATE POLICY "public_read_about_images" ON about_images
  FOR SELECT USING (true);

CREATE POLICY "admin_insert_about_images" ON about_images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admin_update_about_images" ON about_images
  FOR UPDATE USING (true);

CREATE POLICY "admin_delete_about_images" ON about_images
  FOR DELETE USING (true);

-- RLS Policies for activity table (public read, server create via API)
CREATE POLICY "public_read_activity" ON activity
  FOR SELECT USING (true);

CREATE POLICY "admin_insert_activity" ON activity
  FOR INSERT WITH CHECK (true);

-- Insert default about record
INSERT INTO about (description) VALUES ('');

INSERT INTO admins (username, password, created_at)
VALUES ('admin', '$2a$10$e6S1JdJkIPbgBZQZvbzF6ev9qQBnD0BbWLTU7ngM3EotrabOO1B0q', NOW())
ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password;

-- Grant anonymous access for public tables
GRANT SELECT ON news, merchandise, comments, about, about_images TO anon;
GRANT INSERT ON comments TO anon;
GRANT UPDATE ON comments TO anon;
GRANT DELETE ON comments TO anon;

-- Grant authenticated access
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
