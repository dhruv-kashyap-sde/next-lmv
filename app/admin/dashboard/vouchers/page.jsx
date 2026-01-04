"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { Search, Filter, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AddNewVoucher } from './AddNewVoucher';
import { EditVoucher } from './EditVoucher';

export default function AdminVouchersPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allVouchers, setAllVouchers] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/vouchers');
      const result = await response.json();

      if (result.success) {
        setAllVouchers(result.data);
      } else {
        toast.error('Failed to fetch vouchers');
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      toast.error('An error occurred while fetching vouchers');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter vouchers based on search query
  const filteredVouchers = allVouchers.filter(voucher =>
    voucher.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.brand?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVouchers = filteredVouchers.slice(startIndex, endIndex);

  const handleDelete = async (id, title) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/vouchers?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Voucher deleted successfully');
        fetchVouchers();
      } else {
        toast.error(result.error || 'Failed to delete voucher');
      }
    } catch (error) {
      console.error('Error deleting voucher:', error);
      toast.error('An error occurred while deleting the voucher');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus; // Toggle boolean directly
      
      const response = await fetch('/api/admin/vouchers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          isActive: newStatus,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Voucher ${newStatus ? 'activated' : 'deactivated'} successfully`);
        fetchVouchers();
      } else {
        toast.error(result.error || 'Failed to update voucher status');
      }
    } catch (error) {
      console.error('Error toggling voucher status:', error);
      toast.error('An error occurred while updating the voucher status');
    }
  };

  const getStatusBadge = (voucher) => {
    const isExpired = new Date(voucher.expiryDate) < new Date();
    
    if (isExpired) {
      return { label: 'Expired', className: 'bg-red-500/20 text-red-400 border-red-500/50' };
    }
    
    if (voucher.isActive) {
      return { label: 'Active', className: 'bg-green-500/20 text-green-400 border-green-500/50' };
    }
    
    return { label: 'Inactive', className: 'bg-gray-500/20 text-gray-400 border-gray-500/50' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      <DashboardNavbar title="Vouchers Management" />
      <main className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <p className="text-gray-400">Manage all vouchers and offers</p>
          <AddNewVoucher onSuccess={fetchVouchers} />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search vouchers by title, code or brand..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="pl-10 bg-white/5 border focus:border-primary"
            />
          </div>
          <Button variant="secondary" >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Vouchers Table */}
        <div className="bg-background border rounded-lg overflow-hidden">
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow className=" font-raleway bg-muted/50">
                  <TableHead className="text-foreground font-semibold">Brand</TableHead>
                  <TableHead className="text-foreground font-semibold">Voucher Title</TableHead>
                  <TableHead className="text-foreground font-semibold">Code</TableHead>
                  <TableHead className="text-foreground font-semibold">Category</TableHead>
                  <TableHead className="text-foreground font-semibold">Min Order</TableHead>
                  <TableHead className="text-foreground font-semibold">Expiry Date</TableHead>
                  <TableHead className="text-foreground font-semibold">Status</TableHead>
                  <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className='hover:bg-transparent'>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <Spinner className="mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : currentVouchers.length > 0 ? (
                  currentVouchers.map((voucher) => {
                    const statusInfo = getStatusBadge(voucher);
                    return (
                      <TableRow key={voucher._id} className="h-20  hover:bg-white/5">
                        {/* Brand Logo */}
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-2xl cursor-pointer">
                                <img className='h-full w-full rounded-full object-cover' src={voucher.brand?.logo || ""} alt={voucher.brand?.name || "Brand Logo"} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{voucher.brand?.name || 'Unknown Brand'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>

                        {/* Voucher Title with Creation Date */}
                        <TableCell>
                          <div>
                            <p className="text-white font-medium">{voucher.title}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Created on {formatDate(voucher.createdAt)}
                            </p>
                          </div>
                        </TableCell>

                        {/* Code */}
                        <TableCell>
                          <code className="px-2 py-1 bg-white/10 rounded text-sm font-mono text-primary">
                            {voucher.code || 'N/A'}
                          </code>
                        </TableCell>

                        {/* Category */}
                        <TableCell className="text-muted-foreground">
                          {voucher.category?.name || 'Uncategorized'}
                        </TableCell>

                        {/* Min Order */}
                        <TableCell className="text-muted-foreground">
                          {voucher.minOrder === 0 ? (
                            <span className="text-green-400">No minimum</span>
                          ) : (
                            `₹${voucher.minOrder?.toLocaleString('en-IN') || 0}`
                          )}
                        </TableCell>

                        {/* Expiry Date */}
                        <TableCell className="text-muted-foreground">
                          {formatDate(voucher.expiryDate)}
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={statusInfo.className}
                          >
                            {statusInfo.label}
                          </Badge>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit Button */}
                            <EditVoucher voucher={voucher} onSuccess={fetchVouchers} />

                            {/* Delete Button */}
                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                      disabled={deletingId === voucher._id}
                                    >
                                      {deletingId === voucher._id ? (
                                        <Spinner className="h-4 w-4" />
                                      ) : (
                                        <Trash2 className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>Delete voucher</TooltipContent>
                              </Tooltip>
                              <AlertDialogContent className=" border">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-bebas text-2xl text-primary">
                                    Delete Voucher
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{voucher.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(voucher._id, voucher.title)}
                                    variant="destructive"
                                  >
                                    <Trash2 />
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            {/* Status Toggle */}
                            {statusInfo.label !== 'Expired' && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="flex items-center">
                                    <Switch
                                      checked={voucher.isActive}
                                      onCheckedChange={() => handleToggleStatus(voucher._id, voucher.isActive)}
                                      className="data-[state=checked]:bg-green-500"
                                    />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {voucher.isActive ? 'Deactivate' : 'Activate'} voucher
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className='hover:bg-transparent'>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <p className="text-muted-foreground">No vouchers found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>

        {/* Pagination */}
        {filteredVouchers.length > 0 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-400">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredVouchers.length)} of {filteredVouchers.length} vouchers
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border text-white hover:bg-white/5 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={
                      currentPage === page
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "border text-white hover:bg-white/5"
                    }
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="border text-white hover:bg-white/5 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
