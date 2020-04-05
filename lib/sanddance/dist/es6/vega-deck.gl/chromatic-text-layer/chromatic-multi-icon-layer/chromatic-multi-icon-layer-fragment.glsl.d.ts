declare const _default: "#define SHADER_NAME multi-icon-layer-fragment-shader\n\nprecision highp float;\n\nuniform sampler2D iconsTexture;\nuniform float buffer;\nuniform bool sdf;\n\nvarying vec4 vColor;\nvarying vec2 vTextureCoords;\nvarying float vGamma;\nvarying vec4 vHighlightColor;\n\nconst float MIN_ALPHA = 0.05;\n\nvoid main(void) {\n  vec4 texColor = texture2D(iconsTexture, vTextureCoords);\n  \n  float alpha = texColor.a;\n\n  // if enable sdf (signed distance fields)\t\n  if (sdf) {\t\n    float distance = texture2D(iconsTexture, vTextureCoords).a;\t\n    alpha = smoothstep(buffer - vGamma, buffer + vGamma, distance);\t\n  }\n\n  // Take the global opacity and the alpha from vColor into account for the alpha component\n  float a = alpha * vColor.a;\n\n  if (picking_uActive) {\n\n    // use picking color for entire rectangle\n    gl_FragColor = vec4(picking_vRGBcolor_Aselected.rgb, 1.0);\n  \n  } else {\n\n    if (a < MIN_ALPHA) {\n      discard;\n    } else {\n\n      gl_FragColor = vec4(vColor.rgb, a);\n\n      // use highlight color if this fragment belongs to the selected object.\n      bool selected = bool(picking_vRGBcolor_Aselected.a);\n      if (selected) {\n        gl_FragColor = vec4(vHighlightColor.rgb, a);\n      }\n    }\n  }\n}\n";
export default _default;