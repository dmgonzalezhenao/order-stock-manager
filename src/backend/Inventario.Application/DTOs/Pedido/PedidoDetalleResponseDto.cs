namespace Inventario.Application.DTOs.Pedido;

public class PedidoDetalleResponseDto
{
    public int PedidoId { get; set; }
    public string NombreCliente { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
    public decimal Total { get; set; }
    public string Estado { get; set; } = string.Empty;
    
    // Lista formateada de lo que se compró
    public List<ItemFacturaDto> Items { get; set; } = new();
}

public class ItemFacturaDto
{
    public string NombreProducto { get; set; } = string.Empty;
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
    public decimal Subtotal => Cantidad * PrecioUnitario;
}