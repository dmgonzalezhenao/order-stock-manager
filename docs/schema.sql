-- Código de la estructura de la base de datos
-- en SQLite

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS Clientes (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS Productos (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Nombre TEXT NOT NULL,
    Precio REAL NOT NULL CHECK(Precio >= 0),
    Stock INTEGER NOT NULL CHECK(Stock >= 0),
    StockMinimo INTEGER NOT NULL DEFAULT 5 CHECK(StockMinimo >= 0)
);

-- Tabla de Pedidos
CREATE TABLE IF NOT EXISTS Pedidos (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    ClienteId INTEGER NOT NULL,
    Fecha TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    Total REAL NOT NULL CHECK(Total >= 0),
    Estado TEXT NOT NULL DEFAULT 'Completado',
    FOREIGN KEY (ClienteId) REFERENCES Clientes(Id) ON DELETE RESTRICT
);

-- Tabla de DetallesPedido (Líneas del carrito)
CREATE TABLE IF NOT EXISTS DetallesPedido (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    PedidoId INTEGER NOT NULL,
    ProductoId INTEGER NOT NULL,
    Cantidad INTEGER NOT NULL CHECK(Cantidad > 0),
    PrecioUnitario REAL NOT NULL CHECK(PrecioUnitario >= 0),
    FOREIGN KEY (PedidoId) REFERENCES Pedidos(Id) ON DELETE CASCADE,
    FOREIGN KEY (ProductoId) REFERENCES Productos(Id) ON DELETE RESTRICT
);