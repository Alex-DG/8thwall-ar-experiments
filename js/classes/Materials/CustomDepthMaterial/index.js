import { ShaderMaterial, Vector4, DoubleSide } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

class CustomDepthMaterial extends ShaderMaterial {
  constructor(camera) {
    super({
      side: DoubleSide,
      uniforms: {
        time: { value: 0 },
        cameraNear: { value: camera.near },
        cameraFar: { value: camera.far },
        resolution: { value: new Vector4() },
      },
      // wireframe: true,
      transparent: true,
      vertexShader,
      fragmentShader,
    })
  }
}

export default CustomDepthMaterial
