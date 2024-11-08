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
                GroupName = x.GroupName,
                ClientIds = x.Clients.Select(y => y.Id).ToList(),
                UserId = x.UserId,
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
            .Include(x => x.Clients)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (group == null)
        {
            response.AddError("Id", "Group could not be found.");
            return NotFound(response);
        }
        
        var groupDto = new GroupGetDto
            {
                Id = group.Id, 
                GroupName = group.GroupName,
                ClientIds = group.Clients.Select(y => y.Id).ToList(),
                UserId = group.UserId,
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
            GroupName = groupCreateDto.GroupName,
            UserId = groupCreateDto.UserId,
        };

        await _dataContext.Set<Group>().AddAsync(groupToCreate);
        await _dataContext.SaveChangesAsync();
        
        await _dataContext.Set<Client>()
            .Where(x => groupCreateDto.ClientIds.Contains(x.Id))
            .ForEachAsync(x => x.GroupId = groupToCreate.Id);
        
        await _dataContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = groupToCreate.Id }, new GroupGetDto
            {
                Id = groupToCreate.Id,
                GroupName = groupToCreate.GroupName,
                ClientIds = groupToCreate.Clients.Select(x => x.Id).ToList(),
                UserId = groupToCreate.UserId,
            });    
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] GroupUpdateDto groupUpdateDto)
    {
        var response = new Response();

        var group = await _dataContext.Set<Group>()
            .Include(g => g.Clients)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (group == null)
        {
            response.AddError("Id", "Group could not be found.");
            return NotFound(response);
        }

        if (groupUpdateDto.ClientIds.Any())
        {
            var currentClientIds = group.Clients.Select(c => c.Id).ToHashSet();
            var newClientIds = groupUpdateDto.ClientIds.ToHashSet();

            var clientsToAdd = await _dataContext.Set<Client>()
                .Where(c => newClientIds.Contains(c.Id) && c.GroupId != group.Id)
                .ToListAsync();
            foreach (var client in clientsToAdd)
            {
                client.GroupId = group.Id;
            }

            var clientsToRemove = await _dataContext.Set<Client>()
                .Where(c => currentClientIds.Contains(c.Id) && !newClientIds.Contains(c.Id))
                .ToListAsync();
            foreach (var client in clientsToRemove)
            {
                client.GroupId = null;
            }
        }

        if (groupUpdateDto.GroupName != null)
        {
            group.GroupName = groupUpdateDto.GroupName;
        }

        await _dataContext.SaveChangesAsync();

        response.Data = new GroupGetDto
        {
            Id = group.Id,
            GroupName = group.GroupName,
            ClientIds = group.Clients.Select(x => x.Id).ToList(),
            UserId = group.UserId,
        };

        return Ok(response);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = new Response();

        var groupToDelete = await _dataContext.Set<Group>()
            .FirstOrDefaultAsync(x => x.Id == id);
        if (groupToDelete == null)
        {
            response.AddError("Id", "Group could not be found.");
            return NotFound(response);
        }

        _dataContext.Set<Group>().Remove(groupToDelete);
        await _dataContext.SaveChangesAsync();

        return Ok(new { message = "Group deleted successfully." });
    }
}