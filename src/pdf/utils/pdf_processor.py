import os
import uuid

import pytesseract
from pdf2image import convert_from_path
from PIL import Image

CROPS_FOLDER = "src/pdf/crops"


def crop(x, y, width, height, canvas_width, canvas_height):
    filepath = os.path.join("src/pdf/files", "sample.pdf")

    images = convert_from_path(filepath)
    image = images[0]

    width_scale = image.width / canvas_width
    height_scale = image.height / canvas_height

    pixel_x = int(x * width_scale)
    pixel_y = int(y * height_scale)
    pixel_width = int(width * width_scale)
    pixel_height = int(height * height_scale)

    try:
        cropped_image = image.crop(
            (pixel_x, pixel_y, pixel_x + pixel_width, pixel_y + pixel_height)
        )
    except Image.DecompressionBombError:
        raise Exception("Image is too large")

    if os.getenv("SAVE_CROPS") == "true":
        # Ensure the CROPS_FOLDER exists
        os.makedirs(CROPS_FOLDER, exist_ok=True)

        crop_filename = f"crop_{uuid.uuid4().hex}.png"
        crop_path = os.path.join(CROPS_FOLDER, crop_filename)

        cropped_image.save(crop_path)
        print(f"Cropped image saved to {crop_path}")

    return cropped_image


def extract_text(cropped_image):
    text = pytesseract.image_to_string(cropped_image)
    print(f"Extracted text: {text}")
    return text
