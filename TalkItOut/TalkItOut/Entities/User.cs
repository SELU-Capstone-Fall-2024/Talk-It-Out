using Microsoft.AspNetCore.Identity;

namespace TalkItOut.Entities;

public class User : IdentityUser
{
    public int Id { get; set; }
    public string Name { get; set; }    
}

public class UserGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
}