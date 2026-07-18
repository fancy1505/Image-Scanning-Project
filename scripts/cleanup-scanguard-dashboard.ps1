$ErrorActionPreference = "Stop"

# ============================================================
# ScanGuard AI - Grafana Dashboard Cleanup
# ============================================================

$GrafanaUrl = "http://localhost:3000"
$DashboardUid = "scanguard-ai-devsecops"
$GrafanaUser = "admin"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackupDirectory = Join-Path $ProjectRoot "reports\grafana-backups"

Write-Host ""
Write-Host "ScanGuard AI - Dashboard Cleanup"
Write-Host "================================"

$SecurePassword = Read-Host "Enter Grafana admin password" -AsSecureString
$Credential = New-Object System.Management.Automation.PSCredential($GrafanaUser, $SecurePassword)
$BasicAuth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("$($Credential.UserName):$($Credential.GetNetworkCredential().Password)"))

$Headers = @{
    Authorization  = "Basic $BasicAuth"
    "Content-Type" = "application/json"
}

Write-Host "Checking Grafana..."
$Health = Invoke-RestMethod -Method Get -Uri "$GrafanaUrl/api/health"
Write-Host "Grafana database: $($Health.database)"

$DashboardResponse = Invoke-RestMethod -Method Get -Uri "$GrafanaUrl/api/dashboards/uid/$DashboardUid" -Headers $Headers
$Dashboard = $DashboardResponse.dashboard
Write-Host "Dashboard found: $($Dashboard.title)"

New-Item -ItemType Directory -Path $BackupDirectory -Force | Out-Null
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$BackupFile = Join-Path $BackupDirectory "scanguard-dashboard-$Timestamp.json"
$DashboardResponse | ConvertTo-Json -Depth 100 | Set-Content -Path $BackupFile -Encoding UTF8
Write-Host "Backup created: $BackupFile"

$SectionHeaderIds = @(401, 402, 403, 404)
$Dashboard.panels = @(
    $Dashboard.panels | Where-Object {
        $panel = $_
        $isGeneratedHeader = $panel.id -in $SectionHeaderIds
        $isOldStaticPipelinePanel = ($panel.title -eq "Pipeline Status" -and $panel.type -eq "text")
        -not ($isGeneratedHeader -or $isOldStaticPipelinePanel)
    }
)

function Get-PanelById {
    param([int]$Id)
    return $Dashboard.panels | Where-Object { $_.id -eq $Id } | Select-Object -First 1
}

function Set-PanelLayout {
    param(
        [int]$Id,
        [string]$Title,
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height
    )

    $Panel = Get-PanelById -Id $Id
    if ($null -eq $Panel) {
        Write-Warning "Panel ID $Id not found: $Title"
        return
    }

    $Panel.title = $Title
    $Panel.gridPos = @{ x = $X; y = $Y; w = $Width; h = $Height }
}

function New-SectionHeader {
    param(
        [int]$Id,
        [string]$Title,
        [string]$Subtitle,
        [int]$Y
    )

    return @{
        id    = $Id
        title = $Title
        type  = "text"
        gridPos = @{ x = 0; y = $Y; w = 24; h = 2 }
        fieldConfig = @{ defaults = @{}; overrides = @() }
        options = @{ mode = "markdown"; content = "## $Title`n$Subtitle" }
        transparent = $true
    }
}

$TrivyHeader = New-SectionHeader -Id 401 -Title "Trivy Container Security" -Subtitle "Image vulnerability posture, deployment readiness, and risk trends." -Y 0
Set-PanelLayout -Id 1 -Title "Images Scanned" -X 0 -Y 2 -Width 4 -Height 4
Set-PanelLayout -Id 2 -Title "Critical Vulnerabilities" -X 4 -Y 2 -Width 4 -Height 4
Set-PanelLayout -Id 3 -Title "High Vulnerabilities" -X 8 -Y 2 -Width 4 -Height 4
Set-PanelLayout -Id 4 -Title "Medium Vulnerabilities" -X 12 -Y 2 -Width 4 -Height 4
Set-PanelLayout -Id 5 -Title "Low Vulnerabilities" -X 16 -Y 2 -Width 4 -Height 4
Set-PanelLayout -Id 6 -Title "Failed Images" -X 20 -Y 2 -Width 4 -Height 4
Set-PanelLayout -Id 7 -Title "Passed Images" -X 0 -Y 6 -Width 4 -Height 8
Set-PanelLayout -Id 8 -Title "Overall Risk Score" -X 4 -Y 6 -Width 8 -Height 8
Set-PanelLayout -Id 9 -Title "Vulnerability Trend" -X 12 -Y 6 -Width 12 -Height 8
Set-PanelLayout -Id 10 -Title "Vulnerabilities by Image and Severity" -X 0 -Y 14 -Width 12 -Height 9
Set-PanelLayout -Id 11 -Title "Most Vulnerable Images" -X 12 -Y 14 -Width 12 -Height 9

$FsHeader = New-SectionHeader -Id 402 -Title "Trivy Filesystem Security" -Subtitle "Source-tree and dependency findings detected before image deployment." -Y 23
Set-PanelLayout -Id 12 -Title "Filesystem Critical Vulnerabilities" -X 0 -Y 25 -Width 12 -Height 5
Set-PanelLayout -Id 13 -Title "Filesystem High Vulnerabilities" -X 12 -Y 25 -Width 12 -Height 5

$SonarHeader = New-SectionHeader -Id 403 -Title "SonarCloud Code Security" -Subtitle "Static analysis, quality gate, reliability, and application security posture." -Y 30
Set-PanelLayout -Id 101 -Title "Quality Gate" -X 0 -Y 32 -Width 4 -Height 5
Set-PanelLayout -Id 102 -Title "Bugs" -X 4 -Y 32 -Width 4 -Height 5
Set-PanelLayout -Id 103 -Title "Vulnerabilities" -X 8 -Y 32 -Width 4 -Height 5
Set-PanelLayout -Id 104 -Title "Code Smells" -X 12 -Y 32 -Width 4 -Height 5
Set-PanelLayout -Id 105 -Title "Security Hotspots" -X 16 -Y 32 -Width 4 -Height 5
Set-PanelLayout -Id 106 -Title "Security Rating" -X 20 -Y 32 -Width 2 -Height 5
Set-PanelLayout -Id 107 -Title "API Status" -X 22 -Y 32 -Width 2 -Height 5

$PipelineHeader = New-SectionHeader -Id 404 -Title "Secrets and CI/CD Pipeline" -Subtitle "GitLeaks secret detection and the latest GitHub Actions pipeline health." -Y 37
Set-PanelLayout -Id 201 -Title "GitLeaks Secret Scan" -X 0 -Y 39 -Width 6 -Height 5
Set-PanelLayout -Id 202 -Title "Secrets Detected" -X 6 -Y 39 -Width 6 -Height 5
Set-PanelLayout -Id 301 -Title "GitHub Actions Pipeline" -X 12 -Y 39 -Width 4 -Height 5
Set-PanelLayout -Id 302 -Title "Latest Run Duration" -X 16 -Y 39 -Width 4 -Height 5
Set-PanelLayout -Id 303 -Title "Total Pipeline Runs" -X 20 -Y 39 -Width 4 -Height 5

$Dashboard.panels += @($TrivyHeader, $FsHeader, $SonarHeader, $PipelineHeader)
$Dashboard.title = "ScanGuard AI - DevSecOps Security Command Center"
$Dashboard.tags = @("devsecops", "container-security", "trivy", "sonarcloud", "gitleaks", "github-actions")
$Dashboard.refresh = "10s"
$Dashboard.time = @{ from = "now-6h"; to = "now" }
$Dashboard.timezone = "browser"

$Payload = @{
    dashboard = $Dashboard
    overwrite = $true
    message = "Clean and organize ScanGuard AI dashboard"
} | ConvertTo-Json -Depth 100

Write-Host "Updating dashboard layout..."
$Result = Invoke-RestMethod -Method Post -Uri "$GrafanaUrl/api/dashboards/db" -Headers $Headers -Body $Payload

Write-Host ""
Write-Host "CLEANUP COMPLETE"
Write-Host "================"
Write-Host "Dashboard: $($Dashboard.title)"
Write-Host "Removed: obsolete static Pipeline Status panel"
Write-Host "Sections: Trivy, Filesystem, SonarCloud, Secrets and CI/CD"
Write-Host "Backup: $BackupFile"
Write-Host "Grafana status: $($Result.status)"
Write-Host ""
Write-Host "Open:"
Write-Host "$GrafanaUrl/d/$DashboardUid"