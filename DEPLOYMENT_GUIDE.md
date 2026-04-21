# Deployment Guide - Online Movie Ticket Booking

## ✅ Completed Setup

Your project has been fully configured with Supabase PostgreSQL backend. All files are ready to deploy!

## 📁 Files Created

### Backend Files (PHP - for web server)
- `backend-config.php` - Supabase database configuration
- `backend-getMovies.php` - Fetch all movies
- `backend-createMovie.php` - Add new movies
- `backend-updateMovie.php` - Update movies
- `backend-deleteMovie.php` - Delete movies
- `backend-bookSeats.php` - Create bookings

### Frontend Configuration
- `apiConfig.js` - API endpoints configuration
- Updated `App.jsx` - Uses new API endpoints
- Updated `MovieManagement.jsx` - Uses new API endpoints

### Database
- `database-supabase.sql` - PostgreSQL schema (already imported to Supabase ✅)

---

## 🚀 Deployment Options

### Option 1: Local Development (XAMPP)

#### Step 1: Setup XAMPP
1. Start XAMPP Control Panel
2. Start Apache (required for PHP)
3. MySQL is NOT needed (we're using Supabase)

#### Step 2: Copy Backend Files
1. Go to: `C:\xampp\htdocs\`
2. Create folder: `movie-booking-app`
3. Copy all `backend-*.php` and `backend-config.php` files here

#### Step 3: Update API Configuration
1. Open `apiConfig.js`
2. Ensure `API_BASE_URL` is set to: `http://localhost/movie-booking-app`
3. Save the file

#### Step 4: Run the App
```bash
npm install
npm run dev
```

Access at: `http://localhost:3004`

---

### Option 2: Remote Server Deployment (Recommended for Submission)

#### Step 1: Upload Backend Files
1. Use FTP/SFTP to upload all `backend-*.php` files to your hosting provider
2. Location: `/public_html/` or similar

#### Step 2: Update API Configuration
1. Open `apiConfig.js`
2. Change `API_BASE_URL` to your domain:
```javascript
export const API_BASE_URL = "https://your-domain.com";
```

#### Step 3: Deploy Frontend (use Vercel, Netlify, etc.)
```bash
npm run build
# Upload dist folder to hosting
```

---

### Option 3: Docker Deployment (Advanced)

If you want containerized deployment, create a `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    image: node:18
    working_dir: /app
    volumes:
      - .:/app
    ports:
      - "3004:3004"
    command: npm run dev
```

Run: `docker-compose up`

---

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **Move credentials to environment variables:**
   ```php
   $db_password = getenv('SUPABASE_PASSWORD');
   ```

2. **Add .env file (don't commit to GitHub):**
   ```
   SUPABASE_HOST=db.bxlwxucefflxeiyqeoew.supabase.co
   SUPABASE_PASSWORD=your_password_here
   SUPABASE_DB=postgres
   SUPABASE_USER=postgres
   ```

3. **Enable HTTPS** on production servers

4. **Add Rate Limiting** to backend files

---

## ✅ Database Verification

Your Supabase database is already set up with:
- ✅ `movies` table
- ✅ `showtimes` table
- ✅ `bookings` table
- ✅ All relationships and indexes

Connection Details (saved):
```
Host: db.bxlwxucefflxeiyqeoew.supabase.co
Port: 5432
Database: postgres
User: postgres
```

---

## 🧪 Testing the API

### Test Get Movies
```bash
curl http://localhost/movie-booking-app/backend-getMovies.php
```

### Test Create Movie
```bash
curl -X POST http://localhost/movie-booking-app/backend-createMovie.php \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Movie",
    "description": "Test Description",
    "posterUrl": "https://example.com/poster.jpg",
    "price": 200
  }'
```

---

## 📋 Submission Checklist

- ✅ GitHub repository: https://github.com/FarihaRifat/Online-Movie-Ticket-Booking
- ✅ Clean database (no old entries)
- ✅ Backend configured with Supabase
- ✅ Frontend configured with correct API endpoints
- ✅ Dependencies installed (`npm install` done)
- ✅ Ready to deploy

---

## 🆘 Troubleshooting

### "Connection refused" error
- Verify Supabase credentials in `backend-config.php`
- Check internet connection (Supabase is cloud-based)
- Ensure PHP has `pdo_pgsql` extension enabled

### "API endpoints not found"
- Verify backend files are in the correct location
- Check `apiConfig.js` has correct `API_BASE_URL`
- Ensure Apache is running (for local dev)

### CORS errors
- CORS headers are already enabled in all backend files
- If still getting errors, check browser console for details

---

## 📞 Quick Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Install dependencies
npm install
```

---

## ✨ You're All Set!

The project is now fully prepared for handover. Your junior can:
1. Clone from GitHub
2. Run `npm install`
3. Deploy backend files to a web server
4. Update `apiConfig.js` with the correct server URL
5. Start developing!

Good luck with your submission! 🎉
