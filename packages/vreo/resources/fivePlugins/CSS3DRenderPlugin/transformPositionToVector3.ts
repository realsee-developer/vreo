import { Vector3 } from 'three'

const transformPositionToVector3 = ({ x, y, z }: { x: number; y: number; z: number }) => new Vector3(x, y, z)

export default transformPositionToVector3
