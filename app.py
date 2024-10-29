from flask import Flask, request


import torch
from torchvision import transforms
from PIL import Image
import PIL.ImageOps

import sys

app = Flask(__name__, static_folder='../client/build', static_url_path='/')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

@app.route('/')
def index():
  return app.send_static_file('index.html')

@app.route('/data')
def data():
  return {'test': ['test1', 'test2', 'test3']}

@app.route('/api/predict', methods=['POST'])
def predict():
  if request.method == 'POST':
    # img = request.files['img']

    # prepare model
    model = torch.load("trained_model.pt", weights_only=False)
    model.eval()

    # Load the grayscale image
    image = Image.open("model/3.jpg").convert('L')  # Convert to grayscale

    inverted_image = PIL.ImageOps.invert(image)

    # Define the transform to resize the image and convert to tensor
    transform = transforms.Compose([
      transforms.Resize((28, 28)),  # Resize to 28x28
      transforms.ToTensor(),         # Convert to tensor and scale to [0, 1]
    ])

    # Apply the transform
    img_tensor = transform(inverted_image).view(1,1,28,28)

    # Predict digit
    with torch.no_grad():
      prediction = model(img_tensor.view(1,1,28,28))

    predicted_number = prediction[0].argmax().item()
    print(predicted_number, file=sys.stderr)
    return {'predicted_number': predicted_number}

if __name__ == '__main__':
  app.run(host='0.0.0.0')