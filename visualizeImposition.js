// Call visualizeImposition with default values on load
window.addEventListener("load", function () {
  visualizeImposition(12, 18, 3.685, 1.685, 2, 2, 5, 7, 0.315, 0.315);
});

// Event Listeners to update the imposition visualization when the input values change
document.getElementById("sheetWidth").addEventListener("input", calculate);
document.getElementById("sheetLength").addEventListener("input", calculate);
document.getElementById("leadTrim").addEventListener("input", calculate);
document.getElementById("sideTrim").addEventListener("input", calculate);
document.getElementById("docsDown").addEventListener("input", calculate);
document.getElementById("docsAcross").addEventListener("input", calculate);
document.getElementById("docWidth").addEventListener("input", calculate);
document.getElementById("docLength").addEventListener("input", calculate);
document.getElementById("gutterWidth").addEventListener("input", calculate);
document.getElementById("gutterLength").addEventListener("input", calculate);

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

// The Part of the Visualizer That Visualizes The Docs
const docDivs = [];

for (let i = 0; i < docsDown; i++) {
  for (let j = 0; j < docsAcross; j++) {
    const docDiv = document.createElement("div");

    // Set the dimensions and position of the docDiv
    docDiv.style.width = `${docWidth * 25.4}px`;
    docDiv.style.height = `${docLength * 25.4}px`;
    docDiv.style.position = "absolute";
    docDiv.style.left = `${offsetX + j * (docWidth + gutterWidth) * 25.4}px`;
    docDiv.style.top = `${offsetY + i * (docLength + gutterLength) * 25.4}px`;

    // Styling for the docDiv
    docDiv.style.backgroundColor = "blue";
    docDiv.style.border = "2px solid black";
    docDiv.style.display = "flex";
    docDiv.style.alignItems = "center";
    docDiv.style.justifyContent = "center";
    docDiv.style.color = "white";

    // Calculate the font size based on 40% of the width of the docDiv
    const fontSize = (docDiv.style.width.slice(0, -2) * 0.4) / 2;
    docDiv.style.fontSize = `${fontSize}px`;

    docDiv.innerHTML = `${docWidth}" x ${docLength}"`;
    docDivs.push(docDiv);
  }
}

// The Part of the Visualizer that appends the docDivs to the visualizationDiv
visualizationDiv.append(...docDivs);

  visualizationDiv.append(...docDivs);
}

