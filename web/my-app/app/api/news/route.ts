import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey) {
      throw new Error("Missing GNews API Key");
    }

    const url = `https://gnews.io/api/v4/search?q=disaster OR earthquake OR flood OR wildfire&lang=en&max=6&apikey=${apiKey}`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    const data = await res.json();

    const news = data.articles.map((article: any) => ({
      title: article.title,
      source: article.source.name,
      time: new Date(article.publishedAt).toLocaleString(),
    }));

    return NextResponse.json(news);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
