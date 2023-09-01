// Constants
const gutterMap = {
  "1/8 inch": { width: 0.125, length: 0.125 },
  "1/4 inch": { width: 0.25, length: 0.25 },
  "1/2 inch": { width: 0.5, length: 0.5 },
  "1 inch": { width: 1, length: 1 },
  "8mm": { width: 8 / 25.4, length: 8 / 25.4 },
  };
  
  // Functions
  function populateGutterTypes() {
    const selectElement = document.getElementById("gutterType");
    selectElement.innerHTML = "";  // Use innerHTML for consistency
    for (const type in gutterMap) {
      const option = document.createElement("option");
      option.text = type;
      option.value = type;
      selectElement.add(option);
    }
  }
  
  function setGutterSize() {
    const gutterType = document.getElementById("gutterType").value;
    const { width, length } = gutterMap[gutterType];
    document.getElementById("gutterWidth").value = width;
    document.getElementById("gutterLength").value = length;
    // call updateDocsAcrossAndDown and calculate
    updateDocsAcrossAndDown();
    calculate();
  }
  
  // If you still need to initialize gutters on page load:
  window.onload = function() {
    populateGutterTypes();
    initializePaperSizes();
  };
  
  function initializeGutters() {
    calculateMaxDocSize();
  }