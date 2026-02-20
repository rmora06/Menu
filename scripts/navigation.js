const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const overlay = document.getElementById("overlay");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        mobileMenu.classList.add("active");
        overlay.classList.add("active");
        hamburger.classList.add("hidden");
    });

    overlay.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        overlay.classList.remove("active");
        hamburger.classList.remove("hidden");
    });

    document.querySelectorAll(".mobile-nav a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
            overlay.classList.remove("active");
            hamburger.classList.remove("hidden");
        });
    });
}