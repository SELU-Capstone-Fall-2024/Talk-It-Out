﻿using System.Runtime.InteropServices.JavaScript;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TalkItOut.Common;
using TalkItOut.Entities;

namespace TalkItOut.Controllers;

[ApiController]
[Route("/clients")]
public class ClientController : ControllerBase
{
    private readonly DataContext _dataContext;

    public ClientController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var response = new Response();

        var clients = _dataContext.Set<Client>()
            .Include(x => x.Goals)
            .Select(x => new ClientGetDto
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                DateOfBirth = x.DateOfBirth,
                Goals = _dataContext.Set<Goal>().Where(y => y.ClientId == x.Id).Select(y => new GoalGetDto
                {
                    Id = y.Id,
                    Information = y.Information,
                    ClientId = y.ClientId
                }).ToList(),
                GroupId = x.GroupId,
            })
            .ToList();

        response.Data = clients;

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var response = new Response();

        var client = await _dataContext.Set<Client>()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (client == null)
        {
            response.AddError("Id", "Client could not be found.");
            return NotFound(response);
        }
        
        var clientDto = new ClientGetDto
            {
                Id = client.Id,
                FirstName = client.FirstName,
                LastName = client.LastName,
                DateOfBirth = client.DateOfBirth,
                GroupId = client.GroupId,
            };

        response.Data = clientDto;

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ClientCreateDto clientCreateDto)
    {
        var response = new Response();

        var clientToCreate = new Client
        {
            FirstName = clientCreateDto.FirstName,
            LastName = clientCreateDto.LastName,
            DateOfBirth = clientCreateDto.DateOfBirth,
            UserId = clientCreateDto.UserId
        };

        await _dataContext.Set<Client>().AddAsync(clientToCreate);
        await _dataContext.SaveChangesAsync();
        
        return CreatedAtAction(nameof(GetById), new { id = clientToCreate.Id }, new ClientGetDto
        {
            Id = clientToCreate.Id,
            FirstName = clientCreateDto.FirstName,
            LastName = clientCreateDto.LastName,
            DateOfBirth = clientCreateDto.DateOfBirth,
        });    
    }

    //for some reason, this is requiring first and last name to update, which will need to be fixed in the future
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ClientUpdateDto clientUpdateDto)
    {
        var response = new Response();

        var client = await _dataContext.Set<Client>().FirstOrDefaultAsync(x => x.Id == id);

        if (client == null)
        {
            response.AddError("Id", "Client could not be found.");
        }

        if (!string.IsNullOrEmpty(clientUpdateDto.FirstName))
        {
            client.FirstName = clientUpdateDto.FirstName;
        }
        if (!string.IsNullOrEmpty(clientUpdateDto.LastName))
        {
            client.LastName = clientUpdateDto.LastName;
        }
        if (!(clientUpdateDto.DateOfBirth == null))
        {
            client.DateOfBirth = clientUpdateDto.DateOfBirth;
        }

        if (clientUpdateDto.UserId > 0)
        {
            client.UserId = clientUpdateDto.UserId;
        }

        await _dataContext.SaveChangesAsync();

        response.Data = new ClientGetDto 
        {
            Id = client.Id,
            FirstName = client.FirstName,
            LastName = client.LastName,
            DateOfBirth = client.DateOfBirth,
            GroupId = client.GroupId,
        };

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = new Response();
        
        var sessionsToDelete = await _dataContext.Set<Session>().Where(x => x.ClientId == id).ToListAsync();
        
        var goalsToDelete = await _dataContext.Set<Goal>().Where(x => x.ClientId == id).ToListAsync();

        var clientToDelete = await _dataContext.Set<Client>()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (!(sessionsToDelete.IsNullOrEmpty()))
        {
            _dataContext.Set<Session>().RemoveRange(sessionsToDelete);
        }

        if (!(goalsToDelete.IsNullOrEmpty()))
        {
            _dataContext.Set<Goal>().RemoveRange(goalsToDelete);
        }

        if (clientToDelete == null)
        {
            response.AddError("Id", "Client could not be found.");
            return NotFound(response);
        }

        _dataContext.Set<Client>().Remove(clientToDelete);

        await _dataContext.SaveChangesAsync();

        return Ok(new { message = "Client deleted successfully." });
    }

}