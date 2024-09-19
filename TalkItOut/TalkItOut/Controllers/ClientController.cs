using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            .Select(x => new ClientGetDto
            {
                Id = x.Id,
                FirstName = x.FirstName,
                LastName = x.LastName,
                DateOfBirth = x.DateOfBirth
            })
            .ToList();

        response.Data = clients;

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById([FromBody] int id)
    {
        var response = new Response();

        var client = await _dataContext.Set<Client>()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (client == null)
        {
            response.AddError("Id", "Client could not be found.");
        }
        
        var clientDto = new ClientGetDto
            {
                Id = client.Id,
                FirstName = client.FirstName,
                LastName = client.LastName,
                DateOfBirth = client.DateOfBirth
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
            DateOfBirth = clientCreateDto.DateOfBirth
        };

        await _dataContext.Set<Client>().AddAsync(clientToCreate);
        await _dataContext.SaveChangesAsync();

        response.Data = new ClientGetDto
        {
            Id = clientToCreate.Id,
            FirstName = clientCreateDto.FirstName,
            LastName = clientCreateDto.LastName,
            DateOfBirth = clientCreateDto.DateOfBirth
        };

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] ClientCreateDto clientCreateDto)
    {
        var response = new Response();

        var client = await _dataContext.Set<Client>().FirstOrDefaultAsync(x => x.Id == id);

        if (client == null)
        {
            response.AddError("Id", "Client could not be found.");
        }
        
        client.FirstName = clientCreateDto.FirstName;
        client.LastName = clientCreateDto.LastName;
        client.DateOfBirth = clientCreateDto.DateOfBirth;
        
        await _dataContext.SaveChangesAsync();

        response.Data = new ClientGetDto
        {
            Id = client.Id,
            FirstName = client.FirstName,
            LastName = client.LastName,
            DateOfBirth = client.DateOfBirth
        };

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = new Response();

        var clientToDelete = await _dataContext.Set<Client>()
            .FirstOrDefaultAsync(x => x.Id == id);

        _dataContext.Set<Client>().Remove(clientToDelete);

        return Ok();
    }
}