import React, { useRef, Suspense, useMemo } from 'react';
import { SectionBackground } from './SectionBackground';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import {
    DwarfColumn,
    StoneArch,
    BrazierModel,
    AnvilModel,
    FireModel,
    Rock1,
    Rock2
} from './Models';

// 🔥 ANTORCHA DE COLUMNA CON SOPORTE DE HIERRO Y MODELO FIRE.GLB
function ColumnTorch({ position, rotation = [0, 0, 0], color = '#f97316' }) {
    const lightRef = useRef();

    useFrame((state) => {
        const time = state.clock.elapsedTime * 9;
        if (lightRef.current) {
            lightRef.current.intensity = 5.2 + Math.sin(time) * 1.5 + Math.cos(time * 2.3) * 0.8;
        }
    });

    return (
        <group position={position} rotation={rotation}>
            {/* 🛡️ 1. Placa base de hierro montada sobre la columna */}
            <mesh position={[-0.08, -0.2, 0]}>
                <boxGeometry args={[0.08, 0.42, 0.26]} />
                <meshStandardMaterial color="#1a1c23" roughness={0.35} metalness={0.88} />
            </mesh>

            {/* 🔩 2. Remaches / Pernos decorativos de la placa */}
            <mesh position={[-0.03, -0.05, 0.08]}>
                <boxGeometry args={[0.03, 0.04, 0.04]} />
                <meshStandardMaterial color="#111217" roughness={0.3} metalness={0.9} />
            </mesh>
            <mesh position={[-0.03, -0.35, 0.08]}>
                <boxGeometry args={[0.03, 0.04, 0.04]} />
                <meshStandardMaterial color="#111217" roughness={0.3} metalness={0.9} />
            </mesh>
            <mesh position={[-0.03, -0.05, -0.08]}>
                <boxGeometry args={[0.03, 0.04, 0.04]} />
                <meshStandardMaterial color="#111217" roughness={0.3} metalness={0.9} />
            </mesh>
            <mesh position={[-0.03, -0.35, -0.08]}>
                <boxGeometry args={[0.03, 0.04, 0.04]} />
                <meshStandardMaterial color="#111217" roughness={0.3} metalness={0.9} />
            </mesh>

            {/* 🔗 3. Abrazadera / Anillo metálico de sujeción */}
            <mesh position={[-0.02, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.065, 0.065, 0.1, 8]} />
                <meshStandardMaterial color="#14151a" roughness={0.4} metalness={0.85} />
            </mesh>

            {/* 🪵 4. Mango de madera de la antorcha */}
            <mesh position={[0, -0.15, 0]} rotation={[0, 0, -0.35]}>
                <cylinderGeometry args={[0.04, 0.03, 0.65, 6]} />
                <meshStandardMaterial color="#2d1b0e" roughness={0.9} />
            </mesh>

            {/* 👑 5. Copa / Recipiente metálico superior */}
            <mesh position={[0.1, 0.1, 0]}>
                <cylinderGeometry args={[0.09, 0.06, 0.25, 6]} />
                <meshStandardMaterial color="#1c1e24" roughness={0.4} metalness={0.8} />
            </mesh>

            {/* 🔥 6. Fuego 3D */}
            <Suspense fallback={null}>
                <FireModel position={[0.1, 0.28, 0]} scale={0.4} />
            </Suspense>

            {/* 💡 7. Luz puntual parpadeante */}
            <pointLight
                ref={lightRef}
                position={[0.1, 0.35, 0]}
                color={color}
                intensity={5.5}
                distance={14}
                decay={2}
            />
        </group>
    );
}

// 🔥 BRASERO DE PISO COMBINADO CON EL MODELO FIRE.GLB
function FireBrazier({ position, color = '#f97316' }) {
    const lightRef = useRef();

    useFrame((state) => {
        if (lightRef.current) {
            const time = state.clock.elapsedTime * 9;
            lightRef.current.intensity = 5.5 + Math.sin(time) * 1.4 + Math.cos(time * 2.1) * 0.8;
        }
    });

    return (
        <group position={position}>
            <Suspense fallback={null}>
                <BrazierModel position={[0, 0, 0]} scale={0.45} />
                <FireModel position={[0, 0.32, 0]} scale={0.5} />
            </Suspense>

            <pointLight
                ref={lightRef}
                position={[0, 0.5, 0]}
                color={color}
                intensity={5.5}
                distance={16}
                decay={2}
            />
        </group>
    );
}

// 🐍 CAMINO SINUOSO DE PIEDRA ENANA
export function MoriaCurvedPath() {
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.015, 12.0),
            new THREE.Vector3(0, 0.015, 8.0),
            new THREE.Vector3(-0.7, 0.015, 4.0),
            new THREE.Vector3(0.8, 0.015, 0.0),
            new THREE.Vector3(-0.6, 0.015, -4.0),
            new THREE.Vector3(0.5, 0.015, -8.0),
            new THREE.Vector3(0, 0.015, -14.0),
            new THREE.Vector3(0, 0.015, -22.0)
        ]);
    }, []);

    return (
        <mesh position={[0, 0, 0]} scale={[1, 0.006, 1]} receiveShadow>
            <tubeGeometry args={[curve, 180, 1.6, 16, false]} />
            <meshStandardMaterial
                color="#2a303d"
                roughness={0.75}
                metalness={0.25}
            />
        </mesh>
    );
}

// 🌋 RÍO DE MAGMA INCANDESCENTE
function CurvedMagmaFissure() {
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.3, 0.025, 12.0),
            new THREE.Vector3(0.6, 0.025, 6.0),
            new THREE.Vector3(-0.7, 0.025, 0.0),
            new THREE.Vector3(0.8, 0.025, -6.0),
            new THREE.Vector3(-0.4, 0.025, -12.0),
            new THREE.Vector3(0.5, 0.025, -18.0),
            new THREE.Vector3(0.0, 0.025, -24.0)
        ]);
    }, []);

    return (
        <group position={[0, 0, 0]}>
            <mesh scale={[1, 0.006, 1]}>
                <tubeGeometry args={[curve, 180, 1.8, 16, false]} />
                <meshBasicMaterial color="#ff3300" toneMapped={false} />
            </mesh>

            <mesh scale={[1, 0.007, 1]} position={[0, 0.002, 0]}>
                <tubeGeometry args={[curve, 180, 0.8, 16, false]} />
                <meshBasicMaterial color="#ffcc00" toneMapped={false} />
            </mesh>

            <Suspense fallback={null}>
                <Rock1 position={[-1.6, 0, 7]} scale={0.6} rotation={[0, 0.4, 0]} />
                <Rock2 position={[1.7, 0, 5]} scale={0.7} rotation={[0, -0.6, 0]} />
                <Rock1 position={[-1.5, 0, 1]} scale={0.8} rotation={[0, 1.2, 0]} />
                <Rock2 position={[1.8, 0, -3]} scale={0.65} rotation={[0, 0.8, 0]} />
                <Rock1 position={[-1.6, 0, -7]} scale={0.8} rotation={[0, -0.5, 0]} />
                <Rock2 position={[1.5, 0, -11]} scale={0.75} rotation={[0, 1.5, 0]} />
            </Suspense>

            <pointLight position={[-0.2, 0.8, 6]} color="#ff4500" intensity={6.0} distance={16} decay={2} />
            <pointLight position={[0.3, 0.8, 0]} color="#ff5500" intensity={6.5} distance={16} decay={2} />
            <pointLight position={[-0.1, 0.8, -7]} color="#ff4500" intensity={6.0} distance={16} decay={2} />
        </group>
    );
}

export function MoriaSection() {
    const scroll = useScroll();
    const groupRef = useRef();

    useFrame(() => {
        if (!scroll) return;
        // Moria solo se muestra entre 30% y 62% del scroll
        const isNearMoria = scroll.offset >= 0.30 && scroll.offset <= 0.62;
        if (groupRef.current) {
            groupRef.current.visible = isNearMoria;
        }
    });

    return (
        <group ref={groupRef} position={[-14, 0, -50]} name="moria-biome">
            {/* 🖼️ FONDO DE MORIA */}
            <Suspense fallback={null}>
                <SectionBackground
                    path="/backgrounds/moria.jpg"
                    position={[0, 10, -23]}
                    scale={[60, 35, 1]}
                />
            </Suspense>
            {/* Suelo base de piedra oscura */}
            <mesh position={[0, 0.005, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[30, 42]} />
                <meshStandardMaterial color="#141720" roughness={0.9} metalness={0.15} />
            </mesh>

            {/* Pared posterior ajustada para no cruzarse en el centro del escenario */}
            <mesh position={[-3, 10, -22]}>
                <boxGeometry args={[24, 24, 2]} />
                <meshStandardMaterial color="#0e1117" roughness={0.9} />
            </mesh>

            <MoriaCurvedPath />
            <CurvedMagmaFissure />

            {/* Iluminación ambiental */}
            <pointLight position={[0, 7, -2]} color="#fb923c" intensity={6.0} distance={28} decay={2} />
            <pointLight position={[0, 6, -10]} color="#f97316" intensity={5.5} distance={26} decay={2} />
            <pointLight position={[0, 3, 5]} color="#fdba74" intensity={4.5} distance={20} decay={2} />

            {/* Portal de la Mina */}
            <Suspense fallback={null}>
                <StoneArch position={[0, 0, 9]} scale={1.4} rotation={[0, 0, 0]} />
            </Suspense>

            {/* 🏛️ COLUMNAS ENANAS CON ANTORCHAS MONTADAS */}
            <Suspense fallback={null}>
                {/* Lado Izquierdo */}
                <DwarfColumn position={[-5.2, 0, 6.2]} scale={1.15} rotation={[0, 0.1, 0]} />
                <ColumnTorch position={[-4.3, 2.6, 6.2]} color="#f97316" />

                <DwarfColumn position={[-4.9, 0, 0.8]} scale={1.2} rotation={[0, -0.15, 0]} />
                <ColumnTorch position={[-4.0, 2.6, 0.8]} color="#ea580c" />

                <DwarfColumn position={[-5.4, 0, -4.8]} scale={1.1} rotation={[0, 0.25, 0]} />
                <ColumnTorch position={[-4.5, 2.6, -4.8]} color="#ea580c" />

                <DwarfColumn position={[-5.0, 0, -10.5]} scale={1.25} rotation={[0, -0.05, 0]} />
                <ColumnTorch position={[-4.1, 2.6, -10.5]} color="#f97316" />

                <DwarfColumn position={[-5.3, 0, -16.2]} scale={1.18} rotation={[0, 0.12, 0]} />
                <ColumnTorch position={[-4.4, 2.6, -16.2]} color="#ea580c" />

                {/* Lado Derecho (Espejado en Y) */}
                <DwarfColumn position={[5.1, 0, 5.8]} scale={1.2} rotation={[0, -0.2, 0]} />
                <ColumnTorch position={[4.3, 2.6, 5.8]} rotation={[0, Math.PI, 0]} color="#f97316" />

                <DwarfColumn position={[5.4, 0, 0.2]} scale={1.15} rotation={[0, 0.1, 0]} />
                <ColumnTorch position={[4.5, 2.6, 0.2]} rotation={[0, Math.PI, 0]} color="#ea580c" />

                <DwarfColumn position={[4.8, 0, -5.3]} scale={1.25} rotation={[0, -0.1, 0]} />
                <ColumnTorch position={[3.9, 2.6, -5.3]} rotation={[0, Math.PI, 0]} color="#ea580c" />

                <DwarfColumn position={[5.3, 0, -10.9]} scale={1.12} rotation={[0, 0.2, 0]} />
                <ColumnTorch position={[4.4, 2.6, -10.9]} rotation={[0, Math.PI, 0]} color="#f97316" />

                <DwarfColumn position={[4.9, 0, -15.8]} scale={1.22} rotation={[0, -0.15, 0]} />
                <ColumnTorch position={[4.0, 2.6, -15.8]} rotation={[0, Math.PI, 0]} color="#ea580c" />

                <AnvilModel position={[-3.2, 0, 2]} scale={0.7} rotation={[0, 0.4, 0]} />
            </Suspense>

            {/* Braseros */}
            <FireBrazier position={[-3.6, 0, 4.5]} color="#f97316" />
            <FireBrazier position={[3.6, 0, 4.5]} color="#f97316" />
            <FireBrazier position={[-3.6, 0, -9.5]} color="#ea580c" />
            <FireBrazier position={[3.6, 0, -9.5]} color="#ea580c" />

            {/* Rocas */}
            <Suspense fallback={null}>
                <Rock1 position={[-2.4, 0, 7.5]} scale={0.9} rotation={[0.4, 0.2, 0]} />
                <Rock2 position={[2.8, 0, -1.5]} scale={1.0} rotation={[-0.2, 1.1, 0.3]} />
                <Rock1 position={[-2.8, 0, -9.2]} scale={1.1} rotation={[0, 1.8, 0]} />
                <Rock2 position={[2.6, 0, -14.5]} scale={0.9} rotation={[0.5, -0.4, 0]} />
            </Suspense>
        </group>
    );
}