
/* ==========================================
   CHRISTINA NEO ART — WEBSITE JAVASCRIPT
   ========================================== */


/* ==========================================
   ELEMENTS
   ========================================== */

const searchButton = document.querySelector(".search-toggle");
const searchForm = document.querySelector(".search-form");
const searchInput = searchForm?.querySelector('input[type="search"]');
const portfolioDropdowns = document.querySelectorAll(".dropdown");

function setPortfolioDropdownOpen(dropdown, isOpen) {
    const arrowButton = dropdown.querySelector(".dropdown-arrow");

    dropdown.classList.toggle("is-open", isOpen);
    arrowButton?.setAttribute("aria-expanded", String(isOpen));
    arrowButton?.setAttribute(
        "aria-label",
        isOpen ? "Close portfolio pages" : "Open portfolio pages"
    );
}

portfolioDropdowns.forEach((dropdown) => {
    const arrowButton = dropdown.querySelector(".dropdown-arrow");

    arrowButton?.addEventListener("click", (event) => {
        event.stopPropagation();
        const shouldOpen = !dropdown.classList.contains("is-open");

        portfolioDropdowns.forEach((otherDropdown) => {
            setPortfolioDropdownOpen(otherDropdown, false);
        });

        if (shouldOpen) {
            setPortfolioDropdownOpen(dropdown, true);
        }
    });
});

document.addEventListener("click", (event) => {
    const clickedInsideDropdown = event.target instanceof Element
        && event.target.closest(".dropdown");

    if (!clickedInsideDropdown) {
        portfolioDropdowns.forEach((dropdown) => {
            setPortfolioDropdownOpen(dropdown, false);
        });
    }
});

/* ==========================================
   SEARCH TOGGLE
   ========================================== */

if (searchButton && searchForm) {

    searchButton.addEventListener("click", () => {

        searchForm.hidden = !searchForm.hidden;

        const isOpen = !searchForm.hidden;

        searchButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        if (isOpen && searchInput) {
            searchInput.focus();
        }

    });

}


/* ==========================================
   SEARCH FUNCTIONALITY
   ========================================== */

const pages = {

    home: "index.html",

    portfolio: "portfolio.html",

    paintings: "paintings.html",

    printmaking: "printmaking.html",

    "3d": "3d.html",

    about: "about.html",

    contact: "contact.html"

};

if (searchForm && searchInput) {

    searchForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const query = searchInput.value
            .toLowerCase()
            .trim();

        if (!query) {
            return;
        }

        const match = Object.keys(pages).find((key) => {
            return key.includes(query);
        });

        if (match) {

            window.location.href = pages[match];

        } else {

            alert("No matching page found.");

        }

    });

}


/* ==========================================
   ESCAPE KEY — CLOSE MENUS
   ========================================== */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        portfolioDropdowns.forEach((dropdown) => {
            setPortfolioDropdownOpen(dropdown, false);
        });

        // Close search
        if (searchForm && searchButton) {

            searchForm.hidden = true;

            searchButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }

});
// ==================================
// PAINTING LIGHTBOX
// ==================================

const lightbox = document.getElementById("paintingLightbox");

if (lightbox) {
    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const closeButton = lightbox.querySelector(".lightbox-close");

    const paintings = document.querySelectorAll(".lightbox-trigger");

    paintings.forEach((painting) => {
        painting.addEventListener("click", () => {
            lightboxImage.src = painting.src;
            lightboxImage.alt = painting.alt;
            lightboxCaption.textContent = painting.alt;

            lightbox.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    });

    function closeLightbox() {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
    }

   closeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    closeLightbox();
});

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeLightbox();
        }
    });
}

/* ==========================================
   CONTACT EMAIL DRAFT
   ========================================== */

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const fields = new FormData(contactForm);
        const name = fields.get("name").trim();
        const email = fields.get("email").trim();
        const subject = fields.get("su").trim();
        const message = fields.get("body").trim();
        const body = [message, "", "From: " + name, "Email: " + email].join("\r\n");

        const draftUrl = new URL(contactForm.action);
        draftUrl.searchParams.set("view", fields.get("view"));
        draftUrl.searchParams.set("fs", fields.get("fs"));
        draftUrl.searchParams.set("to", fields.get("to"));
        draftUrl.searchParams.set("su", subject);
        draftUrl.searchParams.set("body", body);

        window.open(draftUrl.href, "_blank", "noopener,noreferrer");
    });
}

/* ==========================================
   PRINTMAKING IMAGE POPUP
   ========================================== */

if (window.location.pathname.endsWith("printmaking.html")) {

    const modal = document.getElementById("artwork-modal");
    const modalImage = modal?.querySelector(".modal-image");
    const closeButton = modal?.querySelector(".modal-close");

    if (modal && modalImage && closeButton) {

        document.querySelectorAll(".artwork-image img").forEach(img => {

            img.style.cursor = "pointer";

            img.addEventListener("click", () => {
                modalImage.src = img.src;
                modalImage.alt = img.alt;
                modal.hidden = false;
                document.body.style.overflow = "hidden";
            });

        });

        function closeModal() {
            modal.hidden = true;
            modalImage.removeAttribute("src");
            document.body.style.overflow = "";
        }

        closeButton.addEventListener("click", closeModal);

        modal.addEventListener("click", event => {
            if (event.target === modal) closeModal();
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && !modal.hidden) {
                closeModal();
            }
        });

    }
}


/* Play the cat sound when the logo is activated. */
const logoButton = document.querySelector("button.brand");

if (logoButton) {
    const logoSound = new Audio("images/sounds/cat.mp3");
    logoSound.preload = "none";

    logoButton.addEventListener("click", () => {
        logoSound.currentTime = 0;
        logoSound.play().catch((error) => {
            console.warn("The logo sound could not play.", error);
        });
    });
}
