export interface User {
  id: string;
  email: string;
  name: string | null;
  credits: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  userId: string;
  title: string;
  content: string;
  keywords: string[];
  companyName: string;
  companyType: string;
  metaDescription?: string;
  readingTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreditPurchase {
  id: string;
  userId: string;
  stripeSessionId?: string;
  amount: number;
  price: number;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateArticleRequest {
  companyName: string;
  companyType: string;
  keywords: string[];
  tone?: "professional" | "casual" | "technical" | "friendly";
  numArticles?: number;
}

export interface GeneratedArticle {
  title: string;
  metaDescription: string;
  content: string;
  keywords: string[];
  readingTime: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
