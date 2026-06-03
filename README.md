# 🛒 Mercadillo Market UPCH

![Estado](https://img.shields.io/badge/Estado-Finalizado-success?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

**Mercadillo Market UPCH** es una plataforma web exclusiva diseñada para los estudiantes de la Universidad Peruana Cayetano Heredia. Facilita la compra, venta y alquiler de artículos estudiantiles (libros, instrumentos de laboratorio, electrónica, etc.) entre la comunidad universitaria.

Proyecto desarrollado para el curso de **Paradigmas de Programación**.

---

## ✨ Características Principales

*   🛍️ **Feed Interactivo:** Visualización en cuadrícula de todos los artículos disponibles.
*   🔍 **Filtros Avanzados:** Búsqueda en tiempo real por texto, categorías (Venta, Alquiler, Busco) y Sedes (La Molina / SMP).
*   💬 **Contacto Directo:** Integración con la API de WhatsApp para conectar inmediatamente al comprador con el vendedor mediante mensajes pre-armados.
*   🤖 **Asesor Virtual (Chatbot):** Un bot integrado que permite interactuar con lenguaje natural para buscar productos, listar inventario y responder preguntas.
*   👤 **Gestión de Perfil:** Panel personalizado para llevar un control de "Mis publicaciones" y métricas. (Persistencia de datos local).

---

## 🛠️ Tecnologías Utilizadas

Para mantener una arquitectura transparente y fácil de explicar, este proyecto fue construido utilizando herramientas nativas (Vanilla):

*   **HTML5 Semántico:** Estructuración de múltiples páginas independientes para una navegación clásica.
*   **CSS3 Puro:** Diseño limpio y responsive adaptado a la identidad visual de la universidad, usando variables CSS.
*   **Vanilla JavaScript:** Lógica de manipulación del DOM totalmente modularizada. Uso intensivo de métodos de arrays (`filter`, `forEach`) y `localStorage` en lugar de bases de datos complejas para simplificar la exposición académica.

---

## 🚀 Cómo ejecutar el proyecto

Al ser una aplicación *Client-Side* pura, no requiere bases de datos externas ni la instalación de dependencias en NodeJS.

1.  Clona o descarga este repositorio en tu computadora.
2.  Abre la carpeta del proyecto.
3.  Abre el archivo `index.html` en cualquier navegador web moderno (Chrome, Edge, Safari).
    *   *Tip:* Para una mejor experiencia de desarrollo, ábrelo en VS Code usando la extensión **Live Server**.

---

## 📂 Arquitectura de Archivos

```text
📁 Proyecto Mercadillo
├── 📄 index.html          # Feed principal y modal de bienvenida
├── 📄 detalle.html        # Vista detallada de un producto
├── 📄 publicar.html       # Formulario para subir nuevos artículos
├── 📄 chatbot.html        # Interfaz del Asesor Virtual (Bot)
├── 📄 perfil.html         # Estadísticas y mis publicaciones
├── 📄 login.html          # Inicio de sesión con correo @upch.pe
├── 📁 css/
│   └── 📄 styles.css      # Única hoja de estilos para todo el sitio
├── 📁 js/
│   ├── 📄 data.js         # Simulación de Base de Datos (Arrays)
│   ├── 📄 comun.js        # Lógica compartida (sesión, localStorage)
│   └── 📄 *.js            # Scripts específicos de cada página HTML
└── 📁 images/             # Recursos estáticos (svg, png)
```

<div align="center">
  <br>
  <i>Hecho para la comunidad UPCH</i>
</div>
