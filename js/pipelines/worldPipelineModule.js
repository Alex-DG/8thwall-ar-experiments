import * as THREE from 'three'

import Layout from '../classes/Layout'
import Lights from '../classes/Lights'

import Box from '../classes/Box'
import TextureProjection from '../classes/TextureProjection'
import LiveFeed from '../classes/LiveFeed'

export const initWorldPipelineModule = () => {
  const cameraTexture = new THREE.Texture()

  const init = () => {
    cameraTexture.encoding = THREE.sRGBEncoding
    cameraTexture.minFilter = THREE.NearestFilter
    cameraTexture.magFilter = THREE.NearestFilter
    cameraTexture.format = THREE.RGBFormat

    Layout.init()

    Lights.init()

    // Box.init()
    // TextureProjection.init()
    // LiveFeed.init()

    console.log('✨', 'World ready')
  }

  const camTextureUpdate = (data) => {
    // const _viewport = data.processGpuResult?.gltexturerenderer?.viewport
    const realityTexture = data.processCpuResult?.reality?.realityTexture
    const intrinsics = data.processCpuResult?.reality?.intrinsics

    if (realityTexture && intrinsics) {
      const { renderer } = XR8.Threejs.xrScene()
      const texProps = renderer.properties.get(cameraTexture)
      texProps.__webglTexture = realityTexture

      XR8.Threejs.xrScene().cameraTexture = cameraTexture
    }
  }

  const render = () => {
    Box?.update()
    TextureProjection?.update()
    LiveFeed?.update()
  }

  return {
    name: 'world-content',

    onStart: () => init(),

    onUpdate: (data) => camTextureUpdate(data),

    onRender: () => render(),
  }
}
