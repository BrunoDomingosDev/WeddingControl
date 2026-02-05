using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeddingControl.Api.Data;
using WeddingControl.Api.Models;

namespace WeddingControl.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriaController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriaController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/categoria
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Categoria>>> Get()
    {
        return await _context.Categorias.ToListAsync();
    }

    // GET: api/categoria/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Categoria>> GetById(int id)
    {
        var categoria = await _context.Categorias.FindAsync(id);

        if (categoria == null)
            return NotFound();

        return categoria;
    }

    // POST: api/categoria
    [HttpPost]
    public async Task<ActionResult<Categoria>> Post(Categoria categoria)
    {
        _context.Categorias.Add(categoria);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, categoria);
    }

    // PUT: api/categoria/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Categoria categoria)
    {
        if (id != categoria.Id)
            return BadRequest();

        _context.Entry(categoria).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/categoria/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var categoria = await _context.Categorias.FindAsync(id);

        if (categoria == null)
            return NotFound();

        _context.Categorias.Remove(categoria);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
