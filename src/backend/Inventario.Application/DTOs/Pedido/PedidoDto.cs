namespace Inventario.Application.DTOs.Pedido;

public class PedidoDto
{
    public int PedidoId { get; set; }
    public string NombreCliente { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
    public decimal Total { get; set; }
    public int TotalProductos { get; set; }
}