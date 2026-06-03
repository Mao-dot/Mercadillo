// FUNCIONES COMUNES A TODAS LAS PÁGINAS

// MODAL DE BIENVENIDA
let slideActual = 1;

const modal = document.getElementById('modal-bienvenida');
const botonAtras = document.getElementById('boton-atras');
const botonSiguiente = document.getElementById('boton-siguiente');

// Mostrar el modal solo si es la primera vez
if (modal) {
  const yaVisto = localStorage.getItem('bienvenida-vista');

  if (yaVisto === 'si') {
    modal.classList.add('oculto');
  } else {
    botonAtras.addEventListener('click', irAtras);
    botonSiguiente.addEventListener('click', irSiguiente);
  }
}

// CAMBIAR AL SIGUIENTE SLIDE
function irSiguiente() {
  if (slideActual < 3) {
    cambiarSlide(slideActual + 1);
  } else {
    // En el último slide, cerrar el modal
    localStorage.setItem('bienvenida-vista', 'si');
    modal.classList.add('oculto');
  }
}

// CAMBIAR AL SLIDE ANTERIOR
function irAtras() {
  if (slideActual > 1) {
    cambiarSlide(slideActual - 1);
  }
}

// MOSTRAR EL SLIDE INDICADO
function cambiarSlide(nuevo) {
  // Ocultar el slide y el indicador actual
  document.getElementById('slide-' + slideActual).style.display = 'none';
  document.getElementById('ind-' + slideActual).classList.remove('activo');

  // Mostrar el nuevo slide y su indicador
  slideActual = nuevo;
  document.getElementById('slide-' + slideActual).style.display = 'block';
  document.getElementById('ind-' + slideActual).classList.add('activo');

  // Activar o desactivar el botón de atrás
  botonAtras.disabled = (slideActual === 1);

  // Cambiar el texto del botón siguiente en el último slide
  if (slideActual === 3) {
    botonSiguiente.textContent = 'Comenzar';
  } else {
    botonSiguiente.textContent = 'Siguiente →';
  }
}

// OBTENER EL USUARIO QUE INICIÓ SESIÓN
function obtenerUsuario() {
  const datos = localStorage.getItem('usuario');
  if (datos) {
    return JSON.parse(datos);
  }
  return null;
}

// GUARDAR EL USUARIO QUE INICIA SESIÓN
function guardarUsuario(usuario) {
  localStorage.setItem('usuario', JSON.stringify(usuario));
}

// CERRAR SESIÓN
function cerrarSesion() {
  if (confirm('¿Quieres cerrar sesión?')) {
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
  }
}

// OBTENER LOS PRODUCTOS PUBLICADOS POR EL USUARIO
function obtenerProductosPropios() {
  const datos = localStorage.getItem('productos-propios');
  if (datos) {
    return JSON.parse(datos);
  }
  return [];
}

// GUARDAR UN NUEVO PRODUCTO PUBLICADO
function guardarProductoPropio(producto) {
  const propios = obtenerProductosPropios();
  propios.push(producto);
  localStorage.setItem('productos-propios', JSON.stringify(propios));
}

// GENERAR EL HTML DE UNA TARJETA DE PRODUCTO (USADA EN VARIAS PÁGINAS)
function generarTarjeta(p) {
  // Calcular el texto del precio según el tipo
  let precio;
  if (p.tipo === 'busco') {
    precio = 'Hasta S/ ' + p.precioMax;
  } else if (p.tipo === 'alquiler') {
    precio = 'S/ ' + p.precio + ' /día';
  } else {
    precio = 'S/ ' + p.precio;
  }

  // Nombre del tipo para mostrar en la etiqueta
  let nombreTipo = 'Venta';
  if (p.tipo === 'alquiler') nombreTipo = 'Alquiler';
  if (p.tipo === 'busco') nombreTipo = 'Busco';

  // Clase CSS para la sede
  const claseSede = p.sede === 'la_molina' ? 'la-molina' : 'smp';

  return `
    <a href="detalle.html?id=${p.id}" class="producto">
      <div class="producto-imagen">
        <img src="images/producto.svg" alt="${p.titulo}">
      </div>
      <div class="producto-info">
        <div class="producto-cabecera">
          <span class="etiqueta etiqueta-${p.tipo}">${nombreTipo}</span>
          <span class="sede ${claseSede}"><span class="punto"></span>${nombreSede(p.sede)}</span>
        </div>
        <div class="producto-titulo">${p.titulo}</div>
        <div class="producto-precio">${precio}</div>
      </div>
    </a>
  `;
}

// CAMBIAR EL BOTÓN DE SESIÓN SEGÚN EL ESTADO
const botonSesion = document.getElementById('boton-sesion');

if (botonSesion) {
  const usuario = obtenerUsuario();

  if (usuario) {
    // Si hay sesión, mostrar nombre y permitir cerrar sesión
    botonSesion.textContent = 'Hola, ' + usuario.nombre.split(' ')[0];
    botonSesion.href = '#';
    botonSesion.addEventListener('click', function(e) {
      e.preventDefault();
      cerrarSesion();
    });
  }
}
