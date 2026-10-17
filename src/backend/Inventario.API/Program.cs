using Inventario.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Leer la cadena de conexión del archivo appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Registrar el DbContext de la capa Infrastructure en el contenedor de Inyección de Dependencias
//    Indicamos que use SQLite y especificamos que las migraciones se guardarán en Inventario.Infrastructure
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString, b => b.MigrationsAssembly("Inventario.Infrastructure")));

// 3. Registrar los controladores HTTP de la API
builder.Services.AddControllers();

// 4. Configurar Swagger para probar la API desde una interfaz gráfica
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configuración del pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
