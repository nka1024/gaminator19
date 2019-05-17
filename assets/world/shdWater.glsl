attribute vec3 in_Position;                  // (x,y,z)
attribute vec4 in_Colour;                    // (r,g,b,a)
attribute vec2 in_TextureCoord;              // (u,v)

varying vec2 v_vTexcoord;
varying vec4 v_vColour;
varying vec2 seedCoord;

void main()
{
    vec4 object_space_pos = vec4( in_Position.x, in_Position.y, in_Position.z, 1.0);
    gl_Position = gm_Matrices[MATRIX_WORLD_VIEW_PROJECTION] * object_space_pos;
    
    v_vColour = in_Colour;
    v_vTexcoord = in_TextureCoord;
    seedCoord=in_Position.xy;
}

//######################_==_YOYO_SHADER_MARKER_==_######################@~varying vec2 v_vTexcoord;
varying vec4 v_vColour;
varying vec2 seedCoord;

uniform float time;
uniform vec2 waveDistortion;
uniform vec2 waveLength;

vec2 wave;

void main()
{
    wave.x=sin((time+seedCoord.y)*waveLength.y/10.)/100.*waveDistortion.x;
    wave.y=sin((time+seedCoord.x)*waveLength.x/10.)/100.*waveDistortion.y;

    gl_FragColor = v_vColour * texture2D( gm_BaseTexture, v_vTexcoord+wave );
}

