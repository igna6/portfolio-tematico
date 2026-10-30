import React, { Component, Suspense, useMemo } from 'react';
import { useGLTF, Clone } from '@react-three/drei';



// 🛡️ Error Boundary especializado para activos 3D
export class ModelErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        // No capturar las Promesas internas de Suspense
        if (error && (typeof error.then === 'function' || error instanceof Promise)) {
            return { hasError: false };
        }
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        if (error && (typeof error.then === 'function' || error instanceof Promise)) return;
        console.warn(`[ModelErrorBoundary] Falló carga (${this.props.path}):`, error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback !== undefined ? this.props.fallback : null;
        }
        return this.props.children;
    }
}

// 📦 SafeModel: Wrapper de clonación óptima para reutilizar geometrías
export function SafeModel({ path, ...props }) {
    const { scene } = useGLTF(path);
    return <Clone object={scene} castShadow receiveShadow {...props} />;
}

// 🔥 Fuego 3D (fire.glb) - FALTABA ESTE EXPORT EN EL CÓDIGO ORIGINAL
export function FireModel(props) {
    return (
        <ModelErrorBoundary
            path="/models/fire.glb"
            fallback={
                <mesh position={props.position} scale={props.scale || 1}>
                    <coneGeometry args={[0.3, 0.8, 6]} />
                    <meshBasicMaterial color="#ff5500" />
                </mesh>
            }
        >
            <Suspense fallback={null}>
                <SafeModel path="/models/fire.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🌲 Pino individual
export function PineTree(props) {
    return (
        <ModelErrorBoundary
            path="/models/pine_tree.glb"
            fallback={
                <mesh position={props.position} scale={props.scale || 1}>
                    <coneGeometry args={[1.5, 4, 6]} />
                    <meshStandardMaterial color="#16381a" />
                </mesh>
            }
        >
            <Suspense fallback={null}>
                <SafeModel path="/models/pine_tree.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🌲🌲 Grupo tupido de pinos
export function PineCluster(props) {
    return (
        <ModelErrorBoundary
            path="/models/pine_cluster.glb"
            fallback={
                <mesh position={props.position} scale={props.scale || 1}>
                    <coneGeometry args={[2.5, 6, 6]} />
                    <meshStandardMaterial color="#0f2913" />
                </mesh>
            }
        >
            <Suspense fallback={null}>
                <SafeModel path="/models/pine_cluster.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🪨 Roca 1
export function Rock1(props) {
    return (
        <mesh position={props.position} scale={props.scale || 1} rotation={props.rotation}>
            <dodecahedronGeometry args={[0.6]} />
            <meshStandardMaterial color="#4b5563" roughness={0.9} />
        </mesh>
    );
}

// 🪨 Roca 2
export function Rock2(props) {
    return (
        <mesh position={props.position} scale={props.scale || 1} rotation={props.rotation}>
            <dodecahedronGeometry args={[0.5]} />
            <meshStandardMaterial color="#6b7280" roughness={0.9} />
        </mesh>
    );
}

// 🛤️ Sendero empedrado
export function StonePath(props) {
    return (
        <ModelErrorBoundary path="/models/stone_path.glb" fallback={null}>
            <Suspense fallback={null}>
                <SafeModel path="/models/stone_path.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🌿 Parche de pasto
export function GrassPatch(props) {
    return (
        <ModelErrorBoundary path="/models/grass_patch.glb" fallback={null}>
            <Suspense fallback={null}>
                <SafeModel path="/models/grass_patch.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🌾 Mata de pasto individual
export function GrassTuft(props) {
    return (
        <ModelErrorBoundary path="/models/grass_tuft.glb" fallback={null}>
            <Suspense fallback={null}>
                <SafeModel path="/models/grass_tuft.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🏛️ Portal de piedra en ruinas
export function StoneArch(props) {
    return (
        <ModelErrorBoundary
            path="/models/ruin_arch.glb"
            fallback={
                <group position={props.position} scale={props.scale || 1} rotation={props.rotation}>
                    <mesh position={[-1.8, 2.5, 0]}>
                        <boxGeometry args={[0.8, 5, 0.8]} />
                        <meshStandardMaterial color="#333842" roughness={0.8} />
                    </mesh>
                    <mesh position={[1.8, 2.5, 0]}>
                        <boxGeometry args={[0.8, 5, 0.8]} />
                        <meshStandardMaterial color="#333842" roughness={0.8} />
                    </mesh>
                    <mesh position={[0, 5.2, 0]}>
                        <boxGeometry args={[4.4, 0.9, 0.9]} />
                        <meshStandardMaterial color="#2d323a" roughness={0.8} />
                    </mesh>
                </group>
            }
        >
            <Suspense fallback={null}>
                <SafeModel path="/models/ruin_arch.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🏛️ Columna enana
export function DwarfColumn(props) {
    return (
        <ModelErrorBoundary
            path="/models/dwarf_pillar.glb"
            fallback={
                <group position={props.position} scale={props.scale || 1} rotation={props.rotation}>
                    <mesh position={[0, 4, 0]}>
                        <cylinderGeometry args={[0.9, 1.1, 8, 8]} />
                        <meshStandardMaterial color="#1a1c22" roughness={0.9} />
                    </mesh>
                </group>
            }
        >
            <Suspense fallback={null}>
                <SafeModel path="/models/dwarf_pillar.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🔥 Brasero
export function BrazierModel(props) {
    return (
        <ModelErrorBoundary
            path="/models/brazier.glb"
            fallback={
                <mesh position={props.position} scale={props.scale || 1}>
                    <cylinderGeometry args={[0.4, 0.2, 1, 6]} />
                    <meshStandardMaterial color="#1f1f23" metalness={0.8} />
                </mesh>
            }
        >
            <Suspense fallback={null}>
                <SafeModel path="/models/brazier.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 💰 Montículo de oro
export function GoldPileModel(props) {
    return (
        <ModelErrorBoundary
            path="/models/gold_pile.glb"
            fallback={
                <mesh position={props.position} scale={props.scale || 1}>
                    <sphereGeometry args={[1.2, 8, 6]} />
                    <meshStandardMaterial color="#eab308" metalness={0.9} roughness={0.2} />
                </mesh>
            }
        >
            <Suspense fallback={null}>
                <SafeModel path="/models/gold_pile.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🍄 Hongos bioluminiscentes
export function GlowingMushrooms(props) {
    return (
        <ModelErrorBoundary path="/models/glowing_mushrooms.glb" fallback={null}>
            <Suspense fallback={null}>
                <SafeModel path="/models/glowing_mushrooms.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🪵 Tronco caído
export function FallenLog(props) {
    return (
        <ModelErrorBoundary path="/models/fallen_log.glb" fallback={null}>
            <Suspense fallback={null}>
                <SafeModel path="/models/fallen_log.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🏮 Farol / Poste de linterna
export function LanternPost(props) {
    return (
        <ModelErrorBoundary path="/models/lantern_post.glb" fallback={null}>
            <Suspense fallback={null}>
                <SafeModel path="/models/lantern_post.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🚪 Reja de calabozo / Puerta enana
export function DungeonGate(props) {
    return (
        <ModelErrorBoundary path="/models/dungeon_gate.glb" fallback={null}>
            <Suspense fallback={null}>
                <SafeModel path="/models/dungeon_gate.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🛡️ Escudo enano
export function DwarfShield(props) {
    return (
        <ModelErrorBoundary path="/models/shield.glb" fallback={null}>
            <Suspense fallback={null}>
                <SafeModel path="/models/shield.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🔨 Yunque forja
export function AnvilModel(props) {
    return (
        <ModelErrorBoundary path="/models/anvil.glb" fallback={null}>
            <Suspense fallback={null}>
                <SafeModel path="/models/anvil.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 💎 Gema preciosa
export function GemModel(props) {
    return (
        <ModelErrorBoundary path="/models/gem.glb" fallback={null}>
            <Suspense fallback={null}>
                <SafeModel path="/models/gem.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🌉 Puente de madera
export function WoodenBridge(props) {
    return (
        <ModelErrorBoundary path="/models/wooden_bridge.glb" fallback={null}>
            <Suspense fallback={null}>
                <SafeModel path="/models/wooden_bridge.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🪧 Poste indicador
export function SignpostModel(props) {
    return (
        <ModelErrorBoundary path="/models/signpost.glb" fallback={null}>
            <Suspense fallback={null}>
                <SafeModel path="/models/signpost.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🛒 Carreta hobbit
export function CartModel(props) {
    return (
        <ModelErrorBoundary path="/models/cart.glb" fallback={null}>
            <Suspense fallback={null}>
                <SafeModel path="/models/cart.glb" {...props} />
            </Suspense>
        </ModelErrorBoundary>
    );
}

// 🧱 PARED DE MINA / CAVE WALL
export function WallModel(props) {
    const { scene } = useGLTF('/models/wall.glb');
    const clone = useMemo(() => scene.clone(), [scene]);

    return <primitive object={clone} {...props} receiveShadow />;
}

useGLTF.preload('/models/wall.glb');