# Middleware คือ "ฟังก์ชัน" ที่ทำงาน ก่อน ที่ Request จะเดินทางไปถึง Route Handler (Controller) ครับ ถ้าเปรียบเทียบ Interceptor เป็น "รปภ. หน้าห้องทำงาน" Middleware ก็เปรียบเสมือน "ประตูหน้าด่านของอาคาร" ที่คัดกรองทุกคนที่เดินเข้ามาตั้งแต่วินาทีแรก

ใน NestJS นั้น Middleware ถูกออกแบบมาตามมาตรฐานของ Express middleware ทำให้มันมีความยืดหยุ่นสูงมากในการจัดการ HTTP Request พื้นฐาน

หน้าที่หลักของ Middleware
    Execute code: รันคำสั่งอะไรก็ได้ (เช่น เก็บ Log การเรียกใช้ API)
    Make changes to request/response: แก้ไขข้อมูลใน Request หรือ Response (เช่น เพิ่ม Property user เข้าไปใน Request)
    End the request-response cycle: สิ้นสุดการทำงานทันที (เช่น ถ้าไม่มี Token ก็สั่งให้จบงานและส่ง 401 กลับไปเลย ไม่ต้องไปต่อ)
    Call the next middleware: ส่งงานต่อให้ Middleware ตัวถัดไป หรือส่งให้ Controller

ความแตกต่างที่สำคัญ: Middleware vs Interceptor ลักษณะ "คั่นกลาง" เหมือนกัน แต่จุดประสงค์ต่างกัน
คุณสมบัติ
    ขอบเขตการทำงาน : 
        Middleware ทำงานได้เฉพาะ "ก่อน" ถึง Controller 
        Interceptor ทำงานได้ทั้ง "ก่อน" และ "หลัง"
    การเข้าถึง :  
        Middleware  Context รู้แค่เรื่อง HTTP (Request/Response) 
        Interceptor รู้ลึกถึง Class และ Method ที่กำลังจะรัน (ผ่าน ExecutionContext)
    การใช้งานหลักงานพื้นฐาน :  
        Middleware  CORS, Authentication, Logging, Body Parsing 
        Interceptor Logic ที่ซับซ้อน: Caching, Data Transformation, Error Mapping
    RxJS : 
        Middleware  ไม่รองรับ
        Interceptor รองรับ (ใช้จัดการ Response ได้อย่างมีพลัง)