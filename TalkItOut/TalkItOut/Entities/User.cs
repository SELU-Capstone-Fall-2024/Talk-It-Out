using Microsoft.AspNetCore.Identity;

namespace TalkItOut.Entities;

public class User : IdentityUser
{
    public int Id { get; set; }
    public string Name { get; set; }    
    public List<Session> Sessions { get; set; } = new();
    public List<Goal> Goals { get; set; } = new();
}

public class UserGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
}