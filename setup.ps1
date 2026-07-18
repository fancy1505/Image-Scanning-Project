param(
    [switch]$SkipDockerBuild,
    [switch]$SkipDashboard
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)

    Write-Host ""
    Write-Host "===================================================="
    Write-Host $Message
    Write-Host "===================================================="
}

function Test-CommandExists {
    param([string]$Command)

    return $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

function Stop-Setup {
    param([string]$Message)

    Write-Host ""
    Write-Host "SETUP FAILED: $Message"
    exit 1
}

Write-Host ""
Write-Host "ScanGuard AI - One-Click Project Setup"
Write-Host "Project path: $PSScriptRoot"

Set-Location $PSScriptRoot

Write-Step "1. Checking required tools"

$requiredTools = @(
    @{ Name = "Git"; Command = "git"; Install = "https://git-scm.com/download/win" },
    @{ Name = "Python"; Command = "python"; Install = "https://www.python.org/downloads/" },
    @{ Name = "Docker"; Command = "docker"; Install = "https://www.docker.com/products/docker-desktop/" },
    @{ Name = "Node.js"; Command = "node"; Install = "https://nodejs.org/" },
    @{ Name = "npm"; Command = "npm"; Install = "https://nodejs.org/" }
)

$missingTools = @()

foreach ($tool in $requiredTools) {
    if (Test-CommandExists $tool.Command) {
        Write-Host "[OK] $($tool.Name)"
    }
    else {
        Write-Host "[MISSING] $($tool.Name)"
        Write-Host "Install from: $($tool.Install)"
        $missingTools += $tool.Name
    }
}

if ($missingTools.Count -gt 0) {
    Stop-Setup "Install the missing tools and run setup.ps1 again: $($missingTools -join ', ')"
}

Write-Step "2. Checking tool versions"

git --version
python --version
docker --version
node --version
npm --version

Write-Step "3. Checking Docker Desktop"

try {
    docker info | Out-Null
    Write-Host "[OK] Docker Engine is running."
}
catch {
    Stop-Setup "Docker Desktop is installed but not running. Start Docker Desktop and run the script again."
}

Write-Step "4. Creating Python virtual environment"

$venvPath = Join-Path $PSScriptRoot ".venv"
$venvPython = Join-Path $venvPath "Scripts\python.exe"
$venvPip = Join-Path $venvPath "Scripts\pip.exe"

if (-not (Test-Path $venvPath)) {
    python -m venv .venv
    Write-Host "[OK] Created .venv"
}
else {
    Write-Host "[OK] .venv already exists"
}

if (-not (Test-Path $venvPython)) {
    Stop-Setup "Python virtual environment was not created correctly."
}

Write-Step "5. Installing Python dependencies"

& $venvPython -m pip install --upgrade pip

if (Test-Path ".\requirements.txt") {
    & $venvPip install -r ".\requirements.txt"
}
else {
    Write-Host "requirements.txt was not found. Installing known project dependencies."
    & $venvPip install requests prometheus-client
}

Write-Step "6. Creating required project directories"

$directories = @(
    "reports",
    "scans",
    "metrics",
    "monitoring"
)

foreach ($directory in $directories) {
    $directoryPath = Join-Path $PSScriptRoot $directory

    if (-not (Test-Path $directoryPath)) {
        New-Item -Path $directoryPath -ItemType Directory | Out-Null
        Write-Host "[CREATED] $directory"
    }
    else {
        Write-Host "[OK] $directory"
    }
}

Write-Step "7. Checking required project files"

$requiredFiles = @(
    ".trivyignore",
    ".github\workflows\security-pipeline.yml",
    "scripts\retry-command.ps1",
    "scripts\report_generator.py",
    "scripts\slack_notify.py",
    "scripts\send_security_email.py"
)

$missingFiles = @()

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "[OK] $file"
    }
    else {
        Write-Host "[MISSING] $file"
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host ""
    Write-Host "Warning: The following project files are missing:"
    $missingFiles | ForEach-Object { Write-Host " - $_" }
}

Write-Step "8. Installing dashboard dependencies"

$dashboardPath = Join-Path $PSScriptRoot "scanguard-dashboard"

if ($SkipDashboard) {
    Write-Host "Dashboard installation skipped."
}
elseif (Test-Path (Join-Path $dashboardPath "package.json")) {
    Push-Location $dashboardPath

    try {
        npm install
        Write-Host "[OK] Dashboard dependencies installed."
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host "Dashboard package.json was not found. Skipping dashboard setup."
}

Write-Step "9. Building Docker images"

if ($SkipDockerBuild) {
    Write-Host "Docker image builds skipped."
}
else {
    $images = @(
        @{
            Name = "shopnow-backend:v1"
            Path = ".\shopNow\backend"
        },
        @{
            Name = "shopnow-frontend:v1"
            Path = ".\shopNow\frontend"
        },
        @{
            Name = "shopnow-admin:v1"
            Path = ".\shopNow\admin"
        }
    )

    foreach ($image in $images) {
        if (-not (Test-Path $image.Path)) {
            Write-Host "[SKIPPED] Docker context not found: $($image.Path)"
            continue
        }

        Write-Host "Building $($image.Name)..."

        & ".\scripts\retry-command.ps1" `
            -Command "docker build -t $($image.Name) $($image.Path)" `
            -MaxAttempts 3 `
            -DelaySeconds 10

        if ($LASTEXITCODE -ne 0) {
            Stop-Setup "Docker build failed for $($image.Name)"
        }
    }
}

Write-Step "10. Final verification"

Write-Host "Docker images:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" |
    Select-String "shopnow|REPOSITORY"

Write-Host ""
Write-Host "Python environment:"
& $venvPython --version

Write-Host ""
Write-Host "ScanGuard AI setup completed successfully."
Write-Host ""
Write-Host "Activate the Python environment with:"
Write-Host ".\.venv\Scripts\Activate.ps1"
Write-Host ""
Write-Host "Start the dashboard with:"
Write-Host "cd .\scanguard-dashboard"
Write-Host "npm start"
Write-Host ""
Write-Host "Run setup without Docker builds:"
Write-Host ".\setup.ps1 -SkipDockerBuild"