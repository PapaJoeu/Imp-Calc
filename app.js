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
// let requestLog = [];

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
    console.error('Invalid input values. Please enter valid numbers.');
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
  let cutsSlitsResults = "";
  cuts.forEach((cut, index) => {
    cutsSlitsResults += `<tr><td>Cut ${index + 1}</td><td>${cut}</td><td>${(cut * 25.4).toFixed(3)}</td></tr>`;
  });
  slits.forEach((slit, index) => {
    cutsSlitsResults += `<tr><td>Slit ${index + 1}</td><td>${slit}</td><td>${(slit * 25.4).toFixed(3)}</td></tr>`;
  });

  // Populate the cuts and slits table
  document.getElementById("cutsSlitsResults").innerHTML = cutsSlitsResults;
}

/**
 * Calculate the positions of cuts based on the sheet length, document length, number of documents down, and gutter length.
 *
 * @param {number} sheetLength - The length of the sheet.
 * @param {number} docLength - The length of an individual document.
 * @param {number} docsDown - The number of documents in the vertical direction.
 * @param {number} gutterLength - The length of the gutter between documents.
 * @returns {number[]} - An array containing the cut positions.
 */
function calculateCuts(sheetLength, docLength, docsDown, gutterLength) {
  const cuts = [];
  const position = (sheetLength - ((docLength * docsDown) + (gutterLength * (docsDown - 1)))) / 2;

  for (let i = 0; i < docsDown * 2; i++) {
    const offset = Math.floor(i / 2);
    const cutPosition = position + offset * (docLength + gutterLength) + (i % 2 === 0 ? 0 : docLength);
    cuts.push(cutPosition.toFixed(3));
  }

  return cuts;
}

/**
 * Calculate the positions of slits based on the sheet width, document width, number of documents across, and gutter width.
 *
 * @param {number} sheetWidth - The width of the sheet.
 * @param {number} docWidth - The width of an individual document.
 * @param {number} docsAcross - The number of documents in the horizontal direction.
 * @param {number} gutterWidth - The width of the gutter between documents.
 * @returns {number[]} - An array containing the slit positions.
 */
function calculateSlits(sheetWidth, docWidth, docsAcross, gutterWidth) {
  const slits = [];
  const position = (sheetWidth - ((docWidth * docsAcross) + (gutterWidth * (docsAcross - 1)))) / 2;

  for (let i = 0; i < docsAcross * 2; i++) {
    const offset = Math.floor(i / 2);
    const slitPosition = position + offset * (docWidth + gutterWidth) + (i % 2 === 0 ? 0 : docWidth);
    slits.push(slitPosition.toFixed(3));
  }

  return slits;
}

// New function to create a new row in the history table
function addHistoryRow(timeOfCalculation, sheetWidth, sheetLength, docWidth, docLength) {
  const historyTableBody = document.getElementById('historyTableBody');
  const newRow = historyTableBody.insertRow();
  newRow.innerHTML = `
    <td>${timeOfCalculation}</td>
    <td>${sheetWidth.toFixed(3)} in</td>
    <td>${sheetLength.toFixed(3)} in</td>
    <td>${docWidth.toFixed(3)} in</td>
    <td>${docLength.toFixed(3)} in</td>
  `;
}

