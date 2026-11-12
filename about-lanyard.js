import React from 'react';
import { createRoot } from 'react-dom/client';
import Lanyard from './vendor/reactbits/Lanyard.js';
import { portraitTexture, logoTexture, strapLogoTexture } from './vendor/reactbits/portrait-texture.js';

const mount = document.getElementById('about-lanyard');
if (mount) {
    // Leave the regular portrait visible if this device cannot render the 3D scene.
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2');
    if (gl) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        const marker = document.createElement('div');
        marker.className = 'about-lanyard-position';
        mount.before(marker);
        document.body.appendChild(mount);
        const root = createRoot(mount);
        function updateLayout() {
            const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom;
            const position = marker.getBoundingClientRect();
            const stageHeight = Math.max(300, window.innerHeight - headerBottom);
            mount.style.top = `${headerBottom}px`;
            const cardHeight = Math.min(240, position.width * 1.1);
            const restTop = Math.max(80, position.top - headerBottom + 120);
            root.render(React.createElement(Lanyard, {
            frontImage: portraitTexture,
            backImage: logoTexture,
            imageFit: 'cover',
            cardColor: '#000000',
            strapColor: '#ffffff',
            strapImage: strapLogoTexture,
            finish: 'glossy',
            metal: 'silver',
            size: cardHeight / stageHeight,
            anchor: (position.left + position.width / 2) / window.innerWidth,
            strapLength: Math.max(0, Math.min(1, (restTop / stageHeight - 0.12) / 0.3)),
            breeze: 0.15,
            interactive: true,
            intro: true
            }));
        }
        new ResizeObserver(updateLayout).observe(document.querySelector('.site-header'));
        window.addEventListener('resize', updateLayout);
        updateLayout();
    }
}
