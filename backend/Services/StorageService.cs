using Amazon.S3;
using Amazon.S3.Model;

namespace DarkLoboComics.Api.Services;

public interface IStorageService
{
    Task<string> UploadImageAsync(Stream imageStream, string fileName, string contentType);
    Task<bool> DeleteImageAsync(string imageUrl);
}

public class StorageService : IStorageService
{
    private readonly IConfiguration _configuration;
    private readonly IAmazonS3? _s3Client;
    private readonly bool _isS3Enabled;

    public StorageService(IConfiguration configuration)
    {
        _configuration = configuration;
        
        // Check if S3 is configured
        var awsAccessKey = _configuration["AWS:AccessKey"];
        var awsSecretKey = _configuration["AWS:SecretKey"];
        var awsRegion = _configuration["AWS:Region"];
        
        _isS3Enabled = !string.IsNullOrEmpty(awsAccessKey) && 
                       !string.IsNullOrEmpty(awsSecretKey) && 
                       !string.IsNullOrEmpty(awsRegion);

        if (_isS3Enabled)
        {
            var s3Config = new AmazonS3Config
            {
                RegionEndpoint = Amazon.RegionEndpoint.GetBySystemName(awsRegion)
            };
            _s3Client = new AmazonS3Client(awsAccessKey, awsSecretKey, s3Config);
        }
    }

    public async Task<string> UploadImageAsync(Stream imageStream, string fileName, string contentType)
    {
        // Validate file type
        var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
        if (!allowedTypes.Contains(contentType.ToLower()))
        {
            throw new InvalidOperationException("Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.");
        }

        // Validate file size (max 10MB)
        if (imageStream.Length > 10 * 1024 * 1024)
        {
            throw new InvalidOperationException("File size exceeds maximum limit of 10MB.");
        }

        if (_isS3Enabled && _s3Client != null)
        {
            var bucketName = _configuration["AWS:BucketName"];
            var key = $"comics/{Guid.NewGuid()}/{fileName}";

            var request = new PutObjectRequest
            {
                BucketName = bucketName,
                Key = key,
                InputStream = imageStream,
                ContentType = contentType,
                CannedACL = S3CannedACL.PublicRead
            };

            await _s3Client.PutObjectAsync(request);

            return $"https://{bucketName}.s3.amazonaws.com/{key}";
        }
        else
        {
            // Fallback to local storage for development
            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "comics");
            Directory.CreateDirectory(uploadsPath);

            var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
            var filePath = Path.Combine(uploadsPath, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                imageStream.Position = 0;
                await imageStream.CopyToAsync(fileStream);
            }

            return $"/uploads/comics/{uniqueFileName}";
        }
    }

    public async Task<bool> DeleteImageAsync(string imageUrl)
    {
        if (_isS3Enabled && _s3Client != null && imageUrl.Contains(".s3.amazonaws.com"))
        {
            try
            {
                var bucketName = _configuration["AWS:BucketName"];
                var key = imageUrl.Split(new[] { ".s3.amazonaws.com/" }, StringSplitOptions.None)[1];

                var request = new DeleteObjectRequest
                {
                    BucketName = bucketName,
                    Key = key
                };

                await _s3Client.DeleteObjectAsync(request);
                return true;
            }
            catch
            {
                return false;
            }
        }
        else
        {
            // Delete from local storage
            try
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", imageUrl.TrimStart('/'));
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        return false;
    }
}
