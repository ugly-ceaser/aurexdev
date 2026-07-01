'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye, Calendar, AlertCircle, Ban, CheckCircle2, UserPlus, Users } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  walletAddress?: string;
  isBlocked?: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  const handleBlock = async (userId: string, block: boolean) => {
    setActionLoading(userId);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, block }),
      });
      if (!res.ok) throw new Error("Failed to update user");
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    setActionLoading(userId);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Failed to delete user");
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 text-left">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-syne text-3xl font-extrabold text-[#0f0e0d] tracking-tight">Manage Investors</h1>
            <p className="text-sm font-light text-gray-500">Monitor investor telemetry profiles, verify payouts, and manage permissions</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-purple-100 rounded-full text-xs font-semibold text-[#7c3aed] shadow-sm">
            <Users className="h-4 w-4" />
            {users.length} Active Investors
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-2xl text-xs font-semibold border bg-red-500/10 border-red-500/30 text-rose-600 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 animate-pulse" />
            {error}
          </div>
        )}

        {/* User table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#7c3aed]" />
            <span className="text-xs font-semibold text-gray-500">Querying platform investors...</span>
          </div>
        ) : (
          <div className="glass-panel rounded-[28px] p-6 shadow-sm border border-purple-50">
            
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-gray-400 border-b border-purple-50/60 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="py-3">Investor</th>
                    <th>Email Address</th>
                    <th>Destination Wallet</th>
                    <th>Permissions</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-gray-700">
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-purple-50/50 hover:bg-purple-50/10 transition-colors">
                      <td className="py-4 font-bold text-gray-800">{user.name}</td>
                      <td className="text-gray-400 font-light font-mono">{user.email}</td>
                      <td className="font-mono text-gray-400 text-[10px]">
                        {user.walletAddress ? (
                          <span className="bg-gray-50 px-2.5 py-1 rounded-xl border border-purple-50 text-gray-700">{user.walletAddress}</span>
                        ) : (
                          <span className="text-gray-400 italic">Not set</span>
                        )}
                      </td>
                      <td>
                        <Badge
                          className={`text-[9px] uppercase tracking-wider font-bold border-none px-2 rounded-full ${
                            user.isBlocked ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </td>
                      <td className="text-gray-400 font-light text-[10px]">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            className="bg-white hover:bg-purple-50 text-[#7c3aed] border border-purple-100 rounded-xl text-[10px] font-bold px-3 h-8 shadow-sm"
                            onClick={() => router.push(`/admin/users/${user._id}`)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Details
                          </Button>
                          
                          <Button
                            size="sm"
                            className={`rounded-xl text-[10px] font-bold px-3 h-8 border-none ${
                              user.isBlocked 
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                                : "bg-rose-500 hover:bg-rose-600 text-white"
                            }`}
                            disabled={actionLoading === user._id}
                            onClick={() => handleBlock(user._id, !user.isBlocked)}
                          >
                            {actionLoading === user._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : user.isBlocked ? (
                              "Unblock"
                            ) : (
                              "Block"
                            )}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            className="bg-rose-50 hover:bg-rose-100 hover:text-rose-600 border border-rose-100 rounded-xl text-[10px] font-bold px-3 h-8"
                            disabled={actionLoading === user._id}
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="p-4 rounded-2xl bg-white/70 border border-purple-50/60 flex flex-col space-y-2 text-left"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-gray-800 text-sm">{user.name}</h4>
                    <Badge
                      className={`text-[9px] uppercase tracking-wider font-bold border-none px-2 rounded-full ${
                        user.isBlocked ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-gray-400 font-light">{user.email}</p>
                  <div className="h-[1px] bg-purple-50/50 my-1" />
                  <p className="text-[10px] text-gray-500 font-mono overflow-x-auto whitespace-nowrap">
                    Wallet: {user.walletAddress || "N/A"}
                  </p>
                  <p className="text-[10px] text-gray-450 font-light flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" />
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-purple-50">
                    <Button
                      size="sm"
                      className="bg-white hover:bg-purple-50 text-[#7c3aed] border border-purple-100 rounded-xl text-[10px] font-bold py-4 px-4 shadow-sm"
                      onClick={() => router.push(`/admin/users/${user._id}`)}
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      className={`rounded-xl text-[10px] font-bold py-4 px-4 border-none ${
                        user.isBlocked ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                      }`}
                      disabled={actionLoading === user._id}
                      onClick={() => handleBlock(user._id, !user.isBlocked)}
                    >
                      {user.isBlocked ? "Unblock User" : "Block User"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
