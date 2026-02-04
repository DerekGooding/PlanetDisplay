
uniform sampler2D map;
uniform float scanProgress;
uniform vec3 scanLineColor;
uniform bool isScanning;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(map, vUv);

  if (isScanning) {
    // Grid effect
    float gridX = mod(vUv.x * 30.0, 1.0);
    float gridY = mod(vUv.y * 30.0, 1.0);
    float grid = (step(0.98, gridX) + step(0.98, gridY));

    // Sweeping scan line effect
    float scanLineWidth = 0.02;
    float scanLineFeather = 0.05;
    float scanLine = smoothstep(scanProgress - scanLineWidth - scanLineFeather, scanProgress - scanLineWidth, vUv.y) -
                     smoothstep(scanProgress + scanLineFeather, scanProgress + scanLineWidth + scanLineFeather, vUv.y);
    scanLine = abs(scanLine);

    vec3 finalColor = mix(texColor.rgb, scanLineColor, grid * 0.4); // Blend grid with texture
    finalColor = mix(finalColor, scanLineColor, scanLine * 0.8); // Blend scan line

    gl_FragColor = vec4(finalColor, texColor.a);
  } else {
    gl_FragColor = texColor;
  }
}
