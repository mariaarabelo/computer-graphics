#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {

	vec4 color = texture2D(uSampler, vTextureCoord);
    float gray = color.r * 0.299 + color.g *0.587 + color.b * 0.114;

	vec4 colorGrayscale = color;

	colorGrayscale.r = gray;
	colorGrayscale.g = gray;
	colorGrayscale.b = gray;

	gl_FragColor = colorGrayscale;
}