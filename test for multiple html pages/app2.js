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
  
  // Utility functions
  function getInputValue(element) {
    return parseFloat(element.value);
  }
  
  function displayValue(id, value, multiplier = 1) {
    document.getElementById(id).innerText = (value * multiplier).toFixed(3);
  }
  
  function updateDocsAcrossAndDown() {
    const {
      sheetWidth,
      sheetLength,
      docWidth,
      docLength,
      gutterWidth,
      gutterLength
    } = Object.fromEntries(Object.entries(elements).map(([key, element]) => [key, getInputValue(element)]));
  
    const calculateMaxDocs = (sheetSize, docSize, gutterSize) =>
      Math.floor((sheetSize - gutterSize) / (docSize + gutterSize));
  
    const docsAcross = calculateMaxDocs(sheetWidth, docWidth, gutterWidth);
    const docsDown = calculateMaxDocs(sheetLength, docLength, gutterLength);
  
    if (docsAcross <= 0 || docsDown <= 0) {
      console.error('Error calculating the number of documents across and down.');
      elements.docsAcross.value = '';
      elements.docsDown.value = '';
      return;
    }
  
    elements.docsAcross.value = docsAcross;
    elements.docsDown.value = docsDown;
  }
  
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

    // Visualize the imposition
    visualizeImposition(sheetWidth, sheetLength, leadTrim, sideTrim, docsDown, docsAcross, docWidth, docLength, gutterWidth, gutterLength);
    }

  function displayResults(sheetWidth, sheetLength, docWidth, docLength, topLead, sideLead, gutterWidth, gutterLength, docsAcross, docsDown) {
    const displayWithUnitConversion = (id, value) => {
      displayValue(id, value);
      displayValue(id + "_mm", value, 25.4);
    };
  
    displayWithUnitConversion("sheetWidthResult", sheetWidth);
    displayWithUnitConversion("sheetLengthResult", sheetLength);
    displayWithUnitConversion("docWidthResult", docWidth);
    displayWithUnitConversion("docLengthResult", docLength);
    displayWithUnitConversion("topLeadResult", topLead);
    displayWithUnitConversion("sideLeadResult", sideLead);
    displayWithUnitConversion("gutterWidthResult", gutterWidth);
    displayWithUnitConversion("gutterLengthResult", gutterLength);
    displayValue("docsAcrossResult", docsAcross);
    displayValue("docsDownResult", docsDown);
  }
  
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
  
  function displayCutsAndSlits(docsAcross, docsDown) {
    const sheetWidth = getInputValue(elements.sheetWidth);
    const sheetLength = getInputValue(elements.sheetLength);
    const docWidth = getInputValue(elements.docWidth);
    const docLength = getInputValue(elements.docLength);
    const gutterWidth = getInputValue(elements.gutterWidth);
    const gutterLength = getInputValue(elements.gutterLength);
  
    const cuts = calculatePositions(sheetLength, docLength, docsDown, gutterLength);
    const slits = calculatePositions(sheetWidth, docWidth, docsAcross, gutterWidth);
  
    const cutsSlitsResults = cuts.map((cut, index) => `<tr><td>Cut ${index + 1}</td><td>${cut}</td><td>${(cut * 25.4).toFixed(3)}</td></tr>`)
      .concat(slits.map((slit, index) => `<tr><td>Slit ${index + 1}</td><td>${slit}</td><td>${(slit * 25.4).toFixed(3)}</td></tr>`))
      .join('');
  
    document.getElementById("cutsSlitsResults").innerHTML = cutsSlitsResults;
  }
  
  // Event Listeners
  elements.calculateButton.addEventListener("click", calculate);
  
  ['sheetWidth', 'sheetLength', 'docWidth', 'docLength', 'gutterWidth', 'gutterLength'].forEach(id => {
    elements[id].addEventListener("change", updateDocsAcrossAndDown);
  });
  