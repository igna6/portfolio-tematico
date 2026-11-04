import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, useScroll } from '@react-three/drei';
import { SectionBackground } from './SectionBackground';
import {
    PineTree,
    PineCluster,
    Rock1,
    Rock2,
    StoneArch,
    FallenLog,
    GlowingMushrooms
} from './Models';

export function ForestSection() {
    const scroll = useScroll();
    const groupRef = useRef();

    useFrame(() => {
        if (!scroll) return;
        // El bosque solo debe verse durante el Capítulo II (0.24 a 0.52)
        const isNearForest = scroll.offset >= 0.24 && scroll.offset <= 0.52;
        if (groupRef.current) {
            groupRef.current.visible = isNearForest;
        }
    });

    return (
        <group ref={groupRef} position={[18, 0, -25]} name="forest-biome">
            {/* 🌲 DOMO PANORÁMICO 360° DEL BOSQUE */}
            <Suspense fallback={null}>
                <SectionBackground
                    path="/backgrounds/bosque.jpg"
                    radius={50}
                    position={[0, 0, 0]}
                    rotation={[0, -Math.PI / 2, 0]}
                />
            </Suspense>

            {/* Iluminación mágica verde esmeralda con buen alcance */}
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

            {/* Suelo del claro de bosque */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <circleGeometry args={[16, 32]} />
                <meshStandardMaterial color="#0a1f14" roughness={0.9} />
            </mesh>

            {/* Portal ancestral de piedra ruina */}
            <Suspense fallback={null}>
                <StoneArch position={[0, 0, -3.5]} scale={1.3} rotation={[0, 0.1, 0]} />
            </Suspense>

            {/* Cristal Flotante de Conocimiento (sutil y elegante en el centro del arco) */}
            <Float speed={2.5} rotationIntensity={1.8} floatIntensity={1.5}>
                <mesh position={[0, 3.0, -3.5]} castShadow>
                    <octahedronGeometry args={[0.85, 0]} />
                    <meshStandardMaterial
                        color="#6ee7b7"
                        emissive="#10b981"
                        emissiveIntensity={2.5}
                        roughness={0.1}
                        metalness={0.8}
                    />
                </mesh>
            </Float>

            {/* Tronco caído */}
            <Suspense fallback={null}>
                <FallenLog position={[-2.8, 0, 1.2]} scale={1.3} rotation={[0, 0.7, 0]} />
            </Suspense>

            {/* 🍄 BOSQUE DE HONGOS BIOLUMINISCENTES (Abundantes por todo el claro) */}
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

            {/* Luz mágica emanando de las colonias de hongos */}
            <pointLight position={[-2.2, 0.6, -2.5]} color="#34d399" intensity={2.5} distance={7} decay={2} />
            <pointLight position={[2.4, 0.6, -2.2]} color="#6ee7b7" intensity={2.5} distance={7} decay={2} />
            <pointLight position={[0.5, 0.6, 2.5]} color="#34d399" intensity={2.0} distance={6} decay={2} />

            {/* Partículas esmeralda flotantes */}
            <Sparkles count={180} scale={[18, 14, 18]} size={4.0} speed={0.5} color="#34d399" />

            {/* 🌲 ARBOLEDA DENSA DE PINOS (Múltiples pinos rodeando el claro) */}
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

                {/* Fondo detrás del portal - Muralla impenetrable de árboles densos */}
                <PineCluster position={[0.0, 0, -9.5]} scale={2.5} />
                <PineCluster position={[-4.5, 0, -8.5]} scale={2.2} />
                <PineCluster position={[4.5, 0, -8.5]} scale={2.2} />
                <PineCluster position={[-7.5, 0, -6.5]} scale={2.0} />
                <PineCluster position={[7.5, 0, -6.5]} scale={2.0} />

                <PineTree position={[-2.5, 0, -7.0]} scale={1.8} />
                <PineTree position={[2.5, 0, -7.0]} scale={1.8} />
                <PineTree position={[0.0, 0, -7.5]} scale={2.0} />

                {/* Pared oscura de fondo para no dejar escapar luz ni vacío */}
                <mesh position={[0, 4, -11]}>
                    <planeGeometry args={[50, 18]} />
                    <meshBasicMaterial color="#040d08" fog={false} />
                </mesh>

                <Rock1 position={[-3.5, 0, 2.5]} scale={1.1} rotation={[0, 0.5, 0]} />
                <Rock2 position={[3.5, 0, 2.0]} scale={1.2} rotation={[0, -0.7, 0]} />
            </Suspense>
        </group>
    );
}
