"use client";

import { AppShell } from "@/components/layout/app-shell";
import { UserForm } from "@/components/forms/user-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";
import { useRouter, useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";
import React from "react";

export default function EditUser() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const params = useParams();
  const userId = params.id as string;

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => usersService.getById(userId),
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: unknown) => usersService.update(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully");
      router.push("/users");
    },
    onError: (error: unknown) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });

  const handleSubmit = async (formData: unknown) => {
    await updateUserMutation.mutateAsync(formData);
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="pb-5 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
          <p className="mt-1 text-sm text-gray-500">Update user information.</p>
        </div>

        <div className="mt-6">
          {user && (
            <UserForm
              initialData={{
                email: user.email,
                name: user.name,
              }}
              onSubmit={handleSubmit}
              isLoading={updateUserMutation.isPending}
              isEdit={true}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}
