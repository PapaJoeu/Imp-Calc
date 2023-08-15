// paperSize.js

// Constants
const paperSizes = {
  "12x18": { description: "12x18", width: 12, length: 18 },
  "13x19": { description: "13x19", width: 13, length: 19 },
};

// Cache DOM elements
const paperSizeSelect = document.getElementById("paperSize");
const sheetWidthInput = document.getElementById("sheetWidth");
const sheetLengthInput = document.getElementById("sheetLength");

// Functions
function populatePaperSizes() {
  let optionsHTML = "";
  for (const size in paperSizes) {
    optionsHTML += `<option value="${size}">${size}</option>`;
  }
  paperSizeSelect.innerHTML = optionsHTML;
}

function setDimensionsForSelectedPaper() {
  const selectedSize = paperSizes[paperSizeSelect.value];
  if (selectedSize) {
    sheetWidthInput.value = selectedSize.width;
    sheetLengthInput.value = selectedSize.length;
    // call updateDocsAcrossAndDown and calculate
    updateDocsAcrossAndDown();
    calculate();
  } else {
    console.error("Selected paper size not found!");
  }
}

function initializePaperSizes() {
  populatePaperSizes();
  setDimensionsForSelectedPaper();
}

// Initialize paper sizes on page load:
window.addEventListener('load', initializePaperSizes);
