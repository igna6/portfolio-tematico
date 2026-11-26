import React, { useRef, Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Sparkles, useScroll, Cloud } from '@react-three/drei';
import { createForestFloorTextures } from './ProceduralTextures';
import {
    PineTree,
    Rock1,
    Rock2,
    StoneArch,
    FallenLog,
    GlowingMushrooms,
    GrassPatch,
    HobbitCharacter
} from './Models';

const PORTAL_VERTEX_SHADER = /* glsl */ `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const PORTAL_FRAGMENT_SHADER = /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;

    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
        );
    }

    float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
            v += a * noise(p);
            p *= 2.05;
            a *= 0.5;
        }
        return v;
    }

    void main() {
        vec2 centered = (vUv - 0.5) * 2.0;
        float dist = length(centered * vec2(1.15, 0.85));
        float angle = atan(centered.y, centered.x);

        // Remolino suave de niebla mística esmeralda
        float swirl = fbm(vec2(dist * 3.2 - uTime * 0.35, angle * 1.5 + dist * 2.0 - uTime * 0.2));
        float veil = fbm(vUv * 4.5 + vec2(0.0, -uTime * 0.25));

        float alpha = (1.0 - smoothstep(0.35, 0.96, dist)) * (0.35 + 0.55 * swirl);
        vec3 deepEmerald = vec3(0.04, 0.38, 0.25);
        vec3 brightMint  = vec3(0.32, 0.95, 0.72);
        vec3 col = mix(deepEmerald, brightMint, smoothstep(0.3, 0.82, swirl * 0.7 + veil * 0.4));

        gl_FragColor = vec4(col * 1.15, clamp(alpha, 0.0, 0.82));
    }
`;

// 🌀 Velo místico etéreo dentro del arco de piedra (sin rombos ni conos)
function ForestPortalVeil() {
    const matRef = useRef();
    const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

    useFrame((_, delta) => {
        if (matRef.current) {
            matRef.current.uniforms.uTime.value += delta;
        }
    });

    return (
        <mesh position={[0, 2.3, -3.5]} rotation={[0, 0.1, 0]}>
            <planeGeometry args={[2.5, 4.0, 1, 1]} />
            <shaderMaterial
                ref={matRef}
                vertexShader={PORTAL_VERTEX_SHADER}
                fragmentShader={PORTAL_FRAGMENT_SHADER}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                toneMapped={false}
            />
        </mesh>
    );
}

export function ForestSection() {
    const scroll = useScroll();
    const groupRef = useRef();
    const forestTextures = useMemo(() => createForestFloorTextures(14, 14), []);

    useFrame(() => {
        if (!scroll) return;
        // El bosque es exclusivamente visible entre los cortes negros de Cap I y Cap II
        const isNearForest = scroll.offset >= 0.350 && scroll.offset < 0.600;
        if (groupRef.current) {
            groupRef.current.visible = isNearForest;
        }
    });

    return (
        <group ref={groupRef} position={[18, 0, -25]} name="forest-biome">
            {/* Iluminación mágica verde esmeralda */}
            <pointLight
                position={[0, 4.5, 0]}
                intensity={9.0}
                distance={28}
                color="#10b981"
                decay={2}
                castShadow
            />
            <pointLight
                position={[-3, 2.0, 3]}
                intensity={4.5}
                distance={16}
                color="#34d399"
                decay={2}
            />
            <spotLight
                position={[0, 12, 1]}
                angle={0.55}
                penumbra={0.8}
                intensity={10}
                distance={26}
                color="#6ee7b7"
            />

            {/* Suelo amplio texturado con musgo y hojas caídas */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <circleGeometry args={[48, 64]} />
                <meshStandardMaterial
                    map={forestTextures.map}
                    bumpMap={forestTextures.bumpMap}
                    bumpScale={0.08}
                    roughness={0.94}
                />
            </mesh>

            {/* Lomas bajas perimetrales cubiertas de musgo para cerrar el horizonte */}
            <mesh position={[-15, -1.6, -12]} scale={[1.5, 0.3, 1.3]} receiveShadow>
                <sphereGeometry args={[10, 20, 14]} />
                <meshStandardMaterial map={forestTextures.map} roughness={0.96} />
            </mesh>
            <mesh position={[15, -1.6, -12]} scale={[1.5, 0.3, 1.3]} receiveShadow>
                <sphereGeometry args={[10, 20, 14]} />
                <meshStandardMaterial map={forestTextures.map} roughness={0.96} />
            </mesh>
            <mesh position={[0, -2.0, -19]} scale={[2.2, 0.34, 1.2]} receiveShadow>
                <sphereGeometry args={[12, 20, 14]} />
                <meshStandardMaterial map={forestTextures.map} roughness={0.96} />
            </mesh>

            {/* Portal ancestral de piedra ruina */}
            <Suspense fallback={null}>
                <StoneArch position={[0, 0, -3.5]} scale={1.3} rotation={[0, 0.1, 0]} />
            </Suspense>

            {/* Velo místico dentro del portal antiguo (sin rombo ni cono de luz) */}
            <ForestPortalVeil />
            <pointLight position={[0, 2.4, -3.2]} color="#34d399" intensity={4.0} distance={10} decay={2} />

            {/* Bruma esmeralda baja entre los árboles */}
            <Cloud
                position={[0, 1.1, -6]}
                opacity={0.16}
                speed={0.15}
                width={18}
                depth={8}
                segments={12}
                color="#065f46"
            />

            {/* Tronco caído + Hobbit sentado */}
            <Suspense fallback={null}>
                <FallenLog position={[-2.8, 0, 1.2]} scale={1.3} rotation={[0, 0.7, 0]} />

                {/* 🧙 HOBBIT SOBRE EL TRONCO */}
                <HobbitCharacter
                    position={[-2.8, 0.45, 1.2]}
                    scale={0.75}
                    rotation={[0, 1.2, 0]}
                />
            </Suspense>

            {/* 🍄 HONGOS BIOLUMINISCENTES */}
            <Suspense fallback={null}>
                <GlowingMushrooms position={[-2.2, 0, -2.5]} scale={1.1} rotation={[0, 0.5, 0]} />
                <GlowingMushrooms position={[2.4, 0, -2.2]} scale={1.2} rotation={[0, -0.8, 0]} />
                <GlowingMushrooms position={[-1.5, 0, 0.5]} scale={1.0} rotation={[0, 1.2, 0]} />
                <GlowingMushrooms position={[1.8, 0, 1.0]} scale={1.1} rotation={[0, -0.3, 0]} />
                <GlowingMushrooms position={[-3.2, 0, -0.8]} scale={0.9} rotation={[0, 0.9, 0]} />
                <GlowingMushrooms position={[3.0, 0, -0.5]} scale={1.05} rotation={[0, -1.1, 0]} />
                <GlowingMushrooms position={[0.5, 0, 2.5]} scale={0.95} rotation={[0, 2.0, 0]} />
                <GlowingMushrooms position={[-2.0, 0, 2.8]} scale={1.0} rotation={[0, -0.5, 0]} />
            </Suspense>

            {/* Luces mágicas de los hongos */}
            <pointLight position={[-2.2, 0.6, -2.5]} color="#34d399" intensity={2.5} distance={7} decay={2} />
            <pointLight position={[2.4, 0.6, -2.2]} color="#6ee7b7" intensity={2.5} distance={7} decay={2} />
            <pointLight position={[0.5, 0.6, 2.5]} color="#34d399" intensity={2.0} distance={6} decay={2} />

            {/* Partículas esmeralda flotantes */}
            <Sparkles count={180} scale={[18, 14, 18]} size={4.0} speed={0.5} color="#34d399" />

            {/* 🌲 ARBOLEDA DENSA DE PINOS */}
            <Suspense fallback={null}>
                <PineTree position={[-6.0, 0, -5.0]} scale={1.4} />
                <PineTree position={[-7.5, 0, -2.0]} scale={1.6} />
                <PineTree position={[-8.5, 0, 1.5]} scale={1.5} />
                <PineTree position={[-6.5, 0, 4.5]} scale={1.3} />
                <PineTree position={[-4.5, 0, 6.0]} scale={1.2} />

                <PineTree position={[6.0, 0, -5.0]} scale={1.35} />
                <PineTree position={[7.8, 0, -2.5]} scale={1.55} />
                <PineTree position={[8.5, 0, 2.0]} scale={1.65} />
                <PineTree position={[6.8, 0, 4.8]} scale={1.3} />
                <PineTree position={[4.5, 0, 6.2]} scale={1.25} />

                {/* Bosque denso de pinos reales al fondo (sin PineCluster cónicos) */}
                <PineTree position={[-4.8, 0, -8.5]} scale={1.55} rotation={[0, 0.4, 0]} />
                <PineTree position={[4.8, 0, -8.5]} scale={1.6} rotation={[0, -0.5, 0]} />
                <PineTree position={[-2.2, 0, -10.5]} scale={1.75} rotation={[0, 1.1, 0]} />
                <PineTree position={[2.4, 0, -10.8]} scale={1.7} rotation={[0, -0.9, 0]} />
                <PineTree position={[0.0, 0, -13.5]} scale={1.85} rotation={[0, 0.2, 0]} />
                <PineTree position={[-6.5, 0, -12.0]} scale={1.8} rotation={[0, 2.0, 0]} />
                <PineTree position={[6.5, 0, -12.0]} scale={1.8} rotation={[0, -1.6, 0]} />
                <PineTree position={[-3.5, 0, -15.5]} scale={1.9} rotation={[0, 0.7, 0]} />
                <PineTree position={[3.8, 0, -15.5]} scale={1.9} rotation={[0, -0.3, 0]} />

                {/* Detalles de vegetación y rocas en el claro */}
                <GrassPatch position={[-1.4, 0, -1.2]} scale={0.9} rotation={[0, 0.4, 0]} />
                <GrassPatch position={[1.5, 0, -1.0]} scale={0.85} rotation={[0, 1.7, 0]} />
                <GrassPatch position={[-3.8, 0, 0.2]} scale={1.0} rotation={[0, -0.6, 0]} />
                <Rock1 position={[-3.5, 0, 2.5]} scale={1.1} rotation={[0, 0.5, 0]} />
                <Rock2 position={[3.5, 0, 2.0]} scale={1.2} rotation={[0, -0.7, 0]} />
            </Suspense>
        </group>
    );
}