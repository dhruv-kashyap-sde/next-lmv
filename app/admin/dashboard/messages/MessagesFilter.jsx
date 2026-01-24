"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, SortAsc, SortDesc, X } from "lucide-react";

export function MessagesFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentType = searchParams.get("type") || "all";
  const currentStatus = searchParams.get("status") || "all";
  const currentSort = searchParams.get("sortBy") || "createdAt";
  const currentOrder = searchParams.get("sortOrder") || "desc";

  const updateFilters = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // Reset to page 1 on filter change
    router.push(`/admin/dashboard/messages?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/admin/dashboard/messages");
  };

  const hasActiveFilters = currentType !== "all" || currentStatus !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {/* Type Filter */}
      <Select
        value={currentType}
        onValueChange={(value) => updateFilters("type", value)}
      >
        <SelectTrigger className="w-[140px] bg-zinc-900/50 border-zinc-800">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="feedback">Feedback</SelectItem>
          <SelectItem value="question">Question</SelectItem>
          <SelectItem value="help">Help</SelectItem>
          <SelectItem value="bug">Bug Report</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select
        value={currentStatus}
        onValueChange={(value) => updateFilters("status", value)}
      >
        <SelectTrigger className="w-[140px] bg-zinc-900/50 border-zinc-800">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="read">Read</SelectItem>
          <SelectItem value="replied">Replied</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={`${currentSort}-${currentOrder}`}
        onValueChange={(value) => {
          const [sortBy, sortOrder] = value.split("-");
          const params = new URLSearchParams(searchParams.toString());
          params.set("sortBy", sortBy);
          params.set("sortOrder", sortOrder);
          params.delete("page");
          router.push(`/admin/dashboard/messages?${params.toString()}`);
        }}
      >
        <SelectTrigger className="w-[160px] bg-zinc-900/50 border-zinc-800">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Newest First</SelectItem>
          <SelectItem value="createdAt-asc">Oldest First</SelectItem>
          <SelectItem value="type-asc">Type (A-Z)</SelectItem>
          <SelectItem value="type-desc">Type (Z-A)</SelectItem>
          <SelectItem value="status-asc">Status (A-Z)</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-zinc-400 hover:text-white"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}

export function MessagesPagination({ pagination }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/admin/dashboard/messages?${params.toString()}`);
  };

  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-800">
      <p className="text-sm text-zinc-500">
        Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
        {pagination.total} messages
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(pagination.page - 1)}
          disabled={pagination.page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm text-zinc-400 px-2">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
