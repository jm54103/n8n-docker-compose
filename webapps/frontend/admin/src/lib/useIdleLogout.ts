import { useEffect, useRef } from "react";

export const useIdleLogout = (onLogout: () => void) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const IDLE_TIMEOUT_MS = process.env.NEXT_IDLE_TIMEOUT_SECONDS
    ? parseInt(process.env.NEXT_IDLE_TIMEOUT_SECONDS) * 1000
    : 600 * 1000; // ค่าเริ่มต้นเป็น 600 วินาที
  console.log(`IDLE_TIMEOUT_MS : ${IDLE_TIMEOUT_MS / 1000}s`);
  const resetTimer = () => {
    // ถ้ามีการขยับเมาส์/กดคีย์บอร์ด ให้ล้างตัวนับเวลาเก่าแล้วเริ่มนับใหม่
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      console.log(`User is idle for ${IDLE_TIMEOUT_MS / 1000}s, logging out...`);
      onLogout();
    }, IDLE_TIMEOUT_MS);
  };

  useEffect(() => {
    // รายการ Event ที่เราจะนับว่าเป็น "การใช้งาน"
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    // เริ่มนับครั้งแรกเมื่อ Component โหลด
    resetTimer();

    // เพิ่ม Event Listener ให้กับ window
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup เมื่อเลิกใช้งานหน้าจอ
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);
};