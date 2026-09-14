namespace HelpDesk.API.Models
{
    public class TicketComment
    {
        public int Id { get; set; }

        public string Comment { get; set; } = string.Empty;

        public string CreatedBy { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int TicketId { get; set; }

        public Ticket Ticket { get; set; } = null!;
    }
}