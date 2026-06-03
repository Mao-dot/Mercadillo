// LÓGICA DE LA PÁGINA DE LOGIN

// REFERENCIA AL FORMULARIO
const formularioLogin = document.getElementById('formulario-login');

// MANEJAR EL ENVÍO DEL FORMULARIO
formularioLogin.addEventListener('submit', function(evento) {
  evento.preventDefault();

  // OBTENER LOS VALORES INGRESADOS
  const correo = document.getElementById('correo').value.trim();
  const contrasena = document.getElementById('contrasena').value.trim();

  // VALIDAR EL CORREO
  if (correo === '') {
    alert('Por favor, ingresa tu correo institucional.');
    return;
  }

  // EL CORREO DEBE TERMINAR EN @upch.pe
  if (!correo.endsWith('@upch.pe')) {
    alert('Solo se permiten correos institucionales @upch.pe');
    return;
  }

  // VALIDAR LA CONTRASEÑA
  if (contrasena === '') {
    alert('Por favor, ingresa tu contraseña.');
    return;
  }
  if (contrasena.length < 4) {
    alert('La contraseña debe tener al menos 4 caracteres.');
    return;
  }

  // CREAR EL USUARIO A PARTIR DEL CORREO
  const nombre = generarNombre(correo);
  const nuevoUsuario = {
    id: 'u' + Date.now(),
    nombre: nombre,
    carrera: 'Medicina',
    sede: 'la_molina',
    rating: 5.0,
    telefono: '999000000'
  };

  // GUARDAR EL USUARIO EN EL NAVEGADOR
  guardarUsuario(nuevoUsuario);

  // CONFIRMAR Y REDIRIGIR AL INICIO
  alert('¡Bienvenido a Mercadillo Market, ' + nombre.split(' ')[0] + '!');
  window.location.href = 'index.html';
});

// GENERAR EL NOMBRE A PARTIR DEL CORREO
function generarNombre(correo) {
  // Tomar la parte antes del @
  const parteUsuario = correo.split('@')[0];
  // Los correos UPCH suelen ser apellido.nombre
  const partes = parteUsuario.split('.');

  if (partes.length >= 2) {
    return capitalizar(partes[1]) + ' ' + capitalizar(partes[0]);
  }
  return capitalizar(parteUsuario);
}

// PONER LA PRIMERA LETRA EN MAYÚSCULA
function capitalizar(texto) {
  if (texto.length === 0) return texto;
  return texto[0].toUpperCase() + texto.slice(1).toLowerCase();
}
