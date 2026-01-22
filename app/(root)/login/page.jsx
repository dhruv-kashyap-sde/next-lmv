"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/AuthContext";
import { ArrowLeft, Loader2, Mail, KeyRound, CheckCircle2, X } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";
  const redirectUrl = searchParams.get("redirect");
  const message = searchParams.get("message");
  const { checkAuth } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  // Show message from URL params (e.g., "Please login to claim voucher")
  useEffect(() => {
    if (message === "login_required") {
      setInfoMessage("Please login to claim voucher");
    }
  }, [message]);

  // Forgot Password State
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiresIn, setOtpExpiresIn] = useState(600);
  
  const otpInputRefs = useRef([]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // OTP expiry timer
  useEffect(() => {
    if (forgotStep === 2 && otpExpiresIn > 0) {
      const timer = setTimeout(() => setOtpExpiresIn(otpExpiresIn - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [forgotStep, otpExpiresIn]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  // OTP Input Handlers
  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setForgotError("");
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
      setOtp(newOtp);
      const lastIndex = Math.min(pastedData.length - 1, 5);
      otpInputRefs.current[lastIndex]?.focus();
    }
  };

  // Forgot Password Handlers
  const openForgotPassword = () => {
    setForgotPasswordOpen(true);
    setForgotStep(1);
    setForgotEmail("");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmNewPassword("");
    setForgotError("");
    setResendCooldown(0);
    setOtpExpiresIn(600);
  };

  const closeForgotPassword = () => {
    setForgotPasswordOpen(false);
    setForgotStep(1);
    setForgotError("");
  };

  // Step 1: Send OTP
  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setForgotStep(2);
        setOtp(["", "", "", "", "", ""]);
        setOtpExpiresIn(data.expiresIn || 600);
        setResendCooldown(60);
      } else {
        setForgotError(data.error || "Failed to send verification code");
        if (data.retryAfter) {
          setResendCooldown(data.retryAfter);
        }
      }
    } catch (err) {
      setForgotError("An error occurred. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyForgotOtp = async (e) => {
    e.preventDefault();
    setForgotError("");

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setForgotError("Please enter the complete 6-digit code");
      return;
    }

    setForgotLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp: otpCode }),
      });

      const data = await response.json();

      if (data.success) {
        setForgotStep(3);
      } else {
        setForgotError(data.error || "Invalid verification code");
      }
    } catch (err) {
      setForgotError("An error occurred. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotError("");

    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setForgotError("Password must be at least 8 characters long");
      return;
    }

    setForgotLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, password: newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setForgotStep(4);
      } else {
        setForgotError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setForgotError("An error occurred. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Resend OTP
  const handleResendForgotOtp = async () => {
    if (resendCooldown > 0) return;
    setForgotError("");
    setForgotLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setOtp(["", "", "", "", "", ""]);
        setOtpExpiresIn(data.expiresIn || 600);
        setResendCooldown(60);
      } else {
        setForgotError(data.error || "Failed to resend code");
        if (data.retryAfter) {
          setResendCooldown(data.retryAfter);
        }
      }
    } catch (err) {
      setForgotError("Failed to resend code. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          isAdmin,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Login successful, updating auth context...", data.user);

        // Update AuthContext with new user data
        await checkAuth();

        // Small delay to ensure state updates
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Redirect based on role
        if (data.user.role === "admin") {
          console.log("Redirecting to admin dashboard");
          router.push("/admin/dashboard");
        } else if (redirectUrl) {
          // Redirect to the original page if specified
          router.push(redirectUrl);
        } else {
          router.push("/");
        }
      } else {
        setError(data.error || "Failed to login");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signIn("google", {
        callbackUrl: "/auth-callback",
        redirect: true,
      });
    } catch (err) {
      setError("Failed to sign in with Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-12">
      <div className="bg-white/5 backdrop-blur-md p-8 rounded-lg border border-white/20 max-w-md w-full">
        <h1 className="text-4xl font-bebas text-center text-primary mb-2">
          {isAdmin ? "Admin Login" : "Welcome Back"}
        </h1>
        <p className="text-center text-gray-300 mb-6">
          {isAdmin ? "Access your admin dashboard" : "Log in to claim vouchers"}
        </p>

        {infoMessage && (
          <div className="bg-blue-500/20 border border-blue-500/50 text-blue-200 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {infoMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-400"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-end -mt-4">
            <Button 
              type="button" 
              variant="link" 
              size="sm"
              onClick={openForgotPassword}
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            variant="brand"
          >
            {loading ? (
              <>
                <Spinner /> Loggin In
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        {!isAdmin && (
          <>
            <div className="mt-6">
              <div className="relative w-full">
                <div className=" flex justify-center items-center text-sm ">
                  <div className="w-full">
                    <Separator
                      className="bg-input"
                      orientation="horizontal"
                    ></Separator>
                  </div>
                  <span className="px-2 whitespace-nowrap ">
                    Or continue with
                  </span>
                  <div className="w-full">
                    <Separator className="bg-input" orientation="horizontal" />
                  </div>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full mt-4 bg-white hover:bg-gray-100 text-black font-semibold flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-primary hover:underline font-semibold"
              >
                Sign up
              </Link>
            </p>
          </>
        )}

        {/* {!isAdmin && (
          <p className="mt-4 text-center text-sm text-gray-400">
            <Link href="/login?admin=true" className="text-primary hover:underline">
              Admin Login
            </Link>
          </p>
        )} */}
      </div>

      {/* Forgot Password AlertDialog */}
      <AlertDialog open={forgotPasswordOpen}>
        <AlertDialogContent 
          className="bg-zinc-900 border-zinc-800 max-w-md"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          {/* Close button - only show on step 1 or step 4 */}
          {(forgotStep === 1 || forgotStep === 4) && (
            <button
              onClick={closeForgotPassword}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}

          {/* Step 1: Enter Email */}
          {forgotStep === 1 && (
            <>
              <AlertDialogHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <AlertDialogTitle className="text-center text-xl">
                  Forgot Password?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-gray-400">
                  Enter your email address and we&apos;ll send you a verification code.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {forgotError && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded text-sm">
                  {forgotError}
                </div>
              )}

              <form onSubmit={handleSendForgotOtp} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      setForgotError("");
                    }}
                    className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeForgotPassword}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={forgotLoading || !forgotEmail}
                    className="flex-1"
                    variant="brand"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Code"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 2: Enter OTP */}
          {forgotStep === 2 && (
            <>
              <AlertDialogHeader>
                <button
                  onClick={() => setForgotStep(1)}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2 text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center">
                    <KeyRound className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <AlertDialogTitle className="text-center text-xl">
                  Enter Verification Code
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-gray-400">
                  We sent a 6-digit code to<br />
                  <span className="text-primary font-semibold">{forgotEmail}</span>
                </AlertDialogDescription>
              </AlertDialogHeader>

              {forgotError && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded text-sm">
                  {forgotError}
                </div>
              )}

              <form onSubmit={handleVerifyForgotOtp} className="space-y-4 mt-4">
                {/* OTP Input */}
                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 h-12 text-center text-xl font-bold bg-white/5 border border-white/20 rounded-lg text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {/* Timer */}
                <div className="text-center text-sm">
                  {otpExpiresIn > 0 ? (
                    <p className="text-gray-400">
                      Code expires in <span className="text-primary font-semibold">{formatTime(otpExpiresIn)}</span>
                    </p>
                  ) : (
                    <p className="text-red-400">Code expired. Please request a new one.</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={forgotLoading || otp.join("").length !== 6 || otpExpiresIn === 0}
                  className="w-full"
                  variant="brand"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
              </form>

              {/* Resend */}
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-sm">
                  Didn&apos;t receive the code?{" "}
                  {resendCooldown > 0 ? (
                    <span className="text-gray-500">Resend in {resendCooldown}s</span>
                  ) : (
                    <button
                      onClick={handleResendForgotOtp}
                      disabled={forgotLoading}
                      className="text-primary hover:underline font-semibold"
                    >
                      Resend Code
                    </button>
                  )}
                </p>
              </div>
            </>
          )}

          {/* Step 3: New Password */}
          {forgotStep === 3 && (
            <>
              <AlertDialogHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center">
                    <KeyRound className="w-7 h-7 text-green-400" />
                  </div>
                </div>
                <AlertDialogTitle className="text-center text-xl">
                  Create New Password
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-gray-400">
                  Your identity has been verified. Set a new password.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {forgotError && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded text-sm">
                  {forgotError}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <Input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setForgotError("");
                    }}
                    className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => {
                      setConfirmNewPassword(e.target.value);
                      setForgotError("");
                    }}
                    className="w-full bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                    placeholder="••••••••"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
                <Button
                  type="submit"
                  disabled={forgotLoading || !newPassword || !confirmNewPassword}
                  className="w-full"
                  variant="brand"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </>
          )}

          {/* Step 4: Success */}
          {forgotStep === 4 && (
            <>
              <AlertDialogHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-green-400" />
                  </div>
                </div>
                <AlertDialogTitle className="text-center text-xl">
                  Password Reset Successful!
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-gray-400">
                  Your password has been reset successfully. You can now log in with your new password.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Button
                onClick={closeForgotPassword}
                className="w-full mt-4"
                variant="brand"
              >
                Back to Login
              </Button>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-lg border border-white/20 max-w-md w-full">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
