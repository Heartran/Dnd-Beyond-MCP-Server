@echo off
REM Script per commit come Claude della conversione completa a ES modules
REM Esegui questo script manualmente

cd /d C:\Users\Federico\repo\Dnd-Beyond-MCP-Server

echo === Impostazione identita Claude ===
set GIT_AUTHOR_NAME=Claude
set GIT_AUTHOR_EMAIL=claude@users.noreply.github.com
set GIT_COMMITTER_NAME=Claude
set GIT_COMMITTER_EMAIL=claude@users.noreply.github.com

echo.
echo === Branch corrente ===
git branch --show-current

echo.
echo === Status ===
git status --short

echo.
echo === Creazione branch feature/complete-ddb-conversion ===
git checkout -b feature/complete-ddb-conversion 2>nul
if errorlevel 1 (
    echo Branch gia esistente, switching...
    git checkout feature/complete-ddb-conversion
)

echo.
echo === Staging files ===
git add index.js
git add config.js
git add src/providers/index.js
git add src/providers/ddb/ddbProvider.js
git add src/models/character.js
git add src/storage/characterStore.js
git add test/run-tests.js
git add tests/normalize.test.js
git add README.md
git add package.json
git add MIGRATION.md
git add AGENTS.md

echo.
echo === Files staged ===
git status --short

echo.
echo === Commit ===
git commit -m "Complete Kanka to D&D Beyond conversion with ES modules" -m "" -m "- Convert entire codebase from CommonJS to ES modules" -m "- Update server name in logs to D&D Beyond MCP Server" -m "- Implement complete provider registry system with Map" -m "- Rewrite README focusing on D&D Beyond functionality" -m "- Add uuid dependency for character ID generation" -m "- Remove all Kanka references from documentation" -m "- Add MIGRATION.md with completion checklist" -m "- Add Claude to AGENTS.md git identity table" -m "- Fix all import/export statements for ES modules" -m "- Update test files for ES module compatibility" -m "- Add Jest configuration for ES modules"

echo.
echo === Ultimo commit ===
git log -1 --stat

echo.
echo === Ready to push ===
echo Run: git push origin feature/complete-ddb-conversion
pause
