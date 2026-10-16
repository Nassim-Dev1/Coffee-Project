"use strict";

/* ============================================
   SMOOTH SCROLL FOR ALL ANCHOR LINKS
   ============================================ */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");

        // Prevent jump-to-top on placeholder links (e.g. social icons)
        if (!href || href === "#") {
            event.preventDefault();
            return;
        }

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        closeMobileNav();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});

/* ============================================
   NAVBAR SCROLL EFFECT (HIGH PERFORMANCE)
   ============================================ */

const navbar = document.getElementById("navbar");
let isNavbarScrolled = false;

window.addEventListener("scroll", () => {
    const shouldBeScrolled = window.scrollY > 80;
    if (shouldBeScrolled !== isNavbarScrolled) {
        isNavbarScrolled = shouldBeScrolled;
        navbar?.classList.toggle("scrolled", isNavbarScrolled);
    }
}, { passive: true });

/* ============================================
   MOBILE NAVIGATION DRAWER & OVERLAY
   ============================================ */

const menuToggle = document.getElementById("menu-toggle");
const mobileNavDrawer = document.getElementById("mobile-nav-drawer");
const mobileNavOverlay = document.getElementById("mobile-nav-overlay");
const mobileNavClose = document.getElementById("mobile-nav-close");

function openMobileNav() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.add("active");
    mobileNavOverlay?.classList.add("active");
    menuToggle?.classList.add("active");
    menuToggle?.setAttribute("aria-expanded", "true");
    mobileNavDrawer.setAttribute("aria-hidden", "false");
    mobileNavOverlay?.setAttribute("aria-hidden", "false");
    document.body.classList.add("mobile-nav-open");
}

function closeMobileNav() {
    if (!mobileNavDrawer) return;
    mobileNavDrawer.classList.remove("active");
    mobileNavOverlay?.classList.remove("active");
    menuToggle?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
    mobileNavDrawer.setAttribute("aria-hidden", "true");
    mobileNavOverlay?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mobile-nav-open");
}

function toggleMobileNav() {
    if (mobileNavDrawer?.classList.contains("active")) {
        closeMobileNav();
    } else {
        openMobileNav();
    }
}

menuToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMobileNav();
});

mobileNavClose?.addEventListener("click", closeMobileNav);
mobileNavOverlay?.addEventListener("click", closeMobileNav);

// Close on Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileNavDrawer?.classList.contains("active")) {
        closeMobileNav();
    }
});

// Auto close on window resize to desktop
window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && mobileNavDrawer?.classList.contains("active")) {
        closeMobileNav();
    }
});

/* ============================================
   RATING MODAL
   ============================================ */

const heroRateBtn = document.getElementById("hero-btn");
const ratingModal = document.getElementById("rating-modal");
const modalClose = ratingModal?.querySelector(".modal-close");
const stars = ratingModal?.querySelectorAll(".star");
const ratingText = document.getElementById("rating-text");
const feedbackInput = document.getElementById("rating-feedback");
const submitRating = document.getElementById("submit-rating");
const ratingSuccess = document.getElementById("rating-success");

const ratingMessages = {
    1: "We're sorry to hear that",
    2: "We'll do better next time",
    3: "Thanks for your feedback",
    4: "Glad you enjoyed it!",
    5: "Amazing! Thank you so much!"
};

let selectedRating = 0;

function openRatingModal() {
    if (!ratingModal) return;
    ratingModal.classList.add("active");
    document.body.classList.add("modal-open");
    resetRatingForm();
}

function closeRatingModal() {
    if (!ratingModal) return;
    ratingModal.classList.remove("active");
    document.body.classList.remove("modal-open");
}

function resetRatingForm() {
    selectedRating = 0;
    stars?.forEach((s) => {
        s.classList.remove("lit");
        s.setAttribute("aria-checked", "false");
    });
    if (ratingText) ratingText.textContent = "Tap a star to rate";
    if (feedbackInput) feedbackInput.value = "";
    if (submitRating) submitRating.disabled = true;
    if (ratingSuccess) ratingSuccess.style.display = "none";
}

function highlightStars(count) {
    stars?.forEach((s, i) => {
        s.classList.toggle("lit", i < count);
    });
}

// Open modal when clicking "Rate us" button
heroRateBtn?.addEventListener("click", openRatingModal);

// Close modal
modalClose?.addEventListener("click", closeRatingModal);

ratingModal?.addEventListener("click", (event) => {
    if (event.target === ratingModal) closeRatingModal();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && ratingModal && ratingModal.classList.contains("active")) {
        closeRatingModal();
    }
});

// Star interactions
stars?.forEach((star) => {
    const value = Number(star.dataset.rating);

    star.addEventListener("mouseenter", () => {
        highlightStars(value);
        if (ratingText) ratingText.textContent = ratingMessages[value];
    });

    star.addEventListener("mouseleave", () => {
        highlightStars(selectedRating);
        if (ratingText) {
            ratingText.textContent = selectedRating > 0
                ? ratingMessages[selectedRating]
                : "Tap a star to rate";
        }
    });

    star.addEventListener("click", () => {
        selectedRating = value;
        highlightStars(value);
        stars?.forEach((s) => {
            s.setAttribute("aria-checked", String(Number(s.dataset.rating) === value));
        });
        if (ratingText) ratingText.textContent = ratingMessages[value];
        if (submitRating) submitRating.disabled = false;
    });
});

// Submit rating
submitRating?.addEventListener("click", () => {
    if (selectedRating === 0) return;

    const data = {
        rating: selectedRating,
        feedback: feedbackInput?.value.trim() || "",
        timestamp: new Date().toISOString()
    };

    try {
        const existing = JSON.parse(localStorage.getItem("coffeeHouseRatings") || "[]");
        existing.push(data);
        localStorage.setItem("coffeeHouseRatings", JSON.stringify(existing));
    } catch (e) {
        console.warn("Could not save rating:", e);
    }

    const formElements = ratingModal?.querySelectorAll(
        ".stars-container, .rating-text, #rating-feedback, #submit-rating, .modal-subtitle"
    );
    formElements?.forEach((el) => { el.style.display = "none"; });
    if (ratingSuccess) ratingSuccess.style.display = "block";

    setTimeout(() => {
        closeRatingModal();
        setTimeout(() => {
            formElements?.forEach((el) => { el.style.display = ""; });
            resetRatingForm();
        }, 300);
    }, 2000);
});
