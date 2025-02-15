import { NextResponse } from "next/server";
import type { NewsData, NewsAPIResponse, HackerNewsStory } from "@/types/news";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_ENDPOINT = "https://newsapi.org/v2";
const HACKER_NEWS_API = "https://hacker-news.firebaseio.com/v0";

// 캐시를 위한 변수들
let cachedNews: NewsData | null = null;
let lastFetchTime: number | null = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1시간

async function fetchKoreanNews() {
  const response = await fetch(
    `${NEWS_API_ENDPOINT}/everything?` +
      new URLSearchParams({
        q: "(korea OR 한국) AND (경제 OR 정치 OR 사회)",
        language: "ko",
        sortBy: "publishedAt",
        pageSize: "10",
        apiKey: NEWS_API_KEY ?? "",
      }),
    { next: { revalidate: 3600 } }
  );

  const data = (await response.json()) as NewsAPIResponse;

  if (data.status === "error") {
    console.error("NewsAPI Error:", data);
    return [];
  }

  return (data.articles || []).map((article) => ({
    ...article,
    description: article.description
      ? `${article.description.slice(0, 100)}...`
      : undefined,
  }));
}

async function fetchHackerNews() {
  // Top stories IDs 가져오기
  const topStoriesResponse = await fetch(`${HACKER_NEWS_API}/topstories.json`, {
    next: { revalidate: 3600 },
  });
  const storyIds = (await topStoriesResponse.json()) as number[];

  // 상위 10개 스토리만 가져오기
  const promises = storyIds.slice(0, 10).map(async (id) => {
    const response = await fetch(`${HACKER_NEWS_API}/item/${id}.json`, {
      next: { revalidate: 3600 },
    });
    const story = (await response.json()) as HackerNewsStory;
    return {
      title: story.title,
      url: story.url ?? `https://news.ycombinator.com/item?id=${id}`,
      publishedAt: new Date(story.time * 1000).toISOString(),
      source: { name: "Hacker News" },
      description: `${story.score} points | ${story.descendants || 0} comments`,
    };
  });

  return Promise.all(promises);
}

export async function GET() {
  try {
    // 캐시 확인
    if (
      cachedNews &&
      lastFetchTime &&
      Date.now() - lastFetchTime < CACHE_DURATION
    ) {
      return NextResponse.json(cachedNews);
    }

    // 새로운 데이터 가져오기
    const [koreanNews, techNews] = await Promise.all([
      fetchKoreanNews(),
      fetchHackerNews(),
    ]);

    const news: NewsData = {
      korean: koreanNews,
      tech: techNews,
    };

    // 캐시 업데이트
    cachedNews = news;
    lastFetchTime = Date.now();

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
