const _$ = JSON.stringify(true) ? window.jQuery : require("jquery"),
  _html2canvas = JSON.stringify(true)
    ? window.html2canvas
    : require("html2canvas"),
  _THREE = JSON.stringify(true) ? window.THREE : require("three"),
  _PDFJS = JSON.stringify(true) ? window.PDFJS : require("pdfjs");

export {
  _$ as $,
  _html2canvas as html2canvas,
  _THREE as THREE,
  _PDFJS as PDFJS,
};
