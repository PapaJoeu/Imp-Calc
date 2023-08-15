// Call visualizeImposition with default values on load
window.addEventListener("load", function () {
  visualizeImposition(12, 18, 3.685, 1.685, 2, 2, 5, 7, 0.315, 0.315);
});

// Event Listeners to update the imposition visualization when the input values change
document.getElementById("sheetWidth").addEventListener("change", calculate);
document.getElementById("sheetLength").addEventListener("change", calculate);
document.getElementById("leadTrim").addEventListener("change", calculate);
document.getElementById("sideTrim").addEventListener("change", calculate);
document.getElementById("docsDown").addEventListener("change", calculate);
document.getElementById("docsAcross").addEventListener("change", calculate);
document.getElementById("docWidth").addEventListener("change", calculate);
document.getElementById("docLength").addEventListener("change", calculate);
document.getElementById("gutterWidth").addEventListener("change", calculate);
document.getElementById("gutterLength").addEventListener("change", calculate);

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
  gutterLength
) {
  const visualizationDiv = document.getElementById("sheetWrapper");
  visualizationDiv.style.width = `${sheetWidth * 25.4}px`;
  visualizationDiv.style.height = `${sheetLength * 25.4}px`;
  visualizationDiv.innerHTML = "";

  const totalDocWidth = (docWidth * docsAcross + gutterWidth * (docsAcross - 1)) * 25.4;
  const totalDocHeight = (docLength * docsDown + gutterLength * (docsDown - 1)) * 25.4;

  const offsetX = (sheetWidth * 25.4 - totalDocWidth - sideTrim) / 2;
  const offsetY = (sheetLength * 25.4 - totalDocHeight - leadTrim) / 2;

  const docDivs = [];

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
      docDivs.push(docDiv);
    }
  }

  visualizationDiv.append(...docDivs);
}

