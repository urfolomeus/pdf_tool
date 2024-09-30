# PDF Tool

A Proof of Concept to see how far we can get with a tool that lets users highlight measurements on a CAD drawing in a PDF to have those numbers read and calculated for an estimate.

## Prerequisites

- Python
  - I'm using 3.12.3 but other versions of Python 3 may also work
  - I included a `.tool-versions` file in case you're using ASDF
- [Tesseract](https://tesseract-ocr.github.io/tessdoc/Installation.html) command line OCR tool
  - I installed using Homebrew on Mac `brew install tesseract`

## Setup

```shell
python -m venv .venv
pip install --upgrade pip
pip install -r requirements.txt
```

## Run

```shell
python -m app
```

This will run the server on http://localhost:5001.

### Saving crop files

We can optionally save the files that PIL is cropping if we're trying to debug the output of the OCR process. To do so, set an env var like so:

```shell
SAVE_CROPS=true python -m app
```

or set the env var in any other way you prefer.

### Choosing a text extraction strategy

We can switch our method of extracting text from crops by setting an `EXTRACTOR` env var like so:

```shell
EXTRACTOR=tesseract python -m app
```

To add a new strategy:

1. Add the code that implements it into a file in [src/pdf/utils/strategies](src/pdf/utils/strategies).
2. Import that file into [src/pdf/utils/pdf_processor.py](src/pdf/utils/pdf_processor.py).
3. Add a match case into the `extract_text` method in [pdf_processor.py](src/pdf/utils/pdf_processor.py) to handle it.
