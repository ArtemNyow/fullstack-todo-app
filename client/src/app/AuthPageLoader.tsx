"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const AuthForm = dynamic(() => import("./components/AuthForm"), {
  ssr: false,
  loading: () => <main className="auth-loading" aria-busy="true" />,
});

export default function AuthPageLoader(props: ComponentProps<typeof AuthForm>) {
  return <AuthForm {...props} />;
}
