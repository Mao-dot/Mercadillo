// DATOS DEL MERCADILLO MARKET

// LISTA DE USUARIOS
const usuarios = [
  { id: 'u1', nombre: 'Camila Vásquez',  carrera: 'Medicina',             sede: 'la_molina', rating: 4.9, telefono: '999111222' },
  { id: 'u2', nombre: 'Renzo Castillo',  carrera: 'Odontología',          sede: 'la_molina', rating: 4.7, telefono: '999111223' },
  { id: 'u3', nombre: 'Daniela Romero',  carrera: 'Enfermería',           sede: 'smp',       rating: 5.0, telefono: '999111224' },
  { id: 'u4', nombre: 'Mateo Ríos',      carrera: 'Biología',             sede: 'la_molina', rating: 4.4, telefono: '999111225' },
  { id: 'u5', nombre: 'Lucía Paredes',   carrera: 'Psicología',           sede: 'la_molina', rating: 4.8, telefono: '999111226' },
  { id: 'u6', nombre: 'Joaquín Salinas', carrera: 'Medicina Veterinaria', sede: 'smp',       rating: 4.6, telefono: '999111227' },
  { id: 'u7', nombre: 'Valeria Núñez',   carrera: 'Nutrición',            sede: 'smp',       rating: 4.9, telefono: '999111228' },
  { id: 'u8', nombre: 'Sebastián León',  carrera: 'Tecnología Médica',    sede: 'smp',       rating: 4.5, telefono: '999111229' },
  { id: 'u9', nombre: 'Andrea Cárdenas', carrera: 'Farmacia',             sede: 'la_molina', rating: 4.8, telefono: '999111230' }
];

// LISTA DE PRODUCTOS
const productos = [
  { id: 'p01', tipo: 'venta',    categoria: 'electronica', titulo: 'Calculadora Casio fx-991ES Plus',          descripcion: 'Usada solo un ciclo. Sin rayones, con tapa original. La compré para Estadística pero ya no la necesito.', precio: 95,  sede: 'la_molina', vendedor: 'u1', condicion: 'Casi nueva' },
  { id: 'p02', tipo: 'venta',    categoria: 'libros',      titulo: 'Netter - Atlas de Anatomía Humana 8va ed', descripcion: 'Edición física en buen estado, algunas marcas con resaltador en sistema nervioso.',                       precio: 220, sede: 'la_molina', vendedor: 'u2', condicion: 'Usado' },
  { id: 'p03', tipo: 'venta',    categoria: 'laboratorio', titulo: 'Bata blanca talla M (manga larga)',        descripcion: 'Bata nueva sin estrenar, talla M. Compré dos por error.',                                                  precio: 55,  sede: 'la_molina', vendedor: 'u5', condicion: 'Nuevo' },
  { id: 'p04', tipo: 'venta',    categoria: 'apuntes',     titulo: 'Apuntes de Bioquímica ciclo 2025-I',       descripcion: '180 hojas escaneadas en PDF más el cuaderno físico. Aprobé con 17.',                                       precio: 30,  sede: 'la_molina', vendedor: 'u9', condicion: 'Usado' },
  { id: 'p05', tipo: 'venta',    categoria: 'transporte',  titulo: 'Bicicleta urbana aro 26',                  descripcion: 'Marca genérica, le cambié las llantas hace poco. Perfecta para moverte por La Molina.',                    precio: 480, sede: 'la_molina', vendedor: 'u4', condicion: 'Usado' },
  { id: 'p06', tipo: 'venta',    categoria: 'laboratorio', titulo: 'Estetoscopio Littmann Classic III',        descripcion: 'Color negro, usado en rotaciones. Funciona perfecto, lo vendo porque ya tengo el Cardiology IV.',          precio: 380, sede: 'smp',       vendedor: 'u3', condicion: 'Usado' },
  { id: 'p07', tipo: 'venta',    categoria: 'libros',      titulo: 'Guyton y Hall - Fisiología Médica 14 ed',  descripcion: 'Casi sin uso. Lo vendo porque ya pasé el curso.',                                                          precio: 180, sede: 'smp',       vendedor: 'u7', condicion: 'Casi nueva' },
  { id: 'p08', tipo: 'venta',    categoria: 'electronica', titulo: 'Tablet Android 10 pulgadas con lapicero',  descripcion: 'Ideal para tomar apuntes. Incluye funda y vidrio templado nuevo.',                                         precio: 420, sede: 'smp',       vendedor: 'u6', condicion: 'Usado' },
  { id: 'p09', tipo: 'alquiler', categoria: 'laboratorio', titulo: 'Microscopio binocular (alquiler)',         descripcion: 'Para prácticas de Histología. Lo alquilo por días o semanas. Pago al recoger.',                            precio: 35,  sede: 'la_molina', vendedor: 'u5' },
  { id: 'p10', tipo: 'alquiler', categoria: 'muebles',     titulo: 'Escritorio plegable para cuarto',          descripcion: 'Para alquilar durante el ciclo. Ideal para alumnos de provincia que alquilan cuarto cerca al campus.',     precio: 8,   sede: 'la_molina', vendedor: 'u1' },
  { id: 'p11', tipo: 'alquiler', categoria: 'electronica', titulo: 'Cámara Canon Rebel T7 más lente 18-55',    descripcion: 'Alquiler por día. Ideal para proyectos de investigación visual o salidas.',                                precio: 45,  sede: 'la_molina', vendedor: 'u9' },
  { id: 'p12', tipo: 'alquiler', categoria: 'laboratorio', titulo: 'Modelo anatómico de cráneo (alquiler)',    descripcion: 'Cráneo desarmable para estudiar. Lo alquilo por semanas en época de parciales.',                           precio: 12,  sede: 'smp',       vendedor: 'u3' },
  { id: 'p13', tipo: 'alquiler', categoria: 'muebles',     titulo: 'Silla ergonómica de estudio',              descripcion: 'Por días o semanas. Perfecta para sesiones largas de estudio.',                                            precio: 6,   sede: 'smp',       vendedor: 'u8' },
  { id: 'p14', tipo: 'busco',    categoria: 'libros',      titulo: 'Busco: Robbins - Patología',               descripcion: 'Pago hasta S/ 200. Preferible 10ma edición o más reciente.',                                               precioMax: 200, sede: 'la_molina', vendedor: 'u2' },
  { id: 'p15', tipo: 'busco',    categoria: 'laboratorio', titulo: 'Busco: alquiler de microscopio',           descripcion: 'Necesito uno por 2 semanas para prácticas de junio. Pago hasta S/ 40 por día.',                            precioMax: 40,  sede: 'smp',       vendedor: 'u6' },
  { id: 'p16', tipo: 'busco',    categoria: 'electronica', titulo: 'Busco: tablet usada en buen estado',       descripcion: 'Para tomar apuntes. Pago hasta S/ 450. Cualquier marca.',                                                  precioMax: 450, sede: 'smp',       vendedor: 'u7' },
  { id: 'p17', tipo: 'busco',    categoria: 'laboratorio', titulo: 'Busco: bata blanca talla M',               descripcion: 'Nueva o casi nueva, manga larga. Para prácticas de fisiología.',                                           precioMax: 70,  sede: 'la_molina', vendedor: 'u4' },
  { id: 'p18', tipo: 'busco',    categoria: 'libros',      titulo: 'Busco: Netter de Anatomía',                descripcion: 'Cualquier edición desde la 7ma. Pago hasta S/ 250.',                                                       precioMax: 250, sede: 'la_molina', vendedor: 'u4' }
];

// NOMBRES DE SEDES
function nombreSede(sede) {
  if (sede === 'la_molina') return 'La Molina';
  if (sede === 'smp') return 'SMP';
  return 'Ambas sedes';
}

// BUSCAR UN PRODUCTO POR ID
function buscarProducto(id) {
  // Primero busca en los productos de ejemplo
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id === id) return productos[i];
  }
  // Si no lo encuentra, busca en los productos publicados por el usuario
  const propios = obtenerProductosPropios();
  for (let i = 0; i < propios.length; i++) {
    if (propios[i].id === id) return propios[i];
  }
  return null;
}

// BUSCAR UN USUARIO POR ID
function buscarUsuario(id) {
  // Primero busca en los usuarios de ejemplo
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id === id) return usuarios[i];
  }
  // Si no lo encuentra, revisa si es el usuario que inició sesión
  const yo = obtenerUsuario();
  if (yo && yo.id === id) return yo;
  return null;
}
