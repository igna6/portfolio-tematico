import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useScroll } from '@react-three/drei';
import { MapIntro } from './MapIntro';

// Hook que lee el valor exacto del scroll de Drei
function useDreiOffset() {
    const scroll = useScroll();
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        if (!scroll || !scroll.el) return;
        let animationFrameId;

        const loop = () => {
            setOffset(scroll.offset);
            animationFrameId = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(animationFrameId);
    }, [scroll]);

    return offset;
}

// 📌 TARJETA PURA: Aparece y desaparece estática. No bloquea el Scroll de la rueda.
const StaticChapterCard = ({ progress, start, end, position = 'center', children }) => {
    const fadeRange = 0.03;
    let opacity = 0;

    if (progress >= start && progress <= end) {
        if (progress < start + fadeRange) {
            opacity = (progress - start) / fadeRange;
        } else if (progress > end - fadeRange) {
            opacity = (end - progress) / fadeRange;
        } else {
            opacity = 1;
        }
    }

    if (opacity <= 0.01) return null;

    const posClasses = position === 'bottom'
        ? 'justify-end pb-16 md:pb-24 px-4'
        : 'justify-center px-4 md:px-8';

    return (
        <div className={`absolute inset-0 flex flex-col items-center pointer-events-none ${posClasses}`}>
            <div
                className="w-full max-w-5xl flex flex-col items-center transition-opacity duration-150 pointer-events-none"
                style={{ opacity }}
            >
                {children}
            </div>
        </div>
    );
};

const ScrollToChapterBtn = ({ targetPage, label = 'CONTINUAR TRAVESÍA ↓', color = 'amber' }) => {
    const scroll = useScroll();
    const scrollToPage = () => {
        if (scroll && scroll.el) {
            scroll.el.scrollTo({ top: (scroll.el.scrollHeight / 8) * targetPage, behavior: 'smooth' });
        }
    };
    const colorMap = {
        amber: 'bg-amber-600/90 hover:bg-amber-500 text-stone-950 border-amber-300/80 shadow-[0_0_20px_rgba(245,158,11,0.5)]',
        emerald: 'bg-emerald-600/90 hover:bg-emerald-500 text-stone-950 border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.5)]',
        orange: 'bg-orange-600/90 hover:bg-orange-500 text-stone-950 border-orange-400/80 shadow-[0_0_20px_rgba(249,115,22,0.5)]',
    };
    return (
        <button onClick={scrollToPage} className={`px-6 py-3 font-bold font-cinzel text-xs md:text-sm rounded border transition-all active:scale-95 cursor-pointer pointer-events-auto ${colorMap[color]}`}>
            {label}
        </button>
    );
};

export const OverlayUI = () => {
    const scroll = useScroll();
    const progress = useDreiOffset();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Si Drei no generó el contenedor fijo todavía, esperamos
    if (!scroll || !scroll.fixed || !mounted) return null;

    // 🔥 EL PORTAL: Envía todo el código directamente a "scroll.fixed"
    return createPortal(
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none text-amber-100 font-serif overflow-hidden">

            <MapIntro scrollProgress={progress} />

            {/* 🌻 CAPÍTULO I: LA COMARCA */}
            <StaticChapterCard progress={progress} start={0.14} end={0.34} position="bottom">
                <div className="text-center mb-6 max-w-xl bg-slate-950/80 backdrop-blur-md p-8 rounded-2xl border border-amber-500/40 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
                    <span className="font-garamond italic text-amber-300 text-xs md:text-sm tracking-widest uppercase block mb-2">
                        Capítulo I — Hobbiton
                    </span>
                    <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-amber-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                        Ignacio Developer
                    </h1>
                    <p className="font-garamond text-amber-200/90 text-xs md:text-base mt-3 max-w-md mx-auto leading-relaxed">
                        Desarrollador Full Stack apasionado por arquitecturas escalables y experiencias web inmersivas.
                    </p>
                </div>
                <ScrollToChapterBtn targetPage={3} label="CONTINUAR TRAVESÍA ↓" color="amber" />
            </StaticChapterCard>

            {/* 🌲 CAPÍTULO II: EL BOSQUE DEL CONOCIMIENTO */}
            <StaticChapterCard progress={progress} start={0.40} end={0.59} position="center">
                <div className="w-full">
                    <span className="font-garamond italic text-emerald-400 text-sm md:text-base text-center block mb-2 tracking-widest uppercase">
                        Capítulo II — El Bosque del Conocimiento
                    </span>
                    <h2 className="font-cinzel text-2xl md:text-4xl text-amber-300 font-bold text-center mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                        Proyectos &amp; Desarrollos
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="relative p-6 md:p-8 min-h-[220px] flex flex-col justify-between bg-slate-950/90 backdrop-blur-md rounded-xl border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            <div>
                                <span className="text-xs font-cinzel text-emerald-400 uppercase tracking-widest">Plataforma Web</span>
                                <h3 className="font-cinzel text-xl md:text-2xl font-bold text-amber-300 mt-1 mb-2">KICK Chat Giveaway</h3>
                                <p className="font-garamond text-slate-300 text-xs md:text-sm leading-relaxed">
                                    Sorteos en tiempo real mediante chat en vivo de Kick, con autenticación OAuth 2.1 y WebSockets.
                                </p>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800">
                                <span className="text-xs text-amber-400/90 font-cinzel">React · Node.js · Express</span>
                                <a href="#" className="text-xs font-cinzel text-emerald-300 hover:text-emerald-100 underline tracking-wider pointer-events-auto">Ver Código →</a>
                            </div>
                        </div>

                        <div className="relative p-6 md:p-8 min-h-[220px] flex flex-col justify-between bg-slate-950/90 backdrop-blur-md rounded-xl border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            <div>
                                <span className="text-xs font-cinzel text-emerald-400 uppercase tracking-widest">Simulador Financiero</span>
                                <h3 className="font-cinzel text-xl md:text-2xl font-bold text-amber-300 mt-1 mb-2">InnovaTrade Simulator</h3>
                                <p className="font-garamond text-slate-300 text-xs md:text-sm leading-relaxed">
                                    Simulador bursátil con Flask, integración a APIs financieras en tiempo real y métricas analíticas de riesgo.
                                </p>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800">
                                <span className="text-xs text-amber-400/90 font-cinzel">Python · Flask · SQL</span>
                                <a href="#" className="text-xs font-cinzel text-emerald-300 hover:text-emerald-100 underline tracking-wider pointer-events-auto">Ver Demo →</a>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <ScrollToChapterBtn targetPage={5} label="FORJAR HABILIDADES ↓" color="emerald" />
                    </div>
                </div>
            </StaticChapterCard>

            {/* 🕯️ CAPÍTULO III: MINAS DE MORIA */}
            <StaticChapterCard progress={progress} start={0.65} end={0.84} position="center">
                <div className="w-full max-w-4xl">
                    <span className="font-garamond italic text-orange-400 text-sm md:text-base text-center block mb-2 tracking-widest uppercase">
                        Capítulo III — Las Minas de Moria
                    </span>
                    <h2 className="font-cinzel text-2xl md:text-4xl text-amber-300 font-bold text-center mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
                        Habilidades &amp; Forja Técnica
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {[
                            { name: 'React / Vite', category: 'Frontend Core', border: 'border-amber-500/30' },
                            { name: 'Three.js / R3F', category: '3D Graphics', border: 'border-orange-500/40' },
                            { name: 'Node.js / Express', category: 'Backend Engine', border: 'border-amber-500/30' },
                            { name: 'Tailwind CSS', category: 'Styling & UI', border: 'border-orange-500/30' },
                            { name: 'Python / Flask', category: 'Data & APIs', border: 'border-amber-500/30' },
                            { name: 'WebSockets / REST', category: 'Real-Time Sync', border: 'border-orange-500/40' },
                            { name: 'PostgreSQL / SQL', category: 'Databases', border: 'border-amber-500/30' },
                            { name: 'Git & CI/CD', category: 'Workflow', border: 'border-orange-500/30' }
                        ].map((skill, idx) => (
                            <div key={idx} className={`p-4 bg-stone-950/90 backdrop-blur-md rounded-xl border ${skill.border} shadow-[0_0_20px_rgba(255,87,34,0.15)]`}>
                                <span className="block text-[10px] md:text-xs text-orange-400 uppercase tracking-widest font-cinzel">{skill.category}</span>
                                <h4 className="font-cinzel text-xs md:text-sm font-bold text-amber-200 mt-1">{skill.name}</h4>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-8">
                        <ScrollToChapterBtn targetPage={7} label="LLEGAR A EREBOR ↓" color="orange" />
                    </div>
                </div>
            </StaticChapterCard>

            {/* 💎 CAPÍTULO IV: EREBOR */}
            <StaticChapterCard progress={progress} start={0.89} end={1.00} position="center">
                <div className="max-w-2xl text-center bg-slate-950/85 backdrop-blur-md p-10 rounded-2xl border border-amber-500/40 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
                    <span className="font-garamond italic text-amber-400 text-sm md:text-base block mb-2 tracking-widest uppercase">
                        Capítulo IV — La Montaña Solitaria
                    </span>
                    <h2 className="font-cinzel text-3xl md:text-5xl text-amber-200 font-bold mb-4 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                        El Salón del Trono
                    </h2>
                    <p className="font-garamond text-amber-100/80 text-sm md:text-base mb-8 max-w-lg mx-auto leading-relaxed">
                        ¿Tienes un proyecto para forjar juntos? La travesía ha llegado a su destino.
                    </p>
                    <a
                        href="mailto:contacto@ejemplo.com"
                        className="inline-block px-8 py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold font-cinzel text-xs md:text-sm rounded border border-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all active:scale-95 pointer-events-auto cursor-pointer"
                    >
                        INICIAR CONVERSACIÓN ✉️
                    </a>
                </div>
            </StaticChapterCard>

        </div>,
        scroll.fixed
    );
};