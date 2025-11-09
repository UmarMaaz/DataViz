# Deployment Guide

## Vercel Deployment

### Step 1: Push to GitHub
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Step 3: Configure Environment
1. Go to Settings → Environment Variables
2. Add any required API keys:
   - Gemini API key (if using custom key)
   - Backend API URL (if using FastAPI backend)

### Step 4: Deploy
Click "Deploy" - Vercel will build and deploy automatically!

## Local Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit http://localhost:3000

## Python Backend Deployment (Optional)

Deploy the FastAPI backend separately:

### Using Railway
1. Push backend folder to GitHub
2. Go to https://railway.app
3. Create new project
4. Connect GitHub repository
5. Set \`requirements.txt\` as Python requirements
6. Deploy

### Using Render
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Set start command: \`python -m uvicorn main:app --host 0.0.0.0\`
5. Deploy

## Database (Optional)

For production with persistent storage:

1. Add Supabase or PostgreSQL integration to Vercel
2. Update file storage to use Blob storage instead of public/uploads
3. Implement caching for processed datasets

## Monitoring

1. Vercel Analytics - Monitor performance
2. Vercel Logs - Debug issues
3. Error tracking - Catch issues early

## Performance Tips

1. Enable caching for CSV data
2. Paginate large datasets
3. Use CDN for static assets
4. Implement rate limiting on API routes
5. Cache Gemini API responses
\`\`\`
