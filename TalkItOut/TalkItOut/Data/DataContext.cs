using System.Reflection;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace TalkItOut.Entities;

public class DataContext : IdentityDbContext<User, Role, int>
{
    public DataContext(DbContextOptions<DataContext> options)
    : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(typeof(DataContext).GetTypeInfo().Assembly);
        
        foreach (var relationship in builder.Model.GetEntityTypes().Where(e => !e.IsOwned())
                     .SelectMany(e => e.GetForeignKeys()))
        {
            relationship.DeleteBehavior = DeleteBehavior.Restrict;
        }
    }
}