/* Reveal the About portrait with the desktop keyboard code. */
const portraitPopup = document.getElementById("portrait-easter-egg");

if (portraitPopup) {
    const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const touchPointer = window.matchMedia("(any-pointer: coarse)");
    const closePortrait = portraitPopup.querySelector("button");
    let typedCode = "";
    let previousOverflow = "";

    document.addEventListener("keydown", (event) => {
        if (!desktopPointer.matches || touchPointer.matches || portraitPopup.open) {
            typedCode = "";
            return;
        }

        if (event.defaultPrevented || event.isComposing || event.repeat
            || event.ctrlKey || event.altKey || event.metaKey
            || event.target.closest("input, textarea, select, [contenteditable]")) {
            typedCode = "";
            return;
        }

        if (event.key === "Enter") {
            if (typedCode.trim().endsWith("0o0")) {
                event.preventDefault();
                previousOverflow = document.body.style.overflow;
                portraitPopup.showModal();
                document.body.style.overflow = "hidden";
            }
            typedCode = "";
        } else if (event.key === "Backspace") {
            typedCode = typedCode.slice(0, -1);
        } else if (event.key === "Escape") {
            typedCode = "";
        } else if (event.key.length === 1) {
            typedCode = (typedCode + event.key).slice(-32);
        }
    });

    closePortrait.addEventListener("click", () => portraitPopup.close());

    portraitPopup.addEventListener("click", (event) => {
        if (event.target === portraitPopup) portraitPopup.close();
    });

    portraitPopup.addEventListener("close", () => {
        document.body.style.overflow = previousOverflow;
        typedCode = "";
    });

    window.addEventListener("blur", () => {
        typedCode = "";
    });
}