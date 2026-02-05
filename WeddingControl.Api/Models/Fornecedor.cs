using System;

namespace WeddingControl.Api.Models
{
    public class Fornecedor
    {
        public int Id { get; set; }

        public int CategoriaId { get; set; }
        public Categoria? Categoria { get; set; }

        public string Nome { get; set; } = string.Empty;
        public DateTime? DataFechamento { get; set; }

        public decimal ValorTotal { get; set; }
        public decimal ValorEntrada { get; set; }

        public bool Fechado { get; set; }
        public string? Observacao { get; set; }

        public decimal ValorRestante => ValorTotal - ValorEntrada;
    }
}
