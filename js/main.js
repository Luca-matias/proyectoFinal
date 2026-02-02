document.addEventListener("DOMContentLoaded", () => {

  let productos = [];

  const listaProductos = document.getElementById("listaProductos");
  const carritoHTML = document.getElementById("carrito");
  const mensaje = document.getElementById("mensaje");
  const totalHTML = document.getElementById("total");
  const btnFinalizar = document.getElementById("finalizarCompra");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Cargar productos con JSON
  fetch("./data/productos.json")
    .then(res => res.json())
    .then(data => {
      productos = data;
      mostrarProductos();
    });

  // Mostrar productos como cards con imagen
  function mostrarProductos() {
    listaProductos.innerHTML = "";

    productos.forEach(prod => {
      const div = document.createElement("div");
      div.classList.add("producto");

      div.innerHTML = `
        <img src="${prod.imagen}" alt="${prod.nombre}">
        <h3>${prod.nombre}</h3>
        <p class="precio">$${prod.precio}</p>
        <button onclick="agregarAlCarrito(${prod.id})">Agregar</button>
      `;

      listaProductos.appendChild(div);
    });
  }

  // Agregar producto al carrito con cantidad
  window.agregarAlCarrito = function(id) {
    const producto = productos.find(p => p.id === id);

    const productoEnCarrito = carrito.find(p => p.id === id);

    if (productoEnCarrito) {
      productoEnCarrito.cantidad++;
    } else {
      carrito.push({
        ...producto,
        cantidad: 1
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    Swal.fire({
      icon: "success",
      title: "Producto agregado",
      text: producto.nombre,
      timer: 1200,
      showConfirmButton: false
    });

    mostrarCarrito();
  };

  // Mostrar carrito con cantidades y subtotales
  function mostrarCarrito() {
    carritoHTML.innerHTML = "";
    let total = 0;

    carrito.forEach((prod, index) => {
      const subtotal = prod.precio * prod.cantidad;
      total += subtotal;

      const li = document.createElement("li");
      li.innerHTML = `
        ${prod.nombre} x${prod.cantidad} - $${subtotal}
        <button onclick="eliminarDelCarrito(${index})">❌</button>
      `;
      carritoHTML.appendChild(li);
    });

    totalHTML.textContent = `Total: $${total}`;
  }

  // Eliminar producto completo del carrito
  window.eliminarDelCarrito = function(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  };

  // Finalizar compra
  btnFinalizar.addEventListener("click", () => {
    if (carrito.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Carrito vacío",
        text: "Agregá productos antes de finalizar la compra"
      });
      return;
    }

    Swal.fire({
      title: "¿Confirmar compra?",
      text: "¿Deseás finalizar la compra?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, comprar",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.isConfirmed) {
        carrito = [];
        localStorage.removeItem("carrito");
        mostrarCarrito();

        Swal.fire(
          "Compra realizada",
          "Gracias por tu compra!",
          "success"
        );
      }
    });
  });

  mostrarCarrito();
});
