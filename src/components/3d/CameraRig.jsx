import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

/*
  DISTRIBUCIÓN DE 8 PÁGINAS:
  ─────────────────────────────────────────────────────
  progress 0.000 → 0.125  : Página 1  → Pantalla del Mapa
                             (Cámara estática lejana sobre La Comarca)
  progress 0.125 → 0.375  : Páginas 2-3 → Capítulo I  La Comarca
  progress 0.375 → 0.625  : Páginas 4-5 → Capítulo II El Bosque
  progress 0.625 → 0.875  : Páginas 6-7 → Capítulo III Moria
  progress 0.875 → 1.000  : Página 8   → Capítulo IV  Erebor
  ─────────────────────────────────────────────────────
  MAP_END   = 1/8  = 0.125
  Cada capítulo ocupa 2/8  = 0.25 del rango total (excepto Erebor = 1/8)
  Para normalizar: chapterProgress = (progress - 0.125) / 0.875
*/

const MAP_END = 1 / 8; // 0.125

const chapterTracks = [
    // Capítulo I: La Comarca
    // Inicia lejano (vista de mapa → reveal) y se acerca caminando al Hobbit
    {
        startPos: [0, 5.0, 16.0],
        startLook: [0, 1.0, 0],
        endPos: [0.3, 2.0, 5.5],
        endLook: [0.2, 1.3, 0.0]
    },
    // Capítulo II: El Bosque del Conocimiento
    {
        startPos: [18, 3.2, -14.0],
        startLook: [18, 1.8, -26],
        endPos: [18, 2.2, -20.0],
        endLook: [18, 1.8, -27]
    },
    // Capítulo III: Las Minas de Moria
    {
        startPos: [-14, 2.2, -38.0],
        startLook: [-14, 1.6, -55],
        endPos: [-14, 1.7, -46.0],
        endLook: [-14, 1.6, -58]
    },
    // Capítulo IV: Erebor
    {
        startPos: [0, 3.2, -84.0],
        startLook: [0, 2.4, -101],
        endPos: [0, 2.4, -92.0],
        endLook: [0, 2.5, -101]
    }
];

export const CameraRig = ({ onProgressUpdate, onFadeUpdate }) => {
    const scroll = useScroll();
    const targetPos = useRef(new THREE.Vector3());
    const targetLook = useRef(new THREE.Vector3());
    const currentLook = useRef(new THREE.Vector3(0, 1.0, 0));
    const lastBiomeRef = useRef(-1);

    useFrame((state, delta) => {
        if (!scroll) return;

        const progress = THREE.MathUtils.clamp(scroll.offset, 0, 1);

        if (onProgressUpdate) onProgressUpdate(progress);

        let fadeOpacity = 0;
        let activeBiome = 0;
        let shouldSnap = false;

        if (progress < MAP_END) {
            // ── PANTALLA DEL MAPA: cámara estática en vista aérea lejana ──
            activeBiome = 0;
            targetPos.current.set(0, 5.5, 17.0);
            targetLook.current.set(0, 1.0, 0);
        } else {
            // ── CAPÍTULOS 3D ──────────────────────────────────────────────
            const chapterProgress = (progress - MAP_END) / (1 - MAP_END);

            const weights = [2, 2, 2, 1];
            const totalWeight = 7;
            const boundaries = weights.reduce((acc, w, i) => {
                const prev = i === 0 ? 0 : acc[acc.length - 1];
                acc.push(prev + w / totalWeight);
                return acc;
            }, []);

            let chapterIndex = 0;
            let localT = 0;
            for (let i = 0; i < boundaries.length; i++) {
                const start = i === 0 ? 0 : boundaries[i - 1];
                const end = boundaries[i];
                if (chapterProgress <= end || i === boundaries.length - 1) {
                    chapterIndex = i;
                    localT = THREE.MathUtils.clamp((chapterProgress - start) / (end - start), 0, 1);
                    break;
                }
            }

            const track = chapterTracks[chapterIndex];
            const nextTrack = chapterTracks[Math.min(chapterIndex + 1, chapterTracks.length - 1)];
            const hasNextChapter = chapterIndex < chapterTracks.length - 1;

            // CAMINATA: de 0% al 76% del capítulo (más tiempo para ver cada escena)
            const walkT = Math.min(localT / 0.76, 1.0);

            const basePos = new THREE.Vector3().lerpVectors(
                new THREE.Vector3(...track.startPos),
                new THREE.Vector3(...track.endPos),
                walkT
            );
            const baseLook = new THREE.Vector3().lerpVectors(
                new THREE.Vector3(...track.startLook),
                new THREE.Vector3(...track.endLook),
                walkT
            );

            // Head bobbing sutil durante la caminata
            if (localT > 0.02 && localT < 0.78) {
                const cycle = localT * Math.PI * 14;
                basePos.y += Math.sin(cycle) * 0.025;
                basePos.x += Math.cos(cycle * 0.5) * 0.012;
            }

            if (hasNextChapter) {
                // FADE OUT: 0.78 → 0.88 | NEGRO TOTAL: 0.88 → 0.92 | FADE IN: 0.92 → 1.00
                if (localT >= 0.78 && localT < 0.88) {
                    fadeOpacity = (localT - 0.78) / 0.10;
                    activeBiome = chapterIndex;
                    targetPos.current.copy(basePos);
                    targetLook.current.copy(baseLook);
                } else if (localT >= 0.88 && localT < 0.92) {
                    fadeOpacity = 1.0;
                    // Cambio de bioma exactamente bajo telón 100% negro
                    activeBiome = chapterIndex + 1;
                    targetPos.current.set(...nextTrack.startPos);
                    targetLook.current.set(...nextTrack.startLook);
                    shouldSnap = true;
                } else if (localT >= 0.92) {
                    fadeOpacity = 1.0 - (localT - 0.92) / 0.08;
                    activeBiome = chapterIndex + 1;
                    const nextT = (localT - 0.92) / 0.08;
                    targetPos.current.lerpVectors(
                        new THREE.Vector3(...nextTrack.startPos),
                        new THREE.Vector3(...nextTrack.endPos),
                        nextT * 0.05
                    );
                    targetLook.current.lerpVectors(
                        new THREE.Vector3(...nextTrack.startLook),
                        new THREE.Vector3(...nextTrack.endLook),
                        nextT * 0.05
                    );
                } else {
                    activeBiome = chapterIndex;
                    targetPos.current.copy(basePos);
                    targetLook.current.copy(baseLook);
                }
            } else {
                // Capítulo final (Erebor): sin fade out al final
                activeBiome = chapterIndex;
                targetPos.current.copy(basePos);
                targetLook.current.copy(baseLook);
            }
        }

        if (onFadeUpdate) onFadeUpdate(THREE.MathUtils.clamp(fadeOpacity, 0, 1));

        // Si cambió de bioma o está en el corte negro, snap instantáneo para no volar por el vacío
        if (lastBiomeRef.current !== activeBiome || shouldSnap) {
            state.camera.position.copy(targetPos.current);
            currentLook.current.copy(targetLook.current);
            lastBiomeRef.current = activeBiome;
        } else {
            state.camera.position.lerp(targetPos.current, Math.min(1, delta * 6.0));
            currentLook.current.lerp(targetLook.current, Math.min(1, delta * 6.0));
        }

        state.camera.lookAt(currentLook.current);
    });

    return null;
};
