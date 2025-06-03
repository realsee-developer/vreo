import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import * as React from 'react';
import classNames from 'classnames';
import { useController } from "../../../hooks.js";
import { VreoKeyframeEnum } from "../../../../typings/VreoUnit.js";
export function Prompter() {
  var _React$useState = React.useState(''),
    _React$useState2 = _slicedToArray(_React$useState, 2),
    text = _React$useState2[0],
    setText = _React$useState2[1];
  var _React$useState3 = React.useState(true),
    _React$useState4 = _slicedToArray(_React$useState3, 2),
    hidden = _React$useState4[0],
    setHidden = _React$useState4[1];
  var ref = React.useRef(null);
  var controller = useController();
  React.useEffect(function () {
    var _controller$configs;
    if (((_controller$configs = controller.configs) === null || _controller$configs === void 0 ? void 0 : _controller$configs.keyframeMap.Prompter) === false) {
      return;
    }
    var callback = function callback(keyframe) {
      var start = keyframe.start,
        end = keyframe.end,
        data = keyframe.data;
      setText(data.text);
      setHidden(false);
      if (ref.current) {
        clearTimeout(ref.current);
        ref.current = null;
      }
      ref.current = setTimeout(function () {
        setHidden(true);
        setText('');
        // setTimeout(() => setText(''), 500)

        if (ref.current) clearTimeout(ref.current);
        ref.current = null;
      }, end - start);
    };
    controller.on(VreoKeyframeEnum.Prompter, callback);
    return function () {
      controller.off(VreoKeyframeEnum.Prompter, callback);
    };
  }, [controller]);
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('vreo-prompter', _defineProperty({
      'vreo-prompter--hidden': hidden
    }, "vreo-prompter-left--".concat(controller.agentType), true))
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-prompter-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-prompter-innerText"
  }, text)));
}