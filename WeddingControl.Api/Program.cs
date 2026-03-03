using Microsoft.EntityFrameworkCore;
using WeddingControl.Api.Data;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WeddingControl.Api.Services; // 1. IMPORTANTE: Adicione o namespace dos seus serviços

// 1. CORREÇÃO DE DATA NO POSTGRES
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// 2. FORÇAR A PORTA 5000 (IMPORTANTE PARA O NGROK)
builder.WebHost.UseUrls("http://*:5000");

// =====================
// SERVICES (Configuração)
// =====================

// REGISTRO DO SERVIÇO DE E-MAIL (O que estava faltando!)
builder.Services.AddScoped<EmailService>();

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

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// =====================
// CONFIGURAÇÃO DO JWT
// =====================
// Adicionado o ! para garantir que a chave não é nula e tirar o Warning
var jwtKey = builder.Configuration["Jwt:Key"]!;
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

var app = builder.Build();

// =====================
// PIPELINE (Execução)
// =====================

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();