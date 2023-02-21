import * as THREE from 'three'

/**
 * Three.js documentation exemple: https://threejs.org/docs/#api/en/textures/DepthTexture
 */
class _Exemple {
  init() {
    const { scene, camera, renderer } = XR8.Threejs.xrScene()

    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.target = null
    this.postScen = new THREE.Scene()
    this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.postMaterial = null
    this.supportsExtension = true

    this.formats = {
      DepthFormat: THREE.DepthFormat,
      DepthStencilFormat: THREE.DepthStencilFormat,
    }
    this.types = {
      UnsignedShortType: THREE.UnsignedShortType,
      UnsignedIntType: THREE.UnsignedIntType,
      UnsignedInt248Type: THREE.UnsignedInt248Type,
    }

    this.params = {
      format: THREE.DepthFormat,
      type: THREE.UnsignedShortType,
    }
  }

  update() {}

  render() {}
}

const Exemple = new _Exemple()
export default Exemple
