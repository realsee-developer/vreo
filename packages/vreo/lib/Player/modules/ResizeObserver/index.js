import React from 'react';
import { addResizeListener, hasResizeListener } from "../../../shared-utils/addResizeListener.js";
import { useController } from "../../hooks.js";
export function ResizeObserver() {
  var ref = React.useRef(null);
  var controller = useController();
  React.useEffect(function () {
    if (!ref.current) return;
    var resizeElement = controller.container.parentElement;
    if (hasResizeListener(resizeElement)) return;
    var dispose = addResizeListener(resizeElement, function (width, height) {
      controller.setContainerSize(width, height);
    });
    return function () {
      dispose();
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "resizeObserver-element",
    ref: ref
  });
}