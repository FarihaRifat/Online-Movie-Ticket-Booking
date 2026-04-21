# ============================================
# MOVIE TICKET BOOKING APP - DEPLOYMENT GUIDE
# ============================================

## 📋 DEPLOYMENT CHECKLIST

### 1. SUPABASE DATABASE SETUP
- [ ] Go to https://supabase.com
- [ ] Create new project or use existing one
- [ ] Go to SQL Editor in Supabase Dashboard
- [ ] Copy and paste the entire contents of SUPABASE_SETUP.sql
- [ ] Run the SQL script
- [ ] Verify tables are created: movies, times, bookings

### 2. VERIFY DATABASE CONNECTION
- [ ] Check that your Supabase credentials are correct in backend-config.php
- [ ] Test connection by running the app locally

### 3. DEPLOYMENT STEPS
- [ ] Deploy frontend to hosting service (Vercel, Netlify, etc.)
- [ ] Deploy backend to hosting service (Heroku, Railway, etc.)
- [ ] Update API endpoints in frontend configuration
- [ ] Test booking functionality

## 🔧 DATABASE SCHEMA

### Tables Created:
1. **movies** - Movie information
   - id (SERIAL PRIMARY KEY)
   - title (VARCHAR(255))
   - description (TEXT)
   - poster_url (VARCHAR(500))
   - price (DECIMAL(10,2))
   - created_at (TIMESTAMP)

2. **times** - Showtimes for movies
   - id (SERIAL PRIMARY KEY)
   - movie_id (INT, FOREIGN KEY)
   - time (VARCHAR(10))
   - created_at (TIMESTAMP)

3. **bookings** - Ticket bookings
   - id (SERIAL PRIMARY KEY)
   - movie_id (INT, FOREIGN KEY)
   - showtime (VARCHAR(255))
   - seats (VARCHAR(255))
   - total_amount (DECIMAL(10,2))
   - contact_number (VARCHAR(20))
   - created_at (TIMESTAMP)

### Indexes Created:
- idx_times_movie_id
- idx_bookings_movie_id
- idx_bookings_contact

## 🚀 QUICK START

1. **Setup Supabase Database:**
   ```sql
   -- Run SUPABASE_SETUP.sql in Supabase SQL Editor
   ```

2. **Deploy Backend:**
   - Upload backend/ folder to hosting service
   - Ensure PHP 8.2+ with PDO PostgreSQL extension
   - Update database credentials if needed

3. **Deploy Frontend:**
   - Upload frontend/ folder to hosting service
   - Update API_ENDPOINTS in apiConfig.js if backend URL changes

4. **Test Booking:**
   - Create booking through frontend
   - Check Supabase dashboard - booking should appear in bookings table

## ✅ VERIFICATION STEPS

After deployment, verify:
- [ ] Movies load from database
- [ ] Booking creates entry in Supabase bookings table
- [ ] Teacher can see bookings in Supabase dashboard
- [ ] All CRUD operations work (Create, Read, Update, Delete movies)

## 🔍 TROUBLESHOOTING

If bookings don'\''t appear in Supabase:
1. Check backend-config.php credentials
2. Verify Supabase project is active
3. Check PHP error logs
4. Test database connection manually

## 📞 SUPPORT

Your app is now configured for Supabase PostgreSQL deployment!
All bookings will be stored in your Supabase database for your teacher to verify.
