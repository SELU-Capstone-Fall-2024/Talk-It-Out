using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalkItOut.Common;
using TalkItOut.Entities;

namespace TalkItOut.Controllers;

[ApiController]
[Route("/groups")]

public class GroupController : ControllerBase
{
    private readonly DataContext _dataContext;

    public GroupController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var response = new Response();

        var groups = _dataContext.Set<Group>()
            .Select(x => new GroupGetDto()
            {
                Id = x.Id,
                Clients = x.Clients.ToList()
            })
            .ToList();

        response.Data = groups;

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var response = new Response();

        var group = await _dataContext.Set<Group>()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (group == null)
        {
            response.AddError("Id", "Group could not be found.");
        }
        
        var groupDto = new GroupGetDto
            {
                Id = group.Id,
                Clients = group.Clients.ToList()
            };

        response.Data = groupDto;

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] GroupCreateDto groupCreateDto)
    {
        var response = new Response();

        var groupToCreate = new Group
        {
            Clients = groupCreateDto.Clients
        };

        await _dataContext.Set<Group>().AddAsync(groupToCreate);
        await _dataContext.SaveChangesAsync();

        response.Data = new GroupGetDto
        {
            Id = groupToCreate.Id,
            Clients = groupToCreate.Clients.ToList()
        };

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] GroupCreateDto groupCreateDto)
    {
        var response = new Response();

        var group = await _dataContext.Set<Group>().FirstOrDefaultAsync(x => x.Id == id);

        if (group == null)
        {
            response.AddError("Id", "Group could not be found.");
        }
        
        group.Clients = groupCreateDto.Clients;
        
        await _dataContext.SaveChangesAsync();

        response.Data = new GroupGetDto
        {
            Id = group.Id,
            Clients = group.Clients.ToList()
        };

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = new Response();

        var groupToDelete = await _dataContext.Set<Group>()
            .FirstOrDefaultAsync(x => x.Id == id);

        _dataContext.Set<Group>().Remove(groupToDelete);

        return Ok();
    }
}