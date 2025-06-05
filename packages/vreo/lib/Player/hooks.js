import React from 'react';
import { ControllerContext } from "./Controller.js";
export function useController() {
  var controller = React.useContext(ControllerContext);
  if (!controller) {
    throw new Error('没有找到 "ControllerContext"');
  }
  return controller;
}
export function useFiveInstance() {
  var controller = useController();
  if (!controller.five) {
    throw new Error('没有找到 "five" 实例');
  }
  return controller.five;
}
export function useFiveProject2d() {
  var five = useFiveInstance();
  return function (vector) {
    return five.project2d(vector, false);
  };
}