"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Users, 
  UserPlus, 
  Search, 
  RefreshCw, 
  Edit3, 
  Trash2, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Clock, 
  Wifi, 
  Eye, 
  EyeOff,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  UsersRound,
  Filter
} from "lucide-react";

export interface UserGroup {
  groupId: number;
  groupName: string;
  description?: string;
}

export interface UserItem {
  userId: string;
  username: string;
  email: string;
  status: string; // 'ACTIVE' | 'DISABLED'
  isActive?: boolean;
  isLoggedIn?: boolean;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  groups?: UserGroup[];
}

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterGroup, setFilterGroup] = useState<string>("ALL");

  // Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Delete Dialog State
  const [deletingUser, setDeletingUser] = useState<UserItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    status: "ACTIVE",
  });

  // Toast Notification State
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [resUsers, resGroups] = await Promise.allSettled([
        api.get<UserItem[]>("/users"),
        api.get<UserGroup[]>("/user-groups"),
      ]);

      if (resUsers.status === "fulfilled") {
        setUsers(resUsers.value.data || []);
      } else {
        console.error("Failed to fetch users:", resUsers.reason);
        showNotification("error", "ไม่สามารถดึงข้อมูลผู้ใช้งานได้");
      }

      if (resGroups.status === "fulfilled") {
        setUserGroups(resGroups.value.data || []);
      } else {
        console.error("Failed to fetch user groups:", resGroups.reason);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterGroup, pageSize]);

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      status: "ACTIVE",
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      status: user.status || "ACTIVE",
    });
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.email.trim()) {
      showNotification("error", "กรุณากรอก Username และ Email ให้ครบถ้วน");
      return;
    }

    if (!editingUser && !formData.password) {
      showNotification("error", "กรุณาระบุรหัสผ่านสำหรับการสร้างผู้ใช้ใหม่");
      return;
    }

    setSubmitting(true);
    try {
      if (editingUser) {
        // PATCH /users/:id
        const payload: any = {
          email: formData.email.trim(),
          status: formData.status,
        };
        if (formData.password.trim()) {
          payload.passwordHash = formData.password.trim();
        }
        await api.patch(`/users/${editingUser.userId}`, payload);
        showNotification("success", `แก้ไขข้อมูลผู้ใช้ "${formData.username}" สำเร็จ`);
      } else {
        // POST /users
        await api.post("/users", {
          username: formData.username.trim(),
          email: formData.email.trim(),
          passwordHash: formData.password.trim(),
          status: formData.status,
        });
        showNotification("success", `สร้างผู้ใช้งาน "${formData.username}" สำเร็จ`);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error("Submit user failed:", err);
      const msg = err.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ใช้งาน";
      showNotification("error", Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setDeleting(true);
    try {
      await api.delete(`/users/${deletingUser.userId}`);
      showNotification("success", `ลบผู้ใช้งาน "${deletingUser.username}" สำเร็จ`);
      setDeletingUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error("Delete user failed:", err);
      showNotification("error", err.response?.data?.message || "ไม่สามารถลบผู้ใช้งานได้");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered list based on search, status, and user group
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = filterStatus === "ALL" || user.status === filterStatus;

      const matchGroup =
        filterGroup === "ALL" ||
        (user.groups && user.groups.some((g) => g.groupId.toString() === filterGroup));

      return matchSearch && matchStatus && matchGroup;
    });
  }, [users, searchQuery, filterStatus, filterGroup]);

  // Pagination calculation
  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, validCurrentPage, pageSize]);

  const startIndex = totalItems === 0 ? 0 : (validCurrentPage - 1) * pageSize + 1;
  const endIndex = Math.min(validCurrentPage * pageSize, totalItems);

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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-200 border border-blue-400/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Identity & Access Management</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">User Management</h1>
            <p className="text-sm text-slate-300 max-w-xl">
              จัดการผู้ใช้งาน สิทธิ์การเข้าถึง บัญชีผู้ใช้ และติดตามสถานะการเข้าใช้งานในระบบ Admin Portal
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={fetchUsers}
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
              <UserPlus className="h-4 w-4 mr-2" />
              เพิ่มผู้ใช้งานใหม่
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="border-slate-200 shadow-sm bg-white rounded-xl overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>รายชื่อผู้ใช้งานทั้งหมด</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {totalItems} คน
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                ค้นหาและจัดการสิทธิ์ผู้ใช้งานระบบเรียลไทม์
              </CardDescription>
            </div>

            {/* Filter and Search controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* User Group Filter */}
              <div className="relative shrink-0">
                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="h-9 px-3 pr-8 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
                >
                  <option value="ALL">👥 กลุ่มผู้ใช้ทั้งหมด (All Groups)</option>
                  {userGroups.map((g) => (
                    <option key={g.groupId} value={g.groupId.toString()}>
                      {g.groupName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative shrink-0">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-9 px-3 pr-8 rounded-lg text-xs font-medium border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
                >
                  <option value="ALL">ทุกสถานะ (All Status)</option>
                  <option value="ACTIVE">ACTIVE (ใช้งานได้)</option>
                  <option value="DISABLED">DISABLED (ระงับการใช้งาน)</option>
                </select>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="ค้นหา Username / Email..."
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
              <p className="text-sm font-medium text-slate-500">กำลังโหลดข้อมูลผู้ใช้งาน...</p>
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-slate-700">ไม่พบรายชื่อผู้ใช้งาน</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {searchQuery || filterStatus !== "ALL" || filterGroup !== "ALL"
                  ? "ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อค้นหาใหม่"
                  : "เริ่มต้นโดยคลิกปุ่ม 'เพิ่มผู้ใช้งานใหม่' เพื่อสร้างบัญชีแรก"}
              </p>
              {(searchQuery || filterStatus !== "ALL" || filterGroup !== "ALL") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("ALL");
                    setFilterGroup("ALL");
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
                    <th className="py-3.5 px-4">ผู้ใช้งาน (Username)</th>
                    <th className="py-3.5 px-4">อีเมล (Email)</th>
                    <th className="py-3.5 px-4">กลุ่มผู้ใช้ (Groups)</th>
                    <th className="py-3.5 px-4 text-center">สถานะใช้งาน</th>
                    <th className="py-3.5 px-4 text-center">การออนไลน์</th>
                    <th className="py-3.5 px-4 text-right">เข้าสู่ระบบล่าสุด</th>
                    <th className="py-3.5 px-4 text-right">วันที่สร้าง</th>
                    <th className="py-3.5 px-4 w-24 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedUsers.map((user) => (
                    <tr
                      key={user.userId}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* Username & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                            {user.username ? user.username.substring(0, 2).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm">{user.username}</div>
                            <div className="text-[10px] text-slate-400 font-mono">ID: {user.userId.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {user.email}
                        </span>
                      </td>

                      {/* User Groups Badges */}
                      <td className="py-3.5 px-4 text-xs">
                        {user.groups && user.groups.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {user.groups.map((group) => (
                              <span
                                key={group.groupId}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold"
                              >
                                <UsersRound className="h-3 w-3" />
                                {group.groupName}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-300 italic text-xs">- ไม่มีกลุ่ม -</span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            user.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              user.status === "ACTIVE" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {user.status === "ACTIVE" ? "ACTIVE" : "DISABLED"}
                        </span>
                      </td>

                      {/* Online State */}
                      <td className="py-3.5 px-4 text-center">
                        {user.isLoggedIn ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            <Wifi className="h-3 w-3 animate-pulse" />
                            Online
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Offline</span>
                        )}
                      </td>

                      {/* Last Login */}
                      <td className="py-3.5 px-4 text-right text-xs text-slate-500 font-mono">
                        {user.lastLogin ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {new Date(user.lastLogin).toLocaleString("th-TH", {
                              year: "2-digit",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        ) : (
                          <span className="text-slate-300 italic">- ไม่เคยเข้าสู่ระบบ -</span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-right text-xs text-slate-400 font-mono">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("th-TH") : "-"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditModal(user)}
                            className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-100/60 rounded-lg cursor-pointer transition-colors"
                            title="แก้ไขผู้ใช้งาน"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingUser(user)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-100/60 rounded-lg cursor-pointer transition-colors"
                            title="ลบผู้ใช้งาน"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer & Pagination Controls Bar */}
          {!loading && totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-600">
              {/* Items per page Selector & Info */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span>แสดงผลต่อหน้า:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="h-8 px-2 rounded.md border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size} รายการ
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-slate-500 border-l border-slate-200 pl-4">
                  แสดงผล <b className="text-slate-800">{startIndex}</b> - <b className="text-slate-800">{endIndex}</b> จากทั้งหมด <b className="text-blue-600 font-bold">{totalItems}</b> รายการ
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={validCurrentPage <= 1}
                  onClick={() => setCurrentPage(1)}
                  className="h-8 w-8 p-0 cursor-pointer"
                  title="หน้าแรกสุด"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={validCurrentPage <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="h-8 w-8 p-0 cursor-pointer"
                  title="หน้าถอยหลัง"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="px-3 font-semibold text-slate-700">
                  หน้า {validCurrentPage} / {totalPages}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={validCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="h-8 w-8 p-0 cursor-pointer"
                  title="หน้าถัดไป"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={validCurrentPage >= totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="h-8 w-8 p-0 cursor-pointer"
                  title="หน้าสุดท้าย"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden transition-all transform scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {editingUser ? "แก้ไขข้อมูลผู้ใช้งาน" : "สร้างบัญชีผู้ใช้งานใหม่"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingUser ? `ID: ${editingUser.userId.substring(0, 8)}...` : "กำหนดข้อมูลผู้ใช้ใหม่ลงในระบบ"}
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
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>Username (ชื่อผู้ใช้)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    disabled={!!editingUser}
                    placeholder="เช่น john_doe"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={`pl-9 text-xs h-10 ${
                      editingUser ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-white border-slate-300 focus:ring-blue-500"
                    }`}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>Email (อีเมล)</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    type="email"
                    placeholder="เช่น user@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-9 text-xs h-10 bg-white border-slate-300 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>Password (รหัสผ่าน)</span>
                  {!editingUser && <span className="text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={editingUser ? "เว้นว่างไว้หากไม่ต้องการเปลี่ยนรหัสผ่าน" : "อย่างน้อย 8 ตัวอักษร"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-9 pr-9 text-xs h-10 bg-white border-slate-300 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">สถานะผู้ใช้งาน</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "ACTIVE" })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      formData.status === "ACTIVE"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    ACTIVE (ใช้งานได้)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: "DISABLED" })}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      formData.status === "DISABLED"
                        ? "border-rose-500 bg-rose-50 text-rose-700 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    DISABLED (ระงับ)
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
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
                  ) : editingUser ? (
                    "บันทึกการแก้ไข"
                  ) : (
                    "สร้างผู้ใช้งาน"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Dialog */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-800 text-base">ยืนยันการลบผู้ใช้งาน?</h3>
              <p className="text-xs text-slate-500">
                คุณต้องการลบผู้ใช้งาน <b className="text-slate-800">"{deletingUser.username}"</b> ออกจากระบบหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeletingUser(null)}
                className="text-xs cursor-pointer w-full"
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold w-full cursor-pointer shadow-md shadow-rose-600/20"
              >
                {deleting ? "กำลังลบ..." : "ยืนยันลบผู้ใช้"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}