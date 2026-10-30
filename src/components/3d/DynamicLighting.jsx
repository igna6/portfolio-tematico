import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BIOME_SETTINGS = [
    // 0. La Comarca
    {
        fogColor: '#09111e',
        fogDensity: 0.012,
        hemiSky: '#fef3c7',
        hemiGround: '#1a3a1a',
        hemiIntensity: 0.9,
        dirColor: '#fbbf24',
        dirIntensity: 2.5
    },
    // 1. El Bosque del Conocimiento
    {
        fogColor: '#051610',
        fogDensity: 0.015,
        hemiSky: '#6ee7b7',
        hemiGround: '#064e3b',
        hemiIntensity: 0.6,
        dirColor: '#34d399',
        dirIntensity: 1.2
    },
    // 2. Minas de Moria (Sin tintes marrones)
    {
        fogColor: '#060709',       // 👈 Fondo casi negro neutro
        fogDensity: 0.008,        // 👈 Niebla baja
        hemiSky: '#18181b',       // 👈 Gris piedra
        hemiGround: '#09090b',
        hemiIntensity: 0.4,
        dirColor: '#f97316',
        dirIntensity: 0.8
    },
    // 3. Erebor: Salón del trono (Niebla ultra cristalina)
    {
        fogColor: '#0a0d14',       // 👈 Azul noche/dorado oscuro
        fogDensity: 0.003,        // 👈 Niebla casi nula para ver toda la escena libremente
        hemiSky: '#fef08a',
        hemiGround: '#1c1917',
        hemiIntensity: 1.3,
        dirColor: '#f59e0b',
        dirIntensity: 3.5
    }
];

export function DynamicLighting({ scrollProgress }) {
    const dirLightRef = useRef();
    const hemiLightRef = useRef();

    const currentFogColor = useRef(new THREE.Color());
    const nextFogColor = useRef(new THREE.Color());
    const lerpedFogColor = useRef(new THREE.Color());

    const currentHemiSky = useRef(new THREE.Color());
    const nextHemiSky = useRef(new THREE.Color());
    const lerpedHemiSky = useRef(new THREE.Color());

    const currentDirColor = useRef(new THREE.Color());
    const nextDirColor = useRef(new THREE.Color());
    const lerpedDirColor = useRef(new THREE.Color());

    useFrame((state, delta) => {
        const p = THREE.MathUtils.clamp(scrollProgress.current, 0, 1);
        const segmentCount = BIOME_SETTINGS.length - 1;
        const rawIndex = p * segmentCount;
        const index = Math.min(Math.floor(rawIndex), segmentCount - 1);
        const factor = rawIndex - index;

        const b1 = BIOME_SETTINGS[index];
        const b2 = BIOME_SETTINGS[index + 1];

        currentFogColor.current.set(b1.fogColor);
        nextFogColor.current.set(b2.fogColor);
        lerpedFogColor.current.lerpColors(currentFogColor.current, nextFogColor.current, factor);

        if (state.scene.fog) {
            state.scene.fog.color.copy(lerpedFogColor.current);
            const targetDensity = THREE.MathUtils.lerp(b1.fogDensity, b2.fogDensity, factor);
            state.scene.fog.density = THREE.MathUtils.damp(state.scene.fog.density, targetDensity, 4, delta);
        }

        if (state.scene.background) {
            state.scene.background.copy(lerpedFogColor.current);
        }

        if (hemiLightRef.current) {
            currentHemiSky.current.set(b1.hemiSky);
            nextHemiSky.current.set(b2.hemiSky);
            lerpedHemiSky.current.lerpColors(currentHemiSky.current, nextHemiSky.current, factor);
            hemiLightRef.current.color.copy(lerpedHemiSky.current);

            const targetHemiIntensity = THREE.MathUtils.lerp(b1.hemiIntensity, b2.hemiIntensity, factor);
            hemiLightRef.current.intensity = THREE.MathUtils.damp(hemiLightRef.current.intensity, targetHemiIntensity, 4, delta);
        }

        if (dirLightRef.current) {
            currentDirColor.current.set(b1.dirColor);
            nextDirColor.current.set(b2.dirColor);
            lerpedDirColor.current.lerpColors(currentDirColor.current, nextDirColor.current, factor);
            dirLightRef.current.color.copy(lerpedDirColor.current);

            const targetDirIntensity = THREE.MathUtils.lerp(b1.dirIntensity, b2.dirIntensity, factor);
            dirLightRef.current.intensity = THREE.MathUtils.damp(dirLightRef.current.intensity, targetDirIntensity, 4, delta);
        }
    });

    return (
        <>
            <hemisphereLight
                ref={hemiLightRef}
                skyColor="#fef3c7"
                groundColor="#1a3a1a"
                intensity={0.9}
            />
            <directionalLight
                ref={dirLightRef}
                position={[14, 25, 18]}
                intensity={2.5}
                color="#fbbf24"
                castShadow
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
            />
        </>
    );
}