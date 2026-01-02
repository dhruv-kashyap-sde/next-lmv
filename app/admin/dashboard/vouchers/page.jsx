"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { Search, Filter, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
  const itemsPerPage = 10;

  // Mock data - replace with API call
  const allVouchers = [
    { 
      id: 1, 
      title: 'Amazon 20% OFF on Electronics', 
      brand: { name: 'Amazon', logo: '🛒' },
      code: 'ELEC20',
      category: 'E-commerce',
      minOrder: 999,
      expiryDate: '2025-01-15',
      createdAt: '2024-12-01',
      status: 'active',
    },
    { 
      id: 2, 
      title: 'Flipkart ₹150 OFF', 
      brand: { name: 'Flipkart', logo: '🛍️' },
      code: 'FLIP150',
      category: 'E-commerce',
      minOrder: 499,
      expiryDate: '2025-01-20',
      createdAt: '2024-12-03',
      status: 'active',
    },
    { 
      id: 3, 
      title: 'Zomato 50% OFF on Food', 
      brand: { name: 'Zomato', logo: '🍔' },
      code: 'FOOD50',
      category: 'Food Delivery',
      minOrder: 299,
      expiryDate: '2025-01-18',
      createdAt: '2024-12-05',
      status: 'active',
    },
    { 
      id: 4, 
      title: 'Myntra Fashion Sale', 
      brand: { name: 'Myntra', logo: '👗' },
      code: 'FASHION25',
      category: 'Fashion',
      minOrder: 1499,
      expiryDate: '2025-01-10',
      createdAt: '2024-11-28',
      status: 'inactive',
    },
    { 
      id: 5, 
      title: 'Swiggy First Order', 
      brand: { name: 'Swiggy', logo: '🍕' },
      code: 'FIRST100',
      category: 'Food Delivery',
      minOrder: 0,
      expiryDate: '2024-12-15',
      createdAt: '2024-11-15',
      status: 'expired',
    },
    { 
      id: 6, 
      title: 'BookMyShow ₹200 OFF', 
      brand: { name: 'BookMyShow', logo: '🎬' },
      code: 'MOVIE200',
      category: 'Entertainment',
      minOrder: 500,
      expiryDate: '2025-02-01',
      createdAt: '2024-12-10',
      status: 'active',
    },
    { 
      id: 7, 
      title: 'MakeMyTrip Travel Deal', 
      brand: { name: 'MakeMyTrip', logo: '✈️' },
      code: 'TRAVEL15',
      category: 'Travel',
      minOrder: 5000,
      expiryDate: '2025-03-15',
      createdAt: '2024-12-12',
      status: 'active',
    },
    { 
      id: 8, 
      title: 'Uber Eats 40% OFF', 
      brand: { name: 'Uber Eats', logo: '🚗' },
      code: 'UBER40',
      category: 'Food Delivery',
      minOrder: 199,
      expiryDate: '2025-01-25',
      createdAt: '2024-12-08',
      status: 'active',
    },
    { 
      id: 9, 
      title: 'Ajio Mega Sale', 
      brand: { name: 'Ajio', logo: '👔' },
      code: 'MEGA50',
      category: 'Fashion',
      minOrder: 999,
      expiryDate: '2025-01-22',
      createdAt: '2024-12-07',
      status: 'inactive',
    },
    { 
      id: 10, 
      title: 'Paytm Mall Cashback', 
      brand: { name: 'Paytm', logo: '💰' },
      code: 'CASH100',
      category: 'E-commerce',
      minOrder: 299,
      expiryDate: '2025-01-30',
      createdAt: '2024-12-14',
      status: 'active',
    },
    { 
      id: 11, 
      title: 'Nykaa Beauty Fest', 
      brand: { name: 'Nykaa', logo: '💄' },
      code: 'BEAUTY30',
      category: 'Fashion',
      minOrder: 799,
      expiryDate: '2025-02-10',
      createdAt: '2024-12-16',
      status: 'active',
    },
  ];

  // Filter vouchers based on search query
  const filteredVouchers = allVouchers.filter(voucher =>
    voucher.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    voucher.brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVouchers = filteredVouchers.slice(startIndex, endIndex);

  const handleDelete = (id) => {
    console.log('Deleting voucher:', id);
    // TODO: Implement delete API call
  };

  const handleToggleStatus = async (id, currentStatus) => {
    console.log('Toggling status for voucher:', id, currentStatus);
    // TODO: Implement status toggle API call
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-500/20 text-green-400 border-green-500/50' },
      inactive: { label: 'Inactive', className: 'bg-gray-500/20 text-gray-400 border-gray-500/50' },
      expired: { label: 'Expired', className: 'bg-red-500/20 text-red-400 border-red-500/50' },
    };
    return statusConfig[status] || statusConfig.inactive;
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
          <AddNewVoucher />
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
                {currentVouchers.length > 0 ? (
                  currentVouchers.map((voucher) => (
                    <TableRow key={voucher.id} className="h-20  hover:bg-white/5">
                      {/* Brand Logo */}
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-2xl cursor-pointer">
                              {voucher.brand.logo}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{voucher.brand.name}</p>
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
                          {voucher.code}
                        </code>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="text-muted-foreground">
                        {voucher.category}
                      </TableCell>

                      {/* Min Order */}
                      <TableCell className="text-muted-foreground">
                        {voucher.minOrder === 0 ? (
                          <span className="text-green-400">No minimum</span>
                        ) : (
                          `₹${voucher.minOrder.toLocaleString('en-IN')}`
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
                          className={getStatusBadge(voucher.status).className}
                        >
                          {getStatusBadge(voucher.status).label}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit Button */}
                          <EditVoucher voucher={voucher} />

                          {/* Delete Button */}
                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
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
                                <AlertDialogCancel
                                  >
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(voucher.id)}
                                  variant="destructive"
                                >
                                  <Trash2 />
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {/* Status Toggle */}
                          {voucher.status !== 'expired' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center">
                                  <Switch
                                    checked={voucher.status === 'active'}
                                    onCheckedChange={() => handleToggleStatus(voucher.id, voucher.status)}
                                    className="data-[state=checked]:bg-green-500"
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {voucher.status === 'active' ? 'Deactivate' : 'Activate'} voucher
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
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
