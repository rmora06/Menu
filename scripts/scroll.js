
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


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".section-header").forEach(header => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      const btn = header.querySelector(".toggle-btn");

      content.classList.toggle("hidden");
      btn.textContent = content.classList.contains("hidden") ? "▼" : "−";
    });
  });
});