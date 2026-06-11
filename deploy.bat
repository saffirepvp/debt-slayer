@echo off
copy /Y C:\Users\tyler\Downloads\DebtSlayer.jsx src\App.jsx 2>nul
copy /Y C:\Users\tyler\Downloads\BossArt.jsx src\BossArt.jsx 2>nul
copy /Y C:\Users\tyler\Downloads\main.jsx src\main.jsx 2>nul
copy /Y C:\Users\tyler\Downloads\index.html index.html 2>nul
del C:\Users\tyler\Downloads\DebtSlayer*.jsx C:\Users\tyler\Downloads\BossArt*.jsx C:\Users\tyler\Downloads\main*.jsx C:\Users\tyler\Downloads\index*.html 2>nul
git add .
git commit -m "update from claude"
git push
echo.
echo === DEPLOYED! Check Vercel in ~60 seconds ===
pause