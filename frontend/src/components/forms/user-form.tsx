import { useState } from "react";
import Link from "next/link";

interface UserFormData {
  email: string;
  name: string;
  password?: string;
}

interface UserFormProps {
  initialData?: UserFormData;
  isLoading: boolean;
  onSubmit: (data: UserFormData) => Promise<void>;
  isEdit?: boolean;
}

export function UserForm({
  initialData,
  isLoading,
  onSubmit,
  isEdit = false,
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    email: initialData?.email || "",
    name: initialData?.name || "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = { ...formData };
    if (isEdit && !submitData.password) {
      delete submitData.password;
    }

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-400 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <div className="mt-1">
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-400 rounded-md"
            />
          </div>
        </div>

        <div className="sm:col-span-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password{" "}
            {isEdit && (
              <span className="text-xs text-gray-500">
                (Leave blank to keep current password)
              </span>
            )}
          </label>
          <div className="mt-1">
            <input
              type="password"
              name="password"
              id="password"
              required={!isEdit}
              value={formData.password}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-400 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Link
          href="/users"
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
