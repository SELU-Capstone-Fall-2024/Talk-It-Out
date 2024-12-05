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
                .Include(x => x.Group)
                .ThenInclude(x => x.Clients)
                .ThenInclude(x => x.Goals)
                .Select(x => new SessionGetDto
                {
                    Id = x.Id,
                    UserId = x.UserId,
                    StartTime = x.StartTime,
                    EndTime = x.EndTime,
                    GroupId = x.GroupId,
                    ClientId = x.ClientId,
                    ClientName = x.Client.FirstName + " " + x.Client.LastName,
                    Notes = x.Notes,
                    Group = new GroupGetDto
                    {
                        GroupName = x.Group.GroupName,
                        Clients = x.Group.Clients.Select(y => new ClientGetDto
                        {
                            Id = y.Id,
                            DateOfBirth = y.DateOfBirth,
                            FirstName = y.FirstName,
                            LastName = y.LastName,
                            Goals = y.Goals.Select(z => new GoalGetDto
                            {
                                Id = z.Id,
                                Information = z.Information
                            }).ToList()
                        }).ToList()
                    },
                })
                .ToList();

            response.Data = sessions;

            return Ok(response);
        }

        [HttpGet("todays-sessions")]
        public async Task<IActionResult> GetTodaysSessions()
        {
            var response = new Response();
            
            var sessions = _dataContext.Set<Session>()
                .Include(x => x.Client)
                .Include(x => x.Group)
                .ThenInclude(x => x.Clients)
                .Where(x => x.StartTime.Date.Equals(DateTime.Today))
                .Select(x => new SessionGetDto
                {
                    Id = x.Id,
                    UserId = x.UserId,
                    StartTime = x.StartTime,
                    EndTime = x.EndTime,
                    ClientId = x.ClientId,
                    ClientName = x.Client.FirstName + " " + x.Client.LastName,
                    Notes = x.Notes,
                    GroupId = x.GroupId,
                    Group = new GroupGetDto
                    {
                        GroupName = x.Group.GroupName,
                        Clients = x.Group.Clients.Select(y => new ClientGetDto
                        {
                            Id = y.Id,
                            DateOfBirth = y.DateOfBirth,
                            FirstName = y.FirstName,
                            LastName = y.LastName,
                            Goals = y.Goals.Select(z => new GoalGetDto
                            {
                                Id = z.Id,
                                Information = z.Information
                            }).ToList()
                        }).ToList()
                    },
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
                .Include(x => x.Client)
                .Include(x => x.Group).ThenInclude(x => x.Clients).ThenInclude(x => x.Goals)
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
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                GroupId = session.GroupId,
                ClientId = session.ClientId,
                Notes = session.Notes,
                Group = new GroupGetDto
                {
                    GroupName = session.Group.GroupName,
                    Clients = session.Group.Clients.Select(y => new ClientGetDto
                    {
                        Id = y.Id,
                        DateOfBirth = y.DateOfBirth,
                        FirstName = y.FirstName,
                        LastName = y.LastName,
                        Goals = y.Goals.Select(z => new GoalGetDto
                        {
                            Id = z.Id,
                            Information = z.Information
                        }).ToList()
                    }).ToList()
                },
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
                Notes = sessionCreateDto.Notes,
            };
            
            if (sessionCreateDto.GroupId > 0)
            {
                sessionToCreate.GroupId = sessionCreateDto.GroupId;
            }

            if (sessionCreateDto.ClientId > 0)
            {
                sessionToCreate.ClientId = sessionCreateDto.ClientId;
            }

            await _dataContext.Set<Session>().AddAsync(sessionToCreate);
            await _dataContext.SaveChangesAsync();

            
            return CreatedAtAction(nameof(GetById), new { id = sessionToCreate.Id }, new SessionGetDto
            {
                Id = sessionToCreate.Id,
                UserId = sessionToCreate.UserId,
                StartTime = sessionToCreate.StartTime,
                EndTime = sessionToCreate.EndTime,
                GroupId = sessionToCreate.GroupId,
                ClientId = sessionToCreate.ClientId,
                Notes = sessionToCreate.Notes,
            });        
        }

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
            if (sessionUpdateDto.StartTime != session.StartTime || sessionUpdateDto.EndTime != session.EndTime)
            {
                if (sessionUpdateDto.EndTime <= sessionUpdateDto.StartTime)
                {
                    response.AddError("Duration", "StartTime must be earlier than EndTime.");
                    return BadRequest(response);
                }
            }
            if(sessionUpdateDto.StartTime != session.StartTime)
            {
                session.StartTime = sessionUpdateDto.StartTime;
            }
            
            if (sessionUpdateDto.EndTime != session.EndTime)
            {
                session.EndTime = sessionUpdateDto.EndTime;
            }
            
            if(sessionUpdateDto.GroupId > 0)
            {
                session.GroupId = sessionUpdateDto.GroupId;
                if (session.ClientId > 0)
                {
                    session.ClientId = 0;
                }
            }
            
            if(sessionUpdateDto.ClientId > 0)
            {
                session.ClientId = sessionUpdateDto.ClientId;
                if (session.GroupId > 0)
                {
                    session.GroupId = 0;
                }
            }

            session.Notes = sessionUpdateDto.Notes;

            await _dataContext.SaveChangesAsync();

            response.Data = new SessionGetDto
            {
                Id = session.Id,
                UserId = session.UserId,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                GroupId = session.GroupId,
                ClientId = session.ClientId,
                Notes = session.Notes
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
