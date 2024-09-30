const pageNum = 1; // At the moment, we only render the first page
const pdfScale = 1;

const pdfLayer = document.getElementById('pdf-layer');
const selectionLayer = document.getElementById('selection-layer');
const selectionCtx = selectionLayer.getContext('2d');

let isSelecting = false;
let selections = [];
let startX, startY;

pdfjsLib.GlobalWorkerOptions.workerSrc = 'static/js/pdfjs/build/pdf.worker.mjs';

pdfjsLib.getDocument(`/pdf/sample.pdf`).promise.then(pdf => {
  pdf.getPage(pageNum).then(page => {
    const viewport = page.getViewport({ scale: pdfScale });

    pdfLayer.width = selectionLayer.width = viewport.width;
    pdfLayer.height = selectionLayer.height = viewport.height;

    page.render({
      canvasContext: pdfLayer.getContext('2d'),
      viewport: viewport
    });
  });
});

const startSelection = (e) => {
  isSelecting = true;
  [startX, startY] = [e.offsetX, e.offsetY];
};

const updateSelection = (e) => {
  if (!isSelecting) return;
  const currentRect = getRect(e.offsetX, e.offsetY);
  redrawSelectionCanvas(currentRect);
};

const endSelection = (e) => {
  if (!isSelecting) return;

  isSelecting = false;

  const currentRect = getRect(e.offsetX, e.offsetY);
  const currentSelection = { id: crypto.randomUUID(), ...currentRect };
  selections.push(currentSelection);
  processSelection(currentSelection);

  redrawSelectionCanvas();
};

const getRect = (endX, endY) => {
  return {
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY,
    canvasHeight: selectionLayer.height,
    canvasWidth: selectionLayer.width,
  };
};

const processSelection = (selection) => {
  fetch('/pdf/selection', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(selection)
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to process selection');
      return response.json()
    })
    .then(showResult)
    .catch(error => console.error({ error }));
};

const showResult = ({ result: { id, value } }) => {
  addInputToList(id, value);
  updateSelectionValue(id, value);
};

const addInputToList = (id, value) => {
  const resultInput = document.createElement('input', { type: 'text' });
  resultInput.id = id;
  resultInput.value = value;

  const result = document.createElement('li');
  result.appendChild(resultInput);

  const results = document.querySelector('#results ul');
  results.appendChild(result);

  resultInput.addEventListener('input', (e) => {
    updateSelectionValue(e.target.id, e.target.value)
  });
};

const rebuildInputList = () => {
  const results = document.querySelector('#results ul');
  results.innerHTML = '';

  selections.forEach(selection => {
    addInputToList(selection.id, selection.value);
  });
};

const updateSelectionValue = (id, value) => {
  const selection = selections.find(selection => selection.id === id);
  selection.value = value;
  console.log({ selections });
  updateTotal();
};

const updateTotal = () => {
  const total = selections.reduce((acc, selection) => {
    let value = parseInt(selection.value);

    if (isNaN(value)) value = 0;

    return acc + value;
  }, 0);

  document.getElementById('total').innerHTML = total;
};

const redrawSelectionCanvas = (currentRect = null) => {
  selectionCtx.clearRect(0, 0, selectionLayer.width, selectionLayer.height);

  selectionCtx.strokeStyle = 'red';
  selectionCtx.lineWidth = 2;

  selections.forEach(selection => {
    selectionCtx.strokeRect(selection.x, selection.y, selection.width, selection.height);
  });

  if (currentRect) {
    selectionCtx.strokeRect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
  }
};

const clearSelections = () => {
  selections = [];
  rebuildInputList();
  redrawSelectionCanvas();
  updateTotal();
};

selectionLayer.addEventListener('mousedown', startSelection);
selectionLayer.addEventListener('mousemove', updateSelection);
selectionLayer.addEventListener('mouseup', endSelection);
selectionLayer.addEventListener('mouseout', endSelection);

document.getElementById('clear-selections').addEventListener('click', clearSelections);
