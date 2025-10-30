# 🔗 URL Shortener

A modern full-stack URL shortener application with custom short links, user authentication, real-time analytics, and beautiful animations. Built with the latest web technologies for optimal performance and exceptional user experience.

![URL Shortener](https://img.shields.io/badge/Status-Portfolio%20Project-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### Core Features
- 🔐 **JWT Authentication** - Secure authentication with automatic token refresh
- ✂️ **Custom Short URLs** - Create memorable personalized short links
- 📊 **Click Analytics** - Real-time click tracking and statistics
- 🔍 **Search & Sort** - Find your links quickly with smart filtering
- 📋 **One-Click Copy** - Instant clipboard copy with visual feedback
- 🗑️ **Safe Deletion** - Confirmation modals prevent accidental deletion

### UX Enhancements
- 🎨 **Smooth Animations** - Fade-in, slide-in, and bounce animations
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop
- 🌟 **Modern UI Components** - Built with CVA and Tailwind variants
- 🔔 **Toast Notifications** - Non-blocking feedback with Sonner
- ⚡ **Loading States** - Visual feedback for all async operations
- 🎯 **Server-Side Pagination** - Efficient data loading (5 items per page)

### Technical Features
- 🔄 **Auto Token Refresh** - Seamless authentication without re-login
- 🛡️ **Input Validation** - Comprehensive frontend and backend validation
- 🎭 **Accessibility** - Focus rings, ARIA labels, keyboard navigation
- 🚀 **Optimized Performance** - Fast loading and smooth interactions

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure authentication with access & refresh tokens
- **bcrypt** - Password hashing
- **class-validator** - DTO validation
- **Passport** - Authentication middleware

### Frontend
- **Next.js 16** - React framework with App Router & Turbopack
- **TypeScript** - Type-safe development
- **TailwindCSS v4** - Modern utility-first CSS
- **Sonner** - Beautiful toast notifications
- **Lucide React** - Modern icon library
- **CVA** - Class Variance Authority for component variants
- **clsx + tailwind-merge** - Smart class composition

## 📁 Project Structure

```
url-shortener/
├── backend/
│   ├── src/
│   │   ├── Auth/           # JWT strategy & guards
│   │   ├── Controller/     # API endpoints
│   │   ├── Service/        # Business logic (with pagination)
│   │   ├── Model/          # MongoDB schemas
│   │   ├── Dto/            # Data validation
│   │   └── Decorator/      # Custom decorators
│   ├── .env.example        # Environment template
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── components/     # Reusable components
│   │   │   ├── Button.tsx     # CVA button variants
│   │   │   ├── Card.tsx       # Card components
│   │   │   ├── Pagination.tsx # Pagination UI
│   │   │   └── ...
│   │   ├── dashboard/      # Dashboard page
│   │   ├── login/          # Auth pages
│   │   └── register/
│   ├── lib/
│   │   └── utils.ts        # Utility functions (cn helper)
│   ├── .env.example        # Environment template
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```

#### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file from example
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets

# Start development server
npm run start:dev
```

Backend will run on `http://localhost:3000`

#### 3. Setup Frontend
```bash
cd frontend
npm install

# Create .env.local file from example
cp .env.example .env.local
# Edit .env.local if needed (default: http://localhost:3000)

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3001`

### Environment Variables

#### Backend `.env`
```env
# Database
MONGO_URI=mongodb://localhost:27017/url-shortener
# Or MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=YourApp

# Server
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

#### Frontend `.env.local`
```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

## 📖 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

### URL Management
- `POST /` - Create shortened URL
- `GET /my-urls?page=1&limit=5` - Get user's URLs (paginated)
- `GET /:shortUrl` - Redirect to original URL
- `DELETE /:shortUrl` - Delete shortened URL

## 🎯 Usage

1. **Register/Login** to your account
2. **Create a short URL** by entering:
   - Original URL (required)
   - Link title (optional)
   - Custom short link (optional - alphanumeric, hyphens, underscores)
3. **Copy and share** your shortened URL with one click
4. **Track performance** - View click counts for each link
5. **Search & sort** - Find links quickly with real-time search
6. **Navigate pages** - Browse through your links with pagination
7. **Delete links** - Remove unwanted links with confirmation

## 🎨 UI Components

### Button Variants
- **Default** - Primary actions (blue)
- **Destructive** - Delete actions (red)
- **Outline** - Secondary actions
- **Ghost** - Tertiary actions
- **Success** - Success states (green)

### Animations
- **Fade-in** - Smooth entrance for cards
- **Slide-in** - Bottom-up for errors/notifications
- **Bounce-in** - Success confirmations
- **Stagger** - Sequential list item animations

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Automatic token refresh (15min access, 7 day refresh)
- ✅ HTTP-only cookies for tokens
- ✅ Input validation and sanitization
- ✅ Protected API routes with guards
- ✅ CORS configuration
- ✅ MongoDB injection prevention

## 🚢 Deployment

### Frontend (Vercel - Recommended)
```bash
cd frontend
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (Railway/Render - Recommended)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `PORT`
4. Deploy!

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend (if tests added)
cd frontend
npm run test
```

## 📸 Screenshots

> **Note:** Add your screenshots here after deployment
> 
> Recommended screenshots:
> - Dashboard with multiple links
> - Create form with validation
> - Toast notifications
> - Mobile responsive view
> - Loading states

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Andrew Prasetya**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [your-portfolio.com](https://your-portfolio.com)

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - The React Framework
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS
- [Sonner](https://sonner.emilkowal.ski/) - Beautiful toast library
- [Lucide](https://lucide.dev/) - Beautiful icon library
- [CVA](https://cva.style/) - Class Variance Authority

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

## 📊 Project Stats

- **Lines of Code:** ~3,000+
- **Components:** 15+
- **API Endpoints:** 9
- **Features:** 15+
- **Development Time:** 2 weeks

---

**Made with ❤️ and ☕ by Andrew Prasetya**

*This project is part of my portfolio demonstrating full-stack development skills with modern technologies.*
