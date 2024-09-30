import pytesseract


def extract_text(cropped_image):
    text = pytesseract.image_to_string(cropped_image)
    print(f"Extracted text: {text}")
    return text
