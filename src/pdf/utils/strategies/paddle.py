import numpy as np
from paddleocr import PaddleOCR


class PaddleOCRReader:
    def __init__(self):
        # Initialize PaddleOCR
        self.ocr = PaddleOCR(
            use_angle_cls=True, lang="en", show_log=True, use_gpu=False
        )

    def extract_text(self, cropped_image):
        # Convert PIL image to numpy array
        print("Converting image to numpy array...")
        image = np.array(cropped_image)

        # Perform OCR on the image
        print("Performing OCR on the image...")
        result = self.ocr.ocr(image, cls=False)

        # Print the results
        print(f"Got {len(result)} OCR results... {result}")
        
        res = result[0]
        print(f"Res: {res}")
        
        if res:
            texts = [line[1][0] for line in res]
            print(f"Got texts: {texts}")
            text = texts[0]
        else:
            text = ""

        return text
