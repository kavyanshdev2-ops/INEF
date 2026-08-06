import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useScroll } from 'motion/react';

const coverVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const coverFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uDissolve;
  uniform vec2 uCenter;
  uniform float uTime;
  uniform float uGrayscale;
  uniform float uEdgeIntensity;
  uniform float uEdgeBrightness;
  varying vec2 vUv;

  mat3 sobelX = mat3(
    -1.0, 0.0, 1.0,
    -2.0, 0.0, 2.0,
    -1.0, 0.0, 1.0
  );

  mat3 sobelY = mat3(
    -1.0, -2.0, -1.0,
     0.0,  0.0,  0.0,
     1.0,  2.0,  1.0
  );

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

  float sobel(sampler2D tex, vec2 uv, vec2 texelSize) {
    float gx = 0.0;
    float gy = 0.0;

    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 offset = vec2(float(i), float(j)) * texelSize;
        float lum = getLuminance(texture2D(tex, uv + offset).rgb);
        gx += lum * sobelX[i + 1][j + 1];
        gy += lum * sobelY[i + 1][j + 1];
      }
    }

    return sqrt(gx * gx + gy * gy);
  }

  void main() {
    vec2 ratio = vec2(
      min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
      min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );

    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 texColor = texture2D(uTexture, uv);
    
    vec2 center = uCenter;
    vec2 distVec = (vUv - center);
    distVec.x *= uResolution.x / uResolution.y;
    float dist = length(distVec);
    
    float maxDist = length(vec2(
      max(center.x, 1.0 - center.x) * (uResolution.x / uResolution.y),
      max(center.y, 1.0 - center.y)
    ));
    
    float normalizedDist = dist / maxDist;
    
    float noiseVal = hash(vUv * 100.0 + uTime * 0.1) * 0.1;
    float dissolveThreshold = uDissolve + noiseVal * 0.2;
    
    vec2 texelSize = 1.0 / uResolution;
    float edge = sobel(uTexture, uv, texelSize);
    
    float dissolveMask = smoothstep(dissolveThreshold - 0.03, dissolveThreshold, normalizedDist);
    
    vec3 edgeColor = vec3(1.0, 1.0, 1.0);
    
    vec3 baseColor = mix(texColor.rgb, vec3(0.0), uGrayscale);
    vec3 finalColor = baseColor;
    
    float edgeGlowIntensity = uEdgeIntensity * 2.0;
    float edgeGlow = edge * edgeGlowIntensity * (1.0 + uGrayscale * 3.0);
    finalColor += edgeColor * edgeGlow * uEdgeBrightness;
    
    float edgeZoneWidth = 0.15 * (1.0 - uDissolve) + 0.02;
    float edgeZone = smoothstep(dissolveThreshold - edgeZoneWidth, dissolveThreshold - edgeZoneWidth + 0.04, normalizedDist) * 
                     smoothstep(dissolveThreshold + 0.02, dissolveThreshold - 0.02, normalizedDist);
    float sparkle = hash(floor(vUv * uResolution / 4.0)) * edgeZone;
    
    float edgeBrightness = (1.0 - uDissolve) * uEdgeBrightness * (1.0 + uGrayscale * 2.0);
    finalColor += vec3(sparkle * 3.0 * edgeBrightness);
    
    float alpha = dissolveMask * texColor.a;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const coverFragmentShaderReverse = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform float uDissolve;
  uniform vec2 uCenter;
  uniform float uTime;
  uniform float uBrightness;
  uniform float uEdgeIntensity;
  uniform float uDarkness;
  uniform float uGrayscale;
  varying vec2 vUv;

  mat3 sobelX = mat3(
    -1.0, 0.0, 1.0,
    -2.0, 0.0, 2.0,
    -1.0, 0.0, 1.0
  );

  mat3 sobelY = mat3(
    -1.0, -2.0, -1.0,
     0.0,  0.0,  0.0,
     1.0,  2.0,  1.0
  );

  float getLuminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

  float sobel(sampler2D tex, vec2 uv, vec2 texelSize) {
    float gx = 0.0;
    float gy = 0.0;

    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 offset = vec2(float(i), float(j)) * texelSize;
        float lum = getLuminance(texture2D(tex, uv + offset).rgb);
        gx += lum * sobelX[i + 1][j + 1];
        gy += lum * sobelY[i + 1][j + 1];
      }
    }

    return sqrt(gx * gx + gy * gy);
  }

  void main() {
    vec2 ratio = vec2(
      min((uResolution.x / uResolution.y) / (uImageResolution.x / uImageResolution.y), 1.0),
      min((uResolution.y / uResolution.x) / (uImageResolution.y / uImageResolution.x), 1.0)
    );

    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 texColor = texture2D(uTexture, uv);
    
    float gray = getLuminance(texColor.rgb);
    vec3 grayscaleColor = vec3(gray);
    texColor.rgb = mix(texColor.rgb, grayscaleColor, uGrayscale);
    
    vec2 texelSize = 1.0 / uResolution;
    float edge = sobel(uTexture, uv, texelSize);
    
    edge = pow(edge, 0.7) * 2.0;
    edge = clamp(edge, 0.0, 1.0);
    
    vec3 edgeColor = vec3(1.0, 1.0, 1.0);
    
    vec3 darkBase = vec3(0.0);
    vec3 baseColor = mix(texColor.rgb, darkBase, uDarkness);
    
    float edgeGlow = edge * uEdgeIntensity * 2.0;
    baseColor += edgeColor * edgeGlow;
    
    vec3 finalColor = clamp(baseColor, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, texColor.a);
  }
`;

export interface ScrollDissolveRevealProps {
  imageFront: string;
  imageBack: string;
  className?: string;
  containerClassName?: string;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
}

export function ScrollDissolveReveal({
  imageFront,
  imageBack,
  className = '',
  containerClassName = '',
  scrollContainerRef,
}: ScrollDissolveRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
    ...(scrollContainerRef && { container: scrollContainerRef }),
  });

  useEffect(() => {
    const mount = canvasContainerRef.current;
    if (!mount) return;

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    let mat1: THREE.ShaderMaterial | null = null;
    let mat2: THREE.ShaderMaterial | null = null;

    Promise.all([
      new Promise<THREE.Texture>((res) => textureLoader.load(imageFront, res)),
      new Promise<THREE.Texture>((res) => textureLoader.load(imageBack, res)),
    ]).then(([tex1, tex2]) => {
      mat1 = new THREE.ShaderMaterial({
        vertexShader: coverVertexShader,
        fragmentShader: coverFragmentShader,
        transparent: true,
        uniforms: {
          uTexture: { value: tex1 },
          uResolution: { value: new THREE.Vector2(width, height) },
          uImageResolution: { value: new THREE.Vector2((tex1.image as any)?.width || width, (tex1.image as any)?.height || height) },
          uDissolve: { value: 0.0 },
          uCenter: { value: new THREE.Vector2(0.5, 0.5) },
          uTime: { value: 0.0 },
          uGrayscale: { value: 0.0 },
          uEdgeIntensity: { value: 0.0 },
          uEdgeBrightness: { value: 1.0 },
        },
      });

      mat2 = new THREE.ShaderMaterial({
        vertexShader: coverVertexShader,
        fragmentShader: coverFragmentShaderReverse,
        transparent: true,
        uniforms: {
          uTexture: { value: tex2 },
          uResolution: { value: new THREE.Vector2(width, height) },
          uImageResolution: { value: new THREE.Vector2((tex2.image as any)?.width || width, (tex2.image as any)?.height || height) },
          uDissolve: { value: 0.0 },
          uCenter: { value: new THREE.Vector2(0.5, 0.5) },
          uTime: { value: 0.0 },
          uBrightness: { value: 0.0 },
          uEdgeIntensity: { value: 0.6 },
          uDarkness: { value: 1.0 },
          uGrayscale: { value: 1.0 },
        },
      });

      const geom = new THREE.PlaneGeometry(2, 2);
      const mesh2 = new THREE.Mesh(geom, mat2);
      mesh2.position.z = -0.1;
      scene.add(mesh2);

      const mesh1 = new THREE.Mesh(geom, mat1);
      mesh1.position.z = 0;
      scene.add(mesh1);
    });

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const timeInSeconds = clock.getElapsedTime();
      const progress = scrollYProgress.get();

      if (mat1) {
        mat1.uniforms.uTime.value = timeInSeconds;
        mat1.uniforms.uDissolve.value = progress;
        mat1.uniforms.uGrayscale.value = Math.min(1.0, progress / 0.4);
        mat1.uniforms.uEdgeIntensity.value = progress * 0.5;
        mat1.uniforms.uEdgeBrightness.value = 1.0 - progress;
      }

      if (mat2) {
        mat2.uniforms.uTime.value = timeInSeconds;
        const acceleratedProgress = Math.min(1.0, progress * 1.1);
        mat2.uniforms.uEdgeIntensity.value = 0.6 * (1.0 - acceleratedProgress);
        mat2.uniforms.uDarkness.value = 1.0 - acceleratedProgress;
        mat2.uniforms.uGrayscale.value = 1.0 - acceleratedProgress;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      if (mat1) mat1.uniforms.uResolution.value.set(w, h);
      if (mat2) mat2.uniforms.uResolution.value.set(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [imageFront, imageBack, scrollYProgress]);

  return (
    <div
      ref={containerRef}
      className={`relative h-[250vh] w-full ${containerClassName}`}
    >
      <div
        ref={canvasContainerRef}
        className={`sticky top-0 h-screen w-full overflow-hidden ${className}`}
      />
    </div>
  );
}

// Text Scroll Dissolve Reveal Component
import { motion, useTransform, MotionValue } from 'motion/react';

export interface TextScrollDissolveRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
}

const WordItem: React.FC<{
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  wordClassName?: string;
}> = ({ children, progress, range, wordClassName = '' }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  const blur = useTransform(progress, range, [6, 0]);
  const y = useTransform(progress, range, [8, 0]);

  return (
    <span className="relative inline-block mr-[0.25em] whitespace-nowrap my-0.5 select-none">
      <motion.span
        style={{
          opacity,
          filter: useTransform(blur, (v) => `blur(${v}px)`),
          y,
        }}
        className={`inline-block transition-colors duration-200 ${wordClassName}`}
      >
        {children}
      </motion.span>
    </span>
  );
};

export function TextScrollDissolveReveal({
  text,
  className = '',
  wordClassName = '',
}: TextScrollDissolveRevealProps) {
  const textContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: textContainerRef,
    offset: ['start 0.85', 'end 0.35'],
  });

  const words = text.split(' ');

  return (
    <div ref={textContainerRef} className={`relative z-10 flex flex-wrap justify-center ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1.2 / words.length);
        return (
          <WordItem
            key={i}
            progress={scrollYProgress}
            range={[start, end]}
            wordClassName={wordClassName}
          >
            {word}
          </WordItem>
        );
      })}
    </div>
  );
}

