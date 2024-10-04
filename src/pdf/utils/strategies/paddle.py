import numpy as np
from paddleocr import PaddleOCR


class PaddleOCRReader:
    def __init__(self):
        # Initialize PaddleOCR
        self.ocr = PaddleOCR(
            use_angle_cls=True, lang="en", show_log=False, use_gpu=False
        )

    def extract_text(self, cropped_image):
        # Convert PIL image to numpy array
        print("Converting image to numpy array...")
        image = np.array(cropped_image)

        # Perform OCR on the image
        print("Performing OCR on the image...")
        result = self.ocr.ocr(image, cls=True)

        # Print the results
        print(f"Got {len(result)} OCR results: {result}")
        
        texts = []
        
        if len(result) and result[0]:
            for lines in result:
                for line in lines:
                    [_bounding_box, text_info] = line
                    texts.append(text_info[0])

        return texts[0]
