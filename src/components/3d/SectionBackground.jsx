import React from 'react';
import { useTexture } from '@react-three/drei';

export function SectionBackground({ path, position = [0, 10, -25], scale = [70, 40, 1] }) {
    const texture = useTexture(path);

    return (
        <mesh position={position} scale={scale}>
            <planeGeometry />
            <meshBasicMaterial
                map={texture}
                depthWrite={false} // Evita conflictos de superposición con los objetos 3D
                transparent
            />
        </mesh>
    );
}