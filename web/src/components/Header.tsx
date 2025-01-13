"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";

export function Header() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data: user } = trpc.me.useQuery();

  const { mutate: logout } = trpc.logout.useMutation({
    onSuccess: () => {
      utils.me.setData(undefined, undefined);
      window.location.href = "/login";
    },
  });

  const handleLogout = async () => {
    await logout({});
  };

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold">
          App
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span>{user.user.name || user.user.email}</span>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button variant="ghost" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
