# Business & Political Analyst Website

A professional, SEO-optimized website for a business and political analyst featuring blog content, digital products, and an admin dashboard.

## 🚀 Features

### Frontend
- **Home Page**: Hero section, about summary, featured blogs & products, testimonials, newsletter signup
- **Blogs Page**: Categorized, searchable blog posts with SEO optimization
- **Products Page**: Digital products (e-books, reports) with CRO-focused design
- **About Me Page**: Professional background with schema markup
- **Contact Page**: Contact form and social links

### Backend/Admin
- Secure authentication with NextAuth.js
- Dashboard with site metrics and analytics
- Blog management with rich text editor and SEO fields
- Product management with file uploads and payment integration
- Newsletter subscriber management

### Optimization
- **SEO**: Meta tags, schema markup, XML sitemap
- **Performance**: Image optimization, lazy loading, code splitting
- **Mobile**: Fully responsive design
- **Analytics**: Google Analytics integration

## 📋 Prerequisites

Before running this project, ensure you have:

- Node.js 18.x or higher
- MongoDB (local or MongoDB Atlas account)
- Stripe account (for payments)
- Email service account (Resend recommended)
- Cloudinary account (for file uploads)

## 🛠️ Installation

### 1. Install Node.js Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
copy .env.example .env.local
```

Edit `.env.local` and fill in your credentials:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com

# File Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin (for initial setup)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=changeme123
```

### 3. Initialize Database

The first time you run the application, you can seed initial data:

```bash
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
analyst-website/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # Root layout with header/footer
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── blogs/               # Blog pages
│   │   ├── page.tsx         # Blogs listing
│   │   └── [slug]/
│   │       └── page.tsx     # Individual blog post
│   ├── products/            # Products pages
│   │   ├── page.tsx         # Products listing
│   │   └── [slug]/
│   │       └── page.tsx     # Individual product page
│   ├── about/
│   │   └── page.tsx         # About page
│   ├── contact/
│   │   └── page.tsx         # Contact page
│   ├── admin/               # Admin dashboard
│   │   ├── layout.tsx       # Admin layout with auth
│   │   ├── dashboard/
│   │   ├── blogs/
│   │   └── products/
│   └── api/                 # API routes
│       ├── auth/            # Authentication
│       ├── blogs/           # Blog CRUD
│       ├── products/        # Product CRUD
│       ├── newsletter/      # Newsletter management
│       └── checkout/        # Stripe payments
├── components/              # Reusable components
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── forms/
│   │   ├── NewsletterForm.tsx
│   │   ├── ContactForm.tsx
│   │   └── BlogEditor.tsx
│   └── ui/                  # UI components
├── models/                  # MongoDB/Mongoose models
│   ├── User.ts
│   ├── Blog.ts
│   ├── Product.ts
│   └── Newsletter.ts
├── lib/                     # Utility functions
│   ├── mongodb.ts           # Database connection
│   ├── auth.ts              # Authentication config
│   └── utils.ts             # Helper functions
├── public/                  # Static assets
│   └── images/
├── .env.example             # Environment variables template
├── .env.local               # Your local environment (gitignored)
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## 🎨 Design System

### Colors
- **Primary (Navy)**: `#1e3a5f`
- **Secondary (Slate)**: `#475569`
- **Accent (Gold)**: `#d4af37`

### Typography
- **Headlines**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Components
- Buttons: `.btn-primary`, `.btn-secondary`, `.btn-outline`
- Cards: `.card`
- Inputs: `.input`
- Containers: `.container-custom`

## 🔑 Admin Access

After setting up, create your first admin user by accessing:
```
http://localhost:3000/api/auth/setup
```

Then login at:
```
http://localhost:3000/admin
```

## 📝 Content Management

### Creating a Blog Post

1. Go to Admin Dashboard → Blogs → Create New
2. Fill in all SEO fields (meta title, description, keywords)
3. Write content using the rich text editor
4. Add internal links and external references
5. Set category and tags
6. Publish or save as draft

### Adding a Digital Product

1. Go to Admin Dashboard → Products → Create New
2. Upload product files (PDF, images)
3. Set pricing and CRO copy
4. Add value propositions and testimonials
5. Configure Stripe product integration
6. Publish

## 🚢 Deployment

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Environment Setup

Make sure to set all environment variables in your hosting platform:
- Vercel: Project Settings → Environment Variables
- MongoDB Atlas: Whitelist Vercel IP addresses

### Domain Configuration

1. Add custom domain in Vercel
2. Update `NEXTAUTH_URL` in environment variables
3. Configure DNS records
4. Set up SSL (automatic with Vercel)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📊 Analytics

The site includes:
- Google Analytics 4 integration
- Vercel Analytics
- Custom admin dashboard analytics

## 🔒 Security

- All passwords hashed with bcrypt
- JWT tokens for authentication
- CSRF protection enabled
- Rate limiting on API routes
- Input validation with Zod
- Secure file upload validation

## 📚 API Documentation

### Public Endpoints
- `GET /api/blogs` - List all published blogs
- `GET /api/blogs/[slug]` - Get single blog post
- `GET /api/products` - List all products
- `GET /api/products/[slug]` - Get single product
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Authenticated)
- `POST /api/blogs` - Create blog post
- `PUT /api/blogs/[id]` - Update blog post
- `DELETE /api/blogs/[id]` - Delete blog post
- `POST /api/products` - Create product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

## 🤝 Contributing

This is a personal project, but suggestions are welcome via issues.

## 📄 License

Private - All rights reserved

## 📞 Support

For questions or support, contact: admin@yourdomain.com

---

**Built with Next.js 14, TypeScript, TailwindCSS, and MongoDB**
