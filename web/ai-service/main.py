from fastapi import FastAPI
from pydantic import BaseModel
from analyzer import analyze_media
from verifier import verify_data
from predictor import predict_threat
from text_analyzer import analyze_text
import requests

app = FastAPI()

class Report(BaseModel):
    reportId: str
    fileUrl: str
    location: dict | None = None
    category: str
    description: str | None = ""

class ThreatInput(BaseModel):
    threats: list[str]

@app.post("/analyze")
def analyze(report: Report):

    location = report.location or {"lat": 0, "lng": 0}

    media = analyze_media(report.fileUrl)
    text = analyze_text(report.description)
    verification = verify_data(location, report.description)
    prediction = predict_threat(media, text, verification)

    return {
        "mediaAnalysis": media,
        "textAnalysis": text,
        "verification": verification,
        "prediction": prediction,
        "finalVerdict": prediction.get("verdict")
    }

@app.post("/analyze-threats")
def analyze_threats(data: ThreatInput):

    combined_text = " ".join(data.threats)

    # ✅ Reuse your existing AI modules
    text = analyze_text(combined_text)
    verification = verify_data({"lat": 0, "lng": 0}, combined_text)

    # Fake minimal media input (since no file)
    media = {"type": "text-only"}

    prediction = predict_threat(media, text, verification)

    return {
        "summary": text.get("summary", combined_text),
        "riskLevel": prediction.get("risk", "Medium"),
        "evacuation": prediction.get("advice", "Stay alert"),
    }


import requests

@app.get("/global-insights")
def global_insights():

    insights = []

    try:
        # 🌍 1. FETCH REAL NEWS DATA
        news_res = requests.get(
            "https://newsapi.org/v2/everything?q=disaster OR flood OR earthquake OR wildfire&language=en&apiKey=60bfd1a1e0814dfcb31ffa35c31a6ba1"
        )

        articles = news_res.json().get("articles", [])[:5]

        for article in articles:
            text_data = article["title"]

            text = analyze_text(text_data)
            verification = verify_data({"lat": 0, "lng": 0}, text_data)
            media = {"type": "news"}

            prediction = predict_threat(media, text, verification)

            insights.append({
                "text": text.get("summary", text_data),
                "risk": prediction.get("risk", "Medium")
            })

    except Exception as e:
        print("NEWS ERROR:", e)

    try:
        # 🌦️ 2. OPTIONAL WEATHER DATA (example)
        weather_text = "Heavy rainfall expected in coastal regions"

        text = analyze_text(weather_text)
        verification = verify_data({"lat": 0, "lng": 0}, weather_text)
        prediction = predict_threat({"type": "weather"}, text, verification)

        insights.append({
            "text": text.get("summary", weather_text),
            "risk": prediction.get("risk", "High")
        })

    except Exception as e:
        print("WEATHER ERROR:", e)

    return insights