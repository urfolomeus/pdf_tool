import easyocr
import numpy as np
import torch

LANGUAGES = ["en"]


class EasyOCRReader:
    def __init__(self):
        device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
        self.reader = easyocr.Reader(
            LANGUAGES, gpu=True if device.type == "mps" else False
        )

    def extract_text(self, cropped_image):
        try:
            results = self.__perform_ocr(cropped_image)

            if results:
                print(f"OCR Results: {results}")
            else:
                print("No text detected in the image.")

            return results

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            print(f"Error: {e}")
            return []

    def __perform_ocr(self, cropped_image):
        # Convert to numpy array
        image_np = np.array(cropped_image)

        print("Performing OCR...")
        # Perform OCR
        results = self.reader.readtext(image_np, detail=0)

        return results
