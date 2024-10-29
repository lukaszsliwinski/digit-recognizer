from flask import Flask, request, jsonify
import torch
from torchvision import transforms
from PIL import Image
import PIL.ImageOps
import io

app = Flask(__name__, static_folder='client/build', static_url_path='/')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.route('/api/recognize', methods=['POST'])
def recognize():
  if request.method == 'POST':
    if 'img' not in request.files:
      return jsonify({"error": "No image file in request"}), 400
    
    img = request.files['img']

    # Prepare model
    model = torch.load("trained_model.pt", weights_only=False)
    model.eval()

    # Read the image into memory and convert to grayscale
    img_bytes = img.read()
    img = Image.open(io.BytesIO(img_bytes))
    grayscale = img.convert('L')

    # Invert colors
    inverted_img = PIL.ImageOps.invert(grayscale)

    # Define the transform to resize the image and convert to tensor
    transform = transforms.Compose([
      transforms.Resize((28, 28)),  # Resize to 28x28
      transforms.ToTensor(),         # Convert to tensor and scale to [0, 1]
    ])

    # Apply the transform
    img_tensor = transform(inverted_img).view(1,1,28,28)

    # Predict digit
    with torch.no_grad():
      prediction = model(img_tensor.view(1,1,28,28))

    # Return recognized digit
    return {'recognized_digit': prediction[0].argmax().item()}

if __name__ == '__main__':
  app.run(host='0.0.0.0')