"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Spinner } from "@/components/ui/spinner";

interface AppShellProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AppShell({ children, requireAuth = true }: AppShellProps) {
  const { isAuthenticated, isLoading, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, requireAuth, router, userId]);

  if (isLoading && requireAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 mt-16 flex items-center justify-center">
          <Spinner />
          <span className="ml-2">Verificando autenticação...</span>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        {children}
      </main>

      <Footer />
    </div>
  );
}
