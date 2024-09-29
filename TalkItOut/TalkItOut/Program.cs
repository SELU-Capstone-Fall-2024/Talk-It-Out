﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using TalkItOut.Entities;
using TalkItOut.Extensions;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors();
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TalkItOutAPI", Version = "v1" });
});

builder.Services.AddAuthorization();
builder.Services.AddAuthentication().AddCookie(IdentityConstants.ApplicationScheme);

builder.Services.AddIdentityCore<User>()
    .AddEntityFrameworkStores<DataContext>()
    .AddApiEndpoints();

builder.Configuration.AddJsonFile("appsettings.json", optional: false);

builder.Services.AddDbContext<DataContext>(options => 
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbSet")));

WebApplication app = builder.Build();

//Don't forget to configure environments for builds :)
// if (app.Environment.IsDevelopment())
// {
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "TalkItOutAPI v1");
    options.RoutePrefix = string.Empty; // Set the Swagger UI at the root URL
});

app.ApplyMigrations();
// }

app.UseRouting();
app.UseHttpsRedirection();

app.MapControllers();

app.MapIdentityApi<User>();

app.Run();