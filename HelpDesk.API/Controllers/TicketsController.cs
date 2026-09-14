using HelpDesk.API.Data;
using HelpDesk.API.DTOs;
using HelpDesk.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace HelpDesk.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TicketsController : ControllerBase
    {
        private readonly HelpDeskDbContext _context;

        private readonly UserManager<IdentityUser> _userManager;

        public TicketsController(
            HelpDeskDbContext context,
            UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketResponseDto>>> GetTickets(
            TicketStatus? status,
            TicketPriority? priority,
            string? assignedTo,
            int page = 1,
            int pageSize = 10)
        {

            page = Math.Max(page, 1);
            pageSize = Math.Clamp(pageSize, 1, 100);

            var query = _context.Tickets.AsQueryable();

            if (User.IsInRole("Employee"))
            {
                var username = User.Identity?.Name;

                query = query.Where(ticket => ticket.CreatedBy == username);
            }

            if (status.HasValue)
            {
                query = query.Where(ticket => ticket.Status == status.Value);
            }

            if (priority.HasValue)
            {
                query = query.Where(ticket => ticket.Priority == priority.Value);
            }

            if (!string.IsNullOrWhiteSpace(assignedTo))
            {
                query = query.Where(ticket => ticket.AssignedTo == assignedTo);
            }

            query = query
               .OrderBy(ticket => ticket.Id)
               .Skip((page - 1) * pageSize)
               .Take(pageSize);

            var tickets = await query
                .Select(ticket => new TicketResponseDto
                {
                    Id = ticket.Id,
                    Title = ticket.Title,
                    Description = ticket.Description,
                    Status = ticket.Status,
                    Priority = ticket.Priority,
                    CreatedBy = ticket.CreatedBy,
                    AssignedTo = ticket.AssignedTo,
                    CreatedAt = ticket.CreatedAt
                })
                .ToListAsync();

            return tickets;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TicketResponseDto>> GetTicket(int id)
        {
            var ticket = await _context.Tickets
                .FirstOrDefaultAsync(t =>
                    t.Id == id &&
                    (!User.IsInRole("Employee") ||
                     t.CreatedBy == User.Identity!.Name));
            if (ticket == null)
            {
                return NotFound();
            }

            var response = new TicketResponseDto
            {
                Id = ticket.Id,
                Title = ticket.Title,
                Description = ticket.Description,
                Status = ticket.Status,
                Priority = ticket.Priority,
                CreatedBy = ticket.CreatedBy,
                AssignedTo = ticket.AssignedTo,
                CreatedAt = ticket.CreatedAt
            };

            return response;
        }

        [Authorize(Roles = "SupportAgent,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(int id, UpdateTicketDto request)
        {
            var existingTicket = await _context.Tickets.FindAsync(id);

            if (existingTicket == null)
            {
                return NotFound();
            }

            existingTicket.Title = request.Title;
            existingTicket.Description = request.Description;
            existingTicket.Status = request.Status;
            existingTicket.Priority = request.Priority;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "SupportAgent,Admin")]
        [HttpPut("{id}/assign")]
        public async Task<IActionResult> AssignTicket(int id, AssignTicketDto request)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            var user = await _userManager.FindByNameAsync(request.AssignedTo);

            if (user == null)
            {
                return BadRequest(new
                {
                    message = "Assigned user does not exist."
                });
            }

            var isSupportAgent = await _userManager.IsInRoleAsync(
                user,
                "SupportAgent");

            if (!isSupportAgent)
            {
                return BadRequest(new
                {
                    message = "Ticket can only be assigned to a SupportAgent."
                });
            }

            ticket.AssignedTo = request.AssignedTo;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<TicketResponseDto>> CreateTicket(CreateTicketDto request)
        {
            var ticket = new Ticket
            {
                Title = request.Title,
                Description = request.Description,
                Status = request.Status,
                Priority = request.Priority,
                CreatedBy = User.Identity!.Name!,   
                AssignedTo = null
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            var response = new TicketResponseDto
            {
                Id = ticket.Id,
                Title = ticket.Title,
                Description = ticket.Description,
                Status = ticket.Status,
                Priority = ticket.Priority,
                CreatedBy = ticket.CreatedBy,
                AssignedTo = ticket.AssignedTo,
                CreatedAt = ticket.CreatedAt
            };

            return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, response);
        }

        [HttpPost("{id}/comments")]
        public async Task<IActionResult> AddComment(int id, CreateCommentDto request)
        {
            var ticket = await _context.Tickets
                .FirstOrDefaultAsync(t =>
                    t.Id == id &&
                    (!User.IsInRole("Employee") ||
                     t.CreatedBy == User.Identity!.Name));
            if (ticket == null)
            {
                return NotFound();
            }

            var comment = new TicketComment
            {
                Comment = request.Comment,
                CreatedBy = User.Identity!.Name!,
                TicketId = id
            };

            _context.TicketComments.Add(comment);
            await _context.SaveChangesAsync();

            return Ok(new CommentResponseDto
            {
                Id = comment.Id,
                Comment = comment.Comment,
                CreatedBy = comment.CreatedBy,
                CreatedAt = comment.CreatedAt,
                TicketId = comment.TicketId
            });
        }

        [HttpGet("{id}/comments")]
        public async Task<ActionResult<IEnumerable<CommentResponseDto>>> GetComments(int id)
        {
            var ticket = await _context.Tickets
                .FirstOrDefaultAsync(t =>
                    t.Id == id &&
                    (!User.IsInRole("Employee") ||
                     t.CreatedBy == User.Identity!.Name));

            if (ticket == null)
            {
                return NotFound();
            }

            var comments = await _context.TicketComments
                .Where(c => c.TicketId == id)
                .OrderBy(c => c.CreatedAt)
                .Select(c => new CommentResponseDto
                {
                    Id = c.Id,
                    Comment = c.Comment,
                    CreatedBy = c.CreatedBy,
                    CreatedAt = c.CreatedAt,
                    TicketId = c.TicketId
                })
                .ToListAsync();

            return comments;
        }
    }
}