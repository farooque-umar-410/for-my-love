@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo ========================================================
echo Deploy 'For My Love' to GitHub and Vercel
echo ========================================================
echo.

set "GIT_EXE=git"
if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" set "GIT_EXE=%LOCALAPPDATA%\Programs\Git\cmd\git.exe"

set "GH_EXE=gh"
if exist "C:\Program Files\GitHub CLI\gh.exe" set "GH_EXE=C:\Program Files\GitHub CLI\gh.exe"

echo [1/3] Initializing and staging repository...
"!GIT_EXE!" init
"!GIT_EXE!" branch -M main
"!GIT_EXE!" add .
"!GIT_EXE!" commit -m "feat: a special interactive love website for my wife"

echo.
echo [2/3] Creating and pushing to GitHub repository 'for-my-love'...
"!GH_EXE!" repo create for-my-love --public --source=. --remote=origin --push

if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Repository exists, pushing latest commit...
    "!GIT_EXE!" push -u origin main
)

echo.
echo [3/3] Enabling GitHub Pages...
"!GH_EXE!" api -X POST "repos/farooque-umar-410/for-my-love/pages" -F "source[branch]=main" -F "source[path]=/docs" >nul 2>&1

for /f "delims=" %%i in ('"!GH_EXE!" repo view --json url -q .url 2^>nul') do set "REPO_URL=%%i"

echo.
echo ========================================================
if defined REPO_URL (
    echo SUCCESS! Repository is live on GitHub:
    echo !REPO_URL!
    echo.
    echo Live GitHub Pages Link (active in 1 minute):
    echo https://farooque-umar-410.github.io/for-my-love/
    echo.
    echo Deploy to Vercel in 1 click:
    echo https://vercel.com/new/import?s=!REPO_URL!
)
echo ========================================================
echo.
pause
