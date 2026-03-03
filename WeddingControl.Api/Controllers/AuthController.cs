using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace WeddingControl.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Validação simples (Substitua pela sua lógica ou credenciais desejadas)
            bool isUserValid = (request.Usuario.ToLower() == "bruno" || request.Usuario.ToLower() == "jackeline");
            bool isPasswordValid = request.Senha == "casamento2026";

            if (isUserValid && isPasswordValid)
            {
                var token = GerarToken(request.Usuario);
                return Ok(new { token = token, mensagem = "Login efetuado com sucesso!" });
            }

            return Unauthorized(new { erro = "Usuário ou senha incorretos." });
        }

        private string GerarToken(string usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, usuario),
                    new Claim(ClaimTypes.Role, "Admin")
                }),
                // O token expira em 8 horas
                Expires = DateTime.UtcNow.AddHours(8),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }

    // Classe auxiliar para receber os dados do React
    public class LoginRequest
    {
        public string Usuario { get; set; }
        public string Senha { get; set; }
    }
}