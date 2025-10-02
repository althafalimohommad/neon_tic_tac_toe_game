@echo off
echo 🌟 NEON TIC-TAC-TOE DEPLOYMENT HELPER 🌟
echo.
echo Choose your deployment method:
echo.
echo 1. GitHub Pages (Recommended - Free)
echo 2. Netlify (Instant - Drag & Drop)
echo 3. Vercel (Professional)
echo 4. Create ZIP for manual upload
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto github
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto vercel
if "%choice%"=="4" goto zip
goto end

:github
echo.
echo 📁 GITHUB PAGES DEPLOYMENT
echo.
echo 1. Go to https://github.com/new
echo 2. Create repository named: neon-tic-tac-toe
echo 3. Make it PUBLIC
echo 4. Upload all files from this folder
echo 5. Go to Settings → Pages
echo 6. Enable GitHub Pages from main branch
echo.
echo Your URL will be: https://YOUR_USERNAME.github.io/neon-tic-tac-toe/
echo.
pause
goto end

:netlify
echo.
echo ⚡ NETLIFY DEPLOYMENT
echo.
echo 1. Go to https://netlify.com
echo 2. Sign up for free account
echo 3. Drag this entire folder to deploy area
echo 4. Get instant URL like: amazing-name-123456.netlify.app
echo 5. Optional: Change site name in settings
echo.
echo Opening Netlify...
start https://netlify.com
pause
goto end

:vercel
echo.
echo 🚀 VERCEL DEPLOYMENT
echo.
echo 1. Go to https://vercel.com
echo 2. Sign up with GitHub
echo 3. Import your GitHub repository
echo 4. Auto-deploy on every update!
echo.
echo Opening Vercel...
start https://vercel.com
pause
goto end

:zip
echo.
echo 📦 Creating deployment ZIP file...
powershell Compress-Archive -Path * -DestinationPath ../neon-tic-tac-toe-deploy.zip -Force
echo.
echo ✅ Created: neon-tic-tac-toe-deploy.zip
echo.
echo You can now upload this ZIP to any web hosting service!
echo.
pause
goto end

:end
echo.
echo 🎮 Your awesome neon game is ready to share with the world!
echo.
echo 💡 Pro Tips:
echo - Share on social media with screenshots
echo - Post on Reddit gamedev communities  
echo - Add to your portfolio/resume
echo - Consider making a YouTube demo video
echo.
pause