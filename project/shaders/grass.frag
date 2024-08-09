#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uTexture; 

uniform vec4 uAmbientColor;

varying vec2 vTextureCoord;



void main() {
	vec4 textureColor = texture2D(uTexture, vTextureCoord); 
	
	vec4 color = mix(uAmbientColor, textureColor, textureColor.a);

	gl_FragColor = color; 
}
