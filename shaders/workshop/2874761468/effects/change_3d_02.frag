
varying vec2 v_TexCoord;

uniform sampler2D g_Texture0; // {"hidden":true}

void main() {
	vec2 texCoord = v_TexCoord;
	texCoord = frac(texCoord);
	gl_FragColor = texSample2D(g_Texture0, texCoord);
}
