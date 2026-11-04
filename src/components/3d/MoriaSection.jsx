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

// 🔥 ANTORCHA DE COLUMNA CON PARPADEO DE FUEGO REFORZADO
function ColumnTorch({ position, rotation = [0, 0, 0], color = '#f97316' }) {
    const lightRef = useRef();

    useFrame((state) => {
        const time = state.clock.elapsedTime * 10;
        if (lightRef.current) {
            lightRef.current.intensity = 6.0 + Math.sin(time) * 1.8 + Math.cos(time * 2.7) * 1.1;
        }
    });

    return (
        <group position={position} rotation={rotation}>
            {/* Placa base de hierro */}
            <mesh position={[-0.08, -0.2, 0]}>
                <boxGeometry args={[0.08, 0.42, 0.26]} />
                <meshStandardMaterial color="#1a1c23" roughness={0.35} metalness={0.88} />
            </mesh>

            {/* Pernos decorativos */}
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

            {/* Anillo de sujeción */}
            <mesh position={[-0.02, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.065, 0.065, 0.1, 8]} />
                <meshStandardMaterial color="#14151a" roughness={0.4} metalness={0.85} />
            </mesh>

            {/* Mango de madera */}
            <mesh position={[0, -0.15, 0]} rotation={[0, 0, -0.35]}>
                <cylinderGeometry args={[0.04, 0.03, 0.65, 6]} />
                <meshStandardMaterial color="#2d1b0e" roughness={0.9} />
            </mesh>

            {/* Copa metálica */}
            <mesh position={[0.1, 0.1, 0]}>
                <cylinderGeometry args={[0.09, 0.06, 0.25, 6]} />
                <meshStandardMaterial color="#1c1e24" roughness={0.4} metalness={0.8} />
            </mesh>

            {/* Fuego 3D */}
            <Suspense fallback={null}>
                <FireModel position={[0.1, 0.28, 0]} scale={0.4} />
            </Suspense>

            {/* Luz puntual parpadeante */}
            <pointLight
                ref={lightRef}
                position={[0.1, 0.35, 0]}
                color={color}
                intensity={6.0}
                distance={15}
                decay={2}
            />
        </group>
    );
}

// 🔥 BRASERO DE PISO CON PARPADEO
function FireBrazier({ position, color = '#f97316' }) {
    const lightRef = useRef();

    useFrame((state) => {
        if (lightRef.current) {
            const time = state.clock.elapsedTime * 9.5;
            lightRef.current.intensity = 6.2 + Math.sin(time) * 1.6 + Math.cos(time * 2.3) * 0.9;
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
                intensity={6.0}
                distance={16}
                decay={2}
            />
        </group>
    );
}

// 🐍 CAMINO DE PIEDRA ENANA
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

// 🌋 RÍO DE MAGMA CON CHISPAS REALISTAS (MÁS PEQUEÑAS, BAJAS Y MENOS CANTIDAD)
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

    const emberCount = 75;  // Cantidad moderada de chispas
    const maxHeight = 2.6;   // Altura máxima reducida para no invadir la interfaz

    // 1. Inicializar las chispas alineadas ceñidamente al magma
    const { emberPositions, emberColors, baseCoords, speeds, phases } = useMemo(() => {
        const pos = new Float32Array(emberCount * 3);
        const col = new Float32Array(emberCount * 3);
        const base = new Float32Array(emberCount * 2);
        const spd = new Float32Array(emberCount);
        const phs = new Float32Array(emberCount);

        for (let i = 0; i < emberCount; i++) {
            const t = Math.random();
            const point = curve.getPoint(t);

            // Origen estrecho sobre la trayectoria de la lava
            const bx = point.x + (Math.random() - 0.5) * 0.8;
            const bz = point.z + (Math.random() - 0.5) * 0.8;
            const y = Math.random() * maxHeight;

            base[i * 2] = bx;
            base[i * 2 + 1] = bz;

            pos[i * 3] = bx;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = bz;

            spd[i] = 0.004 + Math.random() * 0.008;
            phs[i] = Math.random() * Math.PI * 2;

            col[i * 3] = 1.0;
            col[i * 3 + 1] = 0.55;
            col[i * 3 + 2] = 0.08;
        }
        return {
            emberPositions: pos,
            emberColors: col,
            baseCoords: base,
            speeds: spd,
            phases: phs
        };
    }, [curve]);

    // 2. Animación con apagado rápido antes de subir demasiado
    const pointsRef = useRef();
    useFrame((state) => {
        if (!pointsRef.current) return;
        const time = state.clock.elapsedTime;
        const pos = pointsRef.current.geometry.attributes.position.array;
        const col = pointsRef.current.geometry.attributes.color.array;

        for (let i = 0; i < emberCount; i++) {
            pos[i * 3 + 1] += speeds[i];
            const currentY = pos[i * 3 + 1];

            const bx = baseCoords[i * 2];
            const bz = baseCoords[i * 2 + 1];
            pos[i * 3] = bx + Math.sin(time * 2.5 + phases[i]) * 0.15;
            pos[i * 3 + 2] = bz + Math.cos(time * 2.0 + phases[i]) * 0.15;

            // Fade out acentuado (se disuelven velozmente al elevarse)
            const progress = currentY / maxHeight;
            const fade = Math.max(0.0, 1.0 - Math.pow(progress, 1.8));

            col[i * 3] = 1.0 * fade;
            col[i * 3 + 1] = 0.55 * fade;
            col[i * 3 + 2] = 0.08 * fade;

            if (currentY > maxHeight) {
                const t = Math.random();
                const newPoint = curve.getPoint(t);
                const newBx = newPoint.x + (Math.random() - 0.5) * 0.8;
                const newBz = newPoint.z + (Math.random() - 0.5) * 0.8;

                baseCoords[i * 2] = newBx;
                baseCoords[i * 2 + 1] = newBz;

                pos[i * 3] = newBx;
                pos[i * 3 + 1] = 0.03;
                pos[i * 3 + 2] = newBz;
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.geometry.attributes.color.needsUpdate = true;
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Capa exterior de magma rojizo */}
            <mesh scale={[1, 0.006, 1]}>
                <tubeGeometry args={[curve, 180, 1.8, 16, false]} />
                <meshBasicMaterial color="#ff2a00" toneMapped={false} />
            </mesh>

            {/* Núcleo amarillo incandescente */}
            <mesh scale={[1, 0.007, 1]} position={[0, 0.002, 0]}>
                <tubeGeometry args={[curve, 180, 0.8, 16, false]} />
                <meshBasicMaterial color="#ffcc00" toneMapped={false} />
            </mesh>

            {/* ✨ CHISPAS FINAS Y DE TAMAÑO REDUCIDO */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={emberCount}
                        array={emberPositions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={emberCount}
                        array={emberColors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    vertexColors={true}
                    transparent={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            <Suspense fallback={null}>
                <Rock1 position={[-1.6, 0, 7]} scale={0.6} rotation={[0, 0.4, 0]} />
                <Rock2 position={[1.7, 0, 5]} scale={0.7} rotation={[0, -0.6, 0]} />
                <Rock1 position={[-1.5, 0, 1]} scale={0.8} rotation={[0, 1.2, 0]} />
                <Rock2 position={[1.8, 0, -3]} scale={0.65} rotation={[0, 0.8, 0]} />
                <Rock1 position={[-1.6, 0, -7]} scale={0.8} rotation={[0, -0.5, 0]} />
                <Rock2 position={[1.5, 0, -11]} scale={0.75} rotation={[0, 1.5, 0]} />
            </Suspense>

            {/* Luces de la lava proyectadas hacia la caverna */}
            <pointLight position={[-0.2, 0.4, 6]} color="#ff4500" intensity={7.0} distance={18} decay={2} />
            <pointLight position={[0.3, 0.4, 0]} color="#ff5500" intensity={7.5} distance={18} decay={2} />
            <pointLight position={[-0.1, 0.4, -7]} color="#ff4500" intensity={7.0} distance={18} decay={2} />
        </group>
    );
}

export function MoriaSection() {
    const scroll = useScroll();
    const groupRef = useRef();

    useFrame(() => {
        if (!scroll) return;
        const isNearMoria = scroll.offset >= 0.48 && scroll.offset <= 0.74;
        if (groupRef.current) {
            groupRef.current.visible = isNearMoria;
        }
    });

    return (
        <group ref={groupRef} position={[-14, 0, -50]} name="moria-biome">
            {/* DOMO PANORÁMICO 360° */}
            <Suspense fallback={null}>
                <SectionBackground
                    path="/backgrounds/moria.jpg"
                    radius={50}
                    position={[0, 0, -5]}
                    rotation={[0, -Math.PI / 2, 0]}
                />
            </Suspense>

            {/* Suelo base */}
            <mesh position={[0, 0.005, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[30, 42]} />
                <meshStandardMaterial color="#141720" roughness={0.9} metalness={0.15} />
            </mesh>

            {/* Paredes posteriores y laterales */}
            <mesh position={[0, 10, -22]}>
                <boxGeometry args={[45, 26, 3]} />
                <meshStandardMaterial color="#0b0d12" roughness={0.95} />
            </mesh>
            <mesh position={[-14, 10, -5]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[40, 26, 2]} />
                <meshStandardMaterial color="#0b0d12" roughness={0.95} />
            </mesh>
            <mesh position={[14, 10, -5]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[40, 26, 2]} />
                <meshStandardMaterial color="#0b0d12" roughness={0.95} />
            </mesh>

            <MoriaCurvedPath />
            <CurvedMagmaFissure />

            {/* Luces ambientales generales de la caverna */}
            <pointLight position={[0, 7, -2]} color="#fb923c" intensity={6.5} distance={30} decay={2} />
            <pointLight position={[0, 6, -10]} color="#f97316" intensity={6.0} distance={28} decay={2} />
            <pointLight position={[0, 3, 5]} color="#fdba74" intensity={5.0} distance={22} decay={2} />

            {/* Portal de entrada */}
            <Suspense fallback={null}>
                <StoneArch position={[0, 0, 9]} scale={1.4} rotation={[0, 0, 0]} />
            </Suspense>

            {/* COLUMNAS ENANAS */}
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

                {/* Lado Derecho */}
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

                <AnvilModel
                    position={[-3, 0.5, 1.4]}
                    scale={0.8}
                    rotation={[0.9, 2.3, -Math.PI / 4]}
                />
            </Suspense>

            {/* Rocas del entorno */}
            <Suspense fallback={null}>
                <Rock1 position={[-2.4, 0, 7.5]} scale={0.9} rotation={[0.4, 0.2, 0]} />
                <Rock2 position={[2.8, 0, -1.5]} scale={1.0} rotation={[-0.2, 1.1, 0.3]} />
                <Rock1 position={[-2.8, 0, -9.2]} scale={1.1} rotation={[0, 1.8, 0]} />
                <Rock2 position={[2.6, 0, -14.5]} scale={0.9} rotation={[0.5, -0.4, 0]} />
            </Suspense>
        </group>
    );
}