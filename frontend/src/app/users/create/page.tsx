"use client";

import { AppShell } from "@/components/layout/app-shell";
import { UserForm } from "@/components/forms/user-form";
import { useMutation } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateUser() {
  const router = useRouter();

  const createUserMutation = useMutation({
    mutationFn: usersService.create,
    onSuccess: () => {
      toast.success("User created successfully");
      router.push("/users");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    },
  });

  const handleSubmit = async (formData: any) => {
    await createUserMutation.mutateAsync(formData);
  };

  return (
    <AppShell>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="pb-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create User</h1>
          <p className="mt-1 text-sm text-gray-500">
            Add a new user to the system.
          </p>
        </div>

        <div className="mt-6">
          <UserForm
            onSubmit={handleSubmit}
            isLoading={createUserMutation.isPending}
          />
        </div>
      </div>
    </AppShell>
  );
}
