using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DarkLoboComics.Api.Services;

namespace DarkLoboComics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UploadController : ControllerBase
{
    private readonly IStorageService _storageService;

    public UploadController(IStorageService storageService)
    {
        _storageService = storageService;
    }

    [HttpPost("image")]
    public async Task<ActionResult<object>> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded");
        }

        try
        {
            using var stream = file.OpenReadStream();
            var imageUrl = await _storageService.UploadImageAsync(stream, file.FileName, file.ContentType);

            return Ok(new { url = imageUrl });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while uploading the image");
        }
    }

    [HttpDelete("image")]
    public async Task<IActionResult> DeleteImage([FromQuery] string imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
        {
            return BadRequest("Image URL is required");
        }

        try
        {
            var deleted = await _storageService.DeleteImageAsync(imageUrl);
            if (deleted)
            {
                return Ok(new { message = "Image deleted successfully" });
            }
            else
            {
                return NotFound("Image not found");
            }
        }
        catch (Exception)
        {
            return StatusCode(500, "An error occurred while deleting the image");
        }
    }
}
