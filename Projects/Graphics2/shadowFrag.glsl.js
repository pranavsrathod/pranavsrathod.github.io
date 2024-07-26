export default `#version 300 es
precision highp float;

uniform sampler2D uSampler;

in vec4 vColor;
in vec4 vLightSpacePos;
out vec4 outColor;

vec3 shadowCalculation(vec4 lightSpacePos) {
    // TODO: shadow calculation
    vec3 projCoords = lightSpacePos.xyz / lightSpacePos.w;

    projCoords = projCoords * 0.5 + 0.5;
    return projCoords;
}

void main() {
    // TODO: compute shadowmap coordenates 
    // TODO: evaluate if point is in shadow or not
    vec3 projCoords = shadowCalculation(vLightSpacePos);
    float closestDepth = texture (uSampler, projCoords.xy).r;
    float currentDepth = projCoords.z;
    // float shadow = currentDepth > closestDepth ? 1.0 : 0.0;

    // float bias = 0.0025;
    float shadow = 0.0;

    vec2 size = vec2(1.0) / vec2(textureSize(uSampler, 0));

    for (int i = -2; i <= 2; i++){
        for (int j = -2; j <= 2; j++){
            float depth = texture(uSampler, projCoords.xy + vec2 (i,j) * size).r;
            shadow = shadow + currentDepth > depth ? 1.0 : 0.0;
        }
    }
    shadow = shadow / 16.0;
    outColor = vec4((1.0 - shadow * 0.5) * vColor.rgb, 1);
}
`;