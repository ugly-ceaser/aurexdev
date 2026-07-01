# PowerShell script to delete package by name
# Usage: .\scripts\delete-package.ps1 "Diamond"

param(
    [Parameter(Mandatory=$true)]
    [string]$PackageName
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Delete Package Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Run the Node.js script
Write-Host "Deleting package: $PackageName" -ForegroundColor Yellow
Write-Host ""

node scripts/delete-package.js "$PackageName"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "  Package Deleted Successfully!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host "  Package Deletion Failed!" -ForegroundColor Red
    Write-Host "=====================================" -ForegroundColor Red
}
