"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getToken } from "@/lib/auth";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
    }

    const checkTimer = window.setTimeout(() => setIsChecking(false), 0);

    return () => window.clearTimeout(checkTimer);
  }, [router]);

  if (isChecking) {
    return null;
  }

  return children;
}
