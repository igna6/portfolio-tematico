import React from 'react';
import scrollFrame from '../assets/scroll-frame.png';

export const Projects = () => {
    const projectList = [
        {
            title: "KICK Live Chat Giveaway",
            description: "Aplicación web en tiempo real para sorteos en streams con WebSockets y OAuth 2.1.",
            tech: ["React", "Node.js", "WebSockets"],
            link: "#"
        },
        {
            title: "InnovaTrade Simulator",
            description: "Simulador bursátil con backend en Python Flask e integración a yfinance.",
            tech: ["Python", "Flask", "React", "SQL"],
            link: "#"
        }
    ];

    return (
        <section id="projects" className="py-20 px-4 max-w-5xl mx-auto relative z-10">
            <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-center text-amber-400 mb-16 tracking-wider">
                Las Mazmorras de Moria: Desafíos & Proyectos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {projectList.map((project, index) => (
                    <div key={index} className="relative w-full min-h-[380px] p-10 md:p-14 flex flex-col justify-between">

                        {/* Marco de Pergamino recortado a la tarjeta */}
                        <img
                            src={scrollFrame}
                            alt="Marco Pergamino"
                            className="absolute inset-0 w-full h-full object-fill pointer-events-none z-0 opacity-90 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
                        />

                        {/* Texto dentro del pergamino */}
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="font-cinzel text-xl md:text-2xl font-bold text-amber-300 mb-3">
                                    {project.title}
                                </h3>
                                <p className="font-garamond text-slate-200 text-base md:text-lg leading-relaxed mb-6">
                                    {project.description}
                                </p>
                            </div>

                            <div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.map((t, idx) => (
                                        <span key={idx} className="bg-amber-950/80 border border-amber-600/50 text-amber-300 font-serif text-xs px-2.5 py-1 rounded">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <a
                                    href={project.link}
                                    className="inline-block font-cinzel text-sm text-amber-400 hover:text-amber-100 underline decoration-amber-500/50 underline-offset-4"
                                >
                                    Inspeccionar Misión →
                                </a>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </section>
    );
};