import React, { useRef, Suspense, useMemo, memo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useScroll, Sparkles, Cloud } from '@react-three/drei';
import { createShireGrassTextures, createDirtPathTexture } from './ProceduralTextures';
import {
    PineTree,
    Rock1,
    Rock2,
    StonePath,
    GrassPatch,
    GrassTuft,
    CartModel,
    SignpostModel,
    LanternPost
} from './Models';

const SKY_VERTEX_SHADER = /* glsl */ `
    varying vec3 vWorldDir;
    void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldDir = normalize(worldPos.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
`;

const SKY_FRAGMENT_SHADER = /* glsl */ `
    varying vec3 vWorldDir;
    void main() {
        vec3 dir = normalize(vWorldDir);
        float h = clamp(dir.y, -0.1, 1.0);

        // Degradado de tarde dorada (Golden Hour)
        vec3 horizonGlow = vec3(0.98, 0.72, 0.44);
        vec3 midSky      = vec3(0.55, 0.68, 0.85);
        vec3 zenithSky   = vec3(0.24, 0.46, 0.76);

        vec3 col = mix(horizonGlow, midSky, smoothstep(0.0, 0.28, h));
        col = mix(col, zenithSky, smoothstep(0.26, 0.82, h));

        // Sol bajo de tarde al fondo del valle
        vec3 sunDir = normalize(vec3(0.18, 0.21, -0.96));
        float sunDot = max(dot(dir, sunDir), 0.0);
        col += vec3(1.0, 0.75, 0.35) * pow(sunDot, 12.0) * 0.45;
        col += vec3(1.4, 1.15, 0.75) * pow(sunDot, 180.0) * 1.1;

        gl_FragColor = vec4(col, 1.0);
    }
`;

// 🌄 Cielo de tarde dorada exclusivo de La Comarca
function GoldenAfternoonSky() {
    return (
        <mesh renderOrder={-120}>
            <sphereGeometry args={[125, 32, 24]} />
            <shaderMaterial
                vertexShader={SKY_VERTEX_SHADER}
                fragmentShader={SKY_FRAGMENT_SHADER}
                side={THREE.BackSide}
                fog={false}
                depthWrite={false}
                toneMapped={false}
            />
        </mesh>
    );
}

// 🏔️ Cordillera procedural realista con crestas, laderas rocosas y cumbres nevadas
const DistantMountains = memo(function DistantMountains() {
    const mountainGeo = useMemo(() => {
        const width = 180;
        const depth = 64;
        const segW = 110;
        const segD = 40;
        const geo = new THREE.PlaneGeometry(width, depth, segW, segD);
        geo.rotateX(-Math.PI / 2);

        const pos = geo.attributes.position;
        const colors = new Float32Array(pos.count * 3);

        const hash = (x, z) => {
            const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
            return s - Math.floor(s);
        };
        const noise = (x, z) => {
            const ix = Math.floor(x), iz = Math.floor(z);
            const fx = x - ix, fz = z - iz;
            const ux = fx * fx * (3 - 2 * fx);
            const uz = fz * fz * (3 - 2 * fz);
            const a = hash(ix, iz), b = hash(ix + 1, iz);
            const c = hash(ix, iz + 1), d = hash(ix + 1, iz + 1);
            return a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz;
        };
        const ridgeFbm = (x, z) => {
            let sum = 0;
            let amp = 1.0;
            let freq = 0.045;
            for (let i = 0; i < 5; i++) {
                const n = 1.0 - Math.abs(noise(x * freq, z * freq) * 2.0 - 1.0);
                sum += n * n * amp;
                freq *= 2.08;
                amp *= 0.48;
            }
            return sum;
        };

        const valleyColor = new THREE.Color('#2d4a26');
        const rockColor   = new THREE.Color('#5a534c');
        const snowColor   = new THREE.Color('#efe4d4');
        const tmpColor    = new THREE.Color();

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);

            // Suavizar bordes del frente y los extremos para que nazca desde el valle
            const zNorm = (z + depth * 0.5) / depth; // 0 atrás, 1 adelante
            const frontFade = Math.sin(Math.min(1, Math.max(0, 1 - zNorm)) * Math.PI);
            const sideFade = 1.0 - Math.pow(Math.abs(x) / (width * 0.5), 2.5);

            // Dejar un paso suave en el centro lejano con picos imponentes a ambos lados
            const h = ridgeFbm(x + 25, z + 15) * 14.5 * frontFade * Math.max(0.2, sideFade);
            pos.setY(i, Math.max(-0.5, h - 0.8));

            const heightRatio = THREE.MathUtils.clamp(h / 18.0, 0, 1);
            if (heightRatio < 0.38) {
                tmpColor.copy(valleyColor).lerp(rockColor, heightRatio / 0.38);
            } else if (heightRatio < 0.76) {
                tmpColor.copy(rockColor);
            } else {
                tmpColor.copy(rockColor).lerp(snowColor, (heightRatio - 0.76) / 0.24);
            }

            colors[i * 3] = tmpColor.r;
            colors[i * 3 + 1] = tmpColor.g;
            colors[i * 3 + 2] = tmpColor.b;
        }

        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geo.computeVertexNormals();
        return geo;
    }, []);

    return (
        <mesh geometry={mountainGeo} position={[0, 0, -48]} receiveShadow>
            <meshStandardMaterial vertexColors roughness={0.92} metalness={0.05} />
        </mesh>
    );
});

// 🐍 CAMINO EXTENDIDO EN PERSPECTIVA (Se afina gradualmente hasta perderse en las montañas)
export function CurvedPath() {
    const dirtTextures = useMemo(() => createDirtPathTexture(), []);

    const pathGeo = useMemo(() => {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.012, 32.0),
            new THREE.Vector3(0, 0.012, 14.0),
            new THREE.Vector3(0, 0.012, 5.0),
            new THREE.Vector3(0.1, 0.012, 0.6),
            new THREE.Vector3(0.6, 0.012, -2.5),
            new THREE.Vector3(1.8, 0.012, -6.5),
            new THREE.Vector3(3.2, 0.012, -12.0),
            new THREE.Vector3(4.5, 0.012, -20.0),
            new THREE.Vector3(5.2, 0.012, -32.0),
            new THREE.Vector3(5.6, 0.012, -46.0)
        ]);

        const segments = 160;
        const positions = [];
        const uvs = [];
        const indices = [];
        const up = new THREE.Vector3(0, 1, 0);

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const pt = curve.getPointAt(t);
            const tangent = curve.getTangentAt(t).normalize();
            const side = new THREE.Vector3().crossVectors(tangent, up).normalize();

            // Empieza ancho cerca del Hobbit y se afina suavemente hacia las montañas
            const taper = THREE.MathUtils.lerp(1.45, 0.32, Math.pow(t, 1.35));

            const left = pt.clone().addScaledVector(side, -taper);
            const right = pt.clone().addScaledVector(side, taper);

            positions.push(left.x, pt.y, left.z);
            positions.push(right.x, pt.y, right.z);

            uvs.push(t * 6.0, 0);
            uvs.push(t * 6.0, 1);

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
    }, []);

    return (
        <mesh geometry={pathGeo} receiveShadow>
            <meshStandardMaterial
                map={dirtTextures.map}
                bumpMap={dirtTextures.bumpMap}
                bumpScale={0.05}
                roughness={0.95}
                metalness={0.04}
            />
        </mesh>
    );
}

// 🌾 VEGETACIÓN OPTIMIZADA Y MEMOIZADA (60 FPS Garantes)
const DenseVegetation = memo(function DenseVegetation() {
    const vegetationItems = useMemo(() => {
        const items = [];
        let seed = 42;
        const random = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        const getPathXAtZ = (z) => {
            if (z > 5) return 0;
            if (z > -1.6) return 0.1 * (5 - z) / 6.6;
            if (z > -8.2) return 0.5 + (1.2 * (-1.6 - z) / 6.6);
            if (z > -20) return 3.0 + (2.5 * (-8.2 - z) / 11.8);
            return 5.5 + (1.5 * (-20 - z) / 15);
        };

        // 50 elementos cerca del claro principal (sin pastos gigantes flotando en la bruma lejana)
        for (let i = 0; i < 50; i++) {
            const x = (random() - 0.5) * 22;
            const z = -10.5 + random() * 22.5; // entre z=-10.5 y z=+12

            const pathX = getPathXAtZ(z);
            const distToPath = Math.abs(x - pathX);

            if (distToPath > 1.75) {
                const type = random() > 0.35 ? 'patch' : 'tuft';
                const scale = type === 'tuft' ? 0.42 + random() * 0.35 : 0.65 + random() * 0.45;
                const rotation = random() * Math.PI * 2;
                items.push({ id: i, type, x, z, scale, rotation });
            }
        }
        return items;
    }, []);

    return (
        <Suspense fallback={null}>
            {vegetationItems.map((item) =>
                item.type === 'patch' ? (
                    <GrassPatch
                        key={item.id}
                        position={[item.x, -0.02, item.z]}
                        scale={item.scale}
                        rotation={[0, item.rotation, 0]}
                    />
                ) : (
                    <GrassTuft
                        key={item.id}
                        position={[item.x, -0.02, item.z]}
                        scale={item.scale}
                        rotation={[0, item.rotation, 0]}
                    />
                )
            )}
        </Suspense>
    );
});

export function ShireEnvironment() {
    const scroll = useScroll();
    const groupRef = useRef();
    const grassTextures = useMemo(() => createShireGrassTextures(16, 16), []);

    useFrame(() => {
        if (!scroll) return;
        // La comarca es exclusivamente visible hasta el corte negro (~0.350)
        const isNearShire = scroll.offset < 0.350;
        if (groupRef.current) {
            groupRef.current.visible = isNearShire;
        }
    });

    return (
        <group ref={groupRef} name="shire-biome">
            {/* 🌅 CIELO DE TARDE DORADA Y CORDILLERA REALISTA AL FONDO */}
            <GoldenAfternoonSky />
            <DistantMountains />

            {/* 🌿 PISO BASE DE PASTO ORGÁNICO CON TEXTURA Y RELIEVE */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, -0.02, 0]}
                receiveShadow
            >
                <circleGeometry args={[55, 64]} />
                <meshStandardMaterial
                    map={grassTextures.map}
                    bumpMap={grassTextures.bumpMap}
                    bumpScale={0.07}
                    roughness={0.92}
                />
            </mesh>

            {/* ⛰️ LOMAS SUAVES A LOS COSTADOS DEL VALLE (Sin cortar el sendero) */}
            <mesh position={[-26, -2.0, -18]} scale={[1.6, 0.32, 1.3]} receiveShadow>
                <sphereGeometry args={[12, 24, 16]} />
                <meshStandardMaterial map={grassTextures.map} roughness={0.95} />
            </mesh>
            <mesh position={[28, -2.2, -17]} scale={[1.7, 0.34, 1.3]} receiveShadow>
                <sphereGeometry args={[12, 24, 16]} />
                <meshStandardMaterial map={grassTextures.map} roughness={0.95} />
            </mesh>

            {/* ✨ Polen dorado flotando en la luz de la tarde y nubes altas */}
            <Sparkles
                count={90}
                scale={[24, 7, 24]}
                position={[0, 2.8, -2]}
                size={2.2}
                speed={0.25}
                color="#fef08a"
            />
            <Cloud
                position={[-14, 13, -38]}
                opacity={0.34}
                speed={0.08}
                width={26}
                depth={8}
                segments={12}
                color="#ffebd2"
            />
            <Cloud
                position={[16, 15, -42]}
                opacity={0.3}
                speed={0.07}
                width={28}
                depth={8}
                segments={12}
                color="#ffe0b5"
            />

            {/* 🐍 CAMINO CONTINUO */}
            <CurvedPath />

            {/* 🌾 MANTO DE VEGETACIÓN OPTIMIZADO */}
            <DenseVegetation />

            {/* MOSAICOS DE PIEDRAS (Reduciéndose suavemente con la perspectiva del sendero) */}
            <Suspense fallback={null}>
                <StonePath position={[0, 0.02, 5.0]} scale={0.95} rotation={[0, 0.1, 0]} />
                <StonePath position={[0, 0.02, 2.8]} scale={0.95} rotation={[0, -0.15, 0]} />
                <StonePath position={[0.05, 0.02, 0.6]} scale={0.92} rotation={[0, 0.2, 0]} />
                <StonePath position={[0.45, 0.02, -1.6]} scale={0.86} rotation={[0, -0.1, 0]} />
                <StonePath position={[1.05, 0.02, -3.8]} scale={0.80} rotation={[0, 0.25, 0]} />
                <StonePath position={[1.8, 0.02, -6.2]} scale={0.72} rotation={[0, -0.2, 0]} />
                <StonePath position={[2.6, 0.02, -8.8]} scale={0.64} rotation={[0, 0.3, 0]} />
                <StonePath position={[3.2, 0.02, -11.6]} scale={0.56} rotation={[0, -0.15, 0]} />
                <StonePath position={[3.8, 0.02, -14.8]} scale={0.48} rotation={[0, 0.2, 0]} />
                <StonePath position={[4.3, 0.02, -18.5]} scale={0.40} rotation={[0, -0.1, 0]} />
            </Suspense>

            {/* ELEMENTOS PRINCIPALES */}
            <Suspense fallback={null}>
                <LanternPost position={[2.8, 0, 1.8]} scale={0.85} rotation={[0, -0.6, 0]} />
                <pointLight position={[2.8, 1.9, 1.8]} color="#fde047" intensity={2.5} distance={10} decay={2} />

                <SignpostModel position={[-2.8, 0, 1.0]} scale={0.8} rotation={[0, 0.5, 0]} />
                <CartModel position={[-4.5, 0, -1.5]} scale={2.5} rotation={[0, 0.3, 0]} />
            </Suspense>

            {/* ROCAS Y DETALLES DEL SUELO */}
            <Suspense fallback={null}>
                <Rock1 position={[-2.6, 0, 3.8]} scale={0.6} rotation={[0, 0.4, 0]} />
                <Rock2 position={[2.5, 0, 2.6]} scale={0.7} rotation={[0, -1.1, 0]} />
                <Rock1 position={[3.8, 0, 4.2]} scale={0.9} rotation={[0, 0.8, 0]} />
                <Rock1 position={[-3.5, 0, -2.5]} scale={1.1} rotation={[0, 2.2, 0]} />
                <Rock2 position={[3.8, 0, -2.2]} scale={0.8} rotation={[0, 0.8, 0]} />
                <Rock1 position={[-5.2, 0, -8.0]} scale={1.3} rotation={[0, 1.1, 0]} />
                <Rock2 position={[6.0, 0, -12.0]} scale={1.4} rotation={[0, 0.5, 0]} />
            </Suspense>

            {/* 🌲 BOSQUE DE PINOS */}
            <Suspense fallback={null}>
                {/* Lateral Izquierdo */}
                <PineTree position={[-4.5, 0, 12.0]} scale={1.2} />
                <PineTree position={[-7.0, 0, 9.0]} scale={1.5} />
                <PineTree position={[-4.5, 0, 6.0]} scale={1.0} />
                <PineTree position={[-6.0, 0, 3.5]} scale={1.3} />
                <PineTree position={[-5.0, 0, 0.5]} scale={1.1} />
                <PineTree position={[-7.5, 0, 1.0]} scale={1.4} />
                <PineTree position={[-8.5, 0, 5.0]} scale={1.5} />
                <PineTree position={[-6.5, 0, -4.0]} scale={1.2} />
                <PineTree position={[-9.0, 0, -3.0]} scale={1.6} />
                <PineTree position={[-8.0, 0, -8.0]} scale={1.7} />
                <PineTree position={[-5.5, 0, -10.0]} scale={1.3} />
                <PineTree position={[-11.0, 0, -6.0]} scale={1.8} />

                {/* Lateral Derecho */}
                <PineTree position={[5.5, 0, 11.0]} scale={1.3} />
                <PineTree position={[7.5, 0, 8.5]} scale={1.4} />
                <PineTree position={[4.5, 0, 5.5]} scale={1.1} rotation={[0, 0.4, 0]} />
                <PineTree position={[6.2, 0, 3.0]} scale={1.3} rotation={[0, -0.6, 0]} />
                <PineTree position={[5.2, 0, 0.2]} scale={1.05} />
                <PineTree position={[7.8, 0, 1.5]} scale={1.5} rotation={[0, 0.8, 0]} />
                <PineTree position={[9.0, 0, 4.5]} scale={1.6} />
                <PineTree position={[6.8, 0, -4.5]} scale={1.25} />
                <PineTree position={[9.5, 0, -3.5]} scale={1.65} />
                <PineTree position={[8.5, 0, -8.5]} scale={1.7} />
                <PineTree position={[6.0, 0, -11.0]} scale={1.35} />
                {/* Apertura natural del valle hacia las montañas lejanas (sin conos tapando el centro) */}
                <PineTree position={[-5.2, 0, -8.5]} scale={1.5} />
                <PineTree position={[5.6, 0, -8.5]} scale={1.5} />
            </Suspense>
        </group>
    );
}