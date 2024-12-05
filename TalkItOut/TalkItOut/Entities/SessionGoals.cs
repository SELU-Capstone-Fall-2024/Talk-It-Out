using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TalkItOut.Entities;

public class SessionGoals
{
    public int Id { get; set; }
    public int SessionId { get; set; }
    public Session Session { get; set; }
    public int GoalId { get; set; }
    public Goal Goal { get; set; }
    public int CorrectTrials { get; set; }
    public int TotalTrials { get; set; }
    public int Duration { get; set; }
}

public class SessionGoalGetDto
{
    public int Id { get; set; }
    public int SessionId { get; set; }
    public int GoalId { get; set; }
    public int CorrectTrials { get; set; }
    public int TotalTrials { get; set; }
    public int Duration { get; set; }
}

public class SessionGoalCreateDto
{
    public int SessionId { get; set; }
    public int GoalId { get; set; }
    public int CorrectTrials { get; set; }
    public int TotalTrials { get; set; }
    public int Duration { get; set; }
}

public class SessionGoalsConfiguration : IEntityTypeConfiguration<SessionGoals>
{
    public void Configure(EntityTypeBuilder<SessionGoals> builder)
    {
        builder.ToTable("SessionGoals", "domain");
    }
}