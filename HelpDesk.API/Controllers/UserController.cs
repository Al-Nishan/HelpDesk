using HelpDesk.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HelpDesk.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;

        public UsersController(UserManager<IdentityUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();

            var result = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);

                result.Add(new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    Roles = roles
                });
            }

            return Ok(result);
        }

        [HttpPut("{userId}/role")]
        public async Task<IActionResult> UpdateUserRole(
    string userId,
    UpdateUserRoleDto request)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            var allowedRoles = new[]
            {
        "Employee",
        "SupportAgent",
        "Admin"
    };

            if (!allowedRoles.Contains(request.Role))
            {
                return BadRequest(new
                {
                    message = "Invalid role."
                });
            }

            var currentRoles = await _userManager.GetRolesAsync(user);

            if (currentRoles.Contains(request.Role))
            {
                return BadRequest(new
                {
                    message = "User already has this role."
                });
            }

            var removeResult = await _userManager.RemoveFromRolesAsync(
                user,
                currentRoles);

            if (!removeResult.Succeeded)
            {
                return StatusCode(500, new
                {
                    message = "Failed to remove existing roles."
                });
            }

            var addResult = await _userManager.AddToRoleAsync(
                user,
                request.Role);

            if (!addResult.Succeeded)
            {
                return StatusCode(500, new
                {
                    message = "Failed to assign new role."
                });
            }

            return Ok(new
            {
                message = "User role updated successfully.",
                userId = user.Id,
                role = request.Role
            });
        }

    }


}