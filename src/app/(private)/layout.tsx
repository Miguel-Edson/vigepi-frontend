"use client";

import { useEffect, useState } from "react";
import { UnauthorizedWarning } from "@/modules/auth/components/UnauthorizedWarning";
import { Navbar } from "@/components/layout/NavBar";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = sessionStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <UnauthorizedWarning />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <Navbar/>
      <main>
        {children}
      </main>
    </div>
  );
}