
varying vec4 v_TexCoord;

uniform sampler2D g_Texture0; // {"hidden":true}
uniform sampler2D g_Texture1; // {"label":"ui_editor_properties_gradient_mask","mode":"opacitymask","combo":"MASK","paintdefaultcolor":"0 0 0 1"}
uniform sampler2D g_Texture2; // {"combo":"OPACITYMASK","default":"util/white","label":"ui_editor_properties_opacity_mask","mode":"opacitymask","paintdefaultcolor":"0 0 0 1"}
uniform float u_Multiply; // {"material":"multiply","label":"ui_editor_properties_blend_amount","default":1,"range":[0.0, 1.0]}
uniform float u_GradientScale; // {"material":"gradientScale","label":"ui_editor_properties_gradient_scale","default":0.25,"range":[0, 0.25]}

void main() {
	vec4 albedo = texSample2D(g_Texture0, v_TexCoord.xy);
#if MASK
	float mask = texSample2D(g_Texture1, v_TexCoord.zw).r;
#else
	float mask = 0.5;
#endif
#if OPACITYMASK
	float opactiyMask = 1.0 - texSample2D(g_Texture2, v_TexCoord.zw).r;
#else
	float opactiyMask = 1.0;
#endif
	float blend = smoothstep(saturate(mask - u_GradientScale), saturate(mask + u_GradientScale), u_Multiply);
	albedo.a *= (1.0 - blend * opactiyMask);
	
	gl_FragColor = albedo;
}
