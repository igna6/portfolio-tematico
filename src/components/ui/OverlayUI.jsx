import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useScroll } from '@react-three/drei';
import { MapIntro } from './MapIntro';
import { TechIcon } from './TechIcon';
import { motion } from 'framer-motion';
import {
    ExternalLink,
    ChevronDown,
    Mail,
    MapPin,
    Compass
} from 'lucide-react';

// 📌 10 HABILIDADES Y TECNOLOGÍAS PRINCIPALES CON LOGOS SVG REALES
const SKILLS_DATA = [
    { title: "React 19 / Vite", category: "FRONTEND CORE", iconName: "react", level: 92, accent: "from-cyan-500/20 to-blue-500/20", bar: "from-cyan-400 to-blue-500", color: "text-cyan-300", border: "hover:border-cyan-400/60" },
    { title: "Three.js / R3F", category: "3D & SHADERS", iconName: "threejs", level: 85, accent: "from-purple-500/20 to-indigo-500/20", bar: "from-purple-400 to-indigo-500", color: "text-purple-300", border: "hover:border-purple-400/60" },
    { title: "Node.js / Express", category: "BACKEND ENGINE", iconName: "nodejs", level: 90, accent: "from-emerald-500/20 to-green-500/20", bar: "from-emerald-400 to-green-500", color: "text-emerald-300", border: "hover:border-emerald-400/60" },
    { title: "PostgreSQL / SQL", category: "BASES DE DATOS", iconName: "postgresql", level: 86, accent: "from-blue-600/20 to-indigo-600/20", bar: "from-blue-400 to-indigo-500", color: "text-blue-300", border: "hover:border-blue-400/60" },
    { title: "WebSockets / REST", category: "REAL-TIME SYNC", iconName: "websockets", level: 88, accent: "from-orange-500/20 to-red-500/20", bar: "from-orange-400 to-amber-500", color: "text-orange-300", border: "hover:border-orange-400/60" },
    { title: "Python / Pandas", category: "DATA WRANGLING", iconName: "python", level: 84, accent: "from-amber-500/20 to-yellow-500/20", bar: "from-amber-400 to-yellow-400", color: "text-amber-300", border: "hover:border-amber-400/60" },
    { title: "OpenCV / NumPy", category: "VISIÓN 3D", iconName: "opencv", level: 78, accent: "from-teal-500/20 to-cyan-500/20", bar: "from-teal-400 to-cyan-400", color: "text-teal-300", border: "hover:border-teal-400/60" },
    { title: "C++ / POO", category: "ALGORITMOS", iconName: "cpp", level: 82, accent: "from-sky-500/20 to-blue-600/20", bar: "from-sky-400 to-blue-500", color: "text-sky-300", border: "hover:border-sky-400/60" },
    { title: "AI Code Assistants", category: "PROMPTING", iconName: "ai", level: 94, accent: "from-violet-500/20 to-fuchsia-500/20", bar: "from-violet-400 to-fuchsia-400", color: "text-violet-300", border: "hover:border-violet-400/60" },
    { title: "Git & GitHub", category: "CI/CD & CONTROL", iconName: "git", level: 91, accent: "from-rose-500/20 to-orange-500/20", bar: "from-rose-400 to-orange-400", color: "text-rose-300", border: "hover:border-rose-400/60" },
];

// 📌 DATOS DE PROYECTOS (CAPÍTULO II)
const PROJECTS_DATA = [
    {
        badge: "Plataforma Web en Vivo",
        status: "Producción",
        statusDot: "bg-emerald-400",
        year: "2026",
        title: "KICK Chat Giveaway",
        desc: "Aplicación interactiva para gestionar sorteos en tiempo real sincronizando el chat en vivo de Kick mediante WebSockets para alta concurrencia.",
        bannerGradient: "from-emerald-500/30 via-teal-500/15 to-transparent",
        techs: [
            { label: "React", icon: "react", style: "bg-cyan-950/70 text-cyan-300 border-cyan-700/50" },
            { label: "Node.js", icon: "nodejs", style: "bg-emerald-950/70 text-emerald-300 border-emerald-700/50" },
            { label: "WebSockets", icon: "websockets", style: "bg-amber-950/70 text-amber-300 border-amber-700/50" },
        ],
        linkLabel: "Ver Código",
        href: "https://github.com/igna6"
    },
    {
        badge: "Simulador Financiero",
        status: "Demo Disponible",
        statusDot: "bg-cyan-400",
        year: "2026",
        title: "InnovaTrade Simulator",
        desc: "Plataforma bursátil con pipeline de datos en Python Pandas, consumo de Yahoo Finance API y Data Wrangling para análisis de mercado.",
        bannerGradient: "from-amber-500/25 via-emerald-500/15 to-transparent",
        techs: [
            { label: "Python", icon: "python", style: "bg-blue-950/70 text-blue-300 border-blue-700/50" },
            { label: "Pandas", icon: "pandas", style: "bg-amber-950/70 text-amber-300 border-amber-700/50" },
            { label: "SQL", icon: "postgresql", style: "bg-indigo-950/70 text-indigo-300 border-indigo-700/50" },
        ],
        linkLabel: "Explorar Demo",
        href: "https://github.com/igna6"
    }
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

// 📌 BOTÓN DE NAVEGACIÓN ENTRE CAPÍTULOS CON SHIMMER Y GLOW
const ScrollToChapterBtn = ({ targetPage, label = 'CONTINUAR TRAVESÍA', color = 'amber' }) => {
    const scroll = useScroll();
    const scrollToPage = () => {
        if (scroll && scroll.el) {
            scroll.el.scrollTo({ top: (scroll.el.scrollHeight / 8) * targetPage, behavior: 'smooth' });
        }
    };
    const colorMap = {
        amber: 'bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-slate-950 border-amber-200/80 shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:shadow-[0_0_38px_rgba(245,158,11,0.7)]',
        emerald: 'bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 text-slate-950 border-emerald-200/80 shadow-[0_0_25px_rgba(52,211,153,0.45)] hover:shadow-[0_0_38px_rgba(52,211,153,0.7)]',
        orange: 'bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-slate-950 border-orange-200/80 shadow-[0_0_25px_rgba(249,115,22,0.45)] hover:shadow-[0_0_38px_rgba(249,115,22,0.7)]',
    };
    return (
        <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={scrollToPage}
            className={`btn-shimmer relative overflow-hidden px-7 py-3.5 font-bold font-cinzel text-xs md:text-sm tracking-[0.18em] rounded-xl border transition-all duration-300 cursor-pointer pointer-events-auto flex items-center gap-2.5 group ${colorMap[color]}`}
        >
            <span className="relative z-10">{label}</span>
            <ChevronDown className="w-4 h-4 stroke-[2.5] relative z-10 group-hover:translate-y-0.5 transition-transform" />
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
                className="fixed top-6 left-6 z-[100] w-12 h-12 flex items-center justify-center bg-slate-950/85 border border-amber-500/30 rounded-xl backdrop-blur-xl hover:border-amber-400/80 hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer pointer-events-auto"
                aria-label="Volver al mapa"
                title="Volver al Mapa"
            >
                <span className="font-cinzel text-amber-200 font-bold text-lg tracking-wider group-hover:text-amber-400 transition-colors duration-300">
                    IB.
                </span>
            </button>

            <MapIntro scrollProgress={progress} />

            {/* 🌻 CAPÍTULO I: LA COMARCA (HERO CINEMATOGRÁFICO) */}
            <StaticChapterCard progress={progress} start={0.14} end={0.315} position="bottom">
                <div className="pointer-events-auto text-center mb-5 max-w-2xl w-full bg-slate-950/80 backdrop-blur-2xl p-7 md:p-9 rounded-3xl border border-amber-500/35 shadow-[0_20px_60px_rgba(0,0,0,0.92)] relative overflow-hidden group">
                    {/* Línea luminosa superior */}
                    <div className="absolute top-0 inset-x-10 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
                    <div className="absolute -top-24 -left-24 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 mb-4">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="font-sans text-amber-300 text-[11px] tracking-[0.2em] uppercase font-semibold">
                            Capítulo I — Hobbiton
                        </span>
                    </div>

                    <h1 className="font-cinzel text-3xl md:text-5xl font-black bg-gradient-to-b from-amber-50 via-amber-200 to-amber-500 bg-clip-text text-transparent tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                        Ignacio Bruzzesi
                    </h1>

                    <div className="flex items-center justify-center gap-2 mt-2 text-xs font-sans text-amber-300/85 tracking-wide">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>UTN Rosario · Ingeniería en Sistemas de Información</span>
                    </div>

                    <p className="font-sans text-slate-300 text-sm md:text-base mt-3.5 max-w-lg mx-auto leading-relaxed">
                        Desarrollador Full Stack apasionado por construir arquitecturas escalables en JavaScript, React y Node.js junto con experiencias 3D interactivas.
                    </p>

                    <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-3">
                        <a
                            href="https://github.com/igna6"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/70 hover:border-amber-400/60 text-slate-200 hover:text-amber-200 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <TechIcon name="github" className="w-4 h-4" />
                            <span>GitHub</span>
                        </a>
                        <a
                            href="mailto:ignacio6bruzzesi@gmail.com"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/70 hover:border-amber-400/60 text-slate-200 hover:text-amber-200 text-xs font-medium transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <Mail className="w-3.5 h-3.5 text-amber-400" />
                            <span>ignacio6bruzzesi@gmail.com</span>
                        </a>
                    </div>
                </div>
                <ScrollToChapterBtn targetPage={3} label="CONTINUAR TRAVESÍA" color="amber" />
            </StaticChapterCard>

            {/* 🌲 CAPÍTULO II: EL BOSQUE DEL CONOCIMIENTO (PROYECTOS) */}
            <StaticChapterCard progress={progress} start={0.39} end={0.565} position="center">
                <div className="w-full max-w-5xl">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 mb-2.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-sans text-emerald-300 text-[11px] tracking-[0.2em] uppercase font-semibold">
                                Capítulo II — El Bosque del Conocimiento
                            </span>
                        </div>
                        <h2 className="font-cinzel text-2xl md:text-4xl bg-gradient-to-b from-amber-50 to-emerald-200 bg-clip-text text-transparent font-extrabold drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                            Proyectos &amp; Desarrollos
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PROJECTS_DATA.map((project) => (
                            <motion.div
                                key={project.title}
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.25 }}
                                className="pointer-events-auto group relative flex flex-col justify-between bg-slate-950/85 backdrop-blur-2xl rounded-3xl border border-emerald-500/30 shadow-[0_16px_44px_rgba(0,0,0,0.88)] hover:border-emerald-400/75 hover:shadow-[0_0_36px_rgba(52,211,153,0.25)] transition-all duration-300 overflow-hidden"
                            >
                                {/* Cabecera visual con gradiente */}
                                <div className={`h-2 w-full bg-gradient-to-r ${project.bannerGradient}`} />
                                <div className="p-6 md:p-7 flex flex-col justify-between flex-1">
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-4">
                                            <span className="text-[10px] font-sans font-bold text-emerald-300 uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/35">
                                                {project.badge}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-slate-300 bg-slate-900/90 px-2.5 py-1 rounded-full border border-slate-700/60">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${project.statusDot}`} />
                                                    {project.status}
                                                </span>
                                                <span className="text-xs text-slate-400 font-mono">{project.year}</span>
                                            </div>
                                        </div>

                                        <h3 className="font-cinzel text-xl md:text-2xl font-bold text-amber-100 group-hover:text-emerald-300 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="font-sans text-slate-300 text-xs md:text-sm leading-relaxed mt-3">
                                            {project.desc}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {project.techs.map((t) => (
                                                <span
                                                    key={t.label}
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-lg border ${t.style}`}
                                                >
                                                    <TechIcon name={t.icon} className="w-3.5 h-3.5 shrink-0" />
                                                    <span>{t.label}</span>
                                                </span>
                                            ))}
                                        </div>

                                        <a
                                            href={project.href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-xs font-sans font-bold text-emerald-300 hover:text-emerald-100 tracking-wide transition-all"
                                        >
                                            <span>{project.linkLabel}</span>
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-8">
                        <ScrollToChapterBtn targetPage={5} label="FORJAR HABILIDADES" color="emerald" />
                    </div>
                </div>
            </StaticChapterCard>

            {/* 🕯️ CAPÍTULO III: MINAS DE MORIA (10 TECNOLOGÍAS CON ICONOS SVG) */}
            <StaticChapterCard progress={progress} start={0.64} end={0.815} position="center">
                <div className="w-full max-w-5xl">
                    <div className="text-center mb-5">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-400/30 mb-2">
                            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                            <span className="font-sans text-orange-300 text-[11px] tracking-[0.2em] uppercase font-semibold">
                                Capítulo III — Las Minas de Moria
                            </span>
                        </div>
                        <h2 className="font-cinzel text-2xl md:text-4xl bg-gradient-to-b from-amber-50 to-orange-200 bg-clip-text text-transparent font-extrabold drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                            Habilidades &amp; Forja Técnica
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                        {SKILLS_DATA.map((skill) => (
                            <motion.div
                                key={skill.title}
                                whileHover={{ y: -4, scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                                className={`pointer-events-auto group relative overflow-hidden rounded-2xl bg-slate-950/85 border border-orange-500/25 p-3.5 md:p-4 backdrop-blur-xl transition-all duration-300 ${skill.border} hover:shadow-[0_0_28px_rgba(249,115,22,0.28)] flex flex-col justify-between`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${skill.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                                <div className="flex items-start justify-between gap-2 mb-3 relative z-10">
                                    <div className="p-2 rounded-xl bg-slate-900/95 border border-slate-700/70 group-hover:border-amber-400/50 group-hover:shadow-[0_0_14px_rgba(251,191,36,0.35)] transition-all duration-300">
                                        <TechIcon name={skill.iconName} className="w-5 h-5" />
                                    </div>
                                    <span className="text-[9px] font-mono font-bold tracking-wider text-slate-400 group-hover:text-amber-200 transition-colors uppercase text-right leading-tight">
                                        {skill.category}
                                    </span>
                                </div>

                                <div className="relative z-10">
                                    <h3 className={`font-sans text-xs md:text-sm font-bold ${skill.color} tracking-wide mb-2`}>
                                        {skill.title}
                                    </h3>
                                    <div className="w-full h-1 rounded-full bg-slate-800/90 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full bg-gradient-to-r ${skill.bar} opacity-80 group-hover:opacity-100 transition-all duration-500`}
                                            style={{ width: `${skill.level}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-6">
                        <ScrollToChapterBtn targetPage={7} label="LLEGAR A EREBOR" color="orange" />
                    </div>
                </div>
            </StaticChapterCard>

            {/* 💎 CAPÍTULO IV: EREBOR (CONTACTO PERMANENTE CON ORNAMENTO REAL) */}
            <StaticChapterCard progress={progress} start={0.88} end={1.00} position="center" keepVisible={true}>
                <div className="pointer-events-auto max-w-xl w-full text-center bg-slate-950/85 backdrop-blur-2xl p-8 md:p-10 rounded-3xl border border-amber-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.95)] relative overflow-hidden">
                    <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                    <div className="absolute bottom-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

                    {/* Ornamento SVG dorado sutil */}
                    <svg viewBox="0 0 180 20" className="w-40 h-5 mx-auto mb-3 text-amber-400/75" fill="none">
                        <path d="M5 10h62l8-6 15 12 15-12 8 6h62" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="90" cy="10" r="2.5" fill="currentColor" />
                    </svg>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/35 mb-3">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="font-sans text-amber-300 text-[11px] tracking-[0.2em] uppercase font-semibold">
                            Capítulo IV — La Montaña Solitaria
                        </span>
                    </div>

                    <h2 className="font-cinzel text-3xl md:text-5xl bg-gradient-to-b from-amber-50 via-amber-200 to-amber-500 bg-clip-text text-transparent font-black mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                        El Salón del Trono
                    </h2>

                    <p className="font-sans text-slate-300 text-sm md:text-base mb-7 max-w-md mx-auto leading-relaxed">
                        La travesía ha llegado a su destino. ¿Tienes un proyecto, desafío técnico o idea ambiciosa para forjar juntos?
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                        <motion.a
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            href="mailto:ignacio6bruzzesi@gmail.com"
                            className="btn-shimmer amber-glow-idle relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-slate-950 font-bold font-cinzel text-xs md:text-sm tracking-[0.16em] rounded-xl border border-amber-200 transition-all cursor-pointer w-full sm:w-auto"
                        >
                            <span>INICIAR CONVERSACIÓN</span>
                            <Mail className="w-4 h-4 stroke-[2.5]" />
                        </motion.a>

                        <motion.a
                            whileHover={{ scale: 1.03, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            href="https://github.com/igna6"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-amber-400/60 text-slate-200 hover:text-amber-200 font-cinzel font-semibold text-xs tracking-widest transition-all w-full sm:w-auto"
                        >
                            <TechIcon name="github" className="w-4 h-4" />
                            <span>GITHUB</span>
                        </motion.a>
                    </div>

                    <button
                        onClick={handleReturnToMap}
                        className="mt-6 inline-flex items-center gap-1.5 text-xs font-sans text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Volver al Mapa de la Tierra Media</span>
                    </button>
                </div>
            </StaticChapterCard>

        </div>,
        scroll.fixed
    );
};