💡 อธิบายแต่ละคำสั่งCommandคำอธิบาย
# ดึง OpenAPI จาก localhost แล้วสร้างไฟล์ .json สำหรับ Import เข้า Postman (เก็บไว้ในโฟลเดอร์ /postman)
npm run api:generate
# ดึง Spec แล้วรัน Automated Tests ทันทีผ่าน Newman (ไม่ต้องเปิดโปรแกรม Postman)
npm run api:test
# เหมือนคำสั่งบน แต่จะส่งออกไฟล์ Report เป็น HTML (เหมาะสำหรับใช้ใน Jenkins/GitHub Actions)
npm run api:test:ci
# generate & report
npm run api:full-check


"scripts": {
    "api:generate": "portman -u http://localhost:5000/swagger-json -b http://localhost:5000 -o ./postman/market-signal.json -c ./portman-config.json",
    "api:test": "portman -u http://localhost:5000/swagger-json --runNewman --c ./portman-config.json",    
    "api:report": "newman run ./postman/market-signal.json --reporters cli,htmlextra --reporter-htmlextra-export ./postman/report.html",
    "api:full-check": "npm run api:generate && npm run api:report"
}

# ทดสอบการสร้างตาม postman flow-collection.json ภายใต้ flow-env.json
OK npx -p newman -p newman-reporter-htmlextra newman run ./flows/ts-auth-flow-collection.json -e ./flows/ts-newman-environment.json -r cli,htmlextra
OK npx -p newman -p newman-reporter-htmlextra newman run ./flows/ts-user-flow-collection.json -e ./flows/ts-newman-environment.json -r cli,htmlextra
OK npx -p newman -p newman-reporter-htmlextra newman run ./flows/ts-system_parameter-flow-collection.json -e ./flows/ts-newman-environment.json -r cli,htmlextra


