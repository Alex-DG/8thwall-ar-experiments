import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import CustomDepthMaterial from './Materials/CustomDepthMaterial'

class _Depth {
  setPlaneDepth() {
    const { scene, camera2 } = XR8.Threejs.xrScene()

    this.planeMaterial = new CustomDepthMaterial(camera2)

    this.planeGeometry = new THREE.PlaneGeometry(5, 5, 100, 100)

    this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial)
    scene.add(this.plane)

    let format = THREE.DepthFormat
    let type = THREE.UnsignedShortType

    this.target = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    )
    this.target.texture.format = THREE.RGBAFormat
    this.target.texture.minFilter = THREE.NearestFilter
    this.target.texture.magFilter = THREE.NearestFilter
    this.target.texture.generateMipmaps = false
    this.target.stencilBuffer =
      format === THREE.DepthStencilFormat ? true : false
    this.target.depthBuffer = true
    this.target.depthTexture = new THREE.DepthTexture()
    this.target.depthTexture.format = format
    this.target.depthTexture.type = type
  }

  setInstance(glb) {
    const { scene } = XR8.Threejs.xrScene()

    this.instance = glb.scene.children[0]

    this.instance.position.set(0, -1, -1.5)
    this.instance.rotation.set(0, 0, 0)
    this.instance.scale.set(2000, 2000, 2000)

    scene.add(this.instance)

    // this.instance.traverse((o) => {
    //   if (o.isMesh) {
    //     o.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    //   }
    // })

    this.setPlaneDepth()
  }

  async load() {
    try {
      const loader = new GLTFLoader()
      const source = this.sources[0]
      const glb = await loader.loadAsync(source)
      glb.scene.visible = true

      // glb.scene.position.z = -4

      this.setInstance(glb)
    } catch (error) {
      console.error({ error })
      alert('Error: model loading failed.')
    }
  }

  show() {
    this.instance.visible = true
  }

  hide() {
    this.instance.visible = false
  }

  init() {
    this.time = 0

    this.clock = new THREE.Clock()

    this.sources = ['models/Face/facefull.glb']

    this.load()
  }

  update() {
    this.time++

    if (this.instance) {
      this.instance.position.z = -1.4 + 0.15 * Math.sin(this.time / 50)
      this.instance.rotation.y = +0.25 * Math.sin(this.time / 100)
    }
  }

  render() {
    if (!this.target) return
    const { renderer, camera2, scene } = XR8.Threejs.xrScene()

    renderer.autoClear = true

    renderer.setRenderTarget(this.target)
    renderer.render(scene, camera2)
  }
}

const Depth = new _Depth()
export default Depth
