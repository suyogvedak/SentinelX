import requests

def verify_data(location, description):

    lat = location.get("lat", 0)
    lng = location.get("lng", 0)

    description = (description or "").lower()

    score = 10
    sources = []

    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&current_weather=true"
        res = requests.get(url).json()

        wind = res.get("current_weather", {}).get("windspeed", 0)
        temp = res.get("current_weather", {}).get("temperature", 0)

        sources.append("OpenMeteo")

        if "storm" in description and wind > 20:
            score += 25

        if "fire" in description and temp > 30:
            score += 20

        if "flood" in description:
            score += 15

    except:
        score += 5

    if score >= 40:
        status = "VERIFIED"
    elif score >= 20:
        status = "PARTIAL"
    else:
        status = "LOW"

    return {
        "verificationScore": score,
        "status": status,
        "sources": sources
    }
