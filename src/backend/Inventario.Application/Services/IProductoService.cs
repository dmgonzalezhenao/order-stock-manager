using Inventario.Application.DTOs.Producto;

namespace Inventario.Application.Services;

public interface IProductoService
{
    Task<IEnumerable<ProductoDto>> ObtenerTodosAsync();
    Task<ProductoDto?> ObtenerPorIdAsync(int id);
    Task<IEnumerable<ProductoDto>> ObtenerProductosBajoStockAsync();
    Task<ProductoDto> CrearAsync(CrearProductoDto dto);
    Task<bool> ActualizarStockAsync(int id, int nuevoStock);
    Task<ProductoDto?> ActualizarAsync(int id, ActualizarProductoDto dto);
}