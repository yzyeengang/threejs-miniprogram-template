//#include <common>
//#include <packing>
//#include <lights_pars_begin>
//#include <logdepthbuf_pars_fragment>
//#include <shadowmap_pars_fragment>
//#include <shadowmask_pars_fragment>

varying float vLife;
uniform vec3 color1;
uniform vec3 color2;

void main() {
//    #include <logdepthbuf_fragment>

    vec3 outgoingLight = mix(color2, color1, smoothstep(0.0, 0.7, vLife));

//    outgoingLight *= vec3( 1.0 - getShadowMask() );
gl_FragColor = vec4( outgoingLight, 1.0 );

//    #include <tonemapping_fragment>
//	#include <colorspace_fragment>
//	#include <fog_fragment>
}


//varying float vLife;
//uniform vec3 color1;
//uniform vec3 color2;
//
//#define STANDARD
//
//#ifdef PHYSICAL
//	#define IOR
//	#define USE_SPECULAR
//#endif
//
////uniform vec3 diffuse;
//uniform vec3 emissive;
//uniform float roughness;
//uniform float metalness;
//uniform float opacity;
//
//#ifdef IOR
//	uniform float ior;
//#endif
//
//#ifdef USE_SPECULAR
//	uniform float specularIntensity;
//uniform vec3 specularColor;
//
//#ifdef USE_SPECULAR_COLORMAP
//		uniform sampler2D specularColorMap;
//#endif
//
//#ifdef USE_SPECULAR_INTENSITYMAP
//		uniform sampler2D specularIntensityMap;
//#endif
//#endif
//
//#ifdef USE_CLEARCOAT
//	uniform float clearcoat;
//uniform float clearcoatRoughness;
//#endif
//
//#ifdef USE_DISPERSION
//	uniform float dispersion;
//#endif
//
//#ifdef USE_IRIDESCENCE
//	uniform float iridescence;
//uniform float iridescenceIOR;
//uniform float iridescenceThicknessMinimum;
//uniform float iridescenceThicknessMaximum;
//#endif
//
//#ifdef USE_SHEEN
//	uniform vec3 sheenColor;
//uniform float sheenRoughness;
//
//#ifdef USE_SHEEN_COLORMAP
//		uniform sampler2D sheenColorMap;
//#endif
//
//#ifdef USE_SHEEN_ROUGHNESSMAP
//		uniform sampler2D sheenRoughnessMap;
//#endif
//#endif
//
//#ifdef USE_ANISOTROPY
//	uniform vec2 anisotropyVector;
//
//#ifdef USE_ANISOTROPYMAP
//		uniform sampler2D anisotropyMap;
//#endif
//#endif
//
//varying vec3 vViewPosition;
//
//#include <common>
//#include <packing>
//#include <dithering_pars_fragment>
//#include <color_pars_fragment>
//#include <uv_pars_fragment>
//#include <map_pars_fragment>
//#include <alphamap_pars_fragment>
//#include <alphatest_pars_fragment>
//#include <alphahash_pars_fragment>
//#include <aomap_pars_fragment>
//#include <lightmap_pars_fragment>
//#include <emissivemap_pars_fragment>
//#include <iridescence_fragment>
//#include <cube_uv_reflection_fragment>
//#include <envmap_common_pars_fragment>
//#include <envmap_physical_pars_fragment>
//#include <fog_pars_fragment>
//#include <lights_pars_begin>
//#include <normal_pars_fragment>
//#include <lights_physical_pars_fragment>
//#include <transmission_pars_fragment>
//#include <shadowmap_pars_fragment>
//#include <bumpmap_pars_fragment>
//#include <normalmap_pars_fragment>
//#include <clearcoat_pars_fragment>
//#include <iridescence_pars_fragment>
//#include <roughnessmap_pars_fragment>
//#include <metalnessmap_pars_fragment>
//#include <logdepthbuf_pars_fragment>
//#include <clipping_planes_pars_fragment>
//
//void main() {
//
//    vec3 diffuse = mix(color2, color1, smoothstep(0.0, 0.7, vLife));
//    vec4 diffuseColor = vec4( diffuse, opacity );
//    #include <clipping_planes_fragment>
//
//    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
//    vec3 totalEmissiveRadiance = emissive;
//
//    #include <logdepthbuf_fragment>
//	#include <map_fragment>
//	#include <color_fragment>
//	#include <alphamap_fragment>
//	#include <alphatest_fragment>
//	#include <alphahash_fragment>
//	#include <roughnessmap_fragment>
//	#include <metalnessmap_fragment>
//	#include <normal_fragment_begin>
//	#include <normal_fragment_maps>
//	#include <clearcoat_normal_fragment_begin>
//	#include <clearcoat_normal_fragment_maps>
//	#include <emissivemap_fragment>
//
//    // accumulation
//    #include <lights_physical_fragment>
//	#include <lights_fragment_begin>
//	#include <lights_fragment_maps>
//	#include <lights_fragment_end>
//
//    // modulation
//    #include <aomap_fragment>
//
//    vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
//    vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
//
//    #include <transmission_fragment>
//
//    vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
//
//
//    gl_FragColor = vec4( diffuse, 1.0 );
////    #include <opaque_fragment>
//	#include <tonemapping_fragment>
//	#include <colorspace_fragment>
//	#include <fog_fragment>
//	#include <premultiplied_alpha_fragment>
//	#include <dithering_fragment>
//
//}

