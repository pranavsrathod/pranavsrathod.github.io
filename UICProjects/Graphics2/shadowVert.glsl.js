export default `#version 300 es

uniform mat4 uModel;
uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uLightView;
uniform mat4 uLightProjection;
uniform vec4 uColor;
uniform vec3 uLightDir;
uniform bool uHasNormals;

in vec3 position;
in vec3 normal;

out vec4 vColor;
out vec4 vLightSpacePos;

void main() {
    // TODO: If has normals, compute color considering it
    // TODO: compute light space position and gl_Position
    if (uHasNormals){
        vec3 lightdir = normalize(uLightDir);
        float dotp = max(0.25,dot(lightdir,normal));
        // gl_Position = uProjection * uView * uModel * vec4(position, 1);
        vColor = vec4(dotp*uColor.rgb, 1);
    } else {
        vColor = vec4(uColor.rgb, 1);
    }

    vec4 wPos = uModel * vec4(position, 1);
    gl_Position = uProjection * uView * wPos;
    vLightSpacePos = uLightProjection * uLightView * wPos;
}
`;