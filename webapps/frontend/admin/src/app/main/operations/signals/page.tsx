"use client";

import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// 🌐 ตั้งค่าตัวแปรระดับ Global สำหรับหน้านี้
// ==========================================
const API_PORT = "5000";

const getClientHost = () => {
  return typeof window !== "undefined" ? window.location.hostname : "localhost";
};

const getClientPort = () => {
  return API_PORT;
};

interface SignalData {
  id: number;
  symbol: string;
  last_close: number;
  signal: string;
  trend: string;
  rsi_14: number | null;
  rsi_overbought: string;
  rsi_oversold: string;
  ema_50: number | null;
  ema_200: number | null;
  golden_cross: boolean;
  death_cross: boolean;
  updated_at: string;
}

// กำหนดประเภทของ Sort
type SortField = 'symbol' | 'last_close' | 'signal' | 'trend' | 'rsi_14' | 'updated_at';
type SortOrder = 'asc' | 'desc' | null;

export default function SignalsPage() {
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. States สำหรับ Search & Sort & Pagination
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    const loadMarketSignals = async () => {
      try {
        setLoading(true);
        setError(null);

        const host = getClientHost();
        const port = getClientPort();
        
        const response = await fetch(`http://${host}:${port}/api/MarketSignals`, {
          cache: 'no-store'
        });

        if (!response.ok) {
          throw new Error(`เซิร์ฟเวอร์ตอบกลับผิดพลาด: ${response.status}`);
        }

        const data = await response.json();
        setSignals(data);
        setCurrentPage(1);
      } catch (err: any) {
        console.error("API Fetching Error: ", err);
        setError("ไม่สามารถดึงข้อมูลจาก API ได้ กรุณาตรวจสอบการเชื่อมต่อหรือปัญหา CORS");
      } finally {
        setLoading(false);
      }
    };

    loadMarketSignals();
  }, []);

  // 2. จัดการข้อมูลการเรียงลำดับ (Sort Function)
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // ย้อนกลับมาหน้าแรกเมื่อเปลี่ยนการจัดเรียง
  };

  // 3. ตัวช่วยแสดงสัญลักษณ์ทิศทางการเรียงบนหัวตาราง (Arrow Indicator)
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return <span className="ml-1 opacity-30">⇅</span>;
    if (sortOrder === 'asc') return <span className="ml-1 text-indigo-600 dark:text-indigo-400">▲</span>;
    if (sortOrder === 'desc') return <span className="ml-1 text-indigo-600 dark:text-indigo-400">▼</span>;
    return <span className="ml-1 opacity-30">⇅</span>;
  };

  // 4. ประมวลผลข้อมูล (ค้นหา -> จัดเรียง) โดยใช้ useMemo เพื่อรีดประสิทธิภาพการทำงาน
  const processedSignals = useMemo(() => {
    let result = [...signals];

    // ขบวนการที่ 1: ค้นหา (Search) ตาม Symbol
    if (searchQuery.trim() !== '') {
      result = result.filter((item) =>
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }

    // ขบวนการที่ 2: เรียงลำดับ (Sort)
    if (sortField && sortOrder) {
      result.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        // ป้องกัน Error สำหรับค่าที่เป็น Null
        if (valA === null || valA === undefined) return sortOrder === 'asc' ? 1 : -1;
        if (valB === null || valB === undefined) return sortOrder === 'asc' ? -1 : 1;

        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        } else {
          // เปรียบเทียบแบบตัวเลข หรือ วันที่
          return sortOrder === 'asc'
            ? (valA as number) - (valB as number)
            : (valB as number) - (valA as number);
        }
      });
    }

    return result;
  }, [signals, searchQuery, sortField, sortOrder]);

  // 5. คำนวณการแบ่งหน้าสำหรับข้อมูลที่ผ่านการกรองแล้ว
  const totalItems = processedSignals.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = processedSignals.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getSignalBadge = (signal: string) => {
    switch (signal?.toUpperCase()) {
      case 'BUY': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400';
      case 'SELL': return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400';
      default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Market Signals Table</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">ข้อมูลสัญญาณเทคนิคอลล่าสุดจากระบบ</p>
        </div>

        {/* Toolbar ด้านบนตาราง (Search & PageSize Selector) */}
        {!loading && !error && (
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* กล่องค้นหา (Search input) */}
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="🔍 ค้นหาตาม Symbol... (เช่น ^BANK)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // รีเซ็ตไปหน้าแรกทันทีที่มีการกรองข้อมูลใหม่
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 pl-10 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
              />
              <span className="absolute left-3 top-2.5 text-slate-400"></span>
            </div>

            {/* ส่วนเลือกขนาดแถวแสดงผล */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-500 dark:text-slate-400">แสดงรายการ:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
              >
                <option value={5}>5 รายการ</option>
                <option value={10}>10 รายการ</option>
                <option value={20}>20 รายการ</option>
                <option value={50}>50 รายการ</option>
              </select>
              <span className="text-xs text-slate-400">(เจอทั้งหมด {totalItems} รายการ)</span>
            </div>
          </div>
        )}

        {/* Loading / Error States */}
        {loading && (
          <div className="flex h-32 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <div className="text-slate-500 animate-pulse">กำลังเรียกข้อมูลจาก API...</div>
          </div>
        )}

        {error && (
          <div className="flex h-32 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-950/20 dark:text-rose-400">
            <div className="text-sm font-medium">{error}</div>
          </div>
        )}

        {/* Data Table */}
        {!loading && !error && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                    <tr>
                      {/* หัวตารางคลิกเรียงข้อมูลได้ */}
                      <th onClick={() => handleSort('symbol')} className="cursor-pointer px-6 py-4 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                        Symbol {renderSortIndicator('symbol')}
                      </th>
                      <th onClick={() => handleSort('last_close')} className="cursor-pointer px-6 py-4 text-right transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                        Last Close {renderSortIndicator('last_close')}
                      </th>
                      <th onClick={() => handleSort('signal')} className="cursor-pointer px-6 py-4 text-center transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                        Signal {renderSortIndicator('signal')}
                      </th>
                      <th onClick={() => handleSort('trend')} className="cursor-pointer px-6 py-4 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                        Trend {renderSortIndicator('trend')}
                      </th>
                      <th onClick={() => handleSort('rsi_14')} className="cursor-pointer px-6 py-4 text-center transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                        RSI (14) {renderSortIndicator('rsi_14')}
                      </th>
                      {/* ส่วนคอลัมน์ที่ไม่จำเป็นต้องกดเรียงลำดับ */}
                      <th className="px-6 py-4 text-center">EMA (50/200)</th>
                      <th className="px-6 py-4 text-center">Cross Status</th>
                      <th onClick={() => handleSort('updated_at')} className="cursor-pointer px-6 py-4 text-right transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
                        Updated At {renderSortIndicator('updated_at')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {currentData.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          ไม่พบข้อมูลที่ตรงกับคำค้นหา
                        </td>
                      </tr>
                    ) : (
                      currentData.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                          <td className="whitespace-nowrap px-6 py-4 font-bold text-slate-950 dark:text-white">
                            {item.symbol}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right font-mono">
                            {item.last_close?.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center">
                            <span className={`inline-flex rounded px-2.5 py-0.5 text-xs font-semibold ${getSignalBadge(item.signal)}`}>
                              {item.signal}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 font-medium uppercase">
                            {item.trend}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center font-mono">
                            {item.rsi_14 !== null ? (
                              <div>
                                <span className="font-semibold">{item.rsi_14}</span>
                                <span className="block text-xs text-slate-400">OB:{item.rsi_overbought} / OS:{item.rsi_oversold}</span>
                              </div>
                            ) : "—"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center font-mono text-xs">
                            {item.ema_50 || item.ema_200 ? `50: ${item.ema_50 ?? 'N/A'} | 200: ${item.ema_200 ?? 'N/A'}` : "—"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-center">
                            {item.golden_cross && <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 px-2 py-0.5 rounded-full">Golden</span>}
                            {item.death_cross && <span className="text-xs bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400 px-2 py-0.5 rounded-full">Death</span>}
                            {!item.golden_cross && !item.death_cross && "—"}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-right text-xs text-slate-500">
                            {item.updated_at ? new Date(item.updated_at).toLocaleString('th-TH') : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row dark:border-slate-800 dark:bg-slate-950">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  แสดงหน้า <span className="font-semibold text-slate-800 dark:text-white">{currentPage}</span> จากทั้งหมด <span className="font-semibold text-slate-800 dark:text-white">{totalPages}</span> หน้า
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                  >
                    ก่อนหน้า
                  </button>

                  <div className="hidden items-center gap-1 md:flex">
                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                            : 'border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                  >
                    ถัดไป
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}