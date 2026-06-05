Push-Location -LiteralPath $PSScriptRoot
Write-Host "Starting Apex Skills frontend dev server from $PWD"
npm run dev
Pop-Location
