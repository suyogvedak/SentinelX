import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    console.log("API KEY EXISTS:", Boolean(apiKey));

    if (!apiKey) {
      throw new Error("Missing OpenWeather API Key");
    }

    const lat = 28.6139;
    const lon = 77.2090;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const text = await res.text();
      console.error("OpenWeather error:", text);
      throw new Error("Weather API failed");
    }

    const data = await res.json();

    return NextResponse.json({
      condition: data.weather[0].main,
      temp: Math.round(data.main.temp),
      wind: Math.round(data.wind.speed),
      severity:
        data.wind.speed > 15
          ? "High"
          : data.wind.speed > 8
          ? "Medium"
          : "Low",
    });
  } catch (error: any) {
    console.error("Weather route error:", error.message);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
