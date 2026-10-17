namespace Inventario.Application.DTOs.Producto;

public class ProductoDto
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public decimal Precio { get; set; }
    public int Stock { get; set; }
    public int StockMinimo { get; set; }
    
    // Propiedad calculada útil para el Frontend/QA
    public bool RequiereReabastecimiento => Stock <= StockMinimo;
}