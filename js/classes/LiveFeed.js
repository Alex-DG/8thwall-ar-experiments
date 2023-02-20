import * as THREE from 'three'

class _LiveFeed {
  setInstance() {
    const { scene } = XR8.Threejs.xrScene()

    this.instance = new THREE.Mesh(
      new THREE.PlaneGeometry(4, 4),
      new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })
    )
    this.instance.position.z = -6

    this.instance.rotateY(Math.PI)
    this.instance.rotateZ(Math.PI)

    scene.add(this.instance)
  }

  init() {
    this.setInstance()
  }

  update() {
    if (this.instance) {
      const { cameraTexture } = XR8.Threejs.xrScene()

      this.instance.material.map = cameraTexture
      this.instance.material.needsUpdate = true
    }
  }
}

const LiveFeed = new _LiveFeed()
export default LiveFeed
