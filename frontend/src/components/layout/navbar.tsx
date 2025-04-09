"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          User Management
        </Link>

        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <Link href="/users" className="text-gray-600 hover:text-blue-600">
                Users
              </Link>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-blue-600"
              >
                Profile ({user?.firstName || "User"})
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-blue-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                href="/register"
                className="text-gray-600 hover:text-blue-600"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
