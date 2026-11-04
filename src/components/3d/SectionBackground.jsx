import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

/**
 * 🌐 BiomeSkyDome
 * Cúpula semiesférica envolvente gigante:
 * - radius: suficientemente grande para cubrir todo el horizonte y el cielo
 * - side={THREE.BackSide}: se ve desde adentro
 * - fog={false}: inmune a la niebla
 * - depthWrite={false} y renderOrder={-100}: siempre al fondo
 */
export function BiomeSkyDome({
    path,
    radius = 55,
    position = [0, 0, 0],
    rotation = [0, -Math.PI / 2, 0]
}) {
    const texture = useTexture(path);

    useMemo(() => {
        if (texture) {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.needsUpdate = true;
        }
    }, [texture]);

    return (
        <mesh position={position} rotation={rotation} renderOrder={-100}>
            {/* Esfera con corte horizontal para cielo y horizonte */}
            <sphereGeometry args={[radius, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            <meshBasicMaterial
                map={texture}
                side={THREE.BackSide}
                fog={false}
                depthWrite={false}
                toneMapped={false}
            />
        </mesh>
    );
}

// Exportación compatible
export function SectionDomeBackground(props) {
    return <BiomeSkyDome {...props} />;
}

export function SectionBackground(props) {
    return <BiomeSkyDome {...props} />;
}

useTexture.preload('/backgrounds/comarca.jpg');
useTexture.preload('/backgrounds/bosque.jpg');
useTexture.preload('/backgrounds/moria.jpg');
useTexture.preload('/backgrounds/erebor.jpg');
