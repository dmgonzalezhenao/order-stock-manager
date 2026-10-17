namespace Inventario.Domain.Entities;

// Representa cada producto individual agregado a la orden (el ítem del carrito)
public class DetallePedido
{
    public int Id { get; set; }

    // Clave Foránea apuntando al Pedido al que pertenece este ítem
    public int PedidoId { get; set; }
    public Pedido Pedido { get; set; } = null!;

    // Clave Foránea apuntando al Producto comprado
    public int ProductoId { get; set; }
    public Producto Producto { get; set; } = null!;

    // Cantidad de unidades de este producto concreto
    public int Cantidad { get; set; }

    // Precio registrado al momento del pago.
    // Guardar este precio asegura que los históricos de ventas no cambien si el precio del producto sube en el futuro.
    public decimal PrecioUnitario { get; set; }
}