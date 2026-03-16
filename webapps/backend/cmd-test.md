# ทดสอบไฟล์ *.spec.ts (jest)
npm test 
npm test -- user-activity-logs 
npm run test:watch

npx jest user-activity-logs --watch

# สร้าง /api/client.ts เพื่อเขียน script ทดสอบ
npx @openapitools/openapi-generator-cli generate -i http://localhost:5000/api-json -g typescript-axios -o ./src/api-client

# ใช้ npx รันแบบไม่ต้องลงโปรแกรมเพิ่ม
npx ts-node src/api/client.ts


💡 อธิบายแต่ละคำสั่งCommandคำอธิบาย
# ดึง OpenAPI จาก localhost แล้วสร้างไฟล์ .json สำหรับ Import เข้า Postman (เก็บไว้ในโฟลเดอร์ /postman)
npm run api:generate
# ดึง Spec แล้วรัน Automated Tests ทันทีผ่าน Newman (ไม่ต้องเปิดโปรแกรม Postman)
npm run api:test
# เหมือนคำสั่งบน แต่จะส่งออกไฟล์ Report เป็น HTML (เหมาะสำหรับใช้ใน Jenkins/GitHub Actions)
npm run api:test:ci
