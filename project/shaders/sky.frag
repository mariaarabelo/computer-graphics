#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;

uniform float timeFactor;

void main() {
    vec4 panorama_color = texture2D(uSampler, vTextureCoord);

    vec4 cloud_color = texture2D(uSampler2, vec2(mod(vTextureCoord.x + timeFactor * 0.01, 1.0), vTextureCoord.y));

    if (cloud_color.r > 0.4) {
        gl_FragColor = mix(panorama_color, cloud_color, cloud_color.a);
    } else {
        gl_FragColor = panorama_color;
    }
}