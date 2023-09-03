/**
 * Visualize imposition on a sheet.
 *
 * @param {number} sheetWidth - The width of the sheet in inches.
 * @param {number} sheetLength - The length of the sheet in inches.
 * @param {number} leadTrim - The amount of trim at the leading edge in inches.
 * @param {number} sideTrim - The amount of trim at the side edge in inches.
 * @param {number} docsDown - The number of documents arranged vertically on the sheet.
 * @param {number} docsAcross - The number of documents arranged horizontally on the sheet.
 * @param {number} docWidth - The width of each document in inches.
 * @param {number} docLength - The length of each document in inches.
 * @param {number} gutterWidth - The width of the gutter space between documents in inches.
 * @param {number} gutterLength - The length of the gutter space between documents in inches.
 */
function visualizeImposition(
  sheetWidth,
  sheetLength,
  leadTrim,
  sideTrim,
  docsDown,
  docsAcross,
  docWidth,
  docLength,
  gutterWidth,
  gutterLength,
) {
  const visualizationDiv = document.getElementById("sheetWrapper");

  // Set the dimensions of the visualization div
  visualizationDiv.style.width = `${sheetWidth * 25.4}px`;
  visualizationDiv.style.height = `${sheetLength * 25.4}px`;

  // Clear the content of the visualization div
  visualizationDiv.innerHTML = "";

  // Calculate the total width and height occupied by the documents and gutters
  const totalDocWidth = (docWidth * docsAcross + gutterWidth * (docsAcross - 1)) * 25.4;
  const totalDocHeight = (docLength * docsDown + gutterLength * (docsDown - 1)) * 25.4;

  // Calculate the offset from the edges of the sheet
  const offsetX = (sheetWidth * 25.4 - totalDocWidth - sideTrim) / 2;
  const offsetY = (sheetLength * 25.4 - totalDocHeight - leadTrim) / 2;

  const docDivs = [];

  // Create div elements for each document and position them on the sheet
  for (let i = 0; i < docsDown; i++) {
    for (let j = 0; j < docsAcross; j++) {
      const docDiv = document.createElement("div");

      // Set the dimensions and position of the document div
      docDiv.style.width = `${docWidth * 25.4}px`;
      docDiv.style.height = `${docLength * 25.4}px`;
      docDiv.style.position = "absolute";
      docDiv.style.left = `${offsetX + j * (docWidth + gutterWidth) * 25.4}px`;
      docDiv.style.top = `${offsetY + i * (docLength + gutterLength) * 25.4}px`;

      // Styling for the document div
      docDiv.style.backgroundColor = "lightpink";
      docDiv.style.border = "1px white solid";
      docDiv.style.display = "flex";
      docDiv.style.alignItems = "center";
      docDiv.style.justifyContent = "center";
      docDiv.style.color = "white";

      // Calculate font size based on the width of the document div
      const fontSize = (docDiv.style.width.slice(0, -2) * 0.4) / 2;
      docDiv.style.fontSize = `${fontSize}px`;

      // Set the content of the document div
      docDiv.innerHTML = `${docWidth}" x ${docLength}"`;
      docDivs.push(docDiv);
    }
  }

  // Append the document divs to the visualization div
  visualizationDiv.append(...docDivs);
}