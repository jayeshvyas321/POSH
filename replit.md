# React.js Enterprise Application Template

## Overview

This is a reusable React.js enterprise application template with comprehensive authentication, user management, and training features. Built with modern technologies including React (Vite), Express.js, TypeScript, and component-based architecture. The template features role-based access control and can be easily adapted for various business applications like loan processing, POSH compliance training, or any enterprise management system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context for auth and notifications, TanStack Query for server state
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: In-memory storage fallback for development

### Key Components

#### Authentication & Authorization
- Role-based access control (admin, manager, employee)
- Protected routes with role validation
- Session-based authentication
- Password-based login (production would use hashed passwords)

#### Database Schema
- **Users**: Authentication and profile information with role-based permissions
- **Trainings**: Training content with metadata (duration, category, creator)
- **UserTrainings**: Junction table tracking user progress and completion
- **Notifications**: User-specific notifications with read status

#### UI Components
- Modular component architecture using Shadcn/ui
- Responsive design with mobile-first approach
- Dark/light theme support built into CSS variables
- Comprehensive component library including forms, charts, and data tables

### Data Flow

1. **Authentication Flow**: Users authenticate via login form → session stored → role-based route protection
2. **Training Assignment**: Admins/managers create trainings → assign to users → progress tracking
3. **Progress Tracking**: Users access assigned trainings → progress updates stored → completion status tracked
4. **Notifications**: System generates notifications for training assignments and completions
5. **Reporting**: Aggregated data views for admins/managers with export capabilities

### External Dependencies

#### Frontend Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Form validation integration
- **@radix-ui/react-***: Accessible UI primitives
- **recharts**: Chart and data visualization components
- **date-fns**: Date manipulation and formatting
- **wouter**: Lightweight routing library

#### Backend Dependencies
- **drizzle-orm**: Type-safe SQL query builder
- **@neondatabase/serverless**: Neon PostgreSQL driver
- **express**: Web application framework
- **zod**: Runtime type validation and schema definition

#### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **tailwindcss**: Utility-first CSS framework
- **postcss**: CSS processing and optimization

### Deployment Strategy

#### Development
- Vite dev server with HMR for frontend development
- Express server with tsx for backend development
- In-memory storage fallback when database is unavailable
- Replit-specific plugins for enhanced development experience

#### Production Build
- Frontend: Vite builds optimized static assets to `dist/public`
- Backend: esbuild bundles Express server to `dist/index.js`
- Database: Drizzle migrations applied via `db:push` command
- Environment: Neon PostgreSQL database via `DATABASE_URL`

#### Architecture Decisions

**Database Choice**: PostgreSQL with Drizzle ORM chosen for:
- Type safety and excellent TypeScript integration
- Serverless compatibility with Neon
- Schema migration capabilities
- SQL flexibility for complex queries

**Frontend Stack**: React + Vite chosen for:
- Fast development experience with HMR
- Modern build tooling and optimization
- Excellent TypeScript support
- Rich ecosystem compatibility

**Component Strategy**: Shadcn/ui chosen for:
- Customizable, accessible components
- Consistent design system
- TypeScript-first approach
- Easy theming and styling

**State Management**: Context + TanStack Query chosen for:
- Separation of client and server state concerns
- Built-in caching and synchronization
- Optimistic updates and error handling
- Minimal boilerplate compared to Redux

## Recent Changes (August 4, 2025)

✓ **Fixed Issues Based on User Feedback:**
  - Fixed logout flow to redirect to login page after logout
  - Removed all training-related sections from UI and backend
  - Simplified permissions system - removed training-specific permissions
  - Maintained existing design unchanged as requested

✓ **Cleaned Up System Architecture:**
  - Removed training tables and routes from database schema
  - Simplified navigation menu to remove training section
  - Updated sample permissions to focus on core functionality:
    - Admin: user_view, user_edit, user_create, user_delete, reports_view, settings_manage
    - Manager: user_view, user_edit, reports_view
    - Employee: No special permissions (basic access only)

✓ **Base Template Preparation:**
  - Created clean, reusable base template focused on user management
  - Admin role hardcoded with full permissions
  - System ready for future feature additions as needed
  - Dashboard shows user statistics instead of training metrics

## Template Features

The template is designed to be:
- **Reusable**: Easy to adapt for different business domains
- **Scalable**: Component-based architecture for maintainability  
- **API-ready**: Prepared for backend integration with clear API endpoints
- **Role-based**: Flexible permission system for different user types
- **Modern**: Built with latest React and TypeScript best practices

The system can serve as a foundation for various enterprise applications while providing comprehensive user management and role-based access control capabilities.