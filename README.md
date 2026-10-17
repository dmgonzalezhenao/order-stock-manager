# 🛒 FullStack POS & Inventory Management System

Un sistema robusto y moderno de Punto de Venta (POS) y Gestión de Inventarios desarrollado con **.NET 8** siguiendo los principios de **Clean Architecture** en el backend y **React 18 (Vite)** en el frontend.

---

## 🚀 Características Principales

- **Punto de Venta (POS):** Catálogo filtrable en tiempo real, carrito dinámico, cálculo automático de totales, selección/creación de clientes al vuelo y procesamiento de ventas.
- **Gestión de Inventario:** Control de stock en tiempo real, alertas de reabastecimiento (bajo stock), actualización rápida de existencias y modal de edición integral de productos (Nombre, Precio, Stock, Stock Mínimo).
- **Gestión de Clientes:** CRUD completo de clientes (Nombre y Email), con búsqueda en tiempo real y modales de edición.
- **Historial de Transacciones (Ventas):** Registro histórico de pedidos con búsqueda dinámica por factura o cliente, selector de registros por página y controles de paginación dobles (superior e inferior).
- **Diseño Adaptativo:** Layout 100% responsive implementado con CSS Grid y Flexbox.

---

## 🛠️ Tecnologías Utilizadas

### **Backend (.NET 8 - Clean Architecture)**
- **Framework:** .NET 8 Web API
- **ORM:** Entity Framework Core
- **Base de Datos:** SQLite
- **Patrones:** Clean Architecture (Domain, Application, Infrastructure, API), Dependency Injection, DTO Pattern.
- **Documentación:** Swagger / OpenAPI

### **Frontend (React)**
- **Librería UI:** React 18 + Vite
- **HTTP Client:** Axios (con Interceptors)
- **Iconografía:** Lucide React
- **Estilos:** Modern CSS Grid & Flexbox Layouts

---

## 📂 Estructura del Proyecto

```
text
├── src/
│   ├── backend/
│   │   ├── Inventario.Domain/        # Entidades del sistema y reglas de negocio
│   │   ├── Inventario.Application/   # DTOs, Interfaces y Servicios de Aplicación
│   │   ├── Inventario.Infrastructure/# AppDbContext, Migraciones y Configuración SQLite
│   │   └── Inventario.API/           # Controladores HTTP y Configuración de Servicios
│   │
│   └── frontend/
│       ├── src/
│       │   ├── api/                  # Configuración de Axios
│       │   ├── components/           # Componentes reutilizables (Navbar, etc.)
│       │   ├── pages/                # POS, Inventario, Clientes, Ventas
│       │   └── App.jsx
│       ├── package.json
│       └── vite.config.js
└── README.md
```

## ⚙️ Instalación y Configuración
### **Prerrequisitos**
- .NET 8 SDK

- Node.js (v18 o superior)

- Git

### **1. Clonar el repositorio**

```
bash
git clone [https://github.com/dmgonzalezhenao/order-stock-manager](https://github.com/dmgonzalezhenao/order-stock-manager)
cd fullstack-pos-inventory
```

### **2. Configurar y Ejecutar el Backend (.NET 8)**

```
bash
cd src/backend/Inventario.API

# Restaurar dependencias
dotnet restore

# Aplicar migraciones y crear base de datos SQLite
dotnet ef database update --project ../Inventario.Infrastructure

# Ejecutar la API
dotnet run
```

La API estará disponible en http://localhost:5000 (o el puerto configurado en launchSettings.json). La documentación Swagger se encuentra en /swagger.

### **3. Configurar y Ejecutar el Frontend (React)**
En una nueva terminal:

```
bash
cd src/frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo Vite
npm run dev
```

El cliente web se abrirá en http://localhost:5173.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.