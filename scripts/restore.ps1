# PowerShell Database Restore Script

# Set variables
$DOCKER_COMPOSE_FILE = "docker-compose.clean.yml"
$DB_CONTAINER = "recipes-postgres"

# Check for a backup file argument
if ($args.Count -eq 0) {
    Write-Host "Error: No backup file specified!" -ForegroundColor Red
    Write-Host "Usage: .\restore.ps1 <backup_file>" -ForegroundColor Yellow
    exit 1
}

$BACKUP_FILE = $args[0]

# Check if backup file exists
if (-not (Test-Path $BACKUP_FILE)) {
    Write-Host "Error: Backup file '$BACKUP_FILE' not found!" -ForegroundColor Red
    exit 1
}

# Check if container is running
$containerId = docker-compose -f $DOCKER_COMPOSE_FILE ps -q $DB_CONTAINER
if (-not $containerId -or -not (docker ps -q | Select-String -Pattern $containerId -Quiet)) {
    Write-Host "Error: Database container is not running!" -ForegroundColor Red
    Write-Host "Please start the containers with: docker-compose -f $DOCKER_COMPOSE_FILE up -d" -ForegroundColor Yellow
    exit 1
}

# If the file is compressed, decompress it
$TEMP_FILE = $null
$fileExtension = [System.IO.Path]::GetExtension($BACKUP_FILE)

if ($fileExtension -eq ".zip") {
    Write-Host "Decompressing backup file..." -ForegroundColor Cyan
    $TEMP_FILE = [System.IO.Path]::GetTempFileName() + ".sql"
    
    # Extract the SQL file from the zip
    try {
        Expand-Archive -Path $BACKUP_FILE -DestinationPath ([System.IO.Path]::GetTempPath()) -Force
        $extractedFile = Get-ChildItem ([System.IO.Path]::GetTempPath()) -Filter "*.sql" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if ($extractedFile) {
            Copy-Item $extractedFile.FullName -Destination $TEMP_FILE
            Remove-Item $extractedFile.FullName
        } else {
            Write-Host "Error: Could not find SQL file in the zip archive!" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "Error: Failed to decompress the backup file!" -ForegroundColor Red
        exit 1
    }
    
    $BACKUP_FILE = $TEMP_FILE
}

# Restore database
Write-Host "Warning: This will overwrite your current database! Continue? (y/n)" -ForegroundColor Red
$confirmation = Read-Host
if ($confirmation -eq "y" -or $confirmation -eq "Y") {
    Write-Host "Restoring database from backup..." -ForegroundColor Cyan
    
    # Use Get-Content and pipe to docker exec for the restore
    $restoreCmd = "Get-Content `"$BACKUP_FILE`" | docker-compose -f $DOCKER_COMPOSE_FILE exec -T $DB_CONTAINER psql -U postgres -d recipes"
    
    try {
        Invoke-Expression $restoreCmd
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Database restored successfully!" -ForegroundColor Green
        } else {
            Write-Host "Error: Database restore failed!" -ForegroundColor Red
            exit 1
        }
    } catch {
        Write-Host "Error during restore: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Restore cancelled." -ForegroundColor Yellow
}

# Clean up temp file
if ($TEMP_FILE -and (Test-Path $TEMP_FILE)) {
    Remove-Item $TEMP_FILE -Force
}
