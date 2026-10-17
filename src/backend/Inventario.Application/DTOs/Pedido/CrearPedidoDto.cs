namespace Inventario.Application.DTOs.Pedido;

public class CrearPedidoDto
{
    // ID del cliente asociado a la compra
    public int ClienteId { get; set; }

    // Lista con todos los productos agregados al carrito
    public List<CrearDetallePedidoDto> Detalles { get; set; } = new();
}