$ErrorActionPreference = "Stop"

$GrafanaUrl = "http://localhost:3000"
$DashboardUid = "scanguard-ai-devsecops"
$GrafanaUser = "admin"

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
    Authorization = "Basic $BasicAuth"
    "Content-Type" = "application/json"
}

$DashboardResponse = Invoke-RestMethod `
    -Method Get `
    -Uri "$GrafanaUrl/api/dashboards/uid/$DashboardUid" `
    -Headers $Headers

$Dashboard = $DashboardResponse.dashboard

# Remove previously generated GitLeaks panels
$GitLeaksPanelIds = @(201, 202)

$Dashboard.panels = @(
    $Dashboard.panels | Where-Object {
        $_.id -notin $GitLeaksPanelIds
    }
)

$StatusMappings = @(
    @{
        type = "value"
        options = @{
            "0" = @{
                text = "FAILED"
                color = "red"
            }
            "1" = @{
                text = "PASSED"
                color = "green"
            }
        }
    }
)

$StatusThresholds = @(
    @{
        color = "red"
        value = $null
    },
    @{
        color = "green"
        value = 1
    }
)

$SecretsThresholds = @(
    @{
        color = "green"
        value = $null
    },
    @{
        color = "yellow"
        value = 1
    },
    @{
        color = "orange"
        value = 3
    },
    @{
        color = "red"
        value = 5
    }
)

$GitLeaksStatusPanel = @{
    id = 201
    title = "GitLeaks Secret Scan"
    type = "stat"

    gridPos = @{
        h = 5
        w = 6
        x = 0
        y = 34
    }

    datasource = @{
        type = "prometheus"
        uid = "prometheus"
    }

    targets = @(
        @{
            expr = "gitleaks_scan_status"
            refId = "A"
            datasource = @{
                type = "prometheus"
                uid = "prometheus"
            }
        }
    )

    fieldConfig = @{
        defaults = @{
            color = @{
                mode = "thresholds"
            }

            mappings = $StatusMappings

            thresholds = @{
                mode = "absolute"
                steps = $StatusThresholds
            }
        }

        overrides = @()
    }

    options = @{
        colorMode = "background"
        graphMode = "none"
        justifyMode = "center"
        orientation = "auto"

        reduceOptions = @{
            calcs = @("lastNotNull")
            fields = ""
            values = $false
        }

        textMode = "auto"
    }
}

$SecretsPanel = @{
    id = 202
    title = "Secrets Detected"
    type = "stat"

    gridPos = @{
        h = 5
        w = 6
        x = 6
        y = 34
    }

    datasource = @{
        type = "prometheus"
        uid = "prometheus"
    }

    targets = @(
        @{
            expr = "gitleaks_secrets_detected_total"
            refId = "A"
            datasource = @{
                type = "prometheus"
                uid = "prometheus"
            }
        }
    )

    fieldConfig = @{
        defaults = @{
            color = @{
                mode = "thresholds"
            }

            thresholds = @{
                mode = "absolute"
                steps = $SecretsThresholds
            }
        }

        overrides = @()
    }

    options = @{
        colorMode = "background"
        graphMode = "none"
        justifyMode = "center"
        orientation = "auto"

        reduceOptions = @{
            calcs = @("lastNotNull")
            fields = ""
            values = $false
        }

        textMode = "auto"
    }
}

$Dashboard.panels += @(
    $GitLeaksStatusPanel,
    $SecretsPanel
)

$Payload = @{
    dashboard = $Dashboard
    overwrite = $true
    message = "Add GitLeaks security panels"
} | ConvertTo-Json -Depth 100

$Result = Invoke-RestMethod `
    -Method Post `
    -Uri "$GrafanaUrl/api/dashboards/db" `
    -Headers $Headers `
    -Body $Payload

Write-Host ""
Write-Host "SUCCESS"
Write-Host "GitLeaks panels added: 2"
Write-Host "Grafana status: $($Result.status)"
Write-Host "Open: $GrafanaUrl/d/$DashboardUid"