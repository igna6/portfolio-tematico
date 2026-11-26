import React, { useRef, Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useScroll, Sparkles, Cloud } from '@react-three/drei';
import { createStoneTileTextures } from './ProceduralTextures';
import {
    DwarfColumn,
    StoneArch,
    BrazierModel,
    AnvilModel,
    FireModel,
    Rock1,
    Rock2
} from './Models';

const LAVA_VERTEX_SHADER = /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vWorldPos;
    void main() {
        vUv = uv;
        vec3 pos = position;
        float centerFactor = 1.0 - abs(uv.y - 0.5) * 2.0;
        pos.y += sin(uv.x * 40.0 - uTime * 2.5) * cos(uv.y * 12.0 + uTime * 1.6) * 0.02 * centerFactor;
        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
`;

const LAVA_FRAGMENT_SHADER = /* glsl */ `
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vWorldPos;

    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
        );
    }

    // FBM de 6 octavas para turbulencia volcánica fina y granulada (sin rayas)
    float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
        for (int i = 0; i < 6; i++) {
            v += a * noise(p);
            p = rot * p * 2.04 + vec2(1.7, 9.2);
            a *= 0.5;
        }
        return v;
    }

    void main() {
        float distFromCenter = abs(vUv.y - 0.5) * 2.0;

        // Coordenadas uniformes en mundo 1:1 (velocidad constante sin deformar en V)
        vec2 baseUv = vWorldPos.xz * 1.15 + vec2(0.0, uTime * 0.25);

        // Doble domain warping cruzado para remolinos orgánicos tipo magma real
        vec2 q = vec2(
            fbm(baseUv + vec2(0.0, 0.0)),
            fbm(baseUv + vec2(5.2, 1.3))
        );
        vec2 r = vec2(
            fbm(baseUv + 2.6 * q + vec2(1.7, 9.2) + uTime * 0.14),
            fbm(baseUv + 2.6 * q + vec2(8.3, 2.8) - uTime * 0.12)
        );

        float f = fbm(baseUv + 2.8 * r);
        float micro = fbm(baseUv * 3.4 - r * 1.5);

        // Contraste entre costra oscura, rojo sangre y núcleos amarillos
        float heat = clamp(f * 0.82 + micro * 0.28 - 0.08, 0.0, 1.0);
        heat = pow(heat, 1.15);

        // Borde natural irregular junto a la piedra
        float edgeNoise = (f - 0.5) * 0.24;
        float bankMask = 1.0 - smoothstep(0.68, 1.0, distFromCenter + edgeNoise);
        heat *= (0.25 + 0.75 * bankMask);

        // Paleta exacta de magma volcánico realista (negro rojizo -> rojo intenso -> naranja -> amarillo)
        vec3 darkCrust  = vec3(0.04, 0.006, 0.003);
        vec3 deepRed    = vec3(0.45, 0.025, 0.004);
        vec3 bloodRed   = vec3(0.95, 0.09,  0.008);
        vec3 vividOrange = vec3(1.55, 0.42, 0.02);
        vec3 brightGold = vec3(2.15, 1.35, 0.14);

        vec3 col = darkCrust;
        col = mix(col, deepRed,     smoothstep(0.12, 0.30, heat));
        col = mix(col, bloodRed,    smoothstep(0.30, 0.52, heat));
        col = mix(col, vividOrange, smoothstep(0.52, 0.72, heat));
        col = mix(col, brightGold,  smoothstep(0.74, 0.94, heat));

        // Fundido suave con la piedra del borde
        col *= smoothstep(1.0, 0.80, distFromCenter + edgeNoise * 0.5);

        gl_FragColor = vec4(col, 1.0);
    }
`;

// Crea una cinta plana horizontal siguiendo la curva del río con UV exactos [0..1]
function createRiverRibbonGeometry(curve, segments = 180, halfWidth = 1.75) {
    const positions = [];
    const uvs = [];
    const indices = [];
    const up = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const pt = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t).normalize();
        const side = new THREE.Vector3().crossVectors(tangent, up).normalize();

        const left = pt.clone().addScaledVector(side, -halfWidth);
        const right = pt.clone().addScaledVector(side, halfWidth);

        positions.push(left.x, pt.y, left.z);
        positions.push(right.x, pt.y, right.z);

        uvs.push(t, 0);
        uvs.push(t, 1);

        if (i < segments) {
            const base = i * 2;
            indices.push(base, base + 1, base + 2);
            indices.push(base + 1, base + 3, base + 2);
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
}

// 🔥 ANTORCHA DE COLUMNA CON PARPADEO DE FUEGO REFORZADO
function ColumnTorch({ position, rotation = [0, 0, 0], color = '#f97316' }) {
    const lightRef = useRef();

    useFrame((state) => {
        const time = state.clock.elapsedTime * 10;
        if (lightRef.current) {
            lightRef.current.intensity = 6.0 + Math.sin(time) * 1.8 + Math.cos(time * 2.7) * 1.1;
        }
    });

    return (
        <group position={position} rotation={rotation}>
            {/* Placa base de hierro */}
            <mesh position={[-0.08, -0.2, 0]}>
                <boxGeometry args={[0.08, 0.42, 0.26]} />
                <meshStandardMaterial color="#1a1c23" roughness={0.35} metalness={0.88} />
            </mesh>

            {/* Pernos decorativos */}
            <mesh position={[-0.03, -0.05, 0.08]}>
                <boxGeometry args={[0.03, 0.04, 0.04]} />
                <meshStandardMaterial color="#111217" roughness={0.3} metalness={0.9} />
            </mesh>
            <mesh position={[-0.03, -0.35, 0.08]}>
                <boxGeometry args={[0.03, 0.04, 0.04]} />
                <meshStandardMaterial color="#111217" roughness={0.3} metalness={0.9} />
            </mesh>
            <mesh position={[-0.03, -0.05, -0.08]}>
                <boxGeometry args={[0.03, 0.04, 0.04]} />
                <meshStandardMaterial color="#111217" roughness={0.3} metalness={0.9} />
            </mesh>
            <mesh position={[-0.03, -0.35, -0.08]}>
                <boxGeometry args={[0.03, 0.04, 0.04]} />
                <meshStandardMaterial color="#111217" roughness={0.3} metalness={0.9} />
            </mesh>

            {/* Anillo de sujeción */}
            <mesh position={[-0.02, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.065, 0.065, 0.1, 8]} />
                <meshStandardMaterial color="#14151a" roughness={0.4} metalness={0.85} />
            </mesh>

            {/* Mango de madera */}
            <mesh position={[0, -0.15, 0]} rotation={[0, 0, -0.35]}>
                <cylinderGeometry args={[0.04, 0.03, 0.65, 6]} />
                <meshStandardMaterial color="#2d1b0e" roughness={0.9} />
            </mesh>

            {/* Copa metálica */}
            <mesh position={[0.1, 0.1, 0]}>
                <cylinderGeometry args={[0.09, 0.06, 0.25, 6]} />
                <meshStandardMaterial color="#1c1e24" roughness={0.4} metalness={0.8} />
            </mesh>

            {/* Fuego 3D */}
            <Suspense fallback={null}>
                <FireModel position={[0.1, 0.28, 0]} scale={0.4} />
            </Suspense>

            {/* Luz puntual parpadeante */}
            <pointLight
                ref={lightRef}
                position={[0.1, 0.35, 0]}
                color={color}
                intensity={6.0}
                distance={15}
                decay={2}
            />
        </group>
    );
}

// 🔥 BRASERO DE PISO CON PARPADEO
function FireBrazier({ position, color = '#f97316' }) {
    const lightRef = useRef();

    useFrame((state) => {
        if (lightRef.current) {
            const time = state.clock.elapsedTime * 9.5;
            lightRef.current.intensity = 6.2 + Math.sin(time) * 1.6 + Math.cos(time * 2.3) * 0.9;
        }
    });

    return (
        <group position={position}>
            <Suspense fallback={null}>
                <BrazierModel position={[0, 0, 0]} scale={0.45} />
                <FireModel position={[0, 0.32, 0]} scale={0.5} />
            </Suspense>

            <pointLight
                ref={lightRef}
                position={[0, 0.5, 0]}
                color={color}
                intensity={6.0}
                distance={16}
                decay={2}
            />
        </group>
    );
}

// 🐍 CAMINO DE PIEDRA ENANA
export function MoriaCurvedPath() {
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.015, 12.0),
            new THREE.Vector3(0, 0.015, 8.0),
            new THREE.Vector3(-0.7, 0.015, 4.0),
            new THREE.Vector3(0.8, 0.015, 0.0),
            new THREE.Vector3(-0.6, 0.015, -4.0),
            new THREE.Vector3(0.5, 0.015, -8.0),
            new THREE.Vector3(0, 0.015, -14.0),
            new THREE.Vector3(0, 0.015, -22.0)
        ]);
    }, []);

    return (
        <mesh position={[0, 0, 0]} scale={[1, 0.006, 1]} receiveShadow>
            <tubeGeometry args={[curve, 180, 1.6, 16, false]} />
            <meshStandardMaterial
                color="#2a303d"
                roughness={0.75}
                metalness={0.25}
            />
        </mesh>
    );
}

// 🌋 RÍO DE MAGMA CON CHISPAS REALISTAS (MÁS PEQUEÑAS, BAJAS Y MENOS CANTIDAD)
function CurvedMagmaFissure() {
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.3, 0.025, 12.0),
            new THREE.Vector3(0.6, 0.025, 6.0),
            new THREE.Vector3(-0.7, 0.025, 0.0),
            new THREE.Vector3(0.8, 0.025, -6.0),
            new THREE.Vector3(-0.4, 0.025, -12.0),
            new THREE.Vector3(0.5, 0.025, -18.0),
            new THREE.Vector3(0.0, 0.025, -24.0)
        ]);
    }, []);

    const emberCount = 75;  // Cantidad moderada de chispas
    const maxHeight = 2.6;   // Altura máxima reducida para no invadir la interfaz

    // 1. Inicializar las chispas alineadas ceñidamente al magma
    const { emberPositions, emberColors, baseCoords, speeds, phases } = useMemo(() => {
        const pos = new Float32Array(emberCount * 3);
        const col = new Float32Array(emberCount * 3);
        const base = new Float32Array(emberCount * 2);
        const spd = new Float32Array(emberCount);
        const phs = new Float32Array(emberCount);

        for (let i = 0; i < emberCount; i++) {
            const t = Math.random();
            const point = curve.getPoint(t);

            // Origen estrecho sobre la trayectoria de la lava
            const bx = point.x + (Math.random() - 0.5) * 0.8;
            const bz = point.z + (Math.random() - 0.5) * 0.8;
            const y = Math.random() * maxHeight;

            base[i * 2] = bx;
            base[i * 2 + 1] = bz;

            pos[i * 3] = bx;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = bz;

            spd[i] = 0.004 + Math.random() * 0.008;
            phs[i] = Math.random() * Math.PI * 2;

            col[i * 3] = 1.0;
            col[i * 3 + 1] = 0.55;
            col[i * 3 + 2] = 0.08;
        }
        return {
            emberPositions: pos,
            emberColors: col,
            baseCoords: base,
            speeds: spd,
            phases: phs
        };
    }, [curve]);

    // 2. Animación de shader de lava (ref directa a uniforms) + chispas + pulso de calor
    const pointsRef = useRef();
    const lavaMatRef = useRef();
    const lavaLight1Ref = useRef();
    const lavaLight2Ref = useRef();
    const lavaLight3Ref = useRef();

    const riverGeometry = useMemo(() => createRiverRibbonGeometry(curve, 180, 1.8), [curve]);
    const lavaUniforms = useMemo(() => ({
        uTime: { value: 0 }
    }), []);

    useFrame((state, delta) => {
        if (lavaMatRef.current) {
            lavaMatRef.current.uniforms.uTime.value += delta;
        }

        const time = state.clock.elapsedTime;
        if (lavaLight1Ref.current) lavaLight1Ref.current.intensity = 6.8 + Math.sin(time * 2.1) * 1.1;
        if (lavaLight2Ref.current) lavaLight2Ref.current.intensity = 7.4 + Math.cos(time * 1.8) * 1.2;
        if (lavaLight3Ref.current) lavaLight3Ref.current.intensity = 6.8 + Math.sin(time * 2.5 + 1.0) * 1.1;

        if (!pointsRef.current) return;
        const pos = pointsRef.current.geometry.attributes.position.array;
        const col = pointsRef.current.geometry.attributes.color.array;

        for (let i = 0; i < emberCount; i++) {
            pos[i * 3 + 1] += speeds[i];
            const currentY = pos[i * 3 + 1];

            const bx = baseCoords[i * 2];
            const bz = baseCoords[i * 2 + 1];
            pos[i * 3] = bx + Math.sin(time * 2.5 + phases[i]) * 0.15;
            pos[i * 3 + 2] = bz + Math.cos(time * 2.0 + phases[i]) * 0.15;

            // Fade out acentuado (se disuelven velozmente al elevarse)
            const progress = currentY / maxHeight;
            const fade = Math.max(0.0, 1.0 - Math.pow(progress, 1.8));

            col[i * 3] = 1.0 * fade;
            col[i * 3 + 1] = 0.55 * fade;
            col[i * 3 + 2] = 0.08 * fade;

            if (currentY > maxHeight) {
                const t = Math.random();
                const newPoint = curve.getPoint(t);
                const newBx = newPoint.x + (Math.random() - 0.5) * 0.8;
                const newBz = newPoint.z + (Math.random() - 0.5) * 0.8;

                baseCoords[i * 2] = newBx;
                baseCoords[i * 2 + 1] = newBz;

                pos[i * 3] = newBx;
                pos[i * 3 + 1] = 0.03;
                pos[i * 3 + 2] = newBz;
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.geometry.attributes.color.needsUpdate = true;
    });

    return (
        <group position={[0, 0, 0]}>
            {/* Río de magma plano en cinta con UV continuos y movimiento real */}
            <mesh geometry={riverGeometry} position={[0, 0.015, 0]}>
                <shaderMaterial
                    ref={lavaMatRef}
                    vertexShader={LAVA_VERTEX_SHADER}
                    fragmentShader={LAVA_FRAGMENT_SHADER}
                    uniforms={lavaUniforms}
                    toneMapped={false}
                />
            </mesh>

            {/* ✨ CHISPAS FINAS Y DE TAMAÑO REDUCIDO */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={emberCount}
                        array={emberPositions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={emberCount}
                        array={emberColors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.05}
                    vertexColors={true}
                    transparent={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            <Suspense fallback={null}>
                {/* Rocas de borde */}
                <Rock1 position={[-1.6, 0, 7]} scale={0.6} rotation={[0, 0.4, 0]} />
                <Rock2 position={[1.7, 0, 5]} scale={0.7} rotation={[0, -0.6, 0]} />
                <Rock1 position={[-1.5, 0, 1]} scale={0.8} rotation={[0, 1.2, 0]} />
                <Rock2 position={[1.8, 0, -3]} scale={0.65} rotation={[0, 0.8, 0]} />
                <Rock1 position={[-1.6, 0, -7]} scale={0.8} rotation={[0, -0.5, 0]} />
                <Rock2 position={[1.5, 0, -11]} scale={0.75} rotation={[0, 1.5, 0]} />

                {/* Islotes de basalto semi-sumergidos rompiendo la simetría del cauce */}
                <Rock2 position={[0.25, -0.18, 4.5]} scale={0.52} rotation={[0.2, 0.7, 0.1]} />
                <Rock1 position={[-0.35, -0.2, -1.8]} scale={0.58} rotation={[-0.1, 2.1, 0.2]} />
                <Rock2 position={[0.15, -0.18, -8.5]} scale={0.55} rotation={[0.15, -1.1, 0]} />
            </Suspense>

            {/* Luces de la lava proyectadas hacia la caverna con pulso de calor */}
            <pointLight ref={lavaLight1Ref} position={[-0.2, 0.4, 6]} color="#ff4500" intensity={7.0} distance={18} decay={2} />
            <pointLight ref={lavaLight2Ref} position={[0.3, 0.4, 0]} color="#ff5500" intensity={7.5} distance={18} decay={2} />
            <pointLight ref={lavaLight3Ref} position={[-0.1, 0.4, -7]} color="#ff4500" intensity={7.0} distance={18} decay={2} />
        </group>
    );
}

// 🏛️ VIGA / ARCO ENANO DE BÓVEDA PARA DAR PROFUNDIDAD SUBTERRÁNEA
function DwarfCeilingVault({ z }) {
    return (
        <group position={[0, 6.2, z]}>
            {/* Viga principal */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[13.5, 0.75, 1.1]} />
                <meshStandardMaterial color="#1c2029" roughness={0.88} metalness={0.2} />
            </mesh>
            {/* Moldura inferior */}
            <mesh position={[0, -0.45, 0]}>
                <boxGeometry args={[12.8, 0.25, 0.7]} />
                <meshStandardMaterial color="#272c38" roughness={0.8} metalness={0.25} />
            </mesh>
            {/* Ménsulas angulares laterales */}
            <mesh position={[-5.1, -0.95, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[1.2, 1.2, 0.85]} />
                <meshStandardMaterial color="#181c24" roughness={0.9} metalness={0.2} />
            </mesh>
            <mesh position={[5.1, -0.95, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[1.2, 1.2, 0.85]} />
                <meshStandardMaterial color="#181c24" roughness={0.9} metalness={0.2} />
            </mesh>
        </group>
    );
}

export function MoriaSection() {
    const scroll = useScroll();
    const groupRef = useRef();
    const stoneTextures = useMemo(() => createStoneTileTextures(14, 16), []);

    useFrame(() => {
        if (!scroll) return;
        // Moria es exclusivamente visible entre los cortes negros de Cap II y Cap III
        const isNearMoria = scroll.offset >= 0.600 && scroll.offset < 0.850;
        if (groupRef.current) {
            groupRef.current.visible = isNearMoria;
        }
    });

    return (
        <group ref={groupRef} position={[-14, 0, -50]} name="moria-biome">
            {/* Suelo amplio de losas de piedra tallada con relieve real */}
            <mesh position={[0, 0.005, -6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[56, 68]} />
                <meshStandardMaterial
                    map={stoneTextures.map}
                    bumpMap={stoneTextures.bumpMap}
                    bumpScale={0.09}
                    roughness={0.85}
                    metalness={0.18}
                />
            </mesh>

            {/* Techo oscuro de la caverna y muros laterales de galería con profundidad */}
            <mesh position={[0, 7.6, -6]}>
                <boxGeometry args={[28, 1.4, 52]} />
                <meshStandardMaterial color="#0b0d12" roughness={0.96} />
            </mesh>
            <mesh position={[-10.5, 3.6, -6]} receiveShadow>
                <boxGeometry args={[2.5, 8.5, 52]} />
                <meshStandardMaterial color="#141820" roughness={0.92} metalness={0.15} />
            </mesh>
            <mesh position={[10.5, 3.6, -6]} receiveShadow>
                <boxGeometry args={[2.5, 8.5, 52]} />
                <meshStandardMaterial color="#141820" roughness={0.92} metalness={0.15} />
            </mesh>

            {/* Bóvedas transversales conectando cada par de columnas */}
            <DwarfCeilingVault z={6.0} />
            <DwarfCeilingVault z={0.5} />
            <DwarfCeilingVault z={-5.0} />
            <DwarfCeilingVault z={-10.7} />
            <DwarfCeilingVault z={-16.0} />

            {/* Humo volcánico tenue y cenizas flotantes en la galería */}
            <Cloud
                position={[0, 4.8, -6]}
                opacity={0.14}
                speed={0.18}
                width={16}
                depth={18}
                segments={12}
                color="#261914"
            />
            <Sparkles
                count={140}
                scale={[18, 6.5, 28]}
                position={[0, 3.0, -5]}
                size={2.2}
                speed={0.4}
                color="#fb923c"
            />

            {/* Gran portal enano al fondo fundiéndose en la niebla */}
            <Suspense fallback={null}>
                <StoneArch position={[0, 0, -21]} scale={2.4} rotation={[0, 0, 0]} />
            </Suspense>
            <pointLight position={[0, 3.2, -23]} color="#ea580c" intensity={4.0} distance={18} decay={2} />

            <MoriaCurvedPath />
            <CurvedMagmaFissure />

            {/* Luces ambientales generales de la caverna */}
            <pointLight position={[0, 7, -2]} color="#fb923c" intensity={6.5} distance={30} decay={2} />
            <pointLight position={[0, 6, -10]} color="#f97316" intensity={6.0} distance={28} decay={2} />
            <pointLight position={[0, 3, 5]} color="#fdba74" intensity={5.0} distance={22} decay={2} />

            {/* Portal de entrada */}
            <Suspense fallback={null}>
                <StoneArch position={[0, 0, 9]} scale={1.4} rotation={[0, 0, 0]} />
            </Suspense>

            {/* COLUMNAS ENANAS */}
            <Suspense fallback={null}>
                {/* Lado Izquierdo */}
                <DwarfColumn position={[-5.2, 0, 6.2]} scale={1.15} rotation={[0, 0.1, 0]} />
                <ColumnTorch position={[-4.3, 2.6, 6.2]} color="#f97316" />

                <DwarfColumn position={[-4.9, 0, 0.8]} scale={1.2} rotation={[0, -0.15, 0]} />
                <ColumnTorch position={[-4.0, 2.6, 0.8]} color="#ea580c" />

                <DwarfColumn position={[-5.4, 0, -4.8]} scale={1.1} rotation={[0, 0.25, 0]} />
                <ColumnTorch position={[-4.5, 2.6, -4.8]} color="#ea580c" />

                <DwarfColumn position={[-5.0, 0, -10.5]} scale={1.25} rotation={[0, -0.05, 0]} />
                <ColumnTorch position={[-4.1, 2.6, -10.5]} color="#f97316" />

                <DwarfColumn position={[-5.3, 0, -16.2]} scale={1.18} rotation={[0, 0.12, 0]} />
                <ColumnTorch position={[-4.4, 2.6, -16.2]} color="#ea580c" />

                {/* Lado Derecho */}
                <DwarfColumn position={[5.1, 0, 5.8]} scale={1.2} rotation={[0, -0.2, 0]} />
                <ColumnTorch position={[4.3, 2.6, 5.8]} rotation={[0, Math.PI, 0]} color="#f97316" />

                <DwarfColumn position={[5.4, 0, 0.2]} scale={1.15} rotation={[0, 0.1, 0]} />
                <ColumnTorch position={[4.5, 2.6, 0.2]} rotation={[0, Math.PI, 0]} color="#ea580c" />

                <DwarfColumn position={[4.8, 0, -5.3]} scale={1.25} rotation={[0, -0.1, 0]} />
                <ColumnTorch position={[3.9, 2.6, -5.3]} rotation={[0, Math.PI, 0]} color="#ea580c" />

                <DwarfColumn position={[5.3, 0, -10.9]} scale={1.12} rotation={[0, 0.2, 0]} />
                <ColumnTorch position={[4.4, 2.6, -10.9]} rotation={[0, Math.PI, 0]} color="#f97316" />

                <DwarfColumn position={[4.9, 0, -15.8]} scale={1.22} rotation={[0, -0.15, 0]} />
                <ColumnTorch position={[4.0, 2.6, -15.8]} rotation={[0, Math.PI, 0]} color="#ea580c" />

                <AnvilModel
                    position={[-3, 0.5, 1.4]}
                    scale={0.8}
                    rotation={[0.9, 2.3, -Math.PI / 4]}
                />
            </Suspense>

            {/* Rocas del entorno */}
            <Suspense fallback={null}>
                <Rock1 position={[-2.4, 0, 7.5]} scale={0.9} rotation={[0.4, 0.2, 0]} />
                <Rock2 position={[2.8, 0, -1.5]} scale={1.0} rotation={[-0.2, 1.1, 0.3]} />
                <Rock1 position={[-2.8, 0, -9.2]} scale={1.1} rotation={[0, 1.8, 0]} />
                <Rock2 position={[2.6, 0, -14.5]} scale={0.9} rotation={[0.5, -0.4, 0]} />
            </Suspense>
        </group>
    );
}