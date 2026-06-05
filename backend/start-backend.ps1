Push-Location -LiteralPath $PSScriptRoot
Write-Host "Starting Apex Skills backend from $PWD"
node .\server.js
Pop-Location
