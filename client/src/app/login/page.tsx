"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { login, register } from "@/services/authService";
import { setToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      isRegister ? register({ email, password }) : login({ email, password }),

    onSuccess: (data) => {
      setToken(data.token);
      router.push("/");
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate();
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>{isRegister ? "Create account" : "Welcome back"}</h1>

        <p className="auth-subtitle">
          {isRegister
            ? "Create your account to manage your tasks."
            : "Sign in to continue to your tasks."}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {mutation.isError && (
            <p className="error-message">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Something went wrong"}
            </p>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Loading..."
              : isRegister
                ? "Create account"
                : "Login"}
          </button>
        </form>

        <button
          className="auth-switch"
          type="button"
          onClick={() => {
            setIsRegister((current) => !current);
            mutation.reset();
          }}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </section>
    </main>
  );
}
