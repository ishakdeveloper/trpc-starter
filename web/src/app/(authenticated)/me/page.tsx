"use client";

import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  const { data: user, isLoading } = trpc.me.useQuery();
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Not logged in</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-lg">{user.user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Username</p>
            <p className="text-lg">{user.user.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Member since</p>
            <p className="text-lg">
              {new Date(user.user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
