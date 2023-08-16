

// A function so that when the optimize button is pressed the values in docwidth and doclength are swapped
// Path: rotate.js

document.getElementById("rotateDocs").addEventListener("click", rotateDocs);

function rotateDocs() {
    var docWidth = document.getElementById("docWidth").value;
    var docLength = document.getElementById("docLength").value;
    document.getElementById("docWidth").value = docLength;
    document.getElementById("docLength").value = docWidth;

    updateDocsAcrossAndDown();
    calculate();
    }

