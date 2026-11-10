/* Each post's permanent id gives it its own copyable link. */
document.querySelectorAll(".blog-share-button").forEach((copyButton) => {
    const post = copyButton.closest("article");
    const status = post.querySelector(".blog-share-status");
    const linkFallback = post.querySelector(".blog-share-link");
    const linkInput = linkFallback.querySelector("input");
    const postUrl = new URL(window.location.href);
    postUrl.search = "";
    postUrl.hash = post.id;
    const url = postUrl.href;
    copyButton.title = "Copy post link — " + url;
    copyButton.dataset.postUrl = url;
    linkInput.value = url;

    copyButton.addEventListener("click", async () => {
        copyButton.disabled = true;
        status.textContent = "";

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(url);
            } else {
                linkFallback.hidden = false;
                linkInput.focus();
                linkInput.select();
                if (!document.execCommand("copy")) {
                    throw new Error("Clipboard copy is unavailable");
                }
            }
            linkFallback.hidden = true;
            status.textContent = "link copied";
            copyButton.focus();
        } catch {
            linkFallback.hidden = false;
            linkInput.focus();
            linkInput.select();
            status.textContent = "copy the selected post link";
        } finally {
            copyButton.disabled = false;
        }
    });
});