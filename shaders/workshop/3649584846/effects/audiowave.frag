
uniform sampler2D g_Texture0; // {"material":"framebuffer","label":"ui_editor_properties_framebuffer","hidden":true}
uniform float g_AudioSpectrum64Left[64];
uniform float g_AudioSpectrum64Right[64];
uniform vec3 g_Screen;

uniform float uXOffset; // {"material":"X Offset","default":0,"range":[-0.5, 0.5]}
uniform float uSoftness; // {"material":"Softness","default":0.01,"range":[0,0.1]}
uniform float uThickness; // {"material":"Thickness","default":0.015,"range":[0.001,0.05]}

varying vec2 vUv;

uniform float uLineCount; // {"material":"Line Count","int":true,"default":10,"range":[1, 20]}
uniform float uAmplitude; // {"material":"Amplitude","default":0.2,"range":[0, 0.5]}
uniform float uYOffset; // {"material":"Y Offset","default":0,"range":[-0.5, 0.5]}
uniform vec3 uWaveColor1; // {"default":"0.9 0.9 0.9","material":"WaveColor1","type":"color"}
uniform vec3 uWaveColor2; // {"default":"0.2 0.2 0.2","material":"WaveColor2","type":"color"}
uniform vec2 uStackOffset; // {"default":"0.7 0.4","material":"StackOffset","position":true}

const float MAX_LINES = 20.0;

float getSpectrumLevel(int idx, bool isLeft) {
    int i_spec = idx / 4;
    int c = idx - (i_spec * 4);
    vec4 v = isLeft ? g_AudioSpectrum64Left[i_spec] : g_AudioSpectrum64Right[i_spec];
    if (c == 0) return v.x;
    if (c == 1) return v.y;
    if (c == 2) return v.z;
    return v.w;
}

float getAudioSample(float x, bool checkLeft) {
    float pos = clamp(x, 0.0, 1.0) * 63.0;
    int index = int(pos);
    float f = smoothstep(0.0, 1.0, frac(pos));
    
    int i1 = int(clamp(float(index), 0.0, 63.0));
    int i2 = int(clamp(float(index + 1), 0.0, 63.0));

    float s1 = getSpectrumLevel(i1, checkLeft);
    float s2 = getSpectrumLevel(i2, checkLeft);
    return mix(s1, s2, f);
}

float wave(vec2 uv, float yPos, float thickness, float softness) {
  uv.x -= uXOffset;
  uv.x *= 2.0;

  float absX = abs(uv.x);
  float falloff = smoothstep(1.0, 0.1, absX);

  float audioVal = getAudioSample(1.0 - absX, uv.x < 0.0);
  
  float y = -falloff * audioVal * yPos + uYOffset;
  return 1.0 - smoothstep(thickness, thickness + softness + falloff * 0.0, abs(uv.y - y));
}

void main() {
  vec4 col = texSample2D(g_Texture0, vUv.xy);

  vec2 uvwave = vUv;
  uvwave -= 0.5;
  
  float aaDy = g_Screen.y * 0.000005;

  for (float i = 0.0; i < MAX_LINES; i += 1.0) {
    float k = uLineCount - i;
    
    if (k >= 0.0) {
      float t = k / max(0.001, uLineCount - 1.0);
      vec3 lineCol = mix(uWaveColor1, uWaveColor2, t);
      float bokeh = pow(t, 3.0);
      float thickness = uThickness;
      float softness = aaDy + bokeh * 0.2 + uSoftness;
      float amp = uAmplitude - 0.05 * t;
      float amt = max(0.0, pow(1.0 - bokeh, 2.0) * 0.9);
      
      vec2 lineUV = uvwave - (uStackOffset - 0.5) * t;

      float w = wave(lineUV, amp, thickness, softness);

      col.rgb = mix(col.rgb, lineCol, w * amt);
    }
  }
  
  gl_FragColor = col;
}
