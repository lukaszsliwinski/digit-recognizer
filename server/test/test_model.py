# Test model locally on NPU

import openvino.runtime as ov
from torchvision import transforms
import matplotlib.pyplot as plt
from PIL import Image
import PIL.ImageOps


# Transform image function
def transform_image(img_path):
  """
  Load, preprocess, and transform image to tensor.
  """
  
  grayscale = Image.open(img_path).convert('L') 
  inverted_img = PIL.ImageOps.invert(grayscale)

  transform = transforms.Compose([
      transforms.Resize((28, 28)),
      transforms.ToTensor(),
  ])

  return transform(inverted_img).view(1, 1, 28, 28)


# Test model function
def test_model(model_path, img_path, plot=False):
  """
  Test the ONNX model on sample data in the specified directory.
  """

  # Compile model using OpenVINO
  core = ov.Core()
  compiled_model = core.compile_model(model_path, "NPU")
  output_layer = compiled_model.output(0)

  # Transform image and predict digit
  img_tensor = transform_image(img_path)
  prediction = compiled_model([img_tensor.numpy()])[output_layer]
  predicted_digit = prediction.argmax()

  # Predict digit
  print(predicted_digit)
  
  if plot:
    plt.imshow(img_tensor.reshape(28, 28).squeeze(), cmap='gray')
    plt.show()

test_model('../models/trained_model.onnx', 'data/5.jpg')
