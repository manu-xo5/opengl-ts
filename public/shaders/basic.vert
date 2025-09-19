#version 300 es
in vec3 aPosition;
in vec3 aNormal;
in vec2 aTexCoords;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

out vec3 Normal;
out vec3 FragPos;
out vec2 TexCoords;

void main() {
    TexCoords = aTexCoords;
    Normal = aNormal;
    FragPos = (uModel * vec4(aPosition, 1.0)).xyz;
    gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);
}
