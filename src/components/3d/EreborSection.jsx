import React, { useRef, Suspense } from 'react';
import { SectionBackground } from './SectionBackground';
import { useFrame } from '@react-three/fiber';
import { Float, Sparkles, useScroll } from '@react-three/drei';
import {
    DwarfColumn,
    GoldPileModel,
    Rock1,
    Rock2,
    BrazierModel
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

export function EreborSection() {
    const scroll = useScroll();
    const groupRef = useRef();

    useFrame(() => {
        if (!scroll) return;
        // 🎯 Hacemos que Erebor empiece a mostrarse a partir del 80% del scroll (Capítulo IV)
        const isNearErebor = scroll.offset >= 0.80 && scroll.offset <= 1.0;
        if (groupRef.current) {
            groupRef.current.visible = isNearErebor;
        }
    });

    return (
        <group ref={groupRef} position={[0, 0, -90]} name="erebor-biome">
            {/* 🖼️ DOMO PANORÁMICO 360° DE EREBOR */}
            <Suspense fallback={null}>
                <SectionBackground
                    path="/backgrounds/erebor.jpg"
                    radius={55}
                    position={[0, 0, -8]}
                    rotation={[0, -Math.PI / 2, 0]}
                />
            </Suspense>
            {/* Suelo del Gran Salón de Thrór */}
            <mesh position={[0, 0.01, -5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[34, 38]} />
                <meshStandardMaterial color="#181d28" roughness={0.8} metalness={0.25} />
            </mesh>

            {/* Muro posterior de la montaña enana - Sellado completo */}
            <mesh position={[0, 12, -18]} receiveShadow>
                <boxGeometry args={[48, 28, 2]} />
                <meshStandardMaterial color="#0e121a" roughness={0.9} />
            </mesh>

            {/* Muros laterales del Salón Real */}
            <mesh position={[-16, 12, -4]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                <boxGeometry args={[36, 28, 2]} />
                <meshStandardMaterial color="#0e121a" roughness={0.9} />
            </mesh>
            <mesh position={[16, 12, -4]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                <boxGeometry args={[36, 28, 2]} />
                <meshStandardMaterial color="#0e121a" roughness={0.9} />
            </mesh>

            {/* 👑 Trono Real centrado */}
            <ProceduralThrone position={[0, 0, -11]} scale={1.3} />

            {/* 💎 La Piedra del Arca (Arkenstone) */}
            <Float speed={2.0} rotationIntensity={1.4} floatIntensity={1.5}>
                <mesh position={[0, 4.0, -8.5]} castShadow>
                    <octahedronGeometry args={[0.35, 0]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        emissive="#fde047"
                        emissiveIntensity={2.5}
                        roughness={0.05}
                        metalness={0.95}
                    />
                </mesh>
            </Float>

            {/* 💡 Haz de luz celestial centrado en el Trono */}
            <spotLight
                position={[0, 18, -3]}
                target-position={[0, 2, -10]}
                color="#fde047"
                intensity={12.0}
                angle={0.65}
                penumbra={0.7}
                distance={38}
                castShadow
            />
            <pointLight position={[0, 5, -8.5]} color="#fde047" intensity={5.0} distance={20} decay={2} />
            <pointLight position={[0, 3, 0]} color="#fbbf24" intensity={4.0} distance={24} decay={2} />

            {/* Columnas masivas custodiando el salón */}
            <Suspense fallback={null}>
                <DwarfColumn position={[-7.0, 0, 1]} scale={1.3} rotation={[0, 0.1, 0]} />
                <DwarfColumn position={[-7.0, 0, -6]} scale={1.3} rotation={[0, -0.15, 0]} />
                <DwarfColumn position={[-7.0, 0, -13]} scale={1.3} rotation={[0, 0.1, 0]} />

                <DwarfColumn position={[7.0, 0, 1]} scale={1.3} rotation={[0, -0.1, 0]} />
                <DwarfColumn position={[7.0, 0, -6]} scale={1.3} rotation={[0, 0.2, 0]} />
                <DwarfColumn position={[7.0, 0, -13]} scale={1.3} rotation={[0, -0.15, 0]} />

                <BrazierModel position={[-3.5, 0, -7.5]} scale={0.55} />
                <BrazierModel position={[3.5, 0, -7.5]} scale={0.55} />
            </Suspense>

            {/* Luz de los braseros del salón real */}
            <pointLight position={[-3.5, 1.2, -7.5]} color="#ff7a00" intensity={4.0} distance={12} decay={2} />
            <pointLight position={[3.5, 1.2, -7.5]} color="#ff7a00" intensity={4.0} distance={12} decay={2} />

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