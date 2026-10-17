using Inventario.Application.DTOs.Pedido;

namespace Inventario.Application.Services;

// Define el contrato de métodos que debe ofrecer el servicio de pedidos
public interface IPedidoService
{
    // Procesa la compra desde el carrito, descuenta stock y registra el pedido
    Task<PedidoDetalleResponseDto> CrearPedidoAsync(CrearPedidoDto request);

    // Consulta un pedido por su ID e incluye la información del cliente y productos
    Task<PedidoDetalleResponseDto?> ObtenerPorIdAsync(int id);
}