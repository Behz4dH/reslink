# Render Deployment Guide

This guide will help you deploy your Reslink application to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. Your code pushed to a GitHub repository
3. Supabase account for file storage (optional but recommended)

## Deployment Steps

### 1. Connect Your Repository

1. Log in to your Render dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository containing the Reslink project

### 2. Configure the Services

Render will use the `render.yaml` file in your project root to automatically configure:

- **Backend API**: Node.js web service
- **Frontend**: Static site
- **PostgreSQL Database**: Free tier database

### 3. Environment Variables

The following environment variables will be automatically set by Render:

- `NODE_ENV`: Set to "production"
- `PORT`: Set to 10000
- `DATABASE_URL`: Automatically provided by the PostgreSQL service
- `JWT_SECRET`: Auto-generated secure key

You'll need to manually add these environment variables in the Render dashboard:

#### Required Variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Your Supabase service role key

#### Optional Variables:
- `OPENAI_API_KEY`: If using AI features (Together AI or OpenAI)
- `RATE_LIMIT_WINDOW_MS`: Rate limit window (default: 60000)
- `RATE_LIMIT_MAX_REQUESTS`: Max requests per window (default: 100)

### 4. Database Setup

The PostgreSQL database will be automatically:
- Created with the name "reslink"
- Connected to your backend service
- Initialized with the required tables on first startup

### 5. Build Process

The services will build automatically:

**Backend:**
- Installs dependencies with `npm install`
- Builds TypeScript with `npm run build`
- Starts with `npm start`

**Frontend:**
- Installs dependencies with `npm install`
- Builds for production with `npm run build`
- Serves static files from `dist/`

### 6. Access Your Application

Once deployed, you'll receive URLs for:
- **Frontend**: `https://reslink-frontend.onrender.com`
- **Backend API**: `https://reslink-backend.onrender.com`

## Health Checks

Your backend includes health check endpoints:
- `/health`: Basic health check
- `/api/health`: API health check with database status

## Database Management

To run database operations in production:

```bash
# These commands won't work in production, database is auto-initialized
# Use the Render web console or connect directly to PostgreSQL if needed
```

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check the build logs in Render dashboard
   - Frontend uses `npx vite build --mode production` to bypass TypeScript strict checks
   - Backend builds with standard `npm run build`

2. **Database Connection**: Ensure DATABASE_URL is set correctly
   - Database will auto-initialize on first startup
   - Check logs for "✅ Production database initialized successfully!"

3. **Environment Variables**: Verify all required variables are set
   - `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are required for file uploads
   - Other variables have sensible defaults

4. **CORS Issues**: Update CORS_ORIGIN to match your frontend URL
   - Set to your frontend Render URL: `https://reslink-frontend.onrender.com`

### Logs:

View logs in the Render dashboard:
- Go to your service
- Click on "Logs" tab
- Monitor for any errors or issues

## Free Tier Limitations

Render free tier includes:
- Web services spin down after 15 minutes of inactivity
- PostgreSQL database with 1GB storage limit
- 512MB RAM per service

## Support

For deployment issues:
- Check Render documentation: https://render.com/docs
- View your service logs in the Render dashboard
- Ensure your GitHub repository is up to date