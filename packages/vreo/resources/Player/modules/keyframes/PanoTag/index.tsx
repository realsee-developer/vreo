import * as React from 'react'
import { useController, useFiveInstance } from '../../../hooks'
import { PanoTagData, VreoKeyframe, VreoKeyframeEnum } from '../../../../typings/VreoUnit'

import { PanoTagPlugin, Tag } from '@realsee/dnalogel/plugins/pano-tag'

export function PanoTag() {
  const controller = useController()
  const five = useFiveInstance()

  React.useEffect(() => {
    if (controller.configs?.keyframeMap.PanoTag === false) {
      return
    }

    // This private plugin belongs to this effect's controller, including replay
    // and React's effect teardown/setup cycle.
    const panoTagPlugin = PanoTagPlugin(five as any, {
      config: {
        globalConfig: {
          visibleConfig: { keep: 'visible' },
          unfoldedConfig: { autoUnfold: false, unfoldDistance: { max: 100 } }
        }
      }
    })
    type ActiveTag = { id: string; timer?: ReturnType<typeof setTimeout>; released: boolean; expired: boolean }
    let activeTag: ActiveTag | undefined
    let disposed = false
    let lastTagId = 0

    const releaseTag = (entry: ActiveTag) => {
      if (entry.released) return
      entry.released = true
      if (entry.timer !== undefined) clearTimeout(entry.timer)
      if (activeTag === entry) activeTag = undefined
      panoTagPlugin.destroyTagById(entry.id)
    }
    const clearTag = () => {
      if (activeTag) releaseTag(activeTag)
    }
    const removePlaybackCleanup = controller.playback.add(clearTag)

    const callback = (keyframe: VreoKeyframe, currentTime = keyframe.start) => {
      const run = controller.playback.capture()
      if (disposed || !run?.valid()) return

      clearTag()
      const { end, data } = keyframe
      const panoTagData = data as PanoTagData
      lastTagId = Math.max(Date.now(), lastTagId + 1)
      const id = lastTagId.toString()
      const position = [panoTagData.vertex.x, panoTagData.vertex.y, panoTagData.vertex.z]
      const tag: Tag = panoTagData.imgUrl
        ? { id, position, contentType: 'ImageText', stickType: '2DPoint', data: { title: panoTagData.text, mediaData: [{ type: 'Image', url: panoTagData.imgUrl }] } }
        : { id, position, contentType: 'Text', stickType: '2DPoint', data: { title: panoTagData.text } }
      const entry: ActiveTag = { id, released: false, expired: false }
      activeTag = entry

      // Keep the keyframe deadline independent of asynchronous model readiness.
      entry.timer = setTimeout(() => {
        if (entry.released) return
        if (disposed || !run.valid()) return releaseTag(entry)
        entry.expired = true
        panoTagPlugin.getTagById(id)?.fold()
        entry.timer = setTimeout(() => releaseTag(entry), 1500)
      }, Math.max(0, end - currentTime))

      void panoTagPlugin.load({ tagList: [tag] }).then(() => {
        if (disposed || entry.released || entry.expired || activeTag !== entry || !run.valid()) {
          releaseTag(entry)
          return
        }
        const tagInstance = panoTagPlugin.getTagById(id)
        if (!tagInstance) return releaseTag(entry)
        tagInstance.setMediaManager(run.mediaManager)
        tagInstance.unfold()
      }).catch(error => {
        releaseTag(entry)
        console.error('Vreo PanoTag failed to load', error)
      })
    }

    controller.on(VreoKeyframeEnum.PanoTag, callback)

    return () => {
      disposed = true
      controller.off(VreoKeyframeEnum.PanoTag, callback)
      removePlaybackCleanup()
      clearTag()
      panoTagPlugin.dispose()
    }
  }, [controller])

  return null
}
