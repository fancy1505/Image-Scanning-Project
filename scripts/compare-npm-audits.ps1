function Get-AuditSummary {
    param(
        [string]$Application,
        [string]$Stage,
        [string]$Path
    )

    if (-not (Test-Path $Path)) {
        return [PSCustomObject]@{
            Application = $Application
            Stage       = $Stage
            Low         = "Missing"
            Moderate    = "Missing"
            High        = "Missing"
            Critical    = "Missing"
            Total       = "Missing"
        }
    }

    $audit = Get-Content $Path -Raw | ConvertFrom-Json
    $counts = $audit.metadata.vulnerabilities

    [PSCustomObject]@{
        Application = $Application
        Stage       = $Stage
        Low         = $counts.low
        Moderate    = $counts.moderate
        High        = $counts.high
        Critical    = $counts.critical
        Total       = $counts.total
    }
}

$results = @(
    Get-AuditSummary `
        -Application "Frontend" `
        -Stage "Before" `
        -Path ".\scans\shopnow-comparison\before\frontend\npm-audit.json"

    Get-AuditSummary `
        -Application "Frontend" `
        -Stage "After" `
        -Path ".\scans\shopnow-comparison\after\frontend\npm-audit.json"

    Get-AuditSummary `
        -Application "Admin" `
        -Stage "Before" `
        -Path ".\scans\shopnow-comparison\before\admin\npm-audit.json"

    Get-AuditSummary `
        -Application "Admin" `
        -Stage "After" `
        -Path ".\scans\shopnow-comparison\after\admin\npm-audit.json"
)

$results | Format-Table -AutoSize
$results | Export-Csv `
    ".\scans\shopnow-comparison\npm-before-after.csv" `
    -NoTypeInformation

Write-Host ""
Write-Host "Comparison saved to:"
Write-Host ".\scans\shopnow-comparison\npm-before-after.csv"
