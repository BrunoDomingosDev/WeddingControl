using System;
using System.Text.Json.Serialization; // Importante para evitar loops no JSON
using System.ComponentModel.DataAnnotations.Schema; // <-- ADICIONE ESTA LINHA

namespace WeddingControl.Api.Models
{
    public class Pagamento
    {
        public int Id { get; set; }

        public string Descricao { get; set; } = string.Empty; // Ex: "Parcela 1/10", "Entrada"

        public decimal Valor { get; set; }

        public DateTime DataVencimento { get; set; }

        public bool Pago { get; set; } // Checkbox: Pagou ou não?

        public DateTime? DataPagamento { get; set; } // Data real que o pagamento ocorreu

        // --- RELACIONAMENTO (Chave Estrangeira) ---
        public int FornecedorId { get; set; }

        [JsonIgnore] // Evita que ao buscar um pagamento, ele traga o fornecedor, que traz os pagamentos de volta (Loop infinito)
        public Fornecedor? Fornecedor { get; set; }

        [NotMapped] // Isso impede que o Entity Framework tente criar uma coluna no banco
        public bool EnviarEmail { get; set; }
    }
}