using Stripe;
using DarkLoboComics.Api.Models;
using Microsoft.EntityFrameworkCore;
using DarkLoboComics.Api.Data;

namespace DarkLoboComics.Api.Services;

public interface ISubscriptionService
{
    Task<Models.Subscription> CreateSubscriptionAsync(User user, string paymentMethodId, string priceId);
    Task<Models.Subscription?> GetUserSubscriptionAsync(Guid userId);
    Task CancelSubscriptionAsync(Guid userId, bool cancelAtPeriodEnd);
    Task HandleWebhookEventAsync(Event stripeEvent);
}

public class SubscriptionService : ISubscriptionService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public SubscriptionService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
        StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
    }

    public async Task<Models.Subscription> CreateSubscriptionAsync(User user, string paymentMethodId, string priceId)
    {
        // Create or retrieve Stripe customer
        if (string.IsNullOrEmpty(user.StripeCustomerId))
        {
            var customerOptions = new CustomerCreateOptions
            {
                Email = user.Email,
                PaymentMethod = paymentMethodId,
                InvoiceSettings = new CustomerInvoiceSettingsOptions
                {
                    DefaultPaymentMethod = paymentMethodId
                }
            };
            var customerService = new CustomerService();
            var customer = await customerService.CreateAsync(customerOptions);
            user.StripeCustomerId = customer.Id;
            await _context.SaveChangesAsync();
        }

        // Create subscription
        var subscriptionOptions = new SubscriptionCreateOptions
        {
            Customer = user.StripeCustomerId,
            Items = new List<SubscriptionItemOptions>
            {
                new SubscriptionItemOptions { Price = priceId }
            },
            PaymentSettings = new SubscriptionPaymentSettingsOptions
            {
                PaymentMethodTypes = new List<string> { "card" }
            }
        };

        var stripeSubscriptionService = new Stripe.SubscriptionService();
        var stripeSubscription = await stripeSubscriptionService.CreateAsync(subscriptionOptions);

        // Create or update subscription record
        var subscription = await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.UserId == user.Id);

        if (subscription == null)
        {
            subscription = new Models.Subscription
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                StripeSubscriptionId = stripeSubscription.Id,
                Status = stripeSubscription.Status,
                StartDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };
            _context.Subscriptions.Add(subscription);
        }
        else
        {
            subscription.StripeSubscriptionId = stripeSubscription.Id;
            subscription.Status = stripeSubscription.Status;
            subscription.StartDate = DateTime.UtcNow;
            subscription.UpdatedAt = DateTime.UtcNow;
        }

        user.SubscriptionStatus = stripeSubscription.Status;
        await _context.SaveChangesAsync();

        return subscription;
    }

    public async Task<Models.Subscription?> GetUserSubscriptionAsync(Guid userId)
    {
        return await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.UserId == userId);
    }

    public async Task CancelSubscriptionAsync(Guid userId, bool cancelAtPeriodEnd)
    {
        var subscription = await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.UserId == userId);

        if (subscription?.StripeSubscriptionId == null)
        {
            throw new InvalidOperationException("No active subscription found");
        }

        var stripeSubscriptionService = new Stripe.SubscriptionService();
        var options = new SubscriptionUpdateOptions
        {
            CancelAtPeriodEnd = cancelAtPeriodEnd
        };

        await stripeSubscriptionService.UpdateAsync(subscription.StripeSubscriptionId, options);

        if (!cancelAtPeriodEnd)
        {
            await stripeSubscriptionService.CancelAsync(subscription.StripeSubscriptionId);
            subscription.Status = "Cancelled";
            subscription.EndDate = DateTime.UtcNow;
            subscription.UpdatedAt = DateTime.UtcNow;

            var user = await _context.Users.FindAsync(userId);
            if (user != null)
            {
                user.SubscriptionStatus = "Cancelled";
            }

            await _context.SaveChangesAsync();
        }
    }

    public async Task HandleWebhookEventAsync(Event stripeEvent)
    {
        switch (stripeEvent.Type)
        {
            case "customer.subscription.updated":
            case "customer.subscription.created":
                var subscription = stripeEvent.Data.Object as Stripe.Subscription;
                if (subscription != null)
                {
                    await UpdateSubscriptionStatusAsync(subscription);
                }
                break;

            case "customer.subscription.deleted":
                var deletedSubscription = stripeEvent.Data.Object as Stripe.Subscription;
                if (deletedSubscription != null)
                {
                    await CancelSubscriptionByStripeIdAsync(deletedSubscription.Id);
                }
                break;

            case "invoice.payment_failed":
                // For invoice payment failures, Stripe will send a separate subscription event
                // so we don't need to handle it here
                break;
        }
    }

    private async Task UpdateSubscriptionStatusAsync(Stripe.Subscription stripeSubscription)
    {
        var subscription = await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.StripeSubscriptionId == stripeSubscription.Id);

        if (subscription != null)
        {
            subscription.Status = stripeSubscription.Status;
            subscription.UpdatedAt = DateTime.UtcNow;

            var user = await _context.Users.FindAsync(subscription.UserId);
            if (user != null)
            {
                user.SubscriptionStatus = stripeSubscription.Status;
            }

            await _context.SaveChangesAsync();
        }
    }

    private async Task CancelSubscriptionByStripeIdAsync(string stripeSubscriptionId)
    {
        var subscription = await _context.Subscriptions
            .FirstOrDefaultAsync(s => s.StripeSubscriptionId == stripeSubscriptionId);

        if (subscription != null)
        {
            subscription.Status = "Cancelled";
            subscription.EndDate = DateTime.UtcNow;
            subscription.UpdatedAt = DateTime.UtcNow;

            var user = await _context.Users.FindAsync(subscription.UserId);
            if (user != null)
            {
                user.SubscriptionStatus = "Cancelled";
            }

            await _context.SaveChangesAsync();
        }
    }
}
