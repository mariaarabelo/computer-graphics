attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float timeFactor;

varying vec2 vTextureCoord;

uniform sampler2D uSampler2;

void main() {

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

	vTextureCoord = aTextureCoord;

    vec3 offset=vec3(0.0,0.0,0.0);

	offset=aVertexNormal*0.05*texture2D(uSampler2, vTextureCoord + vec2(timeFactor * 0.01, timeFactor * 0.01)).b;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);

}

