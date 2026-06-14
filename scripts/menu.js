// Variable global para guardar el menú original y poder buscar en él sin recargar
let menuDataGlobal = {};

// 1. Lógica original para mostrar/ocultar secciones
document.querySelectorAll(".section-header").forEach(header => {
    const content = header.nextElementSibling;
    const btn = header.querySelector(".toggle-btn");

    header.addEventListener("click", () => {
        content.classList.toggle("hidden");
        btn.textContent = content.classList.contains("hidden") ? "↓" : "↑";
    });
});

// 2. Lógica para cargar el JSON y configurar el buscador
document.addEventListener("DOMContentLoaded", () => {
    fetch('data/menu.json')
        .then(respuesta => respuesta.json())
        .then(datos => {
            menuDataGlobal = datos; // Guardamos la copia original
            renderizarMenu(menuDataGlobal); // Dibujamos todo por primera vez

            // Activamos los botones del carrito
            if (typeof attachCartEvents === "function") {
                attachCartEvents();
            }

            // Configuramos el buscador
            const searchInput = document.getElementById('searchInput');
            if(searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const terminoBusqueda = e.target.value.toLowerCase().trim();
                    filtrarMenu(terminoBusqueda);
                });
            }
        })
        .catch(error => console.error("Error al cargar el menú:", error));
});

// 3. Función para filtrar los datos
function filtrarMenu(termino) {
    const menuFiltrado = {};

    for (const categoria in menuDataGlobal) {
        // Filtramos buscando en el nombre O en la descripción
        const platosFiltrados = menuDataGlobal[categoria].filter(plato => {
            return plato.nombre.toLowerCase().includes(termino) || 
                   plato.descripcion.toLowerCase().includes(termino);
        });

        // Solo guardamos la categoría si encontramos platos que coincidan
        if (platosFiltrados.length > 0) {
            menuFiltrado[categoria] = platosFiltrados;
        }
    }

    // Redibujamos el menú con los datos filtrados
    renderizarMenu(menuFiltrado);

    // Como los platos se volvieron a crear, necesitamos reconectar los botones de "+" y "-"
    if (typeof attachCartEvents === "function") {
        attachCartEvents();
    }
}

// 4. Función para dibujar los platos en el HTML
function renderizarMenu(datosAMostrar) {
    // Lista de todas tus categorías en el HTML
    const categoriasHtml = ["entradas", "platos-fuertes", "postres", "bebidas"];

    categoriasHtml.forEach(categoria => {
        const contenedor = document.getElementById(`contenedor-${categoria}`);
        const seccion = document.getElementById(categoria);
        
        if (contenedor && seccion) {
            // Si hay platos para esta categoría, los dibujamos y mostramos la sección
            if (datosAMostrar[categoria]) {
                let contenidoHTML = '';
                
                datosAMostrar[categoria].forEach(plato => {
                    contenidoHTML += `
                        <article class="menu-item" data-price="${plato.precio}">
                            <div class="item-info">
                                <h3>${plato.nombre}</h3>
                                <p>${plato.descripcion} <br><b>RD$ ${plato.precio}</b></p>
                            </div>
                            <img src="${plato.imagen}" alt="${plato.nombre}">
                            <div class="cart-controls">
                                <button class="add-btn">+</button>
                                <span class="quantity">0</span>
                                <button class="remove-btn">−</button>
                            </div>
                        </article>
                    `;
                });
                
                contenedor.innerHTML = contenidoHTML;
                seccion.style.display = "block"; // Asegura que la categoría se vea
                
            } else {
                // Si NO hay platos (por ejemplo, buscaste "Jugo" y estás en "Postres")
                // Vaciamos el contenedor y ocultamos la categoría entera
                contenedor.innerHTML = '';
                seccion.style.display = "none";
            }
        }
    });
}