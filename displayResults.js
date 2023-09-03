function displayResults(sheetWidth, sheetLength, docWidth, docLength, topLead, sideLead, gutterWidth, gutterLength, docsAcross, docsDown) {
    const resultsTableBody = document.getElementById("resultsTableBody");
    resultsTableBody.innerHTML = ""; // Clear previous results
  
    const groupedMeasurements = [
      {
        subheading: "Sheet",
        measurements: [
          { label: "Width", value: sheetWidth },
          { label: "Length", value: sheetLength }
        ]
      },
      {
        subheading: "Document",
        measurements: [
          { label: "Width", value: docWidth },
          { label: "Length", value: docLength }
        ]
      },
      {
        subheading: "Gutter",
        measurements: [
          { label: "Width", value: gutterWidth },
          { label: "Length", value: gutterLength }
        ]
      },
      {
        subheading: "Trim/Margins",
        measurements: [
          { label: "Lead Trim", value: topLead },
          { label: "Side Trim", value: sideLead }
        ]
      },
      {
        subheading: "N-Up Counts",
        measurements: [
          { label: "Docs Across", value: docsAcross },
          { label: "Docs Down", value: docsDown }
        ]
      }
    ];
  
    groupedMeasurements.forEach(group => {
      const subheadingRow = document.createElement("tr");
      const subheadingCell = document.createElement("td");
      subheadingCell.className = "subheading";
      subheadingCell.colSpan = 3;
      subheadingCell.innerText = group.subheading;
      subheadingRow.appendChild(subheadingCell);
      resultsTableBody.appendChild(subheadingRow);
  
      group.measurements.forEach(({ label, value }) => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.innerText = label;
        row.appendChild(nameCell);
  
        const inchCell = createMeasurementCell(value, 3);
        row.appendChild(inchCell);
  
        const mmCell = createMeasurementCell(value * 25.4, getSigFigs(value));
        row.appendChild(mmCell);
  
        resultsTableBody.appendChild(row);
      });
    });
  
    function createMeasurementCell(value, digits) {
      const cell = document.createElement("td");
      cell.innerText = formatValue(value, digits);
      return cell;
    }
  
    function formatValue(value, digits) {
      let formattedValue = value.toFixed(digits);
      formattedValue = formattedValue.replace(/\.?0+$/, "");
      return formattedValue;
    }
  
    function getSigFigs(value) {
      const str = value.toString();
      const decimalIndex = str.indexOf(".");
      let sigFigs = str.replace(".", "").replace(/^0+/, "").length;
  
      if (decimalIndex !== -1) {
        sigFigs -= decimalIndex;
      }
      return sigFigs;
    }
  }