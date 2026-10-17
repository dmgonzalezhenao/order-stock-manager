namespace Inventario.Application.DTOs.Pedido;

public class CrearDetallePedidoDto
{
    // ID del producto que el usuario seleccionó
    public int ProductoId { get; set; }

    // Cantidad de unidades que quiere llevar
    public int Cantidad { get; set; }
}