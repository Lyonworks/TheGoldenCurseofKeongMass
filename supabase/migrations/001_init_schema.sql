-- Supabase SQL Migration - Init schema with sample data

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id_comments SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  id_parent INT REFERENCES comments(id_comments) ON DELETE CASCADE,
  user_token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Merchandise table
CREATE TABLE IF NOT EXISTS merchandise (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INT NOT NULL,
  stock INT DEFAULT 0,
  limited INT DEFAULT 0,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE IF NOT EXISTS news (
  id_news SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- About table
CREATE TABLE IF NOT EXISTS about (
  id SERIAL PRIMARY KEY,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- About images table
CREATE TABLE IF NOT EXISTS about_images (
  id_image SERIAL PRIMARY KEY,
  image VARCHAR(255) NOT NULL,
  id_about INT REFERENCES about(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(255),
  action VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data
INSERT INTO admin_users (username, password, created_at) VALUES 
('admin', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO about (description, created_at, updated_at) VALUES 
('Keong Mas is a legendary Indonesian fairy tale about a magical golden snail. This indie game brings the classic story to life with modern gameplay and stunning visuals.', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO news (title, content, author, image, created_at, updated_at) VALUES 
('Game Launch Announcement', '<p>We are excited to announce the launch of The Golden Curse of Keong Mas! Available now on itch.io.</p>', 'Admin', 'default.jpg', NOW(), NOW()),
('Behind the Scenes', '<p>Learn about the development process and the inspiration behind the game from our team.</p>', 'Admin', 'default.jpg', NOW(), NOW())
ON CONFLICT DO NOTHING;

INSERT INTO merchandise (name, description, price, stock, limited, image, created_at, updated_at) VALUES 
('Golden Snail T-Shirt', 'Official merchandise featuring the iconic golden snail design', 150000, 50, 0, 'tshirt.jpg', NOW(), NOW()),
('Keong Mas Art Book', 'Behind the scenes art and concept designs from the game', 250000, 20, 1, 'artbook.jpg', NOW(), NOW())
ON CONFLICT DO NOTHING;
