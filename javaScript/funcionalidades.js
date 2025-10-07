document.addEventListener("DOMContentLoaded", () => {
  const userSection = document.getElementById("seccionUsuario");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const primerNombre = usuario.nombre.trim().split(" ")[0];

  if (usuario) { //se verifica si el usuario ha iniciado sesión o no
    userSection.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-outline-danger py-3 px-xxl-5 dropdown-toggle backgroundHover-rojo d-flex align-items-center justify-content-center" 
                type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false" style="width:100%;">
          <i class="bi bi-person-circle me-2"></i> ${primerNombre}
        </button>
        <ul class="dropdown-menu text-center" aria-labelledby="userMenu">
          <li><a class="dropdown-item" href="misPedidos.html">Mis pedidos</a></li>
          <li><a class="dropdown-item text-danger" href="#" id="cerrarSesion">Cerrar sesión</a></li>
        </ul>
      </div>
    `;

    document.getElementById("cerrarSesion").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("usuario");
      localStorage.removeItem("carrito");
      window.location.href = "index.html";
    });
  }
});




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
  function getImageUrl(producto) {
    return `http://localhost:8080/images/productos/${producto}.jpg`;
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
        <img src="${getImageUrl(producto.nombre)}" alt="${producto.nombre}" class="product-img me-2" 
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
  const usuarioExiste = JSON.parse(localStorage.getItem("usuario"));
  //se verifica si el usuario inicio sesion o no
  if(usuarioExiste){
    window.location.href = "finalizarPedido.html";
  }else{
    mostrarModal('¡Registrate para continuar!','Debe iniciar sesion para poder realizar un pedido, utilice el botón Ingresar.');
  }
  
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


//funcionalidad del boton de busqueda
const botonBusqueda = document.getElementById('botonBusqueda');
const textoBuscado = document.getElementById('textoBuscado');
botonBusqueda.addEventListener("click", function() {
  window.location.href = `productos-search.html?busqueda=${textoBuscado.value}`;
})

//funcionalidad de la ventana emergente de mensajes
function mostrarModal(titulo, mensaje, paginaSiguiente = 'javascript:void(0)', idFocus = '') {
  const modal = document.getElementById("modalMensaje");
  const tituloModal = document.getElementById("modal-titulo");
  const mensajeModal = document.getElementById("modal-info");
  const closeBtn = modal.querySelector(".modal-close");

  tituloModal.textContent = titulo;
  mensajeModal.innerHTML = mensaje;

  modal.style.display = "flex";

  closeBtn.onclick = () => {
    modal.style.display = "none";
    window.location.href = paginaSiguiente;
    document.getElementById(idFocus).focus();
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      window.location.href = paginaSiguiente;
      document.getElementById(idFocus).focus();    
    }
  };
}


//notificaciones
function mostrarNotificacion(mensaje) {
  const notificaciones = document.getElementById("notificaciones");

  const notif = document.createElement("div");
  notif.classList.add("notificacion");
  notif.innerHTML = mensaje;

  notificaciones.appendChild(notif);

  setTimeout(() => {
    notif.classList.add("mostrar");
  }, 100);

  setTimeout(() => {
    notif.classList.remove("mostrar");
    setTimeout(() => {
      notif.remove();
    }, 500);
  }, 3000);
}


function notificacionCarrito(){
  mostrarNotificacion(`<i class='bi bi-check-circle'></i> Producto agregado al carrito`)
}