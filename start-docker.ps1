# บังคับ Console ให้ใช้ UTF-8 (Code Page 65001)
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8

# ล้างหน้าจอเพื่อให้ Code Page ใหม่เริ่มทำงาน
Clear-Host

Write-Host "🚀 เริ่มการทำงานด้วยภาษาไทย..." -ForegroundColor Cyan
# ... โค้ดส่วนที่เหลือของคุณ ...

# 1. ตรวจสอบและเปิด Docker Desktop
if (-not (Get-Process "Docker Desktop" -ErrorAction SilentlyContinue)) {
    Write-Host "🚀 กำลังเริ่มการทำงาน Docker Desktop..." -ForegroundColor Cyan
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    
    # รอจนกว่า Docker Engine จะพร้อมใช้งาน
    Write-Host "⏳ รอให้ Docker Engine พร้อมใช้งาน (อาจใช้เวลาสักครู่)..." -NoNewline
    while (!(docker info --format '{{.ServerVersion}}' 2>$null)) {
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
    }
    Write-Host "`n✅ Docker พร้อมใช้งานแล้ว!" -ForegroundColor Green
} else {
    Write-Host "⚓ Docker Desktop เปิดอยู่แล้ว" -ForegroundColor Yellow
}

# 2. รันคำสั่ง Docker Compose
Write-Host "🧹 กำลัง Down containers เก่า..." -ForegroundColor Magenta
docker-compose down

Write-Host "🏗️ กำลัง Build images ใหม่..." -ForegroundColor Cyan
docker-compose build

Write-Host "🆙 กำลัง Up containers..." -ForegroundColor Green
docker-compose up -d

Write-Host "✨ ทุกอย่างเรียบร้อย!" -ForegroundColor Green