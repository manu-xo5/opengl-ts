#version 300 es
precision mediump float;

in vec3 Normal;
in vec3 FragPos;
in vec2 TexCoords;
in mat3 TBN;

out vec4 FragColor;

uniform bool uUseTexture;
uniform vec3 uColor;

uniform vec3 uLightPos;

uniform sampler2D uSampler;
uniform sampler2D uNormalMap;

void main() {
    vec3 normal = normalize(texture(uNormalMap, TexCoords).rgb * 2.0 - 1.0);
    normal = normalize(TBN * normal);

    // vec3 normal = normalize(Normal);
    vec3 lightDir = normalize(uLightPos - FragPos);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);


    float ambientFactor = 0.3;
    float diffuseFactor = max(dot(normal, lightDir), 0.0);

    vec3 ambient = ambientFactor * lightColor;
    vec3 diffuse = diffuseFactor * lightColor;

    if (uUseTexture) {
        vec3 objectColor = texture(uSampler, TexCoords).rgb;
        FragColor = vec4((ambient + diffuse) * objectColor, 1.0);
    } else {
        FragColor = vec4((ambient + diffuse) * uColor, 1.0);
    }

}
