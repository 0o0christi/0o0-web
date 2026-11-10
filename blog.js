/* Every article needs a unique, permanent id for its share link. */
document.querySelectorAll(".blog-share-button").forEach((shareButton) => {
    const post = shareButton.closest("article");
    const shareStatus = post.querySelector(".blog-share-status");
    const linkFallback = post.querySelector(".blog-share-link");
    const linkInput = linkFallback.querySelector("input");
    const postUrl = new URL(window.location.href);
    postUrl.search = "";
    postUrl.hash = post.id;
    const url = postUrl.href;
    const title = "0o0 — " + post.querySelector("h2").textContent;
    const controls = document.createElement("div");
    controls.className = "blog-share-controls";
    shareButton.before(controls);
    controls.append(shareButton);
    controls.insertAdjacentHTML("beforeend", `
        <div class="blog-share-panel" id="${post.id}-share" role="group" aria-label="Share this post" hidden>
            <p>share this post</p>
            <button type="button" data-share-app="discord">discord</button>
            <button type="button" data-share-app="instagram">instagram</button>
            <a data-share-facebook target="_blank" rel="noopener noreferrer">facebook</a>
            <button type="button" data-share-app="messenger">messenger</button>
            <a data-share-whatsapp target="_blank" rel="noopener noreferrer">whatsapp</a>
            <button type="button" data-share-copy>copy link</button>
            <button type="button" data-share-more>more apps</button>
        </div>
    `);
    const panel = controls.querySelector(".blog-share-panel");
    panel.querySelector("[data-share-facebook]").href =
        "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
    panel.querySelector("[data-share-whatsapp]").href =
        "https://wa.me/?text=" + encodeURIComponent(url);
    shareButton.setAttribute("aria-expanded", "false");
    shareButton.setAttribute("aria-controls", panel.id);

    function closePanel() {
        panel.hidden = true;
        shareButton.setAttribute("aria-expanded", "false");
    }

    async function copyLink(appName) {
        try {
            await navigator.clipboard.writeText(url);
            shareStatus.textContent = appName
                ? "link copied — paste it into your " + appName + " conversation"
                : "link copied";
            linkFallback.hidden = true;
        } catch {
            linkFallback.hidden = false;
            linkInput.value = url;
            linkInput.focus();
            linkInput.select();
            shareStatus.textContent = "copy the selected link";
        }
    }

    async function shareToDevice(appName) {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
                return;
            } catch (error) {
                if (error.name === "AbortError") return;
            }
        }
        await copyLink(appName);
    }

    shareButton.addEventListener("click", () => {
        panel.hidden = !panel.hidden;
        shareButton.setAttribute("aria-expanded", String(!panel.hidden));
        shareStatus.textContent = "";
        linkFallback.hidden = true;
    });

    const inboxes = {
        discord: "https://discord.com/channels/@me",
        instagram: "https://www.instagram.com/direct/inbox/",
        messenger: "https://www.messenger.com/"
    };

    panel.querySelectorAll("[data-share-app]").forEach((button) => {
        button.addEventListener("click", () => {
            const appName = button.dataset.shareApp;
            if (navigator.share) {
                shareStatus.textContent = "choose " + appName + " in your device’s share menu";
                shareToDevice(appName);
            } else {
                copyLink(appName);
                window.open(inboxes[appName], "_blank", "noopener,noreferrer");
            }
            closePanel();
        });
    });

    panel.querySelector("[data-share-copy]").addEventListener("click", () => {
        copyLink();
        closePanel();
    });

    panel.querySelector("[data-share-more]").addEventListener("click", () => {
        shareToDevice();
        closePanel();
    });

    panel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closePanel);
    });

    document.addEventListener("click", (event) => {
        if (!controls.contains(event.target)) closePanel();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !panel.hidden) {
            closePanel();
            shareButton.focus();
        }
    });
});