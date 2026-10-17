namespace Inventario.Domain.Entities;

// Representa la tabla "Productos" en SQLite
public class Producto
{
    // EF Core reconoce la propiedad 'Id' como Clave Primaria (Primary Key) e Autoincremental
    public int Id { get; set; }

    // Nombre del producto (inicializado en string vacío para evitar warnings de nulos)
    public string Nombre { get; set; } = string.Empty;

    // Precio unitario. Usamos 'decimal' en C# para evitar errores de redondeo en dinero
    public decimal Precio { get; set; }

    // Cantidad física disponible en bodega
    public int Stock { get; set; }

    // Umbral de seguridad. Si el Stock es menor o igual a este valor, se genera alerta de reabastecimiento
    public int StockMinimo { get; set; }

    // Propiedad de navegación: Relación 1 a N (Un producto puede aparecer en muchos renglones de venta)
    public List<DetallePedido> Detalles { get; set; } = new();
}