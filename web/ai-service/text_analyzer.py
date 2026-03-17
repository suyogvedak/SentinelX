def analyze_text(description: str):

    description = (description or "").lower()

    disaster_keywords = {
        "fire": 70,
        "flood": 80,
        "earthquake": 90,
        "explosion": 85,
        "accident": 60,
        "storm": 75,
        "cyclone": 85,
        "collapse": 80,
        "landslide": 85
    }

    detected = []
    score = 0

    for word, val in disaster_keywords.items():
        if word in description:
            detected.append(word)
            score = max(score, val)

    if not detected:
        detected.append("unknown")
        score = 20

    return {
        "detectedKeywords": detected,
        "keywordScore": score
    }
