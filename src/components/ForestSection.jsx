import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Scroll, Sparkles, useGLTF, useAnimations } from '@react-three/drei';
import { CameraRig } from './CameraRig';

// 🧙‍♂️ Componente 3D del Hobbit
function HobbitModel(props) {
    const groupRef = useRef();

    // Extraemos la escena y las animaciones embebidas en el archivo .glb
    const { scene, animations } = useGLTF('/models/hobbit.glb');
    const { actions } = useAnimations(animations, groupRef);

    useEffect(() => {
        // Si el modelo trajo animaciones esqueleto (ej: 'Walk', 'Walking', 'Idle')
        if (actions && Object.keys(actions).length > 0) {
            const walkAction = actions['Walk'] || actions['Walking'] || actions[Object.keys(actions)[0]];
            walkAction?.reset().fadeIn(0.3).play();
        }
    }, [actions]);

    useFrame((state) => {
        // Si el .glb es estático (sin animaciones esqueleto), le simulamos el bamboleo de dar pasos
        if (groupRef.current && (!actions || Object.keys(actions).length === 0)) {
            const time = state.clock.elapsedTime * 7;
            // Bamboleo vertical y leve inclinación (simula caminata)
            groupRef.current.position.y = -0.5 + Math.sin(time) * 0.04;
            groupRef.current.rotation.z = Math.sin(time) * 0.02;
        }
    });

    return (
        <group ref={groupRef} {...props}>
            <primitive
                object={scene}
                scale={1.5}
                /* 
                   Orientación fija hacia el camino:
                   Si ves que queda de espaldas, cambia [0, Math.PI, 0] por [0, 0, 0]
                */
                rotation={[0, Math.PI, 0]}
                castShadow
                receiveShadow
            />
        </group>
    );
}

useGLTF.preload('/models/hobbit.glb');

export const Scene3D = ({ children }) => {
    return (
        <div className="w-full h-screen fixed inset-0 bg-[#070a12]">
            <Canvas shadows camera={{ fov: 50, position: [0, 2, 12] }}>

                {/* Entorno y niebla */}
                <color attach="background" args={['#070a12']} />
                <fogExp2 attach="fog" args={['#070a12', 0.025]} />

                {/* Luces cinematográficas */}
                <ambientLight intensity={0.9} />
                <directionalLight position={[10, 20, 15]} intensity={2.2} color="#fef08a" castShadow />
                <pointLight position={[0, 2, 3]} intensity={4} color="#f97316" />

                {/* Partículas de la Comarca */}
                <Sparkles count={250} scale={[40, 20, 80]} size={4} speed={0.4} color="#fbbf24" />

                <group>
                    {/* HITO 0: HOBBIT EN LA COMARCA */}
                    <Suspense fallback={null}>
                        <HobbitModel position={[0, -0.5, 3]} />
                    </Suspense>

                    {/* Colina / Suelo de la Comarca */}
                    <mesh position={[0, -2, 0]} receiveShadow>
                        <cylinderGeometry args={[10, 14, 3, 32]} />
                        <meshStandardMaterial color="#1a381e" roughness={0.8} />
                    </mesh>

                    {/* Suelo extendido */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -50]}>
                        <planeGeometry args={[300, 300]} />
                        <meshStandardMaterial color="#070a12" roughness={1} />
                    </mesh>
                </group>

                {/* Control de Scroll y Cámara 3D */}
                <ScrollControls pages={4} damping={0.2}>
                    <CameraRig />

                    <Scroll html style={{ width: '100vw' }}>
                        {children}
                    </Scroll>
                </ScrollControls>

            </Canvas>
        </div>
    );
};