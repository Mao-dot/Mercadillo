// LÓGICA DE LA PÁGINA DE PERFIL

// VERIFICAR QUE HAYA SESIÓN INICIADA
const usuario = obtenerUsuario();
if (!usuario) {
  alert('Debes iniciar sesión para ver tu perfil.');
  window.location.href = 'login.html';
}

// MOSTRAR LOS DATOS DEL USUARIO Y SUS PUBLICACIONES
mostrarPerfil();
mostrarMisPublicaciones();

// LLENAR LA INFORMACIÓN DEL USUARIO
function mostrarPerfil() {
  // Calcular las iniciales del nombre para el avatar
  const partes = usuario.nombre.split(' ');
  const iniciales = partes[0][0] + (partes[1] ? partes[1][0] : '');
  document.getElementById('perfil-avatar').textContent = iniciales;

  // Nombre y datos básicos
  document.getElementById('perfil-nombre').textContent = usuario.nombre;
  const rating = usuario.rating || 5.0;
  document.getElementById('perfil-meta').textContent =
    usuario.carrera + ' · ' + nombreSede(usuario.sede) + ' · ★ ' + rating;

  // Botón de cerrar sesión
  document.getElementById('boton-cerrar-sesion').addEventListener('click', cerrarSesion);
}

// CARGAR LAS PUBLICACIONES PROPIAS Y CALCULAR LAS ESTADÍSTICAS
function mostrarMisPublicaciones() {
  const propios = obtenerProductosPropios();

  // Contar cuántos hay de cada tipo
  const ventas = propios.filter(function(p) { return p.tipo === 'venta'; }).length;
  const alquileres = propios.filter(function(p) { return p.tipo === 'alquiler'; }).length;
  const buscos = propios.filter(function(p) { return p.tipo === 'busco'; }).length;

  // Actualizar las estadísticas
  document.getElementById('stat-publicaciones').textContent = propios.length;
  document.getElementById('stat-ventas').textContent = ventas;
  document.getElementById('stat-alquileres').textContent = alquileres;
  document.getElementById('stat-buscos').textContent = buscos;

  // Mostrar las publicaciones del usuario
  const contenedor = document.getElementById('lista-publicaciones');

  if (propios.length === 0) {
    contenedor.innerHTML =
      '<div class="mensaje-vacio">Aún no has publicado nada. <a href="publicar.html">Publica tu primer producto</a></div>';
    return;
  }

  // Generar las tarjetas usando la función compartida en comun.js
  let html = '';
  propios.forEach(function(p) {
    html += generarTarjeta(p);
  });
  contenedor.innerHTML = html;
}
