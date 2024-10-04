import easyocr
import numpy as np
import torch

LANGUAGES = ["en"]

device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
reader = easyocr.Reader(LANGUAGES, gpu=True if device.type == "mps" else False)


def perform_ocr(cropped_image):
    # Convert to numpy array
    image_np = np.array(cropped_image)

    print("Performing OCR...")
    # Perform OCR
    results = reader.readtext(image_np, detail=0)

    return results


def extract_text(cropped_image):
    try:
        results = perform_ocr(cropped_image)

        if results:
            print(f"OCR Results: {results}")
        else:
            print("No text detected in the image.")

        return results

    except Exception as e:
        print(f"An error occurred: {str(e)}")
