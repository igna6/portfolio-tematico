import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export function HobbitModel(props) {
    const groupRef = useRef();
    // Carga el archivo desde /public/models/hobbit.glb
    const { scene } = useGLTF('/models/hobbit.glb');

    // Pequeña animación sutil para que no quede estático
    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.2; // Rotación suave
        }
    });

    return (
        <group ref={groupRef} {...props}>
            <primitive
                object={scene}
                scale={1.2}
                castShadow
                receiveShadow
            />
        </group>
        
    );
}

// Pre-carga el modelo para evitar tirones de carga
useGLTF.preload('/models/hobbit.glb');