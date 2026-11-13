import React, { useState } from 'react';
import { Users, Shield, Lock, Unlock, Search, Filter, Edit, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { UserRole } from '../../types';

interface AccountUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'pending' | 'locked' | 'suspended';
  lastLogin: string;
}

export const RBACManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [users, setUsers] = useState<AccountUser[]>([
    { id: 'u-1', name: 'Abu Zafor', email: 'abu.zafor@diu.edu.bd', role: 'student', status: 'active', lastLogin: 'Today, 10:14 AM' },
    { id: 'u-2', name: 'Anamul Haque', email: 'anamul.haque@diu.edu.bd', role: 'student', status: 'active', lastLogin: 'Yesterday' },
    { id: 'u-3', name: 'Dr. Farhana Rahman', email: 'farhana.rahman@diu.edu.bd', role: 'faculty', status: 'active', lastLogin: 'Today, 09:30 AM' },
    { id: 'u-4', name: 'Dr. Tanvir Ahmed', email: 'tanvir.ahmed@diu.edu.bd', role: 'faculty', status: 'active', lastLogin: 'Nov 09, 2026' },
    { id: 'u-5', name: 'Prof. Md. Rafiqul Islam', email: 'rafiqul.islam@diu.edu.bd', role: 'faculty', status: 'active', lastLogin: 'Nov 08, 2026' },
    { id: 'u-6', name: 'Engr. Sakib Al Hasan', email: 'sakib@techbridge.io', role: 'mentor', status: 'active', lastLogin: 'Nov 07, 2026' },
    { id: 'u-7', name: 'Prof. Dr. Syed Akhter Hossain', email: 'coord@diu.edu.bd', role: 'coordinator', status: 'active', lastLogin: 'Today, 08:00 AM' },
    { id: 'u-8', name: 'System Administrator', email: 'admin@diu.edu.bd', role: 'admin', status: 'active', lastLogin: 'Active Now' },
    { id: 'u-9', name: 'DIU Quality Assurance Cell', email: 'qa@diu.edu.bd', role: 'auditor', status: 'active', lastLogin: 'Nov 10, 2026' },
    { id: 'u-10', name: 'Suspended Account Example', email: 'spam.user@diu.edu.bd', role: 'student', status: 'suspended', lastLogin: 'Oct 14, 2026' },
  ]);

  const toggleLock = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id !== id) return u;
        const newStatus = u.status === 'locked' ? 'active' : 'locked';
        toast.success(`Account for ${u.name} is now ${newStatus.toUpperCase()}.`);
        return { ...u, status: newStatus };
      })
    );
  };

  const handleRoleChange = (id: string, newRole: UserRole) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    toast.success('User role permission updated.');
  };

  const filtered = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-bold text-[#334155] flex items-center gap-2">
          <Shield className="text-[#8AB4F8]" size={22} />
          Role-Based Access Control (RBAC) & Accounts
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Manage user identity privileges across the 6 institutional platform roles
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 bg-white border border-[#E2E8F0] shadow-sm rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search size={14} className="text-[#64748B]" />
          <input
            type="text"
            placeholder="Search by name, institutional email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input text-xs py-1.5 border-[#E2E8F0] bg-white text-[#334155] focus:border-[#8AB4F8]"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#334155]">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="input text-xs py-1 w-40 border-[#E2E8F0] bg-white text-[#334155]"
          >
            <option value="ALL">All Roles ({users.length})</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="mentor">Industry Mentor</option>
            <option value="coordinator">Coordinator</option>
            <option value="admin">Administrator</option>
            <option value="auditor">Auditor</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-x-auto shadow-sm bg-white border border-[#E2E8F0] rounded-3xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F4F8FF]/80 text-[#64748B] uppercase font-mono">
              <th className="p-4">User</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Account Status</th>
              <th className="p-4">Last Activity</th>
              <th className="p-4 text-right">Administrative Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-[#F4F8FF]/50 transition-colors">
                <td className="p-4">
                  <span className="font-bold text-[#334155] block">{u.name}</span>
                  <span className="font-mono text-[11px] text-[#64748B]">{u.email}</span>
                </td>

                <td className="p-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                    className="input text-xs py-1 font-semibold capitalize border-[#E2E8F0] bg-white text-[#334155]"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="mentor">Industry Mentor</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="admin">Administrator</option>
                    <option value="auditor">Auditor</option>
                  </select>
                </td>

                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      u.status === 'active'
                        ? 'bg-[#A7E8D0]/30 text-[#0F766E] border border-[#A7E8D0]/60'
                        : u.status === 'locked'
                        ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {u.status.toUpperCase()}
                  </span>
                </td>

                <td className="p-4 text-[#64748B] font-mono">{u.lastLogin}</td>

                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => toggleLock(u.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                      u.status === 'locked'
                        ? 'bg-[#8AB4F8] text-[#1E293B] hover:bg-[#72A3F6]'
                        : 'bg-[#F4F8FF] text-[#334155] border border-[#E2E8F0] hover:bg-[#EAF2FF]'
                    }`}
                  >
                    {u.status === 'locked' ? (
                      <>
                        <Unlock size={12} /> Unlock
                      </>
                    ) : (
                      <>
                        <Lock size={12} /> Lock
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RBACManagement;

