using Inventario.Application.DTOs.Cliente;
using Inventario.Domain.Entities;
using Inventario.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Inventario.Application.Services;

public class ClienteService : IClienteService
{
    private readonly AppDbContext _context;

    public ClienteService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ClienteDto>> ObtenerTodosAsync()
    {
        return await _context.Clientes
            .Select(c => new ClienteDto
            {
                Id = c.Id,
                Nombre = c.Nombre,
                Email = c.Email,
            })
            .ToListAsync();
    }

    public async Task<ClienteDto?> ObtenerPorIdAsync(int id)
    {
        var cliente = await _context.Clientes.FindAsync(id);
        if (cliente == null) return null;

        return new ClienteDto
        {
            Id = cliente.Id,
            Nombre = cliente.Nombre,
            Email = cliente.Email,
        };
    }

    public async Task<ClienteDto> CrearAsync(CrearClienteDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
            throw new InvalidOperationException("El nombre del cliente es obligatorio.");

        var cliente = new Cliente
        {
            Nombre = dto.Nombre,
            Email = dto.Email,
        };

        _context.Clientes.Add(cliente);
        await _context.SaveChangesAsync();

        return new ClienteDto
        {
            Id = cliente.Id,
            Nombre = cliente.Nombre,
            Email = cliente.Email,
        };
    }
}