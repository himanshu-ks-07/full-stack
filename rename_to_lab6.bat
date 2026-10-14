@echo off
echo ==============================================
echo Renaming api-lab to labsheet6...
echo ==============================================

if exist "api-lab" (
    git mv "api-lab" "labsheet6" 2>nul
    if exist "api-lab" (
        move "api-lab" "labsheet6"
    )
    echo Folder renamed to labsheet6!
) else (
    echo api-lab folder not found or already renamed.
)

echo.
echo ==============================================
echo Pushing changes to GitHub...
echo ==============================================
git add -A
git commit -m "Rename api-lab to labsheet6"
git push -u origin main --force

echo.
echo ==============================================
echo SUCCESS! api-lab is now labsheet6 on GitHub!
echo ==============================================
