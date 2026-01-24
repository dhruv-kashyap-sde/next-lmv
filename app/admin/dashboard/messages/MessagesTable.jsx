"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessageActions, ViewMessageDialog } from "./MessageActions";
import { Mail, User, Clock, MessageSquare } from "lucide-react";

const typeColors = {
  feedback: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  question: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  help: "bg-green-500/20 text-green-400 border-green-500/30",
  bug: "bg-red-500/20 text-red-400 border-red-500/30",
  other: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

const statusColors = {
  new: "bg-amber-500/20 text-amber-400",
  read: "bg-blue-500/20 text-blue-400",
  replied: "bg-green-500/20 text-green-400",
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes}m ago`;
    }
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
}

export default function MessagesTable({ messages }) {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const handleRowClick = (message) => {
    setSelectedMessage(message);
    setShowViewDialog(true);
  };

  return (
    <>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400 font-medium">Sender</TableHead>
              <TableHead className="text-zinc-400 font-medium">Message</TableHead>
              <TableHead className="text-zinc-400 font-medium">Type</TableHead>
              <TableHead className="text-zinc-400 font-medium">Status</TableHead>
              <TableHead className="text-zinc-400 font-medium">Date</TableHead>
              <TableHead className="text-zinc-400 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow
                key={message._id}
                className={`border-zinc-800 cursor-pointer transition-colors ${
                  message.status === "new"
                    ? "bg-amber-500/5 hover:bg-amber-500/10"
                    : "hover:bg-zinc-800/50"
                }`}
                onClick={() => handleRowClick(message)}
              >
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground flex items-center gap-1">
                      {message.status === "new" && (
                        <span className="w-2 h-2 bg-amber-400 rounded-full" />
                      )}
                      {message.name}
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {message.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="text-zinc-300 truncate">
                    {message.message}
                  </p>
                  {message.replies && message.replies.length > 0 && (
                    <span className="text-xs text-primary">
                      {message.replies.length} {message.replies.length === 1 ? "reply" : "replies"}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium capitalize border ${
                      typeColors[message.type]
                    }`}
                  >
                    {message.type}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      statusColors[message.status]
                    }`}
                  >
                    {message.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-zinc-400 text-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(message.createdAt)}
                  </span>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <MessageActions message={message} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedMessage && (
        <ViewMessageDialog
          message={selectedMessage}
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
        />
      )}
    </>
  );
}
