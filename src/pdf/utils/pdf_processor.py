import os
from uuid import uuid4

from pdf2image import convert_from_path
from PIL import Image


def crop(x, y, width, height, canvas_width, canvas_height):
    filepath = os.path.join("src/pdf/files", "sample.pdf")

    images = convert_from_path(filepath)
    image = images[0]

    print(
        f"\n\nImage size: {image.width}px x {image.height}px ({image.width * image.height} pixels)\n\n"
    )

    width_scale = image.width / canvas_width
    height_scale = image.height / canvas_height

    print(f"Width scale: {width_scale}, Height scale: {height_scale}")

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

    crop_filename = f"crop_{uuid4().hex}.png"
    crop_path = os.path.join("src/pdf/crops", crop_filename)

    cropped_image.save(crop_path)
    print(f"Cropped image saved to {crop_path}")
