import type { NextConfig } from "next";

const nextConfig: NextConfig = {  
  trailingSlash: true, // หรือ false ลองสลับดูตามโครงสร้างไฟล์ที่ build ออกมา
  output: 'export',       // สำคัญ: เพื่อให้ได้โฟลเดอร์ /out
  distDir: 'out',         // โฟลเดอร์ชั่วคราวหลัง build
  images: {
    unoptimized: true,    // Static export จำเป็นต้องปิด Image Optimization ของ Next
  },
  basePath: '/admin',     // เพื่อให้ Path ของไฟล์ JS/CSS ขึ้นต้นด้วย /admin/
  reactCompiler: true,
};

export default nextConfig;
