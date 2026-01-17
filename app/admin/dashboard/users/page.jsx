"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { Users, Search, Filter, UserPlus, Mail, Shield, Trash2, Edit, MoreVertical, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'user', isActive: true });
  const [submitting, setSubmitting] = useState(false);


  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('page', pagination.page.toString());

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter, pagination.page]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle create user
  const handleCreateUser = async () => {
    if (!formData.name || !formData.email) {
      toast.error('Name and email are required');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        toast.success('User created successfully');
        setCreateDialogOpen(false);
        setFormData({ name: '', email: '', role: 'user', isActive: true });
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to create user');
      }
    } catch (err) {
      toast.error('Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle update user
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedUser._id,
          ...formData,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success('User updated successfully');
        setEditDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to update user');
      }
    } catch (err) {
      toast.error('Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/admin/users?id=${selectedUser._id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        toast.success('User deleted successfully');
        setDeleteDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to delete user');
      }
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setSubmitting(false);
    }
  };

  // Open edit dialog
  const openEditDialog = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Toggle user status
  const toggleUserStatus = async (user) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user._id,
          isActive: !user.isActive,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to update user status');
      }
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  // Table skeleton
  const TableSkeleton = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-b border-white/10">
          <td className="px-6 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </td>
          <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
          <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
          <td className="px-6 py-4"><Skeleton className="h-4 w-8" /></td>
          <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
          <td className="px-6 py-4"><Skeleton className="h-8 w-20 ml-auto" /></td>
        </tr>
      ))}
    </>
  );

  return (
    <>
      <DashboardNavbar title="Users Management" />
      <main className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <p className="text-gray-400">
            Manage all users and permissions
            {pagination.total > 0 && (
              <span className="ml-2 text-primary">({pagination.total} total)</span>
            )}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchUsers} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="brand" onClick={() => {
              setFormData({ name: '', email: '', role: 'user', isActive: true });
              setCreateDialogOpen(true);
            }}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search users by name or email..."
              className="pl-10 bg-white/5 border-white/10 focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg mb-6">
            {error}
            <Button variant="link" className="text-red-400 ml-2" onClick={fetchUsers}>
              Retry
            </Button>
          </div>
        )}

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
                {loading ? (
                  <TableSkeleton />
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No users found</p>
                    </td>
                  </tr>
                ) : (
                  users.map((userItem) => (
                    <tr key={userItem._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10 border-2 border-primary/50">
                            <AvatarImage src={userItem.image} alt={userItem.name} />
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
                          <span className={userItem.role === 'admin' ? 'text-primary font-semibold capitalize' : 'text-gray-300 capitalize'}>
                            {userItem.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={userItem.isActive ? 'default' : 'secondary'}
                          className={userItem.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}
                        >
                          {userItem.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{userItem.vouchersCount}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(userItem.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(userItem)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleUserStatus(userItem)}>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              {userItem.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-400 focus:text-red-400"
                              onClick={() => openDeleteDialog(userItem)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
            >
              Previous
            </Button>
            <span className="px-4 py-2 text-gray-400">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.pages}
              onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
            >
              Next
            </Button>
          </div>
        )}
      </main>

      {/* Create User Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="bg-sidebar border-white/10">
          <DialogHeader>
            <DialogTitle className="text-primary">Create New User</DialogTitle>
            <DialogDescription>Add a new user to the system.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button variant="brand" onClick={handleCreateUser} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-sidebar border-white/10">
          <DialogHeader>
            <DialogTitle className="text-primary">Edit User</DialogTitle>
            <DialogDescription>Update user information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button variant="brand" onClick={handleUpdateUser} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-sidebar border-white/10">
          <DialogHeader>
            <DialogTitle className="text-red-400">Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="text-white font-semibold">{selectedUser?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={submitting}>
              {submitting ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
