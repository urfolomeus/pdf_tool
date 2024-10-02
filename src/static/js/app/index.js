/* CONSTANTS ------------------------------------------------ */

const PDF_INITIAL_SCALE = 1;
const PDF_PAGE_NUM = 1;
const PDF_PATH = '/pdf/sample.pdf';

const ZOOM_STEP = 0.2;


/* GLOBAL VARIABLES ----------------------------------------- */

let pdfPage;
let scale = PDF_INITIAL_SCALE;

let isPanMode = false;
let isPanning = false;
let panStartX, panStartY, panX, panY;

let isSelecting = false;
let selectStartX, selectStartY;


/* DOM ELEMENTS --------------------------------------------- */

const canvasWrapper = document.querySelector('.canvas-wrapper');
const pdfCanvas = document.getElementById('pdf-layer');
const selectionCanvas = document.getElementById('selection-layer');


/* PDF SETUP ------------------------------------------------ */

pdfjsLib.GlobalWorkerOptions.workerSrc = 'static/js/pdfjs/build/pdf.worker.mjs';

// Load and render PDF
pdfjsLib.getDocument(PDF_PATH).promise.then(pdf => {
  pdf.getPage(PDF_PAGE_NUM).then(page => {
    pdfPage = page;
    renderPage();
  });
});

// Render the PDF and selection layers
const renderPage = () => {
  const pdfViewport = pdfPage.getViewport({ scale });

  pdfCanvas.width = selectionCanvas.width = pdfViewport.width;
  pdfCanvas.height = selectionCanvas.height = pdfViewport.height;

  pdfPage.render({
    canvasContext: pdfCanvas.getContext('2d'),
    viewport: pdfViewport
  });

  updateTransform();
}

const updateTransform = () => {
  canvasWrapper.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
}


/* ZOOMING -------------------------------------------------- */

document.getElementById('zoomIn').addEventListener('click', () => {
  scale += ZOOM_STEP;
  renderPage();
});

document.getElementById('zoomOut').addEventListener('click', () => {
  scale -= ZOOM_STEP;
  renderPage();
});


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
}

const scaleNormalize = (value) => Math.round(value / scale);

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

  if (currentRect) {
    selectionContext.strokeRect(currentRect.x * scale, currentRect.y * scale, currentRect.width * scale, currentRect.height * scale);
  }
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

document.addEventListener("keydown", (e) => isPanMode = e.shiftKey);
document.addEventListener("keyup", (e) => isPanMode = false);
