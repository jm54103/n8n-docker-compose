"use client"

import { Button } from "@/components/ui/button";
import { logoutApi } from "@/lib/api";
import { Loader2, LogOut } from "lucide-react";
import { ReactNode, useState } from "react";



export default function MainLayout({ children }: { children: ReactNode }) {

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      setIsLoggingOut(true);
      await logoutApi();
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
      {/* 1. Top Panel (Header) */}      
      <header className="h-16 border-b bg-white flex items-center px-6 justify-between shadow-sm">
      <div className="font-bold text-xl text-blue-600">APPLICATION NAME</div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600 italic">User profile payload</span>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <LogOut className="h-4 w-4 mr-2" />
          )}
          ออกจากระบบ
        </Button>
      </div>
    </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Left Panel (Sidebar) */}
        <aside className="w-64 border-r bg-white overflow-y-auto hidden md:block">
          <nav className="p-4 space-y-2">
            <div className="p-2 hover:bg-slate-100 rounded cursor-pointer">Dashboard</div>
            <div className="p-2 hover:bg-slate-100 rounded cursor-pointer font-semibold text-blue-600">Market Signals</div>
            <div className="p-2 hover:bg-slate-100 rounded cursor-pointer">Technical Analysis</div>
            <div className="p-2 hover:bg-slate-100 rounded cursor-pointer">Settings</div>
          </nav>
        </aside>

        {/* 3. Right Panel (Main Content Area) */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}