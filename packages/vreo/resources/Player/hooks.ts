import React from 'react'
import { Vector3 } from 'three'
import { ControllerContext } from './Controller'

export function useController() {
  const controller = React.useContext(ControllerContext)
  if (!controller) {
    throw new Error('没有找到 "ControllerContext"')
  }

  return controller
}

export function useFiveInstance() {
  const controller = useController()
  if (!controller.five) {
    throw new Error('没有找到 "five" 实例')
  }

  return controller.five
}

export function useFiveProject2d() {
  const five = useFiveInstance()
  return (vector: Vector3) => five.project2d(vector, false)
}
