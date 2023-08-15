// Constants
const docSizes = [
    { description: "5x7", width: 5, length: 7 },
    { description: "6x9", width: 6, length: 9 },
    { description: "8x10", width: 8, length: 10 },
    { description: "8.5x11", width: 8.5, length: 11 },
    { description: "9x12", width: 9, length: 12 },
    { description: "4.25x5.5", width: 4.25, length: 5.5 },
    { description: "4.25x6.75", width: 4.25, length: 6.75 },
    { description: "5.5x8.5", width: 5.5, length: 8.5 },
    { description: "6x6", width: 6, length: 6 },
];

// Functions
function populateDocSizes() {
    const optionsHTML = docSizes.map(size => `<option value="${size.description}">${size.description}</option>`).join('');
    document.getElementById("docSize").innerHTML = optionsHTML;
}

function setDimensionsForSelectedDoc() {
    const selectedSize = docSizes.find(size => size.description === document.getElementById("docSize").value);
    if (selectedSize) {
        document.getElementById("docWidth").value = selectedSize.width;
        document.getElementById("docLength").value = selectedSize.length;
        // call updateDocsAcrossAndDown and calculate
        updateDocsAcrossAndDown();
        calculate();
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