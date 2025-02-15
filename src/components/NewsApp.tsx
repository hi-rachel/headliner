"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, RefreshCw } from "lucide-react";
import type { NewsArticle, NewsData } from "@/types/news";

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => (
  <Card className="mb-4 hover:shadow-lg transition-shadow">
    <div className="p-4">
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-2 group"
      >
        <div className="flex-1">
          <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
          {article.description && (
            <p className="text-sm text-gray-600 mt-2">{article.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{article.source?.name ?? "Unknown Source"}</span>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
      </a>
    </div>
  </Card>
);

const NewsApp: React.FC = () => {
  const [newsData, setNewsData] = useState<NewsData>({
    korean: [],
    tech: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/news");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = (await response.json()) as NewsData;
      setNewsData(data);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Headliner</h1>
        <button
          onClick={fetchNews}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          새로고침
        </button>
      </div>

      {lastUpdated && (
        <p className="text-sm text-gray-500 mb-6">
          마지막 업데이트: {lastUpdated}
        </p>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <Tabs defaultValue="korean" className="space-y-4">
        <TabsList className="space-x-2">
          <TabsTrigger value="korean">국내 뉴스</TabsTrigger>
          <TabsTrigger value="tech">기술 뉴스</TabsTrigger>
        </TabsList>

        <TabsContent value="korean" className="space-y-4">
          {newsData.korean.length === 0 ? (
            <p className="text-center text-gray-500 py-4">뉴스가 없습니다.</p>
          ) : (
            newsData.korean.map((article, index) => (
              <NewsCard key={`korean-${index}`} article={article} />
            ))
          )}
        </TabsContent>

        <TabsContent value="tech" className="space-y-4">
          {newsData.tech.length === 0 ? (
            <p className="text-center text-gray-500 py-4">뉴스가 없습니다.</p>
          ) : (
            newsData.tech.map((article, index) => (
              <NewsCard key={`tech-${index}`} article={article} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsApp;
