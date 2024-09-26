using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalkItOut.Common;
using TalkItOut.Entities;

namespace TalkItOut.Controllers;

[ApiController]
[Route("/goals")]
public class GoalController : ControllerBase
{
    private readonly DataContext _dataContext;

    public GoalController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var response = new Response();

        var goals = _dataContext.Set<Goal>()
            .Select(x => new GoalGetDto
            {
                Id = x.Id,
                UserId = x.UserId,
                GoalInformation = x.GoalInformation,
                ClientId = x.ClientId
            })
            .ToList();

        response.Data = goals;

        return Ok(response);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromBody] int id)
    {
        var response = new Response();

        var goal = await _dataContext.Set<Goal>()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (goal == null)
        {
            response.AddError("Id", "Goal could not be found.");
        }

        var goalDto = new GoalGetDto
        {
            Id = goal.Id,
            UserId = goal.UserId,
            GoalInformation = goal.GoalInformation,
            ClientId = goal.ClientId
        };

        response.Data = goalDto;

        return Ok(response);
    }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] GoalCreateDto goalCreateDto)
    {
        var response = new Response();

        var goalToCreate = new Goal
        {
            UserId = goalCreateDto.UserId,
            GoalInformation = goalCreateDto.GoalInformation,
            ClientId = goalCreateDto.ClientId
        };

        await _dataContext.Set<Goal>().AddAsync(goalToCreate);
        await _dataContext.SaveChangesAsync();

        response.Data = new GoalGetDto
        {
            Id = goalToCreate.Id,
            UserId = goalToCreate.UserId,
            GoalInformation = goalCreateDto.GoalInformation,
            ClientId = goalCreateDto.ClientId
        };

        return Ok(response);
    }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] GoalCreateDto goalCreateDto)
    {
        var response = new Response();

        var goal = await _dataContext.Set<Goal>().FirstOrDefaultAsync(x => x.Id == id);

        if (goal == null)
        {
            response.AddError("Id", "Goal could not be found.");
        }

        goal.UserId = goalCreateDto.UserId;
        goal.GoalInformation = goalCreateDto.GoalInformation;
        goal.ClientId = goalCreateDto.ClientId;

        await _dataContext.SaveChangesAsync();

        response.Data = new GoalGetDto
        {
            Id = goal.Id,
            UserId = goal.UserId,
            GoalInformation = goalCreateDto.GoalInformation,
            ClientId = goal.ClientId
        };

        return Ok(response);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = new Response();

        var goalToDelete = await _dataContext.Set<Goal>()
            .FirstOrDefaultAsync(x => x.Id == id);

        _dataContext.Set<Goal>().Remove(goalToDelete);

        return Ok();
    }
}