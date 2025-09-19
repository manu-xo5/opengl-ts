#version 300 es
in vec3 aPosition;
in vec2 aTexCoords;

// in vec4 aTangent;
in vec3 aNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

out vec3 Normal;
out vec3 FragPos;
out vec2 TexCoords;

// out mat3 TBN;

void main() {
    // vec3 T = normalize(mat3(uModel) * aTangent.xyz);
    // vec3 N = normalize(mat3(uModel) * aNormal);
    // vec3 B = cross(N, T) * aTangent.w;
    // TBN = mat3(T, B, N);

    TexCoords = aTexCoords;
    Normal = aNormal;
    FragPos = (uModel * vec4(aPosition, 1.0)).xyz;
    gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}
