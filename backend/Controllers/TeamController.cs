using AuctionApp.Data;
using AuctionApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace AuctionApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamController:ControllerBase
    {
        private readonly AppDbContext _context;

        public TeamController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTeam(Team team)
        {
            _context.Teams.Add(team);
            await _context.SaveChangesAsync();

            return Ok(team);
        }

        [HttpGet]
        public IActionResult GetTeams()
        {
            try
            {
                return Ok(_context.Teams.ToList());
            }
            catch (Exception ex)
            {
                return Ok(new { error = ex.Message, inner = ex.InnerException?.Message });
            }
        }
    }
}

