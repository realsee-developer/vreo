import { createFiveProvider } from '@realsee/five/react'
import { parseWork } from '@realsee/five'
import { ResponsiveFiveCanvas } from '../components/ResponsiveFiveCanvas'
import { work } from './work'
import { VreoPlayer } from './player'

import './index.css'
import '../../stylesheets/default.css'

const FiveProvider = createFiveProvider({
  panorama: { minFov: 20, maxFov: 120 },
  imageOptions: { size: 512 },
  textureOptions: { size: 256 },
})

export default function App() {
  return (
    <FiveProvider initialWork={parseWork(work)} ref={(ref) => Object.assign(window, { $five: ref?.five })}>
      <ResponsiveFiveCanvas />
      <VreoPlayer />
    </FiveProvider>
  )
}
