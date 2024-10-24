using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalkItOut.Migrations
{
    /// <inheritdoc />
    public partial class addedClientToGoal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Goals_ClientId",
                schema: "domain",
                table: "Goals",
                column: "ClientId");

            migrationBuilder.AddForeignKey(
                name: "FK_Goals_Clients_ClientId",
                schema: "domain",
                table: "Goals",
                column: "ClientId",
                principalSchema: "domain",
                principalTable: "Clients",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Goals_Clients_ClientId",
                schema: "domain",
                table: "Goals");

            migrationBuilder.DropIndex(
                name: "IX_Goals_ClientId",
                schema: "domain",
                table: "Goals");
        }
    }
}
