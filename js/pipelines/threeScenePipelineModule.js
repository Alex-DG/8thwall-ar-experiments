import * as THREE from 'three'
import Depth from '../classes/Depth'

let count = 0

export const initThreeScenePipelineModule = () => {
  const init = ({ canvas, canvasWidth, canvasHeight, GLctx }) => {
    // Scene
    const scene = new THREE.Scene()

    // Camera
    const aspect = canvasWidth / canvasHeight
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    const camera1 = new THREE.PerspectiveCamera(75, aspect, 2, 3)

    const camera2 = new THREE.PerspectiveCamera(50, aspect, 2, 3)

    scene.add(camera)
    scene.add(camera1)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 3, 5)
    camera1.position.set(0, 0, 4)
    camera2.position.set(0, 0, 2)

    // Sync the xr controller's 6DoF position and camera paremeters with our scene.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    })

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      context: GLctx,
      alpha: true,
      antialias: true,
    })
    renderer.autoClear = false
    renderer.setSize(canvasWidth, canvasHeight)

    // XR Scene Data
    const xrSceneData = { scene, camera, renderer, camera1, camera2 }
    window.XR8.Threejs.xrScene = () => xrSceneData

    // Prevent scroll/pinch
    canvas.addEventListener('touchmove', (event) => {
      event.preventDefault()
    })
  }

  return {
    name: 'xr-scene',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    onStart: (args) => init(args),

    onUpdate: ({ processCpuResult, ...others }) => {
      const realitySource =
        processCpuResult.reality || processCpuResult.facecontroller

      if (!realitySource) return

      const { camera } = XR8.Threejs.xrScene()

      const { rotation, position, intrinsics } = realitySource

      for (let i = 0; i < 16; i++) {
        camera.projectionMatrix.elements[i] = intrinsics[i]
      }

      // Fix for broken raycasting in r103 and higher. Related to:
      //   https://github.com/mrdoob/three.js/pull/15996
      // Note: camera.projectionMatrixInverse wasn't introduced until r96 so check before setting
      // the inverse
      if (camera.projectionMatrixInverse) {
        if (camera.projectionMatrixInverse.invert) {
          // THREE 123 preferred version
          camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert()
        } else {
          // Backwards compatible version
          camera.projectionMatrixInverse.getInverse(camera.projectionMatrix)
        }
      }

      if (rotation) camera.setRotationFromQuaternion(rotation)

      if (position) camera.position.set(position.x, position.y, position.z)

      // const depthData = XR8.XrController.getDepthData()
      // console.log({ processCpuResult, ...others })
      // const depthTexture = XR8.XrController.pipelineModule('depth')

      // XR8.XrController.update({
      //   deltaTime: 0,
      //   pose: XR8.XrController.getCameraPose(),
      // })
      // const depthTexture = XR8.XrController.pipelineModule('depth').getTexture()
      // XR8.XrController.pipelineModule('depth')?.onProcessCpu((data) => {
      //   console.log({ data })
      // })
      // console.log({ depthTexture })

      // if (count <= 20) {
      //   count += 1
      //   console.log({ processCpuResult, ...others })
      // }
      XR8.Threejs.xrScene().data = { processCpuResult, ...others }
    },

    onProcessGpu: ({ frameStartResult }) => {
      XR8.Threejs.xrScene().frameStartResult = frameStartResult
    },
    onCanvasSizeChange: ({ canvasWidth, canvasHeight }) => {
      const { renderer } = XR8.Threejs.xrScene()
      renderer?.setSize(canvasWidth, canvasHeight)
    },

    onRender: () => {
      const { renderer, scene, camera } = XR8.Threejs.xrScene()

      // renderer.clearDepth()
      // renderer.render(scene, camera)

      Depth.render()

      renderer.autoClear = false

      renderer.setRenderTarget(null)
      renderer.render(scene, camera)
      renderer.clearDepth()
    },
  }
}
