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
    public async Task<IActionResult> Authenticate([FromBody] UserLoginDto dto)
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
            response.AddError(string.Empty, "UserName or password is incorrect");
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
        var response = new Response();

        var usersGetDto = _dataContext.Set<User>()
            .Select(x => new UserGetDto
            {
                Id = x.Id,
                Name = x.Name,
                UserName = x.UserName,
            })
            .ToList();

        response.Data = usersGetDto;
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var response = new Response();

        var user = await _dataContext.Set<User>()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
        {
            response.AddError("Id", "User could not be found.");
        }

        var userGetDto = new UserGetDto()
        {
            Id = user.Id,
            Name = user.Name,
            UserName = user.UserName,
        };

        response.Data = userGetDto;

        return Ok(response);
    }

    [HttpPost("user")]
    public async Task<IActionResult> Create([FromBody] UserCreateDto userCreateDto)
    {
        var response = new Response();
        var userToCreate = new User
        {
            Name = userCreateDto.Name,
            UserName = userCreateDto.UserName,
            Password = userCreateDto.Password,
        };

        await _dataContext.Set<User>().AddAsync(userToCreate);
        await _dataContext.SaveChangesAsync();

        response.Data = new UserGetDto()
        {
            Id = userToCreate.Id,
            Name = userToCreate.Name,
            UserName = userToCreate.UserName,
        };

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UserCreateDto userCreateDto)
    {
        var response = new Response();
        var user = await _dataContext.Set<User>().FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
        {
            response.AddError("Id", "User could not be found.");
        }

        if (!string.IsNullOrEmpty(userCreateDto.Name))
        {
            user.Name = userCreateDto.Name;
        }

        if (!string.IsNullOrEmpty(userCreateDto.UserName))
        {
            user.UserName = userCreateDto.UserName;
        }
        
        if (!string.IsNullOrEmpty(userCreateDto.Password))
        {
            user.Password = userCreateDto.Password;
        }

        await _dataContext.SaveChangesAsync();

        response.Data = new UserGetDto()
        {
            Id = user.Id,
            Name = user.Name,
            UserName = user.UserName,
        };

        return Ok(response);
    }
    
    [HttpPut("users/{id}/password-update")]
    public async Task<IActionResult> UpdatePassword(int id, [FromBody] PasswordUpdateDto passwordUpdateDto)
    {
        var response = new Response();
        var user = await _dataContext.Set<User>().FirstOrDefaultAsync(x => x.Id == id);

        if (user == null)
        {
            response.AddError("Id", "User could not be found.");
            return NotFound(response); // Return NotFound if user does not exist
        }

        if (user.PasswordHash != passwordUpdateDto.CurrentPassword)
        {
            return Unauthorized(new { message = "Current password is incorrect." });
        }

        user.PasswordHash = passwordUpdateDto.NewPassword;
        await _dataContext.SaveChangesAsync();

        return Ok(new { message = "Password updated successfully." });
    }


    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = new Response();

        var userToDelete = await _dataContext.Set<User>()
            .FirstOrDefaultAsync(x => x.Id == id);

        _dataContext.Set<User>().Remove(userToDelete);

        return Ok();
    }
}