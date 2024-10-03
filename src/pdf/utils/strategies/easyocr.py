import easyocr
import numpy as np

LANGUAGES = ["en"]


def perform_ocr(cropped_image):
    reader = easyocr.Reader(LANGUAGES)

    # Convert to RGB if it's not already
    # converted_image = cropped_image.convert("RGB")

    # Convert to numpy array
    image_np = np.array(cropped_image)

    print("Performing OCR...")
    # Perform OCR
    results = reader.readtext(image_np)

    return results


def extract_text(cropped_image):
    try:
        results = perform_ocr(cropped_image)

        the_text = ""

        if results:
            print("OCR Results:")
            for bbox, text, prob in results:
                print(f"Detected text: {text}")
                the_text = text
                print(f"Confidence: {prob:.2f}")
                print(f"Bounding box: {bbox}")
                print("---")
        else:
            print("No text detected in the image.")

        return the_text

    except Exception as e:
        print(f"An error occurred: {str(e)}")
