namespace WeddingControl.Api.Models
{
    public class Convidados
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public int QuantidadePessoas { get; set; } // Verifique se não está QuantidadePessoa (singular)
    }
}
