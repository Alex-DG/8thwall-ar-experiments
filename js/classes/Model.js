import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class _Model {
  setInstance(model) {
    this.instance = model.scene
    this.scene.add(model.scene)
  }

  async load() {
    try {
      const loader = new GLTFLoader()
      const source = this.sources[0]
      const glb = await loader.loadAsync(source)
      glb.scene.visible = false

      // glb.scene.position.z = -4

      this.setInstance(glb)
    } catch (error) {
      console.error({ error })
      alert('Error: model loading failed.')
    }
  }

  show(position, rotation) {
    this.instance.visible = true
    this.instance.position.copy(position)
    this.instance.quaternion.copy(rotation)
  }

  hide() {
    this.instance.visible = false
  }

  init() {
    const { scene } = XR8.Threejs.xrScene()
    this.scene = scene

    this.clock = new THREE.Clock()

    this.sources = ['models/Desk/Desk.glb']

    this.load()
  }

  update() {}
}

const Model = new _Model()
export default Model
