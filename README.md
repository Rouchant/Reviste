# REVISTE - Marketplace de Moda Circular 👗♻️

![REVISTE Banner](public/assets/images/ui/logo-h.png)

**REVISTE** es una plataforma premium de compra y venta de moda circular, diseñada para transformar la manera en que consumimos ropa y accesorios. Fusionamos una estética **Y2K/Glassmorphism** de vanguardia con la funcionalidad robusta de los grandes marketplaces globales, construida sobre un stack moderno de React y Tailwind CSS.

---

## ✨ Características Principales

### 📱 Arquitectura Mobile-First & Premium UI
- **Navegación Inteligente**: Sistema dual con barra superior minimalista para escritorio y **Fixed Bottom Nav** ergonómico para móviles.
- **Micro-interacciones**: Animaciones fluidas, efectos de glassmorphism y hover states dinámicos.
- **Sticky CTA**: Barra de compra persistente en móviles para agilizar la conversión.
- **Componentes CVA**: Sistema de diseño basado en átomos reutilizables con variantes controladas (Class Variance Authority).
- **Gestión de Stock**: Panel dedicado para vendedores con capacidades completas de CRUD (Crear, Editar, Eliminar).
- **Control de Acceso**: Funcionalidades de favoritos y gestión de tienda protegidas mediante sistema de autenticación.

### 🔍 Buscador Híbrido Inteligente (Atlas Search)
- **Fuzzy Search & Stemming**: Integración directa con MongoDB Atlas Search (usando `lucene.spanish`) que comprende plurales, ignora errores ortográficos (maxEdits) y no depende de acentos (ej. "sueter" encuentra "suéter").
- **Fusión Local/Servidor**: El frontend cruza la información en tiempo real, permitiendo buscar etiquetas dinámicas calculadas al vuelo (como "Oferta" o "Nuevo") al mismo tiempo que aprovecha la inteligencia de Atlas para el catálogo pesado.
- **Debounce Optimizado**: Búsqueda asíncrona fluida sin saturar la API.

### 🏗️ Arquitectura de "Vertical Slices"
El proyecto utiliza una estructura orientada a funcionalidades (**Feature-driven architecture**), eliminando el código espagueti y facilitando la escalabilidad:
- **Features aisladas**: Cada funcionalidad (Carrito, Catálogo, Admin) contiene sus propios componentes, hooks y lógica.
- **Layout System**: Jerarquía de layouts especializados (`MainLayout`, `AuthLayout`, `AdminLayout`) para manejar diferentes contextos de usuario.
- **Zustand State**: Gestión de estado global ligera y eficiente para el carrito de compras.

---

## 🛍️ Flujo de Compra (Customer Journey)

A continuación se describe el proceso optimizado que sigue un cliente desde el descubrimiento hasta la conversión:

```mermaid
graph TD
    Start((Inicio)) --> Home[Home / Catálogo]
    
    Home --> Explore{¿Cómo navega?}
    
    Explore -->|Barra de búsqueda| Search[Página de Resultados]
    Explore -->|Navegación directa| Detail[Detalle de Producto]
    Explore -->|Guarda para después| Favorites[Mis Favoritos]
    
    Search --> Detail
    Favorites --> Detail
    
    Detail --> AddCart[Añadir al Carrito]
    
    AddCart --> ViewCart[Revisión en Carrito]
    
    ViewCart -->|Proceder al pago| AuthCheck{¿Logueado?}
    
    AuthCheck -->|No| Auth[Login / Registro]
    AuthCheck -->|Sí| Checkout[Checkout / Pago]
    
    Auth -->|Una vez logueado| Checkout
    Checkout --> Success((Éxito ✨))
    
    style Success fill:#D63D82,color:#fff
    style Start fill:#111827,color:#fff
    style Favorites fill:#84A98C,color:#fff
```

## ♻️ Ciclo de Vida de la Prenda

Cualquier usuario puede participar en la economía circular de REVISTE siguiendo este flujo de gestión:

```mermaid
graph LR
    Subida[Subida de Prenda] --> Disponible[Disponible en Catálogo]
    
    %% Acciones del Vendedor en 'Mi Tienda'
    Disponible -->|Edita info/precio| Disponible
    Disponible -->|Elimina stock| Borrada[Prenda Eliminada]
    
    %% Flujo de Compra
    Disponible -->|Alguien inicia compra| Reservada[Reservada]
    Reservada -.->|Cancela| Disponible
    
    Reservada -->|Pago completado| Vendida[Venta Exitosa]
    Disponible -->|Compra directa| Vendida
    
    style Subida fill:#D63D82,color:#fff
    style Vendida fill:#84A98C,color:#fff
    style Disponible fill:#111827,color:#fff
    style Reservada fill:#ffa500,color:#fff
```

## 🗄️ Esquema de Base de Datos (ERD)

A continuación se detalla la estructura de datos real de Reviste, basada en los modelos de MongoDB (`server/models.ts`):

```mermaid
---
title: Diagrama Entidad-Relación - REVISTE
config:
  layout: elk
  theme: neutral
  er:
    layoutDirection: TB
    entityPadding: 15
    minEntityWidth: 160
---
erDiagram
    direction TB

    %% ==========================================
    %% RELACIONES (ORDENADAS PARA FLUJO VERTICAL)
    %% ==========================================
    
    %% Nivel 1: Localización
    REGION ||--o{ COMUNA : "tiene"
    COMUNA ||--o{ DIRECCION : "tiene"
    DIRECCION ||--o{ USUARIO : "es hogar de"
    DIRECCION ||--o{ ENVIO : "es destino de"

    %% Nivel 2: Identidad y Catálogo
    USUARIO ||--o{ PRENDA : "vende"
    CATEGORIA ||--o{ PRENDA : "agrupa"
    PRENDA ||--o{ PRENDA_IMAGEN : "tiene fotos"
    
    %% Nivel 3: Interacción Social y Carrito
    USUARIO ||--o{ FAVORITO : "guarda"
    PRENDA ||--o{ FAVORITO : "marcada por"
    USUARIO ||--o| CARRITO : "posee"
    CARRITO ||--o{ CARRITO_ITEM : "contiene"
    PRENDA ||--o{ CARRITO_ITEM : "añadida a"

    %% Nivel 4: Transacción
    USUARIO ||--o{ ORDEN : "compra"
    ORDEN ||--o{ DETALLE_ORDEN : "incluye"
    PRENDA ||--o{ DETALLE_ORDEN : "incluida en"
    
    %% Nivel 5: Post-Venta
    ORDEN ||--o| PAGO : "tiene"
    ORDEN ||--o| ENVIO : "requiere"
    ORDEN ||--o| CALIFICACION : "genera"
    USUARIO ||--o{ CALIFICACION : "recibe/da"

    %% ==========================================
    %% DEFINICIÓN COMPLETA DE ATRIBUTOS
    %% ==========================================

    REGION {
        number id PK
        string NOMBRE_REGION
    }
    COMUNA {
        number id PK
        number ID_REGION FK
        string NOMBRE_COMUNA
    }
    DIRECCION {
        number id PK
        string CALLE
        number ID_COMUNA FK
    }
    USUARIO {
        number id PK
        number ID_DIRECCION FK
        string NOMBRE_USUARIO
        string NOMBRE_COMPLETO
        string CORREO
        string CONTRASENA
        string TELEFONO
        date FECHA_REGISTRO
        boolean ES_ADMIN
    }
    CATEGORIA {
        number id PK
        string NOMBRE_CATEGORIA
        string DESCRIPCION
    }
    PRENDA {
        number id PK
        string NOMBRE_PRENDA
        number ID_USUARIO_VENDEDOR FK
        number ID_CATEGORIA FK
        date FECHA_PUBLICACION
        string DESCRIPCION
        string ESTADO_VENTA
        string TALLA
        number PRECIO_VENTA_PUBLICO
        string ESTADO_CONSERVACION
        number OLD_PRICE
        string DISCOUNT
        number RATING
        number REVIEWS_COUNT
        boolean FREE_SHIPPING
    }
    PRENDA_IMAGEN {
        number id PK
        number ID_PRENDA FK
        string URL
    }
    CARRITO {
        number id PK
        number ID_USUARIO FK
        date FECHA_CREACION
    }
    CARRITO_ITEM {
        number id PK
        number ID_CARRITO FK
        number ID_PRENDA FK
        number CANTIDAD
    }
    ORDEN {
        number id PK
        number ID_USUARIO_COMPRADOR FK
        date FECHA_COMPRA
        number MONTO_TOTAL
        string ESTADO_ENVIO
    }
    DETALLE_ORDEN {
        number ID_ORDEN FK
        number ID_PRENDA FK
        number CANTIDAD
        number PRECIO_UNITARIO
    }
    PAGO {
        number id PK
        number ID_ORDEN FK
        string METODO
        string ESTADO
        date FECHA
    }
    ENVIO {
        number id PK
        number ID_ORDEN FK
        number ID_DIRECCION FK
        string TRACKING
        string ESTADO
    }
    CALIFICACION {
        number id PK
        number ID_ORDEN FK
        number ID_USUARIO_VENDEDOR FK
        number ID_USUARIO_COMPRADOR FK
        number CALIFICACION
        string COMENTARIO
    }
    FAVORITO {
        number ID_USUARIO FK
        number ID_PRENDA FK
    }
    HEROSLIDE {
        number id PK
        string title
        string subtitle
        string buttonText
        string image
        string link
    }
```

## 🛠️ Stack Tecnológico y Dependencias

### 🎨 Frontend & Interfaz
- **Core**: [React 18](https://reactjs.org/) + [React Router v6](https://reactrouter.com/) para navegación.
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) (Styling utilitario).
- **Componentes Base**: [@radix-ui](https://www.radix-ui.com/) para primitivas accesibles (Modales, Acordeones, Menús).
- **Herramientas de UI**: [CVA](https://cva.style/), `clsx` y `tailwind-merge` para gestión dinámica de clases y variantes.
- **Iconografía**: [Lucide React](https://lucide.dev/).
- **Notificaciones**: [Sonner](https://sonner.emilkowal.ski/) para popups (toasts) elegantes.
- **Estado Global**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) para carritos y sesiones.

### ⚙️ Backend & Base de Datos
- **Servidor**: [Express.js](https://expressjs.com/) para la API REST, con soporte [CORS](https://expressjs.com/en/resources/middleware/cors.html).
- **Base de Datos**: [MongoDB](https://www.mongodb.com/) (Driver Nativo).
- **ODM**: [Mongoose](https://mongoosejs.com/) para modelado y esquemas de datos.

### 🛠️ Herramientas de Desarrollo
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) (Tipado fuerte en todo el stack).
- **Empaquetador**: [Vite](https://vitejs.dev/) para tiempos de carga y construcción ultrarrápidos.
- **Ejecución de Servidor**: `tsx` y `concurrently` para correr el backend y el frontend simultáneamente en desarrollo.
- **Calidad de Código**: `eslint` y sus plugins para mantener buenas prácticas.
- **Variables de Entorno**: `dotenv` para configuración segura.

---

## 🚀 API Reference

El backend de REVISTE expone los siguientes endpoints para el manejo del catálogo y transacciones:

### Catálogo
- `GET /api/catalog/categories`: Obtiene la lista de nombres de categorías.
- `GET /api/catalog/products`: Obtiene todos los productos con sus imágenes y vendedores vinculados.
- `GET /api/catalog/search?q=...`: Endpoint dedicado para búsqueda inteligente y difusa impulsado por MongoDB Atlas Search.
- `GET /api/catalog/products/:id`: Obtiene el detalle completo de una prenda específica.
- `POST /api/catalog/products`: Crea una nueva prenda vinculada al usuario logueado.
- `GET /api/catalog/products/seller/:sellerId`: Lista los productos de un vendedor específico.
- `PUT /api/catalog/products/:id`: Actualiza precio o detalles de una prenda existente.
- `DELETE /api/catalog/products/:id`: Elimina una prenda y sus imágenes del sistema.
- `GET /api/catalog/hero-slides`: Obtiene las diapositivas dinámicas para el carrusel de inicio.

---

## 👕 Gestión de Productos (Vendedores/Admin)

¿Dónde se añaden las prendas?
1. **Mi Tienda (Todos los Usuarios)**: Cualquier usuario autenticado tiene acceso a `/my-store`, donde puede visualizar sus prendas activas, ajustar precios y editar detalles técnicos en una página dedicada.
2. **Subida Directa**: A través del icono de tienda o vía `/upload`, se accede al formulario de curatoria para publicar nuevos tesoros.
3. **Panel Admin (Administradores)**: Los administradores mantienen un control global en `/admin` para moderar el contenido de toda la plataforma.

### Control de Identidad y Negocio
La arquitectura separa estrictamente la cuenta del usuario de la actividad comercial:
- **Settings**: Gestión de perfil, seguridad y pagos (con navegación horizontal optimizada para móviles).
- **My Store**: Dashboard de ventas y control de inventario.
- **Global Logout**: Acceso inmediato al cierre de sesión desde la barra principal.

---

## 📁 Estructura del Proyecto

```text
src/
├── components/         # COMPONENTES GLOBALES (Átomos UI)
│   └── ui/             # Button, Input, Badge, Card (CVA)
├── layouts/            # ESTRUCTURAS DE PÁGINA
│   ├── MainLayout.tsx  # Marketplace convencional
│   ├── AuthLayout.tsx  # Foco en Login/Registro
│   └── AdminLayout.tsx # Dashboard administrativo
├── features/           # VERTICAL SLICES (El corazón de la app)
│   ├── catalog/        # Home, Detalle, Búsqueda, Hooks de datos
│   ├── cart/           # Lógica de carrito, Store, Ventana de compra
│   ├── auth/           # Login, Configuración de perfil
│   └── inventory/      # Panel admin, Mis prendas, Subida de productos
├── data/               # MockData y configuraciones persistentes
├── lib/                # Utilidades y configuración de Tailwind Merge
└── App.tsx             # Enrutamiento centralizado y lazy loading
```

---

## 🎨 Design System

- **Colores Brand**: 
  - `Brand Pink`: `#D63D82` (Primario)
  - `Eco Green`: `#84A98C` (Sustentabilidad)
  - `Brand Dark`: `#111827` (Estratificación)
- **Tipografía**: Outfit (Modernidad) & Playfair Display (Elegancia)
- **Estética**: Corner radius adaptativo (`32px`), sombras suaves y `backdrop-blur` para el efecto cristal.

---

## 🚀 Cómo empezar

1.  **Clonar y configurar**:
    ```bash
    git clone https://github.com/usuario/reviste.git
    cd reviste
    npm install
    ```

2.  **Desarrollo**:
    ```bash
    npm run dev
    ```

3.  **Compilación**:
    ```bash
    npm run build
    ```

> "El futuro de la moda es circular." - **REVISTE SpA 2026**
