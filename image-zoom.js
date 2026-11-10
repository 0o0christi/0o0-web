/* Shared zoom and pan for opened artwork and portrait images. */
document.querySelectorAll(".lightbox-image, .modal-image").forEach((image) => {
    const popup = image.closest(".lightbox, .artwork-modal, dialog");
    if (!popup) return;

    let scale = 1;
    let panX = 0;
    let panY = 0;
    let dragged = false;
    let gestureScale = 1;
    const pointers = new Map();
    image.classList.add("zoomable-image");
    popup.classList.add("zoomable-popup");

    function isOpen() {
        if (popup.tagName === "DIALOG") return popup.open;
        if (popup.classList.contains("lightbox")) return popup.classList.contains("active");
        return !popup.hidden;
    }

    function render() {
        const viewport = popup.getBoundingClientRect();
        const fit = Math.min(image.clientWidth / image.naturalWidth,
            image.clientHeight / image.naturalHeight);
        const width = image.naturalWidth * fit || image.clientWidth;
        const height = image.naturalHeight * fit || image.clientHeight;
        const limitX = Math.max(0, (width * scale - viewport.width) / 2);
        const limitY = Math.max(0, (height * scale - viewport.height) / 2);
        panX = Math.max(-limitX, Math.min(limitX, panX));
        panY = Math.max(-limitY, Math.min(limitY, panY));
        image.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
        image.style.cursor = scale > 1 ? "grab" : "zoom-in";
    }

    function reset() {
        scale = 1;
        panX = 0;
        panY = 0;
        pointers.clear();
        dragged = false;
        render();
    }

    function zoomAt(nextScale, clientX, clientY) {
        const rect = image.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2 - panX;
        const centerY = rect.top + rect.height / 2 - panY;
        nextScale = Math.max(1, Math.min(8, nextScale));
        const ratio = nextScale / scale;
        panX = clientX - centerX - (clientX - centerX - panX) * ratio;
        panY = clientY - centerY - (clientY - centerY - panY) * ratio;
        scale = nextScale;
        render();
    }

    popup.addEventListener("wheel", (event) => {
        if (!isOpen() || event.target.closest("button")) return;
        event.preventDefault();
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? popup.clientHeight : 1;
        const delta = Math.max(-100, Math.min(100, event.deltaY * unit));
        zoomAt(scale * Math.exp(-delta * 0.01), event.clientX, event.clientY);
    }, { passive: false });

    popup.addEventListener("pointerdown", (event) => {
        if (!isOpen() || event.target.closest("button") || event.button !== 0) return;
        if (pointers.size === 0) dragged = false;
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        event.target.setPointerCapture(event.pointerId);
    });

    popup.addEventListener("pointermove", (event) => {
        if (!pointers.has(event.pointerId)) return;
        const before = [...pointers.values()];
        const previous = pointers.get(event.pointerId);
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        const after = [...pointers.values()];

        if (before.length >= 2) {
            const distance = Math.hypot(before[1].x - before[0].x, before[1].y - before[0].y);
            const nextDistance = Math.hypot(after[1].x - after[0].x, after[1].y - after[0].y);
            const centerX = (before[0].x + before[1].x) / 2;
            const centerY = (before[0].y + before[1].y) / 2;
            if (distance > 0) zoomAt(scale * nextDistance / distance, centerX, centerY);
            panX += (after[0].x + after[1].x) / 2 - centerX;
            panY += (after[0].y + after[1].y) / 2 - centerY;
            dragged = true;
        } else if (scale > 1) {
            const deltaX = event.clientX - previous.x;
            const deltaY = event.clientY - previous.y;
            panX += deltaX;
            panY += deltaY;
            if (Math.abs(deltaX) + Math.abs(deltaY) > 2) dragged = true;
        }
        render();
    });

    function releasePointer(event) {
        pointers.delete(event.pointerId);
    }

    popup.addEventListener("pointerup", releasePointer);
    popup.addEventListener("pointercancel", releasePointer);
    popup.addEventListener("lostpointercapture", releasePointer);
    image.addEventListener("dragstart", (event) => event.preventDefault());
    popup.addEventListener("click", (event) => {
        if (dragged && !event.target.closest("button")) {
            event.stopImmediatePropagation();
            dragged = false;
        }
    }, true);

    /* Safari trackpad gestures on browsers that expose GestureEvent. */
    popup.addEventListener("gesturestart", (event) => {
        if (!isOpen()) return;
        event.preventDefault();
        gestureScale = scale;
    }, { passive: false });
    popup.addEventListener("gesturechange", (event) => {
        if (!isOpen()) return;
        event.preventDefault();
        if (pointers.size >= 2) return;
        const rect = image.getBoundingClientRect();
        zoomAt(gestureScale * event.scale,
            rect.left + rect.width / 2, rect.top + rect.height / 2);
    }, { passive: false });

    popup.addEventListener("gestureend", (event) => {
        if (isOpen()) event.preventDefault();
    }, { passive: false });

    document.addEventListener("keydown", (event) => {
        if (!isOpen() || event.ctrlKey || event.metaKey || event.altKey) return;
        if (!["+", "=", "-", "0"].includes(event.key)) return;
        event.preventDefault();
        if (event.key === "0") {
            reset();
        } else {
            const rect = image.getBoundingClientRect();
            zoomAt(scale * (event.key === "-" ? 0.8 : 1.25),
                rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    });

    new MutationObserver(reset).observe(popup, {
        attributes: true, attributeFilter: ["class", "hidden", "open"]
    });
    new MutationObserver(reset).observe(image, {
        attributes: true, attributeFilter: ["src"]
    });
    image.addEventListener("load", reset);
    window.addEventListener("resize", reset);
});
