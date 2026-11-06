import React, { useState, useEffect } from 'react';
import { useScroll } from '@react-three/drei';
import mapBg from '../../assets/map-bg.png';
import logoIb from '../../assets/logo-ib.png';

export function MapIntro({ scrollProgress = 0 }) {
    const scroll = useScroll();
    const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
    const [hoveredPin, setHoveredPin] = useState(null);

    useEffect(() => {
        const handleMove = (e) => {
            setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
        };
        document.addEventListener('mousemove', handleMove);
        return () => document.removeEventListener('mousemove', handleMove);
    }, []);

    // 🎯 ZOOM Y TRANSICIÓN (De 0.00 a 0.08)
    const zoomProgress = Math.min(1, Math.max(0, scrollProgress / 0.08));
    const mapScale = 1.0 + zoomProgress * 0.8;
    const mapOpacity = Math.max(0, 1 - zoomProgress);
    const uiOpacity = Math.max(0, 1 - zoomProgress * 3.5);

    if (mapOpacity <= 0.005) return null;

    const pins = [
        { id: 'shire', label: 'Punto de Partida', name: 'La Comarca · Hobbiton', color: '#f59e0b', glow: 'rgba(245,158,11,0.6)', left: '30%', top: '50%', pulse: true },
        { id: 'forest', label: 'Capítulo II', name: 'El Bosque', color: '#34d399', glow: 'rgba(52,211,153,0.5)', left: '54%', top: '42%' },
        { id: 'moria', label: 'Capítulo III', name: 'Minas de Moria', color: '#f97316', glow: 'rgba(249,115,22,0.5)', left: '43%', top: '63%' },
        { id: 'erebor', label: 'Capítulo IV', name: 'Erebor', color: '#facc15', glow: 'rgba(250,204,21,0.5)', left: '72%', top: '35%' }
    ];

    return (
        <div
            className="absolute inset-0 z-50 overflow-hidden select-none pointer-events-none"
            style={{ opacity: mapOpacity, willChange: 'opacity' }}
        >
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transformOrigin: '30% 50%', transform: `scale(${mapScale})`, willChange: 'transform' }}
            >
                <img
                    src={mapBg}
                    alt="Mapa de la Tierra Media"
                    className="min-w-[140vw] min-h-[140vh] w-full h-full object-cover max-w-none transition-transform duration-75 ease-out"
                    style={{
                        transform: `translate(${(mousePos.x - 0.5) * -14}px, ${(mousePos.y - 0.5) * -10}px)`,
                        filter: 'sepia(0.25) contrast(1.15) brightness(0.95)',
                    }}
                    draggable={false}
                />

                {/* 🔥 EL EFECTO DE ILUMINACIÓN EN EL CURSOR REGRESA AQUÍ 🔥 */}
                <div
                    className="pointer-events-none absolute inset-0 z-10"
                    style={{
                        background: `radial-gradient(circle 420px at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(251,191,36,0.15), rgba(0,0,0,0.75) 80%)`
                    }}
                />

                <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.85)] z-10" />

                <div className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ opacity: uiOpacity }}>
                    {pins.map((pin) => (
                        <div
                            key={pin.id}
                            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group pointer-events-auto cursor-pointer"
                            style={{ left: pin.left, top: pin.top }}
                            onMouseEnter={() => setHoveredPin(pin.id)}
                            onMouseLeave={() => setHoveredPin(null)}
                            onClick={() => {
                                const targetPages = { shire: 1, forest: 3, moria: 5, erebor: 7 };
                                const scroller = scroll?.el;
                                if (scroller) scroller.scrollTo({ top: (scroller.scrollHeight / 8) * (targetPages[pin.id] || 1), behavior: 'smooth' });
                            }}
                        >
                            {pin.pulse && (
                                <>
                                    <span className="absolute w-12 h-12 rounded-full animate-ping" style={{ background: pin.glow }} />
                                    <span className="absolute w-8 h-8 rounded-full animate-pulse" style={{ background: pin.glow }} />
                                </>
                            )}
                            <div className="relative w-4 h-4 rounded-full border-2 border-white/90 flex items-center justify-center z-10" style={{ background: `radial-gradient(circle, white 20%, ${pin.color} 80%)`, boxShadow: `0 0 ${hoveredPin === pin.id ? '22px' : '12px'} ${pin.glow}`, transform: `scale(${hoveredPin === pin.id ? 1.4 : 1})`, transition: 'all 0.2s ease-out' }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-950" />
                            </div>
                            <div className="mt-2 px-2.5 py-1.5 bg-stone-950/90 backdrop-blur-md border rounded text-center z-10" style={{ borderColor: pin.color + '66', transform: `scale(${hoveredPin === pin.id ? 1.05 : 0.95}) translateY(${hoveredPin === pin.id ? -2 : 0}px)`, transition: 'all 0.2s ease-out', opacity: hoveredPin === pin.id ? 1 : pin.pulse ? 0.95 : 0.7 }}>
                                <span className="text-[9px] font-sans uppercase tracking-widest block font-bold" style={{ color: pin.color }}>{pin.label}</span>
                                <span className="text-xs font-cinzel font-bold text-amber-100">{pin.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <header className="relative z-30 w-full px-6 md:px-12 py-5 flex justify-end items-center pointer-events-none" style={{ opacity: uiOpacity }}>
                <a
                    href="mailto:ignacio6bruzzesi@gmail.com"
                    className="px-4 py-1.5 bg-amber-600/90 hover:bg-amber-500 text-stone-950 font-cinzel font-bold text-xs rounded border border-amber-300/60 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] pointer-events-auto cursor-pointer"
                >
                    HABLEMOS
                </a>
            </header>
        </div>
    );
}