"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, X, RefreshCw, BarChart2, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { get } from "http";

interface ExchangeData {
  exchange: string;
  country: string;
}

interface SymbolItem {
  ticker: string;
  name: string;
  exchange: string;
  categoryName: string;
  country: string;
}

// กำหนด Type สำหรับระบุการเรียงลำดับข้อมูล
type SortKey = "ticker" | "name" | "exchange" | "categoryName" | "country";
type SortOrder = "asc" | "desc" | null;

// ==========================================
// 🌐 ตั้งค่าตัวแปรระดับ Global สำหรับหน้านี้
// ==========================================
const API_PORT = "5000";

// ใช้ฟังก์ชันดึงค่า Host/Port เพื่อป้องกัน Error "window is not defined" ฝั่ง Server (SSR)
const getClientHost = () => {
  return typeof window !== "undefined" ? window.location.hostname : "localhost";
};

const getClientPort = () => {
  return API_PORT;
  //return typeof window !== "undefined" ? (window.location.port || "3000") : "3000";
};
// ==========================================

export default function WatchListPage() {
  // --- States สำหรับระบบตัวกรอง (Dropdowns) ---
  const [allExchanges, setAllExchanges] = useState<ExchangeData[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [filteredExchanges, setFilteredExchanges] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]); 
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([]);
  
  // --- States สำหรับข้อมูลตารางและสถานะดาวน์โหลด ---
  const [symbols, setSymbols] = useState<SymbolItem[]>([]);
  const [isDropdownLoading, setIsDropdownLoading] = useState<boolean>(true);
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // --- States สำหรับระบบ Sorting (เรียงลำดับ) ---
  const [sortKey, setSortKey] = useState<SortKey>("ticker");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // --- States สำหรับระบบ Pagination (แบ่งหน้า) ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10); // ค่าเริ่มต้น 10 รายการต่อหน้า

  const [isCountryOpen, setIsCountryOpen] = useState<boolean>(false);
  const [isExchangeOpen, setIsExchangeOpen] = useState<boolean>(false);
  
  const countryRef = useRef<HTMLDivElement>(null);
  const exchangeRef = useRef<HTMLDivElement>(null);

  // 🔄 เฟสที่ 1: ดึงข้อมูลตั้งต้นสำหรับ Dropdown
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setIsDropdownLoading(true);
        // เรียกใช้ฟังก์ชันและตัวแปรที่ประกาศไว้ด้านนอก
        const host = getClientHost();
        const port = getClientPort();
        const response = await fetch(`http://${host}:${port}/api/symbols/exchange`);
        if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลตัวเลือกได้");
        
        const data: ExchangeData[] = await response.json();
        setAllExchanges(data);

        const uniqueCountries = Array.from(
          new Set(data.map((item) => item.country.trim()).filter((c) => c !== ""))
        ).sort();
        setCountries(uniqueCountries);
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเชื่อมต่อ API");
      } finally {
        setIsDropdownLoading(false);
      }
    };
    fetchDropdownData();
  }, []);

  // 🔄 เฟสที่ 2: กรองรายชื่อ Exchange สัมพันธ์กับประเทศที่เลือก
  useEffect(() => {
    if (selectedCountries.length === 0) {
      const allUniqueExchanges = Array.from(
        new Set(allExchanges.map((item) => item.exchange.trim()).filter((e) => e !== ""))
      ).sort();
      setFilteredExchanges(allUniqueExchanges);
    } else {
      const filtered = allExchanges
        .filter((item) => selectedCountries.includes(item.country.trim()))
        .map((item) => item.exchange.trim())
        .filter((e) => e !== "");
      const uniqueFiltered = Array.from(new Set(filtered)).sort();
      setFilteredExchanges(uniqueFiltered);
      setSelectedExchanges((prev) => prev.filter((e) => uniqueFiltered.includes(e)));
    }
  }, [selectedCountries, allExchanges]);

  // 🔄 เฟสที่ 3: ดึงข้อมูลลงตารางตามแบบ URL API ล่าสุด
  useEffect(() => {
    const fetchSymbolsData = async () => {
      if (selectedExchanges.length === 0) {
        setSymbols([]);
        return;
      }

      try {
        setIsTableLoading(true);
        const params = new URLSearchParams();
        selectedExchanges.forEach((ex) => params.append("exchanges", ex));
                // เรียกใช้ฟังก์ชันและตัวแปรที่ประกาศไว้ด้านนอก
        const host = getClientHost();
        const port = getClientPort();
        const url = `http://${host}:${port}/api/symbols/findByExchangeCountry?exchanges=XXX&${params.toString()}`;
        const response = await fetch(url);
        console.log("Fetching symbols from URL:", url); // เพิ่มการ log URL ที่เรียก
        console.log
        if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลในตารางได้");
        
        const data: SymbolItem[] = await response.json();
        setSymbols(data);
        setCurrentPage(1); // รีเซ็ตกลับไปหน้า 1 เสมอเมื่อข้อมูลเปลี่ยน
      } catch (err) {
        console.error("Fetch symbols error:", err);
      } finally {
        setIsTableLoading(false);
      }
    };

    fetchSymbolsData();
  }, [selectedExchanges]);

  // จัดการปิด Dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) setIsCountryOpen(false);
      if (exchangeRef.current && !exchangeRef.current.contains(event.target as Node)) setIsExchangeOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- ฟังก์ชันจัดการการเรียงลำดับ (Sorting) ---
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : sortOrder === "desc" ? null : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // --- ประมวลผลข้อมูล (เรียงลำดับก่อน แล้วค่อยตัดแบ่งหน้า) ---
  const processedSymbols = useMemo(() => {
    let result = [...symbols];

    // 1. จัดการ Sort ข้อมูล
    if (sortKey && sortOrder) {
      result.sort((a, b) => {
        const valA = (a[sortKey] || "").toString().toLowerCase();
        const valB = (b[sortKey] || "").toString().toLowerCase();
        
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [symbols, sortKey, sortOrder]);

  // คำนวณข้อมูลที่จะแสดงเฉพาะหน้าปัจจุบัน (Pagination Segment)
  const totalItems = processedSymbols.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSymbols = processedSymbols.slice(startIndex, endIndex);

  const handleSelectCountry = (countryName: string) => {
    if (selectedCountries.includes(countryName)) {
      setSelectedCountries(selectedCountries.filter((c) => c !== countryName));
    } else {
      setSelectedCountries([...selectedCountries, countryName]);
    }
  };

  const handleSelectExchange = (exchangeName: string) => {
    if (selectedExchanges.includes(exchangeName)) {
      setSelectedExchanges(selectedExchanges.filter((e) => e !== exchangeName));
    } else {
      setSelectedExchanges([...selectedExchanges, exchangeName]);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center space-x-2">
        <BarChart2 className="h-6 w-6 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-800">WatchListPage</h1>
      </div>

      {isDropdownLoading && <p className="text-sm text-gray-500 animate-pulse">กำลังเตรียมตัวกรองข้อมูล...</p>}
      {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

      {!isDropdownLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dropdown ประเทศ */}
          <div className="relative" ref={countryRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">ประเทศ (Country)</label>
            <div
              onClick={() => setIsCountryOpen(!isCountryOpen)}
              className="min-h-[42px] w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center justify-between cursor-pointer"
            >
              <div className="flex flex-wrap gap-1 items-center max-w-[90%]">
                {selectedCountries.length === 0 ? (
                  <span className="text-gray-400 text-sm">-- เลือกประเทศทั้งหมด --</span>
                ) : (
                  selectedCountries.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-2 py-1 rounded">
                      {c}
                      <X className="h-3 w-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleSelectCountry(c); }} />
                    </span>
                  ))
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            {isCountryOpen && (
              <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm">
                {countries.map((c) => (
                  <label key={c} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={selectedCountries.includes(c)} onChange={() => handleSelectCountry(c)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded mr-3" />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown ตลาดหลักทรัพย์ */}
          <div className="relative" ref={exchangeRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">ตลาดหลักทรัพย์ (Exchange)</label>
            <div
              onClick={() => setIsExchangeOpen(!isExchangeOpen)}
              className="min-h-[42px] w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center justify-between cursor-pointer"
            >
              <div className="flex flex-wrap gap-1 items-center max-w-[90%]">
                {selectedExchanges.length === 0 ? (
                  <span className="text-gray-400 text-sm">-- เลือกตลาดหลักทรัพย์ --</span>
                ) : (
                  selectedExchanges.map((e) => (
                    <span key={e} className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded">
                      {e}                      
                      <X className="h-3 w-3 cursor-pointer" onClick={(ev) => { ev.stopPropagation(); handleSelectExchange(e); }} />
                    </span>
                  ))
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
            {isExchangeOpen && (
              <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm">
                {filteredExchanges.map((e) => (
                  <label key={e} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={selectedExchanges.includes(e)} onChange={() => handleSelectExchange(e)} className="h-4 w-4 text-green-600 border-gray-300 rounded mr-3" />
                    <span>{e}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= ส่วนของตารางและเครื่องมือเสริม ================= */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* แถบหัวตาราง: มีตัวเลือกแสดงจำนวนรายการ (Page Size Selector) */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center space-x-2">
            <h2 className="font-semibold text-gray-700">รายการสัญญาณตลาด ({totalItems})</h2>
            {isTableLoading && <RefreshCw className="h-4 w-4 text-indigo-500 animate-spin" />}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>แสดง</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {[5, 10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>{size} รายการ</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isTableLoading ? (
            /* แอนิเมชันตอนโหลดข้อมูล */
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left animate-pulse">
              <thead className="bg-gray-100 text-xs text-gray-400 font-semibold uppercase">
                <tr>
                  {["Ticker", "Name", "Exchange", "Category", "Country", "Chart"].map((h) => <th key={h} className="px-6 py-3">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {[1, 2, 3, 4, 5].map((idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-64"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : symbols.length === 0 ? (
            <div className="p-8 text-center text-gray-400 italic">กรุณาเลือกตลาดหลักทรัพย์เพื่อแสดงผลข้อมูล</div>
          ) : (
            /* ตารางข้อมูลจริงพร้อมระบบคลิกเพื่อเรียงลำดับข้อมูลที่หัวคอลัมน์ */
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-100 text-xs text-gray-700 uppercase font-semibold select-none">
                <tr>
                  {[
                    { id: "ticker", label: "Ticker", sortable: true },
                    { id: "name", label: "Name", sortable: true },
                    { id: "exchange", label: "Exchange", sortable: true },
                    { id: "categoryName", label: "Category", sortable: true },
                    { id: "country", label: "Country", sortable: true },
                    { id: "chart", label: "Chart", sortable: false }
                  ].map((col) => (
                    <th
                      key={col.id}
                      onClick={() => col.sortable && handleSort(col.id as SortKey)}
                      className={`px-6 py-3 transition-colors group ${col.sortable ? "cursor-pointer hover:bg-gray-200" : ""}`}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{col.label}</span>
                        {col.sortable && (
                          <ArrowUpDown className={`h-3 w-3 text-gray-400 group-hover:text-gray-600 ${sortKey === col.id && sortOrder ? "text-indigo-600 font-bold" : ""}`} />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white text-gray-900">
                {paginatedSymbols.map((item) => {
                  // ตั้งค่า Host และ Port ที่นี่ตามความเหมาะสม
                  const host = getClientHost();
                  const port = getClientPort();
                  const chartUrl = `http://${host}:${port}/chart/?symbol=${item.ticker}`;

                  return (
                    <tr key={item.ticker} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-indigo-600">{item.ticker}</td>
                      <td className="px-6 py-4 max-w-xs truncate font-medium">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded border border-gray-200 font-medium">{item.exchange}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{item.categoryName || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{item.country}</td>
                      {/* ไอคอน Chart สำหรับคลิกเปิดเบราว์เซอร์หน้าต่างใหม่ */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => window.open(chartUrl, "_blank", "noopener,noreferrer")}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                          title={`ดูข้อมูลกราฟของ ${item.ticker}`}
                        >
                          <BarChart2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ================= แถบควบคุมการเปลี่ยนหน้าตาราง (Pagination Controls) ================= */}
        {symbols.length > 0 && !isTableLoading && (                 
          <div className="p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">                  
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 border rounded text-xs font-medium transition-colors ${currentPage === page ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>          
        )} 
        {symbols.length > 0 && !isTableLoading && (      
        <div className="p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">             
            แสดงรายการที่&nbsp;<span className="font-semibold">{startIndex + 1}</span>ถึง &nbsp;
            <span className="font-semibold">{Math.min(endIndex, totalItems)}</span>&nbsp;จากทั้งหมด&nbsp;
            <span className="font-semibold">{totalItems}</span>&nbsp;รายการ
          </div>  
        </div>  
        )} 
      </div>
    </div>    
  );
}