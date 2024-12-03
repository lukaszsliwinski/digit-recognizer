# Imports
import torch
import torch.nn.functional as F
import io
from flask import Flask, request, jsonify
from torchvision import transforms
from PIL import Image, ImageOps
from app.cnn_structure import DigitRecognitionModel

app = Flask(__name__, static_folder='client/build', static_url_path='/')

MODEL_PATH = 'model/trained_model.pt'

# Model initialization
model = DigitRecognitionModel()

# Load the saved weights
model.load_state_dict(torch.load(MODEL_PATH, weights_only=True))
model.eval()

# Function to preprocess the image
def transform_image(img_bytes):
  """
  Convert an image to grayscale, invert colors, resize to 28x28, and transform into a tensor.
  """
  img = Image.open(io.BytesIO(img_bytes))
  grayscale = img.convert('L')
  inverted_img = ImageOps.invert(grayscale)
  transform = transforms.Compose([
    transforms.Resize((28, 28)),
    transforms.ToTensor(),
  ])
  return transform(inverted_img).view(1,1,28,28)

# Route to serve the React app
@app.route('/')
def index():
  """
  Serve the React app's main entry point.
  """
  return app.send_static_file('index.html')

# API endpoint for digit recognition
@app.route('/api/recognize', methods=['POST'])
def recognize():
  """
  Process the uploaded image, run it through the model, and return the predicted digit with its confidence.
  """
  if request.method == 'POST':
    if 'img' not in request.files:
      return jsonify({"error": "No image file in request"}), 400

    try:
      img = request.files['img']
      img_bytes = img.read()
      img_tensor = transform_image(img_bytes)
      
      with torch.no_grad():
        logits = model(img_tensor.view(1, 1, 28, 28))
        probabilities = F.softmax(logits, dim=1)

      prediction = probabilities.argmax(dim=1).item()
      confidence = probabilities[0, prediction].item()
      
      return jsonify({
        'recognized_digit': prediction,
        'confidence': round(confidence*100)
      }), 200
    
    except Exception as e:
      return jsonify({"error": f"Failed to process the image: {str(e)}"}), 500

# Run Flask app
if __name__ == '__main__':
  app.run(host='0.0.0.0')