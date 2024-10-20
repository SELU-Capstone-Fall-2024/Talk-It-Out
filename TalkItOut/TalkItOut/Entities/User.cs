using Microsoft.AspNetCore.Identity;

namespace TalkItOut.Entities;

public class User : IdentityUser<int>
{
    public int Id { get; set; }
    public List<UserRole> UserRoles = new(); 
    public string Name { get; set; }   
    public string UserName { get; set; }

    public List<Session> Sessions { get; set; } = new();
    public List<Goal> Goals { get; set; } = new();
    public string Password { get; set; }  
}

public class UserGetDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string UserName { get; set; }
}

public class UserCreateDto
{
    public string Name { get; set; }
    public string UserName { get; set; }
    public string Password { get; set; }
}

public class PasswordUpdateDto
{
    public string CurrentPassword { get; set; }
    public string NewPassword { get; set; }
}

public class UserLoginDto
{
    public string UserName { get; set; }
    public string Password { get; set; }
}