# Next.js Blog Application

A full-stack blog application built with Next.js, TypeScript, TypeORM, SQLite, and Tailwind CSS.

## Features

- **Blog Post Management**: Create, read, update, and delete blog posts
- **Admin Panel**: Protected admin interface for managing content
- **Authentication**: Basic JWT-based authentication for admin users
- **Markdown Support**: Write posts using Markdown syntax
- **Responsive Design**: Mobile-friendly with Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Database**: SQLite with TypeORM for data persistence

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see `.env` file for reference)
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Admin Credentials

- Username: `admin`
- Password: `admin123`

## Deployment with Coolify

This application is configured for easy deployment with Coolify:

1. The `Dockerfile` uses a multi-stage build for optimal image size
2. All necessary configuration files are at the root level
3. Environment variables are configured in `next.config.js`
4. SQLite database is included for simplicity

### Important Notes

- The default JWT secret should be changed in production
- Admin credentials should be updated in the `.env` file
- For production, consider using a more robust database than SQLite

## Project Structure

- `/src/pages` - Next.js pages and API routes
- `/src/entities` - TypeORM database entities
- `/src/lib` - Database configuration and utilities
- `/src/styles` - Global styles and Tailwind CSS
- `/public` - Static assets

## License

MIT