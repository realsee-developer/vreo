import THREE from 'three'

/*
   |--length--|  ____
        *         |
      *     *     |
    * *     * *  width
      *     *     |
      *     *     |
      *  *  *    ____
 */
function arrowShape ( ) {
    const shape = new THREE.Shape()
    const length = 20 / 375, width = 27 / 375
    shape.moveTo( 0, width / 2 )
    shape.lineTo( -length / 2, 0 )
    shape.lineTo( -length / 4, 0 )
    shape.lineTo( -length / 4, -width / 2 )
    shape.lineTo( length / 4, -width / 2 )
    shape.lineTo(length / 4, 0)
    shape.lineTo( length / 2, 0 )
    shape.lineTo( 0, width / 2 )
    return shape
}

const arrowMaterialOptions = {
    depthTest: false, // 不遮挡后面的模型
    transparent: true,
    opacity: .8,
    side: THREE.DoubleSide,
}

const lineMaterialOptions = {
    linewidth: 1,
    depthTest: false,
}

// 绘制坐标系
function drawCoordinateSystem () {
    const group = new THREE.Group()
    const size = 1
    const lineLength = 44 / 375
    const arrowPos = 50 / 375
    const xArrow = new THREE.Mesh(
        new THREE.ShapeGeometry(arrowShape()),
        new THREE.MeshBasicMaterial((Object.assign({ color: 0xEE5252 }, arrowMaterialOptions)))
    )
    xArrow.rotateZ(Math.PI / 2)
    xArrow.rotateX(Math.PI / 2)
    xArrow.translateX(arrowPos)
    const yArrow = new THREE.Mesh(
        new THREE.ShapeGeometry(arrowShape()),
        new THREE.MeshBasicMaterial((Object.assign({ color: 0x4082FF }, arrowMaterialOptions)))
    )
    yArrow.translateY(arrowPos)
    const zArrow = new THREE.Mesh(
        new THREE.ShapeGeometry(arrowShape()),
        new THREE.MeshBasicMaterial((Object.assign({ color: 0x48B74F }, arrowMaterialOptions)))
    )
    zArrow.rotateY(Math.PI / 2)
    zArrow.rotateX(Math.PI / 2)
    zArrow.translateZ(arrowPos)

    const xMaterial = new THREE.LineBasicMaterial(Object.assign({ color: 0xEE5252 }, lineMaterialOptions))
    const xGeometry = new THREE.Geometry()
    xGeometry.vertices.push(new THREE.Vector3(0,0,0), new THREE.Vector3(lineLength,0,0))
    const xLine = new THREE.Line(xGeometry, xMaterial)

    const yMaterial = new THREE.LineBasicMaterial(Object.assign({ color: 0x4082FF }, lineMaterialOptions))
    const yGeometry = new THREE.Geometry()
    yGeometry.vertices.push(new THREE.Vector3(0,0,0), new THREE.Vector3(0,lineLength,0))
    const yLine = new THREE.Line(yGeometry, yMaterial)

    const zMaterial = new THREE.LineBasicMaterial(Object.assign({ color: 0x48B74F }, lineMaterialOptions))
    const zGeometry = new THREE.Geometry()
    zGeometry.vertices.push(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,lineLength))
    const zLine = new THREE.Line(zGeometry, zMaterial)

    group.add(...[xArrow, xLine, yArrow, yLine, zArrow, zLine])
    return group
}

// function rotateHelper (position: { x:number, y:number, z:number }) {
//     const coordinateSystem = drawCoordinateSystem()
//     coordinateSystem.position.set(position.x, position.y, position.z)
//
// }

const ringMaterialOptions = {
    depthTest: false,
    transparent: true,
    side: THREE.DoubleSide,
}

function drawSteeringWheel () {
    const group = new THREE.Group()
    const innerR = 32.12 / 375
    const outerR = 33.12 / 375

    // 随坐标系一起显示的点击圆环
    const xyCircle = new THREE.Mesh(
        new THREE.RingGeometry(innerR, outerR, 20, 8, 0.05, Math.PI / 2 - 0.1),
        new THREE.MeshBasicMaterial(Object.assign({
            opacity: .6,
            color: 0x4082FF,
        }, ringMaterialOptions))
    )
    const xzCircle = xyCircle.clone()
    xzCircle.rotateX(Math.PI / 2)

    const yzCircle = xyCircle.clone()
    yzCircle.rotateY(-Math.PI / 2)

    const xHelper = new THREE.Group()
    const yHelper = new THREE.Group()
    const zHelper = new THREE.Group()
    xHelper.visible = false
    yHelper.visible = false
    zHelper.visible = false

    // 分段添加旋转辅助圆环
    for(let i = 0; i < 8; i++) {
        const ringGeometry = new THREE.RingGeometry(0.25, 0.3, 20, 8, Math.PI / 4 * i + 0.05, Math.PI / 4 - 0.1)
        zHelper.add(new THREE.Mesh(
            ringGeometry.clone(),
            new THREE.MeshBasicMaterial(Object.assign({
                opacity: i > 1 ? .3 : 1,
                color: i > 1 ? 0xFFFFFF : 0x4082FF,
            }, ringMaterialOptions))
        ))
        yHelper.add(new THREE.Mesh(
            ringGeometry.clone().rotateX(Math.PI / 2),
            new THREE.MeshBasicMaterial(Object.assign({
                opacity: i > 1 ? .3 : 1,
                color: i > 1 ? 0xFFFFFF : 0x4082FF,
            }, ringMaterialOptions))
        ))
        xHelper.add(new THREE.Mesh(
            ringGeometry.clone().rotateY(-Math.PI / 2),
            new THREE.MeshBasicMaterial(Object.assign({
                opacity: i > 1 ? .3 : 1,
                color: i > 1 ? 0xFFFFFF : 0x4082FF,
            }, ringMaterialOptions))
        ))
    }
}
export class rotateHelper {

}
