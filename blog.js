document.querySelectorAll(".blog-share-button").forEach((shareButton) => {
    const post = shareButton.closest("article");
    const shareStatus = post.querySelector(".blog-share-status");
    const linkFallback = post.querySelector(".blog-share-link");
    const linkInput = linkFallback.querySelector("input");
    const postUrl = new URL("#" + post.id, window.location.href).href;

    shareButton.addEventListener("click", async () => {
        shareButton.disabled = true;
        shareStatus.textContent = "";
        linkFallback.hidden = true;

        try {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "0o0 — " + post.querySelector("h2").textContent,
                        url: postUrl
                    });
                    return;
                } catch (error) {
                    if (error.name === "AbortError") return;
                }
            }

            try {
                await navigator.clipboard.writeText(postUrl);
                shareStatus.textContent = "link copied";
            } catch {
                linkFallback.hidden = false;
                linkInput.value = postUrl;
                linkInput.focus();
                linkInput.select();
                shareStatus.textContent = "copy this link to share the post";
            }
        } finally {
            shareButton.disabled = false;
        }
    });
});
