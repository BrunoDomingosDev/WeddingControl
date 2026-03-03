using Microsoft.EntityFrameworkCore;
using WeddingControl.Api.Models;

namespace WeddingControl.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Fornecedor> Fornecedores { get; set; }
        public DbSet<Pagamento> Pagamentos { get; set; }
        public DbSet<Convidados> Convidados { get; set; }
    }
}
