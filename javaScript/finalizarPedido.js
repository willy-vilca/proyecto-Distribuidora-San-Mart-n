/*funcionalidades de la lista de productos del pedido*/

// Función para obtener el url de la imagen de un producto
  function getImageUrl(productId) {
    return `http://localhost:8080/images/productos/${productId}.jpg`;
  }

// Funciones para manejar datos en el localStorage
function getProductosPedido() {
  return JSON.parse(localStorage.getItem("carrito")) || [];
}

function saveProductosPedido(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Array de productos del pedido
    let pedido = getProductosPedido();

    function renderProductosPedido() {
      const pedidoItems = document.getElementById("pedidoItems");
      const pedidoTotal = document.getElementById("TotalPedido");
      const descuentoPedido = document.getElementById("descuentoPedido");
      const totalPedidoNeto = document.getElementById("TotalPedidoNeto"); 

      let pedido = getProductosPedido();

      pedidoItems.innerHTML = "";
      let TotalPedido = 0;
      let descuento = 0; //se aplicará lógica de negocio para el descuento posteriormente
      let totalNeto = 0;

      pedido.forEach(producto => {
        let subtotalPedido = producto.precio * producto.cantidad;
        TotalPedido += subtotalPedido;

        let itemPedido = document.createElement("div");
        itemPedido.classList.add("cart-item");
        itemPedido.classList.add("pedido");
        itemPedido.classList.add("shadow-sm");

        itemPedido.innerHTML = `
            <div class="d-flex align-items-center">
                <img src="${getImageUrl(producto.id)}" alt="${producto.nombre}" class="product-img-pedidoFinal me-2 ms-3" 
                onerror="this.onerror=null; this.src='http://localhost:8080/images/default.jpg';">
                <span class="text-truncate product-name ms-4">${producto.nombre}</span>
            </div>
            <div class="d-flex align-items-center product-actions me-4">
                <div class="input-group input-group-sm me-1">
                    <button class="btn" onclick="cambiarCantidadPedido(${producto.id}, -1)">-</button>
                    <input type="text" class="form-control text-center cantidadProducto" value="${producto.cantidad}" readonly>
                    <button class="btn" onclick="cambiarCantidadPedido(${producto.id}, 1)">+</button>
                </div>
                <span class="text-danger fw-bold me-4">Total: S/.${subtotalPedido.toLocaleString()}</span>
                <button class="btn btn-remove ms-5" onclick="eliminarProductoPedido(${producto.id})">✕</button>
            </div>
        `;
        pedidoItems.appendChild(itemPedido);
      });
      totalNeto = TotalPedido-descuento;

      pedidoTotal.textContent = "S/." + TotalPedido.toLocaleString();
      descuentoPedido.textContent = "S/." + descuento.toLocaleString();
      totalPedidoNeto.textContent = "S/." + totalNeto.toLocaleString();
    }

    function cambiarCantidadPedido(id, delta) {
      let pedido = getProductosPedido();
      let productoPedido = pedido.find(p => p.id === id);
      if (!productoPedido) return;
      productoPedido.cantidad += delta;
      if (productoPedido.cantidad < 1) productoPedido.cantidad = 1;
      saveProductosPedido(pedido);
      renderProductosPedido();
    }

    function eliminarProductoPedido(id) {
      let pedido = getProductosPedido().filter(p => p.id !== id);
      saveProductosPedido(pedido);
      renderProductosPedido();
    }
    // Render inicial
    renderProductosPedido();

/*Fin de la lista de productos */ 