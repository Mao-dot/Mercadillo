// LÓGICA DE LA PÁGINA DE DETALLE DEL PRODUCTO

// OBTENER EL ID DEL PRODUCTO DESDE LA URL
const parametros = new URLSearchParams(window.location.search);
const idProducto = parametros.get('id');

// BUSCAR EL PRODUCTO EN LOS DATOS
const producto = buscarProducto(idProducto);

// SI NO EXISTE, MOSTRAR MENSAJE Y DETENER
if (!producto) {
  document.getElementById('contenido-detalle').innerHTML =
    '<div class="mensaje-vacio">Producto no encontrado. <a href="index.html">Volver al inicio</a></div>';
} else {
  mostrarProducto();
}

// LLENAR LA PÁGINA CON LOS DATOS DEL PRODUCTO
function mostrarProducto() {
  // TÍTULO Y DESCRIPCIÓN
  document.getElementById('producto-titulo').textContent = producto.titulo;
  document.getElementById('producto-descripcion').textContent = producto.descripcion;

  // ETIQUETA DEL TIPO (VENTA / ALQUILER / BUSCO)
  const etiqueta = document.getElementById('producto-etiqueta');
  let nombreTipo = 'Venta';
  if (producto.tipo === 'alquiler') nombreTipo = 'Alquiler';
  if (producto.tipo === 'busco') nombreTipo = 'Busco';
  etiqueta.textContent = nombreTipo;
  etiqueta.className = 'etiqueta etiqueta-' + producto.tipo;

  // INDICADOR DE SEDE
  const sede = document.getElementById('producto-sede');
  const claseSede = producto.sede === 'la_molina' ? 'la-molina' : 'smp';
  sede.className = 'sede ' + claseSede;
  sede.innerHTML = '<span class="punto"></span>' + nombreSede(producto.sede);

  // PRECIO SEGÚN EL TIPO
  let textoPrecio;
  if (producto.tipo === 'busco') {
    textoPrecio = 'Hasta S/ ' + producto.precioMax;
  } else if (producto.tipo === 'alquiler') {
    textoPrecio = 'S/ ' + producto.precio + ' /día';
  } else {
    textoPrecio = 'S/ ' + producto.precio;
  }
  document.getElementById('producto-precio').textContent = textoPrecio;

  // CONDICIÓN (solo si el producto la tiene)
  const condicion = document.getElementById('producto-condicion');
  if (producto.condicion) {
    condicion.textContent = 'Condición: ' + producto.condicion;
  } else {
    condicion.style.display = 'none';
  }

  // INFORMACIÓN DEL VENDEDOR
  const vendedor = buscarUsuario(producto.vendedor);
  if (vendedor) {
    // Tomar las iniciales del nombre y apellido
    const partes = vendedor.nombre.split(' ');
    const iniciales = partes[0][0] + (partes[1] ? partes[1][0] : '');
    document.getElementById('vendedor-avatar').textContent = iniciales;
    document.getElementById('vendedor-nombre').textContent = vendedor.nombre;
    document.getElementById('vendedor-carrera').textContent = vendedor.carrera + ' · ' + nombreSede(vendedor.sede);
    document.getElementById('vendedor-rating').textContent = '★ ' + vendedor.rating;
  }

  // EVENTO DEL BOTÓN DE WHATSAPP
  document.getElementById('boton-whatsapp').addEventListener('click', contactarPorWhatsapp);
}

// ABRIR WHATSAPP CON UN MENSAJE LISTO
function contactarPorWhatsapp() {
  // PEDIR INICIAR SESIÓN SI NO HAY USUARIO
  const usuario = obtenerUsuario();
  if (!usuario) {
    alert('Debes iniciar sesión para contactar al vendedor.');
    window.location.href = 'login.html';
    return;
  }

  // ARMAR EL MENSAJE SEGÚN EL TIPO DE PRODUCTO
  const vendedor = buscarUsuario(producto.vendedor);
  const primerNombre = vendedor.nombre.split(' ')[0];
  let mensaje;

  if (producto.tipo === 'busco') {
    mensaje = 'Hola ' + primerNombre + ', vi tu publicación "' + producto.titulo +
              '" en Mercadillo Market y tengo lo que buscas.';
  } else {
    mensaje = 'Hola ' + primerNombre + ', vi tu publicación "' + producto.titulo +
              '" en Mercadillo Market. ¿Sigue disponible?';
  }

  // ABRIR WHATSAPP EN UNA NUEVA PESTAÑA
  const url = 'https://wa.me/51' + vendedor.telefono + '?text=' + encodeURIComponent(mensaje);
  window.open(url, '_blank');
}
