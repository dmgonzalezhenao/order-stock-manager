# 🏛️ Arquitectura del Sistema (Clean Architecture)

El backend está diseñado siguiendo los principios de **Clean Architecture** (Arquitectura Limpia) para garantizar la separación de responsabilidades, alta mantenibilidad y desacoplamiento entre las reglas de negocio y las tecnologías externas.

---

## 📂 Capas del Proyecto

```text
src/backend/
├── Inventario.Domain/        # Entidades, Enums y Excepciones de Dominio
├── Inventario.Application/   # Casos de Uso, DTOs e Interfaces de Servicios
├── Inventario.Infrastructure/# AppDbContext, EF Core, Repositorios y SQLite
└── Inventario.API/           # Controllers HTTP, Inyección de Dependencias y Swagger
```

## 🔄 Flujo de Datos y Reglas de Dependencia

### **Domain (Capa Central):**

- No depende de ninguna otra capa ni librería externa.

- Contiene la lógica central del negocio (ej. la regla de stock bajo).

### **Application:**

- Depende únicamente de Domain.

- Contiene la lógica de aplicación, los DTOs para evitar exponer directamente las entidades de base de datos, y las interfaces de servicio (IProductoService, IClienteService, IPedidoService).

### **Infrastructure:**

- Depende de Application y Domain.

- Implementa el acceso a la base de datos con Entity Framework Core y SQLite.

### **API (Punto de Entrada):**

- Depende de Application e Infrastructure.

- Contiene los controladores que reciben las peticiones HTTP y las mapean a respuestas JSON estandarizadas.