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
                .Include(x => x.Client)
                .Select(x => new SessionGetDto
                {
                    Id = x.Id,
                    UserId = x.UserId,
                    DurationMinutes = x.DurationMinutes,
                    StartTime = x.StartTime,
                    EndTime = x.EndTime,
                    GroupId = x.GroupId,
                    ClientId = x.ClientId,
                    ClientName = x.Client.FirstName + " " + x.Client.LastName
                })
                .ToList();

            response.Data = sessions;

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = new Response();

            var session = await _dataContext.Set<Session>()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (session == null)
            {
                response.AddError("Id", "Session could not be found.");
                return NotFound(response);
            }

            response.Data = new SessionGetDto
            {
                Id = session.Id,
                UserId = session.UserId,
                DurationMinutes = session.DurationMinutes,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                GroupId = session.GroupId,
                ClientId = session.ClientId
            };
            
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SessionCreateDto sessionCreateDto)
        {
            var response = new Response();

            var sessionToCreate = new Session
            {
                UserId = sessionCreateDto.UserId,
                StartTime = sessionCreateDto.StartTime,
                EndTime = sessionCreateDto.EndTime,
                GroupId = sessionCreateDto.GroupId,
                ClientId = sessionCreateDto.ClientId 
            };
            // if (sessionCreateDto.StartTime < sessionCreateDto.EndTime)
            // {
            //     sessionToCreate.DurationMinutes = (int)(sessionCreateDto.EndTime - sessionCreateDto.StartTime).TotalMinutes;
            // }
            // else
            // {
            //     response.AddError("Duration", "StartTime must be earlier than EndTime.");
            //     return BadRequest(response);
            // }

            await _dataContext.Set<Session>().AddAsync(sessionToCreate);
            await _dataContext.SaveChangesAsync();

            
            return CreatedAtAction(nameof(GetById), new { id = sessionToCreate.Id }, new SessionGetDto
            {
                Id = sessionToCreate.Id,
                UserId = sessionToCreate.UserId,
                DurationMinutes = sessionToCreate.DurationMinutes,
                StartTime = sessionToCreate.StartTime,
                EndTime = sessionToCreate.EndTime,
                GroupId = sessionToCreate.GroupId,
                ClientId = sessionToCreate.ClientId 
            });        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] SessionUpdateDto sessionUpdateDto)
        {
            var response = new Response();

            var session = await _dataContext.Set<Session>().FirstOrDefaultAsync(x => x.Id == id);

            if (session == null)
            {
                response.AddError("Id", "Session could not be found.");
                return NotFound(response);
            }

            if (sessionUpdateDto.UserId > 0)
            {
                session.UserId = sessionUpdateDto.UserId;
            }
            if (sessionUpdateDto.StartTimeChanged | sessionUpdateDto.EndTimeChanged)
            {
                if (session.StartTime < session.EndTime)
                {
                    session.DurationMinutes = (int)(session.EndTime - session.StartTime).TotalMinutes;
                }
                else
                {
                    response.AddError("Duration", "StartTime must be earlier than EndTime.");
                    return BadRequest(response);
                }
            }
            if(sessionUpdateDto.StartTimeChanged)
            {
                session.StartTime = sessionUpdateDto.StartTime;
            }
            if(sessionUpdateDto.EndTimeChanged)
            {
                session.EndTime = sessionUpdateDto.EndTime;
            }
            if(sessionUpdateDto.GroupId > 0)
            {
                session.GroupId = sessionUpdateDto.GroupId;
            }
            if(sessionUpdateDto.ClientId > 0)
            {
                session.ClientId = sessionUpdateDto.ClientId;
            }

            await _dataContext.SaveChangesAsync();

            response.Data = new SessionGetDto
            {
                Id = session.Id,
                UserId = session.UserId,
                DurationMinutes = session.DurationMinutes,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                GroupId = session.GroupId,
                ClientId = session.ClientId
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = new Response();

            var sessionToDelete = await _dataContext.Set<Session>()
                .FirstOrDefaultAsync(x => x.Id == id);
            
            if (sessionToDelete == null)
            {
                response.AddError("Id", "Session could not be found.");
                return NotFound(response);
            }
            
            _dataContext.Set<Session>().Remove(sessionToDelete);
            await _dataContext.SaveChangesAsync();

            return Ok(new { message = "Session deleted successfully." });
        }
    }
