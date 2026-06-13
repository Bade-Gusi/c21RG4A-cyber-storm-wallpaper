#include "common.h"
#include "common_perspective.h"

uniform mat4 g_ModelViewProjectionMatrix;

uniform vec3 u_ViewPoint; // {"default":"0 0 1000","label":"ViewPoint","material":"viewPoint"}
uniform vec3 u_Offset; // {"default":"0 0 0","label":"Offset","material":"offset"}
uniform vec3 u_Rotate; // {"default":"0 0 0","label":"Rotate","material":"rotate"}
uniform vec4 u_RotateAxis1; // {"default":"0 0 0 0","label":"rotateAxis1","material":"rotateAxis1"}
uniform vec4 u_RotateAxis2; // {"default":"0 0 0 0","label":"rotateAxis2","material":"rotateAxis2"}
uniform vec4 u_RotateAxis3; // {"default":"0 0 0 0","label":"rotateAxis3","material":"rotateAxis3"}
uniform vec3 u_RotateMoveLength; // {"default":"0 0 0","label":"RotateMoveLength","material":"rotateMoveLength"}
uniform float u_RotateMoveDeg; // {"conversion":"rad2deg","default":"0","direction":true,"label":"RotateMoveDeg","material":"rotateMoveDeg"}
uniform vec2 u_Scale; // {"default":"1 1","label":"Scale","material":"scale"}
uniform float u_RotateZLength; // {"default":"1","label":"RotateZLength","material":"rotateZLength","range":[0,100]}


attribute vec3 a_Position;
attribute vec2 a_TexCoord;

varying vec2 v_TexCoord;

vec3 multiplicationMat3Vec3(mat3 multiMat3, vec3 multiVec3){
	return vec3(multiMat3[0][0] * multiVec3.x + multiMat3[0][1] * multiVec3.y + multiMat3[0][2] * multiVec3.z,
		multiMat3[1][0] * multiVec3.x + multiMat3[1][1] * multiVec3.y + multiMat3[1][2] * multiVec3.z,
		multiMat3[2][0] * multiVec3.x + multiMat3[2][1] * multiVec3.y + multiMat3[2][2] * multiVec3.z);
}

mat3 getRotateMat(vec4 vec){
	if(vec.x == 0 && vec.y == 0 && vec.z == 0){
		return mat3(1,0,0,0,1,0,0,0,1);
	}
	float sinVal = sin(vec.w * M_PI / 180);
	float cosVal = cos(vec.w * M_PI / 180);
	vec3 norVec = normalize(vec.xyz);
	float a00 = norVec.x * norVec.x * (1-cosVal) + cosVal;
	float a01 = norVec.x * norVec.y * (1-cosVal) - norVec.z * sinVal;
	float a02 = norVec.x * norVec.z * (1-cosVal) + norVec.y * sinVal;
	float a10 = norVec.y * norVec.x * (1-cosVal) + norVec.z * sinVal;
	float a11 = norVec.y * norVec.y * (1-cosVal) + cosVal;
	float a12 = norVec.y * norVec.z * (1-cosVal) - norVec.x * sinVal;
	float a20 = norVec.z * norVec.x * (1-cosVal) - norVec.y * sinVal;
	float a21 = norVec.z * norVec.y * (1-cosVal) + norVec.x * sinVal;
	float a22 = norVec.z * norVec.z * (1-cosVal) + cosVal;
	return mat3(a00,a01,a02,a10,a11,a12,a20,a21,a22);
}


vec2 getAddVec(vec3 position){
	vec3 movePoint = vec3(u_RotateMoveLength.xy * sin(u_RotateMoveDeg), u_RotateMoveLength.z * (1 - cos(u_RotateMoveDeg)) / 2 );

	vec3 calcPoint = vec3(position.xy, 0.0);

	calcPoint.xy *= u_Scale.xy;

	vec3 radiansVec3 = radians(u_Rotate.xyz);
	calcPoint.yz = rotateVec2(calcPoint.yz, radiansVec3.x);
	calcPoint.zx = rotateVec2(calcPoint.zx, radiansVec3.y);
	calcPoint.xy = rotateVec2(calcPoint.xy, radiansVec3.z);
	calcPoint.xyz = mul(getRotateMat(u_RotateAxis1) ,calcPoint.xyz);
	calcPoint.xyz = mul(getRotateMat(u_RotateAxis2) ,calcPoint.xyz);
	calcPoint.xyz = mul(getRotateMat(u_RotateAxis3) ,calcPoint.xyz);
	calcPoint.z *= u_RotateZLength;

	calcPoint += u_Offset;
	calcPoint += movePoint;

	calcPoint.xy = ( calcPoint.xy - u_ViewPoint.xy  ) * u_ViewPoint.z / ( u_ViewPoint.z + calcPoint.z ) + u_ViewPoint.xy;

	return calcPoint.xy;
}

void main() {
	gl_Position = mul(vec4(getAddVec(a_Position), 1.0, 1.0), g_ModelViewProjectionMatrix);
	v_TexCoord.xy = a_TexCoord;
}
