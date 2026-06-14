// Pega aquí el ID que copiaste de tu Google Sheet
const SHEET_ID = '1ka9ezOL7_67hGvu6pZRtJq0LGcE5rqTxkkvq-PnGoRE'; 

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

// 2. Lógica para cargar desde Google Sheets
document.addEventListener("DOMContentLoaded", () => {
   // Le añadimos la fecha y hora exacta al final de la URL para evitar el caché
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&_=${new Date().getTime()}`;
    fetch(url)
        .then(res => res.text())
        .then(text => {
            // Google envuelve el JSON en una función, aquí la recortamos para obtener los datos limpios
            const jsonLimpio = JSON.parse(text.substring(47).slice(0, -2));
            
            // Procesamos las filas del Excel para crear nuestro objeto de menú
            menuDataGlobal = procesarDatosGoogleSheets(jsonLimpio.table.rows);
            
            // Dibujamos el menú
            renderizarMenu(menuDataGlobal);

            // Activamos el carrito
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
        .catch(error => console.error("Error al cargar desde Google Sheets:", error));
});

// 3. Función para convertir las celdas de Google en nuestro formato
function procesarDatosGoogleSheets(filas) {
    const menuData = {};

    filas.forEach(fila => {
        // Si la fila está completamente vacía, la saltamos
        if (!fila.c || !fila.c[0]) return;

        // Extraemos los valores de las columnas (A=0, B=1, C=2...)
        // Usamos ?.v para evitar errores si una celda está vacía
        const categoria = fila.c[0]?.v || '';
        const nombre = fila.c[1]?.v || '';
        const descripcion = fila.c[2]?.v || '';
        const precio = fila.c[3]?.v || 0;
        const imagen = fila.c[4]?.v || '';
        const disponible = fila.c[5]?.v || 'NO';

        // Solo procesamos el plato si dice "SI" en la columna de disponible
        if (disponible.toString().toUpperCase().trim() === 'SI') {
            
            // Si la categoría aún no existe en nuestro objeto, la creamos
            if (!menuData[categoria]) {
                menuData[categoria] = [];
            }

            // Añadimos el plato a su categoría
            menuData[categoria].push({
                nombre,
                descripcion,
                precio,
                imagen
            });
        }
    });

    return menuData;
}

// 4. Función para filtrar en el buscador (Se mantiene igual)
function filtrarMenu(termino) {
    const menuFiltrado = {};

    for (const categoria in menuDataGlobal) {
        const platosFiltrados = menuDataGlobal[categoria].filter(plato => {
            return plato.nombre.toLowerCase().includes(termino) || 
                   plato.descripcion.toLowerCase().includes(termino);
        });

        if (platosFiltrados.length > 0) {
            menuFiltrado[categoria] = platosFiltrados;
        }
    }

    renderizarMenu(menuFiltrado);

    if (typeof attachCartEvents === "function") {
        attachCartEvents();
    }
}

// 5. Función para dibujar los platos (Se mantiene igual)
function renderizarMenu(datosAMostrar) {
    const categoriasHtml = ["entradas", "platos-fuertes", "postres", "bebidas"];

    categoriasHtml.forEach(categoria => {
        const contenedor = document.getElementById(`contenedor-${categoria}`);
        const seccion = document.getElementById(categoria);
        
        if (contenedor && seccion) {
            if (datosAMostrar[categoria] && datosAMostrar[categoria].length > 0) {
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
                seccion.style.display = "block"; 
                
            } else {
                contenedor.innerHTML = '';
                seccion.style.display = "none";
            }
        }
    });
}

// ==========================================
// Lógica del Modal de Oferta (Popup)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('ofertaModal');
    const btnCerrar = document.getElementById('cerrarOferta');
    const btnAprovechar = document.getElementById('aprovecharOferta');

    if (modal && btnCerrar) {
        // Comprobamos si el cliente ya vio la oferta en esta sesión
        if (!sessionStorage.getItem('ofertaVista')) {
            // Esperamos 1.5 segundos después de que carga la página para que no sea tan brusco
            setTimeout(() => {
                modal.classList.add('show');
                // Marcamos que ya la vio para que no vuelva a salir
                sessionStorage.setItem('ofertaVista', 'true');
            }, 1500);
        }

        // Función para ocultar el modal
        const cerrarModal = () => modal.classList.remove('show');
        
        // Cerrar con la "X" o con el botón "¡Lo quiero!"
        btnCerrar.addEventListener('click', cerrarModal);
        btnAprovechar.addEventListener('click', cerrarModal);
        
        // Cerrar si el usuario hace clic afuera del cuadro blanco
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModal();
        });
    }
});