using System.ComponentModel.DataAnnotations;

namespace HelpDesk.API.DTOs
{
    public class AssignTicketDto
    {
        [Required]
        public string AssignedTo { get; set; } = string.Empty;
    }
}