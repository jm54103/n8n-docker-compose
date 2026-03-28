$swaggerUrl = "http://localhost:5000/swagger-json"
$openApiFile = "swagger_temp.json"
$collectionFile = "ts-newman-all-collection.json"
$environmentFile = "ts-newman-environment.json"

Write-Host "--- Starting API Test Automation ---" -ForegroundColor Cyan

try {
    Write-Host "Step 1: Fetching OpenAPI spec..."
    Invoke-WebRequest -Uri $swaggerUrl -OutFile $openApiFile -ErrorAction Stop
    Write-Host "Success: OpenAPI spec downloaded." -ForegroundColor Green
} 
catch {
    Write-Host "Error: Cannot connect to Server at $swaggerUrl" -ForegroundColor Red
    exit
}

if (Get-Command openapi2postmanv2 -ErrorAction SilentlyContinue) {
    Write-Host "Step 2: Converting OpenAPI to Postman Collection..."
    openapi2postmanv2 -s $openApiFile -o $collectionFile -p
    Write-Host "Success: Collection created." -ForegroundColor Green
} 
else {
    Write-Host "Warning: openapi2postmanv2 not found." -ForegroundColor Yellow
}

if (Test-Path $collectionFile) {
    Write-Host "Step 3: Running Newman tests..." -ForegroundColor Magenta
    if (Test-Path $environmentFile) {
        newman run $collectionFile -e $environmentFile --reporters cli
    } else {
        newman run $collectionFile --reporters cli
    }
} 
else {
    Write-Host "Error: Collection file not found." -ForegroundColor Red
}

if (Test-Path $openApiFile) {
    Remove-Item $openApiFile
    Write-Host "Cleanup: Temp files removed." -ForegroundColor Gray
}