export interface NewsArticle {
  title: string;
  description?: string;
  url: string;
  publishedAt: string;
  source?: {
    name: string;
  };
  score?: number;
  descendants?: number;
}

export interface NewsData {
  korean: NewsArticle[];
  tech: NewsArticle[];
}

export interface NewsAPIResponse {
  status: string;
  articles?: NewsArticle[];
  message?: string;
}

export interface HackerNewsStory {
  id: number;
  title: string;
  url?: string;
  time: number;
  score: number;
  descendants: number;
}
