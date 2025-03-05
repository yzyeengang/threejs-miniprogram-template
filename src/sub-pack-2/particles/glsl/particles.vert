//#include <common>
//#include <shadowmap_pars_vertex>
//#include <logdepthbuf_pars_vertex>

uniform sampler2D texturePosition;
varying float vLife;

void main() {

//    #include <beginnormal_vertex>
//	#include <defaultnormal_vertex>
//
//	#include <logdepthbuf_vertex>

    vec4 positionInfo = texture2D(texturePosition, position.xy);
    vec4 worldPosition = modelMatrix * vec4(positionInfo.xyz, 1.0);
    vec4 mvPosition = viewMatrix * worldPosition;

//	#include <shadowmap_vertex>


    vLife = positionInfo.w;

    gl_PointSize = 1300.0 / length(mvPosition.xyz) * smoothstep(0.0, 0.2, positionInfo.w);
    gl_Position = projectionMatrix * mvPosition;

}


//#define STANDARD
//
//uniform sampler2D texturePosition;
//varying float vLife;
//
//varying vec3 vViewPosition;
//
//#ifdef USE_TRANSMISSION
//
//varying vec3 vWorldPosition;
//
//#endif
//
//#include <common>
//#include <batching_pars_vertex>
//#include <uv_pars_vertex>
//#include <displacementmap_pars_vertex>
//#include <color_pars_vertex>
//#include <fog_pars_vertex>
//#include <normal_pars_vertex>
//#include <morphtarget_pars_vertex>
//#include <skinning_pars_vertex>
//#include <shadowmap_pars_vertex>
//#include <logdepthbuf_pars_vertex>
//#include <clipping_planes_pars_vertex>
//
//void main() {
//
//    #include <uv_vertex>
//	#include <color_vertex>
//	#include <morphinstance_vertex>
//	#include <morphcolor_vertex>
//	#include <batching_vertex>
//
//    #include <beginnormal_vertex>
//	#include <morphnormal_vertex>
//	#include <skinbase_vertex>
//	#include <skinnormal_vertex>
//	#include <defaultnormal_vertex>
//	#include <normal_vertex>
//
//    #include <begin_vertex>
//	#include <morphtarget_vertex>
//	#include <skinning_vertex>
//	#include <displacementmap_vertex>
////	#include <project_vertex>
//	#include <logdepthbuf_vertex>
//	#include <clipping_planes_vertex>
//
//        vec4 positionInfo = texture2D(texturePosition, position.xy);
//        vec4 worldPosition = modelMatrix * vec4(positionInfo.xyz, 1.0);
//        vec4 mvPosition = viewMatrix * worldPosition;
//        vLife = positionInfo.w;
//
//        gl_PointSize = 1300.0 / length(mvPosition.xyz) * smoothstep(0.0, 0.2, positionInfo.w);
//        gl_Position = projectionMatrix * mvPosition;
//
//    vViewPosition = - mvPosition.xyz;
//
////    #include <worldpos_vertex>
//	#include <shadowmap_vertex>
//	#include <fog_vertex>
//
//    #ifdef USE_TRANSMISSION
//
//    vWorldPosition = worldPosition.xyz;
//
//    #endif
//}
