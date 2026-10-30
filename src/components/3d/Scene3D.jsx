import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { CameraRig } from './CameraRig';
import { DynamicLighting } from './DynamicLighting';
import { HobbitModel } from './HobbitCharacter';
import { ShireEnvironment } from './ShireEnvironment';
import { ForestSection } from './ForestSection';
import { MoriaSection } from './MoriaSection';
import { EreborSection } from './EreborSection';

export const Scene3D = ({ children }) => {
    const scrollProgress = useRef(0);
    const fadeOverlayRef = useRef(null);

    const handleProgressUpdate = (progress) => {
        scrollProgress.current = progress;
    };

    const handleFadeUpdate = (opacity) => {
        if (fadeOverlayRef.current) {
            fadeOverlayRef.current.style.opacity = opacity.toFixed(3);
        }
    };

    return (
        <div className="w-full h-screen fixed inset-0 bg-[#06080d]">
            <Canvas
                shadows
                camera={{ fov: 45, position: [0, 5.0, 16.0], near: 0.1, far: 1000 }}
                gl={{ antialias: true, powerPreference: 'high-performance' }}
            >
                <fogExp2 attach="fog" args={['#06080d', 0.02]} />

                <DynamicLighting scrollProgress={scrollProgress} />

                <group name="chapters-world">
                    {/* 🌻 CAPÍTULO I: LA COMARCA */}
                    <Suspense fallback={null}>
                        <HobbitModel position={[0, 0, 3.8]} />
                        <ShireEnvironment />
                    </Suspense>

                    {/* 🌲 CAPÍTULO II: EL BOSQUE */}
                    <Suspense fallback={null}>
                        <ForestSection />
                    </Suspense>

                    {/* 🕯️ CAPÍTULO III: MORIA */}
                    <Suspense fallback={null}>
                        <MoriaSection />
                    </Suspense>

                    {/* 💎 CAPÍTULO IV: EREBOR */}
                    <Suspense fallback={null}>
                        <EreborSection />
                    </Suspense>
                </group>

                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={0.4} intensity={1.0} mipmapBlur />
                    <Vignette darkness={0.9} offset={0.3} />
                </EffectComposer>

                <ScrollControls pages={8} damping={0.25}>
                    <CameraRig
                        onProgressUpdate={handleProgressUpdate}
                        onFadeUpdate={handleFadeUpdate}
                    />
                    <Scroll html style={{ width: '100vw' }}>
                        {children}
                    </Scroll>
                </ScrollControls>
            </Canvas>

            {/* Telón cinemático Fade to Black */}
            <div
                ref={fadeOverlayRef}
                className="pointer-events-none fixed inset-0 z-30 bg-[#06080d] transition-opacity duration-100 ease-out opacity-0"
                style={{ willChange: 'opacity' }}
            />
        </div>
    );
};