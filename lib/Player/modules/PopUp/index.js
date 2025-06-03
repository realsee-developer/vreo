import * as React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { useController } from "../../hooks.js";
var PopUpView = observer(function (_ref) {
  var controller = _ref.controller;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('vreo-PopUp', {
      'vreo-PopUp-visible': controller.popUp
    }),
    onClick: function onClick() {
      return controller.openPopUp(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-PopUp-inner"
  }, controller.popUp || ''));
});
export function PopUp() {
  var controller = useController();
  return /*#__PURE__*/React.createElement(PopUpView, {
    controller: controller
  });
}