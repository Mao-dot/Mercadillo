// LÓGICA DE LA PÁGINA DE PUBLICAR PRODUCTO

// VERIFICAR QUE EL USUARIO TENGA SESIÓN
const usuarioActual = obtenerUsuario();
if (!usuarioActual) {
  alert('Debes iniciar sesión para publicar un producto.');
  window.location.href = 'login.html';
}

// REFERENCIAS A LOS ELEMENTOS
const formulario = document.getElementById('formulario-publicar');
const campoCondicion = document.getElementById('campo-condicion');
const labelPrecio = document.getElementById('label-precio');
const opcionesTipo = document.querySelectorAll('input[name="tipo"]');

// CAMBIAR LOS CAMPOS SEGÚN EL TIPO DE PUBLICACIÓN
opcionesTipo.forEach(function(radio) {
  radio.addEventListener('change', function() {
    if (radio.value === 'venta') {
      campoCondicion.style.display = 'block';
      labelPrecio.textContent = 'Precio (S/):';
    } else if (radio.value === 'alquiler') {
      campoCondicion.style.display = 'none';
      labelPrecio.textContent = 'Precio por día (S/):';
    } else {
      // Tipo "busco"
      campoCondicion.style.display = 'none';
      labelPrecio.textContent = 'Precio máximo a pagar (S/):';
    }
  });
});

// MANEJAR EL ENVÍO DEL FORMULARIO
formulario.addEventListener('submit', function(evento) {
  evento.preventDefault();

  // OBTENER LOS VALORES INGRESADOS
  const tipo = document.querySelector('input[name="tipo"]:checked').value;
  const titulo = document.getElementById('titulo').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const categoria = document.getElementById('categoria').value;
  const precio = document.getElementById('precio').value;
  const sede = document.querySelector('input[name="sede"]:checked').value;
  const condicion = document.getElementById('condicion').value;

  // VALIDAR EL TÍTULO
  if (titulo === '') {
    alert('Por favor, ingresa un título para el producto.');
    return;
  }
  if (titulo.length < 5) {
    alert('El título debe tener al menos 5 caracteres.');
    return;
  }

  // VALIDAR LA DESCRIPCIÓN
  if (descripcion === '') {
    alert('Por favor, ingresa una descripción.');
    return;
  }

  // VALIDAR EL PRECIO
  if (precio === '' || parseInt(precio) <= 0) {
    alert('Por favor, ingresa un precio válido.');
    return;
  }

  // CREAR EL NUEVO PRODUCTO
  const nuevoProducto = {
    id: 'p' + Date.now(),
    tipo: tipo,
    categoria: categoria,
    titulo: titulo,
    descripcion: descripcion,
    sede: sede,
    vendedor: usuarioActual.id
  };

  // AGREGAR EL PRECIO SEGÚN EL TIPO
  if (tipo === 'busco') {
    nuevoProducto.precioMax = parseInt(precio);
  } else {
    nuevoProducto.precio = parseInt(precio);
  }

  // AGREGAR LA CONDICIÓN SOLO SI ES VENTA
  if (tipo === 'venta') {
    nuevoProducto.condicion = condicion;
  }

  // GUARDAR EL PRODUCTO EN EL LOCALSTORAGE
  guardarProductoPropio(nuevoProducto);

  // CONFIRMAR Y REDIRIGIR AL PERFIL
  alert('¡Producto publicado correctamente!');
  window.location.href = 'perfil.html';
});
