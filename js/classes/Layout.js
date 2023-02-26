import * as THREE from 'three'

import Box from './Box'
import ProjectedMaterial from './Materials/ProjectedMaterial'

class _Layout {
  async project() {
    try {
      const { camera } = XR8.Threejs.xrScene()
      const loader = new THREE.TextureLoader()
      const texture = await loader.loadAsync(
        'textures/Depth/generated_depth.png'
      )
      console.log({ texture })
      const material = new ProjectedMaterial({
        camera,
        texture,
        color: 'white',
        textureScale: 0.7,
        // textureOffset: new THREE.Vector2(-0.01, 0),
      })

      Box.instance.material = material
      Box.instance.material.needsUpdate = true

      material.project(Box.instance)
      console.log('texture projected!')
    } catch (error) {
      console.log({ error })
    }
  }

  // Generated depth texture
  async createDepthMap() {
    const { renderer, camera, scene } = XR8.Threejs.xrScene()

    const format = THREE.DepthFormat
    const type = THREE.UnsignedShortType
    const target = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    )
    target.texture.minFilter = THREE.NearestFilter
    target.texture.magFilter = THREE.NearestFilter
    target.stencilBuffer = format === THREE.DepthStencilFormat ? true : false
    target.depthTexture = new THREE.DepthTexture()
    target.depthTexture.format = format
    target.depthTexture.type = type

    // Setup post processing stage
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const postMaterial = new THREE.ShaderMaterial({
      vertexShader: `
            varying vec2 vUv;

            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
      fragmentShader: `
            #include <packing>

            varying vec2 vUv;
            uniform sampler2D tDiffuse;
            uniform sampler2D tDepth;
            uniform float cameraNear;
            uniform float cameraFar;


            float readDepth( sampler2D depthSampler, vec2 coord ) {
              float fragCoordZ = texture2D( depthSampler, coord ).x;
              float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
              return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
            }

            void main() {
              //vec3 diffuse = texture2D( tDiffuse, vUv ).rgb;
              float depth = readDepth( tDepth, vUv );

              gl_FragColor.rgb = 1.0 - vec3( depth );
              gl_FragColor.a = 1.0;
            }
          `,
      uniforms: {
        cameraNear: { value: camera.near },
        cameraFar: { value: camera.far },
        tDiffuse: { value: null },
        tDepth: { value: null },
      },
    })
    const postPlane = new THREE.PlaneGeometry(5, 5)
    const postQuad = new THREE.Mesh(postPlane, postMaterial)
    postQuad.position.z = 0
    postQuad.rotateX(-Math.PI / 8)
    const postScene = new THREE.Scene()

    // render scene into target
    renderer.setRenderTarget(target)
    renderer.render(scene, camera)

    // render post FX
    postMaterial.uniforms.tDiffuse.value = target.texture
    postMaterial.uniforms.tDepth.value = target.depthTexture

    console.log({ depthTexture: target.depthTexture })

    // Box.hide()
    // scene.add(postQuad) // UNCOMMENT TO SEE THE DEPTH TEXTURE IN A PLANE
    this.depthTexture = target.depthTexture
  }

  setLayout() {
    const menuUI = document.querySelector('.menu')
    const screenUI = document.querySelector('.screenshot')

    menuUI.innerHTML = `
        <button id="depth-btn">Depth</button>
        <button id="project-btn">Project</button>
    `

    screenUI.innerHTML = `
        <img id="canvas-image" alt="Canvas"></img>
    `

    this.canvasImage = document.getElementById('canvas-image')

    this.depthBtn = document.getElementById('depth-btn')
    this.depthBtn.addEventListener('click', this.createDepthMap)

    this.projectBtn = document.getElementById('project-btn')
    this.projectBtn.addEventListener('click', this.project)
  }

  bind() {
    this.createDepthMap = this.createDepthMap.bind(this)
    this.project = this.project.bind(this)
  }

  init() {
    this.bind()

    this.setLayout()
  }
}

const Layout = new _Layout()
export default Layout
