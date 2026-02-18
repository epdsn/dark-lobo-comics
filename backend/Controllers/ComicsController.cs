using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DarkLoboComics.Api.Data;
using DarkLoboComics.Api.DTOs;
using DarkLoboComics.Api.Models;
using System.Security.Claims;

namespace DarkLoboComics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ComicsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ComicsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ComicSeriesDto>>> GetAll()
    {
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var subscriptionStatus = User.FindFirst("SubscriptionStatus")?.Value;

        var query = _context.ComicSeries
            .Include(s => s.Pages)
            .AsQueryable();

        // Non-subscribers can only see free comics
        if (subscriptionStatus != "Active" && subscriptionStatus != "active" && userRole != "Admin")
        {
            query = query.Where(s => !s.IsPremium);
        }

        var series = await query
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        return Ok(series.Select(s => new ComicSeriesDto
        {
            Id = s.Id.ToString(),
            Title = s.Title,
            Description = s.Description,
            IsPremium = s.IsPremium,
            CoverImageUrl = s.CoverImageUrl,
            CreatedAt = s.CreatedAt,
            PageCount = s.Pages.Count
        }));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ComicSeriesDto>> GetById(Guid id)
    {
        var series = await _context.ComicSeries
            .Include(s => s.Pages)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (series == null)
        {
            return NotFound();
        }

        // Check access rights for premium content
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var subscriptionStatus = User.FindFirst("SubscriptionStatus")?.Value;

        if (series.IsPremium && subscriptionStatus != "Active" && subscriptionStatus != "active" && userRole != "Admin")
        {
            return Forbid();
        }

        return Ok(new ComicSeriesDto
        {
            Id = series.Id.ToString(),
            Title = series.Title,
            Description = series.Description,
            IsPremium = series.IsPremium,
            CoverImageUrl = series.CoverImageUrl,
            CreatedAt = series.CreatedAt,
            PageCount = series.Pages.Count
        });
    }

    [HttpGet("{id}/pages")]
    public async Task<ActionResult<IEnumerable<ComicPageDto>>> GetPages(Guid id)
    {
        var series = await _context.ComicSeries.FindAsync(id);
        if (series == null)
        {
            return NotFound();
        }

        // Check access rights for premium content
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
        var subscriptionStatus = User.FindFirst("SubscriptionStatus")?.Value;

        if (series.IsPremium && subscriptionStatus != "Active" && subscriptionStatus != "active" && userRole != "Admin")
        {
            return Forbid();
        }

        var pages = await _context.ComicPages
            .Where(p => p.SeriesId == id)
            .OrderBy(p => p.PageNumber)
            .ToListAsync();

        return Ok(pages.Select(p => new ComicPageDto
        {
            Id = p.Id.ToString(),
            SeriesId = p.SeriesId.ToString(),
            PageNumber = p.PageNumber,
            ImageUrl = p.ImageUrl
        }));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ComicSeriesDto>> Create(CreateComicSeriesRequest request)
    {
        var series = new ComicSeries
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            IsPremium = request.IsPremium,
            CoverImageUrl = request.CoverImageUrl,
            CreatedAt = DateTime.UtcNow
        };

        _context.ComicSeries.Add(series);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = series.Id }, new ComicSeriesDto
        {
            Id = series.Id.ToString(),
            Title = series.Title,
            Description = series.Description,
            IsPremium = series.IsPremium,
            CoverImageUrl = series.CoverImageUrl,
            CreatedAt = series.CreatedAt,
            PageCount = 0
        });
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ComicSeriesDto>> Update(Guid id, UpdateComicSeriesRequest request)
    {
        var series = await _context.ComicSeries.FindAsync(id);
        if (series == null)
        {
            return NotFound();
        }

        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            series.Title = request.Title;
        }

        if (request.Description != null)
        {
            series.Description = request.Description;
        }

        if (request.IsPremium.HasValue)
        {
            series.IsPremium = request.IsPremium.Value;
        }

        if (request.CoverImageUrl != null)
        {
            series.CoverImageUrl = request.CoverImageUrl;
        }

        series.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var pageCount = await _context.ComicPages.CountAsync(p => p.SeriesId == id);

        return Ok(new ComicSeriesDto
        {
            Id = series.Id.ToString(),
            Title = series.Title,
            Description = series.Description,
            IsPremium = series.IsPremium,
            CoverImageUrl = series.CoverImageUrl,
            CreatedAt = series.CreatedAt,
            PageCount = pageCount
        });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var series = await _context.ComicSeries.FindAsync(id);
        if (series == null)
        {
            return NotFound();
        }

        _context.ComicSeries.Remove(series);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id}/pages")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ComicPageDto>> CreatePage(Guid id, CreateComicPageRequest request)
    {
        var series = await _context.ComicSeries.FindAsync(id);
        if (series == null)
        {
            return NotFound("Comic series not found");
        }

        // Check if page number already exists
        if (await _context.ComicPages.AnyAsync(p => p.SeriesId == id && p.PageNumber == request.PageNumber))
        {
            return BadRequest("Page number already exists");
        }

        var page = new ComicPage
        {
            Id = Guid.NewGuid(),
            SeriesId = id,
            PageNumber = request.PageNumber,
            ImageUrl = request.ImageUrl,
            CreatedAt = DateTime.UtcNow
        };

        _context.ComicPages.Add(page);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPages), new { id }, new ComicPageDto
        {
            Id = page.Id.ToString(),
            SeriesId = page.SeriesId.ToString(),
            PageNumber = page.PageNumber,
            ImageUrl = page.ImageUrl
        });
    }

    [HttpPut("pages/{pageId}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ComicPageDto>> UpdatePage(Guid pageId, UpdateComicPageRequest request)
    {
        var page = await _context.ComicPages.FindAsync(pageId);
        if (page == null)
        {
            return NotFound();
        }

        if (request.PageNumber.HasValue)
        {
            // Check if new page number already exists
            if (await _context.ComicPages.AnyAsync(p => p.SeriesId == page.SeriesId && p.PageNumber == request.PageNumber.Value && p.Id != pageId))
            {
                return BadRequest("Page number already exists");
            }
            page.PageNumber = request.PageNumber.Value;
        }

        if (!string.IsNullOrWhiteSpace(request.ImageUrl))
        {
            page.ImageUrl = request.ImageUrl;
        }

        await _context.SaveChangesAsync();

        return Ok(new ComicPageDto
        {
            Id = page.Id.ToString(),
            SeriesId = page.SeriesId.ToString(),
            PageNumber = page.PageNumber,
            ImageUrl = page.ImageUrl
        });
    }

    [HttpDelete("pages/{pageId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePage(Guid pageId)
    {
        var page = await _context.ComicPages.FindAsync(pageId);
        if (page == null)
        {
            return NotFound();
        }

        _context.ComicPages.Remove(page);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
