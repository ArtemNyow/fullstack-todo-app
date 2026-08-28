"use client";

import type { ComponentProps } from "react";

import AuthForm from "./components/AuthForm";

export default function AuthPageLoader(props: ComponentProps<typeof AuthForm>) {
  return <AuthForm {...props} />;
}
