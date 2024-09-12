﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TalkItOut.Common;
using TalkItOut.Entities;

namespace TalkItOut.Controllers;

[ApiController]
[Route("/api")]
public class UserController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;

    public UserController(
        UserManager<User> userManager,
        SignInManager<User> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [AllowAnonymous]
    [HttpPost("authenticate")]
    public async Task<IActionResult> Authenticate([FromBody] LoginDto dto)
    {
        var response = new Response();

        var user = await _userManager.FindByNameAsync(dto.UserName ?? "");
        
        if (user == null)
        {
            response.AddError(string.Empty, "Username or password is incorrect");
            return BadRequest(response);
        }

        var result = await _signInManager.PasswordSignInAsync(
            dto.UserName,
            dto.Password,
            false,
            false);

        if (!result.Succeeded)
        {
            response.AddError(string.Empty, "Username or password is incorrect");
            return BadRequest(response);
        }

        response.Data = result.Succeeded;
        return Ok(response);
    }
    
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _signInManager.SignOutAsync();
        return Ok();
    }
}

public class LoginDto
{
    public string UserName { get; set; }
    public string Password { get; set; }
}