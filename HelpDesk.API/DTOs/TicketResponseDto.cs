using HelpDesk.API.Models;

namespace HelpDesk.API.DTOs
{
    public class TicketResponseDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public TicketStatus Status { get; set; }

        public TicketPriority Priority { get; set; }

        public string CreatedBy { get; set; } = string.Empty;

        public string? AssignedTo { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}