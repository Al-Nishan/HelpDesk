using Microsoft.AspNetCore.Identity;

namespace HelpDesk.API.Data
{
    public static class DbSeeder
    {
        public static async Task SeedRolesAsync(
            RoleManager<IdentityRole> roleManager)

        {
            string[] roles =
            {
                "Employee",
                "SupportAgent",
                "Admin"
            };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    var result = await roleManager.CreateAsync(
                        new IdentityRole(role));

                    if (!result.Succeeded)
                    {
                        Console.WriteLine($"Failed to create role: {role}");

                        foreach (var error in result.Errors)
                        {
                            Console.WriteLine($"{error.Code}: {error.Description}");
                        }
                    }
                }
            }
        }
    }
}