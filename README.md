# Shopify Invoice Generator & Automation App

A professional invoice generation and email automation system for Shopify stores. Create custom invoices, manage draft orders, and automatically send branded invoices to customers.

**Built with lessons learned from DigiKey HQ License Manager** - applying proven patterns and best practices.

---

## 🎯 Project Overview

### Vision
Create a robust, user-friendly Shopify app that allows merchants to:
- Generate professional PDF invoices from Shopify orders
- Create and manage draft orders with custom invoice numbers
- Send automated invoice emails with custom branding
- Use multiple template designs for different products/customers
- Process invoices in bulk for efficiency
- Maintain complete control over invoice formatting and styling

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

---

## ✨ Core Features

### Phase 1: Foundation (Current Sprint)
- [x] Project infrastructure setup
- [x] Railway backend deployment
- [x] Vercel frontend deployment
- [x] Shopify Partner app configuration
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

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- **Runtime:** Node.js (ES6 modules)
- **Framework:** Express.js 4.x
- **Database:** MySQL 8.0 (Google Cloud SQL + Railway)
- **PDF Generation:** Puppeteer 23.x
- **Email Service:** SendGrid API
- **Shopify Integration:** @shopify/shopify-api 8.0

**Frontend:**
- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 4
- **Routing:** React Router 6
- **Shopify Integration:** App Bridge React 4.x
- **HTTP Client:** Axios

**Infrastructure:**
- **Backend Hosting:** Railway (with MySQL database)
- **Frontend Hosting:** Vercel
- **Database:** Google Cloud SQL (dev) + Railway MySQL (prod)
- **CDN:** Vercel Edge Network
- **Email Delivery:** SendGrid

### System Architecture

```
Customer Places Order (Shopify)
    ↓
Webhook Triggered
    ↓
Invoice Generator
    ├→ Create Draft Order
    ├→ Generate Invoice Number
    ├→ Apply Template
    ├→ Generate PDF
    └→ Send Email (SendGrid)
        └→ Log Delivery Status
```

### Database Schema (Planned)

**Core Tables:**
- `shops` - Installed Shopify stores with OAuth tokens
- `invoices` - Main invoice records with metadata
- `invoice_line_items` - Products/services on each invoice
- `customers` - Customer information cache
- `invoice_templates` - Custom invoice designs
- `email_templates` - Email message templates
- `invoice_numbers` - Sequential numbering configuration
- `email_logs` - Delivery tracking and audit trail
- `shop_settings` - Per-shop configuration

**Supporting Tables:**
- `template_assignment_rules` - Auto-assign templates by product/tag/vendor
- `draft_orders` - Shopify draft order tracking
- `subscriptions` - App billing subscriptions
- `gdpr_requests` - GDPR compliance audit log

### File Structure

```
shopify-invoice-app/
├── server/                 # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MySQL connection pool
│   │   │   └── shopify.js           # Shopify API config
│   │   ├── routes/
│   │   │   ├── auth.js              # OAuth flow
│   │   │   ├── webhooks.js          # Order webhooks
│   │   │   ├── invoices.js          # Invoice CRUD
│   │   │   ├── templates.js         # Template management
│   │   │   └── admin.js             # Admin API
│   │   ├── services/
│   │   │   ├── invoiceService.js    # Invoice business logic
│   │   │   ├── pdfService.js        # PDF generation
│   │   │   ├── emailService.js      # SendGrid emails
│   │   │   └── draftOrderService.js # Draft orders
│   │   ├── utils/
│   │   │   ├── addressFormatter.js  # International addresses
│   │   │   ├── invoiceNumber.js     # Custom numbering
│   │   │   └── validation.js        # Input validation
│   │   └── middleware/
│   │       ├── auth.js              # Shopify session auth
│   │       └── securityHeaders.js   # CSP, HSTS, etc.
│   ├── migrations/                  # Database migrations
│   ├── templates/                   # PDF templates (HTML/CSS)
│   └── package.json
│
├── admin/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── InvoiceList.jsx
│   │   │   ├── InvoiceEditor.jsx
│   │   │   ├── TemplateBuilder.jsx
│   │   │   └── DraftOrderForm.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Invoices.jsx
│   │   │   ├── Templates.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── Documentation.jsx
│   │   ├── services/
│   │   │   └── api.js               # Axios API client
│   │   └── utils/
│   │       └── formatting.js        # Currency, date formatting
│   └── package.json
│
├── .gitignore
├── README.md
└── DEPLOYMENT_URLS.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** 20.x or higher
- **npm:** 10.x or higher
- **MySQL:** 8.0 or higher (local or cloud)
- **Shopify Partner Account:** For API credentials
- **SendGrid Account:** For email delivery

### Local Development Setup

#### 1. Clone Repository

```bash
git clone https://github.com/YOUR-USERNAME/shopify-invoice-app.git
cd shopify-invoice-app
```

#### 2. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../admin
npm install
```

#### 3. Configure Environment Variables

**Backend (`server/.env`):**
```bash
# Server
PORT=3001
NODE_ENV=development
APP_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5174

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=invoice_app
DB_PORT=3306

# Shopify
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_SCOPES=read_products,write_draft_orders,read_orders,read_customers,write_customers
SHOPIFY_REDIRECT_URI=http://localhost:3001/auth/callback

# SendGrid
MAIL_API_KEY=your_sendgrid_key
FROM_EMAIL=invoices@yourdomain.com
FROM_NAME=Invoice App
```

**Frontend (`admin/.env`):**
```bash
VITE_API_URL=http://localhost:3001
VITE_SHOPIFY_API_KEY=your_shopify_api_key
```

#### 4. Create Database

```bash
# Using MySQL client
mysql -u root -p
CREATE DATABASE invoice_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

#### 5. Run Database Migrations

```bash
cd server
node migrations/setup-database.js
```

#### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd admin
npm run dev
# Frontend runs on http://localhost:5174
```

#### 7. Test Installation

```bash
# Test backend health
curl http://localhost:3001/health

# Should return: {"status":"ok","timestamp":"..."}
```

---

## 🌐 Deployment

### Production URLs

- **Frontend:** https://shopify-invoice-app-navy.vercel.app
- **Backend:** https://shopify-invoice-app-production.up.railway.app
- **Database:** Railway MySQL (internal)

### Railway (Backend + Database)

**Deployed Services:**
1. **MySQL Database** - Managed by Railway
2. **Backend API** - Node.js server

**Configuration:**
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment variables configured in Railway dashboard

### Vercel (Frontend)

**Configuration:**
- Framework: Vite
- Root Directory: `admin`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variables configured in Vercel dashboard

### Shopify Partner Configuration

**App URLs:**
- App URL: `https://shopify-invoice-app-navy.vercel.app`
- Redirect URLs:
  - `https://shopify-invoice-app-production.up.railway.app/auth/callback`
  - `https://shopify-invoice-app-navy.vercel.app/auth/callback`

**API Scopes:**
- `read_products` - Access product catalog
- `write_draft_orders` - Create invoices as draft orders
- `read_orders` - Read order data
- `read_customers` - Access customer information
- `write_customers` - Update customer data

---

## 📊 Feature Comparison

### Invoice App vs License Manager

| Feature | License Manager | Invoice App |
|---------|----------------|-------------|
| **Complexity** | 7/10 | 8.5/10 |
| **Dev Time** | 35-40 hours | 60-75 hours |
| **File Output** | Text emails | PDFs + Emails |
| **Business Logic** | License allocation | Invoice calculations |
| **Shopify API** | Orders webhook | Draft Orders API |
| **Numbering** | None | Sequential custom |
| **Document Generation** | None | PDF via Puppeteer |
| **Editing** | Template editing | Full invoice editing |
| **Bulk Operations** | Single order | Batch PDF + email |
| **Address Handling** | Email only | Full international |
| **Templates** | Email only | Invoice + Email |
| **Database Tables** | 12 tables | 10+ tables |
| **Reusable Code** | - | ~40-50% from License Manager |

### What We're Reusing from License Manager

✅ **Direct Reuse (~40-50% of codebase):**
- OAuth flow & Shopify authentication
- Database architecture patterns
- SendGrid email integration
- React admin dashboard framework
- Template builder foundation
- Settings management system
- GDPR compliance structure
- App billing system
- Deployment infrastructure (Railway/Vercel/Cloud SQL)
- Security headers & CSP setup

🆕 **New Complexity Areas:**
- PDF generation system (biggest challenge)
- Draft Orders API integration
- Invoice numbering system
- Address formatting (international)
- Bulk PDF generation with queue management
- Invoice editing functionality
- Product metafield handling

---

## 💡 Key Differentiators

### Why This App Will Succeed

1. **Proven Foundation**
   - Built on successful License Manager architecture
   - Tested deployment strategy
   - Known performance characteristics

2. **Focus on Usability**
   - Intuitive invoice creation
   - Visual template builder
   - Bulk operations for efficiency

3. **Professional Quality**
   - High-quality PDF output
   - International address support
   - Multi-currency handling

4. **Automation-First**
   - Set-and-forget email delivery
   - Template assignment rules
   - Scheduled batch processing

5. **Shopify-Native**
   - Embedded app experience
   - App Bridge integration
   - Seamless OAuth flow

---

## 🛠️ Development Guidelines

### Git Workflow

**Always use feature branches:**
```bash
# Create feature branch
git checkout -b feature/invoice-pdf-generation

# Work on feature
# ... make changes ...

# Commit with clear messages
git add .
git commit -m "feat: Add PDF generation service with Puppeteer"

# Push to GitHub
git push origin feature/invoice-pdf-generation

# When complete, merge to main
git checkout main
git merge feature/invoice-pdf-generation
git branch -d feature/invoice-pdf-generation
git push origin main
```

### Commit Message Convention

Format: `type: description`

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style (formatting)
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance tasks

**Examples:**
```
feat: Add bulk invoice generation endpoint
fix: Correct address formatting for UK postcodes
docs: Update API documentation for draft orders
refactor: Simplify PDF template rendering logic
```

### Code Quality Standards

- ✅ Use ES6 modules (`import/export`)
- ✅ Follow existing code style and patterns
- ✅ Add comments for complex logic
- ✅ Use descriptive variable and function names
- ✅ Handle errors properly with try-catch
- ✅ Log important events to console
- ✅ Write modular, reusable code
- ✅ Test locally before committing

### Testing Checklist

Before every commit:
- [ ] Code works locally
- [ ] No sensitive data included
- [ ] Clear commit message prepared
- [ ] Only relevant files staged
- [ ] On feature branch (not main)
- [ ] Backend tests pass (when implemented)
- [ ] Frontend builds without errors

---

## 📚 Documentation

### API Documentation

Will include complete documentation for:
- Authentication endpoints
- Invoice CRUD operations
- Draft order management
- Template management
- Email sending operations
- Webhook handlers

### User Documentation

Will include guides for:
- Getting started
- Creating invoices
- Using templates
- Bulk operations
- Settings configuration
- Troubleshooting

---

## 🔐 Security

### Authentication
- Shopify OAuth 2.0
- Session token validation (App Bridge)
- HMAC webhook verification
- Secure credential storage

### Data Protection
- Environment variables for secrets
- HTTPS only in production
- CSP headers configured
- CORS restricted to known origins
- SQL injection prevention (parameterized queries)

### GDPR Compliance
- Customer data export capability
- Data deletion endpoints
- Audit logging
- Privacy policy compliance
- GDPR webhooks implemented

---

## 🤝 Contributing

This is a commercial project. For questions or suggestions, contact the development team.

---

## 📞 Support

### Development Team
- **Developer:** Jeremiah
- **GitHub:** tfswheels

### Resources
- [Shopify API Docs](https://shopify.dev/docs)
- [SendGrid API](https://docs.sendgrid.com)
- [Puppeteer Documentation](https://pptr.dev/)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)

---

## 📝 License

All rights reserved. This is proprietary software.

---

## 🎯 Current Status

**Project Phase:** Foundation Setup ✅
**Next Milestone:** Database Schema Creation
**Target Launch:** Q1 2026

### Recent Updates
- ✅ Project infrastructure created
- ✅ Railway backend deployed
- ✅ Vercel frontend deployed
- ✅ Shopify Partner app configured
- ✅ Environment variables configured
- ⏳ Database schema pending
- ⏳ OAuth flow pending

---

## 🚦 Roadmap

### Sprint 1 (Week 1-2): Foundation ⏳
- [x] Project setup
- [x] Infrastructure deployment
- [ ] Database schema
- [ ] OAuth integration
- [ ] Basic CRUD operations

### Sprint 2 (Week 3-4): Invoice Generation
- [ ] PDF generation engine
- [ ] Template system
- [ ] Invoice numbering
- [ ] Address formatting

### Sprint 3 (Week 5-6): Email Automation
- [ ] SendGrid integration
- [ ] Email templates
- [ ] Automated sending
- [ ] Delivery tracking

### Sprint 4 (Week 7-8): Polish & Features
- [ ] Template builder
- [ ] Bulk operations
- [ ] Invoice editing
- [ ] Analytics dashboard

### Sprint 5 (Week 9-10): Launch Prep
- [ ] GDPR compliance
- [ ] App billing
- [ ] Documentation
- [ ] Shopify App Store submission

---

**Built with ❤️ using lessons from DigiKey HQ**