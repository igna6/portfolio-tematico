import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BIOME_SETTINGS = [
    // 0. La Comarca — Tarde dorada luminosa (Golden Hour)
    {
        fogColor: '#d99862',
        fogDensity: 0.013,
        hemiSky: '#fff0cc',
        hemiGround: '#3d5a2b',
        hemiIntensity: 1.55,
        dirColor: '#ffbe6b',
        dirIntensity: 3.4
    },
    // 1. El Bosque del Conocimiento
    {
        fogColor: '#05140e',
        fogDensity: 0.025,
        hemiSky: '#6ee7b7',
        hemiGround: '#064e3b',
        hemiIntensity: 0.75,
        dirColor: '#34d399',
        dirIntensity: 1.4
    },
    // 2. Minas de Moria
    {
        fogColor: '#090706',
        fogDensity: 0.022,
        hemiSky: '#523421',
        hemiGround: '#1a110d',
        hemiIntensity: 0.9,
        dirColor: '#fb923c',
        dirIntensity: 1.7
    },
    // 3. Erebor: Salón del trono
    {
        fogColor: '#080b12',
        fogDensity: 0.015,
        hemiSky: '#fef08a',
        hemiGround: '#1c1917',
        hemiIntensity: 1.3,
        dirColor: '#f59e0b',
        dirIntensity: 3.6
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

        // Asignar iluminación exacta al bioma activo (sin contaminar Cap I con la oscuridad del Bosque)
        let biomeIdx = 0;
        if (p >= 0.850) biomeIdx = 3;
        else if (p >= 0.600) biomeIdx = 2;
        else if (p >= 0.350) biomeIdx = 1;

        const target = BIOME_SETTINGS[biomeIdx];

        nextFogColor.current.set(target.fogColor);
        if (state.scene.fog) {
            state.scene.fog.color.lerp(nextFogColor.current, Math.min(1, delta * 8));
            state.scene.fog.density = THREE.MathUtils.damp(state.scene.fog.density, target.fogDensity, 6, delta);
        }

        if (state.scene.background) {
            state.scene.background.lerp(nextFogColor.current, Math.min(1, delta * 8));
        }

        if (hemiLightRef.current) {
            nextHemiSky.current.set(target.hemiSky);
            hemiLightRef.current.color.lerp(nextHemiSky.current, Math.min(1, delta * 8));
            hemiLightRef.current.intensity = THREE.MathUtils.damp(hemiLightRef.current.intensity, target.hemiIntensity, 6, delta);
        }

        if (dirLightRef.current) {
            nextDirColor.current.set(target.dirColor);
            dirLightRef.current.color.lerp(nextDirColor.current, Math.min(1, delta * 8));
            dirLightRef.current.intensity = THREE.MathUtils.damp(dirLightRef.current.intensity, target.dirIntensity, 6, delta);
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