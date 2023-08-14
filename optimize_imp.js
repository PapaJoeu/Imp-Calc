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
    progressBar: document.getElementById("progressBar"),
    calculateButton: document.getElementById("calculate"),
    optimizeButton: document.getElementById("optimize") 
  };
  
  // Event Listeners
  elements.calculateButton.addEventListener("click", calculate);
  elements.optimizeButton.addEventListener("click", toggleOptimizedValues);
  elements.sheetWidth.addEventListener("change", updateDocsAcrossAndDown);
  elements.sheetLength.addEventListener("change", updateDocsAcrossAndDown);
  elements.docWidth.addEventListener("change", updateDocsAcrossAndDown);
  elements.docLength.addEventListener("change", updateDocsAcrossAndDown);
  elements.gutterWidth.addEventListener("change", updateDocsAcrossAndDown);
  elements.gutterLength.addEventListener("change", updateDocsAcrossAndDown);
  
  /**
   * Updates the number of documents across and down based on the input values.
   * 
   * @function updateDocsAcrossAndDown
   * @returns {void}
   */
  function updateDocsAcrossAndDown() {
    // Retrieve input values
    const sheetWidth = parseFloat(elements.sheetWidth.value);
    const sheetLength = parseFloat(elements.sheetLength.value);
    const docWidth = parseFloat(elements.docWidth.value);
    const docLength = parseFloat(elements.docLength.value);
    const gutterWidth = parseFloat(elements.gutterWidth.value);
    const gutterLength = parseFloat(elements.gutterLength.value);
  
    // Perform error checks
    if (isNaN(sheetWidth) || isNaN(sheetLength) || isNaN(docWidth) || isNaN(docLength) ||
        isNaN(gutterWidth) || isNaN(gutterLength)) {
      // Handle invalid or missing input values
      elements.docsAcross.value = '';
      elements.docsDown.value = '';
      return;
    }
  
    // Perform calculations
    const docsAcross = Math.floor((sheetWidth - gutterWidth) / (docWidth + gutterWidth));
    const docsDown = Math.floor((sheetLength - gutterLength) / (docLength + gutterLength));
  
    // Handle potential calculation errors
    if (isNaN(docsAcross) || isNaN(docsDown) || docsAcross <= 0 || docsDown <= 0) {
      // Handle errors in calculations
      elements.docsAcross.value = '';
      elements.docsDown.value = '';
      console.error('Error calculating the number of documents across and down.');
      return;
    }
  
    // Update the number of documents across and down
    elements.docsAcross.value = docsAcross;
    elements.docsDown.value = docsDown;
  }
  
  const state = {
    originalValues: {},
    optimizedValues: {},
    isOptimizedDisplayed: false
  };
  
  function toggleOptimizedValues() {
    computeOptimizedValues(); // First, compute the optimized values.
  
    if (state.isOptimizedDisplayed) {
        // If optimized values are displayed, revert to original values
        for (let key in state.originalValues) {
            if (elements[key]) {
                elements[key].value = state.originalValues[key];
            }
        }
        console.log("Reverted to original values");
    } else {
        // If original values are displayed, update to optimized values
        for (let key in state.optimizedValues) {
            if (elements[key]) {
                elements[key].value = state.optimizedValues[key];
            }
        }
        console.log("Updated to optimized values");
    }
  
    // Toggle the flag
    state.isOptimizedDisplayed = !state.isOptimizedDisplayed;
    console.log("Optimized values toggled:", state.isOptimizedDisplayed);
  }
  
  function calculate() {
    try {
        const getInputValue = (key) => {
            return parseFloat(elements[key].value); // Use current input values.
        };
  
        // Retrieve input values
        const sheetWidth = getInputValue('sheetWidth');
        const sheetLength = getInputValue('sheetLength');
        const docWidth = getInputValue('docWidth');
        const docLength = getInputValue('docLength');
        const docsAcross = getInputValue('docsAcross');
        const docsDown = getInputValue('docsDown');
        const gutterWidth = getInputValue('gutterWidth');
        const gutterLength = getInputValue('gutterLength');
  
      // Validate input values
      if (
        [sheetWidth, sheetLength, docWidth, docLength, docsAcross, docsDown, gutterWidth, gutterLength].some(Number.isNaN)
      ) {
        throw new Error("Invalid input. Please enter valid numbers for all fields.");
      }
  
      // Calculate lead and side trim
      const leadTrim = sheetLength - (docsDown * docLength + (docsDown - 1) * gutterLength);
      const sideTrim = sheetWidth - (docsAcross * docWidth + (docsAcross - 1) * gutterWidth);
  
      // Display results
      displayResults(sheetWidth, sheetLength, docWidth, docLength, leadTrim, sideTrim);
  
      // Display cuts and slits
      displayCutsAndSlits(docsAcross, docsDown);
  
      // Visualize the imposition
      visualizeImposition(sheetWidth, sheetLength, leadTrim, sideTrim, docsDown, docsAcross, docWidth, docLength, gutterWidth, gutterLength);
    } catch (error) {
      console.error("An error occurred:", error.message);
      // Display an error message to the user or handle the error gracefully
  }
      // After doing the original calculations, compute the optimized values
  }
  
  
  function displayResults(sheetWidth, sheetLength, docWidth, docLength, topLead, sideLead) {
    const displayValue = (id, value) => {
      document.getElementById(id).innerText = value.toFixed(3);
    };
  
    const displayValueInMm = (id, value) => {
      const mmValue = (value * 25.4).toFixed(3);
      document.getElementById(id).innerText = mmValue;
    };
  
    displayValue("sheetWidthResult", sheetWidth);
    displayValueInMm("sheetWidthResult_mm", sheetWidth);
    displayValue("sheetLengthResult", sheetLength);
    displayValueInMm("sheetLengthResult_mm", sheetLength);
    displayValue("docWidthResult", docWidth);
    displayValueInMm("docWidthResult_mm", docWidth);
    displayValue("docLengthResult", docLength);
    displayValueInMm("docLengthResult_mm", docLength);
    displayValue("topLeadResult", topLead);
    displayValueInMm("topLeadResult_mm", topLead);
    displayValue("sideLeadResult", sideLead);
    displayValueInMm("sideLeadResult_mm", sideLead);
  }
  
  /**
   * Displays the cuts and slits in a table based on the given imposition parameters.
   *
   * @param {number} docsAcross - Number of documents across the sheet.
   * @param {number} docsDown - Number of documents down the sheet.
   */
  function displayCutsAndSlits(docsAcross, docsDown) {
    // Retrieve input values
    const sheetWidth = parseFloat(elements.sheetWidth.value);
    const sheetLength = parseFloat(elements.sheetLength.value);
    const docWidth = parseFloat(elements.docWidth.value);
    const docLength = parseFloat(elements.docLength.value);
    const gutterWidth = parseFloat(elements.gutterWidth.value);
    const gutterLength = parseFloat(elements.gutterLength.value);
  
    // Calculate cuts
    const cuts = calculateCuts(sheetLength, docLength, docsDown, gutterLength);
  
    // Calculate slits
    const slits = calculateSlits(sheetWidth, docWidth, docsAcross, gutterWidth);
  
  // Prepare the cuts and slits data
  const cutsSlitsResults = cuts.map((cut, index) => `<tr><td>Cut ${index + 1}</td><td>${cut}</td><td>${(cut * 25.4).toFixed(3)}</td></tr>`)
    .concat(slits.map((slit, index) => `<tr><td>Slit ${index + 1}</td><td>${slit}</td><td>${(slit * 25.4).toFixed(3)}</td></tr>`))
    .join('');
  
  // Populate the cuts and slits table
  document.getElementById("cutsSlitsResults").innerHTML = cutsSlitsResults;
  }
  
  /**
   * Calculate positions based on sheet size, document size, number of documents, and gutter size.
   * @returns {number[]} - Positions array.
   */
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
  
  /** Calculate cut positions based on sheet length, document length, docs down, and gutter length. */
  function calculateCuts(sheetLength, docLength, docsDown, gutterLength) {
    return calculatePositions(sheetLength, docLength, docsDown, gutterLength);
  }
  
  /** Calculate slit positions based on sheet width, document width, docs across, and gutter width. */
  function calculateSlits(sheetWidth, docWidth, docsAcross, gutterWidth) {
    return calculatePositions(sheetWidth, docWidth, docsAcross, gutterWidth);
  }
  
  
  function computeOptimizedValues() {
    const sheetSizes = [
        { width: 12, length: 18 },
        { width: 13, length: 19 }
    ];
  
    let bestLayout = {
        sheetSize: null,
        orientation: null,
        areaImposedPercentage: 0
    };
  
    const docWidth = parseFloat(elements.docWidth.value);
    const docLength = parseFloat(elements.docLength.value);
  
    sheetSizes.forEach(sheet => {
        ['original', 'rotated'].forEach(orientation => {
            let currentWidth = orientation === 'original' ? docWidth : docLength;
            let currentLength = orientation === 'original' ? docLength : docWidth;
  
            let result = testLayout(sheet.width, sheet.length, currentWidth, currentLength);
            console.log(`Testing sheet ${sheet.width}x${sheet.length} with doc ${currentWidth}x${currentLength}:`, result);
  
            if (result.areaImposedPercentage > bestLayout.areaImposedPercentage) {
                bestLayout = {
                    sheetSize: sheet,
                    orientation: orientation,
                    ...result
                };
            }
        });
    });
  
    console.log("Best layout found:", bestLayout);
  
    // Store the optimized values in the state
    state.optimizedValues.sheetWidth = bestLayout.sheetSize.width;
    state.optimizedValues.sheetLength = bestLayout.sheetSize.length;
    state.optimizedValues.docWidth = (bestLayout.orientation === 'original') ? docWidth : docLength;
    state.optimizedValues.docLength = (bestLayout.orientation === 'original') ? docLength : docWidth;
    state.optimizedValues.docsAcross = bestLayout.docsAcross;
    state.optimizedValues.docsDown = bestLayout.docsDown;
    console.log("Optimized values computed:", state.optimizedValues);
  }
  
  
  
  function testLayout(sheetWidth, sheetLength, docWidth, docLength) {
      const gutterWidth = parseFloat(elements.gutterWidth.value);
      const gutterLength = parseFloat(elements.gutterLength.value);
  
      const docsAcross = Math.floor(sheetWidth / (docWidth + gutterWidth));
      const docsDown = Math.floor(sheetLength / (docLength + gutterLength));    
      const nUp = docsAcross * docsDown;
  
      const imposedArea = nUp * docWidth * docLength;
      const sheetArea = sheetWidth * sheetLength;
      const areaImposedPercentage = (imposedArea / sheetArea) * 100;
  
      console.log(`Layout for sheet ${sheetWidth}x${sheetLength}, doc ${docWidth}x${docLength}:`);
      console.log(`Docs Across: ${docsAcross}`);
      console.log(`Docs Down: ${docsDown}`);
      console.log(`Area Imposed Percentage: ${areaImposedPercentage}`);
  
      return {
          docsAcross,
          docsDown,
          areaImposedPercentage
      };
  }