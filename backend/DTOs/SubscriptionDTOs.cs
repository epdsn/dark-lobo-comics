namespace DarkLoboComics.Api.DTOs;

public class SubscriptionDto
{
    public string Id { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class CreateSubscriptionRequest
{
    public string PaymentMethodId { get; set; } = string.Empty;
    public string PriceId { get; set; } = string.Empty;
}

public class CancelSubscriptionRequest
{
    public bool CancelAtPeriodEnd { get; set; } = true;
}
