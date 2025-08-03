# Dark Lobo Comics 🦇

A modern, dark-themed comic book platform built with Angular 17, featuring a horror and sci-fi aesthetic. This application provides a complete digital comic reading experience with authentication, user profiles, and a curated comic catalog.

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

### 📚 Comic Catalog
- **Protected Access**: Comics page only available to logged-in users
- **Search & Filter**: Find comics by title, genre, or series
- **Sample Data**: Curated collection of horror and sci-fi comics
- **Responsive Grid**: Beautiful card-based layout for comic browsing

### 🎨 Design System
- **Dark Theme**: Pure black backgrounds with red accent colors
- **Angular Design**: Sharp, edgy aesthetic perfect for horror/sci-fi
- **Typography**: Inter font family for clean, readable text
- **Consistent Styling**: Unified design language throughout the app

## 🛠️ Technology Stack

- **Frontend**: Angular 17 with standalone components
- **Styling**: SCSS with modular architecture
- **Authentication**: JWT tokens with HTTP interceptors
- **Routing**: Angular Router with route guards
- **State Management**: Angular services with BehaviorSubject
- **SSR Support**: Server-side rendering compatible

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

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

## 📱 Application Structure

### Core Components
- **Header**: Navigation with authentication-aware links
- **Footer**: Copyright information with dynamic year
- **Home**: Featured slideshow and platform introduction
- **Login/Register**: Authentication forms with validation
- **Profile**: User profile management
- **Comics**: Protected comic catalog with search/filter

### Key Services
- **AuthService**: Handles authentication, registration, and user state
- **AuthInterceptor**: Automatically adds JWT tokens to requests
- **AuthGuard**: Protects routes requiring authentication

### Styling Architecture
- **Global Styles**: Dark theme with Inter typography
- **Component Styles**: Modular SCSS files
- **Responsive Design**: Mobile-first approach
- **CSS Variables**: Consistent theming with custom properties

## 🎯 Key Features

### Authentication Flow
1. **Registration**: Users create accounts with email/password
2. **Login**: Secure authentication with JWT tokens
3. **Profile Management**: View and edit user information
4. **Route Protection**: Automatic redirects for unauthenticated users

### Slideshow Functionality
- **Automatic Transitions**: 5-second intervals between slides
- **Manual Controls**: Arrow buttons and dot indicators
- **SSR Safe**: Browser-only timer functionality
- **Responsive**: Adapts to all screen sizes

### Comic Catalog
- **Search**: Find comics by title or description
- **Filtering**: Browse by genre or series
- **Sample Data**: Curated horror and sci-fi collection
- **Protected Access**: Only available to authenticated users

## 🎨 Design Philosophy

### Dark Theme
- **Pure Black Backgrounds**: Creates immersive atmosphere
- **Red Accents**: Classic horror color scheme
- **Angular Elements**: Sharp, edgy design language
- **High Contrast**: Ensures readability and accessibility

### Typography
- **Inter Font**: Clean, modern sans-serif
- **Gradient Text**: Red-to-white gradients for titles
- **Text Shadows**: Subtle glows for dramatic effect
- **Responsive Sizing**: Scales appropriately on all devices

## 🔧 Development

### Available Commands

```bash
# Development server
ng serve

# Build for production
ng build

# Run unit tests
ng test

# Run end-to-end tests
ng e2e

# Generate new component
ng generate component component-name
```

### Project Structure
```
src/
├── app/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── services/           # Business logic and API calls
│   ├── guards/             # Route protection
│   ├── interceptors/       # HTTP request/response handling
│   └── app.*              # Main application files
├── styles.scss            # Global styles
└── index.html            # Main HTML template
```

## 🌐 API Integration

The application is designed to work with a .NET 8 Web API backend, featuring:
- **Authentication Endpoints**: `/api/auth/login`, `/api/auth/register`
- **Profile Management**: `/api/auth/profile`
- **Comic Catalog**: `/api/comics` (future implementation)

## 🚀 Deployment

### Build for Production
```bash
ng build --configuration production
```

### Environment Configuration
- **Development**: `ng serve` for local development
- **Production**: Optimized build with minification and bundling

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
