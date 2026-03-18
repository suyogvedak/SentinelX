import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import requests
from io import BytesIO
import cv2
import numpy as np
import tempfile

device = "cpu"

clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

labels = [
    "fire disaster",
    "flood disaster",
    "earthquake damage",
    "building collapse",
    "explosion",
    "storm cyclone",
    "road accident",
    "normal scene",
    "animals",
    "flowers",
    "people"
]


def analyze_media(url):
    try:
        if url.endswith(".mp4") or "video" in url:
            return analyze_video(url)
        else:
            return analyze_image(url)
    except Exception as e:
        return {"error": str(e)}


def analyze_image(url):
    response = requests.get(url)
    img = Image.open(BytesIO(response.content)).convert("RGB")

    inputs = clip_processor(text=labels, images=img, return_tensors="pt", padding=True)
    outputs = clip_model(**inputs)

    probs = outputs.logits_per_image.softmax(dim=1).detach().numpy()[0]

    best_idx = int(np.argmax(probs))
    confidence = float(probs[best_idx])
    detected = labels[best_idx]

    if detected in ["normal scene", "animals", "flowers", "people"] or confidence < 0.5:
        detected = "No Disaster"

    img_np = np.array(img)
    noise = float(np.std(img_np))

    ai_generated = noise < 20
    is_fake = ai_generated and confidence < 0.3

    return {
        "mediaType": "image",
        "detectedType": detected,
        "confidence": confidence,
        "aiGenerated": ai_generated,
        "isFake": is_fake,
        "noiseLevel": noise
    }


def analyze_video(url):
    response = requests.get(url)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp:
        temp.write(response.content)
        path = temp.name

    cap = cv2.VideoCapture(path)

    predictions = []
    noise_scores = []

    frames = 0

    while cap.isOpened() and frames < 10:
        ret, frame = cap.read()
        if not ret:
            break

        img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        inputs = clip_processor(text=labels, images=img, return_tensors="pt", padding=True)
        outputs = clip_model(**inputs)

        probs = outputs.logits_per_image.softmax(dim=1).detach().numpy()[0]

        predictions.append(probs)
        noise_scores.append(np.std(frame))

        frames += 1

    cap.release()

    avg_probs = np.mean(predictions, axis=0)
    best_idx = int(np.argmax(avg_probs))

    confidence = float(avg_probs[best_idx])
    detected = labels[best_idx]

    if detected in ["normal scene", "animals", "flowers", "people"] or confidence < 0.5:
        detected = "No Disaster"

    avg_noise = float(np.mean(noise_scores))

    ai_generated = avg_noise < 15
    is_fake = ai_generated and confidence < 0.3

    return {
        "mediaType": "video",
        "detectedType": detected,
        "confidence": confidence,
        "aiGenerated": ai_generated,
        "isFake": is_fake,
        "noiseLevel": avg_noise
    }
