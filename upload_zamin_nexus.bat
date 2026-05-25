@echo off
echo ==========================================
echo   GitHub Upload Script
echo   Repo: Zamin-the-Shadow/Zamin-Nexus
echo ==========================================
echo.

:: Step 1 - Go to project folder
echo [1/7] Opening project folder...
cd /d "D:\C Program\DevelopersHub Corporation Internship\Zamin Nexus\Zamin Nexus main"
echo Done!
echo.

:: Step 2 - Install Git LFS
echo [2/7] Setting up Git LFS...
git lfs install
echo Done!
echo.

:: Step 3 - Track common large file types
echo [3/7] Tracking large file types...
git lfs track "*.db"
git lfs track "*.sqlite"
git lfs track "*.zip"
git lfs track "*.rar"
git lfs track "*.exe"
git lfs track "*.dll"
git lfs track "*.mp4"
git lfs track "*.avi"
git lfs track "*.mkv"
git lfs track "*.pdf"
git lfs track "*.psd"
git lfs track "*.iso"
git lfs track "*.bin"
git lfs track "*.bak"
echo Done!
echo.

:: Step 4 - Initialize git if not already
echo [4/7] Initializing Git...
git init
git branch -M main
echo Done!
echo.

:: Step 5 - Set remote origin
echo [5/7] Connecting to GitHub repository...
git remote remove origin 2>nul
git remote add origin https://github.com/Zamin-the-Shadow/Zamin-Nexus.git
echo Done!
echo.

:: Step 6 - Add all files
echo [6/7] Adding all project files...
git add .
git commit -m "Upload Zamin Nexus project"
echo Done!
echo.

:: Step 7 - Force push to GitHub
echo [7/7] Uploading to GitHub...
git push -u origin main --force
echo.

echo ==========================================
echo   Upload Complete!
echo   Check: https://github.com/Zamin-the-Shadow/Zamin-Nexus
echo ==========================================
pause
