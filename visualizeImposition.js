//Imposition Visualizer
/**
 * Visualize imposition by creating a grid of documents on a sheet.
 *
 * @param {number} sheetWidth - The width of the sheet in inches.
 * @param {number} sheetLength - The length of the sheet in inches.
 * @param {number} leadTrim - The top lead or margin in inches.
 * @param {number} sideLead - The side lead or margin in inches.
 * @param {number} docsDown - The number of documents down.
 * @param {number} docsAcross - The number of documents across.
 * @param {number} docWidth - The width of an individual document in inches.
 * @param {number} docLength - The length of an individual document in inches.
 * @param {number} gutterWidth - The width of the gutter between documents in inches.
 * @param {number} gutterLength - The length of the gutter between documents in inches.
 */

// Call visualizeImposition with default values on load
window.addEventListener("load", function() {
  visualizeImposition(12, 18, 0.25, 0.25, 2, 2, 5, 7, 0.315, 0.315);
});

const docDivs = []; // Move the declaration outside of the function

function visualizeImposition(sheetWidth, sheetLength, leadTrim, sideTrim, docsDown, docsAcross, docWidth, docLength, gutterWidth, gutterLength) {
  const visualizationDiv = document.getElementById("sheetWrapper");
  visualizationDiv.style.width = `${sheetWidth * 25.4}px`;
  visualizationDiv.style.height = `${sheetLength * 25.4}px`;
  visualizationDiv.innerHTML = ""; // Clear existing content

  const totalDocWidth = (docWidth * docsAcross + gutterWidth * (docsAcross - 1)) * 25.4;
  const totalDocHeight = (docLength * docsDown + gutterLength * (docsDown - 1)) * 25.4;

  const offsetX = (sheetWidth * 25.4 - totalDocWidth - sideTrim) / 2;
  const offsetY = (sheetLength * 25.4 - totalDocHeight - leadTrim) / 2;

  docDivs.length = 0; // Clear the array

  for (let i = 0; i < docsDown; i++) {
    for (let j = 0; j < docsAcross; j++) {
      const docDiv = document.createElement("div");
      docDiv.style.width = `${docWidth * 25.4}px`;
      docDiv.style.height = `${docLength * 25.4}px`;
      docDiv.style.position = "absolute";
      docDiv.style.left = `${offsetX + j * (docWidth + gutterWidth) * 25.4}px`;
      docDiv.style.top = `${offsetY + i * (docLength + gutterLength) * 25.4}px`;
      docDiv.style.backgroundColor = "blue";
      docDiv.style.border = "2px solid black";
      docDivs.push(docDiv); // Add the div element to the array
    }
  }

  // Append all the div elements to the visualizationDiv at once
  visualizationDiv.append(...docDivs);
}