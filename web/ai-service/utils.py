# 🔥 NEARBY THREAT FILTER
def is_nearby(user_loc, report_loc, radius_km=5):

    if not user_loc or not report_loc:
        return False

    dist = calculate_distance(
        user_loc["lat"],
        user_loc["lng"],
        report_loc["lat"],
        report_loc["lng"]
    )

    return dist <= radius_km


# 🔥 RISK NORMALIZER
def normalize_score(score):
    return max(0, min(100, score))
