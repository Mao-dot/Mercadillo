// LÓGICA DEL CHATBOT

// REFERENCIAS A LOS ELEMENTOS DEL HTML
const inputMensaje = document.getElementById('input-mensaje');
const botonEnviar = document.getElementById('boton-enviar');
const cuerpoChat = document.getElementById('cuerpo-chat');

// HABILITAR EL BOTÓN CUANDO HAY TEXTO
inputMensaje.addEventListener('input', function() {
  if (inputMensaje.value.trim() === '') {
    botonEnviar.disabled = true;
  } else {
    botonEnviar.disabled = false;
  }
});

// ENVIAR AL PRESIONAR ENTER
inputMensaje.addEventListener('keydown', function(evento) {
  if (evento.key === 'Enter' && inputMensaje.value.trim() !== '') {
    enviarMensaje();
  }
});

// ENVIAR AL HACER CLIC EN EL BOTÓN
botonEnviar.addEventListener('click', enviarMensaje);

// ENVIAR EL MENSAJE DEL USUARIO Y PEDIR LA RESPUESTA DEL BOT
function enviarMensaje() {
  const texto = inputMensaje.value.trim();
  if (texto === '') return;

  // Mostrar el mensaje del usuario
  agregarMensaje('usuario', texto);
  inputMensaje.value = '';
  botonEnviar.disabled = true;

  // Esperar medio segundo para simular que el bot está pensando
  setTimeout(function() {
    procesarRespuesta(texto);
  }, 500);
}

// AGREGAR UNA BURBUJA AL CHAT (USUARIO O BOT)
function agregarMensaje(tipo, contenido) {
  const div = document.createElement('div');
  div.className = 'mensaje ' + tipo;
  div.innerHTML = contenido;
  cuerpoChat.appendChild(div);
  // Hacer scroll al final
  cuerpoChat.scrollTop = cuerpoChat.scrollHeight;
}

// ANALIZAR EL MENSAJE Y DECIDIR LA RESPUESTA
function procesarRespuesta(texto) {
  const mensaje = texto.toLowerCase();

  // COMANDO /LISTAR
  if (mensaje === '/listar') {
    listarProductos();
    return;
  }

  // BUSCAR PRODUCTOS QUE COINCIDAN POR TÍTULO O CATEGORÍA
  const todos = productos.concat(obtenerProductosPropios());
  const coincidencias = todos.filter(function(p) {
    return p.titulo.toLowerCase().includes(mensaje) ||
           p.categoria.toLowerCase().includes(mensaje);
  });

  if (coincidencias.length > 0) {
    mostrarCoincidencias(coincidencias);
    return;
  }

  // FILTRAR POR SEDE
  if (mensaje.includes('molina')) {
    filtrarPorSede('la_molina');
    return;
  }
  if (mensaje.includes('smp')) {
    filtrarPorSede('smp');
    return;
  }

  // RESPUESTA POR PALABRAS CLAVE
  agregarMensaje('bot', generarRespuestaSimulada(mensaje));
}

// LISTAR TODOS LOS PRODUCTOS
function listarProductos() {
  const todos = productos.concat(obtenerProductosPropios());
  let respuesta = '<strong>Productos disponibles:</strong>';

  todos.forEach(function(p) {
    respuesta += '<br><br>';
    respuesta += '<img src="images/producto.svg" alt="img">';
    respuesta += '<strong>' + p.titulo + '</strong> - ' + textoPrecio(p);
  });

  respuesta += '<br><br><em>Escribe el nombre de un producto para ver más detalles.</em>';
  agregarMensaje('bot', respuesta);
}

// MOSTRAR LOS PRODUCTOS QUE COINCIDEN CON LA BÚSQUEDA
function mostrarCoincidencias(lista) {
  // Si solo hay uno, mostrar el detalle completo
  if (lista.length === 1) {
    mostrarDetalleProducto(lista[0]);
    return;
  }

  // Si hay varios, mostrar la lista corta
  let respuesta = '<strong>Encontré ' + lista.length + ' productos:</strong>';
  lista.forEach(function(p) {
    respuesta += '<br><br>';
    respuesta += '<strong>' + p.titulo + '</strong> - ' + textoPrecio(p);
  });
  respuesta += '<br><br><em>Escríbeme el nombre completo para ver más detalles.</em>';
  agregarMensaje('bot', respuesta);
}

// MOSTRAR LOS DATOS COMPLETOS DE UN PRODUCTO
function mostrarDetalleProducto(p) {
  let respuesta = '<img src="images/producto.svg" alt="img"><br>';
  respuesta += '<strong>' + p.titulo + '</strong><br>';
  respuesta += '<strong>Tipo:</strong> ' + p.tipo + '<br>';
  respuesta += '<strong>Categoría:</strong> ' + p.categoria + '<br>';
  respuesta += '<strong>Precio:</strong> ' + textoPrecio(p) + '<br>';
  respuesta += '<strong>Sede:</strong> ' + nombreSede(p.sede) + '<br>';
  respuesta += '<strong>Descripción:</strong> ' + p.descripcion + '<br><br>';
  respuesta += '<a href="detalle.html?id=' + p.id + '">Ver página completa →</a>';
  agregarMensaje('bot', respuesta);
}

// MOSTRAR LOS PRODUCTOS DE UNA SEDE
function filtrarPorSede(sede) {
  const todos = productos.concat(obtenerProductosPropios());
  const filtrados = todos.filter(function(p) {
    return p.sede === sede;
  });

  let respuesta = '<strong>Productos en ' + nombreSede(sede) + ':</strong>';
  filtrados.forEach(function(p) {
    respuesta += '<br><br>';
    respuesta += '<strong>' + p.titulo + '</strong> - ' + textoPrecio(p);
  });
  agregarMensaje('bot', respuesta);
}

// FORMATEAR EL PRECIO DE UN PRODUCTO
function textoPrecio(p) {
  if (p.tipo === 'busco') return 'Hasta S/ ' + p.precioMax;
  if (p.tipo === 'alquiler') return 'S/ ' + p.precio + ' /día';
  return 'S/ ' + p.precio;
}

// RESPUESTAS AUTOMÁTICAS POR PALABRAS CLAVE
function generarRespuestaSimulada(mensaje) {
  if (mensaje.includes('hola') || mensaje.includes('buenas') || mensaje.includes('buenos')) {
    return '¡Hola! Estoy aquí para ayudarte. Escribe <strong>/listar</strong> para ver todos los productos.';
  }
  if (mensaje.includes('precio') || mensaje.includes('costo') || mensaje.includes('cuanto')) {
    return 'Dime el nombre del producto que te interesa y te diré su precio.';
  }
  if (mensaje.includes('gracias')) {
    return '¡Con gusto! Si necesitas algo más, aquí estaré.';
  }
  if (mensaje.includes('chau') || mensaje.includes('adios') || mensaje.includes('bye')) {
    return '¡Hasta luego! Gracias por usar Mercadillo Market.';
  }
  if (mensaje.includes('publicar') || mensaje.includes('vender') || mensaje.includes('subir')) {
    return 'Para publicar un producto ve a la sección <a href="publicar.html">Publicar</a> del menú.';
  }
  if (mensaje.includes('venta')) {
    const lista = productos.filter(function(p) { return p.tipo === 'venta'; });
    let r = 'Tengo <strong>' + lista.length + ' productos en venta</strong>:';
    lista.forEach(function(p) {
      r += '<br><br><strong>' + p.titulo + '</strong> - S/ ' + p.precio;
    });
    return r;
  }
  if (mensaje.includes('alquiler') || mensaje.includes('alquilar')) {
    const lista = productos.filter(function(p) { return p.tipo === 'alquiler'; });
    let r = 'Tengo <strong>' + lista.length + ' productos en alquiler</strong>:';
    lista.forEach(function(p) {
      r += '<br><br><strong>' + p.titulo + '</strong> - S/ ' + p.precio + ' /día';
    });
    return r;
  }
  if (mensaje.includes('busco')) {
    const lista = productos.filter(function(p) { return p.tipo === 'busco'; });
    let r = 'Hay <strong>' + lista.length + ' alumnos buscando algo</strong>:';
    lista.forEach(function(p) {
      r += '<br><br><strong>' + p.titulo + '</strong> - Hasta S/ ' + p.precioMax;
    });
    return r;
  }

  // RESPUESTA POR DEFECTO SI NO ENTIENDE
  return 'No entendí tu mensaje. Puedes escribir <strong>/listar</strong> para ver todos los productos, o algo como "libros", "calculadora" o "molina".';
}
