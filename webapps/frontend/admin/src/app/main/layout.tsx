"use client";

import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  LineChart, 
  CandlestickChart, 
  CalendarDays, 
  Star, 
  Wallet,  
  Table, 
  LogOut, 
  ShieldCheck, 
  Users, 
  Cog,
  Loader2,
  Menu, // เพิ่มไอคอน Menu 
  List
} from "lucide-react";

import { logoutApi } from "@/lib/api";
import { getSafeDecodedToken } from "@/lib/jwt.util"; 
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; 
import { useIdleLogout } from "@/lib/useIdleLogout";

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname(); 
  const router = useRouter(); 

  // State สำหรับควบคุมการ เปิด/ปิด Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      groupLabel: "Data Reference", 
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

  useIdleLogout(async () => {
    await logoutApi(); 
    router.push("/login"); 
  });

  const [isLoggingOut, setIsLoggingOut] = useState(false); 
  const [userPayload, setUserPayload] = useState<any>(null);
  
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
        const decodedToken = getSafeDecodedToken(); 
        if (decodedToken) {
          console.log(`JWT Payload:`);         
          console.log(`sub: ${decodedToken.sub}`); 
          console.log(`iat Time: ${decodedToken.loginTime}`);
          console.log(`exp Time: ${decodedToken.expiryTime}`);
        }

      } catch (error) {
        console.error("Failed to parse JWT:", error);
      }
    }
  }, []); 

  const handleLogout = async () => {    
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      setIsLoggingOut(true);
      await logoutApi();     
      router.push("/login"); 
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      {/* Header Topbar */}
      <header className="h-16 border-b bg-white flex items-center px-4 md:px-6 justify-between shadow-sm z-20">
        <div className="flex items-center gap-3">
          {/* ปุ่ม Toggle Menu */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-600 hover:bg-slate-100"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <Menu className="h-5 w-5" /> : <List className="h-5 w-5" />}
          </Button>

          <div className="font-bold text-xl text-blue-600">APPLICATION NAME</div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-600 hidden sm:flex items-center gap-2">
            ผู้ใช้งาน: 
            {userPayload ? (
              //decodedToken = this.getSafeDecodedToken()
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
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">        
        {/* Backdrop ม่านสีดำใสสำหรับจอมือถือเวลาเปิดเมนู */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-10 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside 
          className={`
            fixed md:static inset-y-0 left-0 z-10
            w-64 border-r bg-white overflow-y-auto transition-all duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-0 md:border-r-0"}
          `}
        >
          <nav className="p-4 space-y-6 w-64">
            {menuGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1">
                <h3 className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {group.groupLabel}
                </h3>

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        // ปิดเมนูบนจอมือถือเมื่อคลิกลิงก์
                        if (window.innerWidth < 768) setIsSidebarOpen(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                        isActive 
                          ? "bg-blue-50 text-blue-600 shadow-sm font-semibold" 
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

            <Link 
              key="logout" 
              href="#" 
              onClick={handleLogout} 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            >
              <LogOut className="h-5 w-5 text-slate-400 group-hover:text-slate-600" />
              <span className="text-sm font-medium">Logout</span>
            </Link>
          </nav>
        </aside>    

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}