using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeddingControl.Api.Data;
using WeddingControl.Api.Models;

namespace WeddingControl.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagamentoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PagamentoController(AppDbContext context)
        {
            _context = context;
        }

        // 1. LISTAR TODAS (Geral, opcional)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pagamento>>> GetPagamentos()
        {
            return await _context.Pagamentos.ToListAsync();
        }

        // 2. LISTAR POR FORNECEDOR (Essencial para a sua aba de pagamentos)
        // Rota: api/Pagamento/PorFornecedor/5
        [HttpGet("PorFornecedor/{fornecedorId}")]
        public async Task<ActionResult<IEnumerable<Pagamento>>> GetPorFornecedor(int fornecedorId)
        {
            var pagamentos = await _context.Pagamentos
                .Where(p => p.FornecedorId == fornecedorId)
                .OrderBy(p => p.DataVencimento) // Ordena por data (Parcela 1, 2, 3...)
                .ToListAsync();

            return pagamentos;
        }

        // 3. CRIAR UM NOVO PAGAMENTO (Adicionar parcela)
        [HttpPost]
        public async Task<ActionResult<Pagamento>> PostPagamento(Pagamento pagamento)
        {
            _context.Pagamentos.Add(pagamento);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPagamentos", new { id = pagamento.Id }, pagamento);
        }

        // 4. ATUALIZAR (Marcar como pago ou editar valor)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPagamento(int id, Pagamento pagamento)
        {
            if (id != pagamento.Id)
            {
                return BadRequest();
            }

            _context.Entry(pagamento).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PagamentoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // 5. DELETAR (Remover uma parcela lançada errada)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePagamento(int id)
        {
            var pagamento = await _context.Pagamentos.FindAsync(id);
            if (pagamento == null)
            {
                return NotFound();
            }

            _context.Pagamentos.Remove(pagamento);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PagamentoExists(int id)
        {
            return _context.Pagamentos.Any(e => e.Id == id);
        }
    }
}