
//Funcion para agregar o disminuir la cantidad de productos en las tarjetas
function updateQty(btn, change) {
      const input = btn.parentNode.querySelector("input");
      let value = parseInt(input.value) || 1;
      value += change;
      if (value < 1) value = 1;
      input.value = value;
}


  

/*funcionalidades del carrito de compras*/

// Array de productos del carrito
    let carrito = [
      { id: 1, nombre: "Juego ollas y sartenes de acero inoxidable super resistentes", precio: 99800, cantidad: 1, imagen: "https://mayoristaprecioscuidados.com.ar/Admin/Imagenes/Items/395780.jpg" },
      { id: 2, nombre: "Tender ropa de 18 mm", precio: 34000, cantidad: 1, imagen: "https://mayoristaprecioscuidados.com.ar/Admin/Imagenes/Items/395780.jpg" },
      { id: 3, nombre: "Vaso térmico Labu", precio: 1400, cantidad: 8, imagen: "https://mayoristaprecioscuidados.com.ar/Admin/Imagenes/Items/395780.jpg" },
      { id: 4, nombre: "Juego ollas y sartenes de acero inoxidable super resistentes", precio: 99800, cantidad: 1, imagen: "https://mayoristaprecioscuidados.com.ar/Admin/Imagenes/Items/395780.jpg" },
      { id: 5, nombre: "Tender ropa de 18 mm", precio: 34000, cantidad: 1, imagen: "https://mayoristaprecioscuidados.com.ar/Admin/Imagenes/Items/395780.jpg" },
      { id: 6, nombre: "Vaso térmico Labu", precio: 1400, cantidad: 8, imagen: "https://mayoristaprecioscuidados.com.ar/Admin/Imagenes/Items/395780.jpg" }
    ];

    function renderCarrito() {
      const cartItems = document.getElementById("cartItems");
      const cartTotal = document.getElementById("cartTotal");
      cartItems.innerHTML = "";
      let total = 0;

      carrito.forEach(producto => {
        let subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        let item = document.createElement("div");
        item.classList.add("cart-item");
        item.classList.add("shadow");

        item.innerHTML = `
          <div class="d-flex align-items-center">
            <img src="${producto.imagen}" class="product-img me-2">
            <span class="text-truncate product-name">${producto.nombre}</span>
          </div>
          <div class="d-flex align-items-center product-actions">
            <div class="input-group input-group-sm me-1">
              <button class="btn" onclick="cambiarCantidad(${producto.id}, -1)">-</button>
              <input type="text" class="form-control text-center cantidadProducto" value="${producto.cantidad}" readonly>
              <button class="btn" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
            </div>
            <span class="text-danger fw-bold me-2">Total: S/.${subtotal.toLocaleString()}</span>
            <button class="btn btn-remove ms-5" onclick="eliminarProducto(${producto.id})">✕</button>
          </div>
        `;
        cartItems.appendChild(item);
      });

      cartTotal.textContent = "S/." + total.toLocaleString();
    }

    function cambiarCantidad(id, delta) {
      let producto = carrito.find(p => p.id === id);
      if (!producto) return;
      producto.cantidad += delta;
      if (producto.cantidad < 1) producto.cantidad = 1;
      renderCarrito();
    }

    function eliminarProducto(id) {
      carrito = carrito.filter(p => p.id !== id);
      renderCarrito();
    }

    function vaciarCarrito() {
      carrito = [];
      renderCarrito();
    }

    function finalizarPedido() {
      window.location.href = "finalizarPedido.html";
    }

    // Render inicial
    renderCarrito();

/*Fin del carrito de compras */ 


/*Funcion boton flotante*/
const btnArriba = document.getElementById("btnArriba");
const btnCarrito = document.getElementById("btnCarrito");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    btnArriba.classList.add("show");
    btnCarrito.classList.add("show");
  } else {
    btnArriba.classList.remove("show");
    btnCarrito.classList.remove("show");
  }
});

btnArriba.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
/*Fin boton flotante*/



/*probando endpoints*/
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = 'http://localhost:8080/api'; // Ajusta si hace falta
  const menu = document.querySelector('.menuProductos');

  if (!menu) {
    console.warn('No se encontró el elemento .menuProductos en la página.');
    return;
  }

  async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText} => ${url}`);
    }
    return res.json();
  }

  async function loadMenu() {
    try {
      // 1) obtener categorías
      const categorias = await fetchJson(`${API_BASE}/categorias`);
      // 2) obtener subcategorías para todas las categorías en paralelo
      const subPromises = categorias.map(cat =>
        fetch(`${API_BASE}/categorias/${cat.id}/subcategorias`)
          .then(r => r.ok ? r.json() : [])
          .catch(() => [])
      );
      const allSubcats = await Promise.all(subPromises);

      // 3) limpiar contenido estático
      menu.innerHTML = '';

      categorias.forEach((cat, idx) => {
        const subs = allSubcats[idx] || [];

        // li principal (dropend)
        const li = document.createElement('li');
        li.className = 'dropend';

        const aCat = document.createElement('a');
        aCat.className = 'dropdown-item dropdown-toggle py-2 categoria fw-bold';
        aCat.href = '#';
        const catId = `dropdownMenuCat${cat.id}`;
        aCat.id = catId;
        aCat.setAttribute('data-bs-toggle', 'dropdown');
        aCat.setAttribute('data-bs-auto-close', 'false');
        aCat.setAttribute('aria-expanded', 'false');
        aCat.textContent = cat.nombre;
        li.appendChild(aCat);

        // ul interno con subcategorías
        const ulSub = document.createElement('ul');
        ulSub.className = 'dropdown-menu';
        ulSub.setAttribute('aria-labelledby', catId);

        if (subs.length === 0) {
          const liSub = document.createElement('li');
          const aSub = document.createElement('a');
          aSub.className = 'dropdown-item subcategoria';
          aSub.href = `productos.html?categoriaId=${cat.id}`;
          aSub.textContent = 'Ver productos';
          liSub.appendChild(aSub);
          ulSub.appendChild(liSub);
        } else {
          subs.forEach((s, sIdx) => {
            const liSub = document.createElement('li');
            const aSub = document.createElement('a');
            aSub.className = 'dropdown-item subcategoria';
            aSub.href = `productostest.html?subcategoriaId=${s.id}`;
            aSub.textContent = s.nombre;
            liSub.appendChild(aSub);
            ulSub.appendChild(liSub);

            if (sIdx !== subs.length - 1) {
              const divider = document.createElement('li');
              divider.innerHTML = '<hr class="dropdown-divider">';
              ulSub.appendChild(divider);
            }
          });
        }

        li.appendChild(ulSub);
        menu.appendChild(li);

        if (idx !== categorias.length - 1) {
          const catDivider = document.createElement('li');
          catDivider.innerHTML = '<hr class="dropdown-divider">';
          menu.appendChild(catDivider);
        }
      });

      // Después de crear el menú, configuramos su funcionalidad
      funcionalidadSubmenu();

    } catch (err) {
      console.error('Error cargando menú de categorías:', err);
    }
  }

  function funcionalidadSubmenu(){
    document.querySelectorAll('.dropdown-menu [data-bs-toggle="dropdown"]').forEach(function(element) {
    element.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
  }

  // Carga el menú inicialmente
  loadMenu();
});


//cargando productos desde la base de datos
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080/api";
  const container = document.querySelector("#seccion-productos .row");

  if (!container) {
    console.error("No se encontró el contenedor de productos.");
    return;
  }

  // Obtener subcategoriaId desde la URL
  const params = new URLSearchParams(window.location.search);
  const subcategoriaId = params.get("subcategoriaId");

  if (!subcategoriaId) {
    container.innerHTML = "<p class='text-center text-danger'>No se especificó ninguna subcategoría.</p>";
    return;
  }

  // Función auxiliar para armar URL de imágenes
  function getImageUrl(productId) {
    return `http://localhost:8080/images/productos/${productId}.jpg`;
  }

  // Traer productos por subcategoría
  async function fetchProductos() {
    try {
      const res = await fetch(`${API_BASE}/productos/subcategoria/${subcategoriaId}`);
      if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
      const productos = await res.json();
      renderProductos(productos);
    } catch (err) {
      console.error("Error cargando productos:", err);
      container.innerHTML = "<p class='text-center text-danger'>Error cargando productos.</p>";
    }
  }

  // Renderizar tarjetas de productos
  function renderProductos(productos) {
    container.innerHTML = ""; // limpiar contenido previo

    if (productos.length === 0) {
      container.innerHTML = "<p class='text-center'>No hay productos disponibles en esta subcategoría.</p>";
      return;
    }

    productos.forEach((p) => {
      const col = document.createElement("div");
      col.className = "col-12 col-md-6 col-lg-3";

      col.innerHTML = `
        <div class="product-card">
          <a href="producto-info.html?id=${p.id}">
            <img src="${getImageUrl(p.id)}" alt="${p.nombre}"
              onerror="this.onerror=null; this.src='http://localhost:8080/images/default.jpg';">
          </a>
          <h6 class="mt-2 fw-bold text-danger fs-5">${p.cod}</h6>
          <p class="fs-5">${p.nombre}</p>
          <div class="product-price">S/.${parseFloat(p.precio).toFixed(2)}</div>
          <div class="qty-controls">
            <button class="btn btn-outline-danger btn-sm backgroundHover-rojo" onclick="updateQty(this, -1)">-</button>
            <input type="number" class="form-control mx-1" value="1" min="1">
            <button class="btn btn-outline-danger btn-sm backgroundHover-rojo" onclick="updateQty(this, 1)">+</button>
          </div>
          <button class="btn btn-outline-danger w-100 backgroundHover-rojo">Agregar al Carrito</button>
        </div>
      `;

      container.appendChild(col);
    });
  }


  // Cargar productos
  fetchProductos();
});
