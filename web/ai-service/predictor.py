def predict_threat(media, text, verification):

    if media.get("detectedType") == "No Disaster":
        return {
            "riskScore": 0,
            "threatLevel": "LOW",
            "verdict": "NO_DISASTER",
            "recommendation": "No disaster detected"
        }

    score = 0

    media_type = media.get("detectedType", "").lower()
    text_keywords = [k.lower() for k in text.get("detectedKeywords", [])]

    ai_generated = media.get("aiGenerated", False)
    is_fake = media.get("isFake", False)
    confidence = media.get("confidence", 0.5)

    verification_score = verification.get("verificationScore", 0)

    if not is_fake:
        score += 30
    else:
        score -= 30

    if ai_generated:
        score -= 20

    score += int(confidence * 20)

    match = any(word in media_type for word in text_keywords)

    if match:
        score += 25
    else:
        score -= 10

    score += verification_score

    score = max(0, min(100, score))

    if score >= 80:
        level = "CRITICAL"
        verdict = "REAL_DISASTER"
    elif score >= 60:
        level = "HIGH"
        verdict = "LIKELY_REAL"
    elif score >= 40:
        level = "MEDIUM"
        verdict = "UNCERTAIN"
    else:
        level = "LOW"
        verdict = "FAKE_REPORT"

    return {
        "riskScore": score,
        "threatLevel": level,
        "verdict": verdict,
        "recommendation": "Evacuate" if level == "CRITICAL" else "Stay Alert"
    }
