namespace Inventario.Domain.Entities;

// Representa los datos del comprador
public class Cliente
{
    public int Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;

    // Relación 1 a N: Un cliente puede realizar múltiples compras (Pedidos)
    public List<Pedido> Pedidos { get; set; } = new();
}