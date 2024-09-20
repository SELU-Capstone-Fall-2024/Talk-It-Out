using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TalkItOut.Common;
using TalkItOut.Entities;

namespace TalkItOut.Controllers;

    [ApiController]
    [Route("/sessions")]
    public class SessionController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public SessionController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = new Response();

            var sessions = _dataContext.Set<Session>()
                .Select(x => new SessionGetDto
                {
                    Id = x.Id,
                    UserId = x.UserId,
                    DurationMinutes = x.DurationMinutes,
                    StartTime = x.StartTime,
                    EndTime = x.EndTime,
                    Clients = x.Clients.ToList()
                })
                .ToList();

            response.Data = sessions;

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromBody] int id)
        {
            var response = new Response();

            var session = await _dataContext.Set<Session>()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (session == null)
            {
                response.AddError("Id", "Session could not be found.");
            }

            var sessionDto = new SessionGetDto
            {
                Id = session.Id,
                UserId = session.UserId,
                DurationMinutes = session.DurationMinutes,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                Clients = session.Clients.ToList()
            };

            response.Data = sessionDto;

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SessionCreateDto sessionCreateDto)
        {
            var response = new Response();

            var sessionToCreate = new Session
            {
                UserId = sessionCreateDto.UserId,
                DurationMinutes = sessionCreateDto.DurationMinutes,
                StartTime = sessionCreateDto.StartTime,
                EndTime = sessionCreateDto.EndTime,
                Clients = sessionCreateDto.Clients.ToList()
            };

            await _dataContext.Set<Session>().AddAsync(sessionToCreate);
            await _dataContext.SaveChangesAsync();

            response.Data = new SessionGetDto
            {
                Id = sessionToCreate.Id,
                UserId = sessionToCreate.UserId,
                DurationMinutes = sessionToCreate.DurationMinutes,
                StartTime = sessionToCreate.StartTime,
                EndTime = sessionToCreate.EndTime,
                Clients = sessionToCreate.Clients
            };

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SessionUpdateDto sessionUpdateDto)
        {
            var response = new Response();

            var session = await _dataContext.Set<Session>().FirstOrDefaultAsync(x => x.Id == id);

            if (session == null)
            {
                response.AddError("Id", "Session could not be found.");
            }

            session.UserId = sessionUpdateDto.UserId;
            session.DurationMinutes = sessionUpdateDto.DurationMinutes;
            session.StartTime = sessionUpdateDto.StartTime;
            session.EndTime = sessionUpdateDto.EndTime;
            session.Clients = sessionUpdateDto.Clients;

            await _dataContext.SaveChangesAsync();

            response.Data = new SessionGetDto
            {
                Id = session.Id,
                UserId = session.UserId,
                DurationMinutes = session.DurationMinutes,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                Clients = session.Clients.ToList()
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = new Response();

            var sessionToDelete = await _dataContext.Set<Session>()
                .FirstOrDefaultAsync(x => x.Id == id);

            _dataContext.Set<Session>().Remove(sessionToDelete);

            return Ok();
        }
    }
