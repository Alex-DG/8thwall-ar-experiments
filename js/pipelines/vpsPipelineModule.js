import Model from '../classes/Model'

export const initVpsPipelineModule = () => {
  const init = () => {
    Model.init()
  }

  const wayspotFound = ({ detail }) => {
    if (detail.name === 'eb3d5cc73f74') {
      const { position, rotation } = detail
      Model.show(position, rotation)
    }

    console.log('[ wayspot Found ]', { detail })
  }
  const wayspotLost = ({ detail }) => {
    if (detail.name === 'eb3d5cc73f74') {
      Model.hide()
    }

    console.log('[ wayspot Lost ]', { detail })
  }

  return {
    name: 'vps',

    onStart: init,

    listeners: [
      { event: 'reality.projectwayspotfound', process: wayspotFound },
      { event: 'reality.projectwayspotlost', process: wayspotLost },
    ],
  }
}
