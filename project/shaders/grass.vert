attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float timeFactor;
uniform float t0;

varying vec2 vTextureCoord;

void main() {
	vTextureCoord = aTextureCoord;
	float PI = 3.14159;

	float min_angle = -PI / 4.0 * aVertexPosition.y + PI / 2.0;

	float theta = (PI / 2.0 - min_angle) * sin(timeFactor + t0) / 2.0 + min_angle;

	vec3 z_offset = vec3(0.0, aVertexPosition.y * sin(theta), aVertexPosition.y * cos(theta));

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + z_offset, 1.0);
}
