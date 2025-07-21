# TryneX Lifestyle E-commerce Platform

## Overview

TryneX Lifestyle is a full-stack e-commerce platform specializing in customizable gifts and lifestyle products. The application features a modern dark theme with gold accents, bilingual support (English/Bengali), and real-time functionality. Built as a React SPA with Express backend, it targets the Bangladesh market with localized payment methods and delivery options.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system (dark theme + gold accents)
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: Zustand for cart state, React Query for server state
- **Build Tool**: Vite with custom configuration for monorepo structure

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Supabase (PostgreSQL with real-time capabilities)
- **Session Management**: Session-based cart system using localStorage
- **API Design**: RESTful endpoints with proper error handling
- **Development**: Hot module replacement with Vite integration

### Project Structure
```
├── client/           # Frontend React application
├── server/           # Backend Express server
├── shared/           # Shared schemas and types
├── migrations/       # Database migrations
└── attached_assets/  # Project requirements and design references
```

## Key Components

### E-commerce Features
- Product catalog with categories (Mugs, T-shirts, Bottles, etc.)
- Shopping cart with session persistence
- Order management system with unique order IDs
- Custom design editor for personalized products
- Multi-step checkout process with local payment methods

### Admin Panel
- Order management and status tracking
- Product CRUD operations
- Real-time dashboard with live data indicators
- Customer communication tools

### Localization
- Bilingual interface (English/Bengali)
- Bengali pricing display with Taka (৳) currency
- Localized product categories and descriptions
- Bangladesh-specific districts for delivery

### Real-time Features
- Live order updates using Supabase subscriptions
- Real-time cart synchronization
- Admin notifications for new orders
- Connection status indicators

## Data Flow

### Database Schema
- **Products**: Multi-language names, pricing, categories, images, stock
- **Categories**: Hierarchical structure with Bengali translations
- **Orders**: Complete order lifecycle with status tracking
- **Cart Items**: Session-based temporary storage
- **Custom Designs**: Design data for personalized products

### API Endpoints
- `/api/products` - Product CRUD operations
- `/api/categories` - Category management
- `/api/orders` - Order processing and tracking
- `/api/cart` - Shopping cart operations
- `/api/contact-messages` - Customer inquiries

### State Management
- **Client State**: Cart items, UI preferences, form data
- **Server State**: Products, orders, categories (cached with React Query)
- **Real-time Updates**: Supabase subscriptions for live data sync

## External Dependencies

### Database & Backend Services
- **Supabase**: PostgreSQL database with real-time subscriptions
- Connection string: `postgresql://postgres.wifsqonbnfmwtqvupqbk:Amits@12345@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

### Payment Integration
- Local mobile banking methods (bKash, Nagad, Upay)
- Cash on delivery option
- Manual payment confirmation system

### Design System
- **Colors**: Black background, gold (#FFD700) accents, white text
- **Typography**: Custom font stack with Bengali support
- **Components**: Glass morphism effects, hover animations, parallax scrolling
- **Mobile-first**: Responsive design with dedicated mobile menu

### External Libraries
- **UI**: Radix UI primitives, Framer Motion for animations
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React icon library
- **Utilities**: date-fns for date handling, clsx for conditional classes

## Deployment Strategy

### Development Environment
- Vite dev server with HMR
- Replit-specific plugins and banners
- TypeScript compilation with path mapping
- Shared schema validation between frontend/backend

### Production Build
- Static frontend build via Vite
- Node.js backend compilation with esbuild
- Environment variable management
- Database migration system with Drizzle Kit

### Hosting Architecture
- **Frontend**: Netlify (static files)
- **Backend**: Render (Node.js server)
- **Database**: Supabase (managed PostgreSQL)
- **Repository**: GitHub for version control
- **Domain**: Custom domain with SSL

### Environment Configuration
- Development: Local Vite server + Express
- Production: Compiled assets + optimized bundle
- Database: Supabase connection with connection pooling
- Real-time: WebSocket connections for live updates