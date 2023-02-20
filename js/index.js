import '../styles/index.css'

import { initThreeScenePipelineModule } from './pipelines/threeScenePipelineModule'
import { initWorldPipelineModule } from './pipelines/worldPipelineModule'
import { initVpsPipelineModule } from './pipelines/vpsPipelineModule'

// Check Location Permissions at beginning of session
const errorCallback = (error) => {
  if (error.code === error.PERMISSION_DENIED) {
    alert('LOCATION PERMISSIONS DENIED. PLEASE ALLOW AND TRY AGAIN.')
  }
}
navigator.geolocation.getCurrentPosition((_) => {}, errorCallback)

const onxrloaded = () => {
  XR8.XrController.configure({ enableVps: true })

  XR8.addCameraPipelineModule(XR8.CanvasScreenshot.pipelineModule()) // A CanvasScreenshot pipeline module that can be added via XR8.addCameraPipelineModule().

  XR8.CanvasScreenshot.configure({ jpgCompression: 100 }) // 100 = little to no loss

  XR8.addCameraPipelineModules([
    XR8.GlTextureRenderer.pipelineModule(), // Draws the camera feed.
    XR8.CameraPixelArray.pipelineModule({ luminance: true }), // camera texture as a grey scale pixels value

    initThreeScenePipelineModule(), // Create custom Three.js scene and camera.
    initWorldPipelineModule(), // Create World object(s)
    initVpsPipelineModule(),

    XR8.XrController.pipelineModule(), // Enables SLAM tracking.

    XRExtras.AlmostThere.pipelineModule(), // Detects unsupported browsers and gives hints.
    XRExtras.RuntimeError.pipelineModule(), // Shows an error image on runtime error.
    XRExtras.Loading.pipelineModule(), // Manages the loading screen on startup.
    XRExtras.FullWindowCanvas.pipelineModule(), // Modifies the canvas to fill the window.
  ])

  // Open the camera and start running the camera run loop.
  XR8.run({ canvas: document.getElementById('experience') })

  console.log('✅', 'XR8 running')
}

window.onload = () => {
  window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
}
