import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

class _Hachiko {
  setInstance(model) {
    this.instance = model.scene
    this.scene.add(model.scene)
  }

  setDepthMap() {
    const { scene, camera, renderer } = XR8.Threejs.xrScene()

    const renderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        depthTexture: new THREE.DepthTexture(),
      }
    )

    const depthShader = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        nearClip: { value: camera.near },
        farClip: { value: camera.far },
        inverseProjectionMatrix: { value: new THREE.Matrix4() },
      },
      vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
      fragmentShader: `
          #include <packing>

          uniform sampler2D tDiffuse;
          uniform float nearClip;
          uniform float farClip;
          uniform mat4 inverseProjectionMatrix;
          varying vec2 vUv;
          float readDepth(sampler2D depthSampler, vec2 coord) {
            float fragCoordZ = texture2D(depthSampler, coord).x;
            float viewZ = perspectiveDepthToViewZ(fragCoordZ, nearClip, farClip);
            return (inverseProjectionMatrix * vec4(0.0, 0.0, viewZ, 1.0)).z;
          }
          void main() {
            gl_FragColor = vec4(vec3(readDepth(tDiffuse, vUv)), 1.0);
          }
        `,
    })

    depthShader.uniforms.tDiffuse.value = renderTarget.texture

    renderer.setRenderTarget(renderTarget)
    renderer.render(scene, camera)

    // create a new mesh to display the depth map
    const depthMap = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      depthShader
    )
    depthMap.position.y = 3
    scene.add(depthMap)
    console.log({ depthMap })
  }

  async load() {
    try {
      const loader = new GLTFLoader()
      const source = this.sources[0]
      const loaderTexture = new THREE.TextureLoader()
      const texture = await loaderTexture.loadAsync('textures/Fox/Fox_face.png')
      const glb = await loader.loadAsync(source)
      glb.scene.position.z = 1
      // glb.scene.position.z = -4

      this.setInstance(glb)
      this.setDepthMap()
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

    this.sources = ['models/Dog/hachiko.glb']

    this.load()
  }

  update() {}

  render() {}
}

const Hachiko = new _Hachiko()
export default Hachiko
