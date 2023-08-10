// Call the populateGutterTypes function and setPaperSize on page load to fill the dropdown
window.onload = function() {
    populateGutterTypes();
    populatePaperSizes();
    setPaperSize();
  };
  
  // Define a map of gutter types with their corresponding width and length values
  const gutterMap = {
    "8mm": { width: 0.315, length: 0.315 },
    "5mm": { width: 0.197, length: 0.197 },
    "1/16 inch": { width: 0.0625, length: 0.0625 },
    "1/4 inch": { width: 0.25, length: 0.25 },
    "1/8 inch": { width: 0.125, length: 0.125 },
    "10mm": { width: 0.394, length: 0.394 },
  };
  
  /**
   * Populate Gutter Types
   * 
   * This function populates the gutter type dropdown with options
   */
  function populateGutterTypes() {
    const selectElement = document.getElementById("gutterType");
    for (const type in gutterMap) {
      const option = document.createElement("option");
      option.text = type;
      option.value = type;
      selectElement.add(option);
    }
  }
  
  /**
   * Set Gutter Size Function
   * 
   * This function sets the gutter size based on the selected gutter type.
   * 
   * @returns {void}
   */
  function setGutterSize() {
    // Retrieve the selected gutter type from the input element
    const gutterType = document.getElementById("gutterType").value;
  
    // Get the corresponding width and length values
    const { width, length } = gutterMap[gutterType];
  
    // Set the width and length input fields
    document.getElementById("gutterWidth").value = width;
    document.getElementById("gutterLength").value = length;
  }
  
  /**
   * Set Paper Size Function
   *
   * This function sets the dimensions of the paper based on the selected paper size.
   *
   * @returns {void}
   */
  function setPaperSize() {
    // Retrieve the selected paper size from the input element
    // const paperSize = elements.paperSize.value;
    const paperSize = document.getElementById("paperSize").value;
  
    // Define a map of paper sizes with their corresponding width and length values
    const sizeMap = {
      "12x18": { width: 12, length: 18 },
      "13x19": { width: 13, length: 19 },
      "half-12x18": { width: 12, length: 9 },
      "half-13x19": { width: 13, length: 9.5 },
      "A4": { width: 8.27, length: 11.69 },
      "A3": { width: 11.69, length: 16.54 },
      "Oficio": { width: 8.5, length: 13 },
      "Letter": { width: 8.5, length: 11 },
      "Legal": { width: 8.5, length: 14 },
      "Mini": { width: 5.5, length: 8.5 },
      "Tabloid": { width: 11, length: 17 },
      "Ledger": { width: 17, length: 11 },
      "custom": { width: "", length: "" }
    };
  
    // Retrieve the dimensions of the selected paper size from the size map
    const selectedSize = sizeMap[paperSize];
    
    // Set the sheet width and length input values to the selected dimensions
    elements.sheetWidth.value = selectedSize.width;
    elements.sheetLength.value = selectedSize.length;
    
  
    // Update the number of docs across and down based on the new paper size
    updateDocsAcrossAndDown();
    populateGutterTypes();
    populatePaperSizes();
  }
  
  /**
   * Populate Paper Sizes Function
   *
   * This function populates the paper size options in a select element.
   */
  function populatePaperSizes() {
    const paperSizeSelect = elements.paperSize;
  
    // Clear existing options and set the default option
    paperSizeSelect.innerHTML = '<option value="">Select a paper size</option>';
  
    // Define an array of paper sizes with their corresponding values and labels
    const paperSizes = [
      { value: "12x18", label: "12x18" },
      { value: "13x19", label: "13x19" },
      { value: "half-12x18", label: "Half 12x18" },
      { value: "half-13x19", label: "Half 13x19" },
      { value: "A4", label: "A4" },
      { value: "A3", label: "A3" },
      { value: "Oficio", label: "Oficio" },
      { value: "Letter", label: "Letter" },
      { value: "Legal", label: "Legal" },
      { value: "Mini", label: "Mini" },
      { value: "Tabloid", label: "Tabloid" },
      { value: "Ledger", label: "Ledger" },
      { value: "custom", label: "Custom" }
    ];
  
    // Generate HTML for each paper size option and append it to the select element
    const optionsHTML = paperSizes.map(size => `<option value="${size.value}">${size.label}</option>`).join('');
    paperSizeSelect.innerHTML += optionsHTML;
  }
  