import React, { Suspense, useMemo, memo } from 'react';
import * as THREE from 'three';
import {
    PineTree,
    Rock1,
    Rock2,
    StonePath,
    GrassPatch,
    GrassTuft,
    CartModel,
    SignpostModel,
    LanternPost
} from './Models';

// 🐍 CAMINO EXTENDIDO Y SINUOSO
export function CurvedPath() {
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.005, 35.0),
            new THREE.Vector3(0, 0.005, 20.0),
            new THREE.Vector3(0, 0.005, 12.0),
            new THREE.Vector3(0, 0.005, 8.0),
            new THREE.Vector3(0, 0.005, 5.0),
            new THREE.Vector3(0, 0.005, 2.8),
            new THREE.Vector3(0.1, 0.005, 0.6),
            new THREE.Vector3(0.5, 0.005, -1.6),
            new THREE.Vector3(1.2, 0.005, -3.8),
            new THREE.Vector3(2.0, 0.005, -6.0),
            new THREE.Vector3(3.0, 0.005, -8.2),
            new THREE.Vector3(4.2, 0.005, -12.0),
            new THREE.Vector3(5.5, 0.005, -20.0),
            new THREE.Vector3(7.0, 0.005, -35.0)
        ]);
    }, []);

    return (
        <mesh position={[0, 0, 0]} scale={[1, 0.005, 1]} receiveShadow>
            <tubeGeometry args={[curve, 180, 1.5, 12, false]} />
            <meshStandardMaterial
                color="#4a301a"
                roughness={0.95}
                metalness={0.05}
            />
        </mesh>
    );
}

// 🌾 VEGETACIÓN OPTIMIZADA Y MEMOIZADA (60 FPS Garantes)
const DenseVegetation = memo(function DenseVegetation() {
    const vegetationItems = useMemo(() => {
        const items = [];
        let seed = 42;
        const random = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        const getPathXAtZ = (z) => {
            if (z > 5) return 0;
            if (z > -1.6) return 0.1 * (5 - z) / 6.6;
            if (z > -8.2) return 0.5 + (1.2 * (-1.6 - z) / 6.6);
            if (z > -20) return 3.0 + (2.5 * (-8.2 - z) / 11.8);
            return 5.5 + (1.5 * (-20 - z) / 15);
        };

        // 65 elementos estratégicos con variaciones de tamaño para cubrir todo el mapa sin sobrecargar WebGL
        for (let i = 0; i < 65; i++) {
            const x = (random() - 0.5) * 36;
            const z = (random() - 0.5) * 55;

            const pathX = getPathXAtZ(z);
            const distToPath = Math.abs(x - pathX);

            if (distToPath > 1.6) {
                const type = random() > 0.4 ? 'patch' : 'tuft';
                const scale = 0.8 + random() * 1.1;
                const rotation = random() * Math.PI * 2;
                items.push({ id: i, type, x, z, scale, rotation });
            }
        }
        return items;
    }, []);

    return (
        <Suspense fallback={null}>
            {vegetationItems.map((item) =>
                item.type === 'patch' ? (
                    <GrassPatch
                        key={item.id}
                        position={[item.x, 0, item.z]}
                        scale={item.scale}
                        rotation={[0, item.rotation, 0]}
                    />
                ) : (
                    <GrassTuft
                        key={item.id}
                        position={[item.x, 0, item.z]}
                        scale={item.scale}
                        rotation={[0, item.rotation, 0]}
                    />
                )
            )}
        </Suspense>
    );
});

export function ShireEnvironment() {
    return (
        <group name="shire-biome">
            {/* 🌿 PISO BASE DE PASTO */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.02, 0]}
                receiveShadow
            >
                <planeGeometry args={[500, 500]} />
                <meshBasicMaterial color="#224d27" fog={false} />
            </mesh>

            {/* 🐍 CAMINO CONTINUO */}
            <CurvedPath />

            {/* 🌾 MANTO DE VEGETACIÓN OPTIMIZADO */}
            <DenseVegetation />

            {/* MOSAICOS DE PIEDRAS */}
            <Suspense fallback={null}>
                <StonePath position={[0, 0.02, 5.0]} scale={0.95} rotation={[0, 0.1, 0]} />
                <StonePath position={[0, 0.02, 2.8]} scale={0.95} rotation={[0, -0.15, 0]} />
                <StonePath position={[0, 0.02, 0.6]} scale={0.95} rotation={[0, 0.2, 0]} />
                <StonePath position={[0.4, 0.02, -1.6]} scale={0.95} rotation={[0, -0.1, 0]} />
                <StonePath position={[1.0, 0.02, -3.8]} scale={0.95} rotation={[0, 0.25, 0]} />
                <StonePath position={[1.8, 0.02, -6.0]} scale={0.95} rotation={[0, -0.2, 0]} />
                <StonePath position={[2.8, 0.02, -8.2]} scale={0.95} rotation={[0, 0.3, 0]} />
            </Suspense>

            {/* ELEMENTOS PRINCIPALES */}
            <Suspense fallback={null}>
                <LanternPost position={[2.8, 0, 1.8]} scale={0.85} rotation={[0, -0.6, 0]} />
                <pointLight position={[2.8, 1.9, 1.8]} color="#fde047" intensity={2.5} distance={10} decay={2} />

                <SignpostModel position={[-2.8, 0, 1.0]} scale={0.8} rotation={[0, 0.5, 0]} />
                <CartModel position={[-4.5, 0, -1.5]} scale={1.0} rotation={[0, 0.3, 0]} />
            </Suspense>

            {/* ROCAS Y DETALLES DEL SUELO */}
            <Suspense fallback={null}>
                <Rock1 position={[-2.6, 0, 3.8]} scale={0.6} rotation={[0, 0.4, 0]} />
                <Rock2 position={[2.5, 0, 2.6]} scale={0.7} rotation={[0, -1.1, 0]} />
                <Rock1 position={[3.8, 0, 4.2]} scale={0.9} rotation={[0, 0.8, 0]} />
                <Rock1 position={[-3.5, 0, -2.5]} scale={1.1} rotation={[0, 2.2, 0]} />
                <Rock2 position={[3.8, 0, -2.2]} scale={0.8} rotation={[0, 0.8, 0]} />
                <Rock1 position={[-5.2, 0, -8.0]} scale={1.3} rotation={[0, 1.1, 0]} />
                <Rock2 position={[6.0, 0, -12.0]} scale={1.4} rotation={[0, 0.5, 0]} />
            </Suspense>

            {/* 🌲 BOSQUE DE PINOS */}
            <Suspense fallback={null}>
                {/* Lateral Izquierdo */}
                <PineTree position={[-4.5, 0, 12.0]} scale={1.2} />
                <PineTree position={[-7.0, 0, 9.0]} scale={1.5} />
                <PineTree position={[-4.5, 0, 6.0]} scale={1.0} />
                <PineTree position={[-6.0, 0, 3.5]} scale={1.3} />
                <PineTree position={[-5.0, 0, 0.5]} scale={1.1} />
                <PineTree position={[-7.5, 0, 1.0]} scale={1.4} />
                <PineTree position={[-8.5, 0, 5.0]} scale={1.5} />
                <PineTree position={[-6.5, 0, -4.0]} scale={1.2} />
                <PineTree position={[-9.0, 0, -3.0]} scale={1.6} />
                <PineTree position={[-8.0, 0, -8.0]} scale={1.7} />
                <PineTree position={[-5.5, 0, -10.0]} scale={1.3} />
                <PineTree position={[-11.0, 0, -6.0]} scale={1.8} />

                {/* Lateral Derecho */}
                <PineTree position={[5.5, 0, 11.0]} scale={1.3} />
                <PineTree position={[7.5, 0, 8.5]} scale={1.4} />
                <PineTree position={[4.5, 0, 5.5]} scale={1.1} rotation={[0, 0.4, 0]} />
                <PineTree position={[6.2, 0, 3.0]} scale={1.3} rotation={[0, -0.6, 0]} />
                <PineTree position={[5.2, 0, 0.2]} scale={1.05} />
                <PineTree position={[7.8, 0, 1.5]} scale={1.5} rotation={[0, 0.8, 0]} />
                <PineTree position={[9.0, 0, 4.5]} scale={1.6} />
                <PineTree position={[6.8, 0, -4.5]} scale={1.25} />
                <PineTree position={[9.5, 0, -3.5]} scale={1.65} />
                <PineTree position={[8.5, 0, -8.5]} scale={1.7} />
                <PineTree position={[6.0, 0, -11.0]} scale={1.35} />
                <PineTree position={[12.0, 0, -6.0]} scale={1.8} />
            </Suspense>
        </group>
    );
}