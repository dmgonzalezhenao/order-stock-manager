using Inventario.Application.DTOs.Pedido;
using Inventario.Domain.Entities;
using Inventario.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Inventario.Application.Services;

public class PedidoService : IPedidoService
{
    private readonly AppDbContext _context;

    // Inyectamos el DbContext para interactuar con la base de datos
    public PedidoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<PedidoDetalleResponseDto> CrearPedidoAsync(CrearPedidoDto request)
    {
        // 1. Validaciones básicas de entrada
        if (request.Detalles == null || !request.Detalles.Any())
        {
            throw new InvalidOperationException("El pedido debe contener al menos un producto.");
        }

        // 2. Verificar que el cliente existe
        var cliente = await _context.Clientes.FindAsync(request.ClienteId);
        if (cliente == null)
        {
            throw new KeyNotFoundException($"El cliente con ID {request.ClienteId} no existe.");
        }

        // 3. Iniciar una Transacción Atómica
        // Asegura que o se descuenta todo el stock y se crea el pedido, o se revierte todo si hay error
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var nuevoPedido = new Pedido
            {
                ClienteId = request.ClienteId,
                Fecha = DateTime.UtcNow,
                Estado = "Completado",
                Total = 0
            };

            decimal totalAcumulado = 0;
            var itemsRespuesta = new List<ItemFacturaDto>();

            // 4. Recorrer cada ítem del carrito de compras
            foreach (var item in request.Detalles)
            {
                if (item.Cantidad <= 0)
                {
                    throw new InvalidOperationException($"La cantidad para el producto ID {item.ProductoId} debe ser mayor a 0.");
                }

                // Buscar el producto en SQLite
                var producto = await _context.Productos.FindAsync(item.ProductoId);
                if (producto == null)
                {
                    throw new KeyNotFoundException($"El producto con ID {item.ProductoId} no existe.");
                }

                // Validar disponibilidad de Stock (Regla de negocio principal)
                if (producto.Stock < item.Cantidad)
                {
                    throw new InvalidOperationException(
                        $"Stock insuficiente para '{producto.Nombre}'. Disponible: {producto.Stock}, Solicitado: {item.Cantidad}.");
                }

                // Descontar el stock del producto
                producto.Stock -= item.Cantidad;

                // Calcular subtotal
                decimal subtotal = producto.Precio * item.Cantidad;
                totalAcumulado += subtotal;

                // Crear la línea de detalle
                nuevoPedido.Detalles.Add(new DetallePedido
                {
                    ProductoId = producto.Id,
                    Cantidad = item.Cantidad,
                    PrecioUnitario = producto.Precio
                });

                // Preparar datos para la respuesta DTO
                itemsRespuesta.Add(new ItemFacturaDto
                {
                    NombreProducto = producto.Nombre,
                    Cantidad = item.Cantidad,
                    PrecioUnitario = producto.Precio
                });
            }

            nuevoPedido.Total = totalAcumulado;

            // 5. Guardar cambios en la base de datos
            _context.Pedidos.Add(nuevoPedido);
            await _context.SaveChangesAsync();

            // Confirmar transacción
            await transaction.CommitAsync();

            // 6. Retornar el DTO con la factura procesada
            return new PedidoDetalleResponseDto
            {
                PedidoId = nuevoPedido.Id,
                NombreCliente = cliente.Nombre,
                Fecha = nuevoPedido.Fecha,
                Total = nuevoPedido.Total,
                Estado = nuevoPedido.Estado,
                Items = itemsRespuesta
            };
        }
        catch
        {
            // Revertir todos los cambios si ocurrió algún fallo
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<PedidoDetalleResponseDto?> ObtenerPorIdAsync(int id)
    {
        var pedido = await _context.Pedidos
            .Include(p => p.Cliente)
            .Include(p => p.Detalles)
                .ThenInclude(d => d.Producto)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (pedido == null) return null;

        return new PedidoDetalleResponseDto
        {
            PedidoId = pedido.Id,
            NombreCliente = pedido.Cliente.Nombre,
            Fecha = pedido.Fecha,
            Total = pedido.Total,
            Estado = pedido.Estado,
            Items = pedido.Detalles.Select(d => new ItemFacturaDto
            {
                NombreProducto = d.Producto.Nombre,
                Cantidad = d.Cantidad,
                PrecioUnitario = d.PrecioUnitario
            }).ToList()
        };
    }
}