$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$ReportsFolder = Join-Path $ProjectRoot "reports"
$DashboardDataFolder = Join-Path `
    $ProjectRoot `
    "scanguard-dashboard\public\data"

Write-Host ""
Write-Host "ScanGuard AI - Dashboard Data Sync"
Write-Host "=================================="

New-Item `
    -ItemType Directory `
    -Path $DashboardDataFolder `
    -Force | Out-Null

$RequiredFiles = @(
    "ai-analysis.json",
    "ai-llm-analysis.json"
)

foreach ($FileName in $RequiredFiles) {
    $Source = Join-Path $ReportsFolder $FileName
    $Destination = Join-Path $DashboardDataFolder $FileName

    if (Test-Path $Source) {
        Copy-Item `
            -Path $Source `
            -Destination $Destination `
            -Force

        Write-Host "[OK] Copied $FileName"
    }
    else {
        Write-Warning "Report not found: $Source"
    }
}

Write-Host ""
Write-Host "[OK] Dashboard data synchronization completed."
Write-Host ""