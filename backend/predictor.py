from transformers import AutoImageProcessor, AutoModelForImageClassification
import torch
from PIL import Image
import io

# Model from Hugging Face
MODEL_NAME = "Hemgg/brain-tumor-classification"

class BrainTumorPredictor:
    def __init__(self):
        print(f"Loading model: {MODEL_NAME}...")
        self.processor = AutoImageProcessor.from_pretrained(MODEL_NAME)
        self.model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
        self.model.eval()
        print("Model loaded successfully.")

    def predict(self, image_bytes):
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        inputs = self.processor(images=image, return_tensors="pt")
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            logits = outputs.logits
            predicted_class_idx = logits.argmax(-1).item()
            
        predicted_label = self.model.config.id2label[predicted_class_idx]
        confidence = torch.softmax(logits, dim=-1)[0][predicted_class_idx].item()
        
        return {
            "label": predicted_label,
            "confidence": float(confidence)
        }

# Singleton instance
predictor = BrainTumorPredictor()
