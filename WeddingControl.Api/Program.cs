using Microsoft.EntityFrameworkCore;
using WeddingControl.Api.Data;
using System.Text.Json.Serialization;

// 1. CORREÇÃO DE DATA NO POSTGRES
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// 2. FORÇAR A PORTA 5000 (IMPORTANTE PARA O NGROK)
builder.WebHost.UseUrls("http://*:5000");

// =====================
// SERVICES (Configuração)
// =====================

// Configuração de JSON para evitar Loop Infinito
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuração do Banco de Dados (PostgreSQL)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default"))
);

// Configuração do CORS (Permite qualquer origem)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// =====================
// PIPELINE (Execução)
// =====================

// Permite Swagger mesmo se não estiver em "Development" (útil para testes externos)
app.UseSwagger();
app.UseSwaggerUI();

// APLICA O CORS (Deve vir antes de MapControllers)
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();