import * as THREE from 'three'

import ProjectedMaterial from 'three-projected-material'

const random = (min, max) => {
  return THREE.MathUtils.randFloat(min, max)
}

/**
 * Projection
 */
class _TextureProjection {
  setElements(texture) {
    const { camera, scene } = XR8.Threejs.xrScene()

    const elements = new THREE.Group()
    elements.position.z = -5
    const NUM_ELEMENTS = 50

    for (let index = 0; index < NUM_ELEMENTS; index++) {
      const geometry = new THREE.IcosahedronGeometry(random(0.1, 0.8))

      const material = new ProjectedMaterial({
        camera,
        texture,
        color: 'white',
        textureScale: 0.5,
        textureOffset: new THREE.Vector2(-0.01, 0.4),
      })

      const element = new THREE.Mesh(geometry, material)

      if (index < NUM_ELEMENTS * 0.5) {
        element.position.x = random(-0.5, 0.8)
        element.position.y = random(-1.1, 0.8)
        element.position.z = random(-0.6, 0.6)
        element.scale.multiplyScalar(1.4)
      } else {
        element.position.x = random(-1.5, 1.5)
        element.position.y = random(-2.5, 3)
        element.position.z = random(-0.8, 0.8)
      }

      element.rotation.x = random(0, Math.PI * 2)
      element.rotation.y = random(0, Math.PI * 2)
      element.rotation.z = random(0, Math.PI * 2)

      element.rotateY(Math.PI / 6)

      elements.add(element)

      const center = new THREE.Vector2(
        window.innerWidth / 2,
        window.innerWidth / 2
      )

      material.project(element)
    }

    scene.add(elements)

    this.elements = elements
  }

  async load() {
    try {
      const loader = new THREE.TextureLoader()
      const texture = await loader.loadAsync('textures/Fox/Fox_face.png')
      this.texture = texture

      //   texture.repeat.set(6, 6) // adjust the repeat property to scale the texture
      //   texture.wrapS = THREE.RepeatWrapping
      //   texture.wrapT = THREE.RepeatWrapping

      // fit the texture to the mesh
      //   texture.wrapS = THREE.RepeatWrapping
      //   texture.wrapT = THREE.RepeatWrapping
      //   texture.repeat.set(1, 1) // set repeat to (1, 1) to avoid stretching

      //   // center the texture
      //   texture.offset.set(0.5, 0.5)
      //   texture.center.set(0.5, 0.5)
      texture.mapping = THREE.UVMapping

      this.setElements(texture)
    } catch (error) {
      console.log('load-texture-error', { error })
    }
  }

  init() {
    this.load()
  }

  update() {
    if (this.elements) {
      this.elements.rotation.y -= 0.003
    }
  }
}

const TextureProjection = new _TextureProjection()
export default TextureProjection
