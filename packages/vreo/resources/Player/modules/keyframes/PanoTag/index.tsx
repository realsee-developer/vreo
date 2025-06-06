import * as React from 'react'
import { useController, useFiveInstance } from '../../../hooks'
import { PanoTagData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'

import { PanoTagPlugin, Tag } from '@realsee/dnalogel'

export function PanoTag() {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>()
  const controller = useController()
  const five = useFiveInstance()
  const panoTagPlugin = React.useRef(PanoTagPlugin(five as any, {
    config: {
      globalConfig: {
        visibleConfig: {
          keep: 'visible'
        },
        unfoldedConfig: {
          autoUnfold: false,
          unfoldDistance: { max: 100 }
        }
      }
    }
  }))

  React.useEffect(() => {
    if (controller.configs?.keyframeMap.PanoTag === false) {
      return
    }
    const callback = (keyframe: VreoKeyframe) => {
      if (!panoTagPlugin.current) return

      const { start, end, data } = keyframe

      const panoTagData = data as PanoTagData

      const id = Date.now().toString()
      const pointType = 'PointTag'
      const dimensionType = '2D'
      const position = [panoTagData.vertex.x, panoTagData.vertex.y, panoTagData.vertex.z]
      const tag: Tag = (() => {
        if (panoTagData.imgUrl) {
          return { id, pointType, position, dimensionType, contentType: 'ImageText', stickType: '2DPoint', data: { text: panoTagData.text, mediaData: [{ type: 'Image',  url: panoTagData.imgUrl }] }}
        } else {
          return { id, pointType, position, dimensionType, contentType: 'Text', stickType: '2DPoint', data: { text: panoTagData.text }}
        }
      })()

      // show
      panoTagPlugin.current.load({ tagList: [tag] })

      const tagInstance = panoTagPlugin.current.getTagById(id)
      if (tagInstance) {
        tagInstance.state.unfolded = true
        ;(panoTagPlugin.current as any).updateRenderAllTags()
      }

      timeoutRef.current = setTimeout(() => {
        // clear
        const tag = panoTagPlugin.current.getTagById(id)
        if (!tag) return
        if (tag.state) {
          tag.state.unfolded = false
          ;(panoTagPlugin.current as any).updateRenderAllTags()
        }
        tag.hooks?.on('folded', () => {
          setTimeout(() => {
            if (tag.state) {
              tag.state.visible = false
              panoTagPlugin.current.destroyTagById(id)
            }
          }, 1500)
        })
      }, end - start)
    }

    controller.on(VreoKeyframeEnum.PanoTag, callback)

    return () => {
      controller.off(VreoKeyframeEnum.PanoTag, callback)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [controller])

  return null
}
