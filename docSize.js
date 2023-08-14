// Constants
const docSizes = {
    "5x7": { description: "5x7", width: 5, length: 7 },
    "6x9": { description: "6x9", width: 6, length: 9 },
    "8x10": { description: "8x10", width: 8, length: 10 },
    "8.5x11": { description: "8.5x11", width: 8.5, length: 11 },
    "9x12": { description: "9x12", width: 9, length: 12 },
    "4.25x5.5": { description: "4.25x5.5", width: 4.25, length: 5.5 },
    "4.25x6.75": { description: "4.25x6.75", width: 4.25, length: 6.75 },
    "5.5x8.5": { description: "5.5x8.5", width: 5.5, length: 8.5 },
    "6x6": { description: "6x6", width: 6, length: 6 },
};

// Functions
function populateDocSizes() {
    let optionsHTML = "";
    for (const size in docSizes) {
        optionsHTML += `<option value="${size}">${size}</option>`;
    }
    document.getElementById("docSize").innerHTML = optionsHTML;
}

function setDimensionsForSelectedDoc() {
    const selectedSize = docSizes[document.getElementById("docSize").value];
    if (selectedSize) {
        document.getElementById("docWidth").value = selectedSize.width;
        document.getElementById("docLength").value = selectedSize.length;
    } else {
        console.error("Selected document size not found!");
    }
}

function initializeDocSizes() {
    populateDocSizes();
    setDimensionsForSelectedDoc();
}

// Initialize document sizes on page load:
window.addEventListener('load', initializeDocSizes);
document.getElementById("docSize").addEventListener('change', setDimensionsForSelectedDoc);
