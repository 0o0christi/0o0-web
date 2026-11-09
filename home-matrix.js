/* Character backdrop inspired by Aceternity UI's Matrix Trail.
   The artwork sits above this decorative canvas. */

const matrixCanvas = document.querySelector(".home-matrix");

if (matrixCanvas) {
    const matrixContext = matrixCanvas.getContext("2d");
    const fieldCanvas = document.createElement("canvas");
    const fieldContext = fieldCanvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const characters = "01";
    const cellWidth = 7;
    const cellHeight = 9;
    const trailLifetime = 1000;
    const trailRadius = 120;
    const frameInterval = 1000 / 30;
    const changeInterval = 25;
    const trails = [];
    let grid = [];
    let width = 0;
    let height = 0;
    let animationFrame = null;
    let previousFrame = 0;
    let previousChange = 0;

    function drawCell(column, row) {
        fieldContext.clearRect(column * cellWidth, row * cellHeight, cellWidth, cellHeight);
        fieldContext.globalAlpha = 0.5 + Math.random() * 0.2;
        fieldContext.fillText(grid[row][column], (column + 0.5) * cellWidth, row * cellHeight);
        fieldContext.globalAlpha = 1;
    }

    function changeBinary(timestamp) {
        if (timestamp - previousChange < changeInterval) return;
        previousChange = timestamp;

        grid.forEach((row, y) => {
            row.forEach((character, x) => {
                if (Math.random() >= 0.08) return;
                row[x] = character === "0" ? "1" : "0";
                drawCell(x, y);
            });
        });
    }

    function drawBase() {
        matrixContext.clearRect(0, 0, width, height);
        matrixContext.drawImage(fieldCanvas, 0, 0, width, height);
    }

    function drawFrame(timestamp) {
        changeBinary(timestamp);
        drawBase();
        matrixContext.font = "8px monospace";
        matrixContext.textBaseline = "top";
        matrixContext.textAlign = "center";

        while (trails.length && timestamp - trails[0].created > trailLifetime) {
            trails.shift();
        }

        const highlights = new Map();
        const columns = grid[0].length;
        trails.forEach(point => {
            const strength = 1 - (timestamp - point.created) / trailLifetime;
            const firstRow = Math.max(0, Math.floor((point.y - trailRadius) / cellHeight));
            const lastRow = Math.min(grid.length - 1, Math.ceil((point.y + trailRadius) / cellHeight));
            const firstColumn = Math.max(0, Math.floor((point.x - trailRadius) / cellWidth));
            const lastColumn = Math.min(columns - 1, Math.ceil((point.x + trailRadius) / cellWidth));

            for (let row = firstRow; row <= lastRow; row++) {
                for (let column = firstColumn; column <= lastColumn; column++) {
                    const x = (column + 0.5) * cellWidth;
                    const y = (row + 0.5) * cellHeight;
                    const distance = Math.hypot(x - point.x, y - point.y);
                    if (distance >= trailRadius) continue;

                    const falloff = 1 - distance / trailRadius;
                    const opacity = strength * falloff * 0.1;
                    const key = row * columns + column;
                    if (opacity > (highlights.get(key)?.opacity || 0)) {
                        highlights.set(key, { column, row, opacity });
                    }
                }
            }
        });

        // Draw each character once so overlapping trails stay softly lit.
        highlights.forEach(({ column, row, opacity }) => {
            matrixContext.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
            matrixContext.fillText(grid[row][column], (column + 0.5) * cellWidth, row * cellHeight);
        });
    }

    function animate(timestamp) {
        animationFrame = null;
        if (document.hidden || reducedMotion.matches) return;

        if (timestamp - previousFrame >= frameInterval) {
            previousFrame = timestamp;
            drawFrame(timestamp);
        }
        animationFrame = requestAnimationFrame(animate);
    }

    function updateMotion() {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
        trails.length = 0;
        if (!width || !height) return;

        drawBase();
        if (!document.hidden && !reducedMotion.matches) {
            previousFrame = performance.now() - frameInterval;
            previousChange = performance.now();
            animationFrame = requestAnimationFrame(animate);
        }
    }

    function resizeMatrix() {
        if (!matrixContext || !fieldContext) return;

        width = matrixCanvas.clientWidth;
        height = matrixCanvas.clientHeight;
        if (!width || !height) return;

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        matrixCanvas.width = Math.round(width * pixelRatio);
        matrixCanvas.height = Math.round(height * pixelRatio);
        fieldCanvas.width = matrixCanvas.width;
        fieldCanvas.height = matrixCanvas.height;
        matrixContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        fieldContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        fieldContext.font = "8px monospace";
        fieldContext.textBaseline = "top";
        fieldContext.textAlign = "center";
        fieldContext.fillStyle = "#666666";

        const columns = Math.ceil(width / cellWidth);
        const rows = Math.ceil(height / cellHeight);
        grid = Array.from({ length: rows }, () => {
            return Array.from({ length: columns }, () => {
                return characters[Math.floor(Math.random() * characters.length)];
            });
        });

        grid.forEach((row, y) => {
            row.forEach((character, x) => {
                drawCell(x, y);
            });
        });
        fieldContext.globalAlpha = 1;

        updateMotion();
    }

    function trackPointer(event) {
        if (reducedMotion.matches || document.hidden || !matrixContext) return;

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

    if (matrixContext && fieldContext) {
        resizeMatrix();
        window.addEventListener("resize", resizeMatrix);
        window.addEventListener("pointermove", trackPointer, { passive: true });
        window.addEventListener("pointerdown", trackPointer, { passive: true });
        document.addEventListener("visibilitychange", updateMotion);
        reducedMotion.addEventListener("change", updateMotion);
    }
}
