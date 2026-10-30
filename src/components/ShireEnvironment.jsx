import React from 'react';
import * as THREE from 'three';

// 🌾 Arbustos y Matorrales
function Bush({ position, scale = 1 }) {
    return (
        <group position={position} scale={scale}>
            <mesh position={[0, 0.4, 0]} castShadow>
                <dodecahedronGeometry args={[0.7, 1]} />
                <meshStandardMaterial color="#1e4620" roughness={0.8} />
            </mesh>
            <mesh position={[0.4, 0.3, 0.2]} castShadow>
                <dodecahedronGeometry args={[0.5, 1]} />
                <meshStandardMaterial color="#2d5a27" roughness={0.8} />
            </mesh>
        </group>
    );
}

// 🌲 Árboles estilizados de la Comarca
function ShireTree({ position, scale = 1 }) {
    return (
        <group position={position} scale={scale}>
            {/* Tronco */}
            <mesh position={[0, 1.2, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.4, 2.4, 6]} />
                <meshStandardMaterial color="#3d2314" roughness={0.9} />
            </mesh>
            {/* Copa */}
            <mesh position={[0, 3, 0]} castShadow>
                <dodecahedronGeometry args={[1.8, 1]} />
                <meshStandardMaterial color="#16381a" roughness={0.7} />
            </mesh>
            <mesh position={[0, 4.2, 0]} castShadow>
                <dodecahedronGeometry args={[1.3, 1]} />
                <meshStandardMaterial color="#224d27" roughness={0.7} />
            </mesh>
        </group>
    );
}

export function ShireEnvironment() {
    return (
        <group>
            {/* 🌿 1. PISO DE PASTO (Ajustado a la altura Y = -1.91 del terreno) */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -1.91, 0]}
                receiveShadow
            >
                <planeGeometry args={[150, 150]} />
                <meshStandardMaterial
                    color="#2d5a27"
                    roughness={0.9}
                    metalness={0.1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* 🟤 2. EL CAMINO DE TIERRA */}
            <mesh rotation={[-Math.PI / 2, 0, 0.2]} position={[2, -1.9, -10]} receiveShadow>
                <planeGeometry args={[3.5, 50]} />
                <meshStandardMaterial color="#4a3222" roughness={1} />
            </mesh>

            {/* 🏔️ 3. PEQUEÑA MONTAÑA A LA DERECHA */}
            <group position={[16, -2, -12]}>
                <mesh castShadow receiveShadow>
                    <coneGeometry args={[12, 14, 7]} />
                    <meshStandardMaterial color="#1b331e" roughness={0.9} />
                </mesh>
                <mesh position={[-1, 6, 0]}>
                    <coneGeometry args={[4, 8, 5]} />
                    <meshStandardMaterial color="#2a332c" roughness={0.8} />
                </mesh>
            </group>

            {/* 🌲 4. BOSQUE DE FONDO */}
            <group position={[-10, -2, -18]}>
                <ShireTree position={[0, 0, 0]} scale={1.4} />
                <ShireTree position={[-4, 0, -3]} scale={1.8} />
                <ShireTree position={[3, 0, -5]} scale={1.2} />
                <ShireTree position={[-2, 0, -8]} scale={2} />
                <ShireTree position={[6, 0, -10]} scale={1.6} />
            </group>

            {/* 🌿 5. VEGETACIÓN Y ARBUSTOS EN LOS BORDES DEL CAMINO */}
            <Bush position={[-2.5, -1.8, 4]} scale={1.2} />
            <Bush position={[2.8, -1.8, 2]} scale={1} />
            <Bush position={[-3, -1.8, -2]} scale={1.5} />
            <Bush position={[3.5, -1.8, -5]} scale={1.3} />
            <Bush position={[-2, -1.8, -10]} scale={1.1} />
        </group>
    );
}