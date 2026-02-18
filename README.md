# Dark Lobo Comics 🦇

A modern, subscription-based digital comic publishing platform built with Angular 17 and .NET 8, featuring a horror and sci-fi aesthetic. This application provides a complete digital comic reading experience with authentication, user profiles, subscription management, and an admin dashboard for content management.

## 🌟 Features

### 🎠 Interactive Homepage
- **Full-Viewport Slideshow**: Automatic 5-second transitions showcasing featured comics
- **Manual Navigation**: Arrow controls and dot indicators for user interaction
- **Responsive Design**: Optimized for all screen sizes and devices
- **Dark Theme**: Immersive horror/sci-fi aesthetic with red accents

### 🔐 Authentication System
- **User Registration**: Complete signup with email, password, and profile information
- **Secure Login**: JWT-based authentication with token management
- **Profile Management**: User profile viewing and editing capabilities
- **Route Protection**: Guarded routes for authenticated users only
- **Role-Based Access**: Admin and User roles with different permissions

### 📚 Comic Reader
- **Sequential Reading Mode**: Page-by-page navigation with arrow controls
- **Vertical Scroll Mode**: Continuous reading experience
- **Image Preloading**: Smooth transitions between pages
- **Premium Content Protection**: Subscription-based access control
- **Responsive Design**: Works perfectly on mobile and desktop

### 🎨 Admin Dashboard
- **Comic Series Management**: Create, update, and delete comic series
- **Page Upload**: Upload and manage individual comic pages
- **Drag-and-Drop Ordering**: Organize pages in the correct sequence
- **Free/Premium Toggle**: Mark series as free or premium content
- **Image Management**: Upload cover images and page images
- **Admin-Only Access**: Protected with admin role guard

### 💳 Subscription System
- **Subscription Plans**: Monthly premium access to all premium comics
- **Stripe Integration**: Secure payment processing (requires configuration)
- **Subscription Status**: View current subscription status
- **Cancel Anytime**: Easy subscription cancellation
- **Free Content**: Access to free comics without subscription

### 🎨 Design System
- **Dark Theme**: Pure black backgrounds with red accent colors
- **Angular Design**: Sharp, edgy aesthetic perfect for horror/sci-fi
- **Typography**: Inter font family for clean, readable text
- **Consistent Styling**: Unified design language throughout the app

## 🛠️ Technology Stack

### Frontend
- **Angular 17**: Modern Angular with standalone components
- **SCSS**: Modular styling architecture
- **RxJS**: Reactive state management with BehaviorSubject
- **Angular Router**: Navigation with route guards (AuthGuard, AdminGuard, SubscriptionGuard)
- **SSR**: Server-side rendering support

### Backend
- **.NET 8**: Modern Web API with minimal APIs
- **Entity Framework Core**: SQLite for development, SQL Server ready for production
- **JWT Authentication**: Secure token-based authentication
- **Stripe Integration**: Payment processing for subscriptions
- **AWS S3**: Image storage with local fallback
- **BCrypt**: Password hashing

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher) for frontend
- **.NET 8 SDK** for backend
- **SQLite** (included) or **SQL Server** for production

### Frontend Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/epdsn/dark-lobo-comics.git
   cd dark-lobo-comics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

### Backend Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Configure settings**
   - Update `appsettings.Development.json` with your configuration:
     - Stripe API keys (for subscription features)
     - AWS credentials (optional, uses local storage by default)
     - JWT secret key

4. **Run the API**
   ```bash
   dotnet run
   ```

   The API will be available at `http://localhost:5292`

5. **Create admin user**
   - Register a new user through the frontend
   - Manually update the user's role to "Admin" in the database:
     ```sql
     UPDATE Users SET Role = 'Admin' WHERE Email = 'your-email@example.com';
     ```
   cd dark-lobo-comics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   ng serve
   ```

## 📱 Application Structure

### Frontend Structure
```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── header/         # Navigation header
│   │   └── footer/         # Footer component
│   ├── pages/              # Main application pages
│   │   ├── home/           # Landing page with slideshow
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   ├── profile/        # User profile
│   │   ├── comics/         # Comic catalog
│   │   ├── comic-reader/   # Comic reading interface
│   │   ├── admin/          # Admin dashboard
│   │   └── subscription/   # Subscription management
│   ├── services/           # Business logic and API calls
│   │   ├── auth.service.ts        # Authentication
│   │   ├── comic.service.ts       # Comic CRUD operations
│   │   └── subscription.service.ts # Subscription management
│   ├── guards/             # Route protection
│   │   ├── auth.guard.ts          # Authentication check
│   │   ├── admin.guard.ts         # Admin role check
│   │   └── subscription.guard.ts   # Premium content check
│   └── interceptors/       # HTTP request/response handling
│       └── auth.interceptor.ts    # JWT token injection
├── styles.scss            # Global styles
└── index.html            # Main HTML template
```

### Backend Structure
```
backend/
├── Controllers/           # API endpoints
│   ├── AuthController.cs        # Authentication
│   ├── ComicsController.cs      # Comic management
│   ├── SubscriptionsController.cs # Subscription management
│   ├── UploadController.cs      # Image uploads
│   └── WebhookController.cs     # Stripe webhooks
├── Models/               # Database entities
│   ├── User.cs          # User with roles and subscription
│   ├── ComicSeries.cs   # Comic series
│   ├── ComicPage.cs     # Individual pages
│   └── Subscription.cs  # Subscription records
├── Services/            # Business logic
│   ├── JwtService.cs           # JWT generation/validation
│   ├── SubscriptionService.cs  # Stripe integration
│   └── StorageService.cs       # Image storage (S3/local)
├── Data/                # Database context
│   └── AppDbContext.cs  # EF Core context
├── DTOs/                # Data transfer objects
└── Program.cs           # Application configuration
```

## 🎯 Key Features

### Authentication Flow
1. **Registration**: Users create accounts with email/password
2. **Login**: Secure authentication with JWT tokens
3. **Profile Management**: View and edit user information
4. **Route Protection**: Automatic redirects for unauthenticated users
5. **Role-Based Access**: Admin and User roles with different permissions

### Comic Reading Experience
- **Sequential Mode**: Traditional page-by-page reading
- **Scroll Mode**: Vertical scrolling for continuous reading
- **Image Preloading**: Preload next page for smooth transitions
- **Premium Protection**: Subscription check before accessing premium content
- **Responsive Design**: Works on all devices

### Admin Dashboard Features
- **Series Management**: Create, edit, delete comic series
- **Page Upload**: Add pages with automatic numbering
- **Free/Premium Toggle**: Control content access levels
- **Image Upload**: Direct upload to S3 or local storage
- **Real-time Updates**: Changes reflect immediately in the catalog

### Subscription System
- **Monthly Plans**: $9.99/month for premium access
- **Stripe Integration**: Secure payment processing (requires configuration)
- **Status Display**: View current subscription status
- **Free Content**: Always available without subscription
- **Easy Cancellation**: Cancel at any time

## 🌐 API Integration

The application communicates with a .NET 8 Web API backend. API endpoints:

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

### Subscriptions
- `GET /api/subscriptions/my-subscription` - Get user's subscription
- `POST /api/subscriptions/create` - Create new subscription
- `POST /api/subscriptions/cancel` - Cancel subscription

### Upload
- `POST /api/upload/image` - Upload image (Admin only)

## 🔧 Configuration

### Stripe Configuration

To enable subscription features, configure Stripe:

1. **Get Stripe API Keys**:
   - Sign up at [stripe.com](https://stripe.com)
   - Get your test API keys from the Stripe Dashboard

2. **Update Backend Configuration**:
   ```json
   // appsettings.Development.json
   "Stripe": {
     "SecretKey": "sk_test_your_key_here",
     "PublishableKey": "pk_test_your_key_here",
     "WebhookSecret": "whsec_your_secret_here"
   }
   ```

3. **Frontend Integration** (Optional):
   - Add Stripe.js to your frontend for payment processing
   - Update the subscribe() method in `subscription.ts`

### AWS S3 Configuration

For production image storage:

```json
// appsettings.json
"AWS": {
  "AccessKey": "your-access-key",
  "SecretKey": "your-secret-key",
  "Region": "us-east-1",
  "BucketName": "your-bucket-name"
}
```

If not configured, images will be stored locally in `backend/wwwroot/uploads/comics/`

## 🚀 Deployment

### Frontend Deployment
```bash
# Build for production
ng build --configuration production

# Deploy dist/ folder to your hosting service
```

### Backend Deployment
```bash
# Publish for production
dotnet publish -c Release

# Deploy to your server or cloud platform
```

### Environment Configuration
- Update API URLs in frontend services for production
- Configure production database connection string
- Set up CORS for production domain
- Enable HTTPS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Angular Team**: For the amazing framework
- **Inter Font**: Google Fonts for typography
- **Horror/Sci-Fi Community**: For inspiration in design and content

---

**Dark Lobo Comics** - Where darkness meets imagination 🦇🔴
