# 🗄️ Esquema de Base de Datos y Modelo Entidad-Relación

El sistema utiliza **SQLite** como motor de base de datos relacional administrado a través de **Entity Framework Core Code-First**.

---

## 📊 Tablas Principales

### 1. `Clientes`
- **`Id`** (int, PK, AutoIncrement)
- **`Nombre`** (string, Required)
- **`Email`** (string, Optional)

### 2. `Productos`
- **`Id`** (int, PK, AutoIncrement)
- **`Nombre`** (string, Required)
- **`Precio`** (decimal, Precision 18,2)
- **`Stock`** (int)
- **`StockMinimo`** (int)

> **Regla de Negocio Calculada:**  
> Un producto requiere reabastecimiento si `Stock <= StockMinimo`. Esta lógica no se almacena como columna física, sino que se proyecta dinámicamente en las respuestas del DTO.

### 3. `Pedidos`
- **`Id`** (int, PK, AutoIncrement)
- **`ClienteId`** (int, FK -> `Clientes.Id`)
- **`Fecha`** (DateTime)
- **`Total`** (decimal)

### 4. `DetallesPedido`
- **`Id`** (int, PK, AutoIncrement)
- **`PedidoId`** (int, FK -> `Pedidos.Id`)
- **`ProductoId`** (int, FK -> `Productos.Id`)
- **`Cantidad`** (int)
- **`PrecioUnitario`** (decimal)

---

## 🔗 Relaciones

- **Cliente 1 : N Pedidos:** Un cliente puede realizar múltiples compras.
- **Pedido 1 : N DetallesPedido:** Un pedido contiene uno o más productos.
- **Producto 1 : N DetallesPedido:** Un producto puede aparecer en múltiples detalles de pedido.