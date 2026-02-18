using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using DarkLoboComics.Api.Services;

namespace DarkLoboComics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WebhookController : ControllerBase
{
    private readonly ISubscriptionService _subscriptionService;
    private readonly IConfiguration _configuration;

    public WebhookController(ISubscriptionService subscriptionService, IConfiguration configuration)
    {
        _subscriptionService = subscriptionService;
        _configuration = configuration;
    }

    [HttpPost("stripe")]
    public async Task<IActionResult> HandleStripeWebhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        var stripeSignature = Request.Headers["Stripe-Signature"];

        try
        {
            var webhookSecret = _configuration["Stripe:WebhookSecret"];
            var stripeEvent = EventUtility.ConstructEvent(json, stripeSignature, webhookSecret);

            await _subscriptionService.HandleWebhookEventAsync(stripeEvent);

            return Ok();
        }
        catch (StripeException)
        {
            return BadRequest();
        }
    }
}
