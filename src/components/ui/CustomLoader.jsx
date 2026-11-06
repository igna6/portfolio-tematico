import React from 'react';
import { useProgress } from '@react-three/drei';

export function CustomLoader() {
    // Este hook de Drei nos da el porcentaje exacto (progress) y si sigue cargando (active)
    const { active, progress } = useProgress();

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#070a12] transition-opacity duration-1000 ease-in-out ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* 👑 Título con tu tipografía temática */}
            <h1 className="font-cinzel text-amber-500 text-3xl md:text-4xl tracking-[0.2em] mb-8 animate-pulse text-center">
                FORJANDO LA TRAVESÍA
            </h1>

            {/* ▬ Contenedor de la barra de carga */}
            <div className="w-64 md:w-96 h-[2px] bg-slate-800 rounded-full overflow-hidden relative">
                {/* La barra de progreso en sí, que crece con el % */}
                <div
                    className="absolute top-0 left-0 h-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* % Porcentaje y texto descriptivo */}
            <div className="mt-5 flex flex-col items-center gap-1.5">
                <span className="font-mono text-amber-500/90 text-sm tracking-widest font-bold">
                    {progress.toFixed(0)}%
                </span>
                <span className="font-mono text-slate-500 text-[10px] uppercase tracking-widest">
                    Cargando recursos 3D
                </span>
            </div>
        </div>
    );
}