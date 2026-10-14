@echo off
echo ==============================================
echo Organizing Lab Folders and Pushing to GitHub...
echo ==============================================

if exist "My store\labsheet1" (
    echo Moving labsheet1...
    move "My store\labsheet1" "labsheet1"
)

if exist "My store\labsheet 2" (
    echo Moving labsheet 2 to labsheet2...
    move "My store\labsheet 2" "labsheet2"
)

if exist "My store" (
    echo Removing empty "My store" folder...
    rmdir /s /q "My store"
)

if exist "LabSheet7_Solution.sql" (
    del /f /q "LabSheet7_Solution.sql"
)

if exist "run_lab7.py" (
    del /f /q "run_lab7.py"
)

echo.
echo ==============================================
echo Pushing changes to GitHub...
echo ==============================================
git add -A
git commit -m "Organize all labs into separate folders labsheet1 to labsheet7"
git push -u origin main --force

echo.
echo ==============================================
echo SUCCESS! Everything updated on GitHub.
echo ==============================================
