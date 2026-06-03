// LÓGICA DE LA PÁGINA PRINCIPAL (FEED)

// FILTROS ACTIVOS
let sedeActiva = 'todas';
let categoriaActiva = 'todo';
let textoBusqueda = '';

// REFERENCIAS A LOS ELEMENTOS DEL HTML
const listaProductos = document.getElementById('lista-productos');
const contadorProductos = document.getElementById('contador-productos');
const buscador = document.getElementById('buscador');
const botonesSede = document.querySelectorAll('.filtro-sede button');
const botonesCategoria = document.querySelectorAll('.filtros-categoria button');

// MOSTRAR LOS PRODUCTOS AL ABRIR LA PÁGINA
mostrarProductos();

// FUNCIÓN PRINCIPAL: APLICAR FILTROS Y DIBUJAR LOS PRODUCTOS
function mostrarProductos() {
  // Unir los productos de ejemplo con los publicados por el usuario
  let lista = productos.concat(obtenerProductosPropios());

  // FILTRAR POR SEDE
  if (sedeActiva !== 'todas') {
    lista = lista.filter(function(p) {
      return p.sede === sedeActiva;
    });
  }

  // FILTRAR POR CATEGORÍA O TIPO
  if (categoriaActiva !== 'todo') {
    if (categoriaActiva === 'venta' || categoriaActiva === 'alquiler' || categoriaActiva === 'busco') {
      lista = lista.filter(function(p) {
        return p.tipo === categoriaActiva;
      });
    } else {
      lista = lista.filter(function(p) {
        return p.categoria === categoriaActiva;
      });
    }
  }

  // FILTRAR POR TEXTO DEL BUSCADOR
  if (textoBusqueda !== '') {
    const texto = textoBusqueda.toLowerCase();
    lista = lista.filter(function(p) {
      return p.titulo.toLowerCase().includes(texto) ||
             p.descripcion.toLowerCase().includes(texto);
    });
  }

  // ACTUALIZAR EL CONTADOR
  contadorProductos.textContent = lista.length + ' productos disponibles';

  // SI NO HAY RESULTADOS, MOSTRAR MENSAJE VACÍO
  if (lista.length === 0) {
    listaProductos.innerHTML = '<div class="mensaje-vacio">No hay productos que coincidan con tu búsqueda.</div>';
    return;
  }

  // GENERAR LAS TARJETAS DE PRODUCTOS
  let html = '';
  lista.forEach(function(p) {
    html += generarTarjeta(p);
  });
  listaProductos.innerHTML = html;
}

// La función generarTarjeta() está en comun.js para reutilizarla en otras páginas

// EVENTOS DE LOS BOTONES DE SEDE
botonesSede.forEach(function(boton) {
  boton.addEventListener('click', function() {
    // Quitar la clase activa de todos los botones
    botonesSede.forEach(function(b) {
      b.classList.remove('activo');
    });
    // Activar el botón presionado
    boton.classList.add('activo');
    sedeActiva = boton.getAttribute('data-sede');
    mostrarProductos();
  });
});

// EVENTOS DE LOS BOTONES DE CATEGORÍA
botonesCategoria.forEach(function(boton) {
  boton.addEventListener('click', function() {
    botonesCategoria.forEach(function(b) {
      b.classList.remove('activo');
    });
    boton.classList.add('activo');
    categoriaActiva = boton.getAttribute('data-categoria');
    mostrarProductos();
  });
});

// EVENTO DEL BUSCADOR
buscador.addEventListener('input', function() {
  textoBusqueda = buscador.value;
  mostrarProductos();
});
