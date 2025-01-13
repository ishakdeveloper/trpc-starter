"use client";
import { redirect, usePathname } from "next/navigation";
import { FullScreenLoading } from "@/components/FullScreenLoading";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

const publicPaths = ["/", "/check-email", "/forgot-password"];
const publicPathsStartWiths = [
  "/confirm-email/",
  "/accept-invite/",
  "/set-password/",
];

function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPath =
    publicPaths.includes(pathname) ||
    publicPathsStartWiths.some((p) => pathname.startsWith(p));
  const { data, isLoading } = trpc.me.useQuery(undefined, {
    enabled: !isPublicPath,
  });

  useEffect(() => {
    if (
      !isPublicPath &&
      !isLoading &&
      !data?.user &&
      pathname !== "/login" &&
      pathname !== "/register"
    ) {
      redirect("/login");
    }
  }, [pathname, isLoading]);

  useEffect(() => {
    if (data?.user && (pathname === "/login" || pathname === "/register")) {
      redirect(`/me`);
    }
  }, [pathname, isLoading]);

  if (isLoading) {
    return <FullScreenLoading />;
  }

  return <>{children}</>;
}

export default Template;
