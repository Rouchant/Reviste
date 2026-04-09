# REVISTE - Marketplace de Moda Circular 👗♻️

![REVISTE Banner](assets/images/ui/logo-h.png)

**REVISTE** es una plataforma premium de compra y venta de moda circular, diseñada para transformar la manera en que consumimos ropa y accesorios. Fusionamos una estética **Y2K/Glassmorphism** de vanguardia con la funcionalidad robusta de los grandes marketplaces globales.

---

## ✨ Características Principales

### 📱 Experiencia Mobile-First
- **Navegación Dual**: Barra superior minimalista para escritorio y **Fixed Bottom Nav** ergonómico para móviles, centralizando las acciones críticas (Admin, Carrito, Perfil).
- **Sticky CTA bar**: En páginas de producto, el botón de compra permanece siempre accesible al hacer scroll.
- **Layout Inteligente**: Reordenación dinámica de contenidos para móviles (ej. título y precio sobre la galería de imágenes).

### 📊 Dashboard y Gestión
- **Control Total**: Panel administrativo para gestión de inventario y métricas de venta.
- **Mis Prendas**: Espacio dedicado para que los usuarios gestionen sus anuncios publicados.
- **Configuración Unificada**: Acceso rápido a ajustes del sitio desde el footer y la navegación principal.

---

## 🛠️ Stack Tecnológico

- **Estructura**: HTML5 Semántico
- **Estilos**: 
  - **CSS3 Vanilla**: Arquitectura centralizada y optimizada.
  - **Glassmorphism**: Backdrop filters, gradientes dinámicos y orbes decorativos.
  - **Bootstrap 5**: Grid system y utilidades base.
- **Iconografía**: [Lucide Icons](https://lucide.dev/) (SVG dinámicos)
- **Tipografía**: Outfit & Playfair Display (Google Fonts)

---

## 📁 Estructura del Proyecto

```text
Reviste/
├── index.html          # Portal Principal y Marketplace
├── pages/
│   ├── auth.html       # Acceso Unificado (Login / Registro)
│   ├── upload.html     # Formulario de Publicación
│   ├── product.html    # Detalle Premium de Producto
│   ├── admin.html      # Panel de Gestión Administrativa
│   ├── my-garments.html # Dashboard del Usuario
│   ├── cart.html       # Visualización de Carrito
│   └── settings.html   # Configuración de Cuenta
├── css/
│   ├── main.css        # Punto de entrada de estilos
│   ├── components/     # Navbar, Cards, Buttons, etc.
│   └── pages/          # Estilos específicos por vista
└── assets/             # Recursos multimedia y logos
```

---

## 🎨 Identidad Visual (Design Tokens)

- **Malla de Color**:
  - `Brand Pink`: `#D63D82`
  - `Eco Green`: `#84A98C`
  - `Soft Cream`: `#F4F1DE`
- **Componentes**: Bordes ultra-redondeados (`30px`), sombras suaves (`shadow-soft`) y desenfocs gaussionos para el efecto cristal.

---

## 🚀 Cómo empezar
1. Clona el repositorio.
2. Abre `index.html` usando un servidor local (ej. *Live Server* de VS Code).
3. ¡Explora el futuro de la moda circular!

> "El futuro de la moda es circular." - **REVISTE SpA 2026**
