"use client";

import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";

export default function Home() {
  return (
    <AppShell requireAuth={false}>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              User Management System
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A full-stack application built with Next.js and NestJS for
              efficient user management.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/login"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Get started
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Register <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
