$ErrorActionPreference = "Stop"

# ============================================================
# ScanGuard AI - Unified Grafana Security Panels Automation
# Adds / refreshes:
#   - SonarCloud panels
#   - GitLeaks panels
#   - GitHub Actions panels
# ============================================================

$GrafanaUrl = "http://localhost:3000"
$DashboardUid = "scanguard-ai-devsecops"
$GrafanaUser = "admin"
$PrometheusUid = "prometheus"

Write-Host ""
Write-Host "ScanGuard AI - Unified Grafana Automation"
Write-Host "=========================================="

$SecurePassword = Read-Host "Enter Grafana admin password" -AsSecureString

$Credential = New-Object System.Management.Automation.PSCredential(
    $GrafanaUser,
    $SecurePassword
)

$BasicAuth = [Convert]::ToBase64String(
    [Text.Encoding]::ASCII.GetBytes(
        "$($Credential.UserName):$($Credential.GetNetworkCredential().Password)"
    )
)

$Headers = @{
    Authorization  = "Basic $BasicAuth"
    "Content-Type" = "application/json"
}

Write-Host "Checking Grafana..."

$Health = Invoke-RestMethod `
    -Method Get `
    -Uri "$GrafanaUrl/api/health"

Write-Host "Grafana database: $($Health.database)"
Write-Host "Loading dashboard UID: $DashboardUid"

$DashboardResponse = Invoke-RestMethod `
    -Method Get `
    -Uri "$GrafanaUrl/api/dashboards/uid/$DashboardUid" `
    -Headers $Headers

$Dashboard = $DashboardResponse.dashboard

Write-Host "Dashboard found: $($Dashboard.title)"

$AutomatedPanelIds = @(
    101, 102, 103, 104, 105, 106, 107,
    201, 202,
    301, 302, 303
)

$Dashboard.panels = @(
    $Dashboard.panels | Where-Object {
        $_.id -notin $AutomatedPanelIds
    }
)

function New-StatPanel {
    param(
        [int]$Id,
        [string]$Title,
        [string]$Metric,
        [int]$X,
        [int]$Y,
        [int]$Width,
        [int]$Height = 5,
        [array]$Mappings = @(),
        [array]$ThresholdSteps,
        [string]$Unit = "short"
    )

    return @{
        id    = $Id
        title = $Title
        type  = "stat"
        gridPos = @{
            h = $Height
            w = $Width
            x = $X
            y = $Y
        }
        datasource = @{
            type = "prometheus"
            uid  = $PrometheusUid
        }
        targets = @(
            @{
                expr  = $Metric
                refId = "A"
                datasource = @{
                    type = "prometheus"
                    uid  = $PrometheusUid
                }
            }
        )
        fieldConfig = @{
            defaults = @{
                unit = $Unit
                color = @{
                    mode = "thresholds"
                }
                mappings = $Mappings
                thresholds = @{
                    mode  = "absolute"
                    steps = $ThresholdSteps
                }
            }
            overrides = @()
        }
        options = @{
            colorMode   = "background"
            graphMode   = "none"
            justifyMode = "center"
            orientation = "auto"
            textMode    = "auto"
            wideLayout  = $true
            reduceOptions = @{
                calcs  = @("lastNotNull")
                fields = ""
                values = $false
            }
        }
    }
}

$PassFailMappings = @(
    @{
        type = "value"
        options = @{
            "0" = @{ text = "FAILED"; color = "red" }
            "1" = @{ text = "PASSED"; color = "green" }
        }
    }
)

$PassFailThresholds = @(
    @{ color = "red"; value = $null },
    @{ color = "green"; value = 1 }
)

$UpDownMappings = @(
    @{
        type = "value"
        options = @{
            "0" = @{ text = "DOWN"; color = "red" }
            "1" = @{ text = "UP"; color = "green" }
        }
    }
)

$UpDownThresholds = @(
    @{ color = "red"; value = $null },
    @{ color = "green"; value = 1 }
)

$PipelineMappings = @(
    @{
        type = "value"
        options = @{
            "0" = @{ text = "FAILED"; color = "red" }
            "1" = @{ text = "SUCCESS"; color = "green" }
            "2" = @{ text = "RUNNING / UNKNOWN"; color = "yellow" }
        }
    }
)

$PipelineThresholds = @(
    @{ color = "red"; value = $null },
    @{ color = "green"; value = 1 },
    @{ color = "yellow"; value = 2 }
)

$SecurityRatingMappings = @(
    @{
        type = "value"
        options = @{
            "1" = @{ text = "A"; color = "green" }
            "2" = @{ text = "B"; color = "yellow" }
            "3" = @{ text = "C"; color = "orange" }
            "4" = @{ text = "D"; color = "red" }
            "5" = @{ text = "E"; color = "red" }
        }
    }
)

$SecurityRatingThresholds = @(
    @{ color = "green"; value = $null },
    @{ color = "yellow"; value = 2 },
    @{ color = "orange"; value = 3 },
    @{ color = "red"; value = 4 }
)

$BugThresholds = @(
    @{ color = "green"; value = $null },
    @{ color = "yellow"; value = 1 },
    @{ color = "orange"; value = 3 },
    @{ color = "red"; value = 6 }
)

$VulnerabilityThresholds = @(
    @{ color = "green"; value = $null },
    @{ color = "yellow"; value = 1 },
    @{ color = "orange"; value = 10 },
    @{ color = "red"; value = 20 }
)

$CodeSmellThresholds = @(
    @{ color = "green"; value = $null },
    @{ color = "yellow"; value = 10 },
    @{ color = "orange"; value = 20 },
    @{ color = "red"; value = 50 }
)

$HotspotThresholds = @(
    @{ color = "green"; value = $null },
    @{ color = "yellow"; value = 1 },
    @{ color = "orange"; value = 5 },
    @{ color = "red"; value = 10 }
)

$SecretThresholds = @(
    @{ color = "green"; value = $null },
    @{ color = "yellow"; value = 1 },
    @{ color = "orange"; value = 3 },
    @{ color = "red"; value = 5 }
)

$NeutralThresholds = @(
    @{ color = "blue"; value = $null }
)

$SonarPanels = @(
    (New-StatPanel -Id 101 -Title "SonarCloud Quality Gate" -Metric "sonarcloud_quality_gate_status" -X 0 -Y 28 -Width 4 -Mappings $PassFailMappings -ThresholdSteps $PassFailThresholds),
    (New-StatPanel -Id 102 -Title "SonarCloud Bugs" -Metric "sonarcloud_bugs_total" -X 4 -Y 28 -Width 4 -ThresholdSteps $BugThresholds),
    (New-StatPanel -Id 103 -Title "SonarCloud Vulnerabilities" -Metric "sonarcloud_vulnerabilities_total" -X 8 -Y 28 -Width 4 -ThresholdSteps $VulnerabilityThresholds),
    (New-StatPanel -Id 104 -Title "SonarCloud Code Smells" -Metric "sonarcloud_code_smells_total" -X 12 -Y 28 -Width 4 -ThresholdSteps $CodeSmellThresholds),
    (New-StatPanel -Id 105 -Title "SonarCloud Security Hotspots" -Metric "sonarcloud_security_hotspots_total" -X 16 -Y 28 -Width 4 -ThresholdSteps $HotspotThresholds),
    (New-StatPanel -Id 106 -Title "SonarCloud Security Rating" -Metric "sonarcloud_security_rating" -X 20 -Y 28 -Width 2 -Mappings $SecurityRatingMappings -ThresholdSteps $SecurityRatingThresholds),
    (New-StatPanel -Id 107 -Title "SonarCloud API" -Metric "sonarcloud_api_up" -X 22 -Y 28 -Width 2 -Mappings $UpDownMappings -ThresholdSteps $UpDownThresholds)
)

$GitLeaksPanels = @(
    (New-StatPanel -Id 201 -Title "GitLeaks Secret Scan" -Metric "gitleaks_scan_status" -X 0 -Y 34 -Width 6 -Mappings $PassFailMappings -ThresholdSteps $PassFailThresholds),
    (New-StatPanel -Id 202 -Title "GitLeaks Secrets Detected" -Metric "gitleaks_secrets_detected_total" -X 6 -Y 34 -Width 6 -ThresholdSteps $SecretThresholds)
)

$GitHubPanels = @(
    (New-StatPanel -Id 301 -Title "GitHub Actions Pipeline" -Metric "github_actions_pipeline_status" -X 12 -Y 34 -Width 4 -Mappings $PipelineMappings -ThresholdSteps $PipelineThresholds),
    (New-StatPanel -Id 302 -Title "Latest Pipeline Duration" -Metric "github_actions_run_duration_seconds" -X 16 -Y 34 -Width 4 -ThresholdSteps $NeutralThresholds -Unit "s"),
    (New-StatPanel -Id 303 -Title "Total Pipeline Runs" -Metric "github_actions_total_runs" -X 20 -Y 34 -Width 4 -ThresholdSteps $NeutralThresholds)
)

$Dashboard.panels += $SonarPanels
$Dashboard.panels += $GitLeaksPanels
$Dashboard.panels += $GitHubPanels

$Payload = @{
    dashboard = $Dashboard
    overwrite = $true
    message = "Refresh ScanGuard AI security integration panels"
} | ConvertTo-Json -Depth 100

Write-Host "Updating dashboard..."

$Result = Invoke-RestMethod `
    -Method Post `
    -Uri "$GrafanaUrl/api/dashboards/db" `
    -Headers $Headers `
    -Body $Payload

Write-Host ""
Write-Host "SUCCESS"
Write-Host "======="
Write-Host "Dashboard: $($Dashboard.title)"
Write-Host "SonarCloud panels: 7"
Write-Host "GitLeaks panels: 2"
Write-Host "GitHub Actions panels: 3"
Write-Host "Grafana status: $($Result.status)"
Write-Host ""
Write-Host "Open:"
Write-Host "$GrafanaUrl/d/$DashboardUid"