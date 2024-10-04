import numpy as np
from paddleocr import PaddleOCR


class PaddleOCRReader:
    def __init__(self):
        # Initialize PaddleOCR
        self.ocr = PaddleOCR(
            use_angle_cls=False, lang="en", show_log=True, use_gpu=False
        )

    def extract_text(self, cropped_image):
        # Convert PIL image to numpy array
        print("Converting image to numpy array...")
        image = np.array(cropped_image)

        # Perform OCR on the image
        print("Performing OCR on the image...")
        result = self.ocr.ocr(image, cls=True)

        # Print the results
        print(f"Got {len(result)} OCR results...")
        for idx in range(len(result)):
            res = result[idx]
            for line in res:
                print(line)
