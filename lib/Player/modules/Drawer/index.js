import * as React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { useController } from "../../hooks.js";
var DrawerView = observer(function (_ref) {
  var _controller$drawerCon2;
  var controller = _ref.controller;
  var maxHeight = '400px';
  var height = function (_controller$drawerCon) {
    var height = (_controller$drawerCon = controller.drawerConfig) === null || _controller$drawerCon === void 0 ? void 0 : _controller$drawerCon.height;
    if (!height) {
      return 'max-content';
    }
    if (typeof height === 'number') {
      return height + 'px';
    }
    return height;
  }();
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('vreo-drawer', {
      'vreo-drawer-visible': controller.drawerConfig && controller.drawerConfig.content
    }),
    onClick: function onClick() {
      return controller.openDrawer(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "vreo-drawer-inner",
    style: {
      height: height,
      maxHeight: maxHeight
    }
  }, ((_controller$drawerCon2 = controller.drawerConfig) === null || _controller$drawerCon2 === void 0 ? void 0 : _controller$drawerCon2.content) || ''));
});
export function Drawer() {
  var controller = useController();
  return /*#__PURE__*/React.createElement(DrawerView, {
    controller: controller
  });
}