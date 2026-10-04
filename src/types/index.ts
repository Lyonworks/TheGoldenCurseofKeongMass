// Database Models
export interface Admin {
  id_admin: number;
  username: string;
  password: string;
}

export interface News {
  id_news: number;
  title: string;
  content: string;
  author: string;
  image: string;
  created_at: string;
}

export interface Merchandise {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  limited: boolean;
  image: string | null;
}

export interface Comment {
  id_comments: number;
  name: string;
  message: string;
  id_parent: number | null;
  user_token: string;
  is_read: boolean;
  created_at: string;
}

export interface About {
  id_about: number;
  description: string;
}

export interface AboutImage {
  id_image: number;
  image: string;
}

export interface Activity {
  id: number;
  user: string;
  action: string;
  description: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ListResponse<T> {
  success: boolean;
  data: T[];
  count: number;
  error?: string;
}

// Auth
export interface AuthSession {
  adminId: number;
  username: string;
  createdAt: string;
}
