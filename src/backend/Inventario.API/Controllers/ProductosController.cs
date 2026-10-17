using Inventario.Application.DTOs.Producto;
using Inventario.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Inventario.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductosController : ControllerBase
{
    private readonly IProductoService _productoService;

    public ProductosController(IProductoService productoService)
    {
        _productoService = productoService;
    }

    /// <summary>
    /// Obtiene el catálogo completo de productos
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ProductoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObtenerTodos()
    {
        var productos = await _productoService.ObtenerTodosAsync();
        return Ok(productos);
    }

    /// <summary>
    /// Obtiene un producto por su ID
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ProductoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObtenerPorId(int id)
    {
        var producto = await _productoService.ObtenerPorIdAsync(id);
        if (producto == null)
            return NotFound(new { mensaje = $"Producto con ID {id} no encontrado." });

        return Ok(producto);
    }

    /// <summary>
    /// Obtiene los productos que están igual o por debajo de su stock mínimo (Alertas de Inventario)
    /// </summary>
    [HttpGet("alertas/bajo-stock")]
    [ProducesResponseType(typeof(IEnumerable<ProductoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObtenerBajoStock()
    {
        var productos = await _productoService.ObtenerProductosBajoStockAsync();
        return Ok(productos);
    }

    /// <summary>
    /// Crea un nuevo producto en el catálogo
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ProductoDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Crear([FromBody] CrearProductoDto dto)
    {
        try
        {
            var creado = await _productoService.CrearAsync(dto);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = creado.Id }, creado);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    /// <summary>
    /// Reabastece o actualiza manualmente el stock de un producto
    /// </summary>
    [HttpPatch("{id:int}/stock")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ActualizarStock(int id, [FromBody] int nuevoStock)
    {
        try
        {
            var actualizado = await _productoService.ActualizarStockAsync(id, nuevoStock);
            if (!actualizado)
                return NotFound(new { mensaje = $"Producto con ID {id} no encontrado." });

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }
    /// <summary>
    /// Actualiza toda la información de un producto del catálogo
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ProductoDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Actualizar(int id, [FromBody] ActualizarProductoDto dto)
    {
        try
        {
            var actualizado = await _productoService.ActualizarAsync(id, dto);
            if (actualizado == null)
                return NotFound(new { mensaje = $"Producto con ID {id} no encontrado." });

            return Ok(actualizado);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensaje = ex.Message });
        }
    }
}