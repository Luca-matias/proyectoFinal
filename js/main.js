let productos = [];


const listaProductos = document.getElementById("listaProductos");
const carritoHTML = document.getElementById("carrito");
const mensaje = document.getElementById("mensaje");
const totalHTML = document.getElementById("total");


let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//cargar productos desde json
fetch("./js/productos.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarProductos();
  });


// Mostrar productos que estan disponibles
function mostrarProductos() {
  listaProductos.innerHTML = "";

  productos.forEach(prod => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${prod.nombre}</strong> - $${prod.precio}
      <button onclick="agregarAlCarrito(${prod.id})">Agregar</button>
    `;
    listaProductos.appendChild(li);
  });
}



// Evento comprar
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);

  localStorage.setItem("carrito", JSON.stringify(carrito));
  mensaje.textContent = `Agregaste ${producto.nombre}`;
  mensaje.style.color = "green";

  mostrarCarrito();
}

function mostrarCarrito() {
  carritoHTML.innerHTML = "";
  let total = 0;

  carrito.forEach(prod => {
    total += prod.precio;
    const li = document.createElement("li");
    li.textContent = `${prod.nombre} - $${prod.precio}`;
    carritoHTML.appendChild(li);
  });

  totalHTML.textContent = `Total: $${total}`;
}
