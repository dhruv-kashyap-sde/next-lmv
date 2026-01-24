"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Reply,
  Loader2,
  Mail,
  Clock,
  User,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// Delete confirmation dialog
export function DeleteMessageDialog({ message, open, onOpenChange }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/messages?id=${message._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete message");
      }

      toast.success("Message deleted successfully");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-400">Delete Message</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this message from{" "}
            <span className="font-semibold text-foreground">{message.name}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Reply dialog
export function ReplyMessageDialog({ message, open, onOpenChange }) {
  const router = useRouter();
  const [replyContent, setReplyContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);

  const handleSendReply = async () => {
    if (!replyContent.trim() || replyContent.trim().length < 10) {
      toast.error("Reply must be at least 10 characters");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch(`/api/admin/messages/${message._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: replyContent.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reply");
      }

      toast.success("Reply sent successfully!");
      setReplyContent("");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Reply className="w-5 h-5 text-primary" />
            Reply to {message.name}
          </DialogTitle>
          <DialogDescription>
            Send an email response to{" "}
            <span className="text-primary">{message.email}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original message */}
          <div className="bg-zinc-900/50 rounded-lg border border-zinc-800">
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="w-full flex items-center justify-between p-3 text-left hover:bg-zinc-800/50 transition-colors rounded-t-lg"
            >
              <span className="text-sm font-medium text-zinc-400">
                Original Message
              </span>
              {showOriginal ? (
                <ChevronUp className="w-4 h-4 text-zinc-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              )}
            </button>
            {showOriginal && (
              <div className="px-3 pb-3 space-y-2">
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {message.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {message.email}
                  </span>
                  <span className="capitalize px-2 py-0.5 bg-zinc-800 rounded text-xs">
                    {message.type}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap bg-zinc-800/50 p-3 rounded">
                  {message.message}
                </p>
              </div>
            )}
          </div>

          {/* Previous replies */}
          {message.replies && message.replies.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-400">
                Previous Replies ({message.replies.length})
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {message.replies.map((reply, index) => (
                  <div
                    key={index}
                    className="bg-primary/10 border border-primary/20 rounded-lg p-3"
                  >
                    <p className="text-xs text-zinc-500 mb-1">
                      {new Date(reply.sentAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reply input */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Your Reply
            </label>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={6}
              maxLength={5000}
              placeholder="Type your reply here..."
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-primary transition-colors resize-none"
            />
            <p className="text-xs text-zinc-500 mt-1 text-right">
              {replyContent.length}/5000 characters
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            variant="brand"
            onClick={handleSendReply}
            disabled={isSending || replyContent.trim().length < 10}
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Reply
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// View message dialog
export function ViewMessageDialog({ message, open, onOpenChange }) {
  const [showReplyDialog, setShowReplyDialog] = useState(false);

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

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Message from {message.name}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {message.email}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium border ${
                    typeColors[message.type]
                  }`}
                >
                  {message.type}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    statusColors[message.status]
                  }`}
                >
                  {message.status}
                </span>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {/* Timestamp */}
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Clock className="w-3 h-3" />
              Received on {new Date(message.createdAt).toLocaleString()}
            </div>

            {/* Message content */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <p className="text-zinc-300 whitespace-pre-wrap">{message.message}</p>
            </div>

            {/* Replies */}
            {message.replies && message.replies.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <Reply className="w-4 h-4" />
                  Replies ({message.replies.length})
                </p>
                <div className="space-y-2">
                  {message.replies.map((reply, index) => (
                    <div
                      key={index}
                      className="bg-primary/10 border border-primary/20 rounded-lg p-4"
                    >
                      <p className="text-xs text-zinc-500 mb-2">
                        Sent on {new Date(reply.sentAt).toLocaleString()}
                      </p>
                      <p className="text-zinc-300 whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              variant="brand"
              onClick={() => {
                onOpenChange(false);
                setShowReplyDialog(true);
              }}
            >
              <Reply className="w-4 h-4 mr-2" />
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ReplyMessageDialog
        message={message}
        open={showReplyDialog}
        onOpenChange={setShowReplyDialog}
      />
    </>
  );
}

// Message row actions
export function MessageActions({ message }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReplyDialog, setShowReplyDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReplyDialog(true)}
          className="h-8 w-8 p-0 text-zinc-400 hover:text-primary"
          title="Reply"
        >
          <Reply className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="h-8 w-8 p-0 text-zinc-400 hover:text-red-400"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <DeleteMessageDialog
        message={message}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
      <ReplyMessageDialog
        message={message}
        open={showReplyDialog}
        onOpenChange={setShowReplyDialog}
      />
    </>
  );
}
