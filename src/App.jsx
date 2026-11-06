import React from 'react';
import { Scene3D } from './components/3d/Scene3D';
import { OverlayUI } from './components/ui/OverlayUI';
import { CustomLoader } from './components/ui/CustomLoader'; // <-- Importamos tu componente

function App() {
    return (
        <main className="w-full min-h-screen bg-[#070a12] overflow-x-hidden relative">
            <Scene3D>
                <OverlayUI />
            </Scene3D>

            {/* Nuestra pantalla de carga 100% personalizada */}
            <CustomLoader />
        </main>
    );
}

export default App;