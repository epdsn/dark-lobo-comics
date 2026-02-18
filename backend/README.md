# Dark Lobo Comics API

.NET 8 Web API backend for the Dark Lobo Comics subscription-based digital comic publishing platform.

## Features

- **Authentication**: JWT-based authentication with BCrypt password hashing
- **Comic Management**: CRUD operations for comic series and pages
- **Subscription System**: Stripe integration for subscription management
- **Image Storage**: S3 integration with local fallback for development
- **Role-Based Access**: Admin and User roles with policy-based authorization

## Database Schema

- **Users**: Authentication and subscription tracking
- **ComicSeries**: Comic series metadata
- **ComicPages**: Individual comic pages with image URLs
- **Subscriptions**: User subscription records linked to Stripe

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Comics
- `GET /api/comics` - List all accessible comics
- `GET /api/comics/{id}` - Get specific comic series
- `GET /api/comics/{id}/pages` - Get comic pages
- `POST /api/comics` - Create comic series (Admin only)
- `PUT /api/comics/{id}` - Update comic series (Admin only)
- `DELETE /api/comics/{id}` - Delete comic series (Admin only)
- `POST /api/comics/{id}/pages` - Add page to series (Admin only)
- `PUT /api/comics/pages/{pageId}` - Update page (Admin only)
- `DELETE /api/comics/pages/{pageId}` - Delete page (Admin only)

### Subscriptions
- `GET /api/subscriptions/my-subscription` - Get user's subscription
- `POST /api/subscriptions/create` - Create new subscription
- `POST /api/subscriptions/cancel` - Cancel subscription

### Upload
- `POST /api/upload/image` - Upload image (Admin only)
- `DELETE /api/upload/image` - Delete image (Admin only)

### Webhooks
- `POST /api/webhook/stripe` - Stripe webhook handler

## Configuration

Update `appsettings.json` or `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=darklobo.db"
  },
  "Jwt": {
    "Key": "YourSuperSecretKeyThatIsAtLeast32CharactersLong",
    "Issuer": "DarkLoboComicsApi",
    "Audience": "DarkLoboComicsApp"
  },
  "Stripe": {
    "SecretKey": "sk_test_...",
    "PublishableKey": "pk_test_...",
    "WebhookSecret": "whsec_..."
  },
  "AWS": {
    "AccessKey": "your-access-key",
    "SecretKey": "your-secret-key",
    "Region": "us-east-1",
    "BucketName": "your-bucket-name"
  }
}
```

## Running the API

1. **Restore dependencies**:
   ```bash
   dotnet restore
   ```

2. **Run the application**:
   ```bash
   dotnet run
   ```

The API will be available at `http://localhost:5292` by default.

## Database

Using SQLite for development. The database file `darklobo.db` will be created automatically on first run.

For production, update the connection string to use SQL Server or PostgreSQL.

## CORS

Configured to allow requests from `http://localhost:4200` (Angular development server).

Update the CORS policy in `Program.cs` for production deployments.

## Development Notes

- Images are stored locally in `wwwroot/uploads/comics/` when AWS credentials are not configured
- Stripe integration requires valid API keys for subscription features
- Admin role can be assigned manually in the database for initial setup
