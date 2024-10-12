using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalkItOut.Migrations
{
    /// <inheritdoc />
    public partial class GroupCRUD : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GroupId",
                schema: "domain",
                table: "Clients",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Group",
                schema: "domain",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Group", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Group_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clients_GroupId",
                schema: "domain",
                table: "Clients",
                column: "GroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Group_UserId",
                schema: "domain",
                table: "Group",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clients_Group_GroupId",
                schema: "domain",
                table: "Clients",
                column: "GroupId",
                principalSchema: "domain",
                principalTable: "Group",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clients_Group_GroupId",
                schema: "domain",
                table: "Clients");

            migrationBuilder.DropTable(
                name: "Group",
                schema: "domain");

            migrationBuilder.DropIndex(
                name: "IX_Clients_GroupId",
                schema: "domain",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "GroupId",
                schema: "domain",
                table: "Clients");
        }
    }
}
