using Inventario.Application.DTOs.Cliente;

namespace Inventario.Application.Services;

public interface IClienteService
{
    Task<IEnumerable<ClienteDto>> ObtenerTodosAsync();
    Task<ClienteDto?> ObtenerPorIdAsync(int id);
    Task<ClienteDto> CrearAsync(CrearClienteDto dto);
    Task<ClienteDto?> ActualizarAsync(int id, ActualizarClienteDto dto);
}