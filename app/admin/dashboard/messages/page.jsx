import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { MessagesFilter, MessagesPagination } from "./MessagesFilter";
import MessagesTable from "./MessagesTable";
import connectDB from "@/lib/mongodb";
import Message from "@/models/Message";
import { verifyToken } from "@/lib/jwt";

// Fetch messages directly from database (server-side)
async function getMessages(searchParams) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
      return { error: "Not authenticated", messages: [], stats: {}, pagination: {} };
    }

    // Verify token and check admin role
    const decoded = verifyToken(authToken);
    if (!decoded || decoded.role !== "admin") {
      return { error: "Unauthorized access", messages: [], stats: {}, pagination: {} };
    }

    await connectDB();

    // Build query from search params
    const query = {};
    if (searchParams?.type && searchParams.type !== "all") {
      query.type = searchParams.type;
    }
    if (searchParams?.status && searchParams.status !== "all") {
      query.status = searchParams.status;
    }

    // Build sort
    const sortBy = searchParams?.sortBy || "createdAt";
    const sortOrder = searchParams?.sortOrder || "desc";
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    // Pagination
    const page = parseInt(searchParams?.page) || 1;
    const limit = 20;

    // Get total count
    const total = await Message.countDocuments(query);

    // Fetch messages
    const messages = await Message.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get stats
    const statsAggregation = await Message.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      new: 0,
      read: 0,
      replied: 0,
      total: total,
    };

    statsAggregation.forEach((s) => {
      stats[s._id] = s.count;
    });

    // Convert _id to string for serialization
    const serializedMessages = messages.map((msg) => ({
      ...msg,
      _id: msg._id.toString(),
      createdAt: msg.createdAt?.toISOString(),
      updatedAt: msg.updatedAt?.toISOString(),
      replies: msg.replies?.map((reply) => ({
        ...reply,
        _id: reply._id?.toString(),
        sentAt: reply.sentAt?.toISOString(),
        sentBy: reply.sentBy?.toString(),
      })),
    }));

    return {
      messages: serializedMessages,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { error: "Failed to fetch messages", messages: [], stats: {}, pagination: {} };
  }
}

export default async function Messages({ searchParams }) {
  const resolvedParams = await searchParams;
  const { messages, stats, pagination, error } = await getMessages(resolvedParams);

  const statCards = [
    {
      label: "Total Messages",
      value: stats.total || 0,
      icon: Inbox,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "New",
      value: stats.new || 0,
      icon: AlertCircle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Read",
      value: stats.read || 0,
      icon: Mail,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Replied",
      value: stats.replied || 0,
      icon: CheckCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
  ];

  return (
    <>
      <DashboardNavbar title="Messages Management" />
      
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-zinc-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <MessagesFilter />

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Messages Table */}
        {!error && messages.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-12 text-center">
            <Inbox className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-400 mb-2">No messages yet</h3>
            <p className="text-zinc-500">
              Messages from your contact form will appear here.
            </p>
          </div>
        ) : (
          <>
            <MessagesTable messages={messages} />
            <MessagesPagination pagination={pagination} />
          </>
        )}
      </div>
    </>
  );
}

