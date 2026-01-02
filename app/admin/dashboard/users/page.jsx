"use client";
import { useRouter } from 'next/navigation';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { Users, Search, Filter, UserPlus, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminUsersPage() {
  const router = useRouter();

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  };

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'Active', vouchers: 12, joined: '2024-12-01' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'Active', vouchers: 8, joined: '2024-12-05' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'user', status: 'Active', vouchers: 15, joined: '2024-11-20' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'admin', status: 'Active', vouchers: 5, joined: '2024-10-15' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'user', status: 'Inactive', vouchers: 3, joined: '2024-12-10' },
  ];

  return (
    <>
      <DashboardNavbar title="Users Management" />
      <main className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <p className="text-gray-400">Manage all users and permissions</p>
        <Button variant="brand" onClick={() => router.push('/admin/dashboard/users/new')}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search users..."
            className="pl-10 bg-white/5 border-white/10 focus:border-primary"
          />
        </div>
        <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Vouchers
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((userItem) => (
                <tr key={userItem.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 border-2 border-primary/50">
                        <AvatarImage src={userItem.avatar} alt={userItem.name} />
                        <AvatarFallback className="bg-linear-to-br from-primary to-background text-white font-semibold text-sm">
                          {getInitials(userItem.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white font-medium">{userItem.name}</p>
                        <div className="flex items-center gap-1 text-gray-400 text-sm">
                          <Mail className="w-3 h-3" />
                          <span>{userItem.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {userItem.role === 'admin' && <Shield className="w-4 h-4 text-primary" />}
                      <span className={userItem.role === 'admin' ? 'text-primary font-semibold' : 'text-gray-300'}>
                        {userItem.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={userItem.status === 'Active' ? 'default' : 'secondary'}
                      className={userItem.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}
                    >
                      {userItem.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{userItem.vouchers}</td>
                  <td className="px-6 py-4 text-gray-300">{userItem.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </main>
    </>
  );
}
