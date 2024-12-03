using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TalkItOut.Entities;

public class Client
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTimeOffset DateOfBirth { get; set; }
    public int UserId { get; set; }
    public User User { get; set; }
    public int? GroupId { get; set; }
    public Group Group { get; set; }
    public List<Goal> Goals { get; set; }
    public List<Session> Sessions { get; set; }
}

public class ClientGetDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTimeOffset DateOfBirth { get; set; }
    public List<GoalGetDto> Goals { get; set; }
    public int? GroupId { get; set; }
}

public class ClientCreateDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTimeOffset DateOfBirth { get; set; }
    public int UserId { get; set; }
    
}

public class ClientUpdateDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTimeOffset DateOfBirth { get; set; }
    public int UserId { get; set; }
    public bool IsDateOfBirthUpdated { get; set; }
    
}


public class ClientConfiguration : IEntityTypeConfiguration<Client>
{
    public void Configure(EntityTypeBuilder<Client> builder)
    {
        builder.ToTable("Clients", "domain");
        
        builder.HasMany(c => c.Goals)
            .WithOne(g => g.Client)
            .HasForeignKey(g => g.ClientId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.HasMany(c => c.Sessions)
            .WithOne(s => s.Client)
            .HasForeignKey(s => s.ClientId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}