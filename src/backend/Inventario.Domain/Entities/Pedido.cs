namespace Inventario.Domain.Entities;

// Representa la cabecera de la orden/venta realizada en la caja registradora
public class Pedido
{
    public int Id { get; set; }

    // Clave Foránea (FK) apuntando a la tabla Clientes
    public int ClienteId { get; set; }
    
    // Objeto de navegación para acceder a los datos completos del cliente
    public Cliente Cliente { get; set; } = null!;

    // Fecha en la que se efectúa la venta (formato estándar UTC)
    public DateTime Fecha { get; set; } = DateTime.UtcNow;

    // Total acumulado sumando los subtotales de todos los ítems comprados
    public decimal Total { get; set; }

    // Estado del proceso de venta (ej: "Completado", "Cancelado")
    public string Estado { get; set; } = "Completado";

    // Relación 1 a N: Un pedido contiene una lista con los productos adquiridos
    public List<DetallePedido> Detalles { get; set; } = new();
}