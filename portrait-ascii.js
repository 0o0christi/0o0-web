/* Binary placement mask sampled from images/portrait.jpg.
   Brightness controls digit density only. Resample this mask if the source image changes. */
const portraitCanvas = document.querySelector('.about-portrait-ascii');
const trailCanvas = document.querySelector('.about-portrait-trail');

if (portraitCanvas && trailCanvas) {
    const context = portraitCanvas.getContext('2d');
    const trailContext = trailCanvas.getContext('2d');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const keepCellVisibility = document.body.classList.contains('blog-page');
    let imageMaskLoaded = !portraitCanvas.dataset.image || Boolean(portraitCanvas.dataset.mask);
    let maskWidth = 160;
    let maskHeight = 120;
    let mask = Uint8Array.from(atob('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'), character => character.charCodeAt(0));
    const cellWidth = 7;
    const cellHeight = 9;
    const trailLifetime = 1000;
    const trailRadius = 120;
    const frameInterval = 1000 / 30;
    const trails = [];
    let cells = [];
    let columns = 0;
    let rows = 0;
    let width = 0;
    let height = 0;
    let animationFrame = null;
    let previousFrame = 0;

    function drawCell(cell) {
        context.clearRect(cell.x, cell.y, cellWidth, cellHeight);
        if (cell.visible) {
            context.fillText(cell.character, cell.x + cellWidth / 2, cell.y);
        }
    }

    function drawPointerTrail(timestamp) {
        trailContext.clearRect(0, 0, width, height);
        while (trails.length && timestamp - trails[0].created > trailLifetime) {
            trails.shift();
        }

        const highlights = new Map();
        trails.forEach(point => {
            const strength = 1 - (timestamp - point.created) / trailLifetime;
            const firstRow = Math.max(0, Math.floor((point.y - trailRadius) / cellHeight));
            const lastRow = Math.min(rows - 1, Math.ceil((point.y + trailRadius) / cellHeight));
            const firstColumn = Math.max(0, Math.floor((point.x - trailRadius) / cellWidth));
            const lastColumn = Math.min(columns - 1, Math.ceil((point.x + trailRadius) / cellWidth));

            for (let row = firstRow; row <= lastRow; row++) {
                for (let column = firstColumn; column <= lastColumn; column++) {
                    const x = (column + 0.5) * cellWidth;
                    const y = (row + 0.5) * cellHeight;
                    const distance = Math.hypot(x - point.x, y - point.y);
                    if (distance >= trailRadius) continue;

                    const cell = cells[row * columns + column];
                    if (!cell || !cell.visible) continue;

                    const opacity = strength * (1 - distance / trailRadius) * 0.1;
                    const key = row * columns + column;
                    if (opacity > (highlights.get(key)?.opacity || 0)) {
                        highlights.set(key, { cell, opacity });
                    }
                }
            }
        });

        trailContext.font = '8px monospace';
        trailContext.textAlign = 'center';
        trailContext.textBaseline = 'top';
        highlights.forEach(({ cell, opacity }) => {
            trailContext.fillStyle = 'rgba(255, 255, 255, ' + opacity + ')';
            trailContext.fillText(cell.character, cell.x + cellWidth / 2, cell.y);
        });
    }

    function animate(timestamp) {
        animationFrame = null;
        if (document.hidden || reducedMotion.matches) return;
        if (timestamp - previousFrame >= frameInterval) {
            previousFrame = timestamp;
            cells.forEach(cell => {
                let changed = false;
                if (Math.random() < 0.08) {
                    cell.character = cell.character === '0' ? '1' : '0';
                    changed = true;
                }
                if (!keepCellVisibility && Math.random() < 0.03) {
                    cell.visible = Math.random() < cell.density;
                    changed = true;
                }
                if (changed) drawCell(cell);
            });
        }
        drawPointerTrail(timestamp);
        animationFrame = requestAnimationFrame(animate);
    }

    function updateMotion() {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
        trails.length = 0;
        if (trailContext) trailContext.clearRect(0, 0, width, height);
        if (!document.hidden && !reducedMotion.matches && cells.length) {
            previousFrame = performance.now();
            animationFrame = requestAnimationFrame(animate);
        }
    }

    function trackPointer(event) {
        if (reducedMotion.matches || document.hidden || !trailContext) return;

        const column = Math.floor(event.clientX / cellWidth);
        const row = Math.floor(event.clientY / cellHeight);
        const previousPoint = trails[trails.length - 1];
        if (previousPoint?.column === column && previousPoint?.row === row) return;

        trails.push({ column, row, x: event.clientX, y: event.clientY, created: performance.now() });
        if (trails.length > 40) trails.shift();

        if (animationFrame === null) {
            previousFrame = performance.now() - frameInterval;
            animationFrame = requestAnimationFrame(animate);
        }
    }

    function resizeField() {
        if (!context || !trailContext) return;
        if (portraitCanvas.dataset.image && !portraitCanvas.dataset.mask && !imageMaskLoaded) return;
        width = portraitCanvas.clientWidth;
        height = portraitCanvas.clientHeight;
        if (!width || !height) return;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        portraitCanvas.width = Math.round(width * ratio);
        portraitCanvas.height = Math.round(height * ratio);
        trailCanvas.width = Math.round(width * ratio);
        trailCanvas.height = Math.round(height * ratio);
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        trailContext.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.font = '8px monospace';
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.fillStyle = '#666666';
        context.globalAlpha = 0.6;

        const imageRatio = maskWidth / maskHeight;
        // Cover the full viewport while preserving the portrait's proportions.
        const imageWidth = Math.max(width, height * imageRatio);
        const imageHeight = imageWidth / imageRatio;
        const left = (width - imageWidth) / 2;
        const top = (height - imageHeight) / 2;
        columns = Math.ceil(width / cellWidth);
        rows = Math.ceil(height / cellHeight);
        cells = [];

        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                const x = (column + 0.5) * cellWidth;
                const y = (row + 0.5) * cellHeight;
                const u = (x - left) / imageWidth;
                const v = (y - top) / imageHeight;
                let density = 0.35;
                if (u >= 0 && u < 1 && v >= 0 && v < 1) {
                    const sampleX = Math.floor(u * maskWidth);
                    const sampleY = Math.floor(v * maskHeight);
                    const brightness = mask[sampleY * maskWidth + sampleX];
                    const portraitDensity = Math.max(0, Math.min(1, (brightness - 25) / 180));
                    // Blend placement density at the perimeter, keeping every digit identical in tone.
                    const edge = Math.min(u, 1 - u, v, 1 - v);
                    const blend = Math.min(1, edge / 0.18);
                    const smoothBlend = blend * blend * (3 - 2 * blend);
                    density = density * (1 - smoothBlend) + portraitDensity * smoothBlend;
                }
                const cell = {
                    x: column * cellWidth,
                    y: row * cellHeight,
                    density,
                    visible: Math.random() < density,
                    character: Math.random() < 0.5 ? '0' : '1'
                };
                cells.push(cell);
                drawCell(cell);
            }
        }
        updateMotion();
    }

    window.addEventListener('resize', resizeField);
    window.addEventListener('pointermove', trackPointer, { passive: true });
    window.addEventListener('pointerdown', trackPointer, { passive: true });
    document.addEventListener('visibilitychange', updateMotion);
    reducedMotion.addEventListener('change', updateMotion);
    if (portraitCanvas.dataset.mask) {
        maskWidth = 160;
        maskHeight = Number(portraitCanvas.dataset.maskHeight);
        mask = Uint8Array.from(atob(portraitCanvas.dataset.mask), character => character.charCodeAt(0));
        resizeField();
    } else if (portraitCanvas.dataset.image) {
        const image = new Image();
        image.onload = () => {
            maskWidth = 160;
            maskHeight = Math.round(maskWidth * image.naturalHeight / image.naturalWidth);
            const sampleCanvas = document.createElement('canvas');
            sampleCanvas.width = maskWidth;
            sampleCanvas.height = maskHeight;
            const sampleContext = sampleCanvas.getContext('2d');
            sampleContext.drawImage(image, 0, 0, maskWidth, maskHeight);
            const pixels = sampleContext.getImageData(0, 0, maskWidth, maskHeight).data;
            mask = new Uint8Array(maskWidth * maskHeight);
            for (let i = 0; i < mask.length; i++) {
                const offset = i * 4;
                mask[i] = Math.round(pixels[offset] * 0.2126 +
                    pixels[offset + 1] * 0.7152 + pixels[offset + 2] * 0.0722);
            }
            imageMaskLoaded = true;
            resizeField();
        };
        image.src = portraitCanvas.dataset.image;
    } else {
        resizeField();
    }
}
