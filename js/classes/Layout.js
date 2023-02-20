import * as THREE from 'three'

import ProjectedMaterial from 'three-projected-material'
import Model from './Model'

class _Layout {
  async saveMap() {
    const { camera } = XR8.Threejs.xrScene()

    // const loader = new THREE.TextureLoader()
    // const texture = await loader.loadAsync('textures/Fox/Fox_face.png')
    const texture = Model.instance.children[0].material.map.clone()

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(1024, 1024)
    document.body.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.add(new THREE.AmbientLight('rgb(255,255,255)', 1))

    // Here
    scene.background = texture

    renderer.render(scene, camera)

    const imageURL = renderer.domElement.toDataURL('image/png')
    const anchor = document.createElement('a')
    anchor.href = imageURL
    anchor.download = 'preview.png'
    anchor.click()

    // anchor.remove()
    // texture.dispose()
    // renderer.domElement.parentElement?.removeChild(renderer.domElement)
    // renderer.dispose()
  }

  async projection() {
    const { camera } = XR8.Threejs.xrScene()

    const loader = new THREE.TextureLoader()
    const texture = await loader.loadAsync('textures/Desk/desk1.png')
    // texture.mapping = THREE.UVMapping

    Model.instance.children[0].material.map = texture
    Model.instance.children[0].material.map.mapping = THREE.UVMapping
    Model.instance.children[0].material.needsUpdate = true

    // Model.instance.traverse((child) => {
    //   if (child.isMesh) {
    //     const material = new ProjectedMaterial({
    //       camera,
    //       texture,
    //       color: 'white',
    //       textureScale: 0.8,
    //       // textureOffset: new THREE.Vector2(-0.01, 0.4),
    //     })

    //     child.material = material
    //     child.material.needsUpdate = true

    //     material.project(child)
    //   }
    // })
  }

  async capture() {
    console.log('Capturing...')

    const { cameraTexture } = XR8.Threejs.xrScene()
    cameraTexture.minFilter = THREE.NearestFilter
    cameraTexture.magFilter = THREE.NearestFilter
    cameraTexture.needsUpdate = true

    const screenshotData = await XR8.CanvasScreenshot.takeScreenshot()
    const source = 'data:image/jpeg;base64,' + screenshotData

    const image = new Image()
    image.src = source

    this.canvasImage.src = source

    // Create Texture
    const texture = new THREE.Texture(image)
    texture.needsUpdate = true
  }

  setLayout() {
    const menuUI = document.querySelector('.menu')
    const screenUI = document.querySelector('.screenshot')

    menuUI.innerHTML = `
        <button id="capture-btn">Capture</button>
        <button id="projection-btn">Projection</button>
        <button id="save-btn">Save</button>
    `

    screenUI.innerHTML = `
        <img id="canvas-image" alt="Canvas"></img>
    `

    this.canvasImage = document.getElementById('canvas-image')

    this.captureBtn = document.getElementById('capture-btn')
    this.captureBtn.addEventListener('click', this.capture)

    this.projectionBtn = document.getElementById('projection-btn')
    this.projectionBtn.addEventListener('click', this.projection)

    this.saveBtn = document.getElementById('save-btn')
    this.saveBtn.addEventListener('click', this.saveMap)
  }

  bind() {
    this.capture = this.capture.bind(this)
    this.projection = this.projection.bind(this)
    this.saveMap = this.saveMap.bind(this)
  }

  init() {
    this.bind()

    this.setLayout()
  }
}

const Layout = new _Layout()
export default Layout
