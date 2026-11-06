import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export function HobbitModel(props) {
    const groupRef = useRef();
    const { scene } = useGLTF('/models/hobbit.glb');

    return (
        <group ref={groupRef} {...props}>
            <primitive
                object={scene}
                scale={1}
                castShadow
                receiveShadow
            />
        </group>
    );
}

useGLTF.preload('/models/hobbit.glb');