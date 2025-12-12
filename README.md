# Shopify Invoice Generator & Automation App

A professional invoice generation and email automation system for Shopify stores. Create custom invoices, manage draft orders, and automatically send branded invoices to customers.

**Built with lessons learned from DigiKey HQ License Manager** - applying proven patterns and best practices.

## 🎯 Project Overview

### Vision
Create a robust, user-friendly Shopify app that allows merchants to:

- ✅ Generate professional PDF invoices from Shopify orders
- ✅ Create and manage draft orders with custom invoice numbers
- ✅ Send automated invoice emails with custom branding
- ✅ Use multiple template designs for different products/customers
- ✅ Process invoices in bulk for efficiency
- ✅ Maintain complete control over invoice formatting and styling

### Target Users
- Shopify merchants who need professional invoicing
- B2B stores requiring custom invoice formatting
- Stores needing multiple invoice templates
- Merchants wanting automated invoice delivery
- Businesses requiring custom invoice numbering schemes

### Market Position
This app fills the gap between basic Shopify invoices and expensive third-party solutions, offering:

- **Affordable pricing** - Subscription-based with free tier
- **Full customization** - Complete control over invoice design
- **Shopify-native** - Embedded app with seamless integration
- **Professional quality** - PDF generation with proper formatting
- **Automation-first** - Set it and forget it email delivery

## ✨ Core Features

### Phase 1: Foundation (Current Sprint)
- [x] Project infrastructure setup
- [ ] Railway backend deployment
- [ ] Vercel frontend deployment
- [ ] Shopify Partner app configuration
- [ ] Database schema creation
- [ ] Shopify OAuth integration
- [ ] Draft Orders API integration
- [ ] Basic invoice CRUD operations

### Phase 2: Invoice Generation (Next)
- [ ] PDF generation engine (Puppeteer)
- [ ] Invoice template system
- [ ] Custom invoice numbering
- [ ] Address formatting (international support)
- [ ] Product metafield integration
- [ ] Tax calculation support
- [ ] Multi-currency handling

### Phase 3: Email Automation
- [ ] SendGrid integration
- [ ] Custom email templates
- [ ] Template assignment rules
- [ ] Automated sending on order creation
- [ ] Manual send functionality
- [ ] Bulk send operations
- [ ] Email delivery tracking

### Phase 4: Advanced Features
- [ ] Visual template builder (drag-and-drop)
- [ ] Multiple template designs (professional, modern, minimalist)
- [ ] Invoice editing after creation
- [ ] Custom sender email configuration
- [ ] Invoice history and search
- [ ] Analytics dashboard
- [ ] Export capabilities (CSV, Excel)

### Phase 5: Polish & Launch
- [ ] GDPR compliance webhooks
- [ ] App billing integration
- [ ] Responsive mobile design
- [ ] Comprehensive documentation
- [ ] Shopify App Store submission
- [ ] Customer support portal

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (Railway)
- **Email**: SendGrid
- **PDF Generation**: Puppeteer
- **Shopify Integration**: @shopify/shopify-api

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Router**: React Router
- **Shopify UI**: @shopify/app-bridge-react
- **HTTP Client**: Axios

### Infrastructure
- **Backend Hosting**: Railway
- **Frontend Hosting**: Vercel
- **Database**: Railway MySQL
- **Version Control**: GitHub
- **CI/CD**: Automatic deployments on push

## 📁 Project Structure

```
shopify-invoice-app/
├── admin/                          # React frontend application
│   ├── src/
│   │   ├── pages/                  # Route pages
│   │   ├── components/             # Reusable React components
│   │   ├── utils/                  # API clients, utilities
│   │   ├── styles/                 # CSS files
│   │   ├── assets/                 # Static resources
│   │   ├── App.jsx                 # Main app with routing
│   │   └── main.jsx                # Entry point
│   ├── public/                     # Static HTML
│   ├── dist/                       # Build output
│   └── package.json                # React dependencies
│
├── server/                         # Express backend
│   ├── src/
│   │   ├── routes/                 # Express route handlers
│   │   ├── services/               # Business logic layer
│   │   ├── middleware/             # Auth & security middleware
│   │   ├── config/                 # Database & Shopify config
│   │   ├── models/                 # Database models
│   │   ├── controllers/            # Route controllers
│   │   └── index.js                # Express server setup
│   ├── migrations/                 # Database migration files
│   ├── scripts/                    # Utility scripts
│   └── package.json                # Node.js dependencies
│
├── .shopify/                       # Shopify configuration
├── shopify.app.toml                # App manifest for Shopify
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MySQL database (Railway or local)
- Shopify Partner account
- SendGrid account for emails

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shopify-invoice-app.git
   cd shopify-invoice-app
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../admin
   npm install
   ```

4. **Configure environment variables**

   Create `server/.env`:
   ```env
   PORT=3001
   NODE_ENV=development
   APP_URL=http://localhost:3001
   FRONTEND_URL=http://localhost:5173

   # Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=invoice_app
   DB_PORT=3306

   # Shopify
   SHOPIFY_API_KEY=your_api_key
   SHOPIFY_API_SECRET=your_api_secret
   SHOPIFY_SCOPES=read_products,read_orders,write_draft_orders
   SHOPIFY_REDIRECT_URI=http://localhost:3001/auth/callback

   # SendGrid
   SENDGRID_API_KEY=your_sendgrid_key
   FROM_EMAIL=noreply@yourdomain.com
   FROM_NAME=Invoice App
   ```

   Create `admin/.env`:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

5. **Run database migrations**
   ```bash
   cd server
   npm run migrate
   ```

6. **Start development servers**

   Backend:
   ```bash
   cd server
   npm run dev
   ```

   Frontend:
   ```bash
   cd admin
   npm run dev
   ```

7. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📦 Deployment

### Backend (Railway)
1. Create a new Railway project
2. Add MySQL database service
3. Connect GitHub repository
4. Set environment variables
5. Deploy automatically on push

### Frontend (Vercel)
1. Import GitHub repository to Vercel
2. Set root directory to `admin`
3. Set environment variables
4. Deploy automatically on push

### Database Setup
1. Run migrations in Railway dashboard
2. Configure connection settings
3. Set up backups

## 🔒 Security

- HMAC webhook signature verification
- Session token authentication for embedded apps
- Security headers (CSP, HSTS, X-Frame-Options)
- GDPR compliance webhooks
- Input validation at service boundaries
- SQL injection prevention with parameterized queries

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read CONTRIBUTING.md for details.

## 📧 Support

For support, email support@yourdomain.com or open an issue on GitHub.

## 🙏 Acknowledgments

Built with patterns and best practices from DigiKey HQ License Manager.

---

**Status**: In Development
**Version**: 0.1.0
**Last Updated**: December 2025
