using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace TalkItOut.Entities;

public class User : IdentityUser<int>
{
    public List<UserRole> UserRoles = new(); 
    public string FirstName { get; set; }   
    public string LastName { get; set; }
    public List<Session> Sessions { get; set; } = new();
    public List<Goal> Goals { get; set; } = new();
    public List<Group> Groups { get; set; } = new();
}

public class UserGetDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
}

public class UserCreateDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

public class UserUpdateDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? UserName { get; set; }
    public string? Email { get; set; }
}

public class PasswordUpdateDto
{
    public string CurrentPassword { get; set; }
    public string NewPassword { get; set; }
}