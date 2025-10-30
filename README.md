# 🔗 URL Shortener

A full-stack URL shortener application with custom short links, user authentication, and click analytics. Built with modern web technologies for optimal performance and user experience.

![URL Shortener](https://img.shields.io/badge/Status-Portfolio%20Project-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🔐 **User Authentication** - Secure JWT-based authentication with refresh tokens
- ✂️ **Custom Short URLs** - Create personalized short links with custom aliases
- 📊 **Click Analytics** - Track how many times each link has been clicked
- 🔍 **Search & Filter** - Easily find your links with search and sorting options
- 📋 **Quick Copy** - One-click copy to clipboard functionality
- 🎨 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Updates** - Instant feedback on all operations
- 🛡️ **Input Validation** - Comprehensive validation for URLs and custom aliases
- 🗑️ **Confirmation Modals** - Safe delete operations with confirmation dialogs

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure authentication with access & refresh tokens
- **bcrypt** - Password hashing
- **class-validator** - DTO validation
- **Passport** - Authentication middleware

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **React Hooks** - Modern state management

## 📁 Project Structure

```
url-shortener/
├── backend/
│   ├── src/
│   │   ├── Auth/           # JWT strategy & guards
│   │   ├── Controller/     # API endpoints
│   │   ├── Service/        # Business logic
│   │   ├── Model/          # MongoDB schemas
│   │   ├── Dto/            # Data validation
│   │   └── Decorator/      # Custom decorators
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── components/     # Reusable components
│   │   ├── dashboard/      # Dashboard page
│   │   ├── login/          # Auth pages
│   │   └── register/
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secrets
   
   # Start development server
   npm run start:dev
   ```
   Backend will run on `http://localhost:3000`

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   
   # Start development server
   npm run dev
   ```
   Frontend will run on `http://localhost:3001`

### Environment Variables

#### Backend `.env`
```env
# Database
MONGO_URI=mongodb://localhost:27017/url-shortener
# Or use MongoDB Atlas (recommended):
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=YourApp

# Server
port=3000

# JWT (optional - uses defaults if not set)
JWT_SECRET=your-super-secret-jwt-key

# Environment
NODE_ENV=development
```

#### Frontend
No environment variables required for development. API URL is currently hardcoded to `http://localhost:3000`.

## 📖 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

### URL Management
- `POST /` - Create shortened URL
- `GET /my-urls` - Get user's URLs
- `GET /:shortUrl` - Redirect to original URL
- `DELETE /:shortUrl` - Delete shortened URL

## 🎯 Usage

1. **Register/Login** to your account
2. **Create a short URL** by entering:
   - Original URL (required)
   - Custom title (optional)
   - Custom short link (optional, alphanumeric + hyphens/underscores)
3. **Copy and share** your shortened URL
4. **Track clicks** and manage your links from the dashboard
5. **Delete links** when no longer needed

## 🎨 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Main dashboard showing all your shortened URLs with analytics*

### Create Short URL
![Create URL](./screenshots/create.png)
*Simple form to create new short links*

### Mobile View
![Mobile](./screenshots/mobile.png)
*Fully responsive design*

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 🚢 Deployment

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy!

### Frontend (Vercel)
```bash
cd frontend
vercel
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only cookies for tokens
- Input validation and sanitization
- Protected API routes with guards
- CORS configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Andrew Prasetya**
- GitHub: [@andrewprasetya](https://github.com/andrewprasetya)
- LinkedIn: [Andrew Prasetya](https://linkedin.com/in/andrewprasetya-k)

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Next.js team for the React framework
- All open-source contributors

---
-Andrew
