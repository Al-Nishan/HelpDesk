using System.ComponentModel.DataAnnotations;

namespace HelpDesk.API.DTOs
{
    public class UpdateUserRoleDto
    {
        [Required]
        public string Role { get; set; } = string.Empty;
    }
}