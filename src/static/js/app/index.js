/* CONSTANTS ------------------------------------------------ */

const PDF_INITIAL_SCALE = 1;
const PDF_PAGE_NUM = 1;
const PDF_PATH = '/pdf/sample.pdf';

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.2;


/* GLOBAL VARIABLES ----------------------------------------- */

let pdfPage;
let pdfViewport;
let initialPdfWidth, intialPdfHeight;
let scale = PDF_INITIAL_SCALE;

let isPanMode = false;
let isPanning = false;
let panStartX, panStartY, panX, panY;

let isSelecting = false;
let selectStartX, selectStartY;
let selections = [];


/* DOM ELEMENTS --------------------------------------------- */

const canvasWrapper = document.querySelector('.canvas-wrapper');
const pdfCanvas = document.getElementById('pdf-layer');
const selectionCanvas = document.getElementById('selection-layer');

const clearSelectionsButton = document.getElementById('clear-selections');
const resetZoomButton = document.getElementById('resetZoom');
const zoomInButton = document.getElementById('zoomIn');
const zoomOutButton = document.getElementById('zoomOut');


/* PDF SETUP ------------------------------------------------ */

pdfjsLib.GlobalWorkerOptions.workerSrc = 'static/js/pdfjs/build/pdf.worker.mjs';

// Load and render PDF
pdfjsLib.getDocument(PDF_PATH).promise.then(pdf => {
  pdf.getPage(PDF_PAGE_NUM).then(page => {
    pdfPage = page;
    pdfViewport = pdfPage.getViewport({ scale });
    initialPdfWidth = pdfViewport.width;
    intialPdfHeight = pdfViewport.height;
    renderPage();
  });
});

// Render the PDF and selection layers
const renderPage = () => {
  pdfCanvas.width = selectionCanvas.width = pdfViewport.width;
  pdfCanvas.height = selectionCanvas.height = pdfViewport.height;

  pdfPage.render({
    canvasContext: pdfCanvas.getContext('2d'),
    viewport: pdfViewport
  });

  updateTransform();
  drawRect();
}

const updateTransform = () => {
  canvasWrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
}


/* ZOOMING -------------------------------------------------- */

const zoomIn = () => {
  scale += ZOOM_STEP;
  scale = Math.min(scale, ZOOM_MAX);
  renderPage();
};

const zoomOut = () => {
  scale -= ZOOM_STEP;
  scale = Math.max(scale, ZOOM_MIN);
  renderPage();
};

const resetZoom = () => {
  scale = PDF_INITIAL_SCALE;
  renderPage();
};


/* PANNING -------------------------------------------------- */

// initialize pan variables
panStartX = panStartY = 0;
panX = panY = 0;

const startPan = (e) => {
  isPanning = true;
  panStartX = e.clientX - panX;
  panStartY = e.clientY - panY;
}

const pan = (e) => {
  if (!isPanning) return;

  panX = e.clientX - panStartX;
  panY = e.clientY - panStartY;
  updateTransform();
}

const stopPan = (e) => {
  isPanning = false;
}


/* SELECTING -------------------------------------------------- */

const startSelecting = (e) => {
  isSelecting = true;
  const { x, y } = getCanvasCoordinates(e);
  selectStartX = x;
  selectStartY = y;
}

const selecting = (e) => {
  if (!isSelecting) return;

  const { x, y } = getCanvasCoordinates(e);
  const currentRect = { x: selectStartX, y: selectStartY, width: x - selectStartX, height: y - selectStartY };

  drawRect(currentRect);
}

const stopSelecting = (e) => {
  if (!isSelecting) return;

  isSelecting = false;

  const { x, y } = getCanvasCoordinates(e);
  const selection = buildSelection(x, y);

  if (selection.width > 0 && selection.height > 0) {
    selections.push(selection);
    processSelection(selection);
    drawRect();
  }
}

const buildSelection = (endX, endY) => {
  return {
    id: crypto.randomUUID(),
    x: selectStartX,
    y: selectStartY,
    width: endX - selectStartX,
    height: endY - selectStartY
  };
}

const scaleNormalize = (value) => Math.round(value / scale);

const rescale = (value) => value * scale;

const getCanvasCoordinates = (event) => {
  const x = scaleNormalize(event.offsetX);
  const y = scaleNormalize(event.offsetY);
  return { x, y };
}

const drawRect = (currentRect) => {
  const selectionContext = selectionCanvas.getContext('2d');

  selectionContext.clearRect(0, 0, selectionCanvas.width, selectionCanvas.height);

  selectionContext.strokeStyle = 'red';
  selectionContext.lineWidth = 2 / scale;  // Adjust line width based on zoom

  selections.forEach((selection) => {
    selectionContext.strokeRect(
      rescale(selection.x),
      rescale(selection.y),
      rescale(selection.width),
      rescale(selection.height)
    );
  });

  if (currentRect) {
    selectionContext.strokeRect(
      rescale(currentRect.x),
      rescale(currentRect.y),
      rescale(currentRect.width),
      rescale(currentRect.height)
    );
  }
}

const processSelection = (selection) => {
  // We need to send the PDF dimensions to the server so that we can scale the
  // selection to the actual PDF for OCR processing
  const selectionWithPdfDimensions = { ...selection, canvasWidth: initialPdfWidth, canvasHeight: intialPdfHeight };

  fetch('/pdf/selection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selectionWithPdfDimensions)
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to process selection');
      return response.json()
    })
    .then(processResult)
    .catch(error => console.error({ error }));
};

const processResult = ({ result: { id, value } }) => {
  updateSelectionValue(id, value);
};

const updateSelectionValue = (id, value) => {
  const selection = selections.find(selection => selection.id === id);
  selection.value = value;
  console.log(selection);
};

const clearSelections = () => {
  selections = [];
  drawRect();
}


/* EVENT HANDLERS ------------------------------------------- */

const handleMouseDown = (e) => {
  if (isPanMode) {
    startPan(e);
  } else {
    startSelecting(e);
  }
}

const handleMouseMove = (e) => {
  if (isPanMode) {
    pan(e);
  } else {
    selecting(e);
  }
}

const handleMouseUp = (e) => {
  if (isPanMode) {
    stopPan(e);
  } else {
    stopSelecting(e);
  }
}


/* EVENT LISTENERS ------------------------------------------ */

canvasWrapper.addEventListener('mousedown', handleMouseDown);
canvasWrapper.addEventListener('mousemove', handleMouseMove);
canvasWrapper.addEventListener('mouseup', handleMouseUp);
canvasWrapper.addEventListener('mouseleave', handleMouseUp);

clearSelectionsButton.addEventListener('click', clearSelections);
resetZoomButton.addEventListener('click', resetZoom);
zoomInButton.addEventListener('click', zoomIn);
zoomOutButton.addEventListener('click', zoomOut);

document.addEventListener("keydown", (e) => isPanMode = e.shiftKey);
document.addEventListener("keyup", (e) => isPanMode = false);
