"use client";
import { usePathname } from 'next/navigation';
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // Routes where navbar and footer should be hidden
  const dashboardRoutes = ['/dashboard', '/admin/dashboard', '/admin'];
  const isDashboardRoute = dashboardRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      {children}
      {!isDashboardRoute && <Footer />}
    </>
  );
}
