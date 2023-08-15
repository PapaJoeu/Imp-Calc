// Constants
const gutterMap = {
    "8mm - 0.315 in": { width: 0.315, length: 0.315 },
    "5mm - 0.197 in": { width: 0.197, length: 0.197 },
    "10mm - 0.394 in": { width: 0.394, length: 0.394 },
    ".25in - 0.25 in": { width: 0.25, length: 0.25 },
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