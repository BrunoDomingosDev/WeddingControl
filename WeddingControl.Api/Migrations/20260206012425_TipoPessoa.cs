using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeddingControl.Api.Migrations
{
    /// <inheritdoc />
    public partial class TipoPessoa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TipoPessoa",
                table: "Fornecedores",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TipoPessoa",
                table: "Fornecedores");
        }
    }
}
