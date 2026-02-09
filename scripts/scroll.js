
window.addEventListener("load", () => {
    if (window.location.hash) {
        history.replaceState(null, null, window.location.pathname);
        window.scrollTo(0, 0);
    }
});

const backToTopButton = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTopButton.style.display = "flex";
    } else {
        backToTopButton.style.display = "none";
    }
});

backToTopButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});
