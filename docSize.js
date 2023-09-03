// Array of document sizes with descriptions, widths, lengths, and types
const documentSizes = [
    { description: "3.5x2", width: 3.5, length: 2, type: "Business Card" },
    { description: "5x7", width: 5, length: 7, type: "Postcard" },
    { description: "6x9", width: 6, length: 9, type: "Flyer" },
    { description: "8x10", width: 8, length: 10, type: "Photo" },
    { description: "8.5x11", width: 8.5, length: 11, type: "Letter" },
    { description: "9x12", width: 9, length: 12, type: "Envelope" },
    { description: "4.25x5.5", width: 4.25, length: 5.5, type: "Note Card" },
    { description: "4.25x6.75", width: 4.25, length: 6.75, type: "Invitation" },
    { description: "5.5x8.5", width: 5.5, length: 8.5, type: "Half Sheet" },
    { description: "6x6", width: 6, length: 6, type: "Square" },
    { description: "A7", width: 5.25, length: 7.25, type: "Envelope" },
    { description: "A6", width: 4.75, length: 6.5, type: "Envelope" },
    { description: "A2", width: 4.375, length: 5.75, type: "Envelope" },
    { description: "A1", width: 3.625, length: 5.125, type: "Envelope" },
    { description: "A9", width: 5.75, length: 8.75, type: "Envelope" },
    { description: "A8", width: 5.5, length: 8.125, type: "Envelope" },
    { description: "A10", width: 6, length: 9.5, type: "Envelope" },
    { description: "A4", width: 8.25, length: 11.75, type: "Paper" },
    { description: "A3", width: 11.75, length: 16.5, type: "Paper" },
    { description: "A5", width: 5.75, length: 8.25, type: "Paper" },
    { description: "A0", width: 33.11, length: 46.81, type: "Paper" },
    { description: "A1", width: 23.39, length: 33.11, type: "Paper" },
    { description: "A2", width: 16.54, length: 23.39, type: "Paper" },
    { description: "A3", width: 11.69, length: 16.54, type: "Paper" },
    { description: "A4", width: 8.27, length: 11.69, type: "Paper" },
    { description: "A5", width: 5.83, length: 8.27, type: "Paper" },
    { description: "A6", width: 4.13, length: 5.83, type: "Paper" },
    { description: "A7", width: 2.91, length: 4.13, type: "Paper" },
    { description: "A8", width: 2.05, length: 2.91, type: "Paper" },
    { description: "A9", width: 1.46, length: 2.05, type: "Paper" },
    { description: "A10", width: 1.02, length: 1.46, type: "Paper" },
    { description: "B0", width: 39.37, length: 55.67, type: "Paper" },
    { description: "B1", width: 27.83, length: 39.37, type: "Paper" },
    { description: "B2", width: 19.69, length: 27.83, type: "Paper" },
    { description: "B3", width: 13.90, length: 19.69, type: "Paper" },
    { description: "B4", width: 9.84, length: 13.90, type: "Paper" },
    { description: "B5", width: 6.93, length: 9.84, type: "Paper" },
    { description: "B6", width: 4.92, length: 6.93, type: "Paper" },
    { description: "B7", width: 3.46, length: 4.92, type: "Paper" },
    { description: "B8", width: 2.44, length: 3.46, type: "Paper" },
    { description: "B9", width: 1.73, length: 2.44, type: "Paper" },
    { description: "B10", width: 1.22, length: 1.73, type: "Paper" },
    { description: "C0", width: 36.10, length: 51.06, type: "Paper" },
    { description: "C1", width: 25.51, length: 36.10, type: "Paper" },
    { description: "C2", width: 18.03, length: 25.51, type: "Paper" },
    { description: "C3", width: 12.76, length: 18.03, type: "Paper" },
    { description: "C4", width: 9.02, length: 12.76, type: "Paper" },
    { description: "C5", width: 6.38, length: 9.02, type: "Paper" },
    { description: "C6", width: 4.49, length: 6.38, type: "Paper" },
    { description: "C7", width: 3.19, length: 4.49, type: "Paper" },
    { description: "C8", width: 2.24, length: 3.19, type: "Paper" },
    { description: "C9", width: 1.57, length: 2.24, type: "Paper" },
    { description: "C10", width: 1.10, length: 1.57, type: "Paper" },
    { description: "RA0", width: 33.11, length: 46.81, type: "Paper" },
    { description: "RA1", width: 23.39, length: 33.11, type: "Paper" },
    { description: "RA2", width: 16.54, length: 23.39, type: "Paper" },
    { description: "RA3", width: 11.69, length: 16.54, type: "Paper" },
    { description: "RA4", width: 8.27, length: 11.69, type: "Paper" },
    { description: "SRA0", width: 35.43, length: 50.39, type: "Paper" },
    { description: "SRA1", width: 25.20, length: 35.43, type: "Paper" },
    { description: "SRA2", width: 17.72, length: 25.20, type: "Paper" },
    { description: "SRA3", width: 12.60, length: 17.72, type: "Paper" },
    { description: "SRA4", width: 8.86, length: 12.60, type: "Paper" },
    { description: "Executive", width: 7.25, length: 10.5, type: "Paper" },
    { description: "Folio", width: 8.5, length: 13, type: "Paper" },
    { description: "Legal", width: 8.5, length: 14, type: "Paper" },
    { description: "Letter", width: 8.5, length: 11, type: "Paper" },
    { description: "Tabloid", width: 11, length: 17, type: "Paper" },
    { description: "Ledger", width: 17, length: 11, type: "Paper" },
    { description: "Junior Legal", width: 5, length: 8, type: "Paper" },
    { description: "Government Letter", width: 8, length: 10.5, type: "Paper" },
    { description: "Government Legal", width: 8.5, length: 13, type: "Paper" },
    { description: "ANSI A", width: 8.5, length: 11, type: "Paper" },
    { description: "ANSI B", width: 11, length: 17, type: "Paper" },
    { description: "ANSI C", width: 17, length: 22, type: "Paper" },
    { description: "ANSI D", width: 22, length: 34, type: "Paper" },
    { description: "ANSI E", width: 34, length: 44, type: "Paper" },
    { description: "Arch A", width: 9, length: 12, type: "Paper" },
    { description: "Arch B", width: 12, length: 18, type: "Paper" },
    { description: "Arch C", width: 18, length: 24, type: "Paper" },
    { description: "Arch D", width: 24, length: 36, type: "Paper" },
    { description: "Arch E", width: 36, length: 48, type: "Paper" },
    { description: "Arch E1", width: 30, length: 42, type: "Paper" },
    { description: "Arch E2", width: 26, length: 38, type: "Paper" },
    { description: "Arch E3", width: 27, length: 39, type: "Paper" },
    { description: "Arch E4", width: 48, length: 72, type: "Paper" },
    { description: "Arch A", width: 9, length: 12, type: "Paper" },
    { description: "Arch B", width: 12, length: 18, type: "Paper" },
    { description: "Arch C", width: 18, length: 24, type: "Paper" },
    { description: "Arch D", width: 24, length: 36, type: "Paper" },
    { description: "Arch E", width: 36, length: 48, type: "Paper" },    
    { description: "Arch E1", width: 30, length: 42, type: "Paper" },
    { description: "Arch E2", width: 26, length: 38, type: "Paper" },
    { description: "Arch E3", width: 27, length: 39, type: "Paper" },
    { description: "Arch E4", width: 48, length: 72, type: "Paper" },
    { description: "Arch E", width: 36, length: 48, type: "Paper" },
    { description: "Arch E1", width: 30, length: 42, type: "Paper" },
    { description: "Arch E2", width: 26, length: 38, type: "Paper" },
    { description: "Arch E3", width: 27, length: 39, type: "Paper" },
    { description: "Arch E4", width: 48, length: 72, type: "Paper" },
    { description: "Arch E", width: 36, length: 48, type: "Paper" },
    { description: "Arch E1", width: 30, length: 42, type: "Paper" },
    { description: "Arch E2", width: 26, length: 38, type: "Paper" },
    { description: "Arch E3", width: 27, length: 39, type: "Paper" },
    { description: "Arch E4", width: 48, length: 72, type: "Paper" },
    { description: "Arch E", width: 36, length: 48, type: "Paper" },
    { description: "Arch E1", width: 30, length: 42, type: "Paper" },
    { description: "Arch E2", width: 26, length: 38, type: "Paper" },
    { description: "Arch E3", width: 27, length: 39, type: "Paper" },
    { description: "Arch E4", width: 48, length: 72, type: "Paper" },
    { description: "Arch E", width: 36, length: 48, type: "Paper" },
    { description: "Arch E1", width: 30, length: 42, type: "Paper" },
    { description: "Arch E2", width: 26, length: 38, type: "Paper" },
    { description: "Arch E3", width: 27, length: 39, type: "Paper" },
    { description: "Arch E4", width: 48, length: 72, type: "Paper" },
    { description: "Arch E", width: 36, length: 48, type: "Paper" },
    { description: "Arch E1", width: 30, length: 42, type: "Paper" }
];

// Populates the dropdown list for document size options
function populateDocumentSizeDropdown() {
    const optionsHTML = documentSizes.map(size => `<option value="${size.description}">${size.description}</option>`).join('');
    document.getElementById("docSize").innerHTML = optionsHTML;
}

// Sets the dimensions for the selected document size
function setDimensionsForSelectedDoc() {
    const selectedSize = documentSizes.find(size => size.description === document.getElementById("docSize").value);
    if (selectedSize) {
        document.getElementById("docWidth").value = selectedSize.width;
        document.getElementById("docLength").value = selectedSize.length;
        updateDocsAcrossAndDown(); // Update other document-related properties
        calculate(); // Perform calculations based on the selected document size
    } else {
        console.error("Selected document size not found!");
    }
}

// Initializes the document size dropdown and sets initial dimensions
function initializeDocSizes() {
    populateDocumentSizeDropdown();
    setDimensionsForSelectedDoc();
}

// Event listener when the window has finished loading, initializes document sizes
window.addEventListener('load', initializeDocSizes);

// Event listener for changes in the selected document size, updates dimensions accordingly
document.getElementById("docSize").addEventListener('change', setDimensionsForSelectedDoc);