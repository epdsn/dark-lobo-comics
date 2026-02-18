namespace DarkLoboComics.Api.Models;

public class ComicPage
{
    public Guid Id { get; set; }
    public Guid SeriesId { get; set; }
    public int PageNumber { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public virtual ComicSeries Series { get; set; } = null!;
}
