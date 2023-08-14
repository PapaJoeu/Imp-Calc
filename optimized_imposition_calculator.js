
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
  progressBar: document.getElementById("progressBar"),
  calculateButton: document.getElementById("calculate"),
  optimizeButton: document.getElementById("optimize")  // New Optimize button
};

// Data structure to store original and optimized values
const state = {
  originalValues: {},
  optimizedValues: {},
  isOptimizedDisplayed: false
};

// Event Listeners
elements.calculateButton.addEventListener("click", calculate);
elements.optimizeButton.addEventListener("click", toggleOptimizedValues);  // New Event Listener
elements.sheetWidth.addEventListener("change", updateDocsAcrossAndDown);
elements.sheetLength.addEventListener("change", updateDocsAcrossAndDown);
elements.docWidth.addEventListener("change", updateDocsAcrossAndDown);
elements.docLength.addEventListener("change", updateDocsAcrossAndDown);
elements.gutterWidth.addEventListener("change", updateDocsAcrossAndDown);
elements.gutterLength.addEventListener("change", updateDocsAcrossAndDown);

// ... [Rest of the provided JS code remains unchanged]

// New function to toggle between original and optimized values
function toggleOptimizedValues() {
  if (state.isOptimizedDisplayed) {
    // If optimized values are displayed, revert to original values
    for (let key in state.originalValues) {
      if (elements[key]) {
        elements[key].value = state.originalValues[key];
      }
    }
  } else {
    // If original values are displayed, update to optimized values
    for (let key in state.optimizedValues) {
      if (elements[key]) {
        elements[key].value = state.optimizedValues[key];
      }
    }
  }
  
  // Toggle the flag
  state.isOptimizedDisplayed = !state.isOptimizedDisplayed;
}

// Updated calculate function to compute and store optimized values
function calculate() {
  // ... [Original code for calculations]

  // After doing the original calculations, compute the optimized values
  computeOptimizedValues();
}

// New function to compute the optimized values
function computeOptimizedValues() {
  // Here, run the logic to determine the optimal layout (the logic isn't provided yet)
  // For the sake of example, I'll make a simple placeholder logic.
  
  // Placeholder logic: Just add 1 to each input value (this is just for demonstration)
  for (let key in elements) {
    if (elements[key] && key !== 'calculateButton' && key !== 'optimizeButton') {
      state.originalValues[key] = parseFloat(elements[key].value);
      state.optimizedValues[key] = state.originalValues[key] + 1;
    }
  }
}



function computeOptimizedValues() {
    // Define possible sheet sizes
    const sheetSizes = [
        { width: 12, length: 18 },
        { width: 13, length: 19 }
    ];

    let bestLayout = {
        sheetSize: null,
        orientation: null,
        areaImposedPercentage: 0
    };

    // Retrieve current document dimensions
    const docWidth = parseFloat(elements.docWidth.value);
    const docLength = parseFloat(elements.docLength.value);

    sheetSizes.forEach(sheet => {
        // Test with original orientation
        let originalOrientation = testLayout(sheet.width, sheet.length, docWidth, docLength);
        if (originalOrientation.areaImposedPercentage > bestLayout.areaImposedPercentage) {
            bestLayout = {
                sheetSize: sheet,
                orientation: 'original',
                ...originalOrientation
            };
        }

        // Test with rotated orientation
        let rotatedOrientation = testLayout(sheet.width, sheet.length, docLength, docWidth);
        if (rotatedOrientation.areaImposedPercentage > bestLayout.areaImposedPercentage) {
            bestLayout = {
                sheetSize: sheet,
                orientation: 'rotated',
                ...rotatedOrientation
            };
        }
    });

    // Store the optimized values in the state
    state.optimizedValues.sheetWidth = bestLayout.sheetSize.width;
    state.optimizedValues.sheetLength = bestLayout.sheetSize.length;
    state.optimizedValues.docWidth = (bestLayout.orientation === 'original') ? docWidth : docLength;
    state.optimizedValues.docLength = (bestLayout.orientation === 'original') ? docLength : docWidth;
}

function testLayout(sheetWidth, sheetLength, docWidth, docLength) {
    const gutterWidth = parseFloat(elements.gutterWidth.value);
    const gutterLength = parseFloat(elements.gutterLength.value);

    const docsAcross = Math.floor((sheetWidth - gutterWidth) / (docWidth + gutterWidth));
    const docsDown = Math.floor((sheetLength - gutterLength) / (docLength + gutterLength));
    const nUp = docsAcross * docsDown;

    const imposedArea = nUp * docWidth * docLength;
    const sheetArea = sheetWidth * sheetLength;
    const areaImposedPercentage = (imposedArea / sheetArea) * 100;

    return {
        docsAcross,
        docsDown,
        areaImposedPercentage
    };
}
