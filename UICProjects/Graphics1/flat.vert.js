export default `#version 300 es

uniform mat4 uModel;
uniform mat4 uProjection;
uniform mat4 uView;
uniform vec4 uColor;

in vec3 position;

out vec4 vColor;

void main() {
    // TODO: transform position
    vColor = uColor;
    gl_Position = uProjection * uView * uModel * vec4(position, 1);
    // gl_Position = vec4(position, 1);
}
`;