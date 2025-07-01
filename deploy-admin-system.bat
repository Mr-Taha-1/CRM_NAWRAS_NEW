@echo off
echo ========================================
echo   DEPLOY ADMIN ROLE SYSTEM
echo ========================================
echo.

echo 🚀 Starting deployment process...
echo.

REM Navigate to the correct directory
cd crmnew-main

echo 📁 Current directory: %CD%
echo.

REM Check if Git is initialized
if not exist ".git" (
    echo 🔧 Initializing Git repository...
    git init
    echo ✅ Git initialized
) else (
    echo ✅ Git already initialized
)
echo.

REM Create .gitignore if it doesn't exist
if not exist ".gitignore" (
    echo 📝 Creating .gitignore...
    echo node_modules/ > .gitignore
    echo .next/ >> .gitignore
    echo .env.local >> .gitignore
    echo ✅ .gitignore created
) else (
    echo ✅ .gitignore already exists
)
echo.

REM Check if critical admin files exist
echo 🔍 Checking critical admin files...
if exist "app\dashboard\admin\page.tsx" (
    echo ✅ Admin dashboard page found
) else (
    echo ❌ Admin dashboard page missing
)

if exist "app\dashboard\admin\users\page.tsx" (
    echo ✅ User management page found
) else (
    echo ❌ User management page missing
)

if exist "app\dashboard\admin\reports\page.tsx" (
    echo ✅ System reports page found
) else (
    echo ❌ System reports page missing
)

if exist "hooks\use-role.ts" (
    echo ✅ Role hooks found
) else (
    echo ❌ Role hooks missing
)
echo.

REM Add files to Git
echo 📦 Adding files to Git...
git add .
echo ✅ Files added to Git
echo.

REM Commit changes
echo 💾 Committing changes...
git commit -m "Deploy admin role system with all features - Admin dashboard, user management, system reports, role-based access control"
echo ✅ Changes committed
echo.

echo 🎯 DEPLOYMENT OPTIONS:
echo.
echo 1. VERCEL CLI DEPLOYMENT (Recommended)
echo    Run: npx vercel --prod
echo.
echo 2. GITHUB + VERCEL DEPLOYMENT
echo    a) Create repository on GitHub
echo    b) Run: git remote add origin YOUR_GITHUB_URL
echo    c) Run: git push -u origin main
echo    d) Connect repository to Vercel
echo.
echo 3. MANUAL DEPLOYMENT
echo    Upload the entire crmnew-main folder to your hosting platform
echo.

echo 🧪 AFTER DEPLOYMENT:
echo    Run: node ..\FINAL_DEPLOYMENT_VERIFICATION.js
echo.

echo ========================================
echo   DEPLOYMENT PREPARATION COMPLETE!
echo ========================================
echo.
echo 📋 Next Steps:
echo 1. Choose a deployment method above
echo 2. Execute the deployment
echo 3. Run verification script
echo 4. Test admin features on live site
echo.

pause
