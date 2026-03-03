using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WeddingControl.Api.Data;
using WeddingControl.Api.Models;
using Microsoft.AspNetCore.Authorization;

namespace WeddingControl.Api.Controllers;

[Authorize] // <--- A tag de segurança para proteger a lista de convidados!
[ApiController]
[Route("api/[controller]")]
public class ConvidadosController : ControllerBase
{
    private readonly AppDbContext _context;

    public ConvidadosController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/convidados
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Convidados>>> Get()
    {
        return await _context.Convidados.ToListAsync();
    }

    // GET: api/convidados/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Convidados>> GetById(int id)
    {
        var convidados = await _context.Convidados.FindAsync(id);

        if (convidados == null)
            return NotFound();

        return convidados;
    }

    // POST: api/convidados
    [HttpPost]
    public async Task<ActionResult<Convidados>> Post(Convidados convidados)
    {
        _context.Convidados.Add(convidados);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = convidados.Id }, convidados);
    }

    // PUT: api/convidados/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Convidados convidados)
    {
        if (id != convidados.Id)
            return BadRequest();

        _context.Entry(convidados).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/convidados/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var convidados = await _context.Convidados.FindAsync(id);

        if (convidados == null)
            return NotFound();

        _context.Convidados.Remove(convidados);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}