import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Message from '@/models/Message';

// In-memory rate limiting store (for serverless, consider using Redis in production)
const rateLimitStore = new Map();

// Rate limit configuration
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute window
  maxRequests: 2, // Max 2 requests per window per IP
  blockDuration: 5 * 60 * 1000, // Block for 5 minutes after exceeding limit
};

// Clean up old entries periodically
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.firstRequest > RATE_LIMIT.windowMs + RATE_LIMIT.blockDuration) {
      rateLimitStore.delete(key);
    }
  }
}

// Check rate limit
function checkRateLimit(ip) {
  cleanupRateLimitStore();
  
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now, blocked: false });
    return { allowed: true };
  }
  
  // Check if blocked
  if (record.blocked) {
    const blockTimeLeft = (record.blockedAt + RATE_LIMIT.blockDuration) - now;
    if (blockTimeLeft > 0) {
      return { 
        allowed: false, 
        retryAfter: Math.ceil(blockTimeLeft / 1000),
        reason: 'BLOCKED' 
      };
    }
    // Block expired, reset
    rateLimitStore.set(ip, { count: 1, firstRequest: now, blocked: false });
    return { allowed: true };
  }
  
  // Check if window expired
  if (now - record.firstRequest > RATE_LIMIT.windowMs) {
    rateLimitStore.set(ip, { count: 1, firstRequest: now, blocked: false });
    return { allowed: true };
  }
  
  // Within window, increment count
  record.count++;
  
  if (record.count > RATE_LIMIT.maxRequests) {
    record.blocked = true;
    record.blockedAt = now;
    return { 
      allowed: false, 
      retryAfter: Math.ceil(RATE_LIMIT.blockDuration / 1000),
      reason: 'RATE_LIMITED' 
    };
  }
  
  return { allowed: true };
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input (basic XSS prevention)
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// POST - Create new message (Public endpoint with rate limiting)
export async function POST(request) {
  try {
    // Get client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Check rate limit
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: rateLimitResult.reason === 'BLOCKED' 
            ? 'Too many requests. Please try again later.' 
            : 'Rate limit exceeded. Please wait before sending another message.',
          code: rateLimitResult.reason,
          retryAfter: rateLimitResult.retryAfter,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter),
          }
        }
      );
    }
    
    const body = await request.json();
    const { name, email, message, type, honeypot } = body;
    
    // Honeypot check - if filled, it's likely a bot
    if (honeypot) {
      // Silently accept to not reveal the trap, but don't save
      return NextResponse.json({
        success: true,
        message: 'Thank you for your message!',
      });
    }
    
    // Validation
    if (!name || !email || !message || !type) {
      return NextResponse.json(
        { success: false, error: 'All fields are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }
    
    // Name validation
    const sanitizedName = sanitizeInput(name);
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name must be between 2 and 100 characters', code: 'INVALID_NAME' },
        { status: 400 }
      );
    }
    
    // Email validation
    const sanitizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }
    
    // Message validation
    const sanitizedMessage = sanitizeInput(message);
    if (sanitizedMessage.length < 10 || sanitizedMessage.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Message must be between 10 and 2000 characters', code: 'INVALID_MESSAGE' },
        { status: 400 }
      );
    }
    
    // Type validation
    const validTypes = ['feedback', 'question', 'help', 'bug', 'other'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid message type', code: 'INVALID_TYPE' },
        { status: 400 }
      );
    }
    
    await connectDB();
    
    // Additional DB-level rate limiting - check if same email sent message in last 5 minutes
    const recentMessage = await Message.findOne({
      email: sanitizedEmail,
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) }
    }).select('_id');
    
    if (recentMessage) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'You have already sent a message recently. Please wait a few minutes.',
          code: 'EMAIL_RATE_LIMITED',
          retryAfter: 300, // 5 minutes
        },
        { status: 429 }
      );
    }
    
    // Create message
    const newMessage = await Message.create({
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      type,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
    });
    
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: {
        id: newMessage._id,
        type: newMessage.type,
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message. Please try again.', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
