using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TalkItOut.Entities
{
    public class Session
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int DurationMinutes { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public List<int> Clients { get; set; }

    }

    public class SessionGetDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int DurationMinutes { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public List<int> Clients { get; set; }
    }

    public class SessionCreateDto
    {
        public int UserId { get; set; }
        public int DurationMinutes { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public List<int> Clients { get; set; }
    }

    public class SessionUpdateDto
    {
        public int UserId { get; set; }
        public int DurationMinutes { get; set; }
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
        public List<int> Clients { get; set; }
    }

    public class SessionConfiguration : IEntityTypeConfiguration<Session>
    {
        public void Configure(EntityTypeBuilder<Session> builder)
        {
            builder.ToTable("Sessions", "domain");
        }
    }
}
