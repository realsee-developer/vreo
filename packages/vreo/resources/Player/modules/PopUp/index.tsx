import * as React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { Controller } from '../../Controller'
import { useController } from '../../hooks'

const PopUpView = observer(({ controller }: { controller: Controller }) => {

  return (
    <div
      className={classNames('vreo-PopUp', {
        'vreo-PopUp-visible': controller.popUp,
      })}
      onClick={() => controller.openPopUp(false)}
    >
      <div className="vreo-PopUp-inner">
        {controller.popUp ||  ''}
      </div>
    </div>
  )
})

export function PopUp() {
  const controller = useController()
  return <PopUpView controller={controller} />
}