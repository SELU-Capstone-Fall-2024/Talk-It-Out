using Microsoft.AspNetCore.Identity;

namespace TalkItOut.Entities;

public class Role : IdentityRole<int>
{
    public List<UserRole> UserRoles { get; set; } = new();
}

