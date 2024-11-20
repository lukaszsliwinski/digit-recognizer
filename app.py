# Imports
import torch
import io
from flask import Flask, request, jsonify
from torchvision import transforms
from PIL import Image, ImageOps

app = Flask(__name__, static_folder='client/build', static_url_path='/')


# Model initialization
MODEL_PATH = 'trained_model.pt'
model = torch.load(MODEL_PATH, weights_only=False)
model.eval()


# Function that converts an image to grayscale and tensor
def transform_image(img_bytes):
  # Convert image to grayscale
  img = Image.open(io.BytesIO(img_bytes))
  grayscale = img.convert('L')

  # Invert colors
  inverted_img = ImageOps.invert(grayscale)

  # Define the transform to resize the image and convert to tensor
  transform = transforms.Compose([
    transforms.Resize((28, 28)),  # Resize to 28x28
    transforms.ToTensor(),        # Convert to tensor and scale to [0, 1]
  ])

  return transform(inverted_img).view(1,1,28,28)


# Render React app
@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.route('/api/recognize', methods=['POST'])
def recognize():
  if request.method == 'POST':
    if 'img' not in request.files:
      return jsonify({"error": "No image file in request"}), 400
    
    img = request.files['img']

    # Read the image into memory and transform to tensor
    img_bytes = img.read()
    img_tensor = transform_image(img_bytes)

    # Predict digit
    with torch.no_grad():
      prediction = model(img_tensor.view(1,1,28,28))

    # Return recognized digit
    return {'recognized_digit': prediction[0].argmax().item()}

if __name__ == '__main__':
  app.run(host='0.0.0.0')