export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">DashboardPage</h1>
      <h3>Dashboard Content</h3>
      
      <li>1.ราคาหุ้น
        <ul>
          <li>1.1.คลาดสหรัฐ</li>
          <li>1.2.คลาดยุโรป </li>
          <li>1.3.คลาดเอเชีย</li>
          <li>1.4.คลาดหุ้นไทย</li>
        </ul>
      </li>

      <li>2.สินค้าโภคภัณฑ์    
        <ul>
          <li>2.1.ราคาทองคำ</li>
          <li>2.2.ราคาน้ำมันดิบ</li>       
        </ul>
      </li>      
      <li>3.อัตราแลกเปลี่ยน</li>            
      <li>4.ราคาคริปโต</li>
      <li>5.อัตราแลกเปลี่ยน</li>

       <h3>n8n</h3>
       <li>check node executable</li>
       <li>Request Webhook</li>
       <li>Respond รับค่า Webhook Response เป็น Immediatel</li>
       <li>Respondรับค่า Webhook(Asynchronous / Callback Webhook)</li>

      
      <h3>Layout</h3>
      <li>Auth
        <ul>
          <li>1.1.ใช้ useSession() เพื่อดึงข้อมูล session ของผู้ใช้</li>
          <li>1.2.แสดงชื่อผู้ใช้ในส่วน header</li>
          <li>1.3.สร้างปุ่ม Logout ที่เรียก signOut() จาก NextAuth เมื่อคลิก</li>
        </ul>  
      </li>
      <li>Hide/Show Side Bar
        <ul>
          <li>1.1.ใช้ state ใน MainLayout ควบคุมการแสดงผลของ sidebar</li>
          <li>1.2.สร้างปุ่ม toggle menu</li>
          <li>1.3.ปรับ CSS ของ sidebar ให้ตอบสนองต่อ state นั้น (เช่น ใช้ class แบบ Tailwind ที่มีเงื่อนไข)</li>
        </ul>
      </li>    
      {/* ข้อมูลที่นี่จะไปโผล่ในส่วน {children} ของ MainLayout */}
    </div>
  );
}