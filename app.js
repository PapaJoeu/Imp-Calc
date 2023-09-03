// Constants
const MM_CONVERSION_FACTOR = 25.4;

// --------------------- DOM References ---------------------
// Object containing references to important DOM elements for easy access.
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

// --------------------- Utility Functions ---------------------
/**
 * Retrieves the numerical value from a DOM element.
 * @param {HTMLElement} element - The DOM element to retrieve the value from.
 * @returns {number} - The parsed float value of the element's content.
 */
function getInputValue(element) {
    return parseFloat(element.value);
}

/**
 * Displays a value in the specified DOM element, with an optional multiplier.
 * @param {string} id - The ID of the DOM element to update.
 * @param {number} value - The value to display.
 * @param {number} [multiplier=1] - An optional multiplier for the value.
 */
function displayValue(id, value, multiplier = 1) {
    document.getElementById(id).innerText = (value * multiplier).toFixed(3);
}

// --------------------- Core Functions ---------------------
/**
 * Updates the number of documents that can fit across and down the sheet based on user input.
 */
function updateDocsAcrossAndDown() {
    const {
        sheetWidth,
        sheetLength,
        docWidth,
        docLength,
        gutterWidth,
        gutterLength
    } = elements;

  function calculateMaxDocs(sheetSize, docSize, gutterSize) {
    const availableSpace = sheetSize + gutterSize;
    const docsWithMargin = docSize + gutterSize;
    return Math.floor(availableSpace / docsWithMargin);
  }

    const docsAcross = calculateMaxDocs(+sheetWidth.value, +docWidth.value, +gutterWidth.value);
    const docsDown = calculateMaxDocs(+sheetLength.value, +docLength.value, +gutterLength.value);

    elements.docsAcross.value = docsAcross;
    elements.docsDown.value = docsDown;
}

/**
 * Computes and displays the necessary results based on input values.
 */
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
    visualizeImposition(sheetWidth, sheetLength, leadTrim, sideTrim, docsDown, docsAcross, docWidth, docLength, gutterWidth, gutterLength);
  }

/**
 * Displays results in the 'resultsTableBody' based on various measurements.
 * @param {number} sheetWidth - Width of the sheet.
 * @param {number} sheetLength - Length of the sheet.
 * @param {number} docWidth - Width of the document.
 * @param {number} docLength - Length of the document.
 * @param {number} topLead - Lead trim at the top.
 * @param {number} sideLead - Side trim.
 * @param {number} gutterWidth - Width of the gutter.
 * @param {number} gutterLength - Length of the gutter.
 * @param {number} docsAcross - Number of documents across the sheet.
 * @param {number} docsDown - Number of documents down the sheet.
 */
function displayResults(sheetWidth, sheetLength, docWidth, docLength, topLead, sideLead, gutterWidth, gutterLength, docsAcross, docsDown) {
    const resultsTableBody = document.getElementById("resultsTableBody");
    resultsTableBody.innerHTML = ""; // Clear previous results

    const measurements = [
        ["Sheet Width", sheetWidth, "sheetWidthResult"],
        ["Sheet Length", sheetLength, "sheetLengthResult"],
        ["Document Width", docWidth, "docWidthResult"],
        ["Document Length", docLength, "docLengthResult"],
        ["Top Lead", topLead, "topLeadResult"],
        ["Side Lead", sideLead, "sideLeadResult"],
        ["Gutter Width", gutterWidth, "gutterWidthResult"],
        ["Gutter Length", gutterLength, "gutterLengthResult"],
        ["Documents Across", docsAcross, "docsAcrossResult"],
        ["Documents Down", docsDown, "docsDownResult"]
    ];

    measurements.forEach(([label, value, id]) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.innerText = label;
        row.appendChild(nameCell);

        const inchCell = document.createElement("td");
        inchCell.innerText = value.toFixed(3);
        row.appendChild(inchCell);

        const mmCell = document.createElement("td");
        mmCell.innerText = (value * MM_CONVERSION_FACTOR).toFixed(3);
        row.appendChild(mmCell);

        resultsTableBody.appendChild(row);
    });
}

/**
 * Calculates positions for cuts or slits.
 * @param {number} sheetSize - The size of the sheet (width/length).
 * @param {number} docSize - The size of the document (width/length).
 * @param {number} numDocs - Number of documents.
 * @param {number} gutterSize - The size of the gutter.
 * @returns {Array<number>} - Array of positions.
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

/**
 * Displays positions for cuts and slits based on input values.
 * @param {number} docsAcross - Number of documents across the sheet.
 * @param {number} docsDown - Number of documents down the sheet.
 */
function displayCutsAndSlits(docsAcross, docsDown) {
    const sheetWidth = getInputValue(elements.sheetWidth);
    const sheetLength = getInputValue(elements.sheetLength);
    const docWidth = getInputValue(elements.docWidth);
    const docLength = getInputValue(elements.docLength);
    const gutterWidth = getInputValue(elements.gutterWidth);
    const gutterLength = getInputValue(elements.gutterLength);

    const cuts = calculatePositions(sheetLength, docLength, docsDown, gutterLength);
    const slits = calculatePositions(sheetWidth, docWidth, docsAcross, gutterWidth);

    const cutsResults = cuts.map((cut, index) => `<tr><td>Cut ${index + 1}</td><td>${cut}</td><td>${(cut * MM_CONVERSION_FACTOR).toFixed(3)}</td></tr>`).join('');
    const slitsResults = slits.map((slit, index) => `<tr><td>Slit ${index + 1}</td><td>${slit}</td><td>${(slit * MM_CONVERSION_FACTOR).toFixed(3)}</td></tr>`).join('');

    document.getElementById("cutsTable").querySelector("tbody").innerHTML = cutsResults;
    document.getElementById("slitsTable").querySelector("tbody").innerHTML = slitsResults;
}

// --------------------- Event Listeners ---------------------
elements.calculateButton.addEventListener("click", calculate);

['sheetWidth', 'sheetLength', 'docWidth', 'docLength', 'gutterWidth', 'gutterLength'].forEach(id => {
    elements[id].addEventListener("change", updateDocsAcrossAndDown);
});
