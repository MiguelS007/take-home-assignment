"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <AppShell>
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>

        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-lg font-medium text-gray-900">
            Welcome to User Management System
          </h2>
          <p className="mt-2 text-gray-600">
            Hello, {user?.firstName} {user?.lastName}! You are now logged in.
          </p>

          <div className="mt-6">
            <p className="text-gray-600">Quick links:</p>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href="/users"
                className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-4 border border-gray-200 text-center"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  Manage Users
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  View, create, update, and delete users
                </p>
              </Link>

              <Link
                href="/profile"
                className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg p-4 border border-gray-200 text-center"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  Your Profile
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  View and edit your personal information
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
