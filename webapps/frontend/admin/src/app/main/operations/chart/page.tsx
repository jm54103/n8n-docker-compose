"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

// 1. เตรียมข้อมูลสำหรับแสดงผลบน กราฟ
const data = [
  { name: "ม.ค.", sales: 4000, revenue: 2400 },
  { name: "ก.พ.", sales: 3000, revenue: 1398 },
  { name: "มี.ค.", sales: 2000, revenue: 9800 },
  { name: "เม.ย.", sales: 2780, revenue: 3908 },
  { name: "พ.ค.", sales: 1890, revenue: 4800 },
  { name: "มิ.ย.", sales: 2390, revenue: 3800 },
  { name: "ก.ค.", sales: 3490, revenue: 4300 },
];

export default function ChartPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <TrendingUp className="h-6 w-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-gray-800">รายงานยอดขายประจำปี</h1>
      </div>

      {/* Card ครอบตัวกราฟ */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-4">
          <p className="text-sm text-gray-500">ข้อมูลเปรียบเทียบยอดขายและรายได้ (บาท)</p>
        </div>

        {/* ส่วนแสดงผลกราฟแบบ Responsive */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {/* เส้นตารางพื้นหลัง */}
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              
              {/* แกน X และ แกน Y */}
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              
              {/* กล่องข้อความเมื่อเอาเมาส์ไปชี้ (Hover) */}
              <Tooltip 
                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}
              />
              
              {/* คำอธิบายสัญลักษณ์ของเส้นกราฟ */}
              <Legend />
              
              {/* เส้นกราฟเส้นที่ 1 (Sales) */}
              <Line
                type="monotone"
                dataKey="sales"
                name="ยอดขาย"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              
              {/* เส้นกราฟเส้นที่ 2 (Revenue) */}
              <Line 
                type="monotone" 
                dataKey="revenue" 
                name="รายได้"
                stroke="#10b981" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}