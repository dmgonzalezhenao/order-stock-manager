using Inventario.Application.Services;
using Inventario.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- 1. CONFIGURACIÓN DE CORS ---
// Definimos una política que permita peticiones desde el entorno local de desarrollo de React (Vite)
var corsPolicyName = "AllowReactApp";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsPolicyName, policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // Puertos por defecto de Vite y React
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Cadena de conexión e Inyección de Dependencias
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString, b => b.MigrationsAssembly("Inventario.Infrastructure")));

builder.Services.AddScoped<IProductoService, ProductoService>();
builder.Services.AddScoped<IPedidoService, PedidoService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --- 2. ACTIVAR EL MIDDLEWARE DE CORS ---
// Debe ubicarse estrictamente ANTES de UseAuthorization y MapControllers
app.UseCors(corsPolicyName);

app.UseAuthorization();
app.MapControllers();

app.Run();
