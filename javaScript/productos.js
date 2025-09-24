//cargando nombre de la subcategoria seleccionada y de su categoria padre
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080/api";
  const params = new URLSearchParams(window.location.search);
  const subcategoriaId = params.get("subcategoriaId");

  const titulo = document.getElementById("tituloCategoria");

  if (!subcategoriaId || !titulo) return;

  async function loadTitulo() {
    try {
      const res = await fetch(`${API_BASE}/subcategorias/${subcategoriaId}`);
      if (!res.ok) throw new Error("Error obteniendo subcategoría");
      const sub = await res.json();

      // Construir título dinámico
      titulo.innerHTML = `
        <span class="fw-bold">${sub.nombreCategoriaPadre.toUpperCase()} //</span> ${sub.nombre.toUpperCase()}
      `;
    } catch (err) {
      console.error(err);
      titulo.textContent = "Categoría desconocida";
    }
  }

  loadTitulo();
});



//cargando productos desde la base de datos
document.addEventListener("DOMContentLoaded", () => {
  const API_BASE = "http://localhost:8080/api";
  const container = document.querySelector("#seccion-productos .row");

  if (!container) {
    console.error("No se encontró el contenedor de productos.");
    return;
  }

  // Obtener id de la subcategoria desde la URL
  const params = new URLSearchParams(window.location.search);
  const subcategoriaId = params.get("subcategoriaId");

  if (!subcategoriaId) {
    container.innerHTML = "<p class='text-center text-danger'>No se especificó ninguna subcategoría.</p>";
    return;
  }

  // Función para obtener el url de la imagen de un producto
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
    container.innerHTML = "";

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