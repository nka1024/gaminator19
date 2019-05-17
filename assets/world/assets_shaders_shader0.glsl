---
name: Tunnel
type: fragment
uniform.alpha: { "type": "1f", "value": 1.0 }
uniform.origin: { "type": "1f", "value": 2.0 }
uniform.iChannel0: { "type": "sampler2D", "value": null, "textureData": { "repeat": true } }
---

precision mediump float;

uniform float time;
// uniform vec2 resolution;
uniform sampler2D iChannel0;
uniform float alpha;
uniform float origin;

// varying vec2 fragCoord;

// #define S 0.79577471545 // Precalculated 2.5 / PI
// #define E 0.0001

// void main(void) {
//     vec2 p = (origin * fragCoord.xy / resolution.xy - 1.0) * vec2(resolution.x / resolution.y, 1.0);
//     vec2 t = vec2(S * atan(p.x, p.y), 1.0 / max(length(p), E));
//     vec3 c = texture2D(iChannel0, t + vec2(time * 0.1, time)).xyz;
//     gl_FragColor = vec4(c / (t.y + 0.5), alpha);
// }

varying vec2 v_vTexcoord;
varying vec4 v_vColour;
varying vec2 seedCoord;

uniform vec2 waveDistortion;
uniform vec2 waveLength;

vec2 wave;

void main()
{
    wave.x=sin((time+fragCoord.y)*waveLength.y/10.)/100.*waveDistortion.x;
    wave.y=sin((time+fragCoord.x)*waveLength.x/10.)/100.*waveDistortion.y;

    gl_FragColor = v_vColour * texture2D(iChannel0, v_vTexcoord+wave );
}



