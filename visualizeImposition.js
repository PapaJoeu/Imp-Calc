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
  gutterLength,
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
    docDiv.style.backgroundColor = "lightpink";
    docDiv.style.border = "1px white solid";
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

// Code To Visualize Cuts and Slits one Day
/* Cuts
// Initialize the visualization when the window loads
window.addEventListener("load", function () {
  // Default parameters, including placeholder arrays for cuts and slits
  visualizeImposition(12, 18, 3.685, 1.685, 2, 2, 5, 7, 0.315, 0.315, [], []);
});

// Attach event listeners to input elements to update the visualization
// when any input value changes
["sheetWidth", "sheetLength", "leadTrim", "sideTrim", "docsDown", "docsAcross", 
 "docWidth", "docLength", "gutterWidth", "gutterLength"].forEach(id => {
    document.getElementById(id).addEventListener("input", calculate);
});

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
  cuts,
  slits
) {
  // Get the main visualization container
  const visualizationDiv = document.getElementById("sheetWrapper");

  // Set the size of the visualization container based on sheet dimensions
  visualizationDiv.style.width = `${sheetWidth * 25.4}px`;
  visualizationDiv.style.height = `${sheetLength * 25.4}px`;
  visualizationDiv.innerHTML = "";

  // Calculate total width and height occupied by all docs including gutters
  const totalDocWidth = (docWidth * docsAcross + gutterWidth * (docsAcross - 1)) * 25.4;
  const totalDocHeight = (docLength * docsDown + gutterLength * (docsDown - 1)) * 25.4;

  // Calculate offsets to center the documents on the sheet
  const offsetX = (sheetWidth * 25.4 - totalDocWidth - sideTrim) / 2;
  const offsetY = (sheetLength * 25.4 - totalDocHeight - leadTrim) / 2;

  // Create document divs and set their positions and styles
  const docDivs = [];
  for (let i = 0; i < docsDown; i++) {
    for (let j = 0; j < docsAcross; j++) {
      const docDiv = document.createElement("div");
      // ... [rest of the code for doc visualization]
    }
  }

  // Create and visualize horizontal cuts on the sheet
  for (let i = 0; i < cuts.length; i++) {
    // ... [rest of the code for cut visualization]
  }

  // Create and visualize vertical slits on the sheet
  for (let i = 0; i < slits.length; i++) {
    // ... [rest of the code for slit visualization]
  }

  // Append the document divs to the main visualization container
  visualizationDiv.append(...docDivs);
}
*/