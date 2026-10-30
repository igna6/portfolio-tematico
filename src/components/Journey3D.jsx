import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import hobbitAvatar from '../assets/hobbit-avatar.png';
import mapBg from '../assets/map-bg.png';

gsap.registerPlugin(ScrollTrigger);

export const HobbitJourney = ({ children }) => {
    const avatarRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const animation = gsap.to(avatarRef.current, {
            left: '92%',
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.8,
            },
        });

        return () => {
            animation.kill();
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const handleScrollTo = (e, targetId) => {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div ref={containerRef} className="relative bg-[#0e131f] text-amber-50 min-h-screen">

            {/* 🗺️ MAPA DE FONDO CENTRADO Y ESCALADO */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-30 flex items-center justify-center overflow-hidden">
                <img
                    src={mapBg}
                    alt="Mapa Tierra Media"
                    className="w-full h-full object-cover min-w-[1200px] min-h-[800px] filter contrast-125 brightness-110"
                />
            </div>

            {/* Capa de sombra para lecturas claras */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#0e131f]/70 via-transparent to-[#0e131f]/90" />

            {/* Contenido interactivo */}
            <div className="relative z-10">
                {children}
            </div>

            {/* 📜 MINIMAPA FIJO */}
            <div className="fixed bottom-6 right-6 z-50 w-72 sm:w-80 md:w-96 h-16 bg-[#141b2d]/95 border border-amber-600/40 rounded-full px-6 py-2 backdrop-blur-md shadow-[0_0_25px_rgba(0,0,0,0.8)] flex items-center">
                <div className="relative w-full h-1 bg-amber-950/80 rounded-full">

                    <a href="#hero" onClick={(e) => handleScrollTo(e, 'hero')} className="absolute -top-6 left-[0%] -translate-x-1/2 text-[10px] sm:text-xs text-amber-400 font-cinzel hover:text-amber-200">Comarca</a>
                    <a href="#experience" onClick={(e) => handleScrollTo(e, 'experience')} className="absolute -top-6 left-[33%] -translate-x-1/2 text-[10px] sm:text-xs text-amber-400 font-cinzel hover:text-amber-200">Rivendell</a>
                    <a href="#projects" onClick={(e) => handleScrollTo(e, 'projects')} className="absolute -top-6 left-[66%] -translate-x-1/2 text-[10px] sm:text-xs text-amber-400 font-cinzel hover:text-amber-200">Moria</a>
                    <a href="#skills" onClick={(e) => handleScrollTo(e, 'skills')} className="absolute -top-6 left-[92%] -translate-x-1/2 text-[10px] sm:text-xs text-amber-400 font-cinzel hover:text-amber-200">Erebor</a>

                    <div className="absolute top-1/2 -translate-y-1/2 left-[0%] w-2 h-2 bg-amber-600 rounded-full border border-amber-300" />
                    <div className="absolute top-1/2 -translate-y-1/2 left-[33%] w-2 h-2 bg-amber-600 rounded-full border border-amber-300" />
                    <div className="absolute top-1/2 -translate-y-1/2 left-[66%] w-2 h-2 bg-amber-600 rounded-full border border-amber-300" />
                    <div className="absolute top-1/2 -translate-y-1/2 left-[92%] w-2 h-2 bg-amber-600 rounded-full border border-amber-300" />

                    <div
                        ref={avatarRef}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-[0%] z-20 pointer-events-none"
                    >
                        <img
                            src={hobbitAvatar}
                            alt="Hobbit"
                            className="w-7 h-7 object-contain mix-blend-screen drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]"
                        />
                    </div>

                </div>
            </div>

        </div>
    );
};