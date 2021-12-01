import * as React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { Controller } from '../../Controller'
import { useController } from '../../hooks'

const DrawerView = observer(({ controller }: { controller: Controller }) => {
  const maxHeight = '540px'
  const height = (() => {
    const height = controller.drawerConfig?.height
    if (!height) {
      return 'max-content'
    }

    if (typeof height === 'number') {
      return height + 'px'
    }

    return height
  })()

  return (
    <div
      className={classNames('vreo-drawer', {
        'vreo-drawer-visible': controller.drawerConfig && controller.drawerConfig.content,
      })}
      onClick={() => controller.openDrawer(false)}
    >
      <div className="vreo-drawer-inner" style={{ height, maxHeight }}>
        {controller.drawerConfig?.content || ''}
      </div>
    </div>
  )
})

export function Drawer() {
  const controller = useController()

  return <DrawerView controller={controller} />
}
