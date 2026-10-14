@echo off
echo ========================================================
echo Removing assignment 1 and cleaning up all extra files...
echo ========================================================

:: 1. Delete assignment 1 folder
if exist "assignment 1" (
    rmdir /s /q "assignment 1"
    git rm -rf "assignment 1" 2>nul
    echo Removed assignment 1!
)

:: 2. Rename api-lab to labsheet6 if still present
if exist "api-lab" (
    git mv "api-lab" "labsheet6" 2>nul
    if exist "api-lab" (
        move "api-lab" "labsheet6"
    )
)

:: 3. Remove all loose files from root
del /f /q "organize_and_push.bat" 2>nul
del /f /q "rename_to_lab6.bat" 2>nul
del /f /q "README.md" 2>nul
del /f /q ".gitignore" 2>nul
del /f /q "LabSheet7_Solution.sql" 2>nul
del /f /q "run_lab7.py" 2>nul

:: 4. Commit and Force Push to GitHub
git add -A
git commit -m "Keep only labsheet1 to labsheet7"
git push -u origin main --force

echo ========================================================
echo SUCCESS! Only labsheet1 to labsheet7 remain!
echo ========================================================

:: Self-delete this batch file so root is 100%% clean
(goto) 2>nul & del "%~f0"
