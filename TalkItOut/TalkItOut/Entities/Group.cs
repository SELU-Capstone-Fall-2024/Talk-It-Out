using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TalkItOut.Entities;

public class Group
{
    public int Id { get; set; }
    public List<Client> Clients { get; set; } = new List<Client>();
    public User User { get; set; }
}

public class GroupGetDto
{
    public int Id { get; set; }
    public List<Client> Clients { get; set; } = new List<Client>();
}

public class GroupCreateDto
{
    public List<Client> Clients { get; set; } = new List<Client>();
}

public class GroupConfiguration : IEntityTypeConfiguration<Group>
{
    public void Configure(EntityTypeBuilder<Group> builder)
    {
        builder.ToTable("Group", "domain");
    }
}