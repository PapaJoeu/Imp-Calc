/**
 * Basic calculation utilities for an imposition calculator that supports
 * asymmetric margins, non-printable areas, and detailed cut/score plans.
 *
 * The module is organized into the following sections:
 *  1. Constants and helpers
 *  2. Input normalization and context construction
 *  3. Core layout calculations
 *  4. Cut, slit, and score position generators
 *  5. Public API
 */

// -----------------------------------------------------------------------------
// 1. Constants and helpers
// -----------------------------------------------------------------------------

/** Inches to millimeters conversion factor. */
const MM_PER_INCH = 25.4;

/**
 * Clamps a numeric value at zero to avoid negative distances.
 * @param {number} value - The value that may be negative due to over-constrained input.
 * @returns {number} - A non-negative number.
 */
function clampToZero(value) {
    return Math.max(0, value);
}

/**
 * Ensures a value is a finite number; otherwise falls back to zero.
 * @param {number} value - Raw input value.
 * @returns {number}
 */
function toNumber(value) {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
}

/**
 * Converts inches to millimeters with fixed precision suitable for readouts.
 * @param {number} inches - Value in inches.
 * @param {number} [precision=3] - Number of decimal places.
 * @returns {number}
 */
function inchesToMillimeters(inches, precision = 3) {
    return Number((inches * MM_PER_INCH).toFixed(precision));
}

// -----------------------------------------------------------------------------
// 2. Input normalization and context construction
// -----------------------------------------------------------------------------

/**
 * Normalizes per-side measurements, supplying zeros for undefined sides.
 * @param {object} source
 * @param {number} [source.top]
 * @param {number} [source.right]
 * @param {number} [source.bottom]
 * @param {number} [source.left]
 * @returns {{top: number, right: number, bottom: number, left: number}}
 */
function normalizePerSide(source = {}) {
    return {
        top: toNumber(source.top),
        right: toNumber(source.right),
        bottom: toNumber(source.bottom),
        left: toNumber(source.left)
    };
}

/**
 * Creates a normalized layout context containing all derived sheet/document metrics.
 * @param {object} params
 * @param {{width: number, height: number}} params.sheet - Raw sheet size.
 * @param {{width: number, height: number}} params.document - Document size.
 * @param {{horizontal: number, vertical: number}} params.gutter - Gutter spacing.
 * @param {object} [params.margins] - Layout margins inside the printable area.
 * @param {object} [params.nonPrintable] - Non-printable area reserved on each edge.
 * @returns {object}
 */
function createCalculationContext({
    sheet,
    document,
    gutter,
    margins = {},
    nonPrintable = {}
}) {
    const normalizedMargins = normalizePerSide(margins);
    const normalizedNonPrint = normalizePerSide(nonPrintable);

    const sheetWidth = toNumber(sheet?.width);
    const sheetHeight = toNumber(sheet?.height);
    const docWidth = toNumber(document?.width);
    const docHeight = toNumber(document?.height);
    const gutterHorizontal = toNumber(gutter?.horizontal);
    const gutterVertical = toNumber(gutter?.vertical);

    const effectiveWidth = clampToZero(
        sheetWidth - normalizedNonPrint.left - normalizedNonPrint.right
    );
    const effectiveHeight = clampToZero(
        sheetHeight - normalizedNonPrint.top - normalizedNonPrint.bottom
    );

    const layoutWidth = clampToZero(
        effectiveWidth - normalizedMargins.left - normalizedMargins.right
    );
    const layoutHeight = clampToZero(
        effectiveHeight - normalizedMargins.top - normalizedMargins.bottom
    );

    return {
        sheet: {
            rawWidth: sheetWidth,
            rawHeight: sheetHeight,
            nonPrintable: normalizedNonPrint,
            effectiveWidth,
            effectiveHeight
        },
        document: {
            width: docWidth,
            height: docHeight
        },
        gutter: {
            horizontal: gutterHorizontal,
            vertical: gutterVertical
        },
        margins: normalizedMargins,
        layoutArea: {
            width: layoutWidth,
            height: layoutHeight,
            originX: normalizedNonPrint.left + normalizedMargins.left,
            originY: normalizedNonPrint.top + normalizedMargins.top
        }
    };
}

// -----------------------------------------------------------------------------
// 3. Core layout calculations
// -----------------------------------------------------------------------------

/**
 * Determines the maximum number of documents that can fit along an axis.
 * @param {number} availableSpan - Width or height inside the layout area.
 * @param {number} docSpan - Document width or height.
 * @param {number} gutterSpan - Gutter width or height.
 * @returns {number}
 */
function calculateDocumentCount(availableSpan, docSpan, gutterSpan) {
    if (availableSpan <= 0 || docSpan <= 0) {
        return 0;
    }

    const normalizedGutter = clampToZero(gutterSpan);
    const docs = Math.floor((availableSpan + normalizedGutter) / (docSpan + normalizedGutter));
    return clampToZero(docs);
}

/**
 * Computes utilized space and trailing margin for an axis.
 * @param {number} availableSpan
 * @param {number} docSpan
 * @param {number} gutterSpan
 * @param {number} docCount
 * @returns {{usedSpan: number, trailingMargin: number}}
 */
function calculateAxisUsage(availableSpan, docSpan, gutterSpan, docCount) {
    if (docCount <= 0) {
        return { usedSpan: 0, trailingMargin: availableSpan };
    }

    const normalizedGutter = clampToZero(gutterSpan);
    const usedSpan = docCount * docSpan + Math.max(0, docCount - 1) * normalizedGutter;
    const trailingMargin = clampToZero(availableSpan - usedSpan);

    return { usedSpan, trailingMargin };
}

/**
 * Aggregates layout metrics for both axes in preparation for downstream outputs.
 * @param {object} context - Result of createCalculationContext.
 * @returns {object}
 */
function calculateLayout(context) {
    const { layoutArea, document, gutter, margins, sheet } = context;

    const docsAcross = calculateDocumentCount(
        layoutArea.width,
        document.width,
        gutter.horizontal
    );
    const docsDown = calculateDocumentCount(
        layoutArea.height,
        document.height,
        gutter.vertical
    );

    const horizontalUsage = calculateAxisUsage(
        layoutArea.width,
        document.width,
        gutter.horizontal,
        docsAcross
    );
    const verticalUsage = calculateAxisUsage(
        layoutArea.height,
        document.height,
        gutter.vertical,
        docsDown
    );

    return {
        sheet,
        margins,
        document,
        gutter,
        layoutArea,
        counts: {
            across: docsAcross,
            down: docsDown
        },
        usage: {
            horizontal: horizontalUsage,
            vertical: verticalUsage
        },
        realizedMargins: {
            left: margins.left,
            top: margins.top,
            right: margins.right + horizontalUsage.trailingMargin,
            bottom: margins.bottom + verticalUsage.trailingMargin
        }
    };
}

// -----------------------------------------------------------------------------
// 4. Cut, slit, and score position generators
// -----------------------------------------------------------------------------

/**
 * Builds a sequence of edge positions (leading and trailing edges of each document).
 * @param {number} startOffset - Distance from the sheet origin to the first edge.
 * @param {number} docSpan - Document width or height.
 * @param {number} gutterSpan - Gutter width or height.
 * @param {number} docCount - Number of documents along the axis.
 * @returns {number[]}
 */
function generateEdgePositions(startOffset, docSpan, gutterSpan, docCount) {
    const positions = [];
    const normalizedGutter = clampToZero(gutterSpan);

    for (let index = 0; index < docCount; index += 1) {
        const leading = startOffset + index * (docSpan + normalizedGutter);
        const trailing = leading + docSpan;
        positions.push(leading, trailing);
    }

    return positions;
}

/**
 * Calculates score positions by inserting offsets between edge pairs.
 * Examples include center scores or additional custom offsets.
 * @param {number} startOffset
 * @param {number} docSpan
 * @param {number} gutterSpan
 * @param {number} docCount
 * @param {number[]} offsets - Relative offsets within each document span (0-1 range for proportional spacing).
 * @returns {number[]}
 */
function generateScorePositions(startOffset, docSpan, gutterSpan, docCount, offsets) {
    const normalizedOffsets = Array.isArray(offsets) && offsets.length
        ? offsets
        : [0.5];

    const normalizedGutter = clampToZero(gutterSpan);
    const positions = [];

    for (let index = 0; index < docCount; index += 1) {
        const docStart = startOffset + index * (docSpan + normalizedGutter);

        normalizedOffsets.forEach((offset) => {
            const clampedOffset = Math.min(Math.max(offset, 0), 1);
            positions.push(docStart + docSpan * clampedOffset);
        });
    }

    return positions;
}

/**
 * Wraps generated positions with metadata useful for tabular output.
 * @param {string} label
 * @param {number[]} positions
 * @returns {Array<{label: string, inches: number, millimeters: number}>>}
 */
function mapPositionsToReadout(label, positions) {
    return positions.map((position, index) => ({
        label: `${label} ${index + 1}`,
        inches: Number(position.toFixed(3)),
        millimeters: inchesToMillimeters(position)
    }));
}

/**
 * Computes the cut, slit, and score systems for both axes of the sheet.
 * @param {object} layout - Result from calculateLayout.
 * @param {object} [scoreOptions]
 * @param {number[]} [scoreOptions.horizontalOffsets] - Relative offsets within each document (0-1) for horizontal scores.
 * @param {number[]} [scoreOptions.verticalOffsets] - Relative offsets within each document (0-1) for vertical scores.
 * @returns {object}
 */
function calculateFinishing(layout, scoreOptions = {}) {
    const { layoutArea, counts, document, gutter } = layout;

    const horizontalEdges = generateEdgePositions(
        layoutArea.originY,
        document.height,
        gutter.vertical,
        counts.down
    );
    const verticalEdges = generateEdgePositions(
        layoutArea.originX,
        document.width,
        gutter.horizontal,
        counts.across
    );

    const horizontalScores = generateScorePositions(
        layoutArea.originY,
        document.height,
        gutter.vertical,
        counts.down,
        scoreOptions.horizontalOffsets
    );
    const verticalScores = generateScorePositions(
        layoutArea.originX,
        document.width,
        gutter.horizontal,
        counts.across,
        scoreOptions.verticalOffsets
    );

    return {
        cuts: mapPositionsToReadout("Cut", horizontalEdges),
        slits: mapPositionsToReadout("Slit", verticalEdges),
        scores: {
            horizontal: mapPositionsToReadout("Score", horizontalScores),
            vertical: mapPositionsToReadout("Score", verticalScores)
        }
    };
}

// -----------------------------------------------------------------------------
// 5. Public API
// -----------------------------------------------------------------------------

export {
    MM_PER_INCH,
    clampToZero,
    inchesToMillimeters,
    createCalculationContext,
    calculateLayout,
    calculateFinishing
};

export default {
    MM_PER_INCH,
    clampToZero,
    inchesToMillimeters,
    createCalculationContext,
    calculateLayout,
    calculateFinishing
};
