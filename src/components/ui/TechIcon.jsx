import React from 'react';

export function TechIcon({ name, className = "w-5 h-5" }) {
    switch (name) {
        case 'react':
            return (
                <svg viewBox="-11.5 -10.23174 23 20.46348" className={className} fill="none">
                    <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
                    <g stroke="#00d8ff" strokeWidth="1">
                        <ellipse rx="11" ry="4.2" />
                        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                    </g>
                </svg>
            );
        case 'vite':
            return (
                <svg viewBox="0 0 32 32" className={className} fill="none">
                    <path d="M29.5 5.5L16.8 28.2a1 1 0 01-1.6 0L2.5 5.5a1 1 0 01.8-1.5h25.4a1 1 0 01.8 1.5z" fill="url(#vite-grad)" />
                    <path d="M19.8 4l-7.3 13.5 4.2.2-5.7 8.3 10-14.2-4.5-.3 3.3-7.5z" fill="#ffea00" />
                    <defs>
                        <linearGradient id="vite-grad" x1="2.5" y1="4" x2="29.5" y2="28" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#41d1ff" />
                            <stop offset="1" stopColor="#bd34fe" />
                        </linearGradient>
                    </defs>
                </svg>
            );
        case 'threejs':
            return (
                <svg viewBox="0 0 32 32" className={className} fill="currentColor">
                    <path d="M16 2.5l11.5 6.6v13.8L16 29.5 4.5 22.9V9.1L16 2.5zm0 2.5L7 10.2v9.6L16 25l9-5.2v-9.6L16 5z" opacity="0.3" fill="#ffffff" />
                    <path d="M16 5.5l7.5 4.3v8.6L16 22.7 8.5 18.4V9.8L16 5.5z" fill="#ffffff" />
                    <path d="M16 8l5 2.9v5.8L16 19.6 11 16.7v-5.8L16 8z" fill="#000000" />
                </svg>
            );
        case 'nodejs':
            return (
                <svg viewBox="0 0 32 32" className={className} fill="none">
                    <path d="M16 2.5l11.5 6.6v13.8L16 29.5 4.5 22.9V9.1L16 2.5z" fill="#339933" />
                    <path d="M16 7.5l7 4v8l-7 4-7-4v-8l7-4z" fill="#ffffff" opacity="0.2" />
                    <path d="M16 11.5a3 3 0 013 3v4a3 3 0 01-6 0v-4a3 3 0 013-3z" fill="#ffffff" />
                </svg>
            );
        case 'tailwind':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="#38bdf8">
                    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
                </svg>
            );
        case 'python':
            return (
                <svg viewBox="0 0 32 32" className={className} fill="none">
                    <path d="M15.8 3c-4.4 0-7.8.6-7.8 3.8v3.2h8v1h-11C2.5 11 1 12.8 1 17.2c0 4.1 1.6 6 5.5 6h2.5v-3.5c0-3.2 2.7-5.7 5.8-5.7h7.2c1.3 0 2.2-.9 2.2-2.2V6.8c0-3.3-3.9-3.8-8.4-3.8zm-2.4 2.2a1.3 1.3 0 110 2.6 1.3 1.3 0 010-2.6z" fill="#3776ab" />
                    <path d="M16.2 29c4.4 0 7.8-.6 7.8-3.8V22h-8v-1h11c2.5 0 4-1.8 4-6.2 0-4.1-1.6-6-5.5-6H23v3.5c0 3.2-2.7 5.7-5.8 5.7H10c-1.3 0-2.2.9-2.2 2.2v5c0 3.3 3.9 3.8 8.4 3.8zm2.4-2.2a1.3 1.3 0 110-2.6 1.3 1.3 0 010 2.6z" fill="#ffd438" />
                </svg>
            );
        case 'flask':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 3h6M10 9h4M10 3v6l-4 9a2 2 0 001.7 3h8.6a2 2 0 001.7-3l-4-9V3" />
                </svg>
            );
        case 'websockets':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.2" />
                </svg>
            );
        case 'postgresql':
            return (
                <svg viewBox="0 0 32 32" className={className} fill="none">
                    <path d="M16 2C9.4 2 4 6.8 4 13.5c0 4.1 2.2 7.7 5.5 9.8v5.2l4.8-2.6c.5.1 1.1.1 1.7.1 6.6 0 12-4.8 12-11.5S22.6 2 16 2z" fill="#336791" />
                    <path d="M16 6.5c-4.2 0-7.5 2.8-7.5 6.5 0 2.2 1.2 4.2 3.2 5.3l-.2 3.2 3-1.6c.5.1 1 .1 1.5.1 4.2 0 7.5-2.8 7.5-6.5S20.2 6.5 16 6.5z" fill="#ffffff" opacity="0.3" />
                </svg>
            );
        case 'git':
            return (
                <svg viewBox="0 0 32 32" className={className} fill="none">
                    <path d="M30 14.5L17.5 2a2.1 2.1 0 00-3 0l-12.5 12.5a2.1 2.1 0 000 3L14.5 30a2.1 2.1 0 003 0L30 17.5a2.1 2.1 0 000-3z" fill="#f05032" />
                    <circle cx="11.5" cy="11.5" r="2.2" fill="#ffffff" />
                    <circle cx="20.5" cy="16" r="2.2" fill="#ffffff" />
                    <circle cx="11.5" cy="20.5" r="2.2" fill="#ffffff" />
                    <path d="M11.5 13.7v4.6M13.2 12.8l5.6 2.4" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
            );
        case 'opencv':
            return (
                <svg viewBox="0 0 32 32" className={className} fill="none">
                    <path d="M16 3a7 7 0 00-6.1 10.4l3-1.8a3.5 3.5 0 116.2 0l3 1.8A7 7 0 0016 3z" fill="#ff3e3e" />
                    <path d="M8.5 16a7 7 0 006.1 10.4v-3.5a3.5 3.5 0 110-6.9v-3.5A7 7 0 008.5 16z" fill="#22c55e" />
                    <path d="M23.5 16a7 7 0 01-6.1 10.4v-3.5a3.5 3.5 0 100-6.9v-3.5A7 7 0 0123.5 16z" fill="#3b82f6" />
                </svg>
            );
        case 'cpp':
            return (
                <svg viewBox="0 0 32 32" className={className} fill="none">
                    <path d="M16 2.5l11.5 6.6v13.8L16 29.5 4.5 22.9V9.1L16 2.5z" fill="#00599c" />
                    <path d="M16 9a7 7 0 100 14 7 7 0 000-14zm0 3.2a3.8 3.8 0 110 7.6 3.8 3.8 0 010-7.6z" fill="#ffffff" />
                    <path d="M23.2 15.2h1.4v-1.4h1.1v1.4h1.4v1.1h-1.4v1.4h-1.1v-1.4h-1.4v-1.1z" fill="#659ad2" />
                </svg>
            );
        case 'ai':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="none">
                    <path d="M12 2l2.2 6.2L20.5 10l-6.3 2.2L12 18.5l-2.2-6.3L3.5 10l6.3-1.8L12 2z" fill="url(#ai-grad)" />
                    <circle cx="19" cy="18.5" r="1.5" fill="#e879f9" />
                    <defs>
                        <linearGradient id="ai-grad" x1="3.5" y1="2" x2="20.5" y2="18.5" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#c084fc" />
                            <stop offset="1" stopColor="#f472b6" />
                        </linearGradient>
                    </defs>
                </svg>
            );
        case 'pandas':
            return (
                <svg viewBox="0 0 32 32" className={className} fill="none">
                    <rect x="8" y="4" width="3.5" height="9" rx="1" fill="#e2e8f0" />
                    <rect x="8" y="16" width="3.5" height="3.5" rx="1" fill="#ffca00" />
                    <rect x="8" y="22" width="3.5" height="6" rx="1" fill="#e2e8f0" />
                    <rect x="14.2" y="11" width="3.5" height="10" rx="1" fill="#38bdf8" />
                    <rect x="20.5" y="4" width="3.5" height="6" rx="1" fill="#e2e8f0" />
                    <rect x="20.5" y="12.5" width="3.5" height="3.5" rx="1" fill="#e70488" />
                    <rect x="20.5" y="18.5" width="3.5" height="9.5" rx="1" fill="#e2e8f0" />
                </svg>
            );
        case 'github':
            return (
                <svg viewBox="0 0 24 24" className={className} fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
            );
        default:
            return null;
    }
}

