import { ShaderMaterial, Vector4, DoubleSide } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

class ExempleDepthTexture extends ShaderMaterial {
  constructor(camera) {
    super({
      // side: DoubleSide,
      uniforms: {
        cameraNear: { value: camera.near },
        cameraFar: { value: camera.far },
        tDiffuse: { value: null },
        tDepth: { value: null },
      },
      // wireframe: true,
      // transparent: true,
      vertexShader,
      fragmentShader,
    })
  }
}

export default ExempleDepthTexture
