namespace HelpDesk.API.DTOs
{
    public class CommentResponseDto
    {
        public int Id { get; set; }

        public string Comment { get; set; } = string.Empty;

        public string CreatedBy { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public int TicketId { get; set; }
    }
}