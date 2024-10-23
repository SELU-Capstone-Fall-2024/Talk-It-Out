using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalkItOut.Entities;
using Response = TalkItOut.Common.Response;

namespace TalkItOut.Controllers;

[ApiController]
[Route("/users")]
public class UserController : ControllerBase
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly DataContext _dataContext;

    public UserController(
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        DataContext dataContext)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _dataContext = dataContext;
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
            return NotFound(response);
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

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var response = new Response
        {
            Data = await _userManager.Users
                .Select(x => new UserGetDto
                {
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    UserName = x.UserName,
                    Email = x.Email,
                })
                .ToListAsync()
        };
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var response = new Response();

        var user = await _userManager.FindByIdAsync(id.ToString());

        if (user == null)
        {
            response.AddError("Id", "User could not be found.");
            return NotFound(response);
        }

        response.Data = new UserGetDto()
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
        };

        return Ok(response);
    }

    [HttpPost("user")]
    public async Task<IActionResult> Create([FromBody] UserCreateDto userCreateDto)
    {
        var response = new Response();

        var existingUser = await _userManager.FindByNameAsync(userCreateDto.UserName);

        if (existingUser != null)
        {
            response.AddError("UserName", "User already exists.");
            return BadRequest(response);
        }

        var userToCreate = new User
        {
            FirstName = userCreateDto.FirstName,
            LastName = userCreateDto.LastName,
            UserName = userCreateDto.UserName,
            Email = userCreateDto.Email
        };

        userToCreate.NormalizedUserName = _userManager.NormalizeName(userCreateDto.UserName);
        userToCreate.NormalizedEmail = _userManager.NormalizeEmail(userCreateDto.Email);

        var result = await _userManager.CreateAsync(userToCreate, userCreateDto.Password);

        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                response.AddError(error.Code, error.Description);
            }
            return BadRequest(response);
        }

        await _dataContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = userToCreate.Id }, new UserGetDto
        {
            FirstName = userCreateDto.FirstName,
            LastName = userToCreate.LastName,
            UserName = userToCreate.UserName,
            Email = userToCreate.Email
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDto userUpdateDto)
    {
        var response = new Response();
        var user = await _userManager.FindByIdAsync(id.ToString());

        if (user == null)
        {
            response.AddError("Id", "User could not be found.");
            return NotFound(response);
        }

        if (!string.IsNullOrEmpty(userUpdateDto.FirstName))
        {
            user.FirstName = userUpdateDto.FirstName;
        }

        if (!string.IsNullOrEmpty(userUpdateDto.LastName))
        {
            user.LastName = userUpdateDto.LastName;
        }

        if (!string.IsNullOrEmpty(userUpdateDto.UserName))
        {
            user.UserName = userUpdateDto.UserName;
        }

        if (!string.IsNullOrEmpty(userUpdateDto.Email))
        {
            user.Email = userUpdateDto.Email;
        }

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            response.AddError("Update", "User update failed.");
            return BadRequest(response);
        }

        await _dataContext.SaveChangesAsync();

        return Ok(new UserGetDto
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
        });
    }
    
    [HttpPut("users/{id}/password-update")]
    public async Task<IActionResult> UpdatePassword(int id, [FromBody] PasswordUpdateDto passwordUpdateDto)
    {
        var response = new Response();
        var user = await _userManager.FindByIdAsync(id.ToString());

        if (user == null)
        {
            response.AddError("Id", "User could not be found.");
            return NotFound(response);
        }

        var passwordCheck = await _userManager.CheckPasswordAsync(user, passwordUpdateDto.CurrentPassword);


        if (!passwordCheck)
        {
            response.AddError("CurrentPassword", "Current password is incorrect.");
            return Unauthorized(response);
        }

        var result = await _userManager.ChangePasswordAsync(user, passwordUpdateDto.CurrentPassword, passwordUpdateDto.NewPassword);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                response.AddError(error.Code, error.Description);
            }

            return BadRequest(response);
        }

        await _dataContext.SaveChangesAsync();

        return Ok(new { message = "Password updated successfully." });
    }


    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = new Response();

        var userToDelete = await _userManager.FindByIdAsync(id.ToString());

        if (userToDelete == null)
        {
            response.AddError("Id", "User could not be found.");
            return NotFound(response);
        }
        var result = await _userManager.DeleteAsync(userToDelete);
        if (!result.Succeeded)
        {
            response.AddError("Delete", "User delete failed.");
            return BadRequest(response);
        }
        return Ok(new { message = "User deleted successfully." });
    }
}

public class LoginDto
{
    public string UserName { get; set; }
    public string Password { get; set; }
}