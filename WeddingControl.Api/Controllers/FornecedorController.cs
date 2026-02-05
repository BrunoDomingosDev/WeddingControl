using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeddingControl.Api.Data;
using WeddingControl.Api.Models;

namespace WeddingControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FornecedorController : ControllerBase
{
    private readonly AppDbContext _context;

    public FornecedorController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/fornecedor
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Fornecedor>>> Get()
    {
        return await _context.Fornecedores
            .Include(f => f.Categoria)
            .ToListAsync();
    }

    // GET: api/fornecedor/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Fornecedor>> GetById(int id)
    {
        var fornecedor = await _context.Fornecedores
            .Include(f => f.Categoria)
            .FirstOrDefaultAsync(f => f.Id == id);

        if (fornecedor == null)
            return NotFound();

        return fornecedor;
    }

    // POST: api/fornecedor
    [HttpPost]
    public async Task<ActionResult<Fornecedor>> Post(Fornecedor fornecedor)
    {
        // valida se categoria existe
        var categoriaExiste = await _context.Categorias
            .AnyAsync(c => c.Id == fornecedor.CategoriaId);

        if (!categoriaExiste)
            return BadRequest("Categoria inválida");

        _context.Fornecedores.Add(fornecedor);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = fornecedor.Id }, fornecedor);
    }

    // PUT: api/fornecedor/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Fornecedor fornecedor)
    {
        if (id != fornecedor.Id)
            return BadRequest();

        _context.Entry(fornecedor).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/fornecedor/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var fornecedor = await _context.Fornecedores.FindAsync(id);

        if (fornecedor == null)
            return NotFound();

        _context.Fornecedores.Remove(fornecedor);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
