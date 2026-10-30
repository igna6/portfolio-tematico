import React from 'react';
import { Scene3D } from './components/3d/Scene3D';
import { OverlayUI } from './components/ui/OverlayUI';

function App() {
    return (
        <main className="w-full min-h-screen bg-[#070a12] overflow-x-hidden">
            <Scene3D>
                <OverlayUI />
            </Scene3D>
        </main>
    );
}

export default App;