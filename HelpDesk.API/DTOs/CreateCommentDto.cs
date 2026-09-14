using System.ComponentModel.DataAnnotations;

namespace HelpDesk.API.DTOs
{
    public class CreateCommentDto
    {
        [Required]
        [MinLength(2)]
        public string Comment { get; set; } = string.Empty;

    }
}