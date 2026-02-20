document.querySelectorAll(".section-header").forEach(header => {
    const content = header.nextElementSibling;
    const btn = header.querySelector(".toggle-btn");

    header.addEventListener("click", () => {
        content.classList.toggle("hidden");
        btn.textContent = content.classList.contains("hidden") ? "↓" : "↑";
    });
});