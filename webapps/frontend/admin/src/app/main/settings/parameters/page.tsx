"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Sliders, 
  Plus, 
  Search, 
  RefreshCw, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Code2, 
  Hash, 
  ToggleLeft, 
  FileText,
  Clock
} from "lucide-react";

export interface SystemParameter {
  paramId: number;
  paramKey: string;
  paramValue: string;
  valueType: string;
  description?: string;
  updatedAt?: string;
}

const VALUE_TYPES = [
  { value: "STRING", label: "String (ข้อความ)", icon: FileText, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "INT", label: "Integer (ตัวเลข)", icon: Hash, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "BOOL", label: "Boolean (จริง/เท็จ)", icon: ToggleLeft, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "JSON", label: "JSON Object", icon: Code2, color: "bg-purple-50 text-purple-700 border-purple-200" },
];

export default function ParameterSettingsPage() {
  const [parameters, setParameters] = useState<SystemParameter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingParam, setEditingParam] = useState<SystemParameter | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    paramKey: "",
    paramValue: "",
    valueType: "STRING",
    description: "",
  });

  // Notification State
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchParameters = async () => {
    setLoading(true);
    try {
      const res = await api.get<SystemParameter[]>("/system-parameters");
      setParameters(res.data || []);
    } catch (err: any) {
      console.error("Failed to fetch system parameters:", err);
      showNotification("error", err.response?.data?.message || "ไม่สามารถดึงข้อมูล System Parameters ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingParam(null);
    setFormData({
      paramKey: "",
      paramValue: "",
      valueType: "STRING",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (param: SystemParameter) => {
    setEditingParam(param);
    setFormData({
      paramKey: param.paramKey,
      paramValue: param.paramValue,
      valueType: param.valueType || "STRING",
      description: param.description || "",
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paramKey.trim()) {
      showNotification("error", "กรุณาระบุ Parameter Key");
      return;
    }

    setSubmitting(true);
    try {
      if (editingParam) {
        // PATCH /system-parameters/:id
        await api.patch(`/system-parameters/${editingParam.paramId}`, {
          paramValue: formData.paramValue,
          valueType: formData.valueType,
          description: formData.description,
        });
        showNotification("success", `แก้ไข Parameter "${formData.paramKey}" สำเร็จ`);
      } else {
        // POST /system-parameters
        await api.post("/system-parameters", {
          paramKey: formData.paramKey.trim(),
          paramValue: formData.paramValue,
          valueType: formData.valueType,
          description: formData.description,
        });
        showNotification("success", `สร้าง Parameter "${formData.paramKey}" สำเร็จ`);
      }
      setIsModalOpen(false);
      fetchParameters();
    } catch (err: any) {
      console.error("Submit parameter failed:", err);
      const msg = err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
      showNotification("error", Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredParameters = useMemo(() => {
    return parameters.filter((param) => {
      const matchSearch =
        param.paramKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (param.description && param.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        param.paramValue.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = filterType === "ALL" || param.valueType === filterType;

      return matchSearch && matchType;
    });
  }, [parameters, searchQuery, filterType]);

  const getTypeBadge = (type: string) => {
    const config = VALUE_TYPES.find((t) => t.value === type) || {
      label: type,
      icon: FileText,
      color: "bg-slate-100 text-slate-700 border-slate-200",
    };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.value}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 transform translate-y-0 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-200 border border-blue-400/30">
              <Sliders className="h-3.5 w-3.5" />
              <span>System Configuration</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">System Parameters</h1>
            <p className="text-sm text-slate-300 max-w-xl">
              จัดการค่าตัวแปรการตั้งค่าหลักของระบบ เช่น ขีดจำกัดเวลา, ข้อความระบบ, ค่าสถานะการทำงาน และคอนฟิกูเรชันต่างๆ
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={fetchParameters}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              รีเฟรช
            </Button>
            <Button
              onClick={handleOpenCreateModal}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              เพิ่ม Parameter
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>รายการ System Parameters</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {filteredParameters.length} รายการ
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                ค้นหาและปรับแต่งค่าพารามิเตอร์ของระบบเรียลไทม์
              </CardDescription>
            </div>

            {/* Filter and Search controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Type Filter */}
              <div className="relative shrink-0">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-9 px-3 pr-8 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
                >
                  <option value="ALL">ทุกประเภท (Types)</option>
                  <option value="STRING">STRING</option>
                  <option value="INT">INT</option>
                  <option value="BOOL">BOOL</option>
                  <option value="JSON">JSON</option>
                </select>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="ค้นหา Key หรือคำอธิบาย..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-xs h-9 bg-white border-slate-200 focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto" />
              <p className="text-sm font-medium text-slate-500">กำลังโหลดข้อมูล System Parameters...</p>
            </div>
          ) : filteredParameters.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Sliders className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-slate-700">ไม่พบรายการ Parameter</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery || filterType !== "ALL"
                  ? "ลองปรับเปลี่ยนเงื่อนไขค้นหาหรือตัวกรองประเภทเพื่อค้นหาใหม่"
                  : "เริ่มต้นโดยการคลิกปุ่ม 'เพิ่ม Parameter' เพื่อสร้างตัวแปรแรกในระบบ"}
              </p>
              {(searchQuery || filterType !== "ALL") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterType("ALL");
                  }}
                  className="mt-2 text-xs"
                >
                  ล้างตัวกรองทั้งหมด
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-16 text-center">ID</th>
                    <th className="py-3.5 px-4">Parameter Key</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4 max-w-xs">Value</th>
                    <th className="py-3.5 px-4">คำอธิบาย (Description)</th>
                    <th className="py-3.5 px-4 text-right">อัปเดตล่าสุด</th>
                    <th className="py-3.5 px-4 w-20 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredParameters.map((param) => (
                    <tr
                      key={param.paramId}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-400">
                        #{param.paramId}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-800">
                        <span className="px-2 py-1 rounded bg-slate-100 border border-slate-200">
                          {param.paramKey}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{getTypeBadge(param.valueType)}</td>
                      <td className="py-3.5 px-4 font-mono text-xs max-w-xs truncate text-slate-700">
                        <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60 block truncate" title={param.paramValue}>
                          {param.paramValue}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs truncate">
                        {param.description || <span className="text-slate-300 italic">- ไม่มีคำอธิบาย -</span>}
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs text-slate-400 font-mono">
                        {param.updatedAt ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(param.updatedAt).toLocaleString("th-TH", {
                              year: "2-digit",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(param)}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-100/60 rounded-lg cursor-pointer transition-colors"
                          title="แก้ไข Parameter"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden transition-all transform scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {editingParam ? "แก้ไข System Parameter" : "เพิ่ม System Parameter ใหม่"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingParam ? `ID: #${editingParam.paramId}` : "กำหนดค่าพารามิเตอร์ใหม่สำหรับระบบ"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Parameter Key */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>Parameter Key</span>
                  <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  disabled={!!editingParam}
                  placeholder="เช่น JWT_EXPIRES_MINUTES, MAX_LOGIN_ATTEMPTS"
                  value={formData.paramKey}
                  onChange={(e) => setFormData({ ...formData, paramKey: e.target.value.toUpperCase() })}
                  className={`font-mono text-xs h-10 ${
                    editingParam ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-white border-slate-300 focus:ring-blue-500"
                  }`}
                />
                <p className="text-[11px] text-slate-400">
                  {editingParam ? "ไม่สามารถแก้ไข Key ได้เมื่อสร้างแล้ว" : "ใช้ตัวพิมพ์ใหญ่ (UPPERCASE) และขีดล่าง (_) ในการตั้งชื่อ"}
                </p>
              </div>

              {/* Value Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>Value Type (ชนิดข้อมูล)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {VALUE_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.valueType === type.value;
                    return (
                      <button
                        type="button"
                        key={type.value}
                        onClick={() => setFormData({ ...formData, valueType: type.value })}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                          isSelected
                            ? "border-blue-500 bg-blue-50/70 text-blue-700 font-semibold shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-blue-600" : "text-slate-400"}`} />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Parameter Value */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>Parameter Value (ค่าตัวแปร)</span>
                </label>
                {formData.valueType === "BOOL" ? (
                  <select
                    value={formData.paramValue}
                    onChange={(e) => setFormData({ ...formData, paramValue: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg text-xs font-medium border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="true">true (จริง)</option>
                    <option value="false">false (เท็จ)</option>
                  </select>
                ) : (
                  <textarea
                    rows={3}
                    placeholder={
                      formData.valueType === "INT"
                        ? "ใส่ตัวเลข เช่น 15"
                        : formData.valueType === "JSON"
                        ? '{"key": "value"}'
                        : "ใส่ค่าข้อความตามต้องการ..."
                    }
                    value={formData.paramValue}
                    onChange={(e) => setFormData({ ...formData, paramValue: e.target.value })}
                    className="w-full p-3 rounded-lg font-mono text-xs border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  คำอธิบาย (Description)
                </label>
                <Input
                  placeholder="อธิบายวัตถุประสงค์และการใช้งานของ Parameter นี้..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="text-xs h-10 border-slate-300 bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs cursor-pointer"
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 cursor-pointer shadow-md shadow-blue-600/20"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      กำลังบันทึก...
                    </span>
                  ) : editingParam ? (
                    "บันทึกการแก้ไข"
                  ) : (
                    "สร้าง Parameter"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}