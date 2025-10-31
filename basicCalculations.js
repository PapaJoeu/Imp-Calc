"use strict";

/**
 * ============================================================================
 *  Imposition Calculator – Core Calculation Module
 * ============================================================================
 *  This module centralises the numerical routines needed to rebuild the
 *  imposition calculator with support for asymmetric margins, non-printable
 *  boundaries, and production paths such as cuts, slits, and scores.
 *
 *  Every function is pure and independent of the DOM so it can be reused in
 *  alternative UIs (web, CLI, unit tests). Measurements are assumed to be in
 *  inches unless otherwise noted; helper utilities expose millimetre output for
 *  reporting purposes.
 * ---------------------------------------------------------------------------
 */

// =============================================================================
//  Section 1 – Constants & Enumerations
// =============================================================================
const INCHES_TO_MM = 25.4;

const AXIS = Object.freeze({
  HORIZONTAL: "horizontal", // left ↔ right (sheet width)
  VERTICAL: "vertical",     // top ↔ bottom (sheet length)
});

// =============================================================================
//  Section 2 – Input Normalisation Helpers
// =============================================================================
/**
 * Safely coerces any numeric input into a finite floating-point value.
 * @param {number|string} value - Arbitrary numeric input.
 * @returns {number} - Finite number (NaN becomes 0).
 */
function toNumber(value) {
  const coerced = Number(value);
  return Number.isFinite(coerced) ? coerced : 0;
}

/**
 * Normalises the raw calculator inputs into a consistent structure. This keeps
 * consuming logic agnostic to the original UI representation.
 *
 * @param {Object} params
 * @param {Object} params.sheet - Overall sheet measurements.
 * @param {number} params.sheet.width - Sheet width (in).
 * @param {number} params.sheet.length - Sheet length (in).
 * @param {Object} params.document - Single document measurements.
 * @param {number} params.document.width - Document width (in).
 * @param {number} params.document.length - Document length (in).
 * @param {Object} params.gutter - Gutter spacing between documents.
 * @param {number} params.gutter.horizontal - Horizontal gutter (in).
 * @param {number} params.gutter.vertical - Vertical gutter (in).
 * @param {Object} params.margins - User-defined printable margins.
 * @param {number} params.margins.left
 * @param {number} params.margins.right
 * @param {number} params.margins.top
 * @param {number} params.margins.bottom
 * @param {Object} params.nonPrintable - Hardware non-printable bands.
 * @param {number} params.nonPrintable.left
 * @param {number} params.nonPrintable.right
 * @param {number} params.nonPrintable.top
 * @param {number} params.nonPrintable.bottom
 * @returns {Object} Fully normalised input bundle.
 */
function normaliseInputs(params) {
  return {
    sheet: {
      width: toNumber(params?.sheet?.width),
      length: toNumber(params?.sheet?.length),
    },
    document: {
      width: toNumber(params?.document?.width),
      length: toNumber(params?.document?.length),
    },
    gutter: {
      horizontal: Math.max(0, toNumber(params?.gutter?.horizontal)),
      vertical: Math.max(0, toNumber(params?.gutter?.vertical)),
    },
    margins: {
      left: Math.max(0, toNumber(params?.margins?.left)),
      right: Math.max(0, toNumber(params?.margins?.right)),
      top: Math.max(0, toNumber(params?.margins?.top)),
      bottom: Math.max(0, toNumber(params?.margins?.bottom)),
    },
    nonPrintable: {
      left: Math.max(0, toNumber(params?.nonPrintable?.left)),
      right: Math.max(0, toNumber(params?.nonPrintable?.right)),
      top: Math.max(0, toNumber(params?.nonPrintable?.top)),
      bottom: Math.max(0, toNumber(params?.nonPrintable?.bottom)),
    },
  };
}

// =============================================================================
//  Section 3 – Effective Sheet & Document Grid Geometry
// =============================================================================
/**
 * Computes the usable span after subtracting asymmetric margins and
 * non-printable areas.
 *
 * @param {number} sheetSize - Raw sheet dimension (width or length).
 * @param {number} leadingMargin - Margin on the leading edge.
 * @param {number} trailingMargin - Margin on the trailing edge.
 * @param {number} leadingNonPrint - Non-printable band on the leading edge.
 * @param {number} trailingNonPrint - Non-printable band on the trailing edge.
 * @returns {number} - Effective printable span.
 */
function computeEffectiveSpan(sheetSize, leadingMargin, trailingMargin, leadingNonPrint, trailingNonPrint) {
  return Math.max(
    0,
    sheetSize - leadingMargin - trailingMargin - leadingNonPrint - trailingNonPrint,
  );
}

/**
 * Calculates the maximum number of documents that can fit along an axis.
 *
 * @param {number} effectiveSpan - Printable span after restrictions.
 * @param {number} docSize - Document size along the axis.
 * @param {number} gutterSize - Gutter spacing along the axis.
 * @returns {number} - Integer document count.
 */
function computeDocCount(effectiveSpan, docSize, gutterSize) {
  if (docSize <= 0) return 0;
  const stride = docSize + Math.max(0, gutterSize);
  if (stride <= 0) return 0;
  return Math.max(0, Math.floor((effectiveSpan + gutterSize) / stride));
}

/**
 * Determines how much space the placed documents plus gutters consume.
 *
 * @param {number} docSize - Document size on the axis.
 * @param {number} docCount - Number of documents along the axis.
 * @param {number} gutterSize - Gutter spacing along the axis.
 * @returns {number} - Total occupied span.
 */
function computeOccupiedSpan(docSize, docCount, gutterSize) {
  if (docCount <= 0) return 0;
  return docCount * docSize + (docCount - 1) * gutterSize;
}

/**
 * Builds the margin distribution after documents are placed. Any additional
 * residual is split evenly unless a later alignment routine reassigns it.
 *
 * @param {Object} config
 * @param {number} config.sheetSize - Full sheet dimension.
 * @param {number} config.leadingMargin - User margin on the leading edge.
 * @param {number} config.trailingMargin - User margin on the trailing edge.
 * @param {number} config.leadingNonPrint - Non-printable band (leading).
 * @param {number} config.trailingNonPrint - Non-printable band (trailing).
 * @param {number} config.occupiedSpan - Space taken by docs and gutters.
 * @returns {Object} - Detailed margin breakdown.
 */
function distributeMargins({
  sheetSize,
  leadingMargin,
  trailingMargin,
  leadingNonPrint,
  trailingNonPrint,
  occupiedSpan,
}) {
  const minimumReserved = leadingMargin + trailingMargin + leadingNonPrint + trailingNonPrint;
  const totalResidual = Math.max(0, sheetSize - minimumReserved - occupiedSpan);

  const additionalLeading = totalResidual / 2;
  const additionalTrailing = totalResidual - additionalLeading;

  return {
    leading: {
      margin: leadingMargin,
      nonPrintable: leadingNonPrint,
      additional: additionalLeading,
      total: leadingMargin + leadingNonPrint + additionalLeading,
    },
    trailing: {
      margin: trailingMargin,
      nonPrintable: trailingNonPrint,
      additional: additionalTrailing,
      total: trailingMargin + trailingNonPrint + additionalTrailing,
    },
    totalResidual,
  };
}

/**
 * Consolidates all axis-specific metrics for both width and length.
 *
 * @param {Object} inputs - Normalised inputs from {@link normaliseInputs}.
 * @returns {Object} - Comprehensive layout metrics.
 */
function computeLayout(inputs) {
  const { sheet, document, gutter, margins, nonPrintable } = inputs;

  const horizontalEffective = computeEffectiveSpan(
    sheet.width,
    margins.left,
    margins.right,
    nonPrintable.left,
    nonPrintable.right,
  );
  const verticalEffective = computeEffectiveSpan(
    sheet.length,
    margins.top,
    margins.bottom,
    nonPrintable.top,
    nonPrintable.bottom,
  );

  const docsAcross = computeDocCount(horizontalEffective, document.width, gutter.horizontal);
  const docsDown = computeDocCount(verticalEffective, document.length, gutter.vertical);

  const occupiedHorizontal = computeOccupiedSpan(document.width, docsAcross, gutter.horizontal);
  const occupiedVertical = computeOccupiedSpan(document.length, docsDown, gutter.vertical);

  return {
    inputs,
    effectiveSpan: {
      horizontal: horizontalEffective,
      vertical: verticalEffective,
    },
    docCount: {
      across: docsAcross,
      down: docsDown,
    },
    occupiedSpan: {
      horizontal: occupiedHorizontal,
      vertical: occupiedVertical,
    },
    marginDistribution: {
      horizontal: distributeMargins({
        sheetSize: sheet.width,
        leadingMargin: margins.left,
        trailingMargin: margins.right,
        leadingNonPrint: nonPrintable.left,
        trailingNonPrint: nonPrintable.right,
        occupiedSpan: occupiedHorizontal,
      }),
      vertical: distributeMargins({
        sheetSize: sheet.length,
        leadingMargin: margins.top,
        trailingMargin: margins.bottom,
        leadingNonPrint: nonPrintable.top,
        trailingNonPrint: nonPrintable.bottom,
        occupiedSpan: occupiedVertical,
      }),
    },
  };
}

// =============================================================================
//  Section 4 – Positional Generators (Cuts, Slits, Scores)
// =============================================================================
/**
 * Enumerates absolute positions for repeated production actions along an axis.
 *
 * @param {Object} config
 * @param {"horizontal"|"vertical"} config.axis - Axis orientation.
 * @param {number} config.docSize - Document size along the axis.
 * @param {number} config.docCount - Number of documents on the axis.
 * @param {number} config.gutter - Gutter size along the axis.
 * @param {Object} config.marginState - Output from {@link distributeMargins}.
 * @param {number} config.sheetSpan - Overall sheet size along the axis.
 * @returns {Object} Structured coordinates for starts, ends, and gutters.
 */
function generateAxisPositions({ axis, docSize, docCount, gutter, marginState, sheetSpan }) {
  const positions = [];
  const gutterCentres = [];
  const docCentres = [];

  let cursor = marginState.leading.total;

  for (let index = 0; index < docCount; index += 1) {
    const start = cursor;
    const end = cursor + docSize;
    const centre = start + docSize / 2;

    positions.push({ axis, type: "start", docIndex: index, position: start });
    positions.push({ axis, type: "end", docIndex: index, position: end });
    docCentres.push({ axis, docIndex: index, position: centre });

    cursor = end + gutter;

    if (index < docCount - 1) {
      const gutterCentre = end + gutter / 2;
      gutterCentres.push({ axis, position: gutterCentre, docBoundary: index });
    }
  }

  return {
    axis,
    sheetSpan,
    marginState,
    positions,
    docCentres,
    gutterCentres,
  };
}

/**
 * Generates the full cut/slit plan for the sheet.
 *
 * Cuts typically correspond to the document boundaries along the vertical axis
 * (top/bottom), while slits represent the boundaries along the horizontal axis
 * (left/right).
 *
 * @param {Object} layout - Output from {@link computeLayout}.
 * @returns {Object} Cut and slit data grouped by axis.
 */
function generateCutAndSlitPlan(layout) {
  const {
    inputs,
    docCount,
    marginDistribution,
  } = layout;

  const horizontalAxis = generateAxisPositions({
    axis: AXIS.HORIZONTAL,
    docSize: inputs.document.width,
    docCount: docCount.across,
    gutter: inputs.gutter.horizontal,
    marginState: marginDistribution.horizontal,
    sheetSpan: inputs.sheet.width,
  });

  const verticalAxis = generateAxisPositions({
    axis: AXIS.VERTICAL,
    docSize: inputs.document.length,
    docCount: docCount.down,
    gutter: inputs.gutter.vertical,
    marginState: marginDistribution.vertical,
    sheetSpan: inputs.sheet.length,
  });

  return {
    cuts: verticalAxis,
    slits: horizontalAxis,
  };
}

/**
 * Produces recommended score lines. By default we offer two sets:
 *  - Document-centred scores (useful for folding individual pieces).
 *  - Gutter-centred scores (useful for scoring fold lines between pieces).
 *
 * @param {Object} axisState - Axis structure from {@link generateAxisPositions}.
 * @returns {Object} - Score line coordinates for the axis.
 */
function generateScorePlan(axisState) {
  return {
    axis: axisState.axis,
    sheetSpan: axisState.sheetSpan,
    marginState: axisState.marginState,
    docCentred: axisState.docCentres,
    gutterCentred: axisState.gutterCentres,
  };
}

// =============================================================================
//  Section 5 – Public API
// =============================================================================
const BasicCalculations = {
  AXIS,
  normaliseInputs,
  computeLayout,
  generateCutAndSlitPlan,
  generateScorePlan,
  toMillimetres(value) {
    return value * INCHES_TO_MM;
  },
};

if (typeof module !== "undefined") {
  module.exports = BasicCalculations;
} else {
  window.BasicCalculations = BasicCalculations;
}

