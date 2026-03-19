import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import numpy as np

# 🔥 LOAD PRETRAINED MODEL
model = models.resnet18(pretrained=True)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])


def detect_ai_generated(image: Image.Image):

    img_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        features = model(img_tensor)

    features = features.numpy()

    # 🔥 SIMULATED CLASSIFICATION LOGIC
    variance = float(np.var(features))

    # Lower variance → smoother → AI generated
    ai_generated = variance < 0.05

    confidence = float(min(1.0, variance))

    return {
        "aiGenerated": ai_generated,
        "deepfakeScore": confidence
    }
