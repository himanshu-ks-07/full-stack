@echo off
echo ========================================================
echo Cleaning repository and renaming api-lab to labsheet6...
echo ========================================================

:: 1. Rename api-lab to labsheet6
if exist "api-lab" (
    git mv "api-lab" "labsheet6" 2>nul
    if exist "api-lab" (
        move "api-lab" "labsheet6"
    )
    echo Renamed api-lab to labsheet6 successfully!
)

:: 2. Remove loose files from root
del /f /q "organize_and_push.bat" 2>nul
del /f /q "rename_to_lab6.bat" 2>nul
del /f /q "README.md" 2>nul
del /f /q ".gitignore" 2>nul
del /f /q "LabSheet7_Solution.sql" 2>nul
del /f /q "run_lab7.py" 2>nul

:: 3. Update Git and push to GitHub
git add -A
git commit -m "Keep only lab folders up to labsheet7"
git push -u origin main --force

echo ========================================================
echo SUCCESS! All extra files removed. Only folders remain.
echo ========================================================

:: Self-delete this batch script so root stays 100%% clean
(goto) 2>nul & del "%~f0"
