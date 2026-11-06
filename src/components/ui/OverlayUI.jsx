import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useScroll } from '@react-three/drei';
import { MapIntro } from './MapIntro';
import { motion } from 'framer-motion';
import {
    Atom,
    Box,
    Server,
    Palette,
    Terminal,
    Zap,
    Database,
    GitBranch,
    ExternalLink,
    ChevronDown,
    Mail,
    Cpu,
    Sparkles,
    Scan
} from 'lucide-react';

// 📌 10 HABILIDADES Y TECNOLOGÍAS PRINCIPALES
const SKILLS_DATA = [
    { title: "React 19 / Vite", category: "FRONTEND CORE", icon: Atom, accent: "from-cyan-500/20 to-blue-500/20", color: "text-cyan-400", border: "group-hover:border-cyan-400/60" },
    { title: "Three.js / R3F", category: "3D & SHADERS", icon: Box, accent: "from-purple-500/20 to-indigo-500/20", color: "text-purple-400", border: "group-hover:border-purple-400/60" },
    { title: "Node.js / Express", category: "BACKEND ENGINE", icon: Server, accent: "from-emerald-500/20 to-green-500/20", color: "text-emerald-400", border: "group-hover:border-emerald-400/60" },
    { title: "PostgreSQL / SQL Server", category: "BASES DE DATOS", icon: Database, accent: "from-blue-600/20 to-indigo-600/20", color: "text-blue-400", border: "group-hover:border-blue-400/60" },
    { title: "WebSockets / REST API", category: "REAL-TIME SYNC", icon: Zap, accent: "from-orange-500/20 to-red-500/20", color: "text-orange-400", border: "group-hover:border-orange-400/60" },
    { title: "Python / Data Wrangling", category: "ANALYTICS & SCRAPING", icon: Terminal, accent: "from-amber-500/20 to-yellow-500/20", color: "text-amber-400", border: "group-hover:border-amber-400/60" },
    { title: "OpenCV / NumPy", category: "VISIÓN COMPUTACIONAL 3D", icon: Scan, accent: "from-teal-500/20 to-cyan-500/20", color: "text-teal-400", border: "group-hover:border-teal-400/60" },
    { title: "C++ / POO", category: "ESTRUCTURAS & ALGORITMOS", icon: Cpu, accent: "from-rose-500/20 to-red-500/20", color: "text-rose-400", border: "group-hover:border-rose-400/60" },
    { title: "AI Code Assistants", category: "PROMPT ENGINEERING", icon: Sparkles, accent: "from-violet-500/20 to-fuchsia-500/20", color: "text-violet-400", border: "group-hover:border-violet-400/60" },
    { title: "Git & GitHub", category: "VERSIÓN & CI/CD", icon: GitBranch, accent: "from-rose-500/20 to-orange-500/20", color: "text-rose-400", border: "group-hover:border-rose-400/60" },
];

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

// 📌 CONTENEDOR ESTÁTICO POR CAPÍTULO CON SOPORTE PARA MANTENER VISIBLE (keepVisible)
const StaticChapterCard = ({ progress, start, end, position = 'center', keepVisible = false, children }) => {
    const fadeRange = 0.035;
    let opacity = 0;

    if (progress >= start && (keepVisible || progress <= end)) {
        if (progress < start + fadeRange) {
            opacity = (progress - start) / fadeRange;
        } else if (!keepVisible && progress > end - fadeRange) {
            opacity = (end - progress) / fadeRange;
        } else {
            opacity = 1;
        }
    }

    if (opacity <= 0.01) return null;

    const posClasses = position === 'bottom'
        ? 'justify-end pb-10 md:pb-14 px-4'
        : 'justify-center px-4 md:px-8';

    return (
        <div className={`absolute inset-0 flex flex-col items-center pointer-events-none ${posClasses}`}>
            <div
                className="w-full max-w-5xl flex flex-col items-center transition-opacity duration-300 pointer-events-none"
                style={{ opacity }}
            >
                {children}
            </div>
        </div>
    );
};

// 📌 BOTÓN DE NAVEGACIÓN ENTRE CAPÍTULOS
const ScrollToChapterBtn = ({ targetPage, label = 'CONTINUAR TRAVESÍA', color = 'amber' }) => {
    const scroll = useScroll();
    const scrollToPage = () => {
        if (scroll && scroll.el) {
            scroll.el.scrollTo({ top: (scroll.el.scrollHeight / 8) * targetPage, behavior: 'smooth' });
        }
    };
    const colorMap = {
        amber: 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.4)]',
        emerald: 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 border-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.4)]',
        orange: 'bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 hover:from-orange-500 hover:to-orange-400 text-slate-950 border-orange-300 shadow-[0_0_25px_rgba(249,115,22,0.4)]',
    };
    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={scrollToPage}
            className={`px-7 py-3.5 font-bold font-cinzel text-xs md:text-sm tracking-widest rounded-xl border transition-all cursor-pointer pointer-events-auto flex items-center gap-2 ${colorMap[color]}`}
        >
            <span>{label}</span>
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
        </motion.button>
    );
};

export const OverlayUI = () => {
    const scroll = useScroll();
    const progress = useDreiOffset();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Función para volver al inicio (El mapa)
    const handleReturnToMap = () => {
        if (scroll && scroll.el) {
            scroll.el.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (!scroll || !scroll.fixed || !mounted) return null;

    return createPortal(
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none text-amber-100 overflow-hidden">

            {/* 👑 LOGO IB. - FIJO EN TODA LA NAVEGACIÓN (Lleva al mapa) */}
            <button
                onClick={handleReturnToMap}
                className="fixed top-6 left-6 z-[100] w-12 h-12 flex items-center justify-center bg-[#090d16]/90 border border-slate-700/60 rounded backdrop-blur-md hover:border-amber-500/60 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer pointer-events-auto"
                aria-label="Volver al mapa"
            >
                <span className="font-cinzel text-slate-300 font-bold text-xl tracking-wider group-hover:text-amber-400 transition-colors duration-300">
                    IB.
                </span>
            </button>

            <MapIntro scrollProgress={progress} />

            {/* 🌻 CAPÍTULO I: LA COMARCA (HERO) */}
            <StaticChapterCard progress={progress} start={0.14} end={0.34} position="bottom">
                <div className="pointer-events-auto text-center mb-6 max-w-xl bg-slate-950/85 backdrop-blur-2xl p-8 md:p-10 rounded-2xl border border-amber-500/30 shadow-[0_16px_48px_rgba(0,0,0,0.9)] relative overflow-hidden group">
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 mb-4">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="font-sans text-amber-300 text-xs tracking-widest uppercase font-semibold">
                            Capítulo I — Hobbiton
                        </span>
                    </div>
                    <h1 className="font-cinzel text-3xl md:text-5xl font-black text-amber-100 tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                        Ignacio Bruzzesi
                    </h1>
                    <p className="font-sans text-slate-300 text-sm md:text-base mt-3 max-w-lg mx-auto leading-relaxed">
                        Estudiante avanzado de Ingeniería en Sistemas de Información (UTN Rosario) y Desarrollador Full Stack. Especializado en JavaScript, React, Node.js y experiencias 3D interactivas.
                    </p>
                </div>
                <ScrollToChapterBtn targetPage={3} label="CONTINUAR TRAVESÍA" color="amber" />
            </StaticChapterCard>

            {/* 🌲 CAPÍTULO II: EL BOSQUE DEL CONOCIMIENTO (PROYECTOS) */}
            <StaticChapterCard progress={progress} start={0.38} end={0.58} position="center">
                <div className="w-full max-w-5xl">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30 mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-sans text-emerald-300 text-xs tracking-widest uppercase font-semibold">
                                Capítulo II — El Bosque del Conocimiento
                            </span>
                        </div>
                        <h2 className="font-cinzel text-2xl md:text-4xl text-amber-100 font-extrabold drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                            Proyectos &amp; Desarrollos
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Proyecto 1 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="pointer-events-auto group relative p-6 md:p-8 flex flex-col justify-between bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-emerald-500/30 shadow-[0_12px_36px_rgba(0,0,0,0.85)] hover:border-emerald-400/70 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)] transition-all duration-300"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-sans font-bold text-emerald-400 uppercase tracking-widest px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/30">
                                        Plataforma Web en Vivo
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono">2026</span>
                                </div>
                                <h3 className="font-cinzel text-xl md:text-2xl font-bold text-amber-100 group-hover:text-emerald-300 transition-colors">
                                    KICK Chat Giveaway
                                </h3>
                                <p className="font-sans text-slate-300 text-xs md:text-sm leading-relaxed mt-3">
                                    Aplicación interactiva para gestionar sorteos en tiempo real sincronizando el chat en vivo de Kick mediante WebSockets para alta concurrencia.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 text-[10px] font-mono rounded-md bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">React</span>
                                    <span className="px-2.5 py-1 text-[10px] font-mono rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">Node.js</span>
                                    <span className="px-2.5 py-1 text-[10px] font-mono rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/40">WebSockets</span>
                                </div>
                                <a href="https://github.com/igna6" target="_blank" rel="noreferrer" className="text-xs font-sans font-bold text-emerald-400 hover:text-emerald-200 tracking-wider flex items-center gap-1.5 transition-colors">
                                    <span>Código</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </motion.div>

                        {/* Proyecto 2 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="pointer-events-auto group relative p-6 md:p-8 flex flex-col justify-between bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-emerald-500/30 shadow-[0_12px_36px_rgba(0,0,0,0.85)] hover:border-emerald-400/70 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)] transition-all duration-300"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-sans font-bold text-emerald-400 uppercase tracking-widest px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/30">
                                        Simulador Financiero
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono">2026</span>
                                </div>
                                <h3 className="font-cinzel text-xl md:text-2xl font-bold text-amber-100 group-hover:text-emerald-300 transition-colors">
                                    InnovaTrade Simulator
                                </h3>
                                <p className="font-sans text-slate-300 text-xs md:text-sm leading-relaxed mt-3">
                                    Plataforma bursátil con pipeline de datos en Python Pandas, consumo de Yahoo Finance API y Data Wrangling para análisis de mercado.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 text-[10px] font-mono rounded-md bg-blue-950/60 text-blue-300 border border-blue-800/40">Python</span>
                                    <span className="px-2.5 py-1 text-[10px] font-mono rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/40">Pandas</span>
                                    <span className="px-2.5 py-1 text-[10px] font-mono rounded-md bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">SQL</span>
                                </div>
                                <a href="https://github.com/igna6" target="_blank" rel="noreferrer" className="text-xs font-sans font-bold text-emerald-400 hover:text-emerald-200 tracking-wider flex items-center gap-1.5 transition-colors">
                                    <span>Demo</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <ScrollToChapterBtn targetPage={5} label="FORJAR HABILIDADES" color="emerald" />
                    </div>
                </div>
            </StaticChapterCard>

            {/* 🕯️ CAPÍTULO III: MINAS DE MORIA (10 TECNOLOGÍAS) */}
            <StaticChapterCard progress={progress} start={0.62} end={0.82} position="center">
                <div className="w-full max-w-5xl">
                    <div className="text-center mb-5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-400/30 mb-2">
                            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                            <span className="font-sans text-orange-300 text-xs tracking-widest uppercase font-semibold">
                                Capítulo III — Las Minas de Moria
                            </span>
                        </div>
                        <h2 className="font-cinzel text-2xl md:text-4xl text-amber-100 font-extrabold drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                            Habilidades &amp; Forja Técnica
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-3.5">
                        {SKILLS_DATA.map((skill) => {
                            const Icon = skill.icon;
                            return (
                                <motion.div
                                    key={skill.title}
                                    whileHover={{ y: -4, scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                    className={`pointer-events-auto group relative overflow-hidden rounded-2xl bg-slate-950/85 border border-orange-500/25 p-3.5 md:p-4 backdrop-blur-xl transition-all duration-300 ${skill.border} hover:shadow-[0_0_25px_rgba(249,115,22,0.25)] flex flex-col justify-between`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${skill.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                                    <div className="flex items-center justify-between mb-2.5 relative z-10">
                                        <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/60 text-amber-400 group-hover:text-amber-300 group-hover:border-amber-400/50 group-hover:shadow-[0_0_12px_rgba(251,191,36,0.4)] transition-all duration-300">
                                            <Icon className="w-4 h-4 stroke-[2.2]" />
                                        </div>
                                        <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 group-hover:text-amber-300 transition-colors uppercase">
                                            {skill.category}
                                        </span>
                                    </div>

                                    <h3 className={`font-sans text-xs md:text-sm font-bold ${skill.color} relative z-10 tracking-wide`}>
                                        {skill.title}
                                    </h3>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="flex justify-center mt-6">
                        <ScrollToChapterBtn targetPage={7} label="LLEGAR A EREBOR" color="orange" />
                    </div>
                </div>
            </StaticChapterCard>

            {/* 💎 CAPÍTULO IV: EREBOR (CONTACTO PERMANENTE CON keepVisible={true}) */}
            <StaticChapterCard progress={progress} start={0.88} end={1.00} position="center" keepVisible={true}>
                <div className="pointer-events-auto max-w-xl text-center bg-slate-950/85 backdrop-blur-2xl p-8 md:p-10 rounded-2xl border border-amber-500/30 shadow-[0_16px_48px_rgba(0,0,0,0.95)] relative overflow-hidden">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 mb-3">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="font-sans text-amber-300 text-xs tracking-widest uppercase font-semibold">
                            Capítulo IV — La Montaña Solitaria
                        </span>
                    </div>
                    <h2 className="font-cinzel text-3xl md:text-5xl text-amber-100 font-black mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                        El Salón del Trono
                    </h2>
                    <p className="font-sans text-slate-300 text-sm md:text-base mb-7 max-w-md mx-auto leading-relaxed">
                        ¿Tienes un proyecto o desafío técnico para resolver juntos? La travesía ha llegado a su destino.
                    </p>
                    <motion.a
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        href="mailto:ignacio6bruzzesi@gmail.com"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold font-cinzel text-xs md:text-sm tracking-widest rounded-xl border border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
                    >
                        <span>INICIAR CONVERSACIÓN</span>
                        <Mail className="w-4 h-4 stroke-[2.5]" />
                    </motion.a>
                </div>
            </StaticChapterCard>

        </div>,
        scroll.fixed
    );
};