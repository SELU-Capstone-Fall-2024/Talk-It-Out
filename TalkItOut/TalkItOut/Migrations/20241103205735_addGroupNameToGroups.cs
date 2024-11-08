using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalkItOut.Migrations
{
    /// <inheritdoc />
    public partial class addGroupNameToGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GroupName",
                schema: "domain",
                table: "Group",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GroupName",
                schema: "domain",
                table: "Group");
        }
    }
}
