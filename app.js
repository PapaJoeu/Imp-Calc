const elements = {
  paperSize: document.getElementById("paperSize"),
  sheetWidth: document.getElementById("sheetWidth"),
  sheetLength: document.getElementById("sheetLength"),
  docWidth: document.getElementById("docWidth"),
  docLength: document.getElementById("docLength"),
  docsAcross: document.getElementById("docsAcross"),
  docsDown: document.getElementById("docsDown"),
  gutterWidth: document.getElementById("gutterWidth"),
  gutterLength: document.getElementById("gutterLength"),
  calculateButton: document.getElementById("calculate")
};

// Utility functions
function getInputValue(element) {
  return parseFloat(element.value);
}

function displayValue(id, value, multiplier = 1) {
  document.getElementById(id).innerText = (value * multiplier).toFixed(3);
}

function updateDocsAcrossAndDown() {
  // Extract values from elements object using destructuring assignment
  const {
    sheetWidth,
    sheetLength,
    docWidth,
    docLength,
    gutterWidth,
    gutterLength
  } = elements;

  // Function to calculate the maximum number of documents that can fit
  const calculateMaxDocs = (sheetSize, docSize, gutterSize) =>
    Math.floor((sheetSize - gutterSize) / (docSize + gutterSize));

  // Calculate the number of documents across and down
  const docsAcross = calculateMaxDocs(+sheetWidth.value, +docWidth.value, +gutterWidth.value);
  const docsDown = calculateMaxDocs(+sheetLength.value, +docLength.value, +gutterLength.value);

  // Assign calculated values to element properties
  elements.docsAcross.value = docsAcross;
  elements.docsDown.value = docsDown;
}

  function calculate() {
  const {
      sheetWidth,
      sheetLength,
      docWidth,
      docLength,
      docsAcross,
      docsDown,
      gutterWidth,
      gutterLength
  } = Object.fromEntries(Object.entries(elements).map(([key, element]) => [key, parseFloat(element.value)]));

  if ([sheetWidth, sheetLength, docWidth, docLength, docsAcross, docsDown, gutterWidth, gutterLength].some(Number.isNaN)) {
      console.error("Invalid input. Please enter valid numbers for all fields.");
      return;
  }

  const calculateTrim = (sheetSize, docSize, numDocs, gutterSize) => sheetSize - (numDocs * docSize + (numDocs - 1) * gutterSize);
  const leadTrim = calculateTrim(sheetLength, docLength, docsDown, gutterLength);
  const sideTrim = calculateTrim(sheetWidth, docWidth, docsAcross, gutterWidth);

  displayResults(sheetWidth, sheetLength, docWidth, docLength, leadTrim, sideTrim, gutterWidth, gutterLength, docsAcross, docsDown);
  displayCutsAndSlits(docsAcross, docsDown);

  // Visualize the imposition
  visualizeImposition(sheetWidth, sheetLength, leadTrim, sideTrim, docsDown, docsAcross, docWidth, docLength, gutterWidth, gutterLength);
  }

function calculatePositions(sheetSize, docSize, numDocs, gutterSize) {
  const positions = [];
  const position = (sheetSize - ((docSize * numDocs) + (gutterSize * (numDocs - 1)))) / 2;

  for (let i = 0; i < numDocs * 2; i++) {
    const offset = Math.floor(i / 2);
    const calculatedPosition = position + offset * (docSize + gutterSize) + (i % 2 === 0 ? 0 : docSize);
    positions.push(calculatedPosition.toFixed(3));
  }

  return positions;
}


// Event Listeners
elements.calculateButton.addEventListener("click", calculate);

['sheetWidth', 'sheetLength', 'docWidth', 'docLength', 'gutterWidth', 'gutterLength'].forEach(id => {
  elements[id].addEventListener("change", updateDocsAcrossAndDown);
});

