using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace TalkItOut.Entities
{
    public class Goal
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        
        public string GoalInformation { get; set; }
        public int ClientId { get; set; }
        public User User { get; set; }
    }

    public class GoalGetDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        
        public string GoalInformation { get; set; }
        public int ClientId { get; set; }
        public User User { get; set; }
    }

    public class GoalCreateDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        
        public string GoalInformation { get; set; }
        public int ClientId { get; set; }
        public User User { get; set; }
    }

    public class GoalConfiguration : IEntityTypeConfiguration<Goal>
    {
        public void Configure(EntityTypeBuilder<Goal> builder)
        {
            builder.ToTable("Goals", "domain");
        }
    }
}