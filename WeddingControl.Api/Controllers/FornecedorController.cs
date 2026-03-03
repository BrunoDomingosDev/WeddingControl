using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeddingControl.Api.Data;
using WeddingControl.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace WeddingControl.Api.Controllers; // Apenas um namespace e com ponto e vírgula!

[Authorize] // <--- A MÁGICA DA SEGURANÇA AQUI
[ApiController]
[Route("api/[controller]")]
public class FornecedorController : ControllerBase
{
    private readonly AppDbContext _context;

    public FornecedorController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/Fornecedor
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Fornecedor>>> GetFornecedores()
    {
        return await _context.Fornecedores
            .Include(f => f.Categoria) // Traz o nome da categoria junto
            .ToListAsync();
    }

    // GET: api/Fornecedor/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Fornecedor>> GetFornecedor(int id)
    {
        var fornecedor = await _context.Fornecedores.FindAsync(id);

        if (fornecedor == null)
        {
            return NotFound();
        }

        return fornecedor;
    }

    // POST: api/Fornecedor
    [HttpPost]
    public async Task<ActionResult<Fornecedor>> PostFornecedor(Fornecedor fornecedor)
    {
        // Opcional: Se quiser garantir maiúsculo, descomente a linha abaixo
        // fornecedor.TipoPessoa = fornecedor.TipoPessoa?.ToUpper(); 

        _context.Fornecedores.Add(fornecedor);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetFornecedor", new { id = fornecedor.Id }, fornecedor);
    }

    // PUT: api/Fornecedor/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutFornecedor(int id, Fornecedor fornecedor)
    {
        if (id != fornecedor.Id)
        {
            return BadRequest();
        }

        _context.Entry(fornecedor).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!FornecedorExists(id))
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

    // DELETE: api/Fornecedor/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFornecedor(int id)
    {
        var fornecedor = await _context.Fornecedores.FindAsync(id);
        if (fornecedor == null)
        {
            return NotFound();
        }

        _context.Fornecedores.Remove(fornecedor);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool FornecedorExists(int id)
    {
        return _context.Fornecedores.Any(e => e.Id == id);
    }
}