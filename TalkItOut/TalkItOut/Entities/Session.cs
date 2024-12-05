using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace TalkItOut.Entities
{
    public class Session
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public int? GroupId { get; set; }
        public int? ClientId { get; set; }
        public Client? Client { get; set; }
        public User User { get; set; }
        public Group? Group { get; set; }
        public string Notes { get; set; }
    }

    public class SessionGetDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public int? GroupId { get; set; }
        public int? ClientId { get; set; }
        public string ClientName { get; set; }
        public GroupGetDto Group { get; set; }
        public string Notes { get; set; }
    }

    public class SessionCreateDto
    {
        public int UserId { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public int? GroupId { get; set; }
        public int? ClientId { get; set; }
        public string Notes { get; set; }

    }
    public class SessionUpdateDto
    {
        public int UserId { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public int? GroupId { get; set; }
        public int? ClientId { get; set; }
        public string Notes { get; set; }

    }

    public class SessionConfiguration : IEntityTypeConfiguration<Session>
    {
        public void Configure(EntityTypeBuilder<Session> builder)
        {
            builder.ToTable("Sessions", "domain");
        }
    }
}
