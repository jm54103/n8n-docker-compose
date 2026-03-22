"use client"

import { useRouter } from "next/navigation"; // ต้องใช้จาก next/navigation
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import api, { setupSilentRefresh } from "@/lib/api"


// 1. กำหนด Schema ตาม LoginDto ใน Swagger
const loginSchema = z.object({
  username: z.string().min(2, "Username ต้องมีอย่างน้อย 2 ตัวอักษร"),
  password: z.string().min(6, "Password ต้องมีอย่างน้อย 6 ตัวอักษร"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { register, setValue, watch, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  setValue("username", "tester01");
  setValue("password", "SecretPassword123");

  // 2. ฟังก์ชันยิง API ไปที่ /auth/login
  const onSubmit = async (data: LoginFormValues) => {
  setIsLoading(true);
  try {

    const response = await api.post("/auth/login", data);
    
    if (response.data.accessToken) {
      // เก็บ Token ลงเครื่อง
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      
      console.log("Login Success!");

      setupSilentRefresh();

      // ส่งไปที่หน้า /main
      router.push("/main");
    }
  } catch (error: any) {
    alert(error.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Market Signal Login</CardTitle>
          <CardDescription>กรอกข้อมูลเพื่อเข้าสู่ระบบ API</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="กรอกชื่อผู้ใช้" 
                {...register("username")} 
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                {...register("password")} 
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              เข้าสู่ระบบ
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}