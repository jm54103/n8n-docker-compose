# ใน NestJS Exception Filters คือ "ด่านสุดท้าย" ที่คอยจัดการกับ Error (Exceptions) ทั้งหมดที่เกิดขึ้นใน Application ครับ

หากเปรียบเทียบ: Middleware/Interceptor/Pipe คือคนที่คอยเช็คและจัดการตอนที่ "ทุกอย่างยังปกติดี"
Exception Filter คือ "หน่วยกู้ภัย" ที่จะทำงานเฉพาะเมื่อมีอะไรบางอย่าง "พัง" (Throw Error) ขึ้นมาเท่านั้น

# ลำดับการทำงาน (Request Lifecycle)
เพื่อให้เห็นภาพรวมทั้งหมด นี่คือลำดับที่ Request วิ่งผ่านตัวละครต่างๆ ที่เราคุยกันมาครับ:
    Middleware (ด่านหน้าสุด)
    Guards (เช็คสิทธิ์/Auth)
    Interceptors (Before) (เริ่มจับเวลา/Log)
    Pipes (แปลง Data/Validate)
    Controller (Handler) (ประมวลผล Logic)
    Interceptors (After) (แปลงผลลัพธ์)
    Exception Filters (ทำงานเฉพาะเมื่อมี Error เกิดขึ้นในขั้นตอน 2-6)