import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, useScroll } from '@react-three/drei';
import { ModelErrorBoundary } from './Models';

function HobbitInternal(props) {
    const groupRef = useRef();
    const scroll = useScroll();
    const { scene, animations } = useGLTF('/models/hobbit.glb');
    const { actions } = useAnimations(animations, groupRef);

    useEffect(() => {
        if (actions && Object.keys(actions).length > 0) {
            const walkAction = actions['Walk'] || actions['Walking'] || actions[Object.keys(actions)[0]];
            walkAction?.reset().fadeIn(0.3).play();
        }
    }, [actions]);

    useFrame((state) => {
        if (groupRef.current) {
            // Solo visible en el capítulo 1 (La Comarca)
            if (scroll) {
                groupRef.current.visible = scroll.offset <= 0.28;
            }

            const time = state.clock.elapsedTime * 6;
            // Bamboleo suave centrado
            const baseY = props.position ? props.position[1] : 0;
            groupRef.current.position.y = baseY + Math.sin(time) * 0.02;
            groupRef.current.rotation.z = Math.sin(time) * 0.01;
        }
    });

    return (
        <group ref={groupRef} {...props}>
            <primitive
                object={scene}
                scale={1.2}
                rotation={[0, Math.PI, 0]}
                castShadow
                receiveShadow
            />
        </group>
    );
}

export function HobbitModel(props) {
    return (
        <ModelErrorBoundary
            path="/models/hobbit.glb"
            fallback={
                <mesh position={props.position || [0, 0, 4]}>
                    <capsuleGeometry args={[0.25, 0.6, 8, 16]} />
                    <meshStandardMaterial color="#c29a5b" roughness={0.6} />
                </mesh>
            }
        >
            <HobbitInternal {...props} />
        </ModelErrorBoundary>
    );
}

export const HobbitCharacter = HobbitModel;
