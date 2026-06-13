
uniform mat4 g_ModelViewProjectionMatrix;

attribute vec3 a_Position;
attribute vec2 a_TexCoord;

varying vec2 vUv;

void main() {
	gl_Position = mul(vec4(a_Position, 1.0), g_ModelViewProjectionMatrix);
	vUv.xy = a_TexCoord;
}
