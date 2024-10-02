/* CONSTANTS ------------------------------------------------ */

const PDF_INITIAL_SCALE = 1;
const PDF_PAGE_NUM = 1;
const PDF_PATH = '/pdf/sample.pdf';


/* GLOBAL VARIABLES ----------------------------------------- */

let pdfPage;
let scale = PDF_INITIAL_SCALE;


/* DOM ELEMENTS --------------------------------------------- */

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
}
