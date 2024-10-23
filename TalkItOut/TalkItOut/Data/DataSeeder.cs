using Microsoft.AspNetCore.Identity;

namespace TalkItOut.Entities;

public class DataSeeder
{
    private readonly DataContext _dataContext;
    private readonly UserManager<User> _userManager;

    public DataSeeder(DataContext dataContext, UserManager<User> userManager)
    {
        _dataContext = dataContext;
        _userManager = userManager;
    }
    
    public void Seed()
    { 
        SeedUsers().Wait();

        _dataContext.SaveChanges();
    }

    private async Task SeedUsers()
    {
        var user = new User
        {
            UserName = "JoeSmith1",
            NormalizedUserName = "JOESMITH1@DEVELOPMENT.COM",
            FirstName = "Joe",
            LastName = "Smith",
            EmailConfirmed = true,
            Email = "JOESMITH1@DEVELOPMENT.COM"
        };

        var existingUser = await _userManager.FindByEmailAsync(user.Email);

        if (existingUser == null)
        {
            await _userManager.CreateAsync(user, "Password123!");
        }
    }
}