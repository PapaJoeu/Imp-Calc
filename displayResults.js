// Constants
const MM_CONVERSION_FACTOR = 25.4;
const RESULTS_TABLE_BODY_ID = "resultsTableBody";
const CUTS_TABLE_ID = "cutsTable";
const SLITS_TABLE_ID = "slitsTable";

/**
 * Display the results based on measurements provided.
 * @param {number[]} measurements - Various measurements for calculations.
 */
function displayResults(sheetWidth, sheetLength, docWidth, docLength, topLead, sideLead, gutterWidth, gutterLength, docsAcross, docsDown) {
    const resultsTableBody = document.getElementById(RESULTS_TABLE_BODY_ID);
    clearPreviousResults(resultsTableBody);

    const groupedMeasurements = getGroupedMeasurements(sheetWidth, sheetLength, docWidth, docLength, topLead, sideLead, gutterWidth, gutterLength, docsAcross, docsDown);
    populateResultsTable(groupedMeasurements, resultsTableBody);
}

function clearPreviousResults(element) {
    element.innerHTML = "";
}

function getGroupedMeasurements(sheetWidth, sheetLength, docWidth, docLength, topLead, sideLead, gutterWidth, gutterLength, docsAcross, docsDown) {
    return [
        { subheading: "Sheet", measurements: [{ label: "Width", value: sheetWidth }, { label: "Length", value: sheetLength }] },
        { subheading: "Document", measurements: [{ label: "Width", value: docWidth }, { label: "Length", value: docLength }] },
        { subheading: "Gutter", measurements: [{ label: "Width", value: gutterWidth }, { label: "Length", value: gutterLength }] },
        { subheading: "Trim/Margins", measurements: [{ label: "Lead Trim", value: topLead }, { label: "Side Trim", value: sideLead }] },
        { subheading: "N-Up Counts", measurements: [{ label: "Docs Across", value: docsAcross }, { label: "Docs Down", value: docsDown }] }
    ];
}

function populateResultsTable(groupedMeasurements, resultsTableBody) {
    groupedMeasurements.forEach(group => {
        const subheadingRow = createSubheadingRow(group.subheading);
        resultsTableBody.appendChild(subheadingRow);

        group.measurements.forEach(({ label, value }) => {
            const row = createMeasurementRow(label, value);
            resultsTableBody.appendChild(row);
        });
    });
}

function createSubheadingRow(subheading) {
    const subheadingRow = document.createElement("tr");
    const subheadingCell = document.createElement("td");
    subheadingCell.className = "subheading";
    subheadingCell.colSpan = 3;
    subheadingCell.innerText = subheading;
    subheadingRow.appendChild(subheadingCell);
    return subheadingRow;
}

function createMeasurementRow(label, value) {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.innerText = label;
    row.appendChild(nameCell);

    const inchCell = createMeasurementCell(value, 3);
    row.appendChild(inchCell);

    const mmCell = createMeasurementCell(value * MM_CONVERSION_FACTOR, getSigFigs(value));
    row.appendChild(mmCell);

    return row;
}

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

function displayCutsAndSlits(docsAcross, docsDown) {
    const sheetWidth = getInputValue(elements.sheetWidth);
    const sheetLength = getInputValue(elements.sheetLength);
    const docWidth = getInputValue(elements.docWidth);
    const docLength = getInputValue(elements.docLength);
    const gutterWidth = getInputValue(elements.gutterWidth);
    const gutterLength = getInputValue(elements.gutterLength);

    const cuts = calculatePositions(sheetLength, docLength, docsDown, gutterLength);
    const slits = calculatePositions(sheetWidth, docWidth, docsAcross, gutterWidth);

    populateTable(CUTS_TABLE_ID, cuts, "Cut");
    populateTable(SLITS_TABLE_ID, slits, "Slit");
}

function populateTable(tableId, values, label) {
    const results = values.map((value, index) => 
        `<tr><td>${label} ${index + 1}</td><td>${value}</td><td>${(value * MM_CONVERSION_FACTOR).toFixed(2)}</td></tr>`
    ).join('');
    document.getElementById(tableId).querySelector("tbody").innerHTML = results;
}
