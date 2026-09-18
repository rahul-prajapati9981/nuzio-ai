export interface User {
  id: string;
  name: string;
  email: string;
  interests: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  source: string;
  publishedAt: string;
  duration: string;
  image: string;
}

export interface PersonalizedNewsResponse {
  success: boolean;
  user: {
    name: string;
    interests: string[];
  };
  count: number;
  articles: NewsArticle[];
}

export interface InterestsResponse {
  success: boolean;
  message: string;
  interests: string[];
}
