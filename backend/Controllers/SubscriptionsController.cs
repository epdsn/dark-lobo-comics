using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DarkLoboComics.Api.Data;
using DarkLoboComics.Api.DTOs;
using DarkLoboComics.Api.Services;
using System.Security.Claims;

namespace DarkLoboComics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubscriptionsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ISubscriptionService _subscriptionService;

    public SubscriptionsController(AppDbContext context, ISubscriptionService subscriptionService)
    {
        _context = context;
        _subscriptionService = subscriptionService;
    }

    [HttpGet("my-subscription")]
    public async Task<ActionResult<SubscriptionDto>> GetMySubscription()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var subscription = await _subscriptionService.GetUserSubscriptionAsync(Guid.Parse(userId));
        if (subscription == null)
        {
            return NotFound("No subscription found");
        }

        return Ok(new SubscriptionDto
        {
            Id = subscription.Id.ToString(),
            UserId = subscription.UserId.ToString(),
            Status = subscription.Status,
            StartDate = subscription.StartDate,
            EndDate = subscription.EndDate
        });
    }

    [HttpPost("create")]
    public async Task<ActionResult<SubscriptionDto>> CreateSubscription(CreateSubscriptionRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var user = await _context.Users.FindAsync(Guid.Parse(userId));
        if (user == null)
        {
            return NotFound("User not found");
        }

        try
        {
            var subscription = await _subscriptionService.CreateSubscriptionAsync(user, request.PaymentMethodId, request.PriceId);

            return Ok(new SubscriptionDto
            {
                Id = subscription.Id.ToString(),
                UserId = subscription.UserId.ToString(),
                Status = subscription.Status,
                StartDate = subscription.StartDate,
                EndDate = subscription.EndDate
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("cancel")]
    public async Task<IActionResult> CancelSubscription(CancelSubscriptionRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        try
        {
            await _subscriptionService.CancelSubscriptionAsync(Guid.Parse(userId), request.CancelAtPeriodEnd);
            return Ok(new { message = "Subscription cancelled successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
