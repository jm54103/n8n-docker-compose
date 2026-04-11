// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { userContext } from '../context/context.storage';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // 1. ดึง Token จาก Header 'Authorization'
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // แยก 'Bearer <token>'

  //console.log( JSON.stringify( req.headers, null, 2 ) );

  let userId = 'anonymous';

  if (token) {
    try {
      // 2. Verify และ Decode Token 
      // ใส่ Secret Key ให้ตรงกับที่คุณใช้ตอน Sign Token (ควรใช้ Environment Variable)
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');      
      // 3. ดึง ID (ชื่อ property 'sub' หรือ 'id' ขึ้นอยู่กับว่าตอนสร้าง Token คุณตั้งชื่ออะไร)
      userId = decoded.sub || decoded.userId || decoded.id || 'anonymous';
      //console.log('JWT Verification Success:', userId);

    } catch (err) {
      // กรณี Token หมดอายุ หรือไม่ถูกต้อง สามารถเลือกได้ว่าจะให้เป็น anonymous 
      // หรือส่ง 401 Unauthorized กลับไปเลย
      console.error('JWT Verification Error:', err.message);
    }
  }
  else
  {
    console.error('No Authorization header found, treating as anonymous');
  }

  // 4. รันโค้ดถัดไปภายใน Context ของ User
  userContext.run({ userId }, () => {
    next();
  });
}