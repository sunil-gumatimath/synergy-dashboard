# Supabase Setup Guide for Aurora Employee Management

This guide will walk you through setting up Supabase as the backend for the Employee Management System.

## 📋 Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js/Bun installed locally

## 🚀 Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in project details:
   - **Name**: `Aurora Employee Management` (or any name you prefer)
   - **Database Password**: Create a secure password (save this!)
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Select "Free" for development
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be provisioned

### 2. Set Up the Database Schema

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the `supabase-setup.sql` file in this project
4. Copy the entire SQL script and paste it into the Supabase SQL Editor
5. Click **"Run"** (or press `Ctrl+Enter` / `Cmd+Enter`)
6. You should see a success message confirming the table was created

### 3. Get Your API Credentials

1. In your Supabase project, click **"Settings"** (gear icon) in the bottom left
2. Click **"API"** in the left menu
3. You'll see two important values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **API Key (anon/public):**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Copy both values - you'll need them in the next step

### 4. Configure Your Local Environment

1. In the project root, create a file named `.env.local`:

   ```bash
   # Windows Command Prompt
   copy .env.example .env.local

   # PowerShell, macOS, or Linux
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace the placeholder values:

   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **⚠️ Important:** Never commit `.env.local` to version control! It's already in `.gitignore`.

### 5. Verify the Setup

1. Start your development server:

   ```bash
   bun run dev
   ```

2. Open the app in your browser (usually `http://localhost:5173`)
3. Navigate to the **Employees** section
4. You should see the sample employees loaded from Supabase!
5. Try adding a new employee to confirm everything works

## 🎯 What You Can Do Now

With Supabase configured, you now have full CRUD functionality:

- ✅ **Create** - Add new employees via the "Add Employee" button
- ✅ **Read** - View all employees from the database
- ✅ **Update** - Edit existing employee information
- ✅ **Delete** - Remove employees from the system
- ✅ **Search** - Search employees in real-time
- ✅ **Refresh** - Manually refresh the employee list

## 🛠️ Troubleshooting

### Issue: "Failed to load employees"

**Solution:**
- Check that your `.env.local` file exists and has the correct credentials
- Verify the Supabase project URL doesn't have trailing slashes
- Ensure your Supabase project is running (check the dashboard)

### Issue: "Row Level Security policy violation"

**Solution:**
- Make sure you ran the entire `supabase-setup.sql` script
- Check the "Authentication" → "Policies" section in Supabase
- Verify the policies are enabled for the `employees` table

### Issue: Environment variables not loading

**Solution:**
- Restart your development server after creating/updating `.env.local`
- Ensure variable names start with `VITE_` (required by Vite)
- Check for typos in variable names

## 📊 Viewing Your Data in Supabase

1. Go to your Supabase project dashboard
2. Click **"Table Editor"** in the left sidebar
3. Select the **"employees"** table
4. You can view, edit, and manage data directly from here

## 🔐 Security Notes

### For Development:
The current setup allows anonymous access for easy development. This is fine for local testing.

### For Production:
Before deploying, you should:

1. Remove the anonymous access policy:
   ```sql
   DROP POLICY "Enable all operations for anon users" ON employees;
   ```

2. Implement proper authentication (Supabase Auth)
3. Update RLS policies to restrict access based on user roles
4. Use environment-specific API keys

## 🎨 Next Steps

Now that you have Supabase connected, you can:

1. **Add Authentication** - Implement user login/signup with Supabase Auth
2. **Add More Features** - Analytics, reports, file uploads, etc.
3. **Deploy** - Deploy your app to Vercel, Netlify, or your preferred host
4. **Real-time Updates** - Use Supabase real-time subscriptions for live data

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Need Help?

If you encounter any issues:

1. Check the browser console for error messages
2. Review the Supabase project logs (Dashboard → Logs)
3. Verify all environment variables are set correctly
4. Ensure the database schema was created successfully

---

**Happy coding! 🚀**
