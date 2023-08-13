// paperSizes.js

// Constants
const paperSizes = {
  "12x18 - 12in x 18in": { width: 12, length: 18 },
  "13x19 - 13in x 19in": { width: 13, length: 19 },
};

// Functions
function populatePaperSizes() {
  const paperSizeSelect = document.getElementById("paperSize");
  paperSizeSelect.innerHTML = "";
  const optionsHTML = Object.keys(paperSizes)
    .map((size) => `<option value="${size}">${size}</option>`)
    .join("");
  paperSizeSelect.innerHTML = optionsHTML;
}

function setDimensionsForSelectedPaper() {
  const selectedPaperSize = document.getElementById("paperSize").value;
  const selectedSize = paperSizes[selectedPaperSize];
  document.getElementById("sheetWidth").value = selectedSize.width;
  document.getElementById("sheetLength").value = selectedSize.length;
}

// Initialize paper sizes on page load:
window.onload = function () {
  initializePaperSizes();
};

function initializePaperSizes() {
  populatePaperSizes();
  setDimensionsForSelectedPaper();
}