using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalkItOut.Migrations
{
    /// <inheritdoc />
    public partial class SessionNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Notes",
                schema: "domain",
                table: "Sessions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_GroupId",
                schema: "domain",
                table: "Sessions",
                column: "GroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_Sessions_Group_GroupId",
                schema: "domain",
                table: "Sessions",
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
                name: "FK_Sessions_Group_GroupId",
                schema: "domain",
                table: "Sessions");

            migrationBuilder.DropIndex(
                name: "IX_Sessions_GroupId",
                schema: "domain",
                table: "Sessions");

            migrationBuilder.DropColumn(
                name: "Notes",
                schema: "domain",
                table: "Sessions");
        }
    }
}
