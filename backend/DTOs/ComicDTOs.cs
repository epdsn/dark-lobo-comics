namespace DarkLoboComics.Api.DTOs;

public class ComicSeriesDto
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsPremium { get; set; }
    public string? CoverImageUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public int PageCount { get; set; }
}

public class CreateComicSeriesRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsPremium { get; set; }
    public string? CoverImageUrl { get; set; }
}

public class UpdateComicSeriesRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public bool? IsPremium { get; set; }
    public string? CoverImageUrl { get; set; }
}

public class ComicPageDto
{
    public string Id { get; set; } = string.Empty;
    public string SeriesId { get; set; } = string.Empty;
    public int PageNumber { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}

public class CreateComicPageRequest
{
    public string SeriesId { get; set; } = string.Empty;
    public int PageNumber { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}

public class UpdateComicPageRequest
{
    public int? PageNumber { get; set; }
    public string? ImageUrl { get; set; }
}
