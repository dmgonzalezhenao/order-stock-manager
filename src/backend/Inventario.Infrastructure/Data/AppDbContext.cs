using Inventario.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Inventario.Infrastructure.Data;

// AppDbContext hereda de DbContext, la clase central de EF Core.
// Actúa como una sesión con la base de datos, permitiéndonos realizar consultas y guardar cambios.
public class AppDbContext : DbContext
{
    // El constructor recibe 'options' configuradas con la cadena de conexión desde la API
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Representación de las tablas de SQLite como colecciones DbSet<T>
    public DbSet<Producto> Productos => Set<Producto>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Pedido> Pedidos => Set<Pedido>();
    public DbSet<DetallePedido> DetallesPedido => Set<DetallePedido>();

    // Este método se ejecuta al construir el modelo relacional antes de consultar la base de datos
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- CONFIGURACIÓN DE RELACIONES Y RESTRICCIONES ---

        // Configuración de la relación entre Pedido y Cliente (1 a N)
        modelBuilder.Entity<Pedido>()
            .HasOne(p => p.Cliente)
            .WithMany(c => c.Pedidos)
            .HasForeignKey(p => p.ClienteId)
            .OnDelete(DeleteBehavior.Restrict); // Evita borrar un cliente si tiene pedidos registrados

        // Configuración de la relación entre DetallePedido y Pedido (1 a N)
        modelBuilder.Entity<DetallePedido>()
            .HasOne(d => d.Pedido)
            .WithMany(p => p.Detalles)
            .HasForeignKey(d => d.PedidoId)
            .OnDelete(DeleteBehavior.Cascade); // Si se elimina un pedido, sus detalles también se eliminan

        // Configuración de la relación entre DetallePedido y Producto (1 a N)
        modelBuilder.Entity<DetallePedido>()
            .HasOne(d => d.Producto)
            .WithMany(p => p.Detalles)
            .HasForeignKey(d => d.ProductoId)
            .OnDelete(DeleteBehavior.Restrict); // Evita borrar un producto si ya fue vendido en algún pedido

        // --- DATOS SEMILLA (Seed Data) ---
        // Estos datos se insertarán automáticamente al momento de aplicar la primera migración

        modelBuilder.Entity<Cliente>().HasData(
            new Cliente { Id = 1, Nombre = "Juan Pérez", Email = "juan.perez@email.com" },
            new Cliente { Id = 2, Nombre = "María Gómez", Email = "maria.gomez@email.com" }
        );

        modelBuilder.Entity<Producto>().HasData(
            new Producto { Id = 1, Nombre = "Laptop Lenovo ThinkPad", Precio = 850.00m, Stock = 10, StockMinimo = 2 },
            new Producto { Id = 2, Nombre = "Mouse Inalámbrico Logitech", Precio = 25.50m, Stock = 50, StockMinimo = 10 },
            new Producto { Id = 3, Nombre = "Teclado Mecánico RGB", Precio = 60.00m, Stock = 3, StockMinimo = 5 }
        );
    }
}