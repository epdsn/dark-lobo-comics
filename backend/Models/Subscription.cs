namespace DarkLoboComics.Api.Models;

public class Subscription
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string? StripeSubscriptionId { get; set; }
    public string Status { get; set; } = "None"; // None, Active, Cancelled, PastDue
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public virtual User User { get; set; } = null!;
}
