using System.Net;
using System.Net.Mail;
using System.Net.Mime;

namespace WeddingControl.Api.Services;

public class EmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    // Adicionamos os parâmetros opcionais: arquivo (byte[]) e nome do arquivo
    public async Task EnviarComprovanteAsync(string emailDestino, string nomeFornecedor, decimal valor, string dataVencimento, byte[]? anexoBytes = null, string? nomeAnexo = null)
    {
        var settings = _config.GetSection("EmailSettings");

        var mailMessage = new MailMessage
        {
            From = new MailAddress(settings["SenderEmail"]!, settings["SenderName"]),
            Subject = $"Comprovante de Pagamento - {settings["SenderName"]}",
            Body = $@"
                <div style='font-family: sans-serif; border: 1px solid #c2a36b; padding: 20px;'>
                    <h2 style='color: #1a1a1a;'>Olá, {nomeFornecedor}!</h2>
                    <p>Informamos que um novo pagamento foi registrado por <strong>Bruno e Jackeline</strong>.</p>
                    <hr style='border: 0; border-top: 1px solid #eee;' />
                    <p><strong>Valor:</strong> R$ {valor:N2}</p>
                    <p><strong>Data de vencimento:</strong> {dataVencimento}</p>
                    <hr style='border: 0; border-top: 1px solid #eee;' />
                    <p style='font-size: 12px; color: #888;'>Este é um e-mail automático. Não é necessário responder.</p>
                </div>",
            IsBodyHtml = true
        };

        mailMessage.To.Add(emailDestino);

        // LÓGICA DO ANEXO: Se houver um arquivo, adicionamos à mensagem
        if (anexoBytes != null && anexoBytes.Length > 0 && !string.IsNullOrEmpty(nomeAnexo))
        {
            var stream = new MemoryStream(anexoBytes);
            var attachment = new Attachment(stream, nomeAnexo, MediaTypeNames.Application.Octet);
            mailMessage.Attachments.Add(attachment);
        }

        using var smtpClient = new SmtpClient(settings["SmtpServer"])
        {
            Port = int.Parse(settings["Port"]!),
            Credentials = new NetworkCredential(settings["SenderEmail"], settings["Password"]),
            EnableSsl = true,
        };

        await smtpClient.SendMailAsync(mailMessage);
    }
}