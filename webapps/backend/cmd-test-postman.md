💡 อธิบายแต่ละคำสั่งCommandคำอธิบาย
# ดึง OpenAPI จาก localhost แล้วสร้างไฟล์ .json สำหรับ Import เข้า Postman (เก็บไว้ในโฟลเดอร์ /postman)
npm run api:generate
# ดึง Spec แล้วรัน Automated Tests ทันทีผ่าน Newman (ไม่ต้องเปิดโปรแกรม Postman)
npm run api:test
# เหมือนคำสั่งบน แต่จะส่งออกไฟล์ Report เป็น HTML (เหมาะสำหรับใช้ใน Jenkins/GitHub Actions)
npm run api:test:ci


"scripts": {
    "api:generate": "portman -u http://localhost:5000/api-json -b http://localhost:5000 -o ./postman/market-signal.json -c ./portman-config.json",
    "api:test": "portman -u http://localhost:5000/api-json --runNewman --c ./portman-config.json",
    "api:test:ci": "portman -u http://localhost:5000/api-json --runNewman --reporter-htmlextra-export ./results/report.html -c ./portman-config.json",
    "api:report": "newman run ./postman/market-signal.json --reporters cli,htmlextra --reporter-htmlextra-export ./results/report.html",
    "api:full-check": "npm run api:generate && npm run api:report"
}