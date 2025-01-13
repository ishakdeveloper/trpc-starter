"use client";
import Image from "next/image";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { data, isLoading, error } = trpc.hello.useQuery();

  return (
    <div>
      <h1>{data} </h1>
    </div>
  );
}
