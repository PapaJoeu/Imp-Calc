// Call the populateGutterTypes function and setPaperSize on page load to fill the dropdown
window.onload = function() {
  populateGutterTypes();
  populatePaperSizes();
  setPaperSize();
};

// Define a map of gutter types with their corresponding width and length values
const gutterMap = {
  "8mm - 0.315 in": { width: 0.315, length: 0.315 },
  "5mm - 0.197 in": { width: 0.197, length: 0.197 },
  "10mm - 0.394 in": { width: 0.394, length: 0.394 },
  ".25in - 0.25 in": { width: 0.25, length: 0.25 },
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
  const paperSize = document.getElementById("paperSize").value;

  // Define a map of paper sizes with their corresponding width and length values
  const sizeMap = {
    "12x18": { width: 12, length: 18 },
    "13x19": { width: 13, length: 19 },
  };

  // Retrieve the dimensions of the selected paper size from the size map
  const selectedSize = sizeMap[paperSize];

  // Set the sheet width and length input values to the selected dimensions
  document.getElementById("sheetWidth").value = selectedSize.width;
  document.getElementById("sheetLength").value = selectedSize.length;

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
  const paperSizeSelect = document.getElementById("paperSize"); // Get the select element

  // Clear existing options and set the default option
  paperSizeSelect.innerHTML = '<option value="">Select a paper size</option>';

  // Define an array of paper sizes with their corresponding values and labels
  const paperSizes = [
    { value: "12x18", label: "12x18" },
    { value: "13x19", label: "13x19" },
  ];

  // Generate HTML for each paper size option and append it to the select element
  const optionsHTML = paperSizes.map(size => `<option value="${size.value}">${size.label}</option>`).join('');
  paperSizeSelect.innerHTML += optionsHTML;
}