using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TalkItOut.Migrations
{
    /// <inheritdoc />
    public partial class AddSessionGoals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SessionGoals",
                schema: "domain",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SessionId = table.Column<int>(type: "int", nullable: false),
                    GoalId = table.Column<int>(type: "int", nullable: false),
                    CorrectTrials = table.Column<int>(type: "int", nullable: false),
                    TotalTrials = table.Column<int>(type: "int", nullable: false),
                    Duration = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SessionGoals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SessionGoals_Goals_GoalId",
                        column: x => x.GoalId,
                        principalSchema: "domain",
                        principalTable: "Goals",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SessionGoals_Sessions_SessionId",
                        column: x => x.SessionId,
                        principalSchema: "domain",
                        principalTable: "Sessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SessionGoals_GoalId",
                schema: "domain",
                table: "SessionGoals",
                column: "GoalId");

            migrationBuilder.CreateIndex(
                name: "IX_SessionGoals_SessionId",
                schema: "domain",
                table: "SessionGoals",
                column: "SessionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SessionGoals",
                schema: "domain");
        }
    }
}
