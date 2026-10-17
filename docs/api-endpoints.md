# 🔌 Documentación de Endpoints de la API

La API responde sobre la ruta base `/api/[controller]` y utiliza formatos JSON para el intercambio de información.

---

## 📦 Productos (`/api/Productos`)

| Método | Endpoint | Descripción | Body (Payload) |
|---|---|---|---|
| `GET` | `/api/Productos` | Obtener catálogo completo | N/A |
| `GET` | `/api/Productos/{id}` | Obtener producto por ID | N/A |
| `GET` | `/api/Productos/alertas/bajo-stock` | Obtener productos con alerta de stock | N/A |
| `POST` | `/api/Productos` | Registrar nuevo producto | `{ nombre, precio, stock, stockMinimo }` |
| `PATCH` | `/api/Productos/{id}/stock` | Reabastecimiento rápido de stock | `nuevoStock` (int) |
| `PUT` | `/api/Productos/{id}` | Edición integral de producto | `{ nombre, precio, stock, stockMinimo }` |

---

## 👥 Clientes (`/api/Clientes`)

| Método | Endpoint | Descripción | Body (Payload) |
|---|---|---|---|
| `GET` | `/api/Clientes` | Listar todos los clientes | N/A |
| `GET` | `/api/Clientes/{id}` | Obtener cliente por ID | N/A |
| `POST` | `/api/Clientes` | Crear nuevo cliente | `{ nombre, email }` |
| `PUT` | `/api/Clientes/{id}` | Actualizar datos del cliente | `{ nombre, email }` |

---

## 🧾 Pedidos / Ventas (`/api/Pedidos`)

| Método | Endpoint | Descripción | Body (Payload) |
|---|---|---|---|
| `GET` | `/api/Pedidos` | Historial completo de ventas | N/A |
| `POST` | `/api/Pedidos` | Procesar una venta en POS | `{ clienteId, detalles: [{ productoId, cantidad }] }` |