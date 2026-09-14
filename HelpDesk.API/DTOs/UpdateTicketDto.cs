using HelpDesk.API.Models;
using System.ComponentModel.DataAnnotations;

namespace HelpDesk.API.DTOs
{
    public class UpdateTicketDto
    {
        [Required]
        [MinLength(5)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MinLength(10)]
        public string Description { get; set; } = string.Empty;

        public TicketStatus Status { get; set; } = TicketStatus.Open;

        public TicketPriority Priority { get; set; } = TicketPriority.Medium;

    }
}