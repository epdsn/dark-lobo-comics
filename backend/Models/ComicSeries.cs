namespace DarkLoboComics.Api.Models;

public class ComicSeries
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsPremium { get; set; }
    public string? CoverImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public virtual ICollection<ComicPage> Pages { get; set; } = new List<ComicPage>();
}
