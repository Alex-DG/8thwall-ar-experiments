import * as THREE from 'three'

class _Box {
  setInstance(texture) {
    const { scene } = XR8.Threejs.xrScene()

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({
        map: texture,
      })
    )

    console.log({ geo: box.geometry.attributes.position })

    box.position.z = 0
    box.rotateY(Math.PI / 6)

    scene.add(box)

    this.instance = box
  }

  hide() {
    this.instance.visible = false
  }

  init() {
    this.setInstance()
  }

  update() {
    if (this.instance) {
      this.instance.rotation.y -= 0.01
    }
  }
}

const Box = new _Box()
export default Box
