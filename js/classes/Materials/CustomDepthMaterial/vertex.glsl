#include <packing>

uniform float time;
uniform vec2 pixels;
uniform sampler2D depthInfo;
uniform vec4 resolution;
uniform float cameraNear;
uniform float cameraFar;

varying vec2 vUv;
varying vec3 vPosition;
varying float vDepth;
varying float vPosZ;


float readDepth( sampler2D depthSampler, vec2 coord ) {
	float fragCoordZ = texture2D( depthSampler, coord ).x;
	float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
	return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
  vUv = uv;
  
  float depth = readDepth( depthInfo, vUv );

  vec3 pos = position;
  pos.z += (1.0 - depth) * 1.2; 
  
  float baseScale = 1.0;
  float powerScale = 1.25;
  mat4 sPos = mat4(vec4(baseScale * powerScale * 2., 0.0, 0.0 ,0.0),                      
                    vec4(0.0, baseScale * powerScale, 0.0, 0.0),                     
                      vec4(0.0, 0.0, baseScale  * powerScale, 0.0),                       
                        vec4(0.0, 0.0, 0.0, 1.0));

  gl_Position = projectionMatrix * modelViewMatrix * sPos * vec4(pos, 1.0);

  vPosZ = pos.z;

  // vUv = uv;
  // vec2 vUv1 = (vec2(vUv.x,y) - 0.5)/resolution.zw + vec2(0.5);
  // float depth = readDepth( depthInfo, vUv1 );
  
  // vec3 pos = position;
  // pos.z +=(1. - depth)*0.6*progress;
  // pos.y += 0.01*snoise(vec3(vUv1*30.,time/100.));
  // vDepth = depth;
  // gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );

}