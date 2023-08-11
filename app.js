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
  calculateButton: document.getElementById("calculate")
};

// Event Listeners
elements.calculateButton.addEventListener("click", calculate);
elements.sheetWidth.addEventListener("change", updateDocsAcrossAndDown);
elements.sheetLength.addEventListener("change", updateDocsAcrossAndDown);
elements.docWidth.addEventListener("change", updateDocsAcrossAndDown);
elements.docLength.addEventListener("change", updateDocsAcrossAndDown);
elements.gutterWidth.addEventListener("change", updateDocsAcrossAndDown);
elements.gutterLength.addEventListener("change", updateDocsAcrossAndDown);

/**
 * Updates the number of documents across and down based on the input values.
 * 
 * @function updateDocsAcrossAndDown
 * @returns {void}
 */
function updateDocsAcrossAndDown() {
  // Retrieve input values
  const sheetWidth = parseFloat(elements.sheetWidth.value);
  const sheetLength = parseFloat(elements.sheetLength.value);
  const docWidth = parseFloat(elements.docWidth.value);
  const docLength = parseFloat(elements.docLength.value);
  const gutterWidth = parseFloat(elements.gutterWidth.value);
  const gutterLength = parseFloat(elements.gutterLength.value);

  // Perform error checks
  if (isNaN(sheetWidth) || isNaN(sheetLength) || isNaN(docWidth) || isNaN(docLength) ||
      isNaN(gutterWidth) || isNaN(gutterLength)) {
    // Handle invalid or missing input values
    elements.docsAcross.value = '';
    elements.docsDown.value = '';
    return;
  }

  // Perform calculations
  const docsAcross = Math.floor((sheetWidth - gutterWidth) / (docWidth + gutterWidth));
  const docsDown = Math.floor((sheetLength - gutterLength) / (docLength + gutterLength));

  // Handle potential calculation errors
  if (isNaN(docsAcross) || isNaN(docsDown) || docsAcross <= 0 || docsDown <= 0) {
    // Handle errors in calculations
    elements.docsAcross.value = '';
    elements.docsDown.value = '';
    console.error('Error calculating the number of documents across and down.');
    return;
  }

  // Update the number of documents across and down
  elements.docsAcross.value = docsAcross;
  elements.docsDown.value = docsDown;
}

/**
 * Calculate Imposition Function
 *
 * This function performs calculations and displays results related to imposition for printing.
 * It retrieves input values from specific elements, calculates lead and side trim, and displays
 * the results on the webpage.
 */
function calculate() {
  try {
    const getInputValue = (element) => parseFloat(element.value);

    // Retrieve input values
    const sheetWidth = getInputValue(elements.sheetWidth);
    const sheetLength = getInputValue(elements.sheetLength);
    const docWidth = getInputValue(elements.docWidth);
    const docLength = getInputValue(elements.docLength);
    const docsAcross = getInputValue(elements.docsAcross);
    const docsDown = getInputValue(elements.docsDown);
    const gutterWidth = getInputValue(elements.gutterWidth);
    const gutterLength = getInputValue(elements.gutterLength);

    // Validate input values
    if (
      [sheetWidth, sheetLength, docWidth, docLength, docsAcross, docsDown, gutterWidth, gutterLength].some(Number.isNaN)
    ) {
      throw new Error("Invalid input. Please enter valid numbers for all fields.");
    }

    // Calculate lead and side trim
    const topLead = sheetLength - (docsDown * docLength + (docsDown - 1) * gutterLength);
    const sideLead = sheetWidth - (docsAcross * docWidth + (docsAcross - 1) * gutterWidth);

    // Display results
    displayResults(sheetWidth, sheetLength, docWidth, docLength, topLead, sideLead);

    // Display cuts and slits
    displayCutsAndSlits(docsAcross, docsDown);

    // Visualize the imposition
    visualizeImposition(sheetWidth, sheetLength, topLead, sideLead, docsDown, docsAcross, docWidth, docLength, gutterWidth, gutterLength);
  } catch (error) {
    console.error("An error occurred:", error.message);
    // Display an error message to the user or handle the error gracefully
  }
}

function displayResults(sheetWidth, sheetLength, docWidth, docLength, topLead, sideLead) {
  const displayValue = (id, value) => {
    document.getElementById(id).innerText = value.toFixed(3);
  };

  const displayValueInMm = (id, value) => {
    const mmValue = (value * 25.4).toFixed(3);
    document.getElementById(id).innerText = mmValue;
  };

  displayValue("sheetWidthResult", sheetWidth);
  displayValueInMm("sheetWidthResult_mm", sheetWidth);
  displayValue("sheetLengthResult", sheetLength);
  displayValueInMm("sheetLengthResult_mm", sheetLength);
  displayValue("docWidthResult", docWidth);
  displayValueInMm("docWidthResult_mm", docWidth);
  displayValue("docLengthResult", docLength);
  displayValueInMm("docLengthResult_mm", docLength);
  displayValue("topLeadResult", topLead);
  displayValueInMm("topLeadResult_mm", topLead);
  displayValue("sideLeadResult", sideLead);
  displayValueInMm("sideLeadResult_mm", sideLead);
}

/**
 * Displays the cuts and slits in a table based on the given imposition parameters.
 *
 * @param {number} docsAcross - Number of documents across the sheet.
 * @param {number} docsDown - Number of documents down the sheet.
 */
function displayCutsAndSlits(docsAcross, docsDown) {
  // Retrieve input values
  const sheetWidth = parseFloat(elements.sheetWidth.value);
  const sheetLength = parseFloat(elements.sheetLength.value);
  const docWidth = parseFloat(elements.docWidth.value);
  const docLength = parseFloat(elements.docLength.value);
  const gutterWidth = parseFloat(elements.gutterWidth.value);
  const gutterLength = parseFloat(elements.gutterLength.value);

  // Calculate cuts
  const cuts = calculateCuts(sheetLength, docLength, docsDown, gutterLength);

  // Calculate slits
  const slits = calculateSlits(sheetWidth, docWidth, docsAcross, gutterWidth);

// Prepare the cuts and slits data
const cutsSlitsResults = cuts.map((cut, index) => `<tr><td>Cut ${index + 1}</td><td>${cut}</td><td>${(cut * 25.4).toFixed(3)}</td></tr>`)
  .concat(slits.map((slit, index) => `<tr><td>Slit ${index + 1}</td><td>${slit}</td><td>${(slit * 25.4).toFixed(3)}</td></tr>`))
  .join('');

// Populate the cuts and slits table
document.getElementById("cutsSlitsResults").innerHTML = cutsSlitsResults;
}

/**
 * Calculate positions based on sheet size, document size, number of documents, and gutter size.
 * @returns {number[]} - Positions array.
 */
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

/** Calculate cut positions based on sheet length, document length, docs down, and gutter length. */
function calculateCuts(sheetLength, docLength, docsDown, gutterLength) {
  return calculatePositions(sheetLength, docLength, docsDown, gutterLength);
}

/** Calculate slit positions based on sheet width, document width, docs across, and gutter width. */
function calculateSlits(sheetWidth, docWidth, docsAcross, gutterWidth) {
  return calculatePositions(sheetWidth, docWidth, docsAcross, gutterWidth);
}
