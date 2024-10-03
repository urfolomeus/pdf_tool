import numpy as np
from paddleocr import PaddleOCR


def extract_text(cropped_image):
    # Initialize PaddleOCR
    print("Initializing PaddleOCR...")
    ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=True, use_gpu=True)

    # Convert PIL image to RGB if it's not already
    print("Converting image to RGB...")
    converted_image = cropped_image.convert("RGB")

    # Convert PIL image to numpy array
    print("Converting image to numpy array...")
    image = np.array(converted_image)

    # Perform OCR on the image
    print("Performing OCR on the image...")
    result = ocr.ocr(image, cls=True)

    # Print the results
    print(f"Got {len(result)} OCR results...")
    for idx in range(len(result)):
        res = result[idx]
        for line in res:
            print(line)
