---
name: chelnoque-water
type: fragment
uniform.origin: { "type": "1f", "value": 2.0 }
uniform.iChannel0: { "type": "sampler2D", "value": null, "textureData": { "repeat": true} }
uniform.waveDistortion: { "type": "2f", "value": {"x":0.1, "y":0.05 } }
uniform.waveLength: { "type": "2f", "value": { "x": 0.2, "y":1.2 } }
---
precision mediump float;
uniform float origin;
uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;
varying vec2 fragCoord;
uniform vec2 waveDistortion;
uniform vec2 waveLength;

void main (void)
{
    vec2 wave;
    wave.x=sin((time*10.0+fragCoord.y)*waveLength.y/10.)/100.*waveDistortion.x;
    wave.y=sin((time*10.0+fragCoord.x)*waveLength.x/10.)/100.*waveDistortion.y;

    vec2 st = (origin * fragCoord.xy / resolution.xy - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    vec4 color = vec4(st, 0.0, 1.0);
    
    gl_FragColor = texture2D(iChannel0,st+wave);

    // just render texture without changes
    // vec2 st = (origin * fragCoord.xy / resolution.xy - 1.0) * vec2(resolution.x / resolution.y, 1.0);
    // vec4 color = vec4(st, 0.0, 1.0);
    // color = texture2D(iChannel0,st);
    // gl_FragColor = color;
}