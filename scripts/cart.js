function showToast(message, type = "error") {

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 10);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cart-count");

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
}

const floatingCart = document.querySelector(".floating-cart");

if (floatingCart) {
    floatingCart.addEventListener("click", (e) => {
        if (cart.length === 0) {
            e.preventDefault();
            showToast("Tu carrito está vacío.");
        }
    });
}

function updateItem(name, price, note, change) {

    let item = cart.find(p => p.name === name);

    if (item) {
        item.quantity += change;

        if (note && note.trim() !== "") {
            item.note = note;
        }

        if (item.quantity <= 0) {
            cart = cart.filter(p => p.name !== name);
        }
    } else if (change > 0) {
        cart.push({
            name,
            price,
            quantity: 1,
            note: note || ""
        });
    }

    saveCart();
}

document.querySelectorAll(".menu-item").forEach(item => {

    const name = item.querySelector("h3").textContent;
    const price = parseFloat(item.dataset.price);
    const quantitySpan = item.querySelector(".quantity");
    const addBtn = item.querySelector(".add-btn");
    const removeBtn = item.querySelector(".remove-btn");
    const noteInput = item.querySelector(".item-note");
    if (noteInput) {
    noteInput.addEventListener("input", () => {
        let product = cart.find(p => p.name === name);
        if (product) {
            product.note = noteInput.value;
            saveCart();
        }
    });
}

    const existing = cart.find(p => p.name === name);
    if (existing) quantitySpan.textContent = existing.quantity;

    addBtn.addEventListener("click", () => {
        updateItem(name, price, noteInput.value, 1);
        const updated = cart.find(p => p.name === name);
        quantitySpan.textContent = updated ? updated.quantity : 0;
    });

    removeBtn.addEventListener("click", () => {
        updateItem(name, price, noteInput.value, -1);
        const updated = cart.find(p => p.name === name);
        quantitySpan.textContent = updated ? updated.quantity : 0;
    });

});

updateCartCount();