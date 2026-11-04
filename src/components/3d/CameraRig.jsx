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

    useFrame((state, delta) => {
        if (!scroll) return;

        const progress = THREE.MathUtils.clamp(scroll.offset, 0, 1);

        if (onProgressUpdate) onProgressUpdate(progress);

        let fadeOpacity = 0;

        if (progress < MAP_END) {
            // ── PANTALLA DEL MAPA: cámara estática en vista aérea lejana ──
            targetPos.current.set(0, 5.5, 17.0);
            targetLook.current.set(0, 1.0, 0);
        } else {
            // ── CAPÍTULOS 3D ──────────────────────────────────────────────
            // Normalizar a 0-1 dentro del rango post-mapa (0.125 → 1.0)
            const chapterProgress = (progress - MAP_END) / (1 - MAP_END);

            // Cada capítulo ocupa un segmento igual del rango normalizado
            // (4 capítulos pero el último es más corto: ajustamos con pesos)
            // Pesos: [2, 2, 2, 1] / 7 → Comarca 2/7, Bosque 2/7, Moria 2/7, Erebor 1/7
            const weights = [2, 2, 2, 1];
            const totalWeight = 7;
            const boundaries = weights.reduce((acc, w, i) => {
                const prev = i === 0 ? 0 : acc[acc.length - 1];
                acc.push(prev + w / totalWeight);
                return acc;
            }, []);
            // boundaries = [2/7, 4/7, 6/7, 7/7]

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

            // CAMINATA: de 0% al 68% del tiempo en el capítulo
            const walkT = Math.min(localT / 0.68, 1.0);

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
            const t = localT;
            if (t > 0.02 && t < 0.98) {
                const cycle = t * Math.PI * 14;
                basePos.y += Math.sin(cycle) * 0.03;
                basePos.x += Math.cos(cycle * 0.5) * 0.014;
            }

            // FADE TO BLACK: entre el 68%-88% (fade out) y 88%-100% (fade in → inicio siguiente)
            if (localT >= 0.68 && localT <= 0.88) {
                fadeOpacity = (localT - 0.68) / 0.20;
            } else if (localT > 0.88) {
                fadeOpacity = 1.0 - (localT - 0.88) / 0.12;
            }

            if (localT >= 0.88) {
                const nextT = (localT - 0.88) / 0.12;
                targetPos.current.lerpVectors(
                    new THREE.Vector3(...nextTrack.startPos),
                    new THREE.Vector3(...nextTrack.endPos),
                    nextT * 0.08
                );
                targetLook.current.lerpVectors(
                    new THREE.Vector3(...nextTrack.startLook),
                    new THREE.Vector3(...nextTrack.endLook),
                    nextT * 0.08
                );
            } else {
                targetPos.current.copy(basePos);
                targetLook.current.copy(baseLook);
            }
        }

        if (onFadeUpdate) onFadeUpdate(fadeOpacity);

        state.camera.position.lerp(targetPos.current, delta * 5.5);
        state.camera.lookAt(targetLook.current);
    });

    return null;
};
