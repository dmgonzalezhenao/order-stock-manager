using Inventario.Application.DTOs.Producto;
using Inventario.Domain.Entities;
using Inventario.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Inventario.Application.Services;

public class ProductoService : IProductoService
{
    private readonly AppDbContext _context;

    public ProductoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProductoDto>> ObtenerTodosAsync()
    {
        return await _context.Productos
            .Select(p => new ProductoDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Precio = p.Precio,
                Stock = p.Stock,
                StockMinimo = p.StockMinimo
            })
            .ToListAsync();
    }

    public async Task<ProductoDto?> ObtenerPorIdAsync(int id)
    {
        var producto = await _context.Productos.FindAsync(id);
        if (producto == null) return null;

        return new ProductoDto
        {
            Id = producto.Id,
            Nombre = producto.Nombre,
            Precio = producto.Precio,
            Stock = producto.Stock,
            StockMinimo = producto.StockMinimo
        };
    }

    public async Task<IEnumerable<ProductoDto>> ObtenerProductosBajoStockAsync()
    {
        return await _context.Productos
            .Where(p => p.Stock <= p.StockMinimo)
            .Select(p => new ProductoDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Precio = p.Precio,
                Stock = p.Stock,
                StockMinimo = p.StockMinimo
            })
            .ToListAsync();
    }

    public async Task<ProductoDto> CrearAsync(CrearProductoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
            throw new InvalidOperationException("El nombre del producto no puede estar vacío.");

        if (dto.Precio <= 0)
            throw new InvalidOperationException("El precio debe ser mayor a 0.");

        var nuevoProducto = new Producto
        {
            Nombre = dto.Nombre,
            Precio = dto.Precio,
            Stock = dto.Stock,
            StockMinimo = dto.StockMinimo
        };

        _context.Productos.Add(nuevoProducto);
        await _context.SaveChangesAsync();

        return new ProductoDto
        {
            Id = nuevoProducto.Id,
            Nombre = nuevoProducto.Nombre,
            Precio = nuevoProducto.Precio,
            Stock = nuevoProducto.Stock,
            StockMinimo = nuevoProducto.StockMinimo
        };
    }

    public async Task<bool> ActualizarStockAsync(int id, int nuevoStock)
    {
        if (nuevoStock < 0)
            throw new InvalidOperationException("El stock no puede ser negativo.");

        var producto = await _context.Productos.FindAsync(id);
        if (producto == null) return false;

        producto.Stock = nuevoStock;
        await _context.SaveChangesAsync();
        return true;
    }
}