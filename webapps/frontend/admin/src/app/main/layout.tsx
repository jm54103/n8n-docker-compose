"use client"


import { Button } from "@/components/ui/button";
import { logoutApi } from "@/lib/api";
import { Database,Table, Globe, Icon, Loader2, LogOut, ShieldCheck, Users, Cog } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  LineChart, 
  CandlestickChart, 
  CalendarDays, 
  Star, 
  Wallet, 
  Settings 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ใช้สำหรับเช็คว่าอยู่หน้าไหน
import { useRouter } from "next/navigation";


export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); // ดึง Path ปัจจุบัน เพื่อใช้ในการเช็คว่าเมนูไหน active อยู่"  
  const router = useRouter(); // เปลี่ยนจาก useNavigate() เป็น useRouter()

  const menuGroups = [
  {
    groupLabel: "Main Operations",
    items: [
      { label: "Dashboard", href: "/main/operations/dashboard", icon: LayoutDashboard },
      { label: "Market Signals", href: "/main/operations/signals", icon: LineChart },
      { label: "Technical Analysis", href: "/main/operations/analysis", icon: CandlestickChart },
    ]
  },
  {
    groupLabel: "Portfolio & Tracking",
    items: [
      { label: "Economic Calendar", href: "/main/tracking/calendar", icon: CalendarDays },
      { label: "Watchlist", href: "/main/tracking/watchlist", icon: Star },
      { label: "Portfolio Tracker", href: "/main/tracking/portfolio", icon: Wallet },
    ]
  },
  {
    groupLabel: "Data Reference", // ส่วนของ Master Data / Reference ที่คุณต้องการ
    items: [
      { label: "Title Name", href: "/main/references/titlename", icon: Table},
      { label: "ISIC", href: "/main/references/isic", icon: Table },
      { label: "ZipCode", href: "/main/references/zipcode", icon: Table },
    ]
  },
  {
    groupLabel: "Settings & Administration",
    items: [           
      { label: "User Management", href: "/main/settings/users", icon: Users  },
      { label: "Permission", href: "/main/settings/permissions", icon: ShieldCheck },
      { label: "Parameter", href: "/main/settings/parameters", icon: Cog},
    ]
  }
];

  // useState 
  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  const [userPayload, setUserPayload] = useState<any>(null);
 
  // useEffect  
  useEffect(() => {        
    const token = localStorage.getItem("accessToken");    
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          window.atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );        
        setUserPayload(JSON.parse(jsonPayload));
      } catch (error) {
        console.error("Failed to parse JWT:", error);
      }
    }
  }, []); 

  const handleLogout = async () => {    
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      setIsLoggingOut(true);
      await logoutApi();     
      router.push("/login"); // เปลี่ยนเส้นทางไปยังหน้า Login หลังจาก Logout
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      <header className="h-16 border-b bg-white flex items-center px-6 justify-between shadow-sm">
        <div className="font-bold text-xl text-blue-600">APPLICATION NAME</div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
            ผู้ใช้งาน: 
            {/* 3. แสดงผลจาก State */}
            {userPayload ? (
              <b className="text-blue-700">{userPayload.sub || userPayload.username}</b>
            ) : (
              "ไม่มีข้อมูลผู้ใช้"
            )}
          </span>        
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
            ออกจากระบบ
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">        

        {/* Sidebar */}
        <aside className="w-64 border-r bg-white overflow-y-auto hidden md:block">
          <nav className="p-4 space-y-6"> {/* ปรับ space-y ให้ห่างกันระหว่างกลุ่ม */}
            
            {menuGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1">
                {/* หัวข้อกลุ่ม (Group Label) */}
                <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {group.groupLabel}
                </h3>

                {/* รายการเมนูในกลุ่มนั้นๆ */}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                        isActive 
                          ? "bg-blue-50 text-blue-600 shadow-sm" 
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
            <Link key="logout" href="#" onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <LogOut className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
              <span className="text-sm font-medium">Logout</span>
            </Link>
          </nav>
        </aside>    
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}