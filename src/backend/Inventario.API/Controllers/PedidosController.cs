using Inventario.Application.DTOs.Pedido;
using Inventario.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Inventario.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PedidosController : ControllerBase
{
    private readonly IPedidoService _pedidoService;

    // Inyectamos la interfaz del servicio de pedidos
    public PedidosController(IPedidoService pedidoService)
    {
        _pedidoService = pedidoService;
    }

    /// <summary>
    /// Procesar una nueva venta / pedido desde la caja registradora (Frontend)
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(PedidoDetalleResponseDto), StatusCodes.Status201Created)] 
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CrearPedido([FromBody] CrearPedidoDto request)
    {
        try
        {
            var resultado = await _pedidoService.CrearPedidoAsync(request);
            
            // Devuelve un HTTP 201 Created con el endpoint de consulta y la factura
            return CreatedAtAction(nameof(ObtenerPorId), new { id = resultado.PedidoId }, resultado);
        }
        catch (KeyNotFoundException ex)
        {
            // Retorna HTTP 404 si el cliente o producto no existen
            return NotFound(new { mensaje = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // Retorna HTTP 400 si no hay stock o los datos de entrada son inválidos
            return BadRequest(new { mensaje = ex.Message });
        }
    }

    /// <summary>
    /// Consultar una factura/pedido por su ID
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(PedidoDetalleResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObtenerPorId(int id)
    {
        var pedido = await _pedidoService.ObtenerPorIdAsync(id);

        if (pedido == null)
        {
            return NotFound(new { mensaje = $"No se encontró ningún pedido con el ID {id}." });
        }

        return Ok(pedido);
    }
}