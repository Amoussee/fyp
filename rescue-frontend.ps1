# ----------------------------
# Frontend Rescue Script - Windows
# ----------------------------

# Move to frontend folder
Set-Location -Path .\tcc

Write-Host "Step 1: Removing old build cache (.next)"
Remove-Item -Recurse -Force .next

Write-Host "Step 2: Reinstalling all dependencies"
npm install

# Ensure React 18 + types are installed
Write-Host "Step 3: Ensuring React and TypeScript types are correct"
npm install react@18.2.0 react-dom@18.2.0 @types/react@18.2.0 @types/react-dom@18.2.0 typescript@5.2.2 --save-dev

Write-Host "Step 4: Cleaning old Next.js build / SWC binaries"
Remove-Item -Recurse -Force node_modules/.cache,@.next/cache,@.next/build @* -ErrorAction SilentlyContinue

Write-Host "Step 5: Running type check"
npx tsc --noEmit

Write-Host "Step 6: Building frontend (Next.js + Tailwind + LightningCSS)"
# Use NEXT_EXPERIMENTAL_TURBOPACK=0 if Turbopack fails
npx next build

Write-Host "✅ Rescue complete! Frontend should now build successfully."
