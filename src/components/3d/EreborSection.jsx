import React, { useRef, Suspense, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, useScroll, MeshReflectorMaterial } from '@react-three/drei';
import { createMarbleTextures, createStoneTileTextures } from './ProceduralTextures';
import {
    DwarfColumn,
    DwarfShield,
    GoldPileModel,
    Rock1,
    Rock2,
    BrazierModel,
    FireModel,
    StoneArch
} from './Models';

// 👑 Trono Monumental Esculpido de Erebor (Geometría Enana & Oro)
export function ProceduralThrone({ position = [0, 0, 0], scale = 1 }) {
    return (
        <group position={position} scale={scale}>
            {/* 🏛️ BASE ESCALONADA (Granito oscuro labrado con detalles metálicos) */}
            <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
                <boxGeometry args={[6.2, 0.3, 5.2]} />
                <meshStandardMaterial color="#161b26" roughness={0.8} metalness={0.3} />
            </mesh>
            <mesh position={[0, 0.45, 0.2]} castShadow receiveShadow>
                <boxGeometry args={[5.0, 0.3, 4.2]} />
                <meshStandardMaterial color="#1f2636" roughness={0.7} metalness={0.35} />
            </mesh>
            <mesh position={[0, 0.75, 0.4]} castShadow receiveShadow>
                <boxGeometry args={[3.8, 0.3, 3.2]} />
                <meshStandardMaterial color="#283144" roughness={0.65} metalness={0.4} />
            </mesh>

            {/* 🏮 PILARES RUNICOS LATERALES EN LA BASE */}
            <mesh position={[-1.75, 1.3, 0.4]} castShadow receiveShadow>
                <boxGeometry args={[0.3, 0.8, 0.3]} />
                <meshStandardMaterial color="#1e2430" roughness={0.5} metalness={0.6} />
            </mesh>
            <mesh position={[1.75, 1.3, 0.4]} castShadow receiveShadow>
                <boxGeometry args={[0.3, 0.8, 0.3]} />
                <meshStandardMaterial color="#1e2430" roughness={0.5} metalness={0.6} />
            </mesh>
            <mesh position={[-1.75, 1.75, 0.4]}>
                <octahedronGeometry args={[0.18, 0]} />
                <meshStandardMaterial color="#facc15" roughness={0.15} metalness={0.95} emissive="#eab308" emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[1.75, 1.75, 0.4]}>
                <octahedronGeometry args={[0.18, 0]} />
                <meshStandardMaterial color="#facc15" roughness={0.15} metalness={0.95} emissive="#eab308" emissiveIntensity={0.6} />
            </mesh>

            {/* 🛋️ ASIENTO CENTRAL & COJÍN CARMESÍ */}
            <mesh position={[0, 1.35, 0.1]} castShadow receiveShadow>
                <boxGeometry args={[2.2, 0.8, 1.8]} />
                <meshStandardMaterial color="#151922" roughness={0.7} metalness={0.4} />
            </mesh>
            <mesh position={[0, 1.8, 0.1]} castShadow receiveShadow>
                <boxGeometry args={[1.9, 0.18, 1.5]} />
                <meshStandardMaterial color="#6b1414" roughness={0.5} />
            </mesh>

            {/* 👑 RESPALDO MONUMENTAL PICUDO (Estilo Piedra Tallada Enana) */}
            <mesh position={[0, 3.2, -0.6]} castShadow receiveShadow>
                <boxGeometry args={[2.4, 2.8, 0.4]} />
                <meshStandardMaterial color="#1f2636" roughness={0.6} metalness={0.4} />
            </mesh>

            {/* Picos Angulares Superiores del Respaldo */}
            <mesh position={[0, 4.8, -0.6]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0, 1.3, 1.4, 4]} />
                <meshStandardMaterial color="#2d374d" roughness={0.5} metalness={0.5} />
            </mesh>
            <mesh position={[-1.0, 4.4, -0.6]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0, 0.7, 1.0, 4]} />
                <meshStandardMaterial color="#1f2636" roughness={0.6} metalness={0.4} />
            </mesh>
            <mesh position={[1.0, 4.4, -0.6]} rotation={[0, Math.PI / 4, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0, 0.7, 1.0, 4]} />
                <meshStandardMaterial color="#1f2636" roughness={0.6} metalness={0.4} />
            </mesh>

            {/* 💎 EMBLEMA Y CORONA DORADA CENTRAL EN EL RESPALDO */}
            <mesh position={[0, 3.8, -0.38]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.7, 0.7, 0.1]} />
                <meshStandardMaterial color="#facc15" roughness={0.2} metalness={0.9} emissive="#eab308" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, 3.8, -0.32]}>
                <dodecahedronGeometry args={[0.18]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} emissive="#0284c7" emissiveIntensity={0.8} />
            </mesh>

            {/* 🛡️ REPOSABRAZOS MONOLÍTICOS CON CABEZAS DE LEÓN/CABEZA ENANA DORADA */}
            <mesh position={[-1.2, 1.95, 0.1]} castShadow receiveShadow>
                <boxGeometry args={[0.45, 0.85, 1.7]} />
                <meshStandardMaterial color="#283144" roughness={0.6} metalness={0.45} />
            </mesh>
            <mesh position={[1.2, 1.95, 0.1]} castShadow receiveShadow>
                <boxGeometry args={[0.45, 0.85, 1.7]} />
                <meshStandardMaterial color="#283144" roughness={0.6} metalness={0.45} />
            </mesh>

            {/* Remates frontales tallados de los reposabrazos */}
            <mesh position={[-1.2, 2.45, 0.85]} rotation={[Math.PI / 4, 0, 0]}>
                <boxGeometry args={[0.48, 0.22, 0.28]} />
                <meshStandardMaterial color="#facc15" roughness={0.15} metalness={0.95} />
            </mesh>
            <mesh position={[1.2, 2.45, 0.85]} rotation={[Math.PI / 4, 0, 0]}>
                <boxGeometry args={[0.48, 0.22, 0.28]} />
                <meshStandardMaterial color="#facc15" roughness={0.15} metalness={0.95} />
            </mesh>
        </group>
    );
}

// 🏛️ VIGA REAL DE TECHO EN EREBOR CON CAPITELES ALINEADOS Y DETALLES DORADOS
function RoyalHallArch({ z }) {
    return (
        <group position={[0, 7.6, z]}>
            <mesh castShadow receiveShadow>
                <boxGeometry args={[18.0, 0.9, 1.3]} />
                <meshStandardMaterial color="#191f2b" roughness={0.65} metalness={0.35} />
            </mesh>
            <mesh position={[0, -0.5, 0]}>
                <boxGeometry args={[17.2, 0.2, 0.9]} />
                <meshStandardMaterial color="#b48318" roughness={0.28} metalness={0.85} />
            </mesh>
            {/* Capiteles escalonados apoyados sobre las columnas en x = ±7.0 */}
            <mesh position={[-7.0, -0.75, 0]}>
                <boxGeometry args={[2.3, 0.45, 2.0]} />
                <meshStandardMaterial color="#232b3b" roughness={0.6} metalness={0.35} />
            </mesh>
            <mesh position={[7.0, -0.75, 0]}>
                <boxGeometry args={[2.3, 0.45, 2.0]} />
                <meshStandardMaterial color="#232b3b" roughness={0.6} metalness={0.35} />
            </mesh>
        </group>
    );
}

export function EreborSection() {
    const scroll = useScroll();
    const groupRef = useRef();
    const marbleTextures = useMemo(() => createMarbleTextures(10, 12), []);
    const wallTextures = useMemo(() => createStoneTileTextures(10, 5), []);

    useFrame(() => {
        if (!scroll) return;
        // Erebor es exclusivamente visible desde el corte negro de Cap III hasta el final
        const isNearErebor = scroll.offset >= 0.850 && scroll.offset <= 1.0;
        if (groupRef.current) {
            groupRef.current.visible = isNearErebor;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, -90]} name="erebor-biome">
            {/* Suelo amplio de mármol oscuro pulido con reflejos reales del salón */}
            <mesh position={[0, 0.01, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[62, 68]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={512}
                    mixBlur={0.9}
                    mixStrength={18}
                    roughness={0.55}
                    depthScale={1.0}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#151a24"
                    metalness={0.45}
                    map={marbleTextures.map}
                    bumpMap={marbleTextures.bumpMap}
                    bumpScale={0.04}
                />
            </mesh>

            {/* 🟥 ALFOMBRA REAL CARMESÍ Y BORDE DORADO HACIA EL TRONO */}
            <mesh position={[0, 0.025, -1.5]} receiveShadow>
                <boxGeometry args={[3.2, 0.02, 15]} />
                <meshStandardMaterial color="#5c1111" roughness={0.82} />
            </mesh>
            <mesh position={[-1.68, 0.028, -1.5]}>
                <boxGeometry args={[0.16, 0.025, 15]} />
                <meshStandardMaterial color="#d4a017" roughness={0.25} metalness={0.9} />
            </mesh>
            <mesh position={[1.68, 0.028, -1.5]}>
                <boxGeometry args={[0.16, 0.025, 15]} />
                <meshStandardMaterial color="#d4a017" roughness={0.25} metalness={0.9} />
            </mesh>

            {/* 🏛️ ARQUITECTURA DE SALÓN REAL: TECHO, MUROS DE SILLAR Y PÓRTICO TRAS EL TRONO */}
            <mesh position={[0, 9.2, -6]}>
                <boxGeometry args={[34, 1.4, 52]} />
                <meshStandardMaterial color="#0b0e15" roughness={0.92} />
            </mesh>
            <mesh position={[-12.5, 4.5, -6]} receiveShadow>
                <boxGeometry args={[2.5, 10.5, 52]} />
                <meshStandardMaterial
                    map={wallTextures.map}
                    bumpMap={wallTextures.bumpMap}
                    bumpScale={0.08}
                    roughness={0.85}
                    metalness={0.2}
                />
            </mesh>
            <mesh position={[12.5, 4.5, -6]} receiveShadow>
                <boxGeometry args={[2.5, 10.5, 52]} />
                <meshStandardMaterial
                    map={wallTextures.map}
                    bumpMap={wallTextures.bumpMap}
                    bumpScale={0.08}
                    roughness={0.85}
                    metalness={0.2}
                />
            </mesh>

            <RoyalHallArch z={1} />
            <RoyalHallArch z={-6} />
            <RoyalHallArch z={-13} />

            {/* Gran pórtico monumental detrás del Trono con muro de piedra labrada */}
            <Suspense fallback={null}>
                <StoneArch position={[0, 0, -16.5]} scale={2.6} rotation={[0, 0, 0]} />
            </Suspense>
            <mesh position={[0, 5.2, -19.5]} receiveShadow>
                <boxGeometry args={[28, 12, 1.5]} />
                <meshStandardMaterial
                    map={wallTextures.map}
                    bumpMap={wallTextures.bumpMap}
                    bumpScale={0.08}
                    roughness={0.88}
                    metalness={0.18}
                />
            </mesh>
            <pointLight position={[0, 4.5, -15.5]} color="#f59e0b" intensity={6.5} distance={22} decay={2} />

            {/* 👑 Trono Real centrado e iluminado cálidamente */}
            <ProceduralThrone position={[0, 0, -11]} scale={1.3} />

            {/* Iluminación arquitectónica directa sobre el Trono Real (sin cono ni rombo flotante) */}
            <spotLight
                position={[0, 14, -3]}
                target-position={[0, 2.2, -10.5]}
                color="#fde047"
                intensity={14.0}
                angle={0.55}
                penumbra={0.8}
                distance={32}
                castShadow
            />
            <pointLight position={[0, 4.8, -8.5]} color="#fde047" intensity={5.5} distance={18} decay={2} />
            <pointLight position={[0, 3.2, 0]} color="#fbbf24" intensity={4.5} distance={24} decay={2} />

            {/* Columnas masivas con escudos enanos y braseros con fuego real */}
            <Suspense fallback={null}>
                <DwarfColumn position={[-7.0, 0, 1]} scale={1.3} rotation={[0, 0.1, 0]} />
                <DwarfColumn position={[-7.0, 0, -6]} scale={1.3} rotation={[0, -0.15, 0]} />
                <DwarfColumn position={[-7.0, 0, -13]} scale={1.3} rotation={[0, 0.1, 0]} />

                <DwarfColumn position={[7.0, 0, 1]} scale={1.3} rotation={[0, -0.1, 0]} />
                <DwarfColumn position={[7.0, 0, -6]} scale={1.3} rotation={[0, 0.2, 0]} />
                <DwarfColumn position={[7.0, 0, -13]} scale={1.3} rotation={[0, -0.15, 0]} />

                <DwarfShield position={[-5.9, 2.8, 1.0]} scale={0.75} rotation={[0, Math.PI / 2, 0]} />
                <DwarfShield position={[5.9, 2.8, 1.0]} scale={0.75} rotation={[0, -Math.PI / 2, 0]} />
                <DwarfShield position={[-5.9, 2.8, -6.0]} scale={0.75} rotation={[0, Math.PI / 2, 0]} />
                <DwarfShield position={[5.9, 2.8, -6.0]} scale={0.75} rotation={[0, -Math.PI / 2, 0]} />

                <BrazierModel position={[-3.5, 0, -7.5]} scale={0.55} />
                <FireModel position={[-3.5, 0.42, -7.5]} scale={0.55} />
                <BrazierModel position={[3.5, 0, -7.5]} scale={0.55} />
                <FireModel position={[3.5, 0.42, -7.5]} scale={0.55} />

                <BrazierModel position={[-3.8, 0, -1.5]} scale={0.5} />
                <FireModel position={[-3.8, 0.38, -1.5]} scale={0.5} />
                <BrazierModel position={[3.8, 0, -1.5]} scale={0.5} />
                <FireModel position={[3.8, 0.38, -1.5]} scale={0.5} />
            </Suspense>

            {/* Luz cálida de los cuatro braseros del salón real */}
            <pointLight position={[-3.5, 1.2, -7.5]} color="#ff7a00" intensity={4.5} distance={14} decay={2} />
            <pointLight position={[3.5, 1.2, -7.5]} color="#ff7a00" intensity={4.5} distance={14} decay={2} />
            <pointLight position={[-3.8, 1.2, -1.5]} color="#ff7a00" intensity={3.8} distance={12} decay={2} />
            <pointLight position={[3.8, 1.2, -1.5]} color="#ff7a00" intensity={3.8} distance={12} decay={2} />

            {/* 💰 RIQUEZA Y TESORO DE SMAUG */}
            <Suspense fallback={null}>
                <GoldPileModel position={[-3.6, 0, -8.5]} scale={4.5} />
                <GoldPileModel position={[3.6, 0, -8.5]} scale={4.8} />
                <GoldPileModel position={[-4.5, 0, -12]} scale={4.0} />
                <GoldPileModel position={[4.6, 0, -12]} scale={4.2} />

                <GoldPileModel position={[-2.2, 0, -5.0]} scale={3.6} />
                <GoldPileModel position={[2.4, 0, -5.0]} scale={3.8} />
                <GoldPileModel position={[0.0, 0, -3.2]} scale={3.2} />

                <GoldPileModel position={[-5.8, 0, -2.5]} scale={4.0} />
                <GoldPileModel position={[5.8, 0, -2.5]} scale={4.2} />
                <GoldPileModel position={[-3.0, 0, 0.5]} scale={3.0} />
                <GoldPileModel position={[3.0, 0, 0.5]} scale={3.2} />

                <Rock1 position={[-6.0, 0, -0.5]} scale={1.1} />
                <Rock2 position={[6.0, 0, -1.0]} scale={1.2} />
            </Suspense>

            {/* ✨ Polvillo áureo en suspensión y partículas celestiales */}
            <Sparkles
                count={200}
                scale={[24, 16, 28]}
                position={[0, 5, -8]}
                size={4.0}
                speed={0.5}
                color="#facc15"
            />
            <Sparkles
                count={90}
                scale={[18, 12, 22]}
                position={[0, 4, -8]}
                size={2.5}
                speed={0.3}
                color="#ffffff"
            />
        </group>
    );
}