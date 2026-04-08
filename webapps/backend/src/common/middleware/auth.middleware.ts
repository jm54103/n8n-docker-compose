// auth.middleware.ts
import { userContext } from '../context/context.storage';

export function authMiddleware(req, res, next) {
  const userId = req.user?.id || 'anonymous'; // สมมติว่าได้ userId มาจาก Passport หรือ JWT
  
  // รันโค้ดถัดไปภายใน Context ของ User คนนี้
  userContext.run({ userId }, () => {
    next();
  });
}