using AuctionApp.Models;
using AuctionApp.Services;
using Microsoft.AspNetCore.Mvc;


namespace AuctionApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;

        public AuthController(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginRequest request)
        {
            // will be replaced with real user validation logic
            if (request.Username == "admin" && request.Password == "1234")
            {
                var token = _tokenService.GenerateToken(request.Username);
                return Ok(new { token });
            }

            return Unauthorized();
        }

    }
}
