using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TalkItOut.Entities;

public class Group
{
    public int Id { get; set; }
    public List<Client> Clients { get; set; } = new List<Client>();
    public User User { get; set; }
    public int UserId { get; set; }
    public string GroupName { get; set; }
}

public class GroupGetDto
{
    public int Id { get; set; }
    public string GroupName { get; set; }

    public List<int> ClientIds { get; set; }
    public int UserId { get; set; }
    
}

public class GroupCreateDto
{
    public string GroupName { get; set; }

    public List<int> ClientIds { get; set; }
    public int UserId { get; set; }
}

public class GroupUpdateDto
{
    public string? GroupName { get; set; }

    public List<int>? ClientIds { get; set; }
}

public class GroupConfiguration : IEntityTypeConfiguration<Group>
{
    public void Configure(EntityTypeBuilder<Group> builder)
    {
        builder.ToTable("Group", "domain");
    }
}