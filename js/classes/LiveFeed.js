import * as THREE from 'three'

class _LiveFeed {
  setInstance() {
    const { scene } = XR8.Threejs.xrScene()

    const mat1 = new THREE.MeshStandardMaterial({
      side: THREE.DoubleSide,
      map: this.videoTexture,
    })
    const mat2 = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 0,
    })

    this.instance = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), mat1)
    this.instance.position.z = -6

    // this.instance.rotateY(Math.PI)
    // this.instance.rotateZ(Math.PI)

    scene.add(this.instance)
  }

  init() {
    this.video = document.querySelector('video')

    const videoTexture = new THREE.VideoTexture(this.video)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter
    videoTexture.format = THREE.RGBFormat

    this.videoTexture = videoTexture

    this.setInstance()
  }

  update() {
    if (this.instance) {
      // Old appraoch now use dom element video as a texture
      // const { cameraTexture } = XR8.Threejs.xrScene()
      // this.instance.material.map = cameraTexture
      // this.instance.material.needsUpdate = true
    }
  }
}

const LiveFeed = new _LiveFeed()
export default LiveFeed
