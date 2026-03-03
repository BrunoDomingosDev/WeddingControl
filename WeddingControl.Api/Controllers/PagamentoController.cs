using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeddingControl.Api.Data;
using WeddingControl.Api.Models;
using Microsoft.AspNetCore.Authorization;
using WeddingControl.Api.Services;

namespace WeddingControl.Api.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class PagamentoController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly EmailService _emailService;

    public PagamentoController(AppDbContext context, EmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pagamento>>> GetPagamentos()
    {
        return await _context.Pagamentos.ToListAsync();
    }

    [HttpGet("PorFornecedor/{fornecedorId}")]
    public async Task<ActionResult<IEnumerable<Pagamento>>> GetPorFornecedor(int fornecedorId)
    {
        return await _context.Pagamentos
            .Where(p => p.FornecedorId == fornecedorId)
            .OrderBy(p => p.DataVencimento)
            .ToListAsync();
    }

    // 3. CRIAR PAGAMENTO COM ANEXO E ENVIO DE TESTE
    [HttpPost]
    public async Task<ActionResult<Pagamento>> PostPagamento([FromForm] Pagamento pagamento, IFormFile? arquivo)
    {
        // 1. Lendo a decisão de envio do React
        bool deveEnviar = Request.Form["enviarEmail"] == "true";

        // Salva no Banco de Dados normalmente
        _context.Pagamentos.Add(pagamento);
        await _context.SaveChangesAsync();

        if (deveEnviar)
        {
            // Buscamos o fornecedor apenas para pegar o NOME dele para o texto do e-mail
            var fornecedor = await _context.Fornecedores.FindAsync(pagamento.FornecedorId);
            string nomeFornecedor = fornecedor?.Nome ?? "Fornecedor Teste";

            // --- CONFIGURAÇÃO DE TESTE (FORÇANDO PARA O SEU E-MAIL) ---
            string meuEmailDeTeste = "jackelinemarinho33@gmail.com";

            Console.WriteLine($"[TESTE] Iniciando envio para: {meuEmailDeTeste} | Anexo: {arquivo?.FileName ?? "Nenhum"}");

            byte[]? arquivoBytes = null;
            string? nomeArquivo = null;

            // Processa o arquivo se ele existir
            if (arquivo != null && arquivo.Length > 0)
            {
                using var ms = new MemoryStream();
                await arquivo.CopyToAsync(ms);
                arquivoBytes = ms.ToArray();
                nomeArquivo = arquivo.FileName;
            }

            try
            {
                // Chamando o serviço com o SEU e-mail de destino
                await _emailService.EnviarComprovanteAsync(
                    meuEmailDeTeste,
                    nomeFornecedor,
                    pagamento.Valor,
                    pagamento.DataVencimento.ToString("dd/MM/yyyy"),
                    arquivoBytes,
                    nomeArquivo
                );
                Console.WriteLine($"[SUCESSO] O e-mail de teste foi enviado para: {meuEmailDeTeste}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERRO SMTP] Falha no servidor de e-mail: {ex.Message}");
            }
        }

        return CreatedAtAction("GetPagamentos", new { id = pagamento.Id }, pagamento);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutPagamento(int id, Pagamento pagamento)
    {
        if (id != pagamento.Id) return BadRequest();
        _context.Entry(pagamento).State = EntityState.Modified;

        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException)
        {
            if (!PagamentoExists(id)) return NotFound();
            else throw;
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePagamento(int id)
    {
        var pagamento = await _context.Pagamentos.FindAsync(id);
        if (pagamento == null) return NotFound();
        _context.Pagamentos.Remove(pagamento);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool PagamentoExists(int id) => _context.Pagamentos.Any(e => e.Id == id);
}