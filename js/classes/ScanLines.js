import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

class _ScanLines {
  setMixer(model) {
    const animations = model.animations
    this.mixer = new THREE.AnimationMixer(model)
    this.mixer.clipAction(animations[0]).play()
  }
  async loadModel() {
    try {
      this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

      this.uniforms = {
        plane: {
          value: new THREE.Vector4(
            this.plane.normal.x,
            this.plane.normal.y,
            this.plane.normal.z,
            this.plane.constant
          ),
        },
      }

      console.log({ uniforms: this.uniforms, constant: this.plane.constant })

      const { scene } = XR8.Threejs.xrScene()

      const loader = new FBXLoader()
      const object = await loader.loadAsync(
        'https://threejs.org/examples/models/fbx/Samba Dancing.fbx'
      )

      console.log({ object })

      object.traverse((child) => {
        if (child.isMesh) {
          // let mat = new THREE.MeshStandardMaterial({
          //   transparent: true,
          //   opacity: 1,
          // })
          // child.material = mat
          let mat = child.material
          mat.transparent = true

          mat.onBeforeCompile = (shader) => {
            shader.uniforms.scanPlane = this.uniforms.plane
            shader.vertexShader = `
                      varying vec3 vWPos;
                      ${shader.vertexShader}
              `
            shader.vertexShader = shader.vertexShader.replace(
              `#include <worldpos_vertex>`,
              `
                        vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );
                          vWPos = worldPosition.xyz;
              `
            )

            shader.fragmentShader = `
                      uniform vec4 scanPlane;
                      varying vec3 vWPos;
                      ${shader.fragmentShader}
              `
            shader.fragmentShader = shader.fragmentShader.replace(
              `#include <dithering_fragment>`,
              `#include <dithering_fragment>

                    float thinness = 0.3;
                    float scanline = smoothstep(thinness, 0., abs(scanPlane.w - dot( vWPos, scanPlane.xyz )));
                    gl_FragColor = mix(vec4(gl_FragColor.rgb, 0.0), vec4(1, 0.125, 0.25, 1.0), scanline); // create transparent body
                    // gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1, 0.125, 0.25), scanline); // default material
              `
            )
          }
        }
      })
      object.scale.setScalar(0.025)
      object.position.y = -1
      scene.add(object)

      this.setMixer(object)

      this.isReady = true
    } catch (error) {
      console.log('load-model-scan-error', { error })
    }
  }

  init() {
    this.isReady = false
    this.clock = new THREE.Clock()
    this.pn = new THREE.Vector3() // plane normal
    this.pcp = new THREE.Vector3() // plane co-planar point

    this.loadModel()
  }

  update() {
    if (!this.isReady) return

    const d = this.clock.getDelta()
    // this.mixer.update(d)

    const t = this.clock.getElapsedTime()
    this.pcp.y = Math.sin(t * 0.25) //* 2 + 2 //* 9 + 9
    this.pn.setFromSphericalCoords(
      1,
      Math.sin(t * 0.314) * Math.PI,
      Math.cos(t * 0.27) * Math.PI * 2
    )
    this.plane.setFromNormalAndCoplanarPoint(this.pn, this.pcp)
    this.uniforms.plane.value.set(
      this.plane.normal.x,
      this.plane.normal.y,
      this.plane.normal.z,
      -this.plane.constant
    )
  }
}

const ScanLines = new _ScanLines()
export default ScanLines
