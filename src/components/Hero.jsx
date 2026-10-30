import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll, Environment, Sky } from '@react-three/drei';

// Importa aquí tus componentes de interfaz (Hero, Projects, etc.)
import { Hero } from './Hero';
import { Projects } from './Projects';

export const Journey3D = () => {
    return (
        <div className="w-full h-screen bg-slate-950 overflow-hidden">
            {/* El Canvas es la ventana al mundo 3D */}
            <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>

                {/* 1. Iluminación y Entorno */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
                <Environment preset="sunset" />
                <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />

                <Suspense fallback={null}>
                    {/* pages=4 indica que el scroll durará 4 pantallas de alto */}
                    <ScrollControls pages={4} damping={0.25}>

                        {/* ==========================================
                CAPA 3D: Aquí irán tus modelos (.glb)
                ========================================== */}
                        {/* Ejemplo de un suelo temporal hasta que cargues tus modelos */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                            <planeGeometry args={[50, 50]} />
                            <meshStandardMaterial color="#2d4c1e" /> {/* Verde oscuro tipo pasto */}
                        </mesh>

                        {/* ==========================================
                CAPA HTML: Tu interfaz tradicional por encima
                ========================================== */}
                        <Scroll html className="w-full">

                            <div className="w-screen">
                                <Hero />
                            </div>

                            {/* Espacio vacío para que la cámara viaje por el 3D antes del siguiente contenido */}
                            <div className="h-screen" />

                            <div className="w-screen">
                                <Projects />
                            </div>

                            <div className="h-screen" />

                            {/* Más secciones... */}
                        </Scroll>

                    </ScrollControls>
                </Suspense>
            </Canvas>
        </div>
    );
};