import * as THREE from 'three'
import ExempleDepthTexture from './Materials/ExempleDepthTexture'

/**
 * Three.js documentation exemple: https://threejs.org/docs/#api/en/textures/DepthTexture
 */
class _Exemple {
  setRenderTarget() {
    if (this.target) this.arget.dispose()

    const format = parseFloat(this.params.format)
    const type = parseFloat(this.params.type)

    this.target = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    )
    this.target.texture.minFilter = THREE.NearestFilter
    this.target.texture.magFilter = THREE.NearestFilter

    this.target.stencilBuffer =
      format === THREE.DepthStencilFormat ? true : false

    this.target.depthTexture = new THREE.DepthTexture()
    this.target.depthTexture.format = format
    this.target.depthTexture.type = type
  }

  setPost() {
    // Setup post processing stage
    this.postMaterial = new ExempleDepthTexture(this.camera)

    const postPlane = new THREE.PlaneGeometry(2, 2)
    const postQuad = new THREE.Mesh(postPlane, this.postMaterial)

    this.postScene.add(postQuad)
  }

  setElements() {
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 64)
    const material = new THREE.MeshBasicMaterial({ color: 'blue' })

    const count = 50
    const scale = 5

    for (let i = 0; i < count; i++) {
      const r = Math.random() * 2.0 * Math.PI
      const z = Math.random() * 2.0 - 1.0
      const zScale = Math.sqrt(1.0 - z * z) * scale

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(Math.cos(r) * zScale, Math.sin(r) * zScale, z * scale)
      mesh.rotation.set(Math.random(), Math.random(), Math.random())
      this.scene.add(mesh)
    }
  }

  init() {
    const { scene, camera, renderer } = XR8.Threejs.xrScene()

    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.target = null
    this.postScene = new THREE.Scene()
    this.postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.postMaterial = null
    this.supportsExtension = true

    // this.formats = {
    //   DepthFormat: THREE.DepthFormat,
    //   DepthStencilFormat: THREE.DepthStencilFormat,
    // }
    // this.types = {
    //   UnsignedShortType: THREE.UnsignedShortType,
    //   UnsignedIntType: THREE.UnsignedIntType,
    //   UnsignedInt248Type: THREE.UnsignedInt248Type,
    // }

    this.params = {
      format: THREE.DepthFormat,
      type: THREE.UnsignedShortType,
    }

    this.setRenderTarget()
    this.setPost()
    this.setElements()

    this.isReady = true
  }

  update() {}

  render() {
    if (!this.isReady) return

    this.renderer.autoClear = true

    // render scene into target
    this.renderer.setRenderTarget(this.target)
    this.renderer.render(this.scene, this.camera)

    // render post FX
    this.postMaterial.uniforms.tDiffuse.value = this.target.texture
    this.postMaterial.uniforms.tDepth.value = this.target.depthTexture

    this.renderer.setRenderTarget(null)
    this.renderer.render(this.postScene, this.postCamera)
  }
}

const Exemple = new _Exemple()
export default Exemple
