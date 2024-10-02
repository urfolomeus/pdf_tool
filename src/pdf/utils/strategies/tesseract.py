import random

import pytesseract


def extract_text(cropped_image):
    text = pytesseract.image_to_string(cropped_image)
    print(f"Extracted text: {text}")

    # For now we want to ensure we return a number
    try:
        textAsNumber = int(text)
    except ValueError:
        textAsNumber = random.randint(12, 345)

    return textAsNumber
