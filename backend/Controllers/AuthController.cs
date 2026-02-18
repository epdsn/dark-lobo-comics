using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DarkLoboComics.Api.Data;
using DarkLoboComics.Api.DTOs;
using DarkLoboComics.Api.Models;
using DarkLoboComics.Api.Services;
using System.Security.Claims;

namespace DarkLoboComics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthController(AppDbContext context, IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        // Validate request
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Email and password are required");
        }

        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest("Email already registered");
        }

        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return BadRequest("Username already taken");
        }

        // Create new user
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            Username = request.Username,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = "User",
            SubscriptionStatus = "None",
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id.ToString(),
                Email = user.Email,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                SubscriptionStatus = user.SubscriptionStatus
            }
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid email or password");
        }

        var token = _jwtService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id.ToString(),
                Email = user.Email,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.Role,
                SubscriptionStatus = user.SubscriptionStatus
            }
        });
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<UserDto>> GetProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(Guid.Parse(userId));
        if (user == null)
        {
            return NotFound();
        }

        return Ok(new UserDto
        {
            Id = user.Id.ToString(),
            Email = user.Email,
            Username = user.Username,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            SubscriptionStatus = user.SubscriptionStatus
        });
    }

    [Authorize]
    [HttpPut("profile")]
    public async Task<ActionResult<UserDto>> UpdateProfile(UpdateProfileRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(Guid.Parse(userId));
        if (user == null)
        {
            return NotFound();
        }

        // Update fields if provided
        if (!string.IsNullOrWhiteSpace(request.Username))
        {
            // Check if username is already taken by another user
            if (await _context.Users.AnyAsync(u => u.Username == request.Username && u.Id != user.Id))
            {
                return BadRequest("Username already taken");
            }
            user.Username = request.Username;
        }

        if (request.FirstName != null)
        {
            user.FirstName = request.FirstName;
        }

        if (request.LastName != null)
        {
            user.LastName = request.LastName;
        }

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new UserDto
        {
            Id = user.Id.ToString(),
            Email = user.Email,
            Username = user.Username,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Role = user.Role,
            SubscriptionStatus = user.SubscriptionStatus
        });
    }
}
