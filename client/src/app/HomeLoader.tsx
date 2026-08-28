"use client";

import dynamic from "next/dynamic";

const HomeClient = dynamic(() => import("./HomeClient"), {
  ssr: false,
  loading: () => <main className="auth-loading" aria-busy="true" />,
});

export default function HomeLoader() {
  return <HomeClient />;
}
