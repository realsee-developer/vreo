"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = setElementDataset;
function setElementDataset(element, dataset) {
  if (element) {
    Object.keys(dataset).forEach(function (key) {
      var value = dataset[key].toString();
      if (element instanceof Element) {
        element.setAttribute("data-".concat(key), value);
      } else if (element instanceof Document) {
        element.documentElement.setAttribute("data-".concat(key), value);
      } else if (element instanceof HTMLElement) {
        element.dataset[key] = value;
      } else {
        element.setAttribute("data-".concat(key), value);
      }
    });
  }
}