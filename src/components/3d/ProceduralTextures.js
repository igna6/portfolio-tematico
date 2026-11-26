import * as THREE from 'three';

/**
 * Genera texturas procedurales (color, bump, roughness) para el suelo de piedra enana de Moria.
 */
export function createStoneTileTextures(repeatX = 10, repeatY = 12) {
    const size = 512;
    const colorCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    colorCanvas.width = bumpCanvas.width = size;
    colorCanvas.height = bumpCanvas.height = size;

    const cCtx = colorCanvas.getContext('2d');
    const bCtx = bumpCanvas.getContext('2d');

    // Fondo de juntas oscuras
    cCtx.fillStyle = '#0d0f14';
    cCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#181818';
    bCtx.fillRect(0, 0, size, size);

    const rows = 4;
    const cols = 4;
    const tileH = size / rows;
    const tileW = size / cols;

    let seed = 1337;
    const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };

    for (let r = 0; r < rows; r++) {
        const offset = (r % 2) * (tileW * 0.5);
        for (let c = -1; c <= cols; c++) {
            const x = c * tileW + offset + 3;
            const y = r * tileH + 3;
            const w = tileW - 6;
            const h = tileH - 6;

            const shade = 26 + Math.floor(rand() * 16);
            cCtx.fillStyle = `rgb(${shade}, ${shade + 2}, ${shade + 7})`;
            cCtx.fillRect(x, y, w, h);

            const bVal = 155 + Math.floor(rand() * 65);
            bCtx.fillStyle = `rgb(${bVal}, ${bVal}, ${bVal})`;
            bCtx.fillRect(x, y, w, h);

            // Micro grietas y desgaste de piedra
            for (let g = 0; g < 18; g++) {
                const gx = x + rand() * w;
                const gy = y + rand() * h;
                const gr = 2 + rand() * 14;
                cCtx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.14)';
                cCtx.fillRect(gx, gy, gr, 1 + rand() * 3);
                bCtx.fillStyle = rand() > 0.5 ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.18)';
                bCtx.fillRect(gx, gy, gr, 1 + rand() * 3);
            }
        }
    }

    const map = new THREE.CanvasTexture(colorCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);

    [map, bumpMap].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.needsUpdate = true;
    });
    map.colorSpace = THREE.SRGBColorSpace;

    return { map, bumpMap };
}

/**
 * Genera texturas procedurales de mármol/granito oscuro con vetas sutiles para Erebor.
 */
export function createMarbleTextures(repeatX = 8, repeatY = 10) {
    const size = 512;
    const colorCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    colorCanvas.width = bumpCanvas.width = size;
    colorCanvas.height = bumpCanvas.height = size;

    const cCtx = colorCanvas.getContext('2d');
    const bCtx = bumpCanvas.getContext('2d');

    cCtx.fillStyle = '#141821';
    cCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    const grid = 2;
    const tile = size / grid;

    let seed = 777;
    const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };

    for (let r = 0; r < grid; r++) {
        for (let c = 0; c < grid; c++) {
            const x = c * tile + 2;
            const y = r * tile + 2;
            const s = tile - 4;

            const base = 22 + Math.floor(rand() * 10);
            cCtx.fillStyle = `rgb(${base}, ${base + 4}, ${base + 12})`;
            cCtx.fillRect(x, y, s, s);

            bCtx.fillStyle = '#d8d8d8';
            bCtx.fillRect(x, y, s, s);

            // Vetas sutiles de mármol dorado/gris
            cCtx.strokeStyle = rand() > 0.65 ? 'rgba(234, 179, 8, 0.08)' : 'rgba(148, 163, 184, 0.08)';
            cCtx.lineWidth = 1.5;
            for (let v = 0; v < 4; v++) {
                cCtx.beginPath();
                let vx = x + rand() * s;
                let vy = y + rand() * s;
                cCtx.moveTo(vx, vy);
                for (let step = 0; step < 5; step++) {
                    vx += (rand() - 0.5) * 70;
                    vy += (rand() - 0.5) * 70;
                    cCtx.lineTo(Math.max(x, Math.min(x + s, vx)), Math.max(y, Math.min(y + s, vy)));
                }
                cCtx.stroke();
            }
        }
    }

    const map = new THREE.CanvasTexture(colorCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);

    [map, bumpMap].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.needsUpdate = true;
    });
    map.colorSpace = THREE.SRGBColorSpace;

    return { map, bumpMap };
}

/**
 * Genera textura orgánica de magma con corteza volcánica oscura y vetas incandescentes.
 */
export function createLavaTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base incandescente naranja-rojo
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#ff3b00');
    grad.addColorStop(0.5, '#ff8800');
    grad.addColorStop(1, '#ff2a00');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    let seed = 4242;
    const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };

    // Núcleos más calientes (amarillo brillante)
    for (let i = 0; i < 45; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const r = 16 + rand() * 38;
        const g = ctx.createRadialGradient(x, y, 2, x, y, r);
        g.addColorStop(0, 'rgba(255, 235, 90, 0.9)');
        g.addColorStop(0.5, 'rgba(255, 110, 0, 0.45)');
        g.addColorStop(1, 'rgba(255, 40, 0, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Costras oscuras de roca enfriada flotando sobre el magma
    for (let i = 0; i < 55; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const w = 14 + rand() * 44;
        const h = 8 + rand() * 24;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rand() * Math.PI);
        ctx.fillStyle = 'rgba(28, 10, 6, 0.72)';
        ctx.beginPath();
        ctx.ellipse(0, 0, w * 0.5, h * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 2);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
}

/**
 * Genera texturas procedurales de pasto orgánico con musgo y relieve para La Comarca.
 */
export function createShireGrassTextures(repeatX = 14, repeatY = 14) {
    const size = 512;
    const colorCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    colorCanvas.width = bumpCanvas.width = size;
    colorCanvas.height = bumpCanvas.height = size;

    const cCtx = colorCanvas.getContext('2d');
    const bCtx = bumpCanvas.getContext('2d');

    cCtx.fillStyle = '#1f4422';
    cCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#707070';
    bCtx.fillRect(0, 0, size, size);

    let seed = 901;
    const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };

    // Manchas amplias de musgo y pasto húmedo
    for (let i = 0; i < 65; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const r = 20 + rand() * 55;
        const g = cCtx.createRadialGradient(x, y, 4, x, y, r);
        g.addColorStop(0, rand() > 0.45 ? 'rgba(46, 98, 42, 0.35)' : 'rgba(20, 48, 22, 0.38)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        cCtx.fillStyle = g;
        cCtx.beginPath();
        cCtx.arc(x, y, r, 0, Math.PI * 2);
        cCtx.fill();
    }

    // Briznas de hierba y textura fina
    for (let i = 0; i < 1600; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const len = 3 + rand() * 7;
        const green = 58 + Math.floor(rand() * 48);
        cCtx.strokeStyle = `rgba(${28 + Math.floor(rand() * 20)}, ${green}, ${26 + Math.floor(rand() * 18)}, 0.45)`;
        cCtx.lineWidth = 1.2;
        cCtx.beginPath();
        cCtx.moveTo(x, y);
        cCtx.lineTo(x + (rand() - 0.5) * 4, y - len);
        cCtx.stroke();

        const bVal = 110 + Math.floor(rand() * 110);
        bCtx.fillStyle = `rgb(${bVal}, ${bVal}, ${bVal})`;
        bCtx.fillRect(x, y, 2, 3);
    }

    const map = new THREE.CanvasTexture(colorCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    [map, bumpMap].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.needsUpdate = true;
    });
    map.colorSpace = THREE.SRGBColorSpace;
    return { map, bumpMap };
}

/**
 * Genera texturas de sendero de tierra apisonada con piedritas para La Comarca.
 */
export function createDirtPathTexture() {
    const size = 512;
    const colorCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    colorCanvas.width = bumpCanvas.width = size;
    colorCanvas.height = bumpCanvas.height = size;

    const cCtx = colorCanvas.getContext('2d');
    const bCtx = bumpCanvas.getContext('2d');

    cCtx.fillStyle = '#4a311c';
    cCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#787878';
    bCtx.fillRect(0, 0, size, size);

    let seed = 314;
    const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < 900; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const r = 1 + rand() * 4.5;
        const warm = 55 + Math.floor(rand() * 35);
        cCtx.fillStyle = `rgba(${warm + 25}, ${warm}, ${Math.floor(warm * 0.55)}, 0.5)`;
        cCtx.beginPath();
        cCtx.arc(x, y, r, 0, Math.PI * 2);
        cCtx.fill();

        const b = 100 + Math.floor(rand() * 110);
        bCtx.fillStyle = `rgb(${b},${b},${b})`;
        bCtx.beginPath();
        bCtx.arc(x, y, r, 0, Math.PI * 2);
        bCtx.fill();
    }

    const map = new THREE.CanvasTexture(colorCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    [map, bumpMap].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(16, 2);
        tex.needsUpdate = true;
    });
    map.colorSpace = THREE.SRGBColorSpace;
    return { map, bumpMap };
}

/**
 * Genera texturas de suelo de bosque profundo con musgo oscuro, hojas y relieve.
 */
export function createForestFloorTextures(repeatX = 12, repeatY = 12) {
    const size = 512;
    const colorCanvas = document.createElement('canvas');
    const bumpCanvas = document.createElement('canvas');
    colorCanvas.width = bumpCanvas.width = size;
    colorCanvas.height = bumpCanvas.height = size;

    const cCtx = colorCanvas.getContext('2d');
    const bCtx = bumpCanvas.getContext('2d');

    cCtx.fillStyle = '#091a11';
    cCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#606060';
    bCtx.fillRect(0, 0, size, size);

    let seed = 2048;
    const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < 80; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const r = 18 + rand() * 50;
        const g = cCtx.createRadialGradient(x, y, 2, x, y, r);
        g.addColorStop(0, rand() > 0.5 ? 'rgba(16, 78, 52, 0.35)' : 'rgba(6, 20, 13, 0.45)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        cCtx.fillStyle = g;
        cCtx.beginPath();
        cCtx.arc(x, y, r, 0, Math.PI * 2);
        cCtx.fill();
    }

    for (let i = 0; i < 1200; i++) {
        const x = rand() * size;
        const y = rand() * size;
        const w = 2 + rand() * 5;
        cCtx.fillStyle = rand() > 0.7 ? 'rgba(52, 211, 153, 0.14)' : 'rgba(12, 34, 22, 0.55)';
        cCtx.fillRect(x, y, w, w * 0.6);

        const b = 95 + Math.floor(rand() * 120);
        bCtx.fillStyle = `rgb(${b},${b},${b})`;
        bCtx.fillRect(x, y, w, w * 0.6);
    }

    const map = new THREE.CanvasTexture(colorCanvas);
    const bumpMap = new THREE.CanvasTexture(bumpCanvas);
    [map, bumpMap].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(repeatX, repeatY);
        tex.needsUpdate = true;
    });
    map.colorSpace = THREE.SRGBColorSpace;
    return { map, bumpMap };
}
