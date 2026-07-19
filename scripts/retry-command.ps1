param(
    [Parameter(Mandatory = $true)]
    [string]$Command,

    [int]$MaxAttempts = 3,

    [int]$DelaySeconds = 10
)

$ErrorActionPreference = "Stop"

for ($attempt = 1; $attempt -le $MaxAttempts; $attempt++) {
    Write-Host ""
    Write-Host "Attempt $attempt of $MaxAttempts"
    Write-Host "Command: $Command"

    try {
        Invoke-Expression $Command

        if ($LASTEXITCODE -eq 0 -or $null -eq $LASTEXITCODE) {
            Write-Host "Command completed successfully."
            exit 0
        }

        throw "Command exited with code $LASTEXITCODE"
    }
    catch {
        Write-Host "Attempt $attempt failed: $($_.Exception.Message)"

        if ($attempt -eq $MaxAttempts) {
            Write-Host "All retry attempts failed."
            exit 1
        }

        Write-Host "Waiting $DelaySeconds seconds before retrying..."
        Start-Sleep -Seconds $DelaySeconds
    }
}