
//Funcion para agregar o disminuir la cantidad de productos en las tarjetas
function updateQty(btn, change) {
      const input = btn.parentNode.querySelector("input");
      let value = parseInt(input.value) || 1;
      value += change;
      if (value < 1) value = 1;
      input.value = value;
}

//funcion para el menú desplegable de productos
document.querySelectorAll('.dropdown-menu [data-bs-toggle="dropdown"]').forEach(function(element) {
    element.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });

  

/*funcionalidades del carrito de compras*/

// Función para obtener el url de la imagen de un producto
  function getImageUrl(productId) {
    return `http://localhost:8080/images/productos/${productId}.jpg`;
  }

// Funciones para manejar localStorage
function getCarrito() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function saveCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Renderizar carrito
function renderCarrito() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  let carrito = getCarrito();

  cartItems.innerHTML = "";
  let total = 0;

  carrito.forEach(producto => {
    let subtotal = producto.precio * producto.cantidad;
    total += subtotal;

    let item = document.createElement("div");
    item.classList.add("cart-item", "shadow");

    item.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${getImageUrl(producto.id)}" alt="${producto.nombre}" class="product-img me-2" 
        onerror="this.onerror=null; this.src='http://localhost:8080/images/default.jpg';">
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
  let carrito = getCarrito();
  let producto = carrito.find(p => p.id === id);
  if (!producto) return;

  producto.cantidad += delta;
  if (producto.cantidad < 1) producto.cantidad = 1;

  saveCarrito(carrito);
  renderCarrito();
}


function eliminarProducto(id) {
  let carrito = getCarrito().filter(p => p.id !== id);
  saveCarrito(carrito);
  renderCarrito();
}


function vaciarCarrito() {
  saveCarrito([]);
  renderCarrito();
}


function finalizarPedido() {
  window.location.href = "finalizarPedido.html";
}


document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();
});

//cargar productos al presionar el botón del carrito
const botonesCarrito = document.querySelectorAll('[data-bs-target="#cartModal"]');
Array.from(botonesCarrito).forEach(function(boton) {
  boton.addEventListener('click', function() {
      renderCarrito();
  });
});

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