# ----------------------------
# Windows Frontend Rescue Script
# ----------------------------

# Go to the frontend folder
Set-Location -Path .\tcc

Write-Host "Step 1: Removing old build cache (.next)"
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
}

Write-Host "Step 2: Reinstalling all dependencies"
npm install

Write-Host "Step 3: Ensuring React 18 + TypeScript types are installed"
npm install react@18.2.0 react-dom@18.2.0 @types/react@18.2.0 @types/react-dom@18.2.0 typescript@5.2.2 --save-dev

Write-Host "Step 4: Set environment variable to disable Turbopack"
$env:NEXT_EXPERIMENTAL_TURBOPACK="0"

Write-Host "Step 5: Running type check"
npx tsc --noEmit

Write-Host "Step 6: Building frontend with Webpack"
npm run build

Write-Host "✅ Rescue complete! Frontend should now build successfully."
